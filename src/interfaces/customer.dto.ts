export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type CustomerAddressType = 'BILLING' | 'SHIPPING';
export type WalletTransactionType = 'CREDIT' | 'DEBIT' | 'REFUND' | 'REWARD' | 'ADJUSTMENT';
export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'EXPIRE';
export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';
export type CustomerActivityType = 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PROFILE_UPDATE' | 'PASSWORD_CHANGE' | 'WISHLIST' | 'ORDERS' | 'REVIEWS';
export type CustomerReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateCustomerDto {
  customerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  anniversaryDate?: string;
  profileImage?: string;
  referralCode?: string;
  referredById?: number;
  customerGroupId?: number;
  status?: CustomerStatus;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  lastLogin?: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface CustomerListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  customerGroupId?: number;
  status?: CustomerStatus;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerProfileUpdateDto {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  anniversaryDate?: string;
  profileImage?: string;
}

export interface CreateCustomerAddressDto {
  addressType: CustomerAddressType;
  isDefaultBilling?: boolean;
  isDefaultShipping?: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface UpdateCustomerAddressDto extends Partial<CreateCustomerAddressDto> {}

export interface CustomerAddressListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  addressType?: CustomerAddressType;
  city?: string;
  state?: string;
  country?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerGroupDto {
  name: string;
  code: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface UpdateCustomerGroupDto extends Partial<CreateCustomerGroupDto> {}

export interface CustomerGroupListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateWishlistItemDto {
  productId: number;
  variantId?: number;
}

export interface CreateCustomerReviewDto {
  productId: number;
  variantId?: number;
  rating: number;
  reviewTitle: string;
  review: string;
  images?: string[];
}

export interface UpdateCustomerReviewDto extends Partial<CreateCustomerReviewDto> {
  status?: CustomerReviewStatus;
}

export interface CustomerReviewListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  productId?: number;
  status?: CustomerReviewStatus;
  rating?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateWalletTransactionDto {
  type: WalletTransactionType;
  amount: number;
  reference?: string;
  remarks?: string;
}

export interface WalletTransactionListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  type?: WalletTransactionType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLoyaltyTransactionDto {
  type: LoyaltyTransactionType;
  points: number;
  reference?: string;
  remarks?: string;
}

export interface LoyaltyTransactionListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  type?: LoyaltyTransactionType;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateNotificationDto {
  channel: NotificationChannel;
  title: string;
  message: string;
  status?: NotificationStatus;
  sentAt?: string;
}

export interface NotificationListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerNoteDto {
  note: string;
}

export interface UpdateCustomerNoteDto extends Partial<CreateCustomerNoteDto> {}

export interface CustomerNoteListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerDocumentDto {
  fileName: string;
  fileUrl: string;
  documentType?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
}

export interface CustomerDocumentListQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerSummaryResponse {
  totalOrders: number;
  totalPurchase: number;
  wishlistCount: number;
  reviewCount: number;
  walletBalance: number;
  loyaltyPoints: number;
  lastLogin?: string;
}
