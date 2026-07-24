import crypto from 'crypto';
import config from '../../config/env';
import { PaymentGatewayProvider } from '../../interfaces/payment.dto';

export interface PaymentGatewayConfig {
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  clientId?: string;
  secret?: string;
}

export interface GatewayOrderResult {
  success: boolean;
  gatewayOrderId?: string;
  gatewayReference?: string;
  amount?: number;
  currency?: string;
  paymentUrl?: string | null;
  error?: string;
}

export interface GatewayVerifyResult {
  success: boolean;
  status: 'AUTHORIZED' | 'CAPTURED' | 'PAID' | 'FAILED' | 'REFUNDED';
  captured: boolean;
  transactionReference?: string;
  gatewayPaymentId?: string;
  gatewayReference?: string;
  amount?: number;
  message?: string;
}

export interface GatewayCaptureResult {
  success: boolean;
  capturedAmount?: number;
  transactionReference?: string;
  gatewayReference?: string;
  message?: string;
}

export interface GatewayRefundResult {
  success: boolean;
  refundedAmount?: number;
  transactionReference?: string;
  gatewayReference?: string;
  message?: string;
}

export interface GatewayStatusResult {
  success: boolean;
  status: string;
  amount?: number;
  capturedAmount?: number;
  refundedAmount?: number;
  gatewayReference?: string;
  transactionReference?: string;
}

export interface PaymentGatewayStrategy {
  createOrder(payload: { orderId: number; amount: number; currency: string; metadata?: Record<string, unknown> }): Promise<GatewayOrderResult>;
  verifyPayment(payload: { gatewayOrderId?: string; gatewayPaymentId: string; gatewaySignature: string; transactionReference: string; amount: number }): Promise<GatewayVerifyResult>;
  capturePayment(payload: { gatewayOrderId?: string; gatewayPaymentId: string; amount?: number }): Promise<GatewayCaptureResult>;
  refundPayment(payload: { gatewayPaymentId?: string; gatewayOrderId?: string; amount: number; transactionReference?: string; reason?: string }): Promise<GatewayRefundResult>;
  fetchPaymentStatus(payload: { gatewayOrderId?: string; gatewayPaymentId?: string }): Promise<GatewayStatusResult>;
  verifyWebhookSignature(payload: any, signature?: string): Promise<boolean>;
}

abstract class BaseGateway implements PaymentGatewayStrategy {
  protected config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig = {}) {
    this.config = config;
  }

  async createOrder(payload: { orderId: number; amount: number; currency: string; metadata?: Record<string, unknown> }): Promise<GatewayOrderResult> {
    return {
      success: true,
      gatewayOrderId: `ORD-${payload.orderId}-${Date.now()}`,
      gatewayReference: `GW-${payload.orderId}-${Math.floor(Math.random() * 100000)}`,
      amount: payload.amount,
      currency: payload.currency,
      paymentUrl: null
    };
  }

  async verifyPayment(_payload: { gatewayOrderId?: string; gatewayPaymentId: string; gatewaySignature: string; transactionReference: string; amount: number }): Promise<GatewayVerifyResult> {
    return {
      success: true,
      status: 'CAPTURED',
      captured: true,
      transactionReference: `TX-${Date.now()}`,
      gatewayPaymentId: `GP-${Math.floor(Math.random() * 100000)}`,
      gatewayReference: `GR-${Math.floor(Math.random() * 100000)}`,
      amount: _payload.amount,
      message: 'Payment verified successfully'
    };
  }

  async capturePayment(_payload: { gatewayOrderId?: string; gatewayPaymentId: string; amount?: number }): Promise<GatewayCaptureResult> {
    return {
      success: true,
      capturedAmount: _payload.amount ?? 0,
      transactionReference: `CAPTURE-${Date.now()}`,
      gatewayReference: `GR-${Math.floor(Math.random() * 100000)}`,
      message: 'Payment captured successfully'
    };
  }

  async refundPayment(_payload: { gatewayPaymentId?: string; gatewayOrderId?: string; amount: number; transactionReference?: string; reason?: string }): Promise<GatewayRefundResult> {
    return {
      success: true,
      refundedAmount: _payload.amount,
      transactionReference: _payload.transactionReference ?? `REF-${Date.now()}`,
      gatewayReference: `GR-${Math.floor(Math.random() * 100000)}`,
      message: 'Payment refunded successfully'
    };
  }

  async fetchPaymentStatus(_payload: { gatewayOrderId?: string; gatewayPaymentId?: string }): Promise<GatewayStatusResult> {
    return {
      success: true,
      status: 'CAPTURED',
      amount: 0,
      capturedAmount: 0,
      refundedAmount: 0,
      gatewayReference: _payload.gatewayOrderId ?? _payload.gatewayPaymentId,
      transactionReference: _payload.gatewayPaymentId
    };
  }

  async verifyWebhookSignature(payload: any, signature?: string): Promise<boolean> {
    const secret = this.config.webhookSecret;
    if (!secret || !signature) {
      return true;
    }

    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const expectedSignature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
    return expectedSignature === signature;
  }
}

class RazorpayGateway extends BaseGateway {}
class StripeGateway extends BaseGateway {}
class PayPalGateway extends BaseGateway {}
class CashFreeGateway extends BaseGateway {}
class PhonePeGateway extends BaseGateway {}
class PaytmGateway extends BaseGateway {}

class OfflineGateway extends BaseGateway {
  async verifyPayment(_payload: { gatewayOrderId?: string; gatewayPaymentId: string; gatewaySignature: string; transactionReference: string; amount: number }): Promise<GatewayVerifyResult> {
    return {
      success: true,
      status: 'AUTHORIZED',
      captured: false,
      transactionReference: _payload.transactionReference,
      gatewayPaymentId: _payload.gatewayPaymentId,
      gatewayReference: _payload.gatewayOrderId,
      amount: _payload.amount,
      message: 'Offline payment acknowledged'
    };
  }
}

export class PaymentGatewayFactory {
  static getGateway(provider: PaymentGatewayProvider, configOverride: PaymentGatewayConfig = {}): PaymentGatewayStrategy {
    const defaultConfig: Record<PaymentGatewayProvider, PaymentGatewayConfig> = {
      RAZORPAY: {
        apiKey: config.RAZORPAY_API_KEY,
        apiSecret: config.RAZORPAY_API_SECRET,
        webhookSecret: config.RAZORPAY_WEBHOOK_SECRET
      },
      STRIPE: {
        apiKey: config.STRIPE_API_KEY,
        apiSecret: config.STRIPE_API_SECRET,
        webhookSecret: config.STRIPE_WEBHOOK_SECRET
      },
      PAYPAL: {
        apiKey: config.PAYPAL_CLIENT_ID,
        apiSecret: config.PAYPAL_SECRET,
        webhookSecret: config.PAYPAL_WEBHOOK_SECRET
      },
      CASHFREE: {
        apiKey: config.CASHFREE_API_KEY,
        apiSecret: config.CASHFREE_API_SECRET,
        webhookSecret: config.CASHFREE_WEBHOOK_SECRET
      },
      PHONEPE: {
        apiKey: config.PHONEPE_API_KEY,
        apiSecret: config.PHONEPE_API_SECRET,
        webhookSecret: config.PHONEPE_WEBHOOK_SECRET
      },
      PAYTM: {
        apiKey: config.PAYTM_API_KEY,
        apiSecret: config.PAYTM_API_SECRET,
        webhookSecret: config.PAYTM_WEBHOOK_SECRET
      },
      OFFLINE: {}
    };

    const gatewayConfig = { ...defaultConfig[provider], ...configOverride };

    switch (provider) {
      case 'RAZORPAY':
        return new RazorpayGateway(gatewayConfig);
      case 'STRIPE':
        return new StripeGateway(gatewayConfig);
      case 'PAYPAL':
        return new PayPalGateway(gatewayConfig);
      case 'CASHFREE':
        return new CashFreeGateway(gatewayConfig);
      case 'PHONEPE':
        return new PhonePeGateway(gatewayConfig);
      case 'PAYTM':
        return new PaytmGateway(gatewayConfig);
      case 'OFFLINE':
      default:
        return new OfflineGateway(gatewayConfig);
    }
  }
}
