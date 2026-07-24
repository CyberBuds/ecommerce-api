export type OrderType = 'ONLINE' | 'OFFLINE' | 'PHONE' | 'B2B' | 'B2C';
export type OrderSource = 'WEB' | 'MOBILE' | 'STORE' | 'MARKETPLACE';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'READY_TO_SHIP' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED' | 'FAILED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
export type FulfillmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
export type ReturnStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type RefundStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type RefundMode = 'BANK_TRANSFER' | 'WALLET' | 'CREDIT_NOTE' | 'OTHER';
export type OrderItemStatus = 'ACTIVE' | 'CANCELLED' | 'RETURNED';
export type OrderTimelineEventType = 'ORDER_PLACED' | 'ORDER_CONFIRMED' | 'ORDER_SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURN_APPROVED' | 'REFUND_PROCESSED' | 'NOTE_ADDED';

export interface OrderItemPayloadDto {
  productId: number;
  variantId?: number;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface CreateOrderDto {
  cartId?: number;
  customerId?: number;
  billingAddressId: number;
  shippingAddressId: number;
  shippingMethodId?: number;
  deliverySlotId?: number;
  couponId?: number;
  paymentMethod: string;
  orderType?: OrderType;
  orderSource?: OrderSource;
  remarks?: string;
  currency?: string;
  exchangeRate?: number;
}

export interface UpdateOrderDto {
  billingAddressId?: number;
  shippingAddressId?: number;
  shippingMethodId?: number;
  deliverySlotId?: number;
  remarks?: string;
  paymentMethod?: string;
  currency?: string;
  exchangeRate?: number;
}

export interface OrderStatusUpdateDto {
  status: OrderStatus;
  remark?: string;
}

export interface CreateReturnRequestDto {
  items: Array<{ orderItemId: number; quantity: number; reason?: string }>;
  reason?: string;
}

export interface CreateRefundDto {
  refundMode: RefundMode;
  refundAmount: number;
  transactionReference?: string;
  refundDate?: string;
}

export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  customerId?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ShipmentQuery {
  orderId?: number;
}

export interface OrderTimelineQuery {
  orderId?: number;
}
