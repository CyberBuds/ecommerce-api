import { body, param, query } from 'express-validator';
import {
  BannerDisplayOn,
  BannerPosition,
  CampaignStatus,
  CampaignType,
  DiscountType,
  GiftCardStatus,
  MarketingChannel,
  MarketingSectionType,
  PopupType,
  ReferralStatus,
  SubscriberStatus,
  StoreCreditType,
  AbandonedCartRecoveryStatus
} from '../interfaces/marketing.dto';

const CAMPAIGN_STATUSES: CampaignStatus[] = ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'DRAFT'];
const CAMPAIGN_TYPES: CampaignType[] = [
  'FLASH_SALE',
  'DEAL_OF_THE_DAY',
  'COMBO_OFFER',
  'BUY_X_GET_Y',
  'REFERRAL',
  'POPUP',
  'EMAIL',
  'SMS',
  'WHATSAPP',
  'PUSH',
  'GENERAL'
];
const DISCOUNT_TYPES: DiscountType[] = ['PERCENTAGE', 'FLAT'];
const GIFT_CARD_STATUSES: GiftCardStatus[] = ['ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED'];
const REFERRAL_STATUSES: ReferralStatus[] = ['ACTIVE', 'EXPIRED', 'COMPLETED'];
const SUBSCRIBER_STATUSES: SubscriberStatus[] = ['ACTIVE', 'UNSUBSCRIBED', 'BOUNCED'];
const POPUP_TYPES: PopupType[] = ['INFO', 'OFFER', 'EMAIL_CAPTURE', 'COUPON'];
const CHANNEL_TYPES: MarketingChannel[] = ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH'];
const BANNER_DISPLAY_ON: BannerDisplayOn[] = ['HOME', 'PRODUCT_PAGE', 'CATEGORY_PAGE', 'ALL'];
const BANNER_POSITIONS: BannerPosition[] = ['TOP', 'MIDDLE', 'BOTTOM', 'SIDEBAR'];
const SECTION_TYPES: MarketingSectionType[] = [
  'HERO_SLIDER',
  'FEATURED_PRODUCTS',
  'TRENDING_PRODUCTS',
  'NEW_ARRIVALS',
  'BEST_SELLERS',
  'RECENTLY_VIEWED',
  'RECOMMENDED_PRODUCTS',
  'BRANDS',
  'CATEGORIES',
  'TESTIMONIALS',
  'INSTAGRAM_FEED',
  'BLOG_SECTION'
];
const STORE_CREDIT_TYPES: StoreCreditType[] = ['CREDIT', 'DEBIT', 'ADJUSTMENT', 'REWARD'];
const ABANDONED_CART_STATUSES: AbandonedCartRecoveryStatus[] = ['PENDING', 'SCHEDULED', 'RECOVERED', 'FAILED'];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const idParam = [param('id').isInt({ gt: 0 }).withMessage('Invalid id')];

export const createBannerValidation = [
  body('bannerCode').trim().notEmpty().withMessage('Banner code is required'),
  body('title').trim().notEmpty().withMessage('Banner title is required'),
  body('position').optional().isIn(BANNER_POSITIONS).withMessage('Invalid banner position'),
  body('displayOn').optional().isIn(BANNER_DISPLAY_ON).withMessage('Invalid display target'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  body('priority').optional().isInt({ min: 0 }).toInt(),
  body('imageId').optional().isInt({ gt: 0 }).toInt(),
  body('mobileImageId').optional().isInt({ gt: 0 }).toInt(),
  body('buttonUrl').optional().isURL().withMessage('Button URL must be valid')
];

export const updateBannerValidation = [
  idParam[0],
  body('position').optional().isIn(BANNER_POSITIONS).withMessage('Invalid banner position'),
  body('displayOn').optional().isIn(BANNER_DISPLAY_ON).withMessage('Invalid display target'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  body('priority').optional().isInt({ min: 0 }).toInt(),
  body('imageId').optional().isInt({ gt: 0 }).toInt(),
  body('mobileImageId').optional().isInt({ gt: 0 }).toInt(),
  body('buttonUrl').optional().isURL().withMessage('Button URL must be valid')
];

export const listBannersValidation = [
  ...paginationValidation,
  query('displayOn').optional().isIn(BANNER_DISPLAY_ON),
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createHomepageSectionValidation = [
  body('sectionType').isIn(SECTION_TYPES).withMessage('Invalid homepage section type'),
  body('title').trim().notEmpty().withMessage('Section title is required'),
  body('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  body('endDate').optional().isISO8601().withMessage('End date must be valid'),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateHomepageSectionValidation = [
  idParam[0],
  body('sectionType').optional().isIn(SECTION_TYPES).withMessage('Invalid homepage section type'),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listHomepageSectionsValidation = [
  ...paginationValidation,
  query('sectionType').optional().isIn(SECTION_TYPES),
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createCampaignValidation = [
  body('campaignCode').trim().notEmpty().withMessage('Campaign code is required'),
  body('campaignName').trim().notEmpty().withMessage('Campaign name is required'),
  body('campaignType').isIn(CAMPAIGN_TYPES).withMessage('Invalid campaign type'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('budget').optional().isFloat({ min: 0 }),
  body('priority').optional().isInt({ min: 0 }).toInt(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateCampaignValidation = [
  idParam[0],
  body('campaignType').optional().isIn(CAMPAIGN_TYPES),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('budget').optional().isFloat({ min: 0 }),
  body('priority').optional().isInt({ min: 0 }).toInt(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listCampaignsValidation = [
  ...paginationValidation,
  query('campaignType').optional().isIn(CAMPAIGN_TYPES),
  query('status').optional().isIn(CAMPAIGN_STATUSES),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const createFlashSaleValidation = [
  body('flashSaleName').trim().notEmpty().withMessage('Flash sale name is required'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('discountType').isIn(DISCOUNT_TYPES).withMessage('Invalid discount type'),
  body('discountValue').isFloat({ gt: 0 }).withMessage('Discount value must be greater than zero'),
  body('maximumQuantityPerCustomer').optional().isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateFlashSaleValidation = [
  idParam[0],
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('discountType').optional().isIn(DISCOUNT_TYPES),
  body('discountValue').optional().isFloat({ gt: 0 }),
  body('maximumQuantityPerCustomer').optional().isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listFlashSalesValidation = [
  ...paginationValidation,
  query('status').optional().isIn(CAMPAIGN_STATUSES),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const createDealValidation = [
  body('productId').isInt({ gt: 0 }).withMessage('Product id is required'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('offerPrice').isFloat({ gt: 0 }).withMessage('Offer price must be greater than zero'),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateDealValidation = [
  idParam[0],
  body('productId').optional().isInt({ gt: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('offerPrice').optional().isFloat({ gt: 0 }),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listDealsValidation = [
  ...paginationValidation,
  query('status').optional().isIn(CAMPAIGN_STATUSES),
  query('productId').optional().isInt({ gt: 0 }).toInt(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const createComboOfferValidation = [
  body('offerName').trim().notEmpty().withMessage('Offer name is required'),
  body('productIds').optional().isArray().withMessage('Product ids must be an array'),
  body('bundlePrice').isFloat({ gt: 0 }).withMessage('Bundle price is required'),
  body('discount').optional().isFloat({ min: 0 })
];

export const updateComboOfferValidation = [
  idParam[0],
  body('productIds').optional().isArray(),
  body('bundlePrice').optional().isFloat({ gt: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listComboOffersValidation = [
  ...paginationValidation,
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createBuyXGetYOfferValidation = [
  body('buyProductId').isInt({ gt: 0 }).withMessage('Buy product id is required'),
  body('buyQuantity').isInt({ gt: 1 }).withMessage('Buy quantity must be at least 1'),
  body('getProductId').isInt({ gt: 0 }).withMessage('Get product id is required'),
  body('getQuantity').isInt({ gt: 1 }).withMessage('Get quantity must be at least 1'),
  body('discount').isFloat({ min: 0 }).withMessage('Discount must be a valid number'),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateBuyXGetYOfferValidation = [
  idParam[0],
  body('buyProductId').optional().isInt({ gt: 0 }),
  body('buyQuantity').optional().isInt({ gt: 1 }),
  body('getProductId').optional().isInt({ gt: 0 }),
  body('getQuantity').optional().isInt({ gt: 1 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listBuyXGetYOffersValidation = [
  ...paginationValidation,
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createGiftCardValidation = [
  body('giftCardCode').trim().notEmpty().withMessage('Gift card code is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('balance').optional().isFloat({ min: 0 }),
  body('expiryDate').isISO8601().withMessage('Expiry date is required'),
  body('status').optional().isIn(GIFT_CARD_STATUSES)
];

export const updateGiftCardValidation = [
  idParam[0],
  body('amount').optional().isFloat({ gt: 0 }),
  body('balance').optional().isFloat({ min: 0 }),
  body('expiryDate').optional().isISO8601(),
  body('status').optional().isIn(GIFT_CARD_STATUSES)
];

export const redeemGiftCardValidation = [
  idParam[0],
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('reference').optional().trim()
];

export const listGiftCardsValidation = [
  ...paginationValidation,
  query('status').optional().isIn(GIFT_CARD_STATUSES),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const createReferralProgramValidation = [
  body('referralCode').trim().notEmpty().withMessage('Referral code is required'),
  body('referrerReward').isFloat({ min: 0 }).withMessage('Referrer reward must be a valid amount'),
  body('refereeReward').isFloat({ min: 0 }).withMessage('Referee reward must be a valid amount'),
  body('startDate').isISO8601().withMessage('Start date is required'),
  body('endDate').isISO8601().withMessage('End date is required'),
  body('status').optional().isIn(REFERRAL_STATUSES)
];

export const updateReferralProgramValidation = [
  idParam[0],
  body('referrerReward').optional().isFloat({ min: 0 }),
  body('refereeReward').optional().isFloat({ min: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('status').optional().isIn(REFERRAL_STATUSES)
];

export const listReferralProgramsValidation = [
  ...paginationValidation,
  query('status').optional().isIn(REFERRAL_STATUSES),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];

export const createStoreCreditValidation = [
  body('customerId').isInt({ gt: 0 }).withMessage('Customer id is required'),
  body('type').isIn(STORE_CREDIT_TYPES).withMessage('Invalid store credit type'),
  body('creditAmount').optional().isFloat({ min: 0 }),
  body('debitAmount').optional().isFloat({ min: 0 }),
  body('reason').optional().trim()
];

export const listStoreCreditsValidation = [
  ...paginationValidation,
  query('customerId').optional().isInt({ gt: 0 }).toInt(),
  query('type').optional().isIn(STORE_CREDIT_TYPES)
];

export const createNewsletterSubscriberValidation = [
  body('email').isEmail().withMessage('Valid email is required')
];

export const updateNewsletterSubscriberValidation = [
  idParam[0],
  body('status').optional().isIn(SUBSCRIBER_STATUSES)
];

export const listNewsletterSubscribersValidation = [
  ...paginationValidation,
  query('status').optional().isIn(SUBSCRIBER_STATUSES)
];

export const createLandingPageValidation = [
  body('slug').trim().notEmpty().withMessage('Landing page slug is required'),
  body('seoTitle').trim().notEmpty().withMessage('SEO title is required'),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateLandingPageValidation = [
  idParam[0],
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listLandingPagesValidation = [
  ...paginationValidation,
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createPopupCampaignValidation = [
  body('popupType').isIn(POPUP_TYPES).withMessage('Invalid popup type'),
  body('status').optional().isIn(CAMPAIGN_STATUSES),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
];

export const updatePopupCampaignValidation = [
  idParam[0],
  body('popupType').optional().isIn(POPUP_TYPES),
  body('status').optional().isIn(CAMPAIGN_STATUSES),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
];

export const listPopupCampaignsValidation = [
  ...paginationValidation,
  query('popupType').optional().isIn(POPUP_TYPES),
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createChannelCampaignValidation = [
  body('name').trim().notEmpty().withMessage('Campaign name is required'),
  body('channel').isIn(CHANNEL_TYPES).withMessage('Invalid campaign channel'),
  body('message').trim().notEmpty().withMessage('Message body is required'),
  body('scheduleAt').optional().isISO8601(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const updateChannelCampaignValidation = [
  idParam[0],
  body('channel').optional().isIn(CHANNEL_TYPES),
  body('scheduleAt').optional().isISO8601(),
  body('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const listChannelCampaignsValidation = [
  ...paginationValidation,
  query('channel').optional().isIn(CHANNEL_TYPES),
  query('status').optional().isIn(CAMPAIGN_STATUSES)
];

export const createAbandonedCartRecoveryValidation = [
  body('customerId').optional().isInt({ gt: 0 }).toInt(),
  body('cartId').optional().isInt({ gt: 0 }).toInt(),
  body('reminderCount').optional().isInt({ min: 0 }).toInt(),
  body('nextReminderAt').optional().isISO8601(),
  body('recoveryStatus').optional().isIn(ABANDONED_CART_STATUSES)
];

export const updateAbandonedCartRecoveryValidation = [
  idParam[0],
  body('reminderCount').optional().isInt({ min: 0 }).toInt(),
  body('lastReminderDate').optional().isISO8601(),
  body('nextReminderAt').optional().isISO8601(),
  body('recoveryStatus').optional().isIn(ABANDONED_CART_STATUSES)
];

export const listAbandonedCartRecoveriesValidation = [
  ...paginationValidation,
  query('customerId').optional().isInt({ gt: 0 }).toInt(),
  query('cartId').optional().isInt({ gt: 0 }).toInt(),
  query('recoveryStatus').optional().isIn(ABANDONED_CART_STATUSES)
];

export const analyticsQueryValidation = [
  ...paginationValidation,
  query('campaignId').optional().isInt({ gt: 0 }).toInt(),
  query('channelCampaignId').optional().isInt({ gt: 0 }).toInt(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601()
];
