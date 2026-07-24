export type CartStatus = 'ACTIVE' | 'SAVED' | 'COMPLETED' | 'ABANDONED';
export type CouponType = 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
export type ShippingStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface CreateCartItemDto {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface SaveCartDto {
  name?: string;
}

export interface RestoreCartDto {
  savedCartId: number;
}

export interface ApplyCouponDto {
  couponCode: string;
}

export interface CheckoutDto {
  billingAddressId?: number;
  shippingAddressId?: number;
  shippingMethodId?: number;
  deliverySlotId?: number;
  couponCode?: string;
  paymentMethod: string;
}

export interface CartQuery {
  customerId?: number;
  sessionId?: string;
}

export interface ShippingEstimateQuery {
  country: string;
  state?: string;
  city?: string;
  postalCode?: string;
  weight?: number;
  shippingMethodId?: number;
}

export interface ShippingMethodListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ShippingStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DeliverySlotListQuery {
  page?: number;
  pageSize?: number;
  status?: ShippingStatus;
  date?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SavedCartQuery {
  customerId?: number;
  cartId?: number;
}
