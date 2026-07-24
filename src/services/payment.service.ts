import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import PaymentRepository from '../repositories/payment.repository';
import OrderRepository from '../repositories/order.repository';
import CustomerRepository from '../repositories/customer.repository';
import { PaymentGatewayFactory } from './gateways/payment.gateway';
import {
  CapturePaymentDto,
  CreatePaymentDto,
  PaymentGatewayProvider,
  PaymentQuery,
  RefundPaymentDto,
  RetryPaymentDto,
  SettlementQuery,
  ReconciliationQuery,
  VerifyPaymentDto
} from '../interfaces/payment.dto';

function generateUniqueNumber(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function normalizeProvider(provider: string): PaymentGatewayProvider {
  const key = provider?.toString().toUpperCase();
  return (['RAZORPAY', 'STRIPE', 'PAYPAL', 'CASHFREE', 'PHONEPE', 'PAYTM', 'OFFLINE'] as PaymentGatewayProvider[]).includes(key as PaymentGatewayProvider)
    ? (key as PaymentGatewayProvider)
    : 'OFFLINE';
}

export default class PaymentService {
  constructor(
    private repository: PaymentRepository,
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository
  ) {}

  async create(dto: CreatePaymentDto, actorId?: number, actorRole?: string) {
    const order = await this.orderRepository.findOrderById(dto.orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }

    if (order.customerId && actorId && actorRole && !['Admin', 'Finance Manager', 'Super Admin'].includes(actorRole) && actorId !== order.customerId) {
      throw new AppError('You are not authorized to create payment for this order', HTTP_STATUS.FORBIDDEN, 'ORDER_PAYMENT_FORBIDDEN');
    }

    const existingSuccessful = order.payments?.find((payment: any) =>
      ['CAPTURED', 'PAID', 'REFUNDED', 'PARTIALLY_REFUNDED'].includes(payment.status)
    );

    if (existingSuccessful) {
      throw new AppError('There is already a successful payment for this order', HTTP_STATUS.BAD_REQUEST, 'PAYMENT_ALREADY_EXISTS');
    }

    const amount = Number(dto.amount);
    const currency = dto.currency || order.currency || 'INR';
    const gateway = normalizeProvider(dto.gateway);
    const paymentPayload: Record<string, unknown> = {
      paymentNumber: generateUniqueNumber('PAY'),
      orderId: order.id,
      customerId: order.customerId ?? dto.customerId ?? null,
      gateway,
      paymentMethod: dto.paymentMethod,
      currency,
      exchangeRate: dto.exchangeRate ?? Number(order.exchangeRate ?? 1),
      amount,
      capturedAmount: 0,
      refundedAmount: 0,
      status: gateway === 'OFFLINE' ? 'PENDING' : 'PENDING',
      attemptCount: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const payment = await this.repository.createPayment(paymentPayload);
    await this.repository.createPaymentAuditLog({
      paymentId: payment.id,
      action: 'CREATE_PAYMENT',
      actorId: actorId ?? null,
      details: { orderId: order.id, gateway, amount, currency }
    });

    if (gateway !== 'OFFLINE') {
      const gatewayConfig = await this.repository.findPaymentGatewayByProvider(gateway);
      const gatewayInstance = PaymentGatewayFactory.getGateway(gateway, {
        apiKey: gatewayConfig?.apiKey,
        apiSecret: gatewayConfig?.apiSecret,
        webhookSecret: gatewayConfig?.webhookSecret
      });
      const gatewayResult = await gatewayInstance.createOrder({ orderId: order.id, amount, currency, metadata: dto.metadata });
      if (!gatewayResult.success) {
        await this.repository.updatePayment(payment.id, {
          status: 'FAILED',
          failureReason: gatewayResult.error ?? 'Payment gateway order creation failed',
          updatedAt: new Date()
        });
        await this.repository.createPaymentTransaction({
          paymentId: payment.id,
          type: 'AUTHORIZATION',
          amount,
          status: 'FAILED',
          gatewayReference: gatewayResult.gatewayReference,
          transactionReference: payment.paymentNumber,
          remark: gatewayResult.error
        });
        return await this.repository.findPaymentById(payment.id);
      }

      await this.repository.updatePayment(payment.id, {
        gatewayOrderId: gatewayResult.gatewayOrderId,
        gatewayReference: gatewayResult.gatewayReference,
        updatedAt: new Date()
      });
    }

    return await this.repository.findPaymentById(payment.id);
  }

  async verify(dto: VerifyPaymentDto, actorId?: number, actorRole?: string) {
    const payment = await this.repository.findPaymentById(dto.paymentId);
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND, 'PAYMENT_NOT_FOUND');
    }

    if (payment.status === 'CAPTURED' || payment.status === 'PAID') {
      return payment;
    }

    const gateway = normalizeProvider(payment.gateway);
    const gatewayConfig = await this.repository.findPaymentGatewayByProvider(gateway);
    const gatewayInstance = PaymentGatewayFactory.getGateway(gateway, {
      apiKey: gatewayConfig?.apiKey,
      apiSecret: gatewayConfig?.apiSecret,
      webhookSecret: gatewayConfig?.webhookSecret
    });
    const verifyResult = await gatewayInstance.verifyPayment({
      gatewayOrderId: payment.gatewayOrderId,
      gatewayPaymentId: dto.gatewayPaymentId,
      gatewaySignature: dto.gatewaySignature,
      transactionReference: dto.transactionReference,
      amount: dto.amount
    });

    const status = verifyResult.success ? verifyResult.status : 'FAILED';
    const capturedAmount = verifyResult.captured ? dto.amount : payment.capturedAmount ?? 0;

    const updatedPayment = await this.repository.updatePayment(payment.id, {
      status,
      capturedAmount,
      transactionReference: verifyResult.transactionReference ?? dto.transactionReference,
      gatewayPaymentId: verifyResult.gatewayPaymentId ?? dto.gatewayPaymentId,
      gatewayReference: verifyResult.gatewayReference ?? payment.gatewayReference,
      paidAt: verifyResult.success ? new Date() : payment.paidAt,
      updatedAt: new Date()
    });

    await this.repository.createPaymentTransaction({
      paymentId: payment.id,
      type: verifyResult.captured ? 'SALE' : 'AUTHORIZATION',
      amount: dto.amount,
      status,
      gatewayReference: updatedPayment.gatewayReference,
      transactionReference: updatedPayment.transactionReference,
      remark: verifyResult.message
    });

    await this.applyOrderPaymentStatus(updatedPayment, actorId, actorRole);
    await this.applyWalletPayment(updatedPayment);
    await this.generateInvoicePayment(updatedPayment);
    await this.repository.createPaymentAuditLog({
      paymentId: payment.id,
      action: 'VERIFY_PAYMENT',
      actorId: actorId ?? null,
      details: { verifyResult }
    });

    return updatedPayment;
  }

  async capture(dto: CapturePaymentDto, actorId?: number) {
    const payment = await this.repository.findPaymentById(dto.paymentId);
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND, 'PAYMENT_NOT_FOUND');
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new AppError('Only authorized payments can be captured', HTTP_STATUS.BAD_REQUEST, 'INVALID_PAYMENT_CAPTURE');
    }

    const gateway = normalizeProvider(payment.gateway);
    const gatewayConfig = await this.repository.findPaymentGatewayByProvider(gateway);
    const gatewayInstance = PaymentGatewayFactory.getGateway(gateway, {
      apiKey: gatewayConfig?.apiKey,
      apiSecret: gatewayConfig?.apiSecret,
      webhookSecret: gatewayConfig?.webhookSecret
    });

    const captureResult = await gatewayInstance.capturePayment({
      gatewayOrderId: payment.gatewayOrderId,
      gatewayPaymentId: payment.gatewayPaymentId,
      amount: dto.amount
    });

    if (!captureResult.success) {
      await this.repository.createPaymentTransaction({
        paymentId: payment.id,
        type: 'CAPTURE',
        amount: dto.amount ?? 0,
        status: 'FAILED',
        gatewayReference: captureResult.gatewayReference,
        transactionReference: captureResult.transactionReference,
        remark: captureResult.message
      });
      throw new AppError('Failed to capture payment', HTTP_STATUS.BAD_REQUEST, 'CAPTURE_FAILED');
    }

    const capturedAmount = Number(dto.amount ?? payment.capturedAmount ?? 0);
    const updatedPayment = await this.repository.updatePayment(payment.id, {
      status: 'CAPTURED',
      capturedAmount,
      paidAt: new Date(),
      updatedAt: new Date()
    });

    await this.repository.createPaymentTransaction({
      paymentId: payment.id,
      type: 'CAPTURE',
      amount: capturedAmount,
      status: 'CAPTURED',
      gatewayReference: captureResult.gatewayReference,
      transactionReference: captureResult.transactionReference,
      remark: captureResult.message
    });

    await this.applyOrderPaymentStatus(updatedPayment, actorId);
    await this.applyWalletPayment(updatedPayment);
    await this.generateInvoicePayment(updatedPayment);
    await this.repository.createPaymentAuditLog({
      paymentId: payment.id,
      action: 'CAPTURE_PAYMENT',
      actorId: actorId ?? null,
      details: { captureResult }
    });

    return updatedPayment;
  }

  async refund(dto: RefundPaymentDto, actorId?: number) {
    const payment = await this.repository.findPaymentById(dto.paymentId);
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND, 'PAYMENT_NOT_FOUND');
    }

    const refundAmount = Number(dto.amount);
    if (refundAmount <= 0 || refundAmount > Number(payment.capturedAmount ?? 0)) {
      throw new AppError('Refund amount must be valid and not exceed captured amount', HTTP_STATUS.BAD_REQUEST, 'INVALID_REFUND_AMOUNT');
    }

    const gateway = normalizeProvider(payment.gateway);
    const gatewayConfig = await this.repository.findPaymentGatewayByProvider(gateway);
    const gatewayInstance = PaymentGatewayFactory.getGateway(gateway, {
      apiKey: gatewayConfig?.apiKey,
      apiSecret: gatewayConfig?.apiSecret,
      webhookSecret: gatewayConfig?.webhookSecret
    });

    const refundResult = await gatewayInstance.refundPayment({
      gatewayPaymentId: payment.gatewayPaymentId,
      gatewayOrderId: payment.gatewayOrderId,
      amount: refundAmount,
      transactionReference: dto.transactionReference,
      reason: dto.reason
    });

    if (!refundResult.success) {
      await this.repository.createPaymentTransaction({
        paymentId: payment.id,
        type: 'REFUND',
        amount: refundAmount,
        status: 'FAILED',
        gatewayReference: refundResult.gatewayReference,
        transactionReference: refundResult.transactionReference,
        remark: refundResult.message
      });
      throw new AppError('Refund failed', HTTP_STATUS.BAD_REQUEST, 'REFUND_FAILED');
    }

    const updatedPayment = await this.repository.updatePayment(payment.id, {
      refundedAmount: Number(payment.refundedAmount ?? 0) + refundAmount,
      status: refundAmount < Number(payment.capturedAmount ?? 0) ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
      updatedAt: new Date()
    });

    await this.repository.createPaymentTransaction({
      paymentId: payment.id,
      type: 'REFUND',
      amount: refundAmount,
      status: updatedPayment.status,
      gatewayReference: refundResult.gatewayReference,
      transactionReference: refundResult.transactionReference,
      remark: refundResult.message
    });

    await this.applyOrderPaymentStatus(updatedPayment, actorId);
    await this.applyWalletRefund(updatedPayment, refundAmount);
    await this.repository.createPaymentAuditLog({
      paymentId: payment.id,
      action: 'REFUND_PAYMENT',
      actorId: actorId ?? null,
      details: { refundResult }
    });

    return updatedPayment;
  }

  async retry(dto: RetryPaymentDto, actorId?: number) {
    const payment = await this.repository.findPaymentById(dto.paymentId);
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND, 'PAYMENT_NOT_FOUND');
    }

    if (payment.status === 'CAPTURED' || payment.status === 'PAID') {
      throw new AppError('Captured payments cannot be retried', HTTP_STATUS.BAD_REQUEST, 'PAYMENT_NOT_RETRIABLE');
    }

    const gateway = normalizeProvider(payment.gateway);
    const gatewayConfig = await this.repository.findPaymentGatewayByProvider(gateway);
    const gatewayInstance = PaymentGatewayFactory.getGateway(gateway, {
      apiKey: gatewayConfig?.apiKey,
      apiSecret: gatewayConfig?.apiSecret,
      webhookSecret: gatewayConfig?.webhookSecret
    });

    const gatewayResult = await gatewayInstance.createOrder({ orderId: payment.orderId, amount: Number(payment.amount), currency: payment.currency, metadata: { retry: true } });
    const updatedPayment = await this.repository.updatePayment(payment.id, {
      gatewayOrderId: gatewayResult.gatewayOrderId,
      gatewayReference: gatewayResult.gatewayReference,
      attemptCount: Number(payment.attemptCount ?? 0) + 1,
      status: 'PENDING',
      updatedAt: new Date()
    });

    await this.repository.createPaymentAuditLog({
      paymentId: payment.id,
      action: 'RETRY_PAYMENT',
      actorId: actorId ?? null,
      details: { retryReason: dto.reason, gatewayResult }
    });

    return updatedPayment;
  }

  async list(query: PaymentQuery, currentCustomerId?: number) {
    if (currentCustomerId) {
      query.customerId = currentCustomerId;
    }
    return this.repository.listPayments(query);
  }

  async getById(id: number, currentCustomerId?: number) {
    const payment = await this.repository.findPaymentById(id);
    if (!payment) {
      throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND, 'PAYMENT_NOT_FOUND');
    }
    if (currentCustomerId && payment.customerId !== currentCustomerId) {
      throw new AppError('Access denied to this payment', HTTP_STATUS.FORBIDDEN, 'PAYMENT_ACCESS_DENIED');
    }
    return payment;
  }

  async getByOrderId(orderId: number, currentCustomerId?: number) {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    if (currentCustomerId && order.customerId !== currentCustomerId) {
      throw new AppError('Access denied to this order', HTTP_STATUS.FORBIDDEN, 'ORDER_ACCESS_DENIED');
    }
    return this.repository.findPaymentByOrderId(orderId);
  }

  async handleWebhook(provider: string, payload: any, headers: Record<string, unknown>) {
    const normalizedProvider = normalizeProvider(provider);
    const webhook = await this.repository.createPaymentWebhook({
      provider: normalizedProvider,
      eventType: payload.event || payload.type || 'UNKNOWN',
      payload,
      headers,
      verified: false,
      status: 'PENDING',
      receivedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const gatewayConfig = await this.repository.findPaymentGatewayByProvider(normalizedProvider);
    const gatewayInstance = PaymentGatewayFactory.getGateway(normalizedProvider, {
      apiKey: gatewayConfig?.apiKey,
      apiSecret: gatewayConfig?.apiSecret,
      webhookSecret: gatewayConfig?.webhookSecret
    });

    const signatureHeader = (headers['x-signature'] || headers['x-razorpay-signature'] || headers['stripe-signature'] || headers['x-paypal-transmission-sig']) as string | undefined;
    const verified = await gatewayInstance.verifyWebhookSignature(payload, signatureHeader);

    await this.repository.updatePaymentWebhook(webhook.id, {
      verified,
      status: verified ? 'PROCESSED' : 'FAILED',
      processedAt: new Date(),
      updatedAt: new Date()
    });

    if (!verified) {
      return { success: false, message: 'Webhook signature verification failed', webhookId: webhook.id };
    }

    const gatewayOrderId = payload.order_id || payload.orderId || payload.data?.order_id || payload.data?.orderId;
    const gatewayPaymentId = payload.payment_id || payload.paymentId || payload.data?.payment_id || payload.data?.paymentId;
    const payment = gatewayOrderId
      ? await this.repository.findPaymentByGatewayOrderId(String(gatewayOrderId))
      : gatewayPaymentId
        ? await this.repository.findPaymentByGatewayPaymentId(String(gatewayPaymentId))
        : null;

    if (payment) {
      const eventStatus = (payload.status || payload.event || '').toString().toUpperCase();
      let paymentStatus: string = payment.status;
      let transactionType = 'AUTHORIZATION';
      let amount = Number(payload.amount ?? payload.data?.amount ?? payment.amount);

      if (eventStatus.includes('PAID') || eventStatus.includes('CAPTURE')) {
        paymentStatus = 'CAPTURED';
        transactionType = 'SALE';
      } else if (eventStatus.includes('FAILED') || eventStatus.includes('ERROR')) {
        paymentStatus = 'FAILED';
        transactionType = 'AUTHORIZATION';
      } else if (eventStatus.includes('REFUND')) {
        paymentStatus = 'REFUNDED';
        transactionType = 'REFUND';
      }

      const updatedPayment = await this.repository.updatePayment(payment.id, {
        status: paymentStatus,
        gatewayPaymentId: payment.gatewayPaymentId ?? gatewayPaymentId,
        gatewayOrderId: payment.gatewayOrderId ?? gatewayOrderId,
        gatewayReference: payment.gatewayReference ?? payload.reference,
        paidAt: paymentStatus === 'CAPTURED' ? new Date() : payment.paidAt,
        updatedAt: new Date()
      });

      await this.repository.createPaymentTransaction({
        paymentId: payment.id,
        type: transactionType as any,
        amount,
        status: paymentStatus as any,
        gatewayReference: payload.reference || updatedPayment.gatewayReference,
        transactionReference: payload.transactionReference || payload.txn_id || gatewayPaymentId,
        remark: `Webhook event ${payload.event || payload.type || eventStatus}`
      });

      await this.applyOrderPaymentStatus(updatedPayment);
      await this.generateInvoicePayment(updatedPayment);
    }

    return { success: true, verified, webhookId: webhook.id };
  }

  async listSettlements(query: SettlementQuery) {
    return this.repository.listPaymentSettlements(query);
  }

  async listReconciliations(query: ReconciliationQuery) {
    return this.repository.listPaymentReconciliations(query);
  }

  private async applyOrderPaymentStatus(payment: any, actorId?: number, actorRole?: string) {
    if (!payment.orderId) return;
    const order = await this.orderRepository.findOrderById(payment.orderId);
    if (!order) return;

    let update: Record<string, unknown> = {};
    if (['CAPTURED', 'PAID'].includes(payment.status)) {
      update.paymentStatus = 'CAPTURED';
    }
    if (['FAILED'].includes(payment.status)) {
      update.paymentStatus = 'FAILED';
    }
    if (['REFUNDED', 'PARTIALLY_REFUNDED'].includes(payment.status)) {
      update.paymentStatus = 'REFUNDED';
    }

    if (Object.keys(update).length > 0) {
      update.updatedAt = new Date();
      await this.orderRepository.updateOrder(order.id, update);
      await this.orderRepository.createOrderAuditLog({
        orderId: order.id,
        action: 'PAYMENT_STATUS_UPDATED',
        actorId: actorId ?? null,
        details: { paymentId: payment.id, paymentStatus: payment.status }
      });
    }
  }

  private async generateInvoicePayment(payment: any) {
    if (!payment.orderId || payment.status !== 'CAPTURED') {
      return;
    }

    let invoice = await this.orderRepository.findInvoiceByOrderId(payment.orderId);
    if (!invoice) {
      invoice = await this.orderRepository.createInvoice({
        invoiceNumber: generateUniqueNumber('INV'),
        orderId: payment.orderId,
        invoiceStatus: 'ISSUED',
        gstAmount: Number(payment.order?.taxAmount ?? 0),
        cgst: 0,
        sgst: 0,
        igst: 0,
        discount: Number(payment.order?.discountAmount ?? 0),
        roundOff: Number(payment.order?.roundOff ?? 0),
        netAmount: Number(payment.order?.grandTotal ?? payment.amount),
        invoicePdfUrl: null
      } as any);
    }

    const invoicePayment = await this.repository.createInvoicePayment({
      invoiceId: invoice.id,
      paymentId: payment.id,
      amount: Number(payment.capturedAmount ?? payment.amount),
      status: 'PAID',
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (Number(invoice.netAmount) <= Number(invoicePayment.amount)) {
      await this.repository.updateInvoice(invoice.id, { invoiceStatus: 'PAID', updatedAt: new Date() });
    }
  }

  private async applyWalletPayment(payment: any) {
    if (payment.paymentMethod !== 'WALLET' || !payment.customerId || Number(payment.capturedAmount ?? 0) <= 0) {
      return;
    }

    const customer = await this.customerRepository.findById(payment.customerId);
    if (!customer) {
      return;
    }

    const currentBalance = Number(customer.walletBalance ?? 0);
    const paymentAmount = Number(payment.capturedAmount ?? 0);
    const updatedBalance = currentBalance - paymentAmount;

    await this.customerRepository.update(payment.customerId, { walletBalance: updatedBalance, updatedAt: new Date() } as any);
    await this.customerRepository.createWalletTransaction(payment.customerId, {
      type: 'DEBIT',
      amount: paymentAmount,
      reference: payment.paymentNumber,
      remarks: 'Wallet payment captured',
      balanceAfter: updatedBalance,
      createdAt: new Date()
    } as any);
  }

  private async applyWalletRefund(payment: any, refundAmount: number) {
    if (payment.paymentMethod !== 'WALLET' || !payment.customerId || refundAmount <= 0) {
      return;
    }

    const customer = await this.customerRepository.findById(payment.customerId);
    if (!customer) {
      return;
    }

    const currentBalance = Number(customer.walletBalance ?? 0);
    const updatedBalance = currentBalance + refundAmount;

    await this.customerRepository.update(payment.customerId, { walletBalance: updatedBalance, updatedAt: new Date() } as any);
    await this.customerRepository.createWalletTransaction(payment.customerId, {
      type: 'CREDIT',
      amount: refundAmount,
      reference: payment.paymentNumber,
      remarks: 'Wallet refund processed',
      balanceAfter: updatedBalance,
      createdAt: new Date()
    } as any);
  }
}
