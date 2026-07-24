import { Router } from 'express';
import createCmsController from '../controllers/cms.controller';
import CmsRepository from '../repositories/cms.repository';
import CmsService from '../services/cms.service';
import authenticate from '../middlewares/authenticate';
import roleGuard from '../middlewares/roleGuard';
import validate from '../middlewares/validation.middleware';
import {
  idParam,
  createCmsPageValidation,
  updateCmsPageValidation,
  listCmsPagesValidation,
  createBlogCategoryValidation,
  updateBlogCategoryValidation,
  listBlogCategoriesValidation,
  createBlogTagValidation,
  updateBlogTagValidation,
  listBlogTagsValidation,
  createBlogPostValidation,
  updateBlogPostValidation,
  listBlogPostsValidation,
  createFaqValidation,
  updateFaqValidation,
  listFaqsValidation,
  createTestimonialValidation,
  updateTestimonialValidation,
  listTestimonialsValidation,
  createLookbookValidation,
  updateLookbookValidation,
  listLookbooksValidation,
  createStyleGuideValidation,
  updateStyleGuideValidation,
  listStyleGuidesValidation,
  createSizeGuideValidation,
  updateSizeGuideValidation,
  listSizeGuidesValidation,
  createPolicyValidation,
  updatePolicyValidation,
  createContactInfoValidation,
  updateContactInfoValidation,
  createContactInquiryValidation,
  updateContactInquiryValidation,
  listContactInquiriesValidation,
  createDynamicMenuValidation,
  updateDynamicMenuValidation,
  listDynamicMenusValidation,
  createFooterConfigValidation,
  updateFooterConfigValidation,
  createSocialLinkValidation,
  updateSocialLinkValidation,
  createSeoMetaValidation,
  updateSeoMetaValidation,
  listSeoMetaValidation,
  createRedirectValidation,
  updateRedirectValidation,
  listRedirectsValidation,
  createUrlRewriteValidation,
  updateUrlRewriteValidation,
  listUrlRewritesValidation,
  updateRobotsConfigValidation,
  listContentVersionsValidation,
  rollbackVersionValidation,
} from '../validations/cms.validation';

const router = Router();
const repository = new CmsRepository();
const service = new CmsService(repository);
const ctrl = createCmsController(service);

// ─── Role Sets ────────────────────────────────────────────────────────────────

const ADMIN_ROLES = ['Super Admin', 'Admin'];
const CONTENT_ROLES = ['Super Admin', 'Admin', 'Content Manager'];
const MARKETING_ROLES = ['Super Admin', 'Admin', 'Content Manager', 'Marketing Manager'];

/**
 * @openapi
 * components:
 *   schemas:
 *     CmsPage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: About Us
 *         slug:
 *           type: string
 *           example: about-us
 *         content:
 *           type: string
 *           example: "<p>Welcome to our company</p>"
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: published
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CmsPageInput:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: About Us
 *         slug:
 *           type: string
 *           example: about-us
 *         content:
 *           type: string
 *           example: "<p>Welcome to our company</p>"
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: draft
 *     BlogCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Fashion Tips
 *         slug:
 *           type: string
 *           example: fashion-tips
 *         description:
 *           type: string
 *           example: Articles about fashion trends
 *     BlogCategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Fashion Tips
 *         slug:
 *           type: string
 *           example: fashion-tips
 *         description:
 *           type: string
 *           example: Articles about fashion trends
 *     BlogTag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Summer
 *         slug:
 *           type: string
 *           example: summer
 *     BlogTagInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Summer
 *         slug:
 *           type: string
 *           example: summer
 *     BlogPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Top 10 Summer Trends
 *         slug:
 *           type: string
 *           example: top-10-summer-trends
 *         content:
 *           type: string
 *           example: "<p>Article body...</p>"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         tags:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: published
 *         publishedAt:
 *           type: string
 *           format: date-time
 *     BlogPostInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           example: Top 10 Summer Trends
 *         slug:
 *           type: string
 *           example: top-10-summer-trends
 *         content:
 *           type: string
 *           example: "<p>Article body...</p>"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         tags:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           example: draft
 *     Faq:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         question:
 *           type: string
 *           example: What is your return policy?
 *         answer:
 *           type: string
 *           example: We accept returns within 30 days.
 *         order:
 *           type: integer
 *           example: 1
 *     FaqInput:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         question:
 *           type: string
 *           example: What is your return policy?
 *         answer:
 *           type: string
 *           example: We accept returns within 30 days.
 *         order:
 *           type: integer
 *           example: 1
 *     Testimonial:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customerName:
 *           type: string
 *           example: Jane Doe
 *         message:
 *           type: string
 *           example: Great service and fast delivery!
 *         rating:
 *           type: integer
 *           example: 5
 *     TestimonialInput:
 *       type: object
 *       required:
 *         - customerName
 *         - message
 *       properties:
 *         customerName:
 *           type: string
 *           example: Jane Doe
 *         message:
 *           type: string
 *           example: Great service and fast delivery!
 *         rating:
 *           type: integer
 *           example: 5
 *     Lookbook:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Summer Collection 2026
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://cdn.example.com/lookbook1.jpg"]
 *     LookbookInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Summer Collection 2026
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://cdn.example.com/lookbook1.jpg"]
 *     StyleGuide:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: How to Style Denim
 *         content:
 *           type: string
 *           example: "<p>Guide content...</p>"
 *     StyleGuideInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: How to Style Denim
 *         content:
 *           type: string
 *           example: "<p>Guide content...</p>"
 *     SizeGuide:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         category:
 *           type: string
 *           example: Women's Tops
 *         chart:
 *           type: object
 *           example: { "S": "34-36", "M": "36-38" }
 *     SizeGuideInput:
 *       type: object
 *       required:
 *         - category
 *         - chart
 *       properties:
 *         category:
 *           type: string
 *           example: Women's Tops
 *         chart:
 *           type: object
 *           example: { "S": "34-36", "M": "36-38" }
 *     Policy:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           example: privacy-policy
 *         title:
 *           type: string
 *           example: Privacy Policy
 *         content:
 *           type: string
 *           example: "<p>Policy content...</p>"
 *     PolicyInput:
 *       type: object
 *       required:
 *         - type
 *         - title
 *         - content
 *       properties:
 *         type:
 *           type: string
 *           example: privacy-policy
 *         title:
 *           type: string
 *           example: Privacy Policy
 *         content:
 *           type: string
 *           example: "<p>Policy content...</p>"
 *     ContactInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         address:
 *           type: string
 *           example: 123 Main St, City
 *         phone:
 *           type: string
 *           example: "+1-555-0100"
 *         email:
 *           type: string
 *           example: support@example.com
 *     ContactInfoInput:
 *       type: object
 *       required:
 *         - address
 *         - phone
 *         - email
 *       properties:
 *         address:
 *           type: string
 *           example: 123 Main St, City
 *         phone:
 *           type: string
 *           example: "+1-555-0100"
 *         email:
 *           type: string
 *           example: support@example.com
 *     ContactInquiry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Smith
 *         email:
 *           type: string
 *           example: john@example.com
 *         message:
 *           type: string
 *           example: I have a question about my order.
 *         status:
 *           type: string
 *           enum: [new, in_progress, resolved]
 *           example: new
 *     ContactInquiryInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           example: John Smith
 *         email:
 *           type: string
 *           example: john@example.com
 *         message:
 *           type: string
 *           example: I have a question about my order.
 *     ContactInquiryUpdateInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [new, in_progress, resolved]
 *           example: resolved
 *     DynamicMenu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           example: header
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ "label": "Home", "url": "/" }]
 *     DynamicMenuInput:
 *       type: object
 *       required:
 *         - type
 *         - items
 *       properties:
 *         type:
 *           type: string
 *           example: header
 *         items:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ "label": "Home", "url": "/" }]
 *     FooterConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         columns:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ "title": "Company", "links": [] }]
 *     FooterConfigInput:
 *       type: object
 *       required:
 *         - columns
 *       properties:
 *         columns:
 *           type: array
 *           items:
 *             type: object
 *           example: [{ "title": "Company", "links": [] }]
 *     SocialLink:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         platform:
 *           type: string
 *           example: instagram
 *         url:
 *           type: string
 *           example: https://instagram.com/example
 *     SocialLinkInput:
 *       type: object
 *       required:
 *         - platform
 *         - url
 *       properties:
 *         platform:
 *           type: string
 *           example: instagram
 *         url:
 *           type: string
 *           example: https://instagram.com/example
 *     SeoMeta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         slug:
 *           type: string
 *           example: about-us
 *         metaTitle:
 *           type: string
 *           example: About Us | Example Store
 *         metaDescription:
 *           type: string
 *           example: Learn more about our company.
 *     SeoMetaInput:
 *       type: object
 *       required:
 *         - slug
 *         - metaTitle
 *       properties:
 *         slug:
 *           type: string
 *           example: about-us
 *         metaTitle:
 *           type: string
 *           example: About Us | Example Store
 *         metaDescription:
 *           type: string
 *           example: Learn more about our company.
 *     Redirect:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         fromPath:
 *           type: string
 *           example: /old-page
 *         toPath:
 *           type: string
 *           example: /new-page
 *         statusCode:
 *           type: integer
 *           example: 301
 *     RedirectInput:
 *       type: object
 *       required:
 *         - fromPath
 *         - toPath
 *       properties:
 *         fromPath:
 *           type: string
 *           example: /old-page
 *         toPath:
 *           type: string
 *           example: /new-page
 *         statusCode:
 *           type: integer
 *           example: 301
 *     UrlRewrite:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         pattern:
 *           type: string
 *           example: /products/(.*)
 *         target:
 *           type: string
 *           example: /shop/$1
 *     UrlRewriteInput:
 *       type: object
 *       required:
 *         - pattern
 *         - target
 *       properties:
 *         pattern:
 *           type: string
 *           example: /products/(.*)
 *         target:
 *           type: string
 *           example: /shop/$1
 *     RobotsConfigInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           example: "User-agent: *\nAllow: /"
 *     ContentVersion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         entityType:
 *           type: string
 *           example: CmsPage
 *         entityId:
 *           type: integer
 *           example: 5
 *         versionNumber:
 *           type: integer
 *           example: 3
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Request successful
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: An error occurred
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// ─── Public (read-only, no auth) ─────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/pages/slug/{slug}:
 *   get:
 *     tags:
 *       - CMS
 *     summary: Get CMS page by slug
 *     description: Retrieve a CMS page for public display by its URL slug.
 *     operationId: getCmsPageBySlug
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Page URL slug (lowercase alphanumeric with hyphens)
 *     responses:
 *       200:
 *         description: CMS page retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: CMS page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pages/slug/:slug', ctrl.getCmsPageBySlug);

// Blog read (public)
/**
 * @openapi
 * /api/v1/cms/blog/categories:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: List blog categories
 *     description: Retrieve all public blog categories with optional pagination and filtering.
 *     operationId: listBlogCategories
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Blog categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/blog/categories', listBlogCategoriesValidation, validate, ctrl.listBlogCategories);

/**
 * @openapi
 * /api/v1/cms/blog/tags:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: List blog tags
 *     description: Retrieve all public blog tags with optional pagination and filtering.
 *     operationId: listBlogTags
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Blog tags retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/blog/tags', listBlogTagsValidation, validate, ctrl.listBlogTags);

/**
 * @openapi
 * /api/v1/cms/blog:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: List blog posts
 *     description: Retrieve public blog posts with pagination, filtering, and sorting.
 *     operationId: listBlogPosts
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: tagId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Blog posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/blog', listBlogPostsValidation, validate, ctrl.listBlogPosts);

/**
 * @openapi
 * /api/v1/cms/blog/slug/{slug}:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: Get blog post by slug
 *     description: Retrieve a single blog post for public display by its URL slug.
 *     operationId: getBlogPostBySlug
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post URL slug
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/blog/slug/:slug', ctrl.getBlogPostBySlug);

// FAQs (public)
/**
 * @openapi
 * /api/v1/cms/faqs:
 *   get:
 *     tags:
 *       - CMS FAQs
 *     summary: List FAQs
 *     description: Retrieve all public FAQs with optional pagination and filtering.
 *     operationId: listFaqs
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/faqs', listFaqsValidation, validate, ctrl.listFaqs);

/**
 * @openapi
 * /api/v1/cms/faqs/{id}:
 *   get:
 *     tags:
 *       - CMS FAQs
 *     summary: Get FAQ by ID
 *     description: Retrieve a single public FAQ by its numeric ID.
 *     operationId: getFaq
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: FAQ not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/faqs/:id', idParam, validate, ctrl.getFaq);

// Testimonials (public)
/**
 * @openapi
 * /api/v1/cms/testimonials:
 *   get:
 *     tags:
 *       - CMS Testimonials
 *     summary: List testimonials
 *     description: Retrieve all public testimonials with optional pagination and filtering.
 *     operationId: listTestimonials
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/testimonials', listTestimonialsValidation, validate, ctrl.listTestimonials);

/**
 * @openapi
 * /api/v1/cms/testimonials/{id}:
 *   get:
 *     tags:
 *       - CMS Testimonials
 *     summary: Get testimonial by ID
 *     description: Retrieve a single public testimonial by its numeric ID.
 *     operationId: getTestimonial
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Testimonial not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/testimonials/:id', idParam, validate, ctrl.getTestimonial);

// Lookbooks (public)
/**
 * @openapi
 * /api/v1/cms/lookbooks:
 *   get:
 *     tags:
 *       - CMS Lookbooks
 *     summary: List lookbooks
 *     description: Retrieve all public lookbooks with optional pagination and filtering.
 *     operationId: listLookbooks
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lookbooks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/lookbooks', listLookbooksValidation, validate, ctrl.listLookbooks);

/**
 * @openapi
 * /api/v1/cms/lookbooks/{id}:
 *   get:
 *     tags:
 *       - CMS Lookbooks
 *     summary: Get lookbook by ID
 *     description: Retrieve a single public lookbook by its numeric ID.
 *     operationId: getLookbook
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lookbook ID
 *     responses:
 *       200:
 *         description: Lookbook retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Lookbook not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/lookbooks/:id', idParam, validate, ctrl.getLookbook);

// Style & Size Guides (public)
/**
 * @openapi
 * /api/v1/cms/style-guides:
 *   get:
 *     tags:
 *       - CMS Style Guides
 *     summary: List style guides
 *     description: Retrieve all public style guides with optional pagination and filtering.
 *     operationId: listStyleGuides
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style guides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/style-guides', listStyleGuidesValidation, validate, ctrl.listStyleGuides);

/**
 * @openapi
 * /api/v1/cms/style-guides/{id}:
 *   get:
 *     tags:
 *       - CMS Style Guides
 *     summary: Get style guide by ID
 *     description: Retrieve a single public style guide by its numeric ID.
 *     operationId: getStyleGuide
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Style guide ID
 *     responses:
 *       200:
 *         description: Style guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Style guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/style-guides/:id', idParam, validate, ctrl.getStyleGuide);

/**
 * @openapi
 * /api/v1/cms/size-guides:
 *   get:
 *     tags:
 *       - CMS Size Guides
 *     summary: List size guides
 *     description: Retrieve all public size guides with optional pagination and filtering.
 *     operationId: listSizeGuides
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Size guides retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/size-guides', listSizeGuidesValidation, validate, ctrl.listSizeGuides);

/**
 * @openapi
 * /api/v1/cms/size-guides/{id}:
 *   get:
 *     tags:
 *       - CMS Size Guides
 *     summary: Get size guide by ID
 *     description: Retrieve a single public size guide by its numeric ID.
 *     operationId: getSizeGuide
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Size guide ID
 *     responses:
 *       200:
 *         description: Size guide retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Size guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/size-guides/:id', idParam, validate, ctrl.getSizeGuide);

// Policies (public)
/**
 * @openapi
 * /api/v1/cms/policies:
 *   get:
 *     tags:
 *       - CMS Policies
 *     summary: List policies
 *     description: Retrieve all public policies.
 *     operationId: listPolicies
 *     responses:
 *       200:
 *         description: Policies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/policies', ctrl.listPolicies);

/**
 * @openapi
 * /api/v1/cms/policies/type/{type}:
 *   get:
 *     tags:
 *       - CMS Policies
 *     summary: Get policy by type
 *     description: Retrieve a public policy document by its type identifier (e.g. privacy-policy, terms-of-service).
 *     operationId: getPolicyByType
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Policy type identifier
 *     responses:
 *       200:
 *         description: Policy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Policy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/policies/type/:type', ctrl.getPolicyByType);

/**
 * @openapi
 * /api/v1/cms/policies/{id}:
 *   get:
 *     tags:
 *       - CMS Policies
 *     summary: Get policy by ID
 *     description: Retrieve a single public policy by its numeric ID.
 *     operationId: getPolicy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Policy ID
 *     responses:
 *       200:
 *         description: Policy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Policy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/policies/:id', idParam, validate, ctrl.getPolicy);

// Contact info (public)
/**
 * @openapi
 * /api/v1/cms/contact-info:
 *   get:
 *     tags:
 *       - CMS Contact
 *     summary: Get contact information
 *     description: Retrieve the public contact information for the storefront.
 *     operationId: getContactInfo
 *     responses:
 *       200:
 *         description: Contact info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/contact-info', ctrl.getContactInfo);

// Contact inquiry submission (public)
/**
 * @openapi
 * /api/v1/cms/contact-inquiries:
 *   post:
 *     tags:
 *       - CMS Contact
 *     summary: Submit a contact inquiry
 *     description: Public endpoint allowing a visitor to submit a contact inquiry.
 *     operationId: createContactInquiry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInquiryInput'
 *     responses:
 *       201:
 *         description: Contact inquiry submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/contact-inquiries', createContactInquiryValidation, validate, ctrl.createContactInquiry);

// Menu (public)
/**
 * @openapi
 * /api/v1/cms/menus/type/{type}:
 *   get:
 *     tags:
 *       - CMS Menus
 *     summary: Get dynamic menu by type
 *     description: Retrieve a public dynamic menu (e.g. header, footer) by its type.
 *     operationId: getDynamicMenuByType
 *     parameters:
 *       - name: type
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu type identifier
 *     responses:
 *       200:
 *         description: Menu retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Menu not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/menus/type/:type', ctrl.getDynamicMenuByType);

// Footer (public)
/**
 * @openapi
 * /api/v1/cms/footer:
 *   get:
 *     tags:
 *       - CMS Footer
 *     summary: Get footer configuration
 *     description: Retrieve the public footer configuration.
 *     operationId: getFooterConfig
 *     responses:
 *       200:
 *         description: Footer config retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/footer', ctrl.getFooterConfig);

// Social links (public)
/**
 * @openapi
 * /api/v1/cms/social-links:
 *   get:
 *     tags:
 *       - CMS Social Links
 *     summary: List social links
 *     description: Retrieve all public social media links.
 *     operationId: listSocialLinks
 *     responses:
 *       200:
 *         description: Social links retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/social-links', ctrl.listSocialLinks);

// SEO by slug (public)
/**
 * @openapi
 * /api/v1/cms/seo/slug/{slug}:
 *   get:
 *     tags:
 *       - CMS SEO
 *     summary: Get SEO metadata by slug
 *     description: Retrieve public SEO metadata for a given page slug.
 *     operationId: getSeoMetaBySlug
 *     parameters:
 *       - name: slug
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Page URL slug
 *     responses:
 *       200:
 *         description: SEO metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: SEO metadata not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/seo/slug/:slug', ctrl.getSeoMetaBySlug);

// Sitemap + Robots.txt (public)
/**
 * @openapi
 * /api/v1/cms/sitemap.xml:
 *   get:
 *     tags:
 *       - CMS SEO
 *     summary: Generate sitemap
 *     description: Generate and return the public XML sitemap.
 *     operationId: generateSitemap
 *     responses:
 *       200:
 *         description: Sitemap generated successfully
 *         content:
 *           application/xml:
 *             schema:
 *               type: string
 */
router.get('/sitemap.xml', ctrl.generateSitemap);

/**
 * @openapi
 * /api/v1/cms/robots.txt:
 *   get:
 *     tags:
 *       - CMS SEO
 *     summary: Get robots.txt
 *     description: Retrieve the public robots.txt content.
 *     operationId: getRobotsTxt
 *     responses:
 *       200:
 *         description: robots.txt retrieved successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get('/robots.txt', ctrl.getRobotsTxt);

// ─── Authenticated Routes ────────────────────────────────────────────────────

router.use(authenticate);

// ─── CMS Pages ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/pages:
 *   post:
 *     tags:
 *       - CMS
 *     summary: Create a CMS page
 *     description: Create a new CMS page. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createCmsPage
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CmsPageInput'
 *     responses:
 *       201:
 *         description: CMS page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/pages', roleGuard(CONTENT_ROLES), createCmsPageValidation, validate, ctrl.createCmsPage);

/**
 * @openapi
 * /api/v1/cms/pages:
 *   get:
 *     tags:
 *       - CMS
 *     summary: List CMS pages
 *     description: Retrieve CMS pages with pagination and filtering. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: listCmsPages
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: CMS pages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pages', roleGuard(CONTENT_ROLES), listCmsPagesValidation, validate, ctrl.listCmsPages);

/**
 * @openapi
 * /api/v1/cms/pages/{id}:
 *   get:
 *     tags:
 *       - CMS
 *     summary: Get CMS page by ID
 *     description: Retrieve a single CMS page by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getCmsPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: CMS page ID
 *     responses:
 *       200:
 *         description: CMS page retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: CMS page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pages/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getCmsPage);

/**
 * @openapi
 * /api/v1/cms/pages/{id}:
 *   put:
 *     tags:
 *       - CMS
 *     summary: Update a CMS page
 *     description: Update an existing CMS page. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateCmsPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: CMS page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CmsPageInput'
 *     responses:
 *       200:
 *         description: CMS page updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: CMS page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/pages/:id', roleGuard(CONTENT_ROLES), updateCmsPageValidation, validate, ctrl.updateCmsPage);

/**
 * @openapi
 * /api/v1/cms/pages/{id}:
 *   delete:
 *     tags:
 *       - CMS
 *     summary: Delete a CMS page
 *     description: Permanently delete a CMS page. Requires Super Admin or Admin role.
 *     operationId: deleteCmsPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: CMS page ID
 *     responses:
 *       200:
 *         description: CMS page deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: CMS page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/pages/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteCmsPage);

// ─── Blog Categories ──────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/blog/categories:
 *   post:
 *     tags:
 *       - CMS Blog
 *     summary: Create a blog category
 *     description: Create a new blog category. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createBlogCategory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCategoryInput'
 *     responses:
 *       201:
 *         description: Blog category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/blog/categories', roleGuard(CONTENT_ROLES), createBlogCategoryValidation, validate, ctrl.createBlogCategory);

/**
 * @openapi
 * /api/v1/cms/blog/categories/{id}:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: Get blog category by ID
 *     description: Retrieve a single blog category by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getBlogCategory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     responses:
 *       200:
 *         description: Blog category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/blog/categories/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getBlogCategory);

/**
 * @openapi
 * /api/v1/cms/blog/categories/{id}:
 *   put:
 *     tags:
 *       - CMS Blog
 *     summary: Update a blog category
 *     description: Update an existing blog category. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateBlogCategory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogCategoryInput'
 *     responses:
 *       200:
 *         description: Blog category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/blog/categories/:id', roleGuard(CONTENT_ROLES), updateBlogCategoryValidation, validate, ctrl.updateBlogCategory);

/**
 * @openapi
 * /api/v1/cms/blog/categories/{id}:
 *   delete:
 *     tags:
 *       - CMS Blog
 *     summary: Delete a blog category
 *     description: Permanently delete a blog category. Requires Super Admin or Admin role.
 *     operationId: deleteBlogCategory
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     responses:
 *       200:
 *         description: Blog category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/blog/categories/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteBlogCategory);

// ─── Blog Tags ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/blog/tags:
 *   post:
 *     tags:
 *       - CMS Blog
 *     summary: Create a blog tag
 *     description: Create a new blog tag. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createBlogTag
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogTagInput'
 *     responses:
 *       201:
 *         description: Blog tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/blog/tags', roleGuard(CONTENT_ROLES), createBlogTagValidation, validate, ctrl.createBlogTag);

/**
 * @openapi
 * /api/v1/cms/blog/tags/{id}:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: Get blog tag by ID
 *     description: Retrieve a single blog tag by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getBlogTag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
 *     responses:
 *       200:
 *         description: Blog tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/blog/tags/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getBlogTag);

/**
 * @openapi
 * /api/v1/cms/blog/tags/{id}:
 *   put:
 *     tags:
 *       - CMS Blog
 *     summary: Update a blog tag
 *     description: Update an existing blog tag. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateBlogTag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogTagInput'
 *     responses:
 *       200:
 *         description: Blog tag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/blog/tags/:id', roleGuard(CONTENT_ROLES), updateBlogTagValidation, validate, ctrl.updateBlogTag);

/**
 * @openapi
 * /api/v1/cms/blog/tags/{id}:
 *   delete:
 *     tags:
 *       - CMS Blog
 *     summary: Delete a blog tag
 *     description: Permanently delete a blog tag. Requires Super Admin or Admin role.
 *     operationId: deleteBlogTag
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
 *     responses:
 *       200:
 *         description: Blog tag deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog tag not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/blog/tags/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteBlogTag);

// ─── Blog Posts ───────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/blog:
 *   post:
 *     tags:
 *       - CMS Blog
 *     summary: Create a blog post
 *     description: Create a new blog post. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createBlogPost
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPostInput'
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/blog', roleGuard(CONTENT_ROLES), createBlogPostValidation, validate, ctrl.createBlogPost);

/**
 * @openapi
 * /api/v1/cms/blog/{id}:
 *   get:
 *     tags:
 *       - CMS Blog
 *     summary: Get blog post by ID
 *     description: Retrieve a single blog post by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getBlogPost
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/blog/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getBlogPost);

/**
 * @openapi
 * /api/v1/cms/blog/{id}:
 *   put:
 *     tags:
 *       - CMS Blog
 *     summary: Update a blog post
 *     description: Update an existing blog post. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateBlogPost
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPostInput'
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/blog/:id', roleGuard(CONTENT_ROLES), updateBlogPostValidation, validate, ctrl.updateBlogPost);

/**
 * @openapi
 * /api/v1/cms/blog/{id}:
 *   delete:
 *     tags:
 *       - CMS Blog
 *     summary: Delete a blog post
 *     description: Permanently delete a blog post. Requires Super Admin or Admin role.
 *     operationId: deleteBlogPost
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/blog/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteBlogPost);

// ─── FAQs (write) ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/faqs:
 *   post:
 *     tags:
 *       - CMS FAQs
 *     summary: Create a FAQ
 *     description: Create a new FAQ entry. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createFaq
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FaqInput'
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/faqs', roleGuard(CONTENT_ROLES), createFaqValidation, validate, ctrl.createFaq);

/**
 * @openapi
 * /api/v1/cms/faqs/{id}:
 *   put:
 *     tags:
 *       - CMS FAQs
 *     summary: Update a FAQ
 *     description: Update an existing FAQ entry. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateFaq
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FaqInput'
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: FAQ not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/faqs/:id', roleGuard(CONTENT_ROLES), updateFaqValidation, validate, ctrl.updateFaq);

/**
 * @openapi
 * /api/v1/cms/faqs/{id}:
 *   delete:
 *     tags:
 *       - CMS FAQs
 *     summary: Delete a FAQ
 *     description: Permanently delete a FAQ entry. Requires Super Admin or Admin role.
 *     operationId: deleteFaq
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: FAQ not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/faqs/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteFaq);

// ─── Testimonials (write) ────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/testimonials:
 *   post:
 *     tags:
 *       - CMS Testimonials
 *     summary: Create a testimonial
 *     description: Create a new testimonial. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createTestimonial
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestimonialInput'
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/testimonials', roleGuard(CONTENT_ROLES), createTestimonialValidation, validate, ctrl.createTestimonial);

/**
 * @openapi
 * /api/v1/cms/testimonials/{id}:
 *   put:
 *     tags:
 *       - CMS Testimonials
 *     summary: Update a testimonial
 *     description: Update an existing testimonial. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateTestimonial
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestimonialInput'
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Testimonial not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/testimonials/:id', roleGuard(CONTENT_ROLES), updateTestimonialValidation, validate, ctrl.updateTestimonial);

/**
 * @openapi
 * /api/v1/cms/testimonials/{id}:
 *   delete:
 *     tags:
 *       - CMS Testimonials
 *     summary: Delete a testimonial
 *     description: Permanently delete a testimonial. Requires Super Admin or Admin role.
 *     operationId: deleteTestimonial
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Testimonial ID
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Testimonial not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/testimonials/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteTestimonial);

// ─── Lookbooks (write) ───────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/lookbooks:
 *   post:
 *     tags:
 *       - CMS Lookbooks
 *     summary: Create a lookbook
 *     description: Create a new lookbook. Requires Super Admin, Admin, Content Manager, or Marketing Manager role.
 *     operationId: createLookbook
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LookbookInput'
 *     responses:
 *       201:
 *         description: Lookbook created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/lookbooks', roleGuard(MARKETING_ROLES), createLookbookValidation, validate, ctrl.createLookbook);

/**
 * @openapi
 * /api/v1/cms/lookbooks/{id}:
 *   put:
 *     tags:
 *       - CMS Lookbooks
 *     summary: Update a lookbook
 *     description: Update an existing lookbook. Requires Super Admin, Admin, Content Manager, or Marketing Manager role.
 *     operationId: updateLookbook
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lookbook ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LookbookInput'
 *     responses:
 *       200:
 *         description: Lookbook updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lookbook not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/lookbooks/:id', roleGuard(MARKETING_ROLES), updateLookbookValidation, validate, ctrl.updateLookbook);

/**
 * @openapi
 * /api/v1/cms/lookbooks/{id}:
 *   delete:
 *     tags:
 *       - CMS Lookbooks
 *     summary: Delete a lookbook
 *     description: Permanently delete a lookbook. Requires Super Admin or Admin role.
 *     operationId: deleteLookbook
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lookbook ID
 *     responses:
 *       200:
 *         description: Lookbook deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lookbook not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/lookbooks/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteLookbook);

// ─── Style Guides (write) ────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/style-guides:
 *   post:
 *     tags:
 *       - CMS Style Guides
 *     summary: Create a style guide
 *     description: Create a new style guide. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createStyleGuide
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StyleGuideInput'
 *     responses:
 *       201:
 *         description: Style guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/style-guides', roleGuard(CONTENT_ROLES), createStyleGuideValidation, validate, ctrl.createStyleGuide);

/**
 * @openapi
 * /api/v1/cms/style-guides/{id}:
 *   put:
 *     tags:
 *       - CMS Style Guides
 *     summary: Update a style guide
 *     description: Update an existing style guide. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateStyleGuide
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Style guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StyleGuideInput'
 *     responses:
 *       200:
 *         description: Style guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Style guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/style-guides/:id', roleGuard(CONTENT_ROLES), updateStyleGuideValidation, validate, ctrl.updateStyleGuide);

/**
 * @openapi
 * /api/v1/cms/style-guides/{id}:
 *   delete:
 *     tags:
 *       - CMS Style Guides
 *     summary: Delete a style guide
 *     description: Permanently delete a style guide. Requires Super Admin or Admin role.
 *     operationId: deleteStyleGuide
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Style guide ID
 *     responses:
 *       200:
 *         description: Style guide deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Style guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/style-guides/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteStyleGuide);

// ─── Size Guides (write) ─────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/size-guides:
 *   post:
 *     tags:
 *       - CMS Size Guides
 *     summary: Create a size guide
 *     description: Create a new size guide. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createSizeGuide
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SizeGuideInput'
 *     responses:
 *       201:
 *         description: Size guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/size-guides', roleGuard(CONTENT_ROLES), createSizeGuideValidation, validate, ctrl.createSizeGuide);

/**
 * @openapi
 * /api/v1/cms/size-guides/{id}:
 *   put:
 *     tags:
 *       - CMS Size Guides
 *     summary: Update a size guide
 *     description: Update an existing size guide. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateSizeGuide
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Size guide ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SizeGuideInput'
 *     responses:
 *       200:
 *         description: Size guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Size guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/size-guides/:id', roleGuard(CONTENT_ROLES), updateSizeGuideValidation, validate, ctrl.updateSizeGuide);

/**
 * @openapi
 * /api/v1/cms/size-guides/{id}:
 *   delete:
 *     tags:
 *       - CMS Size Guides
 *     summary: Delete a size guide
 *     description: Permanently delete a size guide. Requires Super Admin or Admin role.
 *     operationId: deleteSizeGuide
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Size guide ID
 *     responses:
 *       200:
 *         description: Size guide deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Size guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/size-guides/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteSizeGuide);

// ─── Policies (write) ────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/policies:
 *   post:
 *     tags:
 *       - CMS Policies
 *     summary: Create a policy
 *     description: Create a new policy document. Requires Super Admin or Admin role.
 *     operationId: createPolicy
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyInput'
 *     responses:
 *       201:
 *         description: Policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/policies', roleGuard(ADMIN_ROLES), createPolicyValidation, validate, ctrl.createPolicy);

/**
 * @openapi
 * /api/v1/cms/policies/{id}:
 *   put:
 *     tags:
 *       - CMS Policies
 *     summary: Update a policy
 *     description: Update an existing policy document. Requires Super Admin or Admin role.
 *     operationId: updatePolicy
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Policy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyInput'
 *     responses:
 *       200:
 *         description: Policy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Policy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/policies/:id', roleGuard(ADMIN_ROLES), updatePolicyValidation, validate, ctrl.updatePolicy);

// ─── Contact Info (write) ────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/contact-info:
 *   post:
 *     tags:
 *       - CMS Contact
 *     summary: Create contact information
 *     description: Create the storefront contact information record. Requires Super Admin or Admin role.
 *     operationId: createContactInfo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfoInput'
 *     responses:
 *       201:
 *         description: Contact info created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/contact-info', roleGuard(ADMIN_ROLES), createContactInfoValidation, validate, ctrl.createContactInfo);

/**
 * @openapi
 * /api/v1/cms/contact-info/{id}:
 *   put:
 *     tags:
 *       - CMS Contact
 *     summary: Update contact information
 *     description: Update the storefront contact information record. Requires Super Admin or Admin role.
 *     operationId: updateContactInfo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact info ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInfoInput'
 *     responses:
 *       200:
 *         description: Contact info updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contact info not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/contact-info/:id', roleGuard(ADMIN_ROLES), updateContactInfoValidation, validate, ctrl.updateContactInfo);

// ─── Contact Inquiries (admin) ───────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/contact-inquiries:
 *   get:
 *     tags:
 *       - CMS Contact
 *     summary: List contact inquiries
 *     description: Retrieve submitted contact inquiries with pagination and filtering. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: listContactInquiries
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [new, in_progress, resolved]
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact inquiries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/contact-inquiries', roleGuard(CONTENT_ROLES), listContactInquiriesValidation, validate, ctrl.listContactInquiries);

/**
 * @openapi
 * /api/v1/cms/contact-inquiries/{id}:
 *   get:
 *     tags:
 *       - CMS Contact
 *     summary: Get contact inquiry by ID
 *     description: Retrieve a single contact inquiry by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getContactInquiry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact inquiry ID
 *     responses:
 *       200:
 *         description: Contact inquiry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contact inquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/contact-inquiries/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getContactInquiry);

/**
 * @openapi
 * /api/v1/cms/contact-inquiries/{id}:
 *   put:
 *     tags:
 *       - CMS Contact
 *     summary: Update a contact inquiry
 *     description: Update the status of an existing contact inquiry. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateContactInquiry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact inquiry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInquiryUpdateInput'
 *     responses:
 *       200:
 *         description: Contact inquiry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contact inquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/contact-inquiries/:id', roleGuard(CONTENT_ROLES), updateContactInquiryValidation, validate, ctrl.updateContactInquiry);

/**
 * @openapi
 * /api/v1/cms/contact-inquiries/{id}:
 *   delete:
 *     tags:
 *       - CMS Contact
 *     summary: Delete a contact inquiry
 *     description: Permanently delete a contact inquiry. Requires Super Admin or Admin role.
 *     operationId: deleteContactInquiry
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact inquiry ID
 *     responses:
 *       200:
 *         description: Contact inquiry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contact inquiry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/contact-inquiries/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteContactInquiry);

// ─── Dynamic Menus ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/menus:
 *   post:
 *     tags:
 *       - CMS Menus
 *     summary: Create a dynamic menu
 *     description: Create a new dynamic menu. Requires Super Admin or Admin role.
 *     operationId: createDynamicMenu
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DynamicMenuInput'
 *     responses:
 *       201:
 *         description: Dynamic menu created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/menus', roleGuard(ADMIN_ROLES), createDynamicMenuValidation, validate, ctrl.createDynamicMenu);

/**
 * @openapi
 * /api/v1/cms/menus:
 *   get:
 *     tags:
 *       - CMS Menus
 *     summary: List dynamic menus
 *     description: Retrieve dynamic menus with pagination and filtering. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: listDynamicMenus
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dynamic menus retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/menus', roleGuard(CONTENT_ROLES), listDynamicMenusValidation, validate, ctrl.listDynamicMenus);

/**
 * @openapi
 * /api/v1/cms/menus/{id}:
 *   get:
 *     tags:
 *       - CMS Menus
 *     summary: Get dynamic menu by ID
 *     description: Retrieve a single dynamic menu by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getDynamicMenu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dynamic menu ID
 *     responses:
 *       200:
 *         description: Dynamic menu retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dynamic menu not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/menus/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getDynamicMenu);

/**
 * @openapi
 * /api/v1/cms/menus/{id}:
 *   put:
 *     tags:
 *       - CMS Menus
 *     summary: Update a dynamic menu
 *     description: Update an existing dynamic menu. Requires Super Admin or Admin role.
 *     operationId: updateDynamicMenu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dynamic menu ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DynamicMenuInput'
 *     responses:
 *       200:
 *         description: Dynamic menu updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dynamic menu not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/menus/:id', roleGuard(ADMIN_ROLES), updateDynamicMenuValidation, validate, ctrl.updateDynamicMenu);

/**
 * @openapi
 * /api/v1/cms/menus/{id}:
 *   delete:
 *     tags:
 *       - CMS Menus
 *     summary: Delete a dynamic menu
 *     description: Permanently delete a dynamic menu. Requires Super Admin or Admin role.
 *     operationId: deleteDynamicMenu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Dynamic menu ID
 *     responses:
 *       200:
 *         description: Dynamic menu deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Dynamic menu not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/menus/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteDynamicMenu);

// ─── Footer Config ────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/footer:
 *   post:
 *     tags:
 *       - CMS Footer
 *     summary: Create footer configuration
 *     description: Create the footer configuration. Requires Super Admin or Admin role.
 *     operationId: createFooterConfig
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FooterConfigInput'
 *     responses:
 *       201:
 *         description: Footer config created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/footer', roleGuard(ADMIN_ROLES), createFooterConfigValidation, validate, ctrl.createFooterConfig);

/**
 * @openapi
 * /api/v1/cms/footer/{id}:
 *   put:
 *     tags:
 *       - CMS Footer
 *     summary: Update footer configuration
 *     description: Update the existing footer configuration. Requires Super Admin or Admin role.
 *     operationId: updateFooterConfig
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Footer config ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FooterConfigInput'
 *     responses:
 *       200:
 *         description: Footer config updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Footer config not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/footer/:id', roleGuard(ADMIN_ROLES), updateFooterConfigValidation, validate, ctrl.updateFooterConfig);

// ─── Social Links ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/social-links:
 *   post:
 *     tags:
 *       - CMS Social Links
 *     summary: Create a social link
 *     description: Create a new social media link. Requires Super Admin or Admin role.
 *     operationId: createSocialLink
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialLinkInput'
 *     responses:
 *       201:
 *         description: Social link created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/social-links', roleGuard(ADMIN_ROLES), createSocialLinkValidation, validate, ctrl.createSocialLink);

/**
 * @openapi
 * /api/v1/cms/social-links/{id}:
 *   put:
 *     tags:
 *       - CMS Social Links
 *     summary: Update a social link
 *     description: Update an existing social media link. Requires Super Admin or Admin role.
 *     operationId: updateSocialLink
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Social link ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SocialLinkInput'
 *     responses:
 *       200:
 *         description: Social link updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Social link not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/social-links/:id', roleGuard(ADMIN_ROLES), updateSocialLinkValidation, validate, ctrl.updateSocialLink);

/**
 * @openapi
 * /api/v1/cms/social-links/{id}:
 *   delete:
 *     tags:
 *       - CMS Social Links
 *     summary: Delete a social link
 *     description: Permanently delete a social media link. Requires Super Admin or Admin role.
 *     operationId: deleteSocialLink
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Social link ID
 *     responses:
 *       200:
 *         description: Social link deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Social link not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/social-links/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteSocialLink);

// ─── SEO Meta ─────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/seo:
 *   post:
 *     tags:
 *       - CMS SEO
 *     summary: Create SEO metadata
 *     description: Create a new SEO metadata entry. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: createSeoMeta
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeoMetaInput'
 *     responses:
 *       201:
 *         description: SEO metadata created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/seo', roleGuard(CONTENT_ROLES), createSeoMetaValidation, validate, ctrl.createSeoMeta);

/**
 * @openapi
 * /api/v1/cms/seo:
 *   get:
 *     tags:
 *       - CMS SEO
 *     summary: List SEO metadata
 *     description: Retrieve SEO metadata entries with pagination and filtering. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: listSeoMeta
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SEO metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/seo', roleGuard(CONTENT_ROLES), listSeoMetaValidation, validate, ctrl.listSeoMeta);

/**
 * @openapi
 * /api/v1/cms/seo/{id}:
 *   get:
 *     tags:
 *       - CMS SEO
 *     summary: Get SEO metadata by ID
 *     description: Retrieve a single SEO metadata entry by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getSeoMeta
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: SEO metadata ID
 *     responses:
 *       200:
 *         description: SEO metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: SEO metadata not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/seo/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getSeoMeta);

/**
 * @openapi
 * /api/v1/cms/seo/{id}:
 *   put:
 *     tags:
 *       - CMS SEO
 *     summary: Update SEO metadata
 *     description: Update an existing SEO metadata entry. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: updateSeoMeta
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: SEO metadata ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeoMetaInput'
 *     responses:
 *       200:
 *         description: SEO metadata updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: SEO metadata not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/seo/:id', roleGuard(CONTENT_ROLES), updateSeoMetaValidation, validate, ctrl.updateSeoMeta);

/**
 * @openapi
 * /api/v1/cms/seo/{id}:
 *   delete:
 *     tags:
 *       - CMS SEO
 *     summary: Delete SEO metadata
 *     description: Permanently delete an SEO metadata entry. Requires Super Admin or Admin role.
 *     operationId: deleteSeoMeta
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: SEO metadata ID
 *     responses:
 *       200:
 *         description: SEO metadata deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: SEO metadata not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/seo/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteSeoMeta);

// ─── Redirects ────────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/redirects:
 *   post:
 *     tags:
 *       - CMS Redirects
 *     summary: Create a redirect
 *     description: Create a new URL redirect rule. Requires Super Admin or Admin role.
 *     operationId: createRedirect
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RedirectInput'
 *     responses:
 *       201:
 *         description: Redirect created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/redirects', roleGuard(ADMIN_ROLES), createRedirectValidation, validate, ctrl.createRedirect);

/**
 * @openapi
 * /api/v1/cms/redirects:
 *   get:
 *     tags:
 *       - CMS Redirects
 *     summary: List redirects
 *     description: Retrieve URL redirect rules with pagination and filtering. Requires Super Admin or Admin role.
 *     operationId: listRedirects
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Redirects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/redirects', roleGuard(ADMIN_ROLES), listRedirectsValidation, validate, ctrl.listRedirects);

/**
 * @openapi
 * /api/v1/cms/redirects/{id}:
 *   get:
 *     tags:
 *       - CMS Redirects
 *     summary: Get redirect by ID
 *     description: Retrieve a single redirect rule by its numeric ID. Requires Super Admin or Admin role.
 *     operationId: getRedirect
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Redirect ID
 *     responses:
 *       200:
 *         description: Redirect retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Redirect not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/redirects/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.getRedirect);

/**
 * @openapi
 * /api/v1/cms/redirects/{id}:
 *   put:
 *     tags:
 *       - CMS Redirects
 *     summary: Update a redirect
 *     description: Update an existing redirect rule. Requires Super Admin or Admin role.
 *     operationId: updateRedirect
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Redirect ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RedirectInput'
 *     responses:
 *       200:
 *         description: Redirect updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Redirect not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/redirects/:id', roleGuard(ADMIN_ROLES), updateRedirectValidation, validate, ctrl.updateRedirect);

/**
 * @openapi
 * /api/v1/cms/redirects/{id}:
 *   delete:
 *     tags:
 *       - CMS Redirects
 *     summary: Delete a redirect
 *     description: Permanently delete a redirect rule. Requires Super Admin or Admin role.
 *     operationId: deleteRedirect
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Redirect ID
 *     responses:
 *       200:
 *         description: Redirect deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Redirect not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/redirects/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteRedirect);

// ─── URL Rewrites ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/url-rewrites:
 *   post:
 *     tags:
 *       - CMS URL Rewrites
 *     summary: Create a URL rewrite
 *     description: Create a new URL rewrite rule. Requires Super Admin or Admin role.
 *     operationId: createUrlRewrite
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UrlRewriteInput'
 *     responses:
 *       201:
 *         description: URL rewrite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/url-rewrites', roleGuard(ADMIN_ROLES), createUrlRewriteValidation, validate, ctrl.createUrlRewrite);

/**
 * @openapi
 * /api/v1/cms/url-rewrites:
 *   get:
 *     tags:
 *       - CMS URL Rewrites
 *     summary: List URL rewrites
 *     description: Retrieve URL rewrite rules with pagination and filtering. Requires Super Admin or Admin role.
 *     operationId: listUrlRewrites
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL rewrites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/url-rewrites', roleGuard(ADMIN_ROLES), listUrlRewritesValidation, validate, ctrl.listUrlRewrites);

/**
 * @openapi
 * /api/v1/cms/url-rewrites/{id}:
 *   get:
 *     tags:
 *       - CMS URL Rewrites
 *     summary: Get URL rewrite by ID
 *     description: Retrieve a single URL rewrite rule by its numeric ID. Requires Super Admin or Admin role.
 *     operationId: getUrlRewrite
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: URL rewrite ID
 *     responses:
 *       200:
 *         description: URL rewrite retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: URL rewrite not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/url-rewrites/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.getUrlRewrite);

/**
 * @openapi
 * /api/v1/cms/url-rewrites/{id}:
 *   put:
 *     tags:
 *       - CMS URL Rewrites
 *     summary: Update a URL rewrite
 *     description: Update an existing URL rewrite rule. Requires Super Admin or Admin role.
 *     operationId: updateUrlRewrite
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: URL rewrite ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UrlRewriteInput'
 *     responses:
 *       200:
 *         description: URL rewrite updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: URL rewrite not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/url-rewrites/:id', roleGuard(ADMIN_ROLES), updateUrlRewriteValidation, validate, ctrl.updateUrlRewrite);

/**
 * @openapi
 * /api/v1/cms/url-rewrites/{id}:
 *   delete:
 *     tags:
 *       - CMS URL Rewrites
 *     summary: Delete a URL rewrite
 *     description: Permanently delete a URL rewrite rule. Requires Super Admin or Admin role.
 *     operationId: deleteUrlRewrite
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: URL rewrite ID
 *     responses:
 *       200:
 *         description: URL rewrite deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: URL rewrite not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/url-rewrites/:id', roleGuard(ADMIN_ROLES), idParam, validate, ctrl.deleteUrlRewrite);

// ─── Robots.txt (write) ──────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/robots:
 *   put:
 *     tags:
 *       - CMS SEO
 *     summary: Update robots.txt configuration
 *     description: Update the robots.txt configuration content. Requires Super Admin or Admin role.
 *     operationId: updateRobotsTxt
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RobotsConfigInput'
 *     responses:
 *       200:
 *         description: robots.txt configuration updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/robots', roleGuard(ADMIN_ROLES), updateRobotsConfigValidation, validate, ctrl.updateRobotsTxt);

// ─── Content Versions ────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/v1/cms/versions:
 *   get:
 *     tags:
 *       - CMS Content Versions
 *     summary: List content versions
 *     description: Retrieve content version history with pagination and filtering. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: listContentVersions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - name: entityType
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by the type of entity the version belongs to
 *       - name: entityId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter by the ID of the entity the version belongs to
 *     responses:
 *       200:
 *         description: Content versions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/versions', roleGuard(CONTENT_ROLES), listContentVersionsValidation, validate, ctrl.listContentVersions);

/**
 * @openapi
 * /api/v1/cms/versions/{id}:
 *   get:
 *     tags:
 *       - CMS Content Versions
 *     summary: Get content version by ID
 *     description: Retrieve a single content version by its numeric ID. Requires Super Admin, Admin, or Content Manager role.
 *     operationId: getContentVersion
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Content version ID
 *     responses:
 *       200:
 *         description: Content version retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/versions/:id', roleGuard(CONTENT_ROLES), idParam, validate, ctrl.getContentVersion);

/**
 * @openapi
 * /api/v1/cms/versions/{id}/rollback:
 *   post:
 *     tags:
 *       - CMS Content Versions
 *     summary: Rollback to a content version
 *     description: Roll back an entity to a previous content version. Requires Super Admin or Admin role.
 *     operationId: rollbackVersion
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Content version ID to roll back to
 *     responses:
 *       200:
 *         description: Rollback performed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - insufficient role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Content version not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/versions/:id/rollback', roleGuard(ADMIN_ROLES), rollbackVersionValidation, validate, ctrl.rollbackVersion);

export default router;
