import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import CmsService from '../services/cms.service';

export default function createCmsController(service: CmsService) {
  const actor = (req: Request): number | undefined => {
    const user = (req as any).user;
    return user?.sub ? Number(user.sub) : undefined;
  };

  const baseUrl = (req: Request) => `${req.protocol}://${req.get('host')}`;

  return {
    // ─── CMS Pages ──────────────────────────────────────────────────────────

    createCmsPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = await service.createCmsPage(req.body, actor(req));
        return apiResponse.created(res, page, 'CMS page created successfully');
      } catch (e) { next(e); }
    },

    listCmsPages: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pages = await service.listCmsPages(req.query as any);
        return apiResponse.success(res, pages, 'CMS pages fetched successfully');
      } catch (e) { next(e); }
    },

    getCmsPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = await service.getCmsPage(Number(req.params.id));
        return apiResponse.success(res, page, 'CMS page fetched successfully');
      } catch (e) { next(e); }
    },

    getCmsPageBySlug: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = await service.getCmsPageBySlug(req.params.slug);
        if (!page) return apiResponse.notFound(res, null, 'CMS page not found');
        return apiResponse.success(res, page, 'CMS page fetched successfully');
      } catch (e) { next(e); }
    },

    updateCmsPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = await service.updateCmsPage(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, page, 'CMS page updated successfully');
      } catch (e) { next(e); }
    },

    deleteCmsPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteCmsPage(Number(req.params.id));
        return apiResponse.success(res, null, 'CMS page deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Blog Categories ────────────────────────────────────────────────────

    createBlogCategory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cat = await service.createBlogCategory(req.body, actor(req));
        return apiResponse.created(res, cat, 'Blog category created successfully');
      } catch (e) { next(e); }
    },

    listBlogCategories: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cats = await service.listBlogCategories(req.query as any);
        return apiResponse.success(res, cats, 'Blog categories fetched successfully');
      } catch (e) { next(e); }
    },

    getBlogCategory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cat = await service.getBlogCategory(Number(req.params.id));
        return apiResponse.success(res, cat, 'Blog category fetched successfully');
      } catch (e) { next(e); }
    },

    updateBlogCategory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cat = await service.updateBlogCategory(Number(req.params.id), req.body);
        return apiResponse.success(res, cat, 'Blog category updated successfully');
      } catch (e) { next(e); }
    },

    deleteBlogCategory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteBlogCategory(Number(req.params.id));
        return apiResponse.success(res, null, 'Blog category deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Blog Tags ───────────────────────────────────────────────────────────

    createBlogTag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tag = await service.createBlogTag(req.body);
        return apiResponse.created(res, tag, 'Blog tag created successfully');
      } catch (e) { next(e); }
    },

    listBlogTags: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tags = await service.listBlogTags(req.query as any);
        return apiResponse.success(res, tags, 'Blog tags fetched successfully');
      } catch (e) { next(e); }
    },

    getBlogTag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tag = await service.getBlogTag(Number(req.params.id));
        return apiResponse.success(res, tag, 'Blog tag fetched successfully');
      } catch (e) { next(e); }
    },

    updateBlogTag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tag = await service.updateBlogTag(Number(req.params.id), req.body);
        return apiResponse.success(res, tag, 'Blog tag updated successfully');
      } catch (e) { next(e); }
    },

    deleteBlogTag: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteBlogTag(Number(req.params.id));
        return apiResponse.success(res, null, 'Blog tag deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Blog Posts ──────────────────────────────────────────────────────────

    createBlogPost: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const post = await service.createBlogPost(req.body, actor(req));
        return apiResponse.created(res, post, 'Blog post created successfully');
      } catch (e) { next(e); }
    },

    listBlogPosts: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const posts = await service.listBlogPosts(req.query as any);
        return apiResponse.success(res, posts, 'Blog posts fetched successfully');
      } catch (e) { next(e); }
    },

    getBlogPost: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const post = await service.getBlogPost(Number(req.params.id));
        return apiResponse.success(res, post, 'Blog post fetched successfully');
      } catch (e) { next(e); }
    },

    getBlogPostBySlug: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const post = await service.getBlogPostBySlug(req.params.slug);
        return apiResponse.success(res, post, 'Blog post fetched successfully');
      } catch (e) { next(e); }
    },

    updateBlogPost: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const post = await service.updateBlogPost(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, post, 'Blog post updated successfully');
      } catch (e) { next(e); }
    },

    deleteBlogPost: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteBlogPost(Number(req.params.id));
        return apiResponse.success(res, null, 'Blog post deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── FAQs ────────────────────────────────────────────────────────────────

    createFaq: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const faq = await service.createFaq(req.body, actor(req));
        return apiResponse.created(res, faq, 'FAQ created successfully');
      } catch (e) { next(e); }
    },

    listFaqs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const faqs = await service.listFaqs(req.query as any);
        return apiResponse.success(res, faqs, 'FAQs fetched successfully');
      } catch (e) { next(e); }
    },

    getFaq: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const faq = await service.getFaq(Number(req.params.id));
        return apiResponse.success(res, faq, 'FAQ fetched successfully');
      } catch (e) { next(e); }
    },

    updateFaq: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const faq = await service.updateFaq(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, faq, 'FAQ updated successfully');
      } catch (e) { next(e); }
    },

    deleteFaq: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteFaq(Number(req.params.id));
        return apiResponse.success(res, null, 'FAQ deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Testimonials ────────────────────────────────────────────────────────

    createTestimonial: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const t = await service.createTestimonial(req.body, actor(req));
        return apiResponse.created(res, t, 'Testimonial created successfully');
      } catch (e) { next(e); }
    },

    listTestimonials: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const testimonials = await service.listTestimonials(req.query as any);
        return apiResponse.success(res, testimonials, 'Testimonials fetched successfully');
      } catch (e) { next(e); }
    },

    getTestimonial: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const t = await service.getTestimonial(Number(req.params.id));
        return apiResponse.success(res, t, 'Testimonial fetched successfully');
      } catch (e) { next(e); }
    },

    updateTestimonial: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const t = await service.updateTestimonial(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, t, 'Testimonial updated successfully');
      } catch (e) { next(e); }
    },

    deleteTestimonial: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteTestimonial(Number(req.params.id));
        return apiResponse.success(res, null, 'Testimonial deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Lookbooks ───────────────────────────────────────────────────────────

    createLookbook: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lb = await service.createLookbook(req.body, actor(req));
        return apiResponse.created(res, lb, 'Lookbook created successfully');
      } catch (e) { next(e); }
    },

    listLookbooks: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lbs = await service.listLookbooks(req.query as any);
        return apiResponse.success(res, lbs, 'Lookbooks fetched successfully');
      } catch (e) { next(e); }
    },

    getLookbook: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lb = await service.getLookbook(Number(req.params.id));
        return apiResponse.success(res, lb, 'Lookbook fetched successfully');
      } catch (e) { next(e); }
    },

    updateLookbook: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lb = await service.updateLookbook(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, lb, 'Lookbook updated successfully');
      } catch (e) { next(e); }
    },

    deleteLookbook: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteLookbook(Number(req.params.id));
        return apiResponse.success(res, null, 'Lookbook deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Style Guides ────────────────────────────────────────────────────────

    createStyleGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.createStyleGuide(req.body, actor(req));
        return apiResponse.created(res, sg, 'Style guide created successfully');
      } catch (e) { next(e); }
    },

    listStyleGuides: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sgs = await service.listStyleGuides(req.query as any);
        return apiResponse.success(res, sgs, 'Style guides fetched successfully');
      } catch (e) { next(e); }
    },

    getStyleGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.getStyleGuide(Number(req.params.id));
        return apiResponse.success(res, sg, 'Style guide fetched successfully');
      } catch (e) { next(e); }
    },

    updateStyleGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.updateStyleGuide(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, sg, 'Style guide updated successfully');
      } catch (e) { next(e); }
    },

    deleteStyleGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteStyleGuide(Number(req.params.id));
        return apiResponse.success(res, null, 'Style guide deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Size Guides ─────────────────────────────────────────────────────────

    createSizeGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.createSizeGuide(req.body, actor(req));
        return apiResponse.created(res, sg, 'Size guide created successfully');
      } catch (e) { next(e); }
    },

    listSizeGuides: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sgs = await service.listSizeGuides(req.query as any);
        return apiResponse.success(res, sgs, 'Size guides fetched successfully');
      } catch (e) { next(e); }
    },

    getSizeGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.getSizeGuide(Number(req.params.id));
        return apiResponse.success(res, sg, 'Size guide fetched successfully');
      } catch (e) { next(e); }
    },

    updateSizeGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sg = await service.updateSizeGuide(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, sg, 'Size guide updated successfully');
      } catch (e) { next(e); }
    },

    deleteSizeGuide: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteSizeGuide(Number(req.params.id));
        return apiResponse.success(res, null, 'Size guide deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Policies ────────────────────────────────────────────────────────────

    createPolicy: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const policy = await service.createPolicy(req.body, actor(req));
        return apiResponse.created(res, policy, 'Policy created successfully');
      } catch (e) { next(e); }
    },

    listPolicies: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const policies = await service.listPolicies(req.query as any);
        return apiResponse.success(res, policies, 'Policies fetched successfully');
      } catch (e) { next(e); }
    },

    getPolicy: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const policy = await service.getPolicy(Number(req.params.id));
        return apiResponse.success(res, policy, 'Policy fetched successfully');
      } catch (e) { next(e); }
    },

    getPolicyByType: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const policy = await service.getPolicyByType(req.params.type);
        return apiResponse.success(res, policy, 'Policy fetched successfully');
      } catch (e) { next(e); }
    },

    updatePolicy: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const policy = await service.updatePolicy(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, policy, 'Policy updated successfully');
      } catch (e) { next(e); }
    },

    // ─── Contact Info ────────────────────────────────────────────────────────

    getContactInfo: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const info = await service.getContactInfo();
        return apiResponse.success(res, info, 'Contact info fetched successfully');
      } catch (e) { next(e); }
    },

    createContactInfo: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const info = await service.createContactInfo(req.body, actor(req));
        return apiResponse.created(res, info, 'Contact info created successfully');
      } catch (e) { next(e); }
    },

    updateContactInfo: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const info = await service.updateContactInfo(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, info, 'Contact info updated successfully');
      } catch (e) { next(e); }
    },

    // ─── Contact Inquiries ───────────────────────────────────────────────────

    createContactInquiry: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const inquiry = await service.createContactInquiry(req.body);
        return apiResponse.created(res, inquiry, 'Inquiry submitted successfully');
      } catch (e) { next(e); }
    },

    listContactInquiries: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const inquiries = await service.listContactInquiries(req.query as any);
        return apiResponse.success(res, inquiries, 'Inquiries fetched successfully');
      } catch (e) { next(e); }
    },

    getContactInquiry: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const inquiry = await service.getContactInquiry(Number(req.params.id));
        return apiResponse.success(res, inquiry, 'Inquiry fetched successfully');
      } catch (e) { next(e); }
    },

    updateContactInquiry: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const inquiry = await service.updateContactInquiry(Number(req.params.id), req.body);
        return apiResponse.success(res, inquiry, 'Inquiry updated successfully');
      } catch (e) { next(e); }
    },

    deleteContactInquiry: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteContactInquiry(Number(req.params.id));
        return apiResponse.success(res, null, 'Inquiry deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Dynamic Menus ───────────────────────────────────────────────────────

    createDynamicMenu: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const menu = await service.createDynamicMenu(req.body, actor(req));
        return apiResponse.created(res, menu, 'Menu created successfully');
      } catch (e) { next(e); }
    },

    listDynamicMenus: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const menus = await service.listDynamicMenus(req.query as any);
        return apiResponse.success(res, menus, 'Menus fetched successfully');
      } catch (e) { next(e); }
    },

    getDynamicMenu: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const menu = await service.getDynamicMenu(Number(req.params.id));
        return apiResponse.success(res, menu, 'Menu fetched successfully');
      } catch (e) { next(e); }
    },

    getDynamicMenuByType: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const menu = await service.getDynamicMenuByType(req.params.type);
        return apiResponse.success(res, menu, 'Menu fetched successfully');
      } catch (e) { next(e); }
    },

    updateDynamicMenu: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const menu = await service.updateDynamicMenu(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, menu, 'Menu updated successfully');
      } catch (e) { next(e); }
    },

    deleteDynamicMenu: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteDynamicMenu(Number(req.params.id));
        return apiResponse.success(res, null, 'Menu deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Footer Config ───────────────────────────────────────────────────────

    getFooterConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const config = await service.getFooterConfig();
        return apiResponse.success(res, config, 'Footer config fetched successfully');
      } catch (e) { next(e); }
    },

    createFooterConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const config = await service.createFooterConfig(req.body, actor(req));
        return apiResponse.created(res, config, 'Footer config created successfully');
      } catch (e) { next(e); }
    },

    updateFooterConfig: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const config = await service.updateFooterConfig(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, config, 'Footer config updated successfully');
      } catch (e) { next(e); }
    },

    // ─── Social Links ────────────────────────────────────────────────────────

    listSocialLinks: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const links = await service.listSocialLinks();
        return apiResponse.success(res, links, 'Social links fetched successfully');
      } catch (e) { next(e); }
    },

    createSocialLink: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const link = await service.createSocialLink(req.body);
        return apiResponse.created(res, link, 'Social link created successfully');
      } catch (e) { next(e); }
    },

    updateSocialLink: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const link = await service.updateSocialLink(Number(req.params.id), req.body);
        return apiResponse.success(res, link, 'Social link updated successfully');
      } catch (e) { next(e); }
    },

    deleteSocialLink: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteSocialLink(Number(req.params.id));
        return apiResponse.success(res, null, 'Social link deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── SEO Meta ────────────────────────────────────────────────────────────

    createSeoMeta: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const meta = await service.createSeoMeta(req.body, actor(req));
        return apiResponse.created(res, meta, 'SEO meta created successfully');
      } catch (e) { next(e); }
    },

    listSeoMeta: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const meta = await service.listSeoMeta(req.query as any);
        return apiResponse.success(res, meta, 'SEO meta fetched successfully');
      } catch (e) { next(e); }
    },

    getSeoMeta: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const meta = await service.getSeoMeta(Number(req.params.id));
        return apiResponse.success(res, meta, 'SEO meta fetched successfully');
      } catch (e) { next(e); }
    },

    getSeoMetaBySlug: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const meta = await service.getSeoMetaBySlug(req.params.slug);
        if (!meta) return apiResponse.notFound(res, null, 'SEO meta not found');
        return apiResponse.success(res, meta, 'SEO meta fetched successfully');
      } catch (e) { next(e); }
    },

    updateSeoMeta: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const meta = await service.updateSeoMeta(Number(req.params.id), req.body);
        return apiResponse.success(res, meta, 'SEO meta updated successfully');
      } catch (e) { next(e); }
    },

    deleteSeoMeta: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteSeoMeta(Number(req.params.id));
        return apiResponse.success(res, null, 'SEO meta deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Redirects ───────────────────────────────────────────────────────────

    createRedirect: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const redirect = await service.createRedirect(req.body, actor(req));
        return apiResponse.created(res, redirect, 'Redirect created successfully');
      } catch (e) { next(e); }
    },

    listRedirects: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const redirects = await service.listRedirects(req.query as any);
        return apiResponse.success(res, redirects, 'Redirects fetched successfully');
      } catch (e) { next(e); }
    },

    getRedirect: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const redirect = await service.getRedirect(Number(req.params.id));
        return apiResponse.success(res, redirect, 'Redirect fetched successfully');
      } catch (e) { next(e); }
    },

    updateRedirect: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const redirect = await service.updateRedirect(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, redirect, 'Redirect updated successfully');
      } catch (e) { next(e); }
    },

    deleteRedirect: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteRedirect(Number(req.params.id));
        return apiResponse.success(res, null, 'Redirect deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── URL Rewrites ────────────────────────────────────────────────────────

    createUrlRewrite: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rewrite = await service.createUrlRewrite(req.body, actor(req));
        return apiResponse.created(res, rewrite, 'URL rewrite created successfully');
      } catch (e) { next(e); }
    },

    listUrlRewrites: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rewrites = await service.listUrlRewrites(req.query as any);
        return apiResponse.success(res, rewrites, 'URL rewrites fetched successfully');
      } catch (e) { next(e); }
    },

    getUrlRewrite: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rewrite = await service.getUrlRewrite(Number(req.params.id));
        return apiResponse.success(res, rewrite, 'URL rewrite fetched successfully');
      } catch (e) { next(e); }
    },

    updateUrlRewrite: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const rewrite = await service.updateUrlRewrite(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, rewrite, 'URL rewrite updated successfully');
      } catch (e) { next(e); }
    },

    deleteUrlRewrite: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteUrlRewrite(Number(req.params.id));
        return apiResponse.success(res, null, 'URL rewrite deleted successfully');
      } catch (e) { next(e); }
    },

    // ─── Robots.txt ──────────────────────────────────────────────────────────

    getRobotsTxt: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const content = await service.getRobotsTxt();
        res.type('text/plain').send(content);
      } catch (e) { next(e); }
    },

    updateRobotsTxt: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.updateRobotsTxt(req.body, actor(req));
        return apiResponse.success(res, result, 'Robots.txt updated successfully');
      } catch (e) { next(e); }
    },

    // ─── Sitemap ─────────────────────────────────────────────────────────────

    generateSitemap: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const xml = await service.generateSitemap(req.query as any, baseUrl(req));
        res.type('application/xml').send(xml);
      } catch (e) { next(e); }
    },

    // ─── Content Versions ────────────────────────────────────────────────────

    listContentVersions: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const versions = await service.listContentVersions(req.query as any);
        return apiResponse.success(res, versions, 'Content versions fetched successfully');
      } catch (e) { next(e); }
    },

    getContentVersion: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const version = await service.getContentVersion(Number(req.params.id));
        return apiResponse.success(res, version, 'Content version fetched successfully');
      } catch (e) { next(e); }
    },

    rollbackVersion: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.rollbackVersion(Number(req.params.id), Number(req.body.versionId), actor(req));
        return apiResponse.success(res, result, 'Content rolled back successfully');
      } catch (e) { next(e); }
    },
  };
}
