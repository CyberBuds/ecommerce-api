import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import OrderRepository from '../repositories/order.repository';
import CartRepository from '../repositories/cart.repository';
import InventoryRepository from '../repositories/inventory.repository';
import ProductRepository from '../repositories/product.repository';
import CustomerRepository from '../repositories/customer.repository';
import {
  CreateOrderDto,
  CreateRefundDto,
  CreateReturnRequestDto,
  OrderListQuery,
  OrderStatusUpdateDto,
  UpdateOrderDto
} from '../interfaces/order.dto';

function generateUniqueNumber(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function roundValue(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateProfit(unitPrice: number, costPrice: number, quantity: number, discount: number, tax: number) {
  return roundValue(unitPrice * quantity - costPrice * quantity - discount + tax);
}

export function resolveOrderPaymentMethod(order: any): string | undefined {
  if (!order) return undefined;

  const latestPayment = Array.isArray(order.payments) && order.payments.length > 0
    ? [...order.payments].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0]
    : null;

  const candidate = latestPayment?.paymentMethod ?? order.paymentMethod ?? latestPayment?.gateway ?? undefined;
  if (!candidate) return undefined;

  const normalized = String(candidate).toUpperCase();

  if (normalized === 'COD') return 'CASH_ON_DELIVERY';
  if (normalized === 'CASH_ON_DELIVERY') return 'CASH_ON_DELIVERY';

  return candidate;
}

export default class OrderService {
  constructor(
    private repository: OrderRepository,
    private cartRepository: CartRepository,
    private inventoryRepository: InventoryRepository,
    private productRepository: ProductRepository,
    private customerRepository: CustomerRepository
  ) {}

  async create(dto: CreateOrderDto, actorId?: number) {
    const customerId = dto.customerId;
    const cart = dto.cartId
      ? await this.cartRepository.findCartById(dto.cartId)
      : customerId
        ? await this.cartRepository.findActiveCartByCustomer(customerId)
        : null;

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('Cart is empty or not found', HTTP_STATUS.BAD_REQUEST, 'EMPTY_CART');
    }

    const billingAddress = await this.customerRepository.findAddressById(dto.billingAddressId);
    const shippingAddress = await this.customerRepository.findAddressById(dto.shippingAddressId);

    if (!billingAddress) {
      throw new AppError('Billing address not found', HTTP_STATUS.NOT_FOUND, 'BILLING_ADDRESS_NOT_FOUND');
    }
    if (!shippingAddress) {
      throw new AppError('Shipping address not found', HTTP_STATUS.NOT_FOUND, 'SHIPPING_ADDRESS_NOT_FOUND');
    }

    const orderItems = await Promise.all(cart.items.map(async (item: any) => {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
      }
      const variant = item.variantId ? await this.productRepository.findVariantById(item.variantId) : null;
      const costPrice = Number(variant?.cost ?? product.costPrice ?? 0);
      const unitPrice = Number(item.unitPrice);
      const discount = Number(item.discount ?? 0);
      const tax = Number(item.tax ?? 0);
      const netAmount = roundValue(unitPrice * item.quantity - discount + tax);
      const profit = calculateProfit(unitPrice, costPrice, item.quantity, discount, tax);

      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        sku: item.variant?.sku ?? product.sku,
        productName: product.productName,
        variantName: item.variant?.variantCode ?? variant?.variantCode ?? null,
        quantity: item.quantity,
        unitPrice,
        discount,
        tax,
        netAmount,
        costPrice,
        profit,
        status: 'ACTIVE'
      };
    }));

    const subtotal = Number(cart.subtotal ?? 0);
    const discountAmount = Number(cart.discountAmount ?? 0);
    const couponDiscount = Number(cart.couponDiscount ?? 0);
    const shippingCharge = Number(cart.shippingCharge ?? 0);
    const taxAmount = Number(cart.taxAmount ?? 0);
    const roundOff = roundValue(cart.totalAmount ? Number(cart.totalAmount) - (subtotal - discountAmount - couponDiscount + shippingCharge + taxAmount) : 0);
    const grandTotal = roundValue(subtotal - discountAmount - couponDiscount + shippingCharge + taxAmount + roundOff);

    const order = await this.repository.createOrder({
      orderNumber: generateUniqueNumber('ORD'),
      customerId: customerId ?? null,
      billingAddressId: dto.billingAddressId,
      shippingAddressId: dto.shippingAddressId,
      orderType: dto.orderType ?? 'ONLINE',
      orderSource: dto.orderSource ?? 'WEB',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'PENDING',
      shippingMethodId: dto.shippingMethodId ?? null,
      deliverySlotId: dto.deliverySlotId ?? null,
      couponId: dto.couponId ?? cart.couponId ?? null,
      subtotal,
      discountAmount,
      couponDiscount,
      shippingCharge,
      taxAmount,
      roundOff,
      grandTotal,
      currency: dto.currency ?? 'INR',
      exchangeRate: dto.exchangeRate ?? 1,
      remarks: dto.remarks,
      placedBy: actorId ?? null,
      items: {
        create: orderItems
      }
    } as any);

    await this.repository.createStatusHistory({
      orderId: order.id,
      fromStatus: 'PENDING',
      toStatus: 'PENDING',
      changedBy: actorId ?? null,
      remark: 'Order created'
    });

    await this.repository.createTimelineEvent({
      orderId: order.id,
      eventType: 'ORDER_PLACED',
      description: `Order ${order.orderNumber} placed`,
    });

    if (cart.couponId && customerId) {
      await this.cartRepository.createCouponUsage({
        customerId,
        couponId: cart.couponId,
        orderId: order.id,
        discountAmount: couponDiscount
      });
    }

    await this.reserveCartInventory(order);
    await this.cartRepository.updateCart(cart.id, { status: 'COMPLETED' });

    return this.repository.findOrderById(order.id);
  }

  async list(query: OrderListQuery, currentCustomerId?: number) {
    if (currentCustomerId) {
      query.customerId = currentCustomerId;
    }
    const result = await this.repository.listOrders(query);
    return {
      ...result,
      items: (result.items || []).map((order: any) => ({
        ...order,
        paymentMethod: resolveOrderPaymentMethod(order)
      }))
    };
  }

  async getById(id: number, currentCustomerId?: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    if (currentCustomerId && order.customerId !== currentCustomerId) {
      throw new AppError('Access denied to this order', HTTP_STATUS.FORBIDDEN, 'ORDER_ACCESS_DENIED');
    }
    return {
      ...order,
      paymentMethod: resolveOrderPaymentMethod(order)
    };
  }

  async update(id: number, dto: UpdateOrderDto, actorId?: number) {
    const existing = await this.repository.findOrderById(id);
    if (!existing) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }

    const payload: Record<string, unknown> = {};
    if (dto.billingAddressId) payload.billingAddressId = dto.billingAddressId;
    if (dto.shippingAddressId) payload.shippingAddressId = dto.shippingAddressId;
    if (dto.shippingMethodId) payload.shippingMethodId = dto.shippingMethodId;
    if (dto.deliverySlotId) payload.deliverySlotId = dto.deliverySlotId;
    if (dto.remarks) payload.remarks = dto.remarks;
    if (dto.currency) payload.currency = dto.currency;
    if (dto.exchangeRate) payload.exchangeRate = dto.exchangeRate;
    payload.updatedAt = new Date();

    const updated = await this.repository.updateOrder(id, payload);
    await this.repository.createOrderAuditLog({
      orderId: id,
      action: 'UPDATE_ORDER',
      actorId: actorId ?? null,
      details: { payload }
    });
    return updated;
  }

  private async ensureCashOnDeliveryPayment(order: any) {
    const paymentMethod = resolveOrderPaymentMethod(order);
    if (paymentMethod !== 'CASH_ON_DELIVERY') {
      return null;
    }

    const existingPayment = Array.isArray(order.payments)
      ? order.payments.find((payment: any) => payment.paymentMethod === 'CASH_ON_DELIVERY')
      : null;

    if (existingPayment) {
      return existingPayment;
    }

    return this.repository.createPayment({
      paymentNumber: generateUniqueNumber('PAY'),
      orderId: order.id,
      customerId: order.customerId ?? null,
      gateway: 'OFFLINE',
      paymentMethod: 'CASH_ON_DELIVERY',
      currency: order.currency || 'INR',
      exchangeRate: order.exchangeRate ?? 1,
      amount: Number(order.grandTotal ?? 0),
      capturedAmount: 0,
      refundedAmount: 0,
      status: 'PENDING',
      attemptCount: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
  }

  private async ensureInvoiceForOrder(order: any) {
    const invoice = await this.repository.findInvoiceByOrderId(order.id);
    if (invoice) {
      return invoice;
    }

    return this.repository.createInvoice({
      invoiceNumber: generateUniqueNumber('INV'),
      orderId: order.id,
      invoiceStatus: 'ISSUED',
      gstAmount: Number(order.taxAmount ?? 0),
      cgst: 0,
      sgst: 0,
      igst: 0,
      discount: Number(order.discountAmount ?? 0) + Number(order.couponDiscount ?? 0),
      roundOff: Number(order.roundOff ?? 0),
      netAmount: Number(order.grandTotal ?? 0),
      invoicePdfUrl: null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);
  }

  async updateStatus(id: number, dto: OrderStatusUpdateDto, actorId?: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }

    if (order.orderStatus === dto.status) {
      return order;
    }

    const payload: Record<string, unknown> = { orderStatus: dto.status };
    if (dto.status === 'CONFIRMED') {
      await this.confirmOrderInventory(order);
      payload.paymentStatus = 'CAPTURED';
      payload.fulfillmentStatus = 'PROCESSING';
    }
    if (dto.status === 'CANCELLED') {
      await this.restoreOrderInventory(order);
      payload.paymentStatus = 'CANCELLED';
      payload.fulfillmentStatus = 'CANCELLED';
    }
    if (dto.status === 'DELIVERED') {
      payload.fulfillmentStatus = 'DELIVERED';
      const paymentMethod = resolveOrderPaymentMethod(order);
      if (paymentMethod === 'CASH_ON_DELIVERY') {
        payload.paymentStatus = 'CAPTURED';
        await this.ensureCashOnDeliveryPayment(order);
        await this.ensureInvoiceForOrder(order);
      }
      await this.awardLoyaltyPoints(order);
    }

    const updated = await this.repository.updateOrder(id, payload);
    await this.repository.createStatusHistory({
      orderId: id,
      fromStatus: order.orderStatus,
      toStatus: dto.status,
      changedBy: actorId ?? null,
      remark: dto.remark
    });
    await this.repository.createTimelineEvent({
      orderId: id,
      eventType: dto.status === 'CONFIRMED' ? 'ORDER_CONFIRMED' : dto.status === 'SHIPPED' ? 'ORDER_SHIPPED' : dto.status === 'OUT_FOR_DELIVERY' ? 'OUT_FOR_DELIVERY' : dto.status === 'DELIVERED' ? 'DELIVERED' : dto.status === 'CANCELLED' ? 'CANCELLED' : 'ORDER_PLACED',
      description: `Order status changed to ${dto.status}`
    });
    return updated;
  }

  async cancelOrder(id: number, actorId?: number) {
    return this.updateStatus(id, { status: 'CANCELLED' }, actorId);
  }

  async createReturnRequest(id: number, dto: CreateReturnRequestDto, actorId?: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    if (order.orderStatus !== 'DELIVERED') {
      throw new AppError('Return requests are only allowed for delivered orders', HTTP_STATUS.BAD_REQUEST, 'INVALID_RETURN_WINDOW');
    }

    const referenceDate = order.updatedAt ?? order.orderDate;
    const daysSince = Math.floor((new Date().getTime() - new Date(referenceDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 30) {
      throw new AppError('Return window has expired', HTTP_STATUS.BAD_REQUEST, 'RETURN_WINDOW_EXPIRED');
    }

    const orderItemsMap = new Map<number, any>(order.items.map((item: any) => [item.id, item]));
    dto.items.forEach((item) => {
      const orderItem = orderItemsMap.get(item.orderItemId);
      if (!orderItem) {
        throw new AppError('Return item does not belong to the order', HTTP_STATUS.BAD_REQUEST, 'INVALID_RETURN_ITEM');
      }
      if (item.quantity > orderItem.quantity) {
        throw new AppError('Return quantity exceeds ordered quantity', HTTP_STATUS.BAD_REQUEST, 'INVALID_RETURN_QUANTITY');
      }
    });

    const returnRequest = await this.repository.createReturnRequest({
      returnNumber: generateUniqueNumber('RET'),
      orderId: order.id,
      reason: dto.reason,
      items: {
        create: dto.items.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          reason: item.reason
        }))
      }
    } as any);

    await this.repository.createTimelineEvent({
      orderId: order.id,
      eventType: 'RETURN_REQUESTED',
      description: `Return requested for order ${order.orderNumber}`
    });
    await this.repository.createOrderAuditLog({
      orderId: order.id,
      action: 'CREATE_RETURN_REQUEST',
      actorId: actorId ?? null,
      details: { returnRequestId: returnRequest.id }
    });

    await this.repository.updateOrder(id, { orderStatus: 'RETURNED', fulfillmentStatus: 'RETURNED' });
    return returnRequest;
  }

  async createRefund(id: number, dto: CreateRefundDto, actorId?: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    if (dto.refundAmount <= 0 || dto.refundAmount > Number(order.grandTotal)) {
      throw new AppError('Invalid refund amount', HTTP_STATUS.BAD_REQUEST, 'INVALID_REFUND_AMOUNT');
    }
    if (order.paymentStatus === 'REFUNDED') {
      throw new AppError('Order has already been refunded', HTTP_STATUS.BAD_REQUEST, 'ORDER_ALREADY_REFUNDED');
    }
    if (!['CANCELLED', 'RETURNED', 'DELIVERED'].includes(order.orderStatus)) {
      throw new AppError('Refunds can only be processed for cancelled, returned, or delivered orders', HTTP_STATUS.BAD_REQUEST, 'INVALID_REFUND_STATUS');
    }

    const refund = await this.repository.createRefund({
      refundNumber: generateUniqueNumber('RFND'),
      orderId: order.id,
      refundMode: dto.refundMode,
      refundAmount: dto.refundAmount,
      transactionReference: dto.transactionReference,
      refundDate: dto.refundDate ? new Date(dto.refundDate) : new Date(),
      refundStatus: 'COMPLETED'
    } as any);

    await this.repository.updateOrder(order.id, { paymentStatus: 'REFUNDED', orderStatus: 'REFUNDED' });
    await this.repository.createTimelineEvent({
      orderId: order.id,
      eventType: 'REFUND_PROCESSED',
      description: `Refund processed for order ${order.orderNumber}`
    });
    await this.repository.createOrderAuditLog({
      orderId: order.id,
      action: 'CREATE_REFUND',
      actorId: actorId ?? null,
      details: { refundId: refund.id }
    });

    return refund;
  }

  async getTimeline(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    return {
      statusHistory: order.statusHistory,
      timeline: order.timeline,
      auditLogs: order.auditLogs
    };
  }

  async getInvoice(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    let invoice = await this.repository.findInvoiceByOrderId(order.id);
    if (!invoice) {
      invoice = await this.repository.createInvoice({
        invoiceNumber: generateUniqueNumber('INV'),
        orderId: order.id,
        invoiceStatus: 'ISSUED',
        gstAmount: order.taxAmount,
        cgst: 0,
        sgst: 0,
        igst: 0,
        discount: order.discountAmount + order.couponDiscount,
        roundOff: order.roundOff,
        netAmount: order.grandTotal,
        invoicePdfUrl: null
      } as any);
    }
    return invoice;
  }

  async listShipments() {
    return this.repository.findAllShipments();
  }

  async getShipments(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    return this.repository.findShipmentByOrderId(order.id);
  }

  async startPicking(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    const updated = await this.repository.updateOrder(id, {
      orderStatus: 'PROCESSING',
      fulfillmentStatus: 'PROCESSING',
      updatedAt: new Date()
    });
    await this.repository.createTimelineEvent({
      orderId: id,
      eventType: 'ORDER_CONFIRMED',
      description: 'Picking sheet generated and order moved into fulfillment workflow.'
    });
    return updated;
  }

  async updateItemPicking(orderId: number, itemId: number, status: string) {
    const order = await this.repository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    const item = order.items.find((entry: any) => entry.id === itemId);
    if (!item) {
      throw new AppError('Order item not found', HTTP_STATUS.NOT_FOUND, 'ORDER_ITEM_NOT_FOUND');
    }
    const payload = { orderStatus: 'PROCESSING', fulfillmentStatus: 'PROCESSING', updatedAt: new Date() };
    await this.repository.updateOrder(orderId, payload);
    return { ...order, items: order.items.map((entry: any) => entry.id === itemId ? { ...entry, pickingStatus: status } : entry) };
  }

  async completePicking(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    const updated = await this.repository.updateOrder(id, {
      orderStatus: 'PACKING',
      fulfillmentStatus: 'PROCESSING',
      updatedAt: new Date()
    });
    await this.repository.createTimelineEvent({
      orderId: id,
      eventType: 'ORDER_SHIPPED',
      description: 'Picking audit completed and order handed to packing.'
    });
    return updated;
  }

  async updateItemPacking(orderId: number, itemId: number, status: string) {
    const order = await this.repository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    const item = order.items.find((entry: any) => entry.id === itemId);
    if (!item) {
      throw new AppError('Order item not found', HTTP_STATUS.NOT_FOUND, 'ORDER_ITEM_NOT_FOUND');
    }
    await this.repository.updateOrder(orderId, { orderStatus: 'PACKING', updatedAt: new Date() });
    return { ...order, items: order.items.map((entry: any) => entry.id === itemId ? { ...entry, packingStatus: status } : entry) };
  }

  async completePacking(id: number) {
    const order = await this.repository.findOrderById(id);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    const updated = await this.repository.updateOrder(id, {
      orderStatus: 'READY_TO_SHIP',
      fulfillmentStatus: 'SHIPPED',
      updatedAt: new Date()
    });
    await this.repository.createTimelineEvent({
      orderId: id,
      eventType: 'ORDER_SHIPPED',
      description: 'Packing completed and order is ready for dispatch.'
    });
    return updated;
  }

  async createShipment(orderId: number, dto: Record<string, unknown>) {
    const order = await this.repository.findOrderById(orderId);
    if (!order) {
      throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
    return this.repository.createShipment({
      shipmentNumber: `SHP-${Date.now()}`,
      orderId,
      carrierName: String(dto.carrier || 'Standard Courier'),
      trackingNumber: String(dto.trackingNumber || `TRK-${Date.now()}`),
      trackingUrl: dto.trackingUrl ? String(dto.trackingUrl) : null,
      shippingCost: Number(dto.shippingCost || 0),
      status: 'PENDING',
      dispatchDate: new Date(),
      estimatedDeliveryDate: dto.estimatedDeliveryDate ? new Date(String(dto.estimatedDeliveryDate)) : null,
      items: { create: Array.isArray(dto.items) ? (dto.items as any[]).map((item) => ({
        orderItemId: Number(item.orderItemId ?? item.id ?? 0),
        quantity: Number(item.quantity ?? 1)
      })) : [] }
    } as any);
  }

  async updateShipmentStatus(id: number, dto: Record<string, unknown>) {
    const shipment = await this.repository.findShipmentById(id);
    if (!shipment) {
      throw new AppError('Shipment not found', HTTP_STATUS.NOT_FOUND, 'SHIPMENT_NOT_FOUND');
    }
    const nextStatus = String(dto.status || shipment.status);
    return this.repository.updateShipment(id, { status: nextStatus, updatedAt: new Date() });
  }

  private async reserveCartInventory(order: any) {
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findInventoryByProductVariant(item.productId, item.variantId ?? null);
      if (!inventory) continue;
      await this.inventoryRepository.reserveInventory(inventory.id, item.quantity, 'RESERVE');
    }
  }

  private async confirmOrderInventory(order: any) {
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findInventoryByProductVariant(item.productId, item.variantId ?? null);
      if (!inventory) {
        // Some demo or imported orders may not have matching inventory rows yet.
        // Do not block order status transitions in that case; the workflow can continue
        // and stock can be reconciled later in the inventory module.
        continue;
      }
      const reservedStock = inventory.reservedStock;
      const currentStock = inventory.currentStock;
      const quantity = item.quantity;
      if (quantity > currentStock) {
        throw new AppError('Insufficient stock to confirm order', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_STOCK');
      }
      const newStock = Math.max(0, currentStock - quantity);
      const remainingReserved = Math.max(0, reservedStock - quantity);
      const availableStock = Math.max(0, newStock - remainingReserved);
      await this.inventoryRepository.updateInventory(inventory.id, { currentStock: newStock, reservedStock: remainingReserved, availableStock });
      await this.inventoryRepository.createStockMovement({
        productId: item.productId,
        variantId: item.variantId,
        warehouseId: inventory.warehouseId,
        quantity,
        movementType: 'SALE',
        referenceNumber: order.orderNumber,
        remarks: `Confirmed order ${order.orderNumber}`,
        date: new Date().toISOString()
      } as any);
    }
  }

  private async restoreOrderInventory(order: any) {
    for (const item of order.items) {
      const inventory = await this.inventoryRepository.findInventoryByProductVariant(item.productId, item.variantId ?? null);
      if (!inventory) continue;
      const currentStock = inventory.currentStock + item.quantity;
      const availableStock = Math.max(0, currentStock - inventory.reservedStock);
      await this.inventoryRepository.updateInventory(inventory.id, { currentStock, availableStock });
      await this.inventoryRepository.createStockMovement({
        productId: item.productId,
        variantId: item.variantId,
        warehouseId: inventory.warehouseId,
        quantity: item.quantity,
        movementType: 'RETURN',
        referenceNumber: order.orderNumber,
        remarks: `Restored inventory for cancelled order ${order.orderNumber}`,
        date: new Date().toISOString()
      } as any);
    }
  }

  private async awardLoyaltyPoints(order: any) {
    if (!order.customerId) return;
    const points = Math.floor(Number(order.grandTotal) / 100);
    if (points <= 0) return;
    const customer = await this.customerRepository.findById(order.customerId);
    if (!customer) return;
    await this.customerRepository.update(order.customerId, {
      loyaltyPoints: Number(customer.loyaltyPoints ?? 0) + points
    });
    await this.customerRepository.createLoyaltyTransaction(order.customerId, {
      type: 'EARN',
      points,
      reference: order.orderNumber,
      remarks: 'Loyalty points earned for delivered order',
    });
  }
}
