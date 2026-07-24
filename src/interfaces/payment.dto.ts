export type PaymentMethodType =
  | 'CASH_ON_DELIVERY'
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'WALLET'
  | 'GIFT_CARD';

export type PaymentGatewayProvider =
  | 'RAZORPAY'
  | 'STRIPE'
  | 'PAYPAL'
  | 'CASHFREE'
  | 'PHONEPE'
  | 'PAYTM'
  | 'OFFLINE';

export type PaymentStatusType =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CHARGEBACK'
  | 'EXPIRED';

export type PaymentTransactionType =
  | 'AUTHORIZATION'
  | 'CAPTURE'
  | 'SALE'
  | 'REFUND'
  | 'PARTIAL_REFUND'
  | 'VOID'
  | 'CHARGEBACK'
  | 'REVERSAL';

export type SettlementStatus = 'PENDING' | 'SETTLED' | 'FAILED' | 'PROCESSING';
export type ReconciliationStatus = 'MATCHED' | 'MISMATCHED' | 'PENDING' | 'FAILED';
export type InvoicePaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface CreatePaymentDto {
  orderId: number;
  customerId?: number;
  gateway: PaymentGatewayProvider;
  paymentMethod: PaymentMethodType;
  currency?: string;
  exchangeRate?: number;
  amount: number;
  metadata?: Record<string, unknown>;
}

export interface VerifyPaymentDto {
  paymentId: number;
  gatewayOrderId?: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  transactionReference: string;
  amount: number;
}

export interface CapturePaymentDto {
  paymentId: number;
  amount?: number;
}

export interface RefundPaymentDto {
  paymentId: number;
  amount: number;
  transactionReference?: string;
  reason?: string;
}

export interface RetryPaymentDto {
  paymentId: number;
  reason?: string;
}

export interface PaymentQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  orderId?: number;
  customerId?: number;
  status?: PaymentStatusType;
  gateway?: PaymentGatewayProvider;
  paymentMethod?: PaymentMethodType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SettlementQuery {
  page?: number;
  pageSize?: number;
  gateway?: PaymentGatewayProvider;
  status?: SettlementStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReconciliationQuery {
  page?: number;
  pageSize?: number;
  status?: ReconciliationStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WebhookParams {
  provider: PaymentGatewayProvider;
}
