import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import CmsRepository from '../repositories/cms.repository';
import {
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CmsPageQuery,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  BlogCategoryQuery,
  CreateBlogTagDto,
  UpdateBlogTagDto,
  BlogTagQuery,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostQuery,
  CreateFaqDto,
  UpdateFaqDto,
  FaqQuery,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  TestimonialQuery,
  CreateLookbookDto,
  UpdateLookbookDto,
  LookbookQuery,
  CreateStyleGuideDto,
  UpdateStyleGuideDto,
  StyleGuideQuery,
  CreateSizeGuideDto,
  UpdateSizeGuideDto,
  SizeGuideQuery,
  CreatePolicyDto,
  UpdatePolicyDto,
  PolicyQuery,
  CreateContactInfoDto,
  UpdateContactInfoDto,
  CreateContactInquiryDto,
  UpdateContactInquiryDto,
  ContactInquiryQuery,
  CreateDynamicMenuDto,
  UpdateDynamicMenuDto,
  DynamicMenuQuery,
  CreateFooterConfigDto,
  UpdateFooterConfigDto,
  CreateSocialMediaLinkDto,
  UpdateSocialMediaLinkDto,
  CreateSeoMetaDto,
  UpdateSeoMetaDto,
  SeoMetaQuery,
  CreateRedirectDto,
  UpdateRedirectDto,
  RedirectQuery,
  CreateUrlRewriteDto,
  UpdateUrlRewriteDto,
  UrlRewriteQuery,
  UpdateRobotsConfigDto,
  SitemapQuery,
  ContentVersionQuery,
} from '../interfaces/cms.dto';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseDate(value?: string): Date | undefined {
  return value ? new Date(value) : undefined;
}

export default class CmsService {
  constructor(private readonly repository: CmsRepository) {}

  // ─── CMS Pages ─────────────────────────────────────────────────────────────

  async createCmsPage(dto: CreateCmsPageDto, actorId?: number) {
    const slug = dto.slug ?? generateSlug(dto.title);

    const existing = await this.repository.findCmsPageBySlug(slug);
    if (existing) {
      throw new AppError(`CMS page with slug "${slug}" already exists`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }

    const codeExists = await this.repository.findCmsPageByCode(dto.pageCode);
    if (codeExists) {
      throw new AppError(`pageCode "${dto.pageCode}" is already in use`, HTTP_STATUS.CONFLICT, 'PAGE_CODE_CONFLICT');
    }

    const page = await this.repository.createCmsPage({
      ...dto,
      slug,
      status: dto.status ?? 'DRAFT',
      pageType: dto.pageType ?? 'CONTENT',
      visibility: dto.visibility ?? 'PUBLIC',
      publishedAt: parseDate(dto.publishedAt),
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    });

    await this.snapshotVersion('CmsPage', page.id, page, actorId);
    return page;
  }

  async listCmsPages(query: CmsPageQuery) {
    return this.repository.listCmsPages(query);
  }

  async getCmsPage(id: number) {
    const page = await this.repository.findCmsPageById(id);
    if (!page) throw new AppError('CMS page not found', HTTP_STATUS.NOT_FOUND, 'CMS_PAGE_NOT_FOUND');
    return page;
  }

  async getCmsPageBySlug(slug: string) {
    return this.repository.findCmsPageBySlug(slug);
  }

  async updateCmsPage(id: number, dto: UpdateCmsPageDto, actorId?: number) {
    const existing = await this.repository.findCmsPageById(id);
    if (!existing) throw new AppError('CMS page not found', HTTP_STATUS.NOT_FOUND, 'CMS_PAGE_NOT_FOUND');

    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.repository.findCmsPageBySlug(dto.slug);
      if (conflict) throw new AppError(`Slug "${dto.slug}" is already in use`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }

    const updated = await this.repository.updateCmsPage(id, {
      ...dto,
      publishedAt: parseDate(dto.publishedAt),
      updatedBy: actorId ?? null,
    });

    await this.snapshotVersion('CmsPage', id, updated, actorId);
    return updated;
  }

  async deleteCmsPage(id: number) {
    const existing = await this.repository.findCmsPageById(id);
    if (!existing) throw new AppError('CMS page not found', HTTP_STATUS.NOT_FOUND, 'CMS_PAGE_NOT_FOUND');
    return this.repository.deleteCmsPage(id);
  }

  // ─── Blog Categories ───────────────────────────────────────────────────────

  async createBlogCategory(dto: CreateBlogCategoryDto, actorId?: number) {
    const slug = dto.slug ?? generateSlug(dto.categoryName);
    const existing = await this.repository.findBlogCategoryBySlug(slug);
    if (existing) throw new AppError(`Blog category slug "${slug}" already exists`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');

    return this.repository.createBlogCategory({ ...dto, slug, status: dto.status ?? 'ACTIVE' });
  }

  async listBlogCategories(query: BlogCategoryQuery) {
    return this.repository.listBlogCategories(query);
  }

  async getBlogCategory(id: number) {
    const cat = await this.repository.findBlogCategoryById(id);
    if (!cat) throw new AppError('Blog category not found', HTTP_STATUS.NOT_FOUND, 'BLOG_CATEGORY_NOT_FOUND');
    return cat;
  }

  async updateBlogCategory(id: number, dto: UpdateBlogCategoryDto) {
    const existing = await this.repository.findBlogCategoryById(id);
    if (!existing) throw new AppError('Blog category not found', HTTP_STATUS.NOT_FOUND, 'BLOG_CATEGORY_NOT_FOUND');

    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.repository.findBlogCategoryBySlug(dto.slug);
      if (conflict) throw new AppError(`Slug "${dto.slug}" already in use`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }

    return this.repository.updateBlogCategory(id, dto as Record<string, unknown>);
  }

  async deleteBlogCategory(id: number) {
    const existing = await this.repository.findBlogCategoryById(id);
    if (!existing) throw new AppError('Blog category not found', HTTP_STATUS.NOT_FOUND, 'BLOG_CATEGORY_NOT_FOUND');
    return this.repository.deleteBlogCategory(id);
  }

  // ─── Blog Tags ─────────────────────────────────────────────────────────────

  async createBlogTag(dto: CreateBlogTagDto) {
    const slug = dto.slug ?? generateSlug(dto.tagName);
    const existing = await this.repository.findBlogTagBySlug(slug);
    if (existing) throw new AppError(`Blog tag slug "${slug}" already exists`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');

    return this.repository.createBlogTag({ ...dto, slug });
  }

  async listBlogTags(query: BlogTagQuery) {
    return this.repository.listBlogTags(query);
  }

  async getBlogTag(id: number) {
    const tag = await this.repository.findBlogTagById(id);
    if (!tag) throw new AppError('Blog tag not found', HTTP_STATUS.NOT_FOUND, 'BLOG_TAG_NOT_FOUND');
    return tag;
  }

  async updateBlogTag(id: number, dto: UpdateBlogTagDto) {
    const existing = await this.repository.findBlogTagById(id);
    if (!existing) throw new AppError('Blog tag not found', HTTP_STATUS.NOT_FOUND, 'BLOG_TAG_NOT_FOUND');

    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.repository.findBlogTagBySlug(dto.slug);
      if (conflict) throw new AppError(`Slug "${dto.slug}" already in use`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }

    return this.repository.updateBlogTag(id, dto as Record<string, unknown>);
  }

  async deleteBlogTag(id: number) {
    const existing = await this.repository.findBlogTagById(id);
    if (!existing) throw new AppError('Blog tag not found', HTTP_STATUS.NOT_FOUND, 'BLOG_TAG_NOT_FOUND');
    return this.repository.deleteBlogTag(id);
  }

  // ─── Blog Posts ────────────────────────────────────────────────────────────

  async createBlogPost(dto: CreateBlogPostDto, actorId?: number) {
    const slug = dto.slug ?? generateSlug(dto.title);

    const existing = await this.repository.findBlogPostBySlug(slug);
    if (existing) throw new AppError(`Blog post slug "${slug}" already exists`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');

    const { tagIds, ...rest } = dto;
    const post = await this.repository.createBlogPost({
      ...rest,
      slug,
      status: dto.status ?? 'DRAFT',
      publishedAt: parseDate(dto.publishedAt),
      scheduledAt: parseDate(dto.scheduledAt),
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    });

    if (tagIds && tagIds.length > 0) {
      await this.repository.setBlogPostTags(post.id, tagIds);
    }

    await this.snapshotVersion('BlogPost', post.id, post, actorId);
    return this.repository.findBlogPostById(post.id);
  }

  async listBlogPosts(query: BlogPostQuery) {
    return this.repository.listBlogPosts(query);
  }

  async getBlogPost(id: number) {
    const post = await this.repository.findBlogPostById(id);
    if (!post) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND, 'BLOG_POST_NOT_FOUND');
    return post;
  }

  async getBlogPostBySlug(slug: string) {
    const post = await this.repository.findBlogPostBySlug(slug);
    if (!post) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND, 'BLOG_POST_NOT_FOUND');
    await this.repository.incrementBlogPostViews(post.id);
    return post;
  }

  async updateBlogPost(id: number, dto: UpdateBlogPostDto, actorId?: number) {
    const existing = await this.repository.findBlogPostById(id);
    if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND, 'BLOG_POST_NOT_FOUND');

    if (dto.slug && dto.slug !== existing.slug) {
      const conflict = await this.repository.findBlogPostBySlug(dto.slug);
      if (conflict) throw new AppError(`Slug "${dto.slug}" already in use`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }

    const { tagIds, ...rest } = dto;
    const updated = await this.repository.updateBlogPost(id, {
      ...rest,
      publishedAt: parseDate(dto.publishedAt),
      scheduledAt: parseDate(dto.scheduledAt),
      updatedBy: actorId ?? null,
    });

    if (tagIds !== undefined) {
      await this.repository.setBlogPostTags(id, tagIds);
    }

    await this.snapshotVersion('BlogPost', id, updated, actorId);
    return this.repository.findBlogPostById(id);
  }

  async deleteBlogPost(id: number) {
    const existing = await this.repository.findBlogPostById(id);
    if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND, 'BLOG_POST_NOT_FOUND');
    return this.repository.deleteBlogPost(id);
  }

  // ─── FAQs ──────────────────────────────────────────────────────────────────

  async createFaq(dto: CreateFaqDto, actorId?: number) {
    return this.repository.createFaq({ ...dto, status: dto.status ?? 'ACTIVE', createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listFaqs(query: FaqQuery) {
    return this.repository.listFaqs(query);
  }

  async getFaq(id: number) {
    const faq = await this.repository.findFaqById(id);
    if (!faq) throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND, 'FAQ_NOT_FOUND');
    return faq;
  }

  async updateFaq(id: number, dto: UpdateFaqDto, actorId?: number) {
    const existing = await this.repository.findFaqById(id);
    if (!existing) throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND, 'FAQ_NOT_FOUND');
    return this.repository.updateFaq(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteFaq(id: number) {
    const existing = await this.repository.findFaqById(id);
    if (!existing) throw new AppError('FAQ not found', HTTP_STATUS.NOT_FOUND, 'FAQ_NOT_FOUND');
    return this.repository.deleteFaq(id);
  }

  // ─── Testimonials ──────────────────────────────────────────────────────────

  async createTestimonial(dto: CreateTestimonialDto, actorId?: number) {
    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      throw new AppError('Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST, 'INVALID_RATING');
    }
    return this.repository.createTestimonial({ ...dto, status: dto.status ?? 'ACTIVE', createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listTestimonials(query: TestimonialQuery) {
    return this.repository.listTestimonials(query);
  }

  async getTestimonial(id: number) {
    const t = await this.repository.findTestimonialById(id);
    if (!t) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND, 'TESTIMONIAL_NOT_FOUND');
    return t;
  }

  async updateTestimonial(id: number, dto: UpdateTestimonialDto, actorId?: number) {
    const existing = await this.repository.findTestimonialById(id);
    if (!existing) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND, 'TESTIMONIAL_NOT_FOUND');
    if (dto.rating !== undefined && (dto.rating < 1 || dto.rating > 5)) {
      throw new AppError('Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST, 'INVALID_RATING');
    }
    return this.repository.updateTestimonial(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteTestimonial(id: number) {
    const existing = await this.repository.findTestimonialById(id);
    if (!existing) throw new AppError('Testimonial not found', HTTP_STATUS.NOT_FOUND, 'TESTIMONIAL_NOT_FOUND');
    return this.repository.deleteTestimonial(id);
  }

  // ─── Lookbooks ─────────────────────────────────────────────────────────────

  async createLookbook(dto: CreateLookbookDto, actorId?: number) {
    return this.repository.createLookbook({
      ...dto,
      galleryImages: dto.galleryImages ?? [],
      status: dto.status ?? 'DRAFT',
      publishedAt: parseDate(dto.publishedAt),
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    });
  }

  async listLookbooks(query: LookbookQuery) {
    return this.repository.listLookbooks(query);
  }

  async getLookbook(id: number) {
    const lb = await this.repository.findLookbookById(id);
    if (!lb) throw new AppError('Lookbook not found', HTTP_STATUS.NOT_FOUND, 'LOOKBOOK_NOT_FOUND');
    return lb;
  }

  async updateLookbook(id: number, dto: UpdateLookbookDto, actorId?: number) {
    const existing = await this.repository.findLookbookById(id);
    if (!existing) throw new AppError('Lookbook not found', HTTP_STATUS.NOT_FOUND, 'LOOKBOOK_NOT_FOUND');
    return this.repository.updateLookbook(id, { ...dto, publishedAt: parseDate(dto.publishedAt), updatedBy: actorId ?? null });
  }

  async deleteLookbook(id: number) {
    const existing = await this.repository.findLookbookById(id);
    if (!existing) throw new AppError('Lookbook not found', HTTP_STATUS.NOT_FOUND, 'LOOKBOOK_NOT_FOUND');
    return this.repository.deleteLookbook(id);
  }

  // ─── Style Guides ──────────────────────────────────────────────────────────

  async createStyleGuide(dto: CreateStyleGuideDto, actorId?: number) {
    return this.repository.createStyleGuide({ ...dto, images: dto.images ?? [], products: dto.products ?? [], status: dto.status ?? 'ACTIVE', createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listStyleGuides(query: StyleGuideQuery) {
    return this.repository.listStyleGuides(query);
  }

  async getStyleGuide(id: number) {
    const sg = await this.repository.findStyleGuideById(id);
    if (!sg) throw new AppError('Style guide not found', HTTP_STATUS.NOT_FOUND, 'STYLE_GUIDE_NOT_FOUND');
    return sg;
  }

  async updateStyleGuide(id: number, dto: UpdateStyleGuideDto, actorId?: number) {
    const existing = await this.repository.findStyleGuideById(id);
    if (!existing) throw new AppError('Style guide not found', HTTP_STATUS.NOT_FOUND, 'STYLE_GUIDE_NOT_FOUND');
    return this.repository.updateStyleGuide(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteStyleGuide(id: number) {
    const existing = await this.repository.findStyleGuideById(id);
    if (!existing) throw new AppError('Style guide not found', HTTP_STATUS.NOT_FOUND, 'STYLE_GUIDE_NOT_FOUND');
    return this.repository.deleteStyleGuide(id);
  }

  // ─── Size Guides ───────────────────────────────────────────────────────────

  async createSizeGuide(dto: CreateSizeGuideDto, actorId?: number) {
    return this.repository.createSizeGuide({ ...dto, images: dto.images ?? [], status: dto.status ?? 'ACTIVE', createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listSizeGuides(query: SizeGuideQuery) {
    return this.repository.listSizeGuides(query);
  }

  async getSizeGuide(id: number) {
    const sg = await this.repository.findSizeGuideById(id);
    if (!sg) throw new AppError('Size guide not found', HTTP_STATUS.NOT_FOUND, 'SIZE_GUIDE_NOT_FOUND');
    return sg;
  }

  async updateSizeGuide(id: number, dto: UpdateSizeGuideDto, actorId?: number) {
    const existing = await this.repository.findSizeGuideById(id);
    if (!existing) throw new AppError('Size guide not found', HTTP_STATUS.NOT_FOUND, 'SIZE_GUIDE_NOT_FOUND');
    return this.repository.updateSizeGuide(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteSizeGuide(id: number) {
    const existing = await this.repository.findSizeGuideById(id);
    if (!existing) throw new AppError('Size guide not found', HTTP_STATUS.NOT_FOUND, 'SIZE_GUIDE_NOT_FOUND');
    return this.repository.deleteSizeGuide(id);
  }

  // ─── Policies ──────────────────────────────────────────────────────────────

  async createPolicy(dto: CreatePolicyDto, actorId?: number) {
    const existing = await this.repository.findPolicyByType(dto.policyType);
    if (existing) {
      throw new AppError(`Policy of type "${dto.policyType}" already exists. Use update instead.`, HTTP_STATUS.CONFLICT, 'POLICY_EXISTS');
    }
    const policy = await this.repository.createPolicy({ ...dto, updatedBy: actorId ?? null });
    await this.snapshotVersion('Policy', policy.id, policy, actorId);
    return policy;
  }

  async listPolicies(query: PolicyQuery) {
    return this.repository.listPolicies(query);
  }

  async getPolicy(id: number) {
    const policy = await this.repository.findPolicyById(id);
    if (!policy) throw new AppError('Policy not found', HTTP_STATUS.NOT_FOUND, 'POLICY_NOT_FOUND');
    return policy;
  }

  async getPolicyByType(policyType: string) {
    const policy = await this.repository.findPolicyByType(policyType);
    if (!policy) throw new AppError('Policy not found', HTTP_STATUS.NOT_FOUND, 'POLICY_NOT_FOUND');
    return policy;
  }

  async updatePolicy(id: number, dto: UpdatePolicyDto, actorId?: number) {
    const existing = await this.repository.findPolicyById(id);
    if (!existing) throw new AppError('Policy not found', HTTP_STATUS.NOT_FOUND, 'POLICY_NOT_FOUND');
    const updated = await this.repository.updatePolicy(id, { ...dto, updatedBy: actorId ?? null });
    await this.snapshotVersion('Policy', id, updated, actorId);
    return updated;
  }

  // ─── Contact Info ──────────────────────────────────────────────────────────

  async getContactInfo() {
    return this.repository.findActiveContactInfo();
  }

  async createContactInfo(dto: CreateContactInfoDto, actorId?: number) {
    return this.repository.createContactInfo({ ...dto, updatedBy: actorId ?? null });
  }

  async updateContactInfo(id: number, dto: UpdateContactInfoDto, actorId?: number) {
    const existing = await this.repository.findContactInfoById(id);
    if (!existing) throw new AppError('Contact info not found', HTTP_STATUS.NOT_FOUND, 'CONTACT_INFO_NOT_FOUND');
    return this.repository.updateContactInfo(id, { ...dto, updatedBy: actorId ?? null });
  }

  // ─── Contact Inquiries ─────────────────────────────────────────────────────

  async createContactInquiry(dto: CreateContactInquiryDto) {
    return this.repository.createContactInquiry({ ...dto, status: 'NEW' });
  }

  async listContactInquiries(query: ContactInquiryQuery) {
    return this.repository.listContactInquiries(query);
  }

  async getContactInquiry(id: number) {
    const inquiry = await this.repository.findContactInquiryById(id);
    if (!inquiry) throw new AppError('Contact inquiry not found', HTTP_STATUS.NOT_FOUND, 'INQUIRY_NOT_FOUND');
    return inquiry;
  }

  async updateContactInquiry(id: number, dto: UpdateContactInquiryDto) {
    const existing = await this.repository.findContactInquiryById(id);
    if (!existing) throw new AppError('Contact inquiry not found', HTTP_STATUS.NOT_FOUND, 'INQUIRY_NOT_FOUND');

    const data: Record<string, unknown> = { ...dto };
    if (dto.status === 'RESOLVED' && !existing.resolvedAt) {
      data.resolvedAt = new Date();
    }

    return this.repository.updateContactInquiry(id, data);
  }

  async deleteContactInquiry(id: number) {
    const existing = await this.repository.findContactInquiryById(id);
    if (!existing) throw new AppError('Contact inquiry not found', HTTP_STATUS.NOT_FOUND, 'INQUIRY_NOT_FOUND');
    return this.repository.deleteContactInquiry(id);
  }

  // ─── Dynamic Menus ─────────────────────────────────────────────────────────

  async createDynamicMenu(dto: CreateDynamicMenuDto, actorId?: number) {
    const existing = await this.repository.findDynamicMenuByCode(dto.menuCode);
    if (existing) throw new AppError(`Menu code "${dto.menuCode}" already exists`, HTTP_STATUS.CONFLICT, 'MENU_CODE_CONFLICT');
    return this.repository.createDynamicMenu({ ...dto, createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listDynamicMenus(query: DynamicMenuQuery) {
    return this.repository.listDynamicMenus(query);
  }

  async getDynamicMenu(id: number) {
    const menu = await this.repository.findDynamicMenuById(id);
    if (!menu) throw new AppError('Menu not found', HTTP_STATUS.NOT_FOUND, 'MENU_NOT_FOUND');
    return menu;
  }

  async getDynamicMenuByType(menuType: string) {
    return this.repository.findDynamicMenuByType(menuType);
  }

  async updateDynamicMenu(id: number, dto: UpdateDynamicMenuDto, actorId?: number) {
    const existing = await this.repository.findDynamicMenuById(id);
    if (!existing) throw new AppError('Menu not found', HTTP_STATUS.NOT_FOUND, 'MENU_NOT_FOUND');
    return this.repository.updateDynamicMenu(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteDynamicMenu(id: number) {
    const existing = await this.repository.findDynamicMenuById(id);
    if (!existing) throw new AppError('Menu not found', HTTP_STATUS.NOT_FOUND, 'MENU_NOT_FOUND');
    return this.repository.deleteDynamicMenu(id);
  }

  // ─── Footer Config ─────────────────────────────────────────────────────────

  async getFooterConfig() {
    return this.repository.findActiveFooterConfig();
  }

  async createFooterConfig(dto: CreateFooterConfigDto, actorId?: number) {
    const existing = await this.repository.findFooterConfigByCode(dto.configCode);
    if (existing) throw new AppError(`Footer config code "${dto.configCode}" already exists`, HTTP_STATUS.CONFLICT, 'FOOTER_CONFIG_CONFLICT');
    return this.repository.createFooterConfig({ ...dto, updatedBy: actorId ?? null });
  }

  async updateFooterConfig(id: number, dto: UpdateFooterConfigDto, actorId?: number) {
    const existing = await this.repository.findFooterConfigById(id);
    if (!existing) throw new AppError('Footer config not found', HTTP_STATUS.NOT_FOUND, 'FOOTER_CONFIG_NOT_FOUND');
    return this.repository.updateFooterConfig(id, { ...dto, updatedBy: actorId ?? null });
  }

  // ─── Social Media Links ────────────────────────────────────────────────────

  async listSocialLinks() {
    return this.repository.listSocialLinks();
  }

  async createSocialLink(dto: CreateSocialMediaLinkDto) {
    const existing = await this.repository.findSocialLinkByPlatform(dto.platform);
    if (existing) throw new AppError(`Platform "${dto.platform}" already exists`, HTTP_STATUS.CONFLICT, 'PLATFORM_CONFLICT');
    return this.repository.createSocialLink({ ...dto, isActive: dto.isActive ?? true });
  }

  async updateSocialLink(id: number, dto: UpdateSocialMediaLinkDto) {
    const existing = await this.repository.findSocialLinkById(id);
    if (!existing) throw new AppError('Social link not found', HTTP_STATUS.NOT_FOUND, 'SOCIAL_LINK_NOT_FOUND');
    return this.repository.updateSocialLink(id, dto as Record<string, unknown>);
  }

  async deleteSocialLink(id: number) {
    const existing = await this.repository.findSocialLinkById(id);
    if (!existing) throw new AppError('Social link not found', HTTP_STATUS.NOT_FOUND, 'SOCIAL_LINK_NOT_FOUND');
    return this.repository.deleteSocialLink(id);
  }

  // ─── SEO Meta ──────────────────────────────────────────────────────────────

  async createSeoMeta(dto: CreateSeoMetaDto, actorId?: number) {
    if (dto.cmsPageId) {
      const conflict = await this.repository.findSeoMetaByCmsPage(dto.cmsPageId);
      if (conflict) throw new AppError('SEO meta for this CMS page already exists', HTTP_STATUS.CONFLICT, 'SEO_META_CONFLICT');
    }
    if (dto.blogPostId) {
      const conflict = await this.repository.findSeoMetaByBlogPost(dto.blogPostId);
      if (conflict) throw new AppError('SEO meta for this blog post already exists', HTTP_STATUS.CONFLICT, 'SEO_META_CONFLICT');
    }
    if (dto.slug) {
      const conflict = await this.repository.findSeoMetaBySlug(dto.slug);
      if (conflict) throw new AppError(`SEO slug "${dto.slug}" already exists`, HTTP_STATUS.CONFLICT, 'SLUG_CONFLICT');
    }
    return this.repository.createSeoMeta({ ...dto });
  }

  async listSeoMeta(query: SeoMetaQuery) {
    return this.repository.listSeoMeta(query);
  }

  async getSeoMeta(id: number) {
    const meta = await this.repository.findSeoMetaById(id);
    if (!meta) throw new AppError('SEO meta not found', HTTP_STATUS.NOT_FOUND, 'SEO_META_NOT_FOUND');
    return meta;
  }

  async getSeoMetaBySlug(slug: string) {
    return this.repository.findSeoMetaBySlug(slug);
  }

  async updateSeoMeta(id: number, dto: UpdateSeoMetaDto) {
    const existing = await this.repository.findSeoMetaById(id);
    if (!existing) throw new AppError('SEO meta not found', HTTP_STATUS.NOT_FOUND, 'SEO_META_NOT_FOUND');
    return this.repository.updateSeoMeta(id, dto as Record<string, unknown>);
  }

  async deleteSeoMeta(id: number) {
    const existing = await this.repository.findSeoMetaById(id);
    if (!existing) throw new AppError('SEO meta not found', HTTP_STATUS.NOT_FOUND, 'SEO_META_NOT_FOUND');
    return this.repository.deleteSeoMeta(id);
  }

  // ─── Redirects ─────────────────────────────────────────────────────────────

  async createRedirect(dto: CreateRedirectDto, actorId?: number) {
    if (dto.sourceUrl === dto.destinationUrl) {
      throw new AppError('Source and destination URLs must be different', HTTP_STATUS.BAD_REQUEST, 'REDIRECT_LOOP');
    }

    const existing = await this.repository.findRedirectBySource(dto.sourceUrl);
    if (existing) throw new AppError(`Redirect for "${dto.sourceUrl}" already exists`, HTTP_STATUS.CONFLICT, 'REDIRECT_CONFLICT');

    return this.repository.createRedirect({ ...dto, redirectType: dto.redirectType ?? 'PERMANENT_301', createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listRedirects(query: RedirectQuery) {
    return this.repository.listRedirects(query);
  }

  async getRedirect(id: number) {
    const redirect = await this.repository.findRedirectById(id);
    if (!redirect) throw new AppError('Redirect not found', HTTP_STATUS.NOT_FOUND, 'REDIRECT_NOT_FOUND');
    return redirect;
  }

  async resolveRedirect(sourceUrl: string) {
    const redirect = await this.repository.findRedirectBySource(sourceUrl);
    if (redirect && redirect.isActive) {
      await this.repository.incrementRedirectHit(redirect.id);
    }
    return redirect;
  }

  async updateRedirect(id: number, dto: UpdateRedirectDto, actorId?: number) {
    const existing = await this.repository.findRedirectById(id);
    if (!existing) throw new AppError('Redirect not found', HTTP_STATUS.NOT_FOUND, 'REDIRECT_NOT_FOUND');

    if (dto.destinationUrl && dto.destinationUrl === existing.sourceUrl) {
      throw new AppError('Destination URL would create a redirect loop', HTTP_STATUS.BAD_REQUEST, 'REDIRECT_LOOP');
    }

    return this.repository.updateRedirect(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteRedirect(id: number) {
    const existing = await this.repository.findRedirectById(id);
    if (!existing) throw new AppError('Redirect not found', HTTP_STATUS.NOT_FOUND, 'REDIRECT_NOT_FOUND');
    return this.repository.deleteRedirect(id);
  }

  // ─── URL Rewrites ──────────────────────────────────────────────────────────

  async createUrlRewrite(dto: CreateUrlRewriteDto, actorId?: number) {
    if (dto.oldUrl === dto.newUrl) {
      throw new AppError('Old and new URLs must be different', HTTP_STATUS.BAD_REQUEST, 'URL_REWRITE_LOOP');
    }

    const existing = await this.repository.findUrlRewriteByOldUrl(dto.oldUrl);
    if (existing) throw new AppError(`URL rewrite for "${dto.oldUrl}" already exists`, HTTP_STATUS.CONFLICT, 'URL_REWRITE_CONFLICT');

    return this.repository.createUrlRewrite({ ...dto, createdBy: actorId ?? null, updatedBy: actorId ?? null });
  }

  async listUrlRewrites(query: UrlRewriteQuery) {
    return this.repository.listUrlRewrites(query);
  }

  async getUrlRewrite(id: number) {
    const rewrite = await this.repository.findUrlRewriteById(id);
    if (!rewrite) throw new AppError('URL rewrite not found', HTTP_STATUS.NOT_FOUND, 'URL_REWRITE_NOT_FOUND');
    return rewrite;
  }

  async updateUrlRewrite(id: number, dto: UpdateUrlRewriteDto, actorId?: number) {
    const existing = await this.repository.findUrlRewriteById(id);
    if (!existing) throw new AppError('URL rewrite not found', HTTP_STATUS.NOT_FOUND, 'URL_REWRITE_NOT_FOUND');
    return this.repository.updateUrlRewrite(id, { ...dto, updatedBy: actorId ?? null });
  }

  async deleteUrlRewrite(id: number) {
    const existing = await this.repository.findUrlRewriteById(id);
    if (!existing) throw new AppError('URL rewrite not found', HTTP_STATUS.NOT_FOUND, 'URL_REWRITE_NOT_FOUND');
    return this.repository.deleteUrlRewrite(id);
  }

  // ─── Robots.txt ────────────────────────────────────────────────────────────

  async getRobotsTxt() {
    const config = await this.repository.findActiveRobotsConfig();
    if (!config) {
      return this.generateDefaultRobots();
    }
    return config.content as string;
  }

  async updateRobotsTxt(dto: UpdateRobotsConfigDto, actorId?: number) {
    const existing = await this.repository.findActiveRobotsConfig();
    if (existing) {
      return this.repository.updateRobotsConfig(existing.id, { content: dto.content, updatedBy: actorId ?? null });
    }
    return this.repository.createRobotsConfig({ content: dto.content, isActive: true, updatedBy: actorId ?? null });
  }

  private generateDefaultRobots(): string {
    return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: /sitemap.xml`;
  }

  // ─── Sitemap ───────────────────────────────────────────────────────────────

  async generateSitemap(query: SitemapQuery, baseUrl: string): Promise<string> {
    const entries = await this.repository.listActiveSitemapEntries();

    const urls: string[] = [];

    if (query.includeCmsPages !== false) {
      const pages = await this.repository.listCmsPages({ status: 'PUBLISHED', pageSize: 500 });
      pages.items.forEach((p: any) => {
        urls.push(`<url><loc>${baseUrl}/pages/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`);
      });
    }

    if (query.includeBlogs !== false) {
      const posts = await this.repository.listBlogPosts({ status: 'PUBLISHED', pageSize: 1000 });
      posts.items.forEach((p: any) => {
        urls.push(`<url><loc>${baseUrl}/blog/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`);
      });
    }

    entries.forEach((e: any) => {
      urls.push(`<url><loc>${e.url}</loc><changefreq>${e.changeFreq}</changefreq><priority>${e.priority}</priority><lastmod>${new Date(e.lastModified).toISOString()}</lastmod></url>`);
    });

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  }

  // ─── Content Version History ───────────────────────────────────────────────

  async listContentVersions(query: ContentVersionQuery) {
    return this.repository.listContentVersions(query);
  }

  async getContentVersion(id: number) {
    const version = await this.repository.findContentVersionById(id);
    if (!version) throw new AppError('Content version not found', HTTP_STATUS.NOT_FOUND, 'VERSION_NOT_FOUND');
    return version;
  }

  async rollbackVersion(entityId: number, versionId: number, actorId?: number) {
    const version = await this.repository.findContentVersionById(versionId);
    if (!version) throw new AppError('Version not found', HTTP_STATUS.NOT_FOUND, 'VERSION_NOT_FOUND');

    if (version.entityId !== entityId) {
      throw new AppError('Version does not belong to this entity', HTTP_STATUS.BAD_REQUEST, 'VERSION_MISMATCH');
    }

    const content = version.content as Record<string, unknown>;
    const { entityType } = version;

    let updated: any;

    if (entityType === 'CmsPage') {
      const existing = await this.repository.findCmsPageById(entityId);
      if (!existing) throw new AppError('CMS page not found', HTTP_STATUS.NOT_FOUND, 'CMS_PAGE_NOT_FOUND');
      updated = await this.repository.updateCmsPage(entityId, { ...content, updatedBy: actorId ?? null });
    } else if (entityType === 'BlogPost') {
      const existing = await this.repository.findBlogPostById(entityId);
      if (!existing) throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND, 'BLOG_POST_NOT_FOUND');
      updated = await this.repository.updateBlogPost(entityId, { ...content, updatedBy: actorId ?? null });
    } else if (entityType === 'Policy') {
      const existing = await this.repository.findPolicyById(entityId);
      if (!existing) throw new AppError('Policy not found', HTTP_STATUS.NOT_FOUND, 'POLICY_NOT_FOUND');
      updated = await this.repository.updatePolicy(entityId, { ...content, updatedBy: actorId ?? null });
    } else {
      throw new AppError(`Rollback not supported for entity type: ${entityType}`, HTTP_STATUS.BAD_REQUEST, 'ROLLBACK_NOT_SUPPORTED');
    }

    await this.snapshotVersion(entityType, entityId, updated, actorId);
    return updated;
  }

  // ─── Internal ──────────────────────────────────────────────────────────────

  private async snapshotVersion(entityType: string, entityId: number, content: unknown, actorId?: number) {
    const nextVersion = (await this.repository.getLatestVersionNumber(entityType, entityId)) + 1;

    const cmsPageId = entityType === 'CmsPage' ? entityId : undefined;
    const blogPostId = entityType === 'BlogPost' ? entityId : undefined;
    const policyId = entityType === 'Policy' ? entityId : undefined;

    await this.repository.createContentVersion({
      entityType,
      entityId,
      version: nextVersion,
      content: content as Record<string, unknown>,
      status: 'PUBLISHED',
      changedBy: actorId ?? null,
      changedAt: new Date(),
      cmsPageId: cmsPageId ?? null,
      blogPostId: blogPostId ?? null,
      policyId: policyId ?? null,
    });
  }
}

