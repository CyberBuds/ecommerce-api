import { body, param, query } from 'express-validator';
import {
  CmsPageStatus,
  CmsPageType,
  CmsVisibility,
  BlogStatus,
  FaqStatus,
  TestimonialStatus,
  LookbookStatus,
  PolicyType,
  ContactInquiryStatus,
  MenuType,
  RedirectType,
  SeoPageType,
} from '../interfaces/cms.dto';

// ─── Constants ────────────────────────────────────────────────────────────────

const CMS_PAGE_STATUSES: CmsPageStatus[] = ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'];
const CMS_PAGE_TYPES: CmsPageType[] = ['LANDING', 'CONTENT', 'HOME', 'CATEGORY', 'CUSTOM'];
const CMS_VISIBILITIES: CmsVisibility[] = ['PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED'];
const BLOG_STATUSES: BlogStatus[] = ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'];
const FAQ_STATUSES: FaqStatus[] = ['ACTIVE', 'INACTIVE'];
const TESTIMONIAL_STATUSES: TestimonialStatus[] = ['ACTIVE', 'INACTIVE'];
const LOOKBOOK_STATUSES: LookbookStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
const POLICY_TYPES: PolicyType[] = [
  'PRIVACY_POLICY',
  'TERMS_AND_CONDITIONS',
  'REFUND_POLICY',
  'SHIPPING_POLICY',
  'CANCELLATION_POLICY',
  'COOKIE_POLICY',
];
const INQUIRY_STATUSES: ContactInquiryStatus[] = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const MENU_TYPES: MenuType[] = ['HEADER', 'MEGA', 'FOOTER', 'MOBILE'];
const REDIRECT_TYPES: RedirectType[] = ['PERMANENT_301', 'TEMPORARY_302'];
const SEO_PAGE_TYPES: SeoPageType[] = ['HOME', 'PRODUCT', 'CATEGORY', 'BLOG', 'CMS_PAGE', 'LANDING_PAGE', 'BRAND', 'CUSTOM'];

// ─── Shared ───────────────────────────────────────────────────────────────────

export const idParam = [param('id').isInt({ min: 1 }).withMessage('Valid ID is required')];

const slugField = (name = 'slug') =>
  body(name)
    .optional()
    .isString()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(`${name} must be lowercase alphanumeric with hyphens`);

const optionalDate = (name: string) =>
  body(name).optional().isISO8601().withMessage(`${name} must be a valid ISO 8601 date`);

// ─── CMS Pages ────────────────────────────────────────────────────────────────

export const createCmsPageValidation = [
  body('pageCode').notEmpty().isString().trim().withMessage('pageCode is required'),
  body('title').notEmpty().isString().trim().withMessage('title is required'),
  slugField('slug'),
  body('shortDescription').optional().isString().trim(),
  body('content').optional().isString(),
  body('featuredImageId').optional().isInt({ min: 1 }),
  body('template').optional().isString().trim(),
  body('layout').optional().isString().trim(),
  body('pageType').optional().isIn(CMS_PAGE_TYPES).withMessage(`pageType must be one of: ${CMS_PAGE_TYPES.join(', ')}`),
  body('visibility').optional().isIn(CMS_VISIBILITIES).withMessage(`visibility must be one of: ${CMS_VISIBILITIES.join(', ')}`),
  body('status').optional().isIn(CMS_PAGE_STATUSES).withMessage(`status must be one of: ${CMS_PAGE_STATUSES.join(', ')}`),
  optionalDate('publishedAt'),
];

export const updateCmsPageValidation = [
  ...idParam,
  body('title').optional().isString().trim(),
  slugField('slug'),
  body('shortDescription').optional().isString().trim(),
  body('content').optional().isString(),
  body('featuredImageId').optional().isInt({ min: 1 }),
  body('template').optional().isString().trim(),
  body('layout').optional().isString().trim(),
  body('pageType').optional().isIn(CMS_PAGE_TYPES),
  body('visibility').optional().isIn(CMS_VISIBILITIES),
  body('status').optional().isIn(CMS_PAGE_STATUSES),
  optionalDate('publishedAt'),
];

export const listCmsPagesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(CMS_PAGE_STATUSES),
  query('pageType').optional().isIn(CMS_PAGE_TYPES),
  query('visibility').optional().isIn(CMS_VISIBILITIES),
  query('search').optional().isString().trim(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

// ─── Blog Category ────────────────────────────────────────────────────────────

export const createBlogCategoryValidation = [
  body('categoryName').notEmpty().isString().trim().withMessage('categoryName is required'),
  slugField('slug'),
  body('description').optional().isString().trim(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const updateBlogCategoryValidation = [
  ...idParam,
  body('categoryName').optional().isString().trim(),
  slugField('slug'),
  body('description').optional().isString().trim(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const listBlogCategoriesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(FAQ_STATUSES),
  query('search').optional().isString().trim(),
];

// ─── Blog Tags ────────────────────────────────────────────────────────────────

export const createBlogTagValidation = [
  body('tagName').notEmpty().isString().trim().withMessage('tagName is required'),
  slugField('slug'),
];

export const updateBlogTagValidation = [
  ...idParam,
  body('tagName').optional().isString().trim(),
  slugField('slug'),
];

export const listBlogTagsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const createBlogPostValidation = [
  body('title').notEmpty().isString().trim().withMessage('title is required'),
  slugField('slug'),
  body('excerpt').optional().isString().trim(),
  body('content').optional().isString(),
  body('featuredImageId').optional().isInt({ min: 1 }),
  body('authorId').optional().isInt({ min: 1 }),
  body('categoryId').optional().isInt({ min: 1 }),
  body('tagIds').optional().isArray(),
  body('tagIds.*').optional().isInt({ min: 1 }),
  body('readingTime').optional().isInt({ min: 1 }),
  body('commentsEnabled').optional().isBoolean(),
  body('status').optional().isIn(BLOG_STATUSES),
  optionalDate('publishedAt'),
  optionalDate('scheduledAt'),
];

export const updateBlogPostValidation = [
  ...idParam,
  body('title').optional().isString().trim(),
  slugField('slug'),
  body('excerpt').optional().isString().trim(),
  body('content').optional().isString(),
  body('featuredImageId').optional().isInt({ min: 1 }),
  body('authorId').optional().isInt({ min: 1 }),
  body('categoryId').optional().isInt({ min: 1 }),
  body('tagIds').optional().isArray(),
  body('tagIds.*').optional().isInt({ min: 1 }),
  body('readingTime').optional().isInt({ min: 1 }),
  body('commentsEnabled').optional().isBoolean(),
  body('status').optional().isIn(BLOG_STATUSES),
  optionalDate('publishedAt'),
  optionalDate('scheduledAt'),
];

export const listBlogPostsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('status').optional().isIn(BLOG_STATUSES),
  query('categoryId').optional().isInt({ min: 1 }),
  query('tagId').optional().isInt({ min: 1 }),
  query('authorId').optional().isInt({ min: 1 }),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const createFaqValidation = [
  body('question').notEmpty().isString().trim().withMessage('question is required'),
  body('answer').notEmpty().isString().withMessage('answer is required'),
  body('category').optional().isString().trim(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const updateFaqValidation = [
  ...idParam,
  body('question').optional().isString().trim(),
  body('answer').optional().isString(),
  body('category').optional().isString().trim(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const listFaqsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('category').optional().isString().trim(),
  query('status').optional().isIn(FAQ_STATUSES),
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const createTestimonialValidation = [
  body('customerName').notEmpty().isString().trim().withMessage('customerName is required'),
  body('review').notEmpty().isString().withMessage('review is required'),
  body('designation').optional().isString().trim(),
  body('company').optional().isString().trim(),
  body('imageId').optional().isInt({ min: 1 }),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(TESTIMONIAL_STATUSES),
];

export const updateTestimonialValidation = [
  ...idParam,
  body('customerName').optional().isString().trim(),
  body('review').optional().isString(),
  body('designation').optional().isString().trim(),
  body('company').optional().isString().trim(),
  body('imageId').optional().isInt({ min: 1 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('status').optional().isIn(TESTIMONIAL_STATUSES),
];

export const listTestimonialsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('status').optional().isIn(TESTIMONIAL_STATUSES),
  query('minRating').optional().isInt({ min: 1, max: 5 }),
];

// ─── Lookbook ─────────────────────────────────────────────────────────────────

export const createLookbookValidation = [
  body('collectionName').notEmpty().isString().trim().withMessage('collectionName is required'),
  body('season').optional().isString().trim(),
  body('description').optional().isString(),
  body('bannerImageId').optional().isInt({ min: 1 }),
  body('galleryImages').optional().isArray(),
  body('galleryImages.*').optional().isInt({ min: 1 }),
  body('status').optional().isIn(LOOKBOOK_STATUSES),
  optionalDate('publishedAt'),
];

export const updateLookbookValidation = [
  ...idParam,
  body('collectionName').optional().isString().trim(),
  body('season').optional().isString().trim(),
  body('description').optional().isString(),
  body('bannerImageId').optional().isInt({ min: 1 }),
  body('galleryImages').optional().isArray(),
  body('status').optional().isIn(LOOKBOOK_STATUSES),
  optionalDate('publishedAt'),
];

export const listLookbooksValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('season').optional().isString().trim(),
  query('status').optional().isIn(LOOKBOOK_STATUSES),
];

// ─── Style Guide ──────────────────────────────────────────────────────────────

export const createStyleGuideValidation = [
  body('guideName').notEmpty().isString().trim().withMessage('guideName is required'),
  body('description').optional().isString(),
  body('images').optional().isArray(),
  body('products').optional().isArray(),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const updateStyleGuideValidation = [
  ...idParam,
  body('guideName').optional().isString().trim(),
  body('description').optional().isString(),
  body('images').optional().isArray(),
  body('products').optional().isArray(),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const listStyleGuidesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('status').optional().isIn(FAQ_STATUSES),
];

// ─── Size Guide ───────────────────────────────────────────────────────────────

export const createSizeGuideValidation = [
  body('category').notEmpty().isString().trim().withMessage('category is required'),
  body('brand').optional().isString().trim(),
  body('measurementUnit').optional().isString().trim(),
  body('chart').notEmpty().withMessage('chart is required').isObject(),
  body('images').optional().isArray(),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const updateSizeGuideValidation = [
  ...idParam,
  body('category').optional().isString().trim(),
  body('brand').optional().isString().trim(),
  body('measurementUnit').optional().isString().trim(),
  body('chart').optional().isObject(),
  body('images').optional().isArray(),
  body('status').optional().isIn(FAQ_STATUSES),
];

export const listSizeGuidesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('category').optional().isString().trim(),
  query('status').optional().isIn(FAQ_STATUSES),
];

// ─── Policy ───────────────────────────────────────────────────────────────────

export const createPolicyValidation = [
  body('policyType').notEmpty().isIn(POLICY_TYPES).withMessage(`policyType must be one of: ${POLICY_TYPES.join(', ')}`),
  body('title').notEmpty().isString().trim().withMessage('title is required'),
  body('content').notEmpty().isString().withMessage('content is required'),
  body('isActive').optional().isBoolean(),
];

export const updatePolicyValidation = [
  ...idParam,
  body('title').optional().isString().trim(),
  body('content').optional().isString(),
  body('isActive').optional().isBoolean(),
];

// ─── Contact Info ─────────────────────────────────────────────────────────────

export const createContactInfoValidation = [
  body('companyName').notEmpty().isString().trim().withMessage('companyName is required'),
  body('address').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('email').optional().isEmail().withMessage('valid email is required'),
  body('whatsapp').optional().isString().trim(),
  body('googleMapUrl').optional().isURL().withMessage('valid URL is required'),
  body('businessHours').optional().isObject(),
];

export const updateContactInfoValidation = [
  ...idParam,
  body('companyName').optional().isString().trim(),
  body('address').optional().isString().trim(),
  body('phone').optional().isString().trim(),
  body('email').optional().isEmail(),
  body('whatsapp').optional().isString().trim(),
  body('googleMapUrl').optional().isURL(),
  body('businessHours').optional().isObject(),
];

// ─── Contact Inquiry ──────────────────────────────────────────────────────────

export const createContactInquiryValidation = [
  body('customerName').notEmpty().isString().trim().withMessage('customerName is required'),
  body('email').notEmpty().isEmail().withMessage('valid email is required'),
  body('mobile').optional().isString().trim(),
  body('subject').notEmpty().isString().trim().withMessage('subject is required'),
  body('message').notEmpty().isString().withMessage('message is required'),
  body('attachmentId').optional().isInt({ min: 1 }),
];

export const updateContactInquiryValidation = [
  ...idParam,
  body('status').optional().isIn(INQUIRY_STATUSES),
  body('assignedTo').optional().isInt({ min: 1 }),
  optionalDate('resolvedAt'),
];

export const listContactInquiriesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('status').optional().isIn(INQUIRY_STATUSES),
  query('assignedTo').optional().isInt({ min: 1 }),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
];

// ─── Dynamic Menu ─────────────────────────────────────────────────────────────

export const createDynamicMenuValidation = [
  body('menuCode').notEmpty().isString().trim().withMessage('menuCode is required'),
  body('menuType').notEmpty().isIn(MENU_TYPES).withMessage(`menuType must be one of: ${MENU_TYPES.join(', ')}`),
  body('title').notEmpty().isString().trim().withMessage('title is required'),
  body('items').notEmpty().isArray().withMessage('items must be an array'),
  body('displayOrder').optional().isInt({ min: 0 }),
];

export const updateDynamicMenuValidation = [
  ...idParam,
  body('title').optional().isString().trim(),
  body('menuType').optional().isIn(MENU_TYPES),
  body('items').optional().isArray(),
  body('isActive').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
];

export const listDynamicMenusValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('menuType').optional().isIn(MENU_TYPES),
  query('isActive').optional().isBoolean(),
];

// ─── Footer Config ────────────────────────────────────────────────────────────

export const createFooterConfigValidation = [
  body('configCode').notEmpty().isString().trim().withMessage('configCode is required'),
  body('columns').optional().isObject(),
  body('quickLinks').optional().isObject(),
  body('categories').optional().isObject(),
  body('services').optional().isObject(),
  body('newsletter').optional().isObject(),
  body('copyright').optional().isString().trim(),
];

export const updateFooterConfigValidation = [
  ...idParam,
  body('columns').optional().isObject(),
  body('quickLinks').optional().isObject(),
  body('categories').optional().isObject(),
  body('services').optional().isObject(),
  body('newsletter').optional().isObject(),
  body('copyright').optional().isString().trim(),
  body('isActive').optional().isBoolean(),
];

// ─── Social Media Links ───────────────────────────────────────────────────────

export const createSocialLinkValidation = [
  body('platform').notEmpty().isString().trim().withMessage('platform is required'),
  body('url').notEmpty().isURL().withMessage('valid URL is required'),
  body('iconClass').optional().isString().trim(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

export const updateSocialLinkValidation = [
  ...idParam,
  body('url').optional().isURL(),
  body('iconClass').optional().isString().trim(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }),
];

// ─── SEO Meta ─────────────────────────────────────────────────────────────────

export const createSeoMetaValidation = [
  body('pageType').notEmpty().isIn(SEO_PAGE_TYPES).withMessage(`pageType must be one of: ${SEO_PAGE_TYPES.join(', ')}`),
  body('referenceId').optional().isInt({ min: 1 }),
  slugField('slug'),
  body('metaTitle').optional().isString().trim().isLength({ max: 70 }).withMessage('metaTitle max 70 chars'),
  body('metaDesc').optional().isString().trim().isLength({ max: 160 }).withMessage('metaDesc max 160 chars'),
  body('metaKeywords').optional().isString().trim(),
  body('canonicalUrl').optional().isURL(),
  body('robotsMeta').optional().isString().trim(),
  body('ogTitle').optional().isString().trim(),
  body('ogDescription').optional().isString().trim(),
  body('ogImageId').optional().isInt({ min: 1 }),
  body('twitterTitle').optional().isString().trim(),
  body('twitterDesc').optional().isString().trim(),
  body('twitterCard').optional().isIn(['summary', 'summary_large_image', 'app', 'player']),
  body('schemaJson').optional().isObject(),
  body('cmsPageId').optional().isInt({ min: 1 }),
  body('blogPostId').optional().isInt({ min: 1 }),
];

export const updateSeoMetaValidation = [
  ...idParam,
  body('metaTitle').optional().isString().trim().isLength({ max: 70 }),
  body('metaDesc').optional().isString().trim().isLength({ max: 160 }),
  body('metaKeywords').optional().isString().trim(),
  body('canonicalUrl').optional().isURL(),
  body('robotsMeta').optional().isString().trim(),
  body('ogTitle').optional().isString().trim(),
  body('ogDescription').optional().isString().trim(),
  body('ogImageId').optional().isInt({ min: 1 }),
  body('twitterTitle').optional().isString().trim(),
  body('twitterDesc').optional().isString().trim(),
  body('twitterCard').optional().isIn(['summary', 'summary_large_image', 'app', 'player']),
  body('schemaJson').optional().isObject(),
];

export const listSeoMetaValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('pageType').optional().isIn(SEO_PAGE_TYPES),
  query('referenceId').optional().isInt({ min: 1 }),
];

// ─── Redirect ─────────────────────────────────────────────────────────────────

export const createRedirectValidation = [
  body('sourceUrl').notEmpty().isString().trim().withMessage('sourceUrl is required'),
  body('destinationUrl').notEmpty().isString().trim().withMessage('destinationUrl is required'),
  body('redirectType').optional().isIn(REDIRECT_TYPES),
  body('isActive').optional().isBoolean(),
];

export const updateRedirectValidation = [
  ...idParam,
  body('destinationUrl').optional().isString().trim(),
  body('redirectType').optional().isIn(REDIRECT_TYPES),
  body('isActive').optional().isBoolean(),
];

export const listRedirectsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('redirectType').optional().isIn(REDIRECT_TYPES),
  query('isActive').optional().isBoolean(),
];

// ─── URL Rewrite ──────────────────────────────────────────────────────────────

export const createUrlRewriteValidation = [
  body('oldUrl').notEmpty().isString().trim().withMessage('oldUrl is required'),
  body('newUrl').notEmpty().isString().trim().withMessage('newUrl is required'),
  body('isActive').optional().isBoolean(),
];

export const updateUrlRewriteValidation = [
  ...idParam,
  body('newUrl').optional().isString().trim(),
  body('isActive').optional().isBoolean(),
];

export const listUrlRewritesValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('isActive').optional().isBoolean(),
];

// ─── Robots.txt ───────────────────────────────────────────────────────────────

export const updateRobotsConfigValidation = [
  body('content').notEmpty().isString().withMessage('content is required'),
];

// ─── Content Versions ─────────────────────────────────────────────────────────

export const listContentVersionsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 100 }),
  query('entityType').optional().isString().trim(),
  query('entityId').optional().isInt({ min: 1 }),
];

export const rollbackVersionValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
  body('versionId').notEmpty().isInt({ min: 1 }).withMessage('versionId is required'),
];
