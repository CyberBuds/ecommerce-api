export type BannerDisplayOn = 'HOME' | 'PRODUCT_PAGE' | 'CATEGORY_PAGE' | 'ALL';
export type BannerPosition = 'TOP' | 'MIDDLE' | 'BOTTOM' | 'SIDEBAR';
export type MarketingSectionType =
  | 'HERO_SLIDER'
  | 'FEATURED_PRODUCTS'
  | 'TRENDING_PRODUCTS'
  | 'NEW_ARRIVALS'
  | 'BEST_SELLERS'
  | 'RECENTLY_VIEWED'
  | 'RECOMMENDED_PRODUCTS'
  | 'BRANDS'
  | 'CATEGORIES'
  | 'TESTIMONIALS'
  | 'INSTAGRAM_FEED'
  | 'BLOG_SECTION';
export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'DRAFT';
export type CampaignType =
  | 'FLASH_SALE'
  | 'DEAL_OF_THE_DAY'
  | 'COMBO_OFFER'
  | 'BUY_X_GET_Y'
  | 'REFERRAL'
  | 'POPUP'
  | 'EMAIL'
  | 'SMS'
  | 'WHATSAPP'
  | 'PUSH'
  | 'GENERAL';
export type DiscountType = 'PERCENTAGE' | 'FLAT';
export type GiftCardStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED';
export type ReferralStatus = 'ACTIVE' | 'EXPIRED' | 'COMPLETED';
export type SubscriberStatus = 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
export type PopupType = 'INFO' | 'OFFER' | 'EMAIL_CAPTURE' | 'COUPON';
export type MarketingChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';
export type AbandonedCartRecoveryStatus = 'PENDING' | 'SCHEDULED' | 'RECOVERED' | 'FAILED';
export type StoreCreditType = 'CREDIT' | 'DEBIT' | 'ADJUSTMENT' | 'REWARD';

export interface CreateBannerDto {
  bannerCode: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageId?: number;
  mobileImageId?: number;
  buttonText?: string;
  buttonUrl?: string;
  position?: BannerPosition;
  priority?: number;
  startDate?: string;
  endDate?: string;
  displayOn?: BannerDisplayOn;
  status?: CampaignStatus;
}

export interface UpdateBannerDto {
  title?: string;
  subtitle?: string;
  description?: string;
  imageId?: number;
  mobileImageId?: number;
  buttonText?: string;
  buttonUrl?: string;
  position?: BannerPosition;
  priority?: number;
  startDate?: string;
  endDate?: string;
  displayOn?: BannerDisplayOn;
  status?: CampaignStatus;
}

export interface BannerQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  displayOn?: BannerDisplayOn;
  status?: CampaignStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateHomepageSectionDto {
  sectionType: MarketingSectionType;
  title: string;
  description?: string;
  metadata?: any;
  priority?: number;
  status?: CampaignStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateHomepageSectionDto {
  title?: string;
  description?: string;
  metadata?: any;
  priority?: number;
  status?: CampaignStatus;
  startDate?: string;
  endDate?: string;
}

export interface HomepageSectionQuery {
  page?: number;
  pageSize?: number;
  sectionType?: MarketingSectionType;
  status?: CampaignStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCampaignDto {
  campaignCode: string;
  campaignName: string;
  campaignType: CampaignType;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  priority?: number;
  status?: CampaignStatus;
}

export interface UpdateCampaignDto {
  campaignName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  priority?: number;
  status?: CampaignStatus;
}

export interface CampaignQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  campaignType?: CampaignType;
  status?: CampaignStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateFlashSaleDto {
  campaignId?: number;
  flashSaleName: string;
  startDate: string;
  endDate: string;
  products?: any[];
  discountType: DiscountType;
  discountValue: number;
  maximumDiscount?: number;
  maximumQuantityPerCustomer?: number;
  status?: CampaignStatus;
}

export interface UpdateFlashSaleDto {
  flashSaleName?: string;
  startDate?: string;
  endDate?: string;
  products?: any[];
  discountType?: DiscountType;
  discountValue?: number;
  maximumDiscount?: number;
  maximumQuantityPerCustomer?: number;
  status?: CampaignStatus;
}

export interface FlashSaleQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CampaignStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateDealOfTheDayDto {
  campaignId?: number;
  productId: number;
  variantId?: number;
  startDate: string;
  endDate: string;
  offerPrice: number;
  status?: CampaignStatus;
}

export interface UpdateDealOfTheDayDto {
  productId?: number;
  variantId?: number;
  startDate?: string;
  endDate?: string;
  offerPrice?: number;
  status?: CampaignStatus;
}

export interface DealOfTheDayQuery {
  page?: number;
  pageSize?: number;
  productId?: number;
  status?: CampaignStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateComboOfferDto {
  campaignId?: number;
  offerName: string;
  productIds?: any[];
  bundlePrice: number;
  discount?: number;
  status?: CampaignStatus;
}

export interface UpdateComboOfferDto {
  offerName?: string;
  productIds?: any[];
  bundlePrice?: number;
  discount?: number;
  status?: CampaignStatus;
}

export interface ComboOfferQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CampaignStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBuyXGetYOfferDto {
  campaignId?: number;
  buyProductId: number;
  buyVariantId?: number;
  buyQuantity: number;
  getProductId: number;
  getVariantId?: number;
  getQuantity: number;
  discount: number;
  status?: CampaignStatus;
}

export interface UpdateBuyXGetYOfferDto {
  buyProductId?: number;
  buyVariantId?: number;
  buyQuantity?: number;
  getProductId?: number;
  getVariantId?: number;
  getQuantity?: number;
  discount?: number;
  status?: CampaignStatus;
}

export interface BuyXGetYOfferQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CampaignStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateGiftCardDto {
  giftCardCode: string;
  amount: number;
  balance?: number;
  expiryDate: string;
  status?: GiftCardStatus;
}

export interface UpdateGiftCardDto {
  amount?: number;
  balance?: number;
  expiryDate?: string;
  status?: GiftCardStatus;
}

export interface RedeemGiftCardDto {
  amount: number;
  reference?: string;
}

export interface GiftCardQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: GiftCardStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateReferralProgramDto {
  referralCode: string;
  referrerReward: number;
  refereeReward: number;
  startDate: string;
  endDate: string;
  status?: ReferralStatus;
}

export interface UpdateReferralProgramDto {
  referrerReward?: number;
  refereeReward?: number;
  startDate?: string;
  endDate?: string;
  status?: ReferralStatus;
}

export interface ReferralProgramQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReferralStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateStoreCreditDto {
  customerId: number;
  type: StoreCreditType;
  creditAmount?: number;
  debitAmount?: number;
  reason?: string;
  reference?: string;
}

export interface UpdateStoreCreditDto {
  reason?: string;
  reference?: string;
  status?: CampaignStatus;
}

export interface StoreCreditQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  type?: StoreCreditType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateNewsletterSubscriberDto {
  email: string;
  status?: SubscriberStatus;
}

export interface UpdateNewsletterSubscriberDto {
  status?: SubscriberStatus;
}

export interface NewsletterSubscriberQuery {
  page?: number;
  pageSize?: number;
  status?: SubscriberStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLandingPageDto {
  slug: string;
  seoTitle: string;
  seoDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  bannerId?: number;
  sections?: any;
  status?: CampaignStatus;
}

export interface UpdateLandingPageDto {
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  bannerId?: number;
  sections?: any;
  status?: CampaignStatus;
}

export interface LandingPageQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CampaignStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePopupCampaignDto {
  popupType: PopupType;
  imageId?: number;
  offerText?: string;
  displayRule?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  status?: CampaignStatus;
}

export interface UpdatePopupCampaignDto {
  popupType?: PopupType;
  imageId?: number;
  offerText?: string;
  displayRule?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  status?: CampaignStatus;
}

export interface PopupCampaignQuery {
  page?: number;
  pageSize?: number;
  popupType?: PopupType;
  status?: CampaignStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateChannelCampaignDto {
  campaignId?: number;
  name: string;
  channel: MarketingChannel;
  subject?: string;
  message: string;
  targetAudience?: string;
  scheduleAt?: string;
  status?: CampaignStatus;
}

export interface UpdateChannelCampaignDto {
  name?: string;
  channel?: MarketingChannel;
  subject?: string;
  message?: string;
  targetAudience?: string;
  scheduleAt?: string;
  status?: CampaignStatus;
}

export interface ChannelCampaignQuery {
  page?: number;
  pageSize?: number;
  channel?: MarketingChannel;
  status?: CampaignStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAbandonedCartRecoveryDto {
  customerId?: number;
  cartId?: number;
  reminderCount?: number;
  nextReminderAt?: string;
  recoveryStatus?: AbandonedCartRecoveryStatus;
}

export interface UpdateAbandonedCartRecoveryDto {
  reminderCount?: number;
  lastReminderDate?: string;
  nextReminderAt?: string;
  recoveryStatus?: AbandonedCartRecoveryStatus;
}

export interface AbandonedCartRecoveryQuery {
  page?: number;
  pageSize?: number;
  customerId?: number;
  cartId?: number;
  recoveryStatus?: AbandonedCartRecoveryStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CampaignAnalyticsQuery {
  page?: number;
  pageSize?: number;
  campaignId?: number;
  channelCampaignId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CampaignInsightResult {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalRevenue: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageConversionRate: number;
}
