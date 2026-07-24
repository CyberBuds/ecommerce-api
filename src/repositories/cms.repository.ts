import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import {
  CmsPageQuery,
  BlogCategoryQuery,
  BlogTagQuery,
  BlogPostQuery,
  FaqQuery,
  TestimonialQuery,
  LookbookQuery,
  StyleGuideQuery,
  SizeGuideQuery,
  PolicyQuery,
  ContactInquiryQuery,
  DynamicMenuQuery,
  SeoMetaQuery,
  RedirectQuery,
  UrlRewriteQuery,
  ContentVersionQuery,
} from '../interfaces/cms.dto';

const db = prisma as any;

function paged(query: { page?: number; pageSize?: number }) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
  return { page, pageSize, skip: (page - 1) * pageSize };
}

export default class CmsRepository {
  // ─── CMS Pages ────────────────────────────────────────────────────────────

  async findCmsPageById(id: number) {
    return db.cmsPage.findUnique({ where: { id }, include: { seoMeta: true } });
  }

  async findCmsPageBySlug(slug: string) {
    return db.cmsPage.findUnique({ where: { slug }, include: { seoMeta: true } });
  }

  async findCmsPageByCode(pageCode: string) {
    return db.cmsPage.findUnique({ where: { pageCode } });
  }

  async listCmsPages(query: CmsPageQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.pageType) where.pageType = query.pageType;
    if (query.visibility) where.visibility = query.visibility;

    const sortBy = ['title', 'createdAt', 'publishedAt'].includes(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'asc' ? 'asc' : 'desc' };

    const [items, total] = await Promise.all([
      db.cmsPage.findMany({ where, orderBy, skip, take: pageSize }),
      db.cmsPage.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createCmsPage(data: Record<string, unknown>) {
    return db.cmsPage.create({ data });
  }

  async updateCmsPage(id: number, data: Record<string, unknown>) {
    return db.cmsPage.update({ where: { id }, data });
  }

  async deleteCmsPage(id: number) {
    return db.cmsPage.delete({ where: { id } });
  }

  // ─── Blog Category ────────────────────────────────────────────────────────

  async findBlogCategoryById(id: number) {
    return db.blogCategory.findUnique({ where: { id } });
  }

  async findBlogCategoryBySlug(slug: string) {
    return db.blogCategory.findUnique({ where: { slug } });
  }

  async listBlogCategories(query: BlogCategoryQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { categoryName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;

    const orderBy = { displayOrder: 'asc' as const };
    const [items, total] = await Promise.all([
      db.blogCategory.findMany({ where, orderBy, skip, take: pageSize }),
      db.blogCategory.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createBlogCategory(data: Record<string, unknown>) {
    return db.blogCategory.create({ data });
  }

  async updateBlogCategory(id: number, data: Record<string, unknown>) {
    return db.blogCategory.update({ where: { id }, data });
  }

  async deleteBlogCategory(id: number) {
    return db.blogCategory.delete({ where: { id } });
  }

  // ─── Blog Tags ────────────────────────────────────────────────────────────

  async findBlogTagById(id: number) {
    return db.blogTag.findUnique({ where: { id } });
  }

  async findBlogTagBySlug(slug: string) {
    return db.blogTag.findUnique({ where: { slug } });
  }

  async listBlogTags(query: BlogTagQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.tagName = { contains: query.search, mode: 'insensitive' };
    }

    const orderBy = { tagName: 'asc' as const };
    const [items, total] = await Promise.all([
      db.blogTag.findMany({ where, orderBy, skip, take: pageSize }),
      db.blogTag.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createBlogTag(data: Record<string, unknown>) {
    return db.blogTag.create({ data });
  }

  async updateBlogTag(id: number, data: Record<string, unknown>) {
    return db.blogTag.update({ where: { id }, data });
  }

  async deleteBlogTag(id: number) {
    return db.blogTag.delete({ where: { id } });
  }

  // ─── Blog Posts ───────────────────────────────────────────────────────────

  async findBlogPostById(id: number) {
    return db.blogPost.findUnique({
      where: { id },
      include: { category: true, tags: { include: { tag: true } }, seoMeta: true },
    });
  }

  async findBlogPostBySlug(slug: string) {
    return db.blogPost.findUnique({
      where: { slug },
      include: { category: true, tags: { include: { tag: true } }, seoMeta: true },
    });
  }

  async listBlogPosts(query: BlogPostQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.authorId) where.authorId = Number(query.authorId);
    if (query.tagId) {
      where.tags = { some: { tagId: Number(query.tagId) } };
    }
    if (query.dateFrom || query.dateTo) {
      where.publishedAt = {};
      if (query.dateFrom) (where.publishedAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.publishedAt as any).lte = new Date(query.dateTo);
    }

    const sortBy = ['title', 'views', 'publishedAt', 'createdAt'].includes(query.sortBy ?? '') ? query.sortBy! : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'asc' ? 'asc' : 'desc' };

    const [items, total] = await Promise.all([
      db.blogPost.findMany({ where, orderBy, skip, take: pageSize, include: { category: true, tags: { include: { tag: true } } } }),
      db.blogPost.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createBlogPost(data: Record<string, unknown>) {
    return db.blogPost.create({ data });
  }

  async updateBlogPost(id: number, data: Record<string, unknown>) {
    return db.blogPost.update({ where: { id }, data });
  }

  async deleteBlogPost(id: number) {
    return db.blogPost.delete({ where: { id } });
  }

  async setBlogPostTags(postId: number, tagIds: number[]) {
    await db.blogPostTag.deleteMany({ where: { postId } });
    if (tagIds.length > 0) {
      await db.blogPostTag.createMany({
        data: tagIds.map((tagId) => ({ postId, tagId })),
        skipDuplicates: true,
      });
    }
  }

  async incrementBlogPostViews(id: number) {
    return db.blogPost.update({ where: { id }, data: { views: { increment: 1 } } });
  }

  // ─── FAQs ─────────────────────────────────────────────────────────────────

  async findFaqById(id: number) {
    return db.faq.findUnique({ where: { id } });
  }

  async listFaqs(query: FaqQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { question: { contains: query.search, mode: 'insensitive' } },
        { answer: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;

    const orderBy = { displayOrder: 'asc' as const };
    const [items, total] = await Promise.all([
      db.faq.findMany({ where, orderBy, skip, take: pageSize }),
      db.faq.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createFaq(data: Record<string, unknown>) {
    return db.faq.create({ data });
  }

  async updateFaq(id: number, data: Record<string, unknown>) {
    return db.faq.update({ where: { id }, data });
  }

  async deleteFaq(id: number) {
    return db.faq.delete({ where: { id } });
  }

  // ─── Testimonials ─────────────────────────────────────────────────────────

  async findTestimonialById(id: number) {
    return db.testimonial.findUnique({ where: { id } });
  }

  async listTestimonials(query: TestimonialQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { review: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.minRating) where.rating = { gte: Number(query.minRating) };

    const orderBy = { displayOrder: 'asc' as const };
    const [items, total] = await Promise.all([
      db.testimonial.findMany({ where, orderBy, skip, take: pageSize }),
      db.testimonial.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createTestimonial(data: Record<string, unknown>) {
    return db.testimonial.create({ data });
  }

  async updateTestimonial(id: number, data: Record<string, unknown>) {
    return db.testimonial.update({ where: { id }, data });
  }

  async deleteTestimonial(id: number) {
    return db.testimonial.delete({ where: { id } });
  }

  // ─── Lookbooks ────────────────────────────────────────────────────────────

  async findLookbookById(id: number) {
    return db.lookbook.findUnique({ where: { id } });
  }

  async listLookbooks(query: LookbookQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) where.collectionName = { contains: query.search, mode: 'insensitive' };
    if (query.status) where.status = query.status;
    if (query.season) where.season = query.season;

    const orderBy = { createdAt: 'desc' as const };
    const [items, total] = await Promise.all([
      db.lookbook.findMany({ where, orderBy, skip, take: pageSize }),
      db.lookbook.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createLookbook(data: Record<string, unknown>) {
    return db.lookbook.create({ data });
  }

  async updateLookbook(id: number, data: Record<string, unknown>) {
    return db.lookbook.update({ where: { id }, data });
  }

  async deleteLookbook(id: number) {
    return db.lookbook.delete({ where: { id } });
  }

  // ─── Style Guides ─────────────────────────────────────────────────────────

  async findStyleGuideById(id: number) {
    return db.styleGuide.findUnique({ where: { id } });
  }

  async listStyleGuides(query: StyleGuideQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) where.guideName = { contains: query.search, mode: 'insensitive' };
    if (query.status) where.status = query.status;

    const orderBy = { createdAt: 'desc' as const };
    const [items, total] = await Promise.all([
      db.styleGuide.findMany({ where, orderBy, skip, take: pageSize }),
      db.styleGuide.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createStyleGuide(data: Record<string, unknown>) {
    return db.styleGuide.create({ data });
  }

  async updateStyleGuide(id: number, data: Record<string, unknown>) {
    return db.styleGuide.update({ where: { id }, data });
  }

  async deleteStyleGuide(id: number) {
    return db.styleGuide.delete({ where: { id } });
  }

  // ─── Size Guides ──────────────────────────────────────────────────────────

  async findSizeGuideById(id: number) {
    return db.sizeGuide.findUnique({ where: { id } });
  }

  async listSizeGuides(query: SizeGuideQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { category: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.status) where.status = query.status;

    const orderBy = { category: 'asc' as const };
    const [items, total] = await Promise.all([
      db.sizeGuide.findMany({ where, orderBy, skip, take: pageSize }),
      db.sizeGuide.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createSizeGuide(data: Record<string, unknown>) {
    return db.sizeGuide.create({ data });
  }

  async updateSizeGuide(id: number, data: Record<string, unknown>) {
    return db.sizeGuide.update({ where: { id }, data });
  }

  async deleteSizeGuide(id: number) {
    return db.sizeGuide.delete({ where: { id } });
  }

  // ─── Policies ─────────────────────────────────────────────────────────────

  async findPolicyById(id: number) {
    return db.policy.findUnique({ where: { id } });
  }

  async findPolicyByType(policyType: string) {
    return db.policy.findUnique({ where: { policyType } });
  }

  async listPolicies(query: PolicyQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.policyType) where.policyType = query.policyType;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [items, total] = await Promise.all([
      db.policy.findMany({ where, skip, take: pageSize, orderBy: { policyType: 'asc' } }),
      db.policy.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createPolicy(data: Record<string, unknown>) {
    return db.policy.create({ data });
  }

  async updatePolicy(id: number, data: Record<string, unknown>) {
    return db.policy.update({ where: { id }, data });
  }

  // ─── Contact Info ─────────────────────────────────────────────────────────

  async findActiveContactInfo() {
    return db.contactInfo.findFirst({ where: { isActive: true } });
  }

  async findContactInfoById(id: number) {
    return db.contactInfo.findUnique({ where: { id } });
  }

  async createContactInfo(data: Record<string, unknown>) {
    return db.contactInfo.create({ data });
  }

  async updateContactInfo(id: number, data: Record<string, unknown>) {
    return db.contactInfo.update({ where: { id }, data });
  }

  // ─── Contact Inquiries ────────────────────────────────────────────────────

  async findContactInquiryById(id: number) {
    return db.contactInquiry.findUnique({ where: { id } });
  }

  async listContactInquiries(query: ContactInquiryQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.assignedTo) where.assignedTo = Number(query.assignedTo);
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) (where.createdAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.createdAt as any).lte = new Date(query.dateTo);
    }

    const orderBy = { createdAt: 'desc' as const };
    const [items, total] = await Promise.all([
      db.contactInquiry.findMany({ where, orderBy, skip, take: pageSize }),
      db.contactInquiry.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createContactInquiry(data: Record<string, unknown>) {
    return db.contactInquiry.create({ data });
  }

  async updateContactInquiry(id: number, data: Record<string, unknown>) {
    return db.contactInquiry.update({ where: { id }, data });
  }

  async deleteContactInquiry(id: number) {
    return db.contactInquiry.delete({ where: { id } });
  }

  // ─── Dynamic Menus ────────────────────────────────────────────────────────

  async findDynamicMenuById(id: number) {
    return db.dynamicMenu.findUnique({ where: { id } });
  }

  async findDynamicMenuByCode(menuCode: string) {
    return db.dynamicMenu.findUnique({ where: { menuCode } });
  }

  async findDynamicMenuByType(menuType: string) {
    return db.dynamicMenu.findMany({ where: { menuType, isActive: true }, orderBy: { displayOrder: 'asc' } });
  }

  async listDynamicMenus(query: DynamicMenuQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.menuType) where.menuType = query.menuType;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [items, total] = await Promise.all([
      db.dynamicMenu.findMany({ where, orderBy: { displayOrder: 'asc' }, skip, take: pageSize }),
      db.dynamicMenu.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createDynamicMenu(data: Record<string, unknown>) {
    return db.dynamicMenu.create({ data });
  }

  async updateDynamicMenu(id: number, data: Record<string, unknown>) {
    return db.dynamicMenu.update({ where: { id }, data });
  }

  async deleteDynamicMenu(id: number) {
    return db.dynamicMenu.delete({ where: { id } });
  }

  // ─── Footer Config ────────────────────────────────────────────────────────

  async findActiveFooterConfig() {
    return db.footerConfig.findFirst({ where: { isActive: true } });
  }

  async findFooterConfigById(id: number) {
    return db.footerConfig.findUnique({ where: { id } });
  }

  async findFooterConfigByCode(configCode: string) {
    return db.footerConfig.findUnique({ where: { configCode } });
  }

  async createFooterConfig(data: Record<string, unknown>) {
    return db.footerConfig.create({ data });
  }

  async updateFooterConfig(id: number, data: Record<string, unknown>) {
    return db.footerConfig.update({ where: { id }, data });
  }

  // ─── Social Media Links ───────────────────────────────────────────────────

  async findSocialLinkById(id: number) {
    return db.socialMediaLink.findUnique({ where: { id } });
  }

  async findSocialLinkByPlatform(platform: string) {
    return db.socialMediaLink.findUnique({ where: { platform } });
  }

  async listSocialLinks() {
    return db.socialMediaLink.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async createSocialLink(data: Record<string, unknown>) {
    return db.socialMediaLink.create({ data });
  }

  async updateSocialLink(id: number, data: Record<string, unknown>) {
    return db.socialMediaLink.update({ where: { id }, data });
  }

  async deleteSocialLink(id: number) {
    return db.socialMediaLink.delete({ where: { id } });
  }

  // ─── SEO Meta ─────────────────────────────────────────────────────────────

  async findSeoMetaById(id: number) {
    return db.seoMeta.findUnique({ where: { id } });
  }

  async findSeoMetaBySlug(slug: string) {
    return db.seoMeta.findUnique({ where: { slug } });
  }

  async findSeoMetaByCmsPage(cmsPageId: number) {
    return db.seoMeta.findUnique({ where: { cmsPageId } });
  }

  async findSeoMetaByBlogPost(blogPostId: number) {
    return db.seoMeta.findUnique({ where: { blogPostId } });
  }

  async listSeoMeta(query: SeoMetaQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.pageType) where.pageType = query.pageType;
    if (query.referenceId) where.referenceId = Number(query.referenceId);

    const [items, total] = await Promise.all([
      db.seoMeta.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
      db.seoMeta.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createSeoMeta(data: Record<string, unknown>) {
    return db.seoMeta.create({ data });
  }

  async updateSeoMeta(id: number, data: Record<string, unknown>) {
    return db.seoMeta.update({ where: { id }, data });
  }

  async deleteSeoMeta(id: number) {
    return db.seoMeta.delete({ where: { id } });
  }

  // ─── Redirects ────────────────────────────────────────────────────────────

  async findRedirectById(id: number) {
    return db.redirect.findUnique({ where: { id } });
  }

  async findRedirectBySource(sourceUrl: string) {
    return db.redirect.findUnique({ where: { sourceUrl } });
  }

  async listRedirects(query: RedirectQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { sourceUrl: { contains: query.search, mode: 'insensitive' } },
        { destinationUrl: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.redirectType) where.redirectType = query.redirectType;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const orderBy = { createdAt: 'desc' as const };
    const [items, total] = await Promise.all([
      db.redirect.findMany({ where, orderBy, skip, take: pageSize }),
      db.redirect.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createRedirect(data: Record<string, unknown>) {
    return db.redirect.create({ data });
  }

  async updateRedirect(id: number, data: Record<string, unknown>) {
    return db.redirect.update({ where: { id }, data });
  }

  async deleteRedirect(id: number) {
    return db.redirect.delete({ where: { id } });
  }

  async incrementRedirectHit(id: number) {
    return db.redirect.update({ where: { id }, data: { hitCount: { increment: 1 } } });
  }

  // ─── URL Rewrites ─────────────────────────────────────────────────────────

  async findUrlRewriteById(id: number) {
    return db.urlRewrite.findUnique({ where: { id } });
  }

  async findUrlRewriteByOldUrl(oldUrl: string) {
    return db.urlRewrite.findUnique({ where: { oldUrl } });
  }

  async listUrlRewrites(query: UrlRewriteQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { oldUrl: { contains: query.search, mode: 'insensitive' } },
        { newUrl: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [items, total] = await Promise.all([
      db.urlRewrite.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
      db.urlRewrite.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createUrlRewrite(data: Record<string, unknown>) {
    return db.urlRewrite.create({ data });
  }

  async updateUrlRewrite(id: number, data: Record<string, unknown>) {
    return db.urlRewrite.update({ where: { id }, data });
  }

  async deleteUrlRewrite(id: number) {
    return db.urlRewrite.delete({ where: { id } });
  }

  // ─── Robots Config ────────────────────────────────────────────────────────

  async findActiveRobotsConfig() {
    return db.robotsConfig.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  async createRobotsConfig(data: Record<string, unknown>) {
    return db.robotsConfig.create({ data });
  }

  async updateRobotsConfig(id: number, data: Record<string, unknown>) {
    return db.robotsConfig.update({ where: { id }, data });
  }

  // ─── Sitemap Entries ──────────────────────────────────────────────────────

  async upsertSitemapEntry(url: string, data: Record<string, unknown>) {
    return db.sitemapEntry.upsert({
      where: { url },
      create: { url, ...data },
      update: { ...data, lastModified: new Date() },
    });
  }

  async listActiveSitemapEntries() {
    return db.sitemapEntry.findMany({ where: { isActive: true }, orderBy: { priority: 'desc' } });
  }

  async deleteSitemapEntry(id: number) {
    return db.sitemapEntry.delete({ where: { id } });
  }

  // ─── Content Versions ─────────────────────────────────────────────────────

  async findContentVersionById(id: number) {
    return db.contentVersion.findUnique({ where: { id } });
  }

  async listContentVersions(query: ContentVersionQuery = {}) {
    const { page, pageSize, skip } = paged(query);
    const where: Record<string, unknown> = {};

    if (query.entityType) where.entityType = query.entityType;
    if (query.entityId) where.entityId = Number(query.entityId);
    if (query.changedBy) where.changedBy = Number(query.changedBy);

    const [items, total] = await Promise.all([
      db.contentVersion.findMany({ where, orderBy: { changedAt: 'desc' }, skip, take: pageSize }),
      db.contentVersion.count({ where }),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createContentVersion(data: Record<string, unknown>) {
    return db.contentVersion.create({ data });
  }

  async getLatestVersionNumber(entityType: string, entityId: number): Promise<number> {
    const latest = await db.contentVersion.findFirst({
      where: { entityType, entityId },
      orderBy: { version: 'desc' },
    });
    return latest ? Number(latest.version) : 0;
  }
}
