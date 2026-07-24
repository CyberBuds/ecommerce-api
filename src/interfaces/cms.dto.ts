// CMS, Content Management & SEO — DTOs

// ─── Enums ───────────────────────────────────────────────────────────────────

export type CmsPageStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type CmsPageType = 'LANDING' | 'CONTENT' | 'HOME' | 'CATEGORY' | 'CUSTOM';
export type CmsVisibility = 'PUBLIC' | 'PRIVATE' | 'PASSWORD_PROTECTED';
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type FaqStatus = 'ACTIVE' | 'INACTIVE';
export type TestimonialStatus = 'ACTIVE' | 'INACTIVE';
export type LookbookStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type PolicyType =
  | 'PRIVACY_POLICY'
  | 'TERMS_AND_CONDITIONS'
  | 'REFUND_POLICY'
  | 'SHIPPING_POLICY'
  | 'CANCELLATION_POLICY'
  | 'COOKIE_POLICY';
export type ContactInquiryStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type MenuType = 'HEADER' | 'MEGA' | 'FOOTER' | 'MOBILE';
export type RedirectType = 'PERMANENT_301' | 'TEMPORARY_302';
export type SeoPageType = 'HOME' | 'PRODUCT' | 'CATEGORY' | 'BLOG' | 'CMS_PAGE' | 'LANDING_PAGE' | 'BRAND' | 'CUSTOM';
export type ContentVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// ─── CMS Page ─────────────────────────────────────────────────────────────────

export interface CreateCmsPageDto {
  pageCode: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  content?: string;
  featuredImageId?: number;
  template?: string;
  layout?: string;
  pageType?: CmsPageType;
  visibility?: CmsVisibility;
  status?: CmsPageStatus;
  publishedAt?: string;
}

export interface UpdateCmsPageDto {
  title?: string;
  slug?: string;
  shortDescription?: string;
  content?: string;
  featuredImageId?: number;
  template?: string;
  layout?: string;
  pageType?: CmsPageType;
  visibility?: CmsVisibility;
  status?: CmsPageStatus;
  publishedAt?: string;
}

export interface CmsPageQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  pageType?: CmsPageType;
  status?: CmsPageStatus;
  visibility?: CmsVisibility;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Blog Category ────────────────────────────────────────────────────────────

export interface CreateBlogCategoryDto {
  categoryName: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  status?: FaqStatus;
}

export interface UpdateBlogCategoryDto {
  categoryName?: string;
  slug?: string;
  description?: string;
  displayOrder?: number;
  status?: FaqStatus;
}

export interface BlogCategoryQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: FaqStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Blog Tag ─────────────────────────────────────────────────────────────────

export interface CreateBlogTagDto {
  tagName: string;
  slug?: string;
}

export interface UpdateBlogTagDto {
  tagName?: string;
  slug?: string;
}

export interface BlogTagQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Blog Post ────────────────────────────────────────────────────────────────

export interface CreateBlogPostDto {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImageId?: number;
  authorId?: number;
  categoryId?: number;
  tagIds?: number[];
  readingTime?: number;
  commentsEnabled?: boolean;
  status?: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
}

export interface UpdateBlogPostDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImageId?: number;
  authorId?: number;
  categoryId?: number;
  tagIds?: number[];
  readingTime?: number;
  commentsEnabled?: boolean;
  status?: BlogStatus;
  publishedAt?: string;
  scheduledAt?: string;
}

export interface BlogPostQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: BlogStatus;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface CreateFaqDto {
  question: string;
  answer: string;
  category?: string;
  displayOrder?: number;
  status?: FaqStatus;
}

export interface UpdateFaqDto {
  question?: string;
  answer?: string;
  category?: string;
  displayOrder?: number;
  status?: FaqStatus;
}

export interface FaqQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: FaqStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface CreateTestimonialDto {
  customerName: string;
  designation?: string;
  company?: string;
  imageId?: number;
  review: string;
  rating?: number;
  displayOrder?: number;
  status?: TestimonialStatus;
}

export interface UpdateTestimonialDto {
  customerName?: string;
  designation?: string;
  company?: string;
  imageId?: number;
  review?: string;
  rating?: number;
  displayOrder?: number;
  status?: TestimonialStatus;
}

export interface TestimonialQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TestimonialStatus;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Lookbook ─────────────────────────────────────────────────────────────────

export interface CreateLookbookDto {
  collectionName: string;
  season?: string;
  description?: string;
  bannerImageId?: number;
  galleryImages?: number[];
  status?: LookbookStatus;
  publishedAt?: string;
}

export interface UpdateLookbookDto {
  collectionName?: string;
  season?: string;
  description?: string;
  bannerImageId?: number;
  galleryImages?: number[];
  status?: LookbookStatus;
  publishedAt?: string;
}

export interface LookbookQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  season?: string;
  status?: LookbookStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Style Guide ──────────────────────────────────────────────────────────────

export interface CreateStyleGuideDto {
  guideName: string;
  description?: string;
  images?: number[];
  products?: number[];
  status?: FaqStatus;
}

export interface UpdateStyleGuideDto {
  guideName?: string;
  description?: string;
  images?: number[];
  products?: number[];
  status?: FaqStatus;
}

export interface StyleGuideQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: FaqStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Size Guide ───────────────────────────────────────────────────────────────

export interface CreateSizeGuideDto {
  category: string;
  brand?: string;
  measurementUnit?: string;
  chart: Record<string, unknown>;
  images?: number[];
  status?: FaqStatus;
}

export interface UpdateSizeGuideDto {
  category?: string;
  brand?: string;
  measurementUnit?: string;
  chart?: Record<string, unknown>;
  images?: number[];
  status?: FaqStatus;
}

export interface SizeGuideQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  status?: FaqStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Policy ───────────────────────────────────────────────────────────────────

export interface CreatePolicyDto {
  policyType: PolicyType;
  title: string;
  content: string;
  isActive?: boolean;
}

export interface UpdatePolicyDto {
  title?: string;
  content?: string;
  isActive?: boolean;
}

export interface PolicyQuery {
  page?: number;
  pageSize?: number;
  policyType?: PolicyType;
  isActive?: boolean;
}

// ─── Contact Info ─────────────────────────────────────────────────────────────

export interface CreateContactInfoDto {
  companyName: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  googleMapUrl?: string;
  businessHours?: Record<string, string>;
  isActive?: boolean;
}

export interface UpdateContactInfoDto {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  googleMapUrl?: string;
  businessHours?: Record<string, string>;
  isActive?: boolean;
}

// ─── Contact Inquiry ──────────────────────────────────────────────────────────

export interface CreateContactInquiryDto {
  customerName: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  attachmentId?: number;
}

export interface UpdateContactInquiryDto {
  status?: ContactInquiryStatus;
  assignedTo?: number;
  resolvedAt?: string;
}

export interface ContactInquiryQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ContactInquiryStatus;
  assignedTo?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Dynamic Menu ─────────────────────────────────────────────────────────────

export interface CreateDynamicMenuDto {
  menuCode: string;
  menuType: MenuType;
  title: string;
  items: unknown[];
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateDynamicMenuDto {
  title?: string;
  menuType?: MenuType;
  items?: unknown[];
  isActive?: boolean;
  displayOrder?: number;
}

export interface DynamicMenuQuery {
  page?: number;
  pageSize?: number;
  menuType?: MenuType;
  isActive?: boolean;
}

// ─── Footer Config ────────────────────────────────────────────────────────────

export interface CreateFooterConfigDto {
  configCode: string;
  columns?: unknown;
  quickLinks?: unknown;
  categories?: unknown;
  services?: unknown;
  newsletter?: unknown;
  copyright?: string;
  isActive?: boolean;
}

export interface UpdateFooterConfigDto {
  columns?: unknown;
  quickLinks?: unknown;
  categories?: unknown;
  services?: unknown;
  newsletter?: unknown;
  copyright?: string;
  isActive?: boolean;
}

// ─── Social Media Link ────────────────────────────────────────────────────────

export interface CreateSocialMediaLinkDto {
  platform: string;
  url: string;
  iconClass?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSocialMediaLinkDto {
  url?: string;
  iconClass?: string;
  isActive?: boolean;
  sortOrder?: number;
}

// ─── SEO Meta ─────────────────────────────────────────────────────────────────

export interface CreateSeoMetaDto {
  pageType: SeoPageType;
  referenceId?: number;
  slug?: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: number;
  twitterTitle?: string;
  twitterDesc?: string;
  twitterCard?: string;
  schemaJson?: Record<string, unknown>;
  cmsPageId?: number;
  blogPostId?: number;
}

export interface UpdateSeoMetaDto {
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: number;
  twitterTitle?: string;
  twitterDesc?: string;
  twitterCard?: string;
  schemaJson?: Record<string, unknown>;
}

export interface SeoMetaQuery {
  page?: number;
  pageSize?: number;
  pageType?: SeoPageType;
  referenceId?: number;
}

// ─── Redirect ─────────────────────────────────────────────────────────────────

export interface CreateRedirectDto {
  sourceUrl: string;
  destinationUrl: string;
  redirectType?: RedirectType;
  isActive?: boolean;
}

export interface UpdateRedirectDto {
  destinationUrl?: string;
  redirectType?: RedirectType;
  isActive?: boolean;
}

export interface RedirectQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  redirectType?: RedirectType;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── URL Rewrite ──────────────────────────────────────────────────────────────

export interface CreateUrlRewriteDto {
  oldUrl: string;
  newUrl: string;
  isActive?: boolean;
}

export interface UpdateUrlRewriteDto {
  newUrl?: string;
  isActive?: boolean;
}

export interface UrlRewriteQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

// ─── Robots.txt ───────────────────────────────────────────────────────────────

export interface UpdateRobotsConfigDto {
  content: string;
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

export interface SitemapQuery {
  includeProducts?: boolean;
  includeCategories?: boolean;
  includeBrands?: boolean;
  includeBlogs?: boolean;
  includeCmsPages?: boolean;
  includeLandingPages?: boolean;
}

// ─── Content Version ──────────────────────────────────────────────────────────

export interface ContentVersionQuery {
  page?: number;
  pageSize?: number;
  entityType?: string;
  entityId?: number;
  changedBy?: number;
}

export interface RollbackVersionDto {
  versionId: number;
}
