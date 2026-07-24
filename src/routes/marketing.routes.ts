import { Router } from 'express';
import createMarketingController from '../controllers/marketing.controller';
import MarketingRepository from '../repositories/marketing.repository';
import CustomerRepository from '../repositories/customer.repository';
import MarketingService from '../services/marketing.service';
import authenticate from '../middlewares/authenticate';
import roleGuard from '../middlewares/roleGuard';
import validate from '../middlewares/validation.middleware';
import {
  analyticsQueryValidation,
  createAbandonedCartRecoveryValidation,
  createBannerValidation,
  createCampaignValidation,
  createChannelCampaignValidation,
  createComboOfferValidation,
  createDealValidation,
  createFlashSaleValidation,
  createGiftCardValidation,
  createHomepageSectionValidation,
  createLandingPageValidation,
  createNewsletterSubscriberValidation,
  createPopupCampaignValidation,
  createReferralProgramValidation,
  createStoreCreditValidation,
  createBuyXGetYOfferValidation,
  idParam,
  listAbandonedCartRecoveriesValidation,
  listBannersValidation,
  listCampaignsValidation,
  listChannelCampaignsValidation,
  listComboOffersValidation,
  listDealsValidation,
  listFlashSalesValidation,
  listGiftCardsValidation,
  listHomepageSectionsValidation,
  listLandingPagesValidation,
  listNewsletterSubscribersValidation,
  listPopupCampaignsValidation,
  listReferralProgramsValidation,
  listStoreCreditsValidation,
  listBuyXGetYOffersValidation,
  redeemGiftCardValidation,
  updateBannerValidation,
  updateCampaignValidation,
  updateChannelCampaignValidation,
  updateComboOfferValidation,
  updateDealValidation,
  updateFlashSaleValidation,
  updateGiftCardValidation,
  updateHomepageSectionValidation,
  updateLandingPageValidation,
  updateNewsletterSubscriberValidation,
  updatePopupCampaignValidation,
  updateReferralProgramValidation,
  updateBuyXGetYOfferValidation,
  updateAbandonedCartRecoveryValidation
} from '../validations/marketing.validation';

const router = Router();
const repository = new MarketingRepository();
const service = new MarketingService(repository, new CustomerRepository());
const controller = createMarketingController(service);

/**
 * @openapi
 * components:
 *   schemas:
 *     NewsletterSubscriberInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: subscriber@example.com
 *         firstName:
 *           type: string
 *           example: Priya
 *         source:
 *           type: string
 *           example: footer-form
 *     BannerInput:
 *       type: object
 *       required:
 *         - title
 *         - imageUrl
 *       properties:
 *         title:
 *           type: string
 *           example: Summer Sale Banner
 *         imageUrl:
 *           type: string
 *           example: https://cdn.example.com/banners/summer-sale.jpg
 *         linkUrl:
 *           type: string
 *           example: /collections/summer-sale
 *         position:
 *           type: string
 *           example: homepage-top
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-31T23:59:59Z"
 *         isActive:
 *           type: boolean
 *           example: true
 *     HomepageSectionInput:
 *       type: object
 *       required:
 *         - title
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           example: Featured Products
 *         type:
 *           type: string
 *           example: PRODUCT_CAROUSEL
 *         order:
 *           type: integer
 *           example: 1
 *         config:
 *           type: object
 *           example: { "productIds": [1, 2, 3] }
 *         isActive:
 *           type: boolean
 *           example: true
 *     CampaignInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           example: Diwali Festival Campaign
 *         type:
 *           type: string
 *           example: EMAIL
 *         description:
 *           type: string
 *           example: Festive season promotional campaign
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-10-15T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-11-05T23:59:59Z"
 *         status:
 *           type: string
 *           enum: [DRAFT, ACTIVE, PAUSED, COMPLETED]
 *           example: DRAFT
 *     FlashSaleInput:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           example: Midnight Flash Sale
 *         discountPercentage:
 *           type: number
 *           example: 30
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-15T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-15T06:00:00Z"
 *         productIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 *     DealInput:
 *       type: object
 *       required:
 *         - name
 *         - dealDate
 *       properties:
 *         name:
 *           type: string
 *           example: Deal of the Day - Denim Jacket
 *         productId:
 *           type: integer
 *           example: 42
 *         discountPercentage:
 *           type: number
 *           example: 25
 *         dealDate:
 *           type: string
 *           format: date
 *           example: "2026-08-10"
 *     ComboOfferInput:
 *       type: object
 *       required:
 *         - name
 *         - productIds
 *       properties:
 *         name:
 *           type: string
 *           example: Summer Combo Pack
 *         productIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [10, 11, 12]
 *         comboPrice:
 *           type: number
 *           example: 1999
 *     BuyXGetYOfferInput:
 *       type: object
 *       required:
 *         - buyProductId
 *         - getProductId
 *         - buyQuantity
 *         - getQuantity
 *       properties:
 *         buyProductId:
 *           type: integer
 *           example: 10
 *         getProductId:
 *           type: integer
 *           example: 11
 *         buyQuantity:
 *           type: integer
 *           example: 2
 *         getQuantity:
 *           type: integer
 *           example: 1
 *         discountPercentage:
 *           type: number
 *           example: 100
 *     GiftCardInput:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         code:
 *           type: string
 *           example: GIFT-2026-XYZ
 *         amount:
 *           type: number
 *           example: 1000
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           example: "2027-08-01T00:00:00Z"
 *         recipientEmail:
 *           type: string
 *           example: recipient@example.com
 *     RedeemGiftCardInput:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: GIFT-2026-XYZ
 *         customerId:
 *           type: integer
 *           example: 1
 *     ReferralProgramInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Refer a Friend
 *         referrerReward:
 *           type: number
 *           example: 200
 *         refereeReward:
 *           type: number
 *           example: 100
 *         isActive:
 *           type: boolean
 *           example: true
 *     StoreCreditInput:
 *       type: object
 *       required:
 *         - customerId
 *         - amount
 *       properties:
 *         customerId:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           example: 500
 *         reason:
 *           type: string
 *           example: Compensation for delayed order
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           example: "2027-08-01T00:00:00Z"
 *     LandingPageInput:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *       properties:
 *         title:
 *           type: string
 *           example: Summer Collection Launch
 *         slug:
 *           type: string
 *           example: summer-collection-launch
 *         content:
 *           type: string
 *           example: "<p>Explore our new summer collection...</p>"
 *         isActive:
 *           type: boolean
 *           example: true
 *     PopupCampaignInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Exit Intent Discount Popup
 *         triggerType:
 *           type: string
 *           example: EXIT_INTENT
 *         content:
 *           type: string
 *           example: "<p>Get 10% off your first order!</p>"
 *         isActive:
 *           type: boolean
 *           example: true
 *     ChannelCampaignInput:
 *       type: object
 *       required:
 *         - name
 *         - channel
 *       properties:
 *         name:
 *           type: string
 *           example: Instagram Festive Push
 *         channel:
 *           type: string
 *           enum: [FACEBOOK, INSTAGRAM, GOOGLE, WHATSAPP, SMS]
 *           example: INSTAGRAM
 *         budget:
 *           type: number
 *           example: 5000
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T00:00:00Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: "2026-08-31T23:59:59Z"
 *     AbandonedCartRecoveryInput:
 *       type: object
 *       required:
 *         - cartId
 *       properties:
 *         cartId:
 *           type: integer
 *           example: 501
 *         customerId:
 *           type: integer
 *           example: 1
 *         reminderScheduledAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-05T10:00:00Z"
 *         discountCode:
 *           type: string
 *           example: COMEBACK10
 */

// Public newsletter subscription endpoint
/**
 * @openapi
 * /api/v1/marketing/subscribers:
 *   post:
 *     tags:
 *       - Marketing Newsletter
 *     summary: Subscribe to newsletter
 *     description: Public endpoint allowing a visitor to subscribe to the newsletter.
 *     operationId: createNewsletterSubscriber
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsletterSubscriberInput'
 *     responses:
 *       201:
 *         description: Subscribed successfully
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
router.post('/subscribers', createNewsletterSubscriberValidation, validate, controller.createNewsletterSubscriber);

router.use(authenticate);

// Banner management
/**
 * @openapi
 * /api/v1/marketing/banners:
 *   post:
 *     tags:
 *       - Marketing Banners
 *     summary: Create a banner
 *     description: Create a new promotional banner. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createBanner
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BannerInput'
 *     responses:
 *       201:
 *         description: Banner created successfully
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
router.post('/banners', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createBannerValidation, validate, controller.createBanner);

/**
 * @openapi
 * /api/v1/marketing/banners:
 *   get:
 *     tags:
 *       - Marketing Banners
 *     summary: List banners
 *     description: Retrieve banners with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listBanners
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
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banners retrieved successfully
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
router.get('/banners', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listBannersValidation, validate, controller.listBanners);

/**
 * @openapi
 * /api/v1/marketing/banners/{id}:
 *   get:
 *     tags:
 *       - Marketing Banners
 *     summary: Get banner by ID
 *     description: Retrieve a single banner by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getBanner
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner retrieved successfully
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
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/banners/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getBanner);

/**
 * @openapi
 * /api/v1/marketing/banners/{id}:
 *   put:
 *     tags:
 *       - Marketing Banners
 *     summary: Update a banner
 *     description: Update an existing banner. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateBanner
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BannerInput'
 *     responses:
 *       200:
 *         description: Banner updated successfully
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
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/banners/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateBannerValidation, validate, controller.updateBanner);

/**
 * @openapi
 * /api/v1/marketing/banners/{id}:
 *   delete:
 *     tags:
 *       - Marketing Banners
 *     summary: Delete a banner
 *     description: Permanently delete a banner. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteBanner
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted successfully
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
 *         description: Banner not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/banners/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteBanner);

// Homepage sections
/**
 * @openapi
 * /api/v1/marketing/homepage-sections:
 *   post:
 *     tags:
 *       - Marketing Homepage Sections
 *     summary: Create a homepage section
 *     description: Create a new homepage layout section. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createHomepageSection
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomepageSectionInput'
 *     responses:
 *       201:
 *         description: Homepage section created successfully
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
router.post('/homepage-sections', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createHomepageSectionValidation, validate, controller.createHomepageSection);

/**
 * @openapi
 * /api/v1/marketing/homepage-sections:
 *   get:
 *     tags:
 *       - Marketing Homepage Sections
 *     summary: List homepage sections
 *     description: Retrieve homepage layout sections with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listHomepageSections
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
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Homepage sections retrieved successfully
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
router.get('/homepage-sections', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listHomepageSectionsValidation, validate, controller.listHomepageSections);

/**
 * @openapi
 * /api/v1/marketing/homepage-sections/{id}:
 *   get:
 *     tags:
 *       - Marketing Homepage Sections
 *     summary: Get homepage section by ID
 *     description: Retrieve a single homepage section by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getHomepageSection
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Homepage section ID
 *     responses:
 *       200:
 *         description: Homepage section retrieved successfully
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
 *         description: Homepage section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/homepage-sections/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getHomepageSection);

/**
 * @openapi
 * /api/v1/marketing/homepage-sections/{id}:
 *   put:
 *     tags:
 *       - Marketing Homepage Sections
 *     summary: Update a homepage section
 *     description: Update an existing homepage section. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateHomepageSection
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Homepage section ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomepageSectionInput'
 *     responses:
 *       200:
 *         description: Homepage section updated successfully
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
 *         description: Homepage section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/homepage-sections/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateHomepageSectionValidation, validate, controller.updateHomepageSection);

/**
 * @openapi
 * /api/v1/marketing/homepage-sections/{id}:
 *   delete:
 *     tags:
 *       - Marketing Homepage Sections
 *     summary: Delete a homepage section
 *     description: Permanently delete a homepage section. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteHomepageSection
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Homepage section ID
 *     responses:
 *       200:
 *         description: Homepage section deleted successfully
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
 *         description: Homepage section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/homepage-sections/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteHomepageSection);

// Campaign management
/**
 * @openapi
 * /api/v1/marketing/campaigns:
 *   post:
 *     tags:
 *       - Marketing Campaigns
 *     summary: Create a campaign
 *     description: Create a new marketing campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createCampaign
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampaignInput'
 *     responses:
 *       201:
 *         description: Campaign created successfully
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
router.post('/campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createCampaignValidation, validate, controller.createCampaign);

/**
 * @openapi
 * /api/v1/marketing/campaigns:
 *   get:
 *     tags:
 *       - Marketing Campaigns
 *     summary: List campaigns
 *     description: Retrieve marketing campaigns with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listCampaigns
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
 *           enum: [DRAFT, ACTIVE, PAUSED, COMPLETED]
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaigns retrieved successfully
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
router.get('/campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listCampaignsValidation, validate, controller.listCampaigns);

/**
 * @openapi
 * /api/v1/marketing/campaigns/{id}:
 *   get:
 *     tags:
 *       - Marketing Campaigns
 *     summary: Get campaign by ID
 *     description: Retrieve a single marketing campaign by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
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
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getCampaign);

/**
 * @openapi
 * /api/v1/marketing/campaigns/{id}:
 *   put:
 *     tags:
 *       - Marketing Campaigns
 *     summary: Update a campaign
 *     description: Update an existing marketing campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampaignInput'
 *     responses:
 *       200:
 *         description: Campaign updated successfully
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
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateCampaignValidation, validate, controller.updateCampaign);

/**
 * @openapi
 * /api/v1/marketing/campaigns/{id}:
 *   delete:
 *     tags:
 *       - Marketing Campaigns
 *     summary: Delete a campaign
 *     description: Permanently delete a marketing campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
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
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteCampaign);

// Flash sale management
/**
 * @openapi
 * /api/v1/marketing/flash-sales:
 *   post:
 *     tags:
 *       - Marketing Flash Sales
 *     summary: Create a flash sale
 *     description: Create a new time-limited flash sale. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createFlashSale
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FlashSaleInput'
 *     responses:
 *       201:
 *         description: Flash sale created successfully
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
router.post('/flash-sales', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createFlashSaleValidation, validate, controller.createFlashSale);

/**
 * @openapi
 * /api/v1/marketing/flash-sales:
 *   get:
 *     tags:
 *       - Marketing Flash Sales
 *     summary: List flash sales
 *     description: Retrieve flash sales with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listFlashSales
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
 *     responses:
 *       200:
 *         description: Flash sales retrieved successfully
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
router.get('/flash-sales', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listFlashSalesValidation, validate, controller.listFlashSales);

/**
 * @openapi
 * /api/v1/marketing/flash-sales/{id}:
 *   get:
 *     tags:
 *       - Marketing Flash Sales
 *     summary: Get flash sale by ID
 *     description: Retrieve a single flash sale by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getFlashSale
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Flash sale ID
 *     responses:
 *       200:
 *         description: Flash sale retrieved successfully
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
 *         description: Flash sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/flash-sales/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getFlashSale);

/**
 * @openapi
 * /api/v1/marketing/flash-sales/{id}:
 *   put:
 *     tags:
 *       - Marketing Flash Sales
 *     summary: Update a flash sale
 *     description: Update an existing flash sale. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateFlashSale
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Flash sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FlashSaleInput'
 *     responses:
 *       200:
 *         description: Flash sale updated successfully
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
 *         description: Flash sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/flash-sales/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateFlashSaleValidation, validate, controller.updateFlashSale);

/**
 * @openapi
 * /api/v1/marketing/flash-sales/{id}:
 *   delete:
 *     tags:
 *       - Marketing Flash Sales
 *     summary: Delete a flash sale
 *     description: Permanently delete a flash sale. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteFlashSale
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Flash sale ID
 *     responses:
 *       200:
 *         description: Flash sale deleted successfully
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
 *         description: Flash sale not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/flash-sales/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteFlashSale);

// Deal of the day management
/**
 * @openapi
 * /api/v1/marketing/deals:
 *   post:
 *     tags:
 *       - Marketing Deals
 *     summary: Create a deal of the day
 *     description: Create a new deal of the day. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createDeal
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DealInput'
 *     responses:
 *       201:
 *         description: Deal created successfully
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
router.post('/deals', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createDealValidation, validate, controller.createDeal);

/**
 * @openapi
 * /api/v1/marketing/deals:
 *   get:
 *     tags:
 *       - Marketing Deals
 *     summary: List deals
 *     description: Retrieve deals of the day with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listDeals
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
 *     responses:
 *       200:
 *         description: Deals retrieved successfully
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
router.get('/deals', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listDealsValidation, validate, controller.listDeals);

/**
 * @openapi
 * /api/v1/marketing/deals/{id}:
 *   get:
 *     tags:
 *       - Marketing Deals
 *     summary: Get deal by ID
 *     description: Retrieve a single deal of the day by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getDeal
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Deal ID
 *     responses:
 *       200:
 *         description: Deal retrieved successfully
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
 *         description: Deal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/deals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getDeal);

/**
 * @openapi
 * /api/v1/marketing/deals/{id}:
 *   put:
 *     tags:
 *       - Marketing Deals
 *     summary: Update a deal
 *     description: Update an existing deal of the day. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateDeal
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Deal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DealInput'
 *     responses:
 *       200:
 *         description: Deal updated successfully
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
 *         description: Deal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/deals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateDealValidation, validate, controller.updateDeal);

/**
 * @openapi
 * /api/v1/marketing/deals/{id}:
 *   delete:
 *     tags:
 *       - Marketing Deals
 *     summary: Delete a deal
 *     description: Permanently delete a deal of the day. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteDeal
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Deal ID
 *     responses:
 *       200:
 *         description: Deal deleted successfully
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
 *         description: Deal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/deals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteDeal);

// Combo offers
/**
 * @openapi
 * /api/v1/marketing/combo-offers:
 *   post:
 *     tags:
 *       - Marketing Combo Offers
 *     summary: Create a combo offer
 *     description: Create a new product combo offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createComboOffer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComboOfferInput'
 *     responses:
 *       201:
 *         description: Combo offer created successfully
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
router.post('/combo-offers', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createComboOfferValidation, validate, controller.createComboOffer);

/**
 * @openapi
 * /api/v1/marketing/combo-offers:
 *   get:
 *     tags:
 *       - Marketing Combo Offers
 *     summary: List combo offers
 *     description: Retrieve combo offers with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listComboOffers
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
 *     responses:
 *       200:
 *         description: Combo offers retrieved successfully
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
router.get('/combo-offers', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listComboOffersValidation, validate, controller.listComboOffers);

/**
 * @openapi
 * /api/v1/marketing/combo-offers/{id}:
 *   get:
 *     tags:
 *       - Marketing Combo Offers
 *     summary: Get combo offer by ID
 *     description: Retrieve a single combo offer by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getComboOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Combo offer ID
 *     responses:
 *       200:
 *         description: Combo offer retrieved successfully
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
 *         description: Combo offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/combo-offers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getComboOffer);

/**
 * @openapi
 * /api/v1/marketing/combo-offers/{id}:
 *   put:
 *     tags:
 *       - Marketing Combo Offers
 *     summary: Update a combo offer
 *     description: Update an existing combo offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateComboOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Combo offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComboOfferInput'
 *     responses:
 *       200:
 *         description: Combo offer updated successfully
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
 *         description: Combo offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/combo-offers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateComboOfferValidation, validate, controller.updateComboOffer);

/**
 * @openapi
 * /api/v1/marketing/combo-offers/{id}:
 *   delete:
 *     tags:
 *       - Marketing Combo Offers
 *     summary: Delete a combo offer
 *     description: Permanently delete a combo offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteComboOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Combo offer ID
 *     responses:
 *       200:
 *         description: Combo offer deleted successfully
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
 *         description: Combo offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/combo-offers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteComboOffer);

// Buy X Get Y offers
/**
 * @openapi
 * /api/v1/marketing/buy-x-get-y:
 *   post:
 *     tags:
 *       - Marketing Buy X Get Y
 *     summary: Create a Buy X Get Y offer
 *     description: Create a new Buy X Get Y promotional offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createBuyXGetYOffer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyXGetYOfferInput'
 *     responses:
 *       201:
 *         description: Buy X Get Y offer created successfully
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
router.post('/buy-x-get-y', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createBuyXGetYOfferValidation, validate, controller.createBuyXGetYOffer);

/**
 * @openapi
 * /api/v1/marketing/buy-x-get-y:
 *   get:
 *     tags:
 *       - Marketing Buy X Get Y
 *     summary: List Buy X Get Y offers
 *     description: Retrieve Buy X Get Y offers with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listBuyXGetYOffers
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
 *     responses:
 *       200:
 *         description: Buy X Get Y offers retrieved successfully
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
router.get('/buy-x-get-y', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listBuyXGetYOffersValidation, validate, controller.listBuyXGetYOffers);

/**
 * @openapi
 * /api/v1/marketing/buy-x-get-y/{id}:
 *   get:
 *     tags:
 *       - Marketing Buy X Get Y
 *     summary: Get Buy X Get Y offer by ID
 *     description: Retrieve a single Buy X Get Y offer by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getBuyXGetYOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buy X Get Y offer ID
 *     responses:
 *       200:
 *         description: Buy X Get Y offer retrieved successfully
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
 *         description: Buy X Get Y offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/buy-x-get-y/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getBuyXGetYOffer);

/**
 * @openapi
 * /api/v1/marketing/buy-x-get-y/{id}:
 *   put:
 *     tags:
 *       - Marketing Buy X Get Y
 *     summary: Update a Buy X Get Y offer
 *     description: Update an existing Buy X Get Y offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateBuyXGetYOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buy X Get Y offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyXGetYOfferInput'
 *     responses:
 *       200:
 *         description: Buy X Get Y offer updated successfully
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
 *         description: Buy X Get Y offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/buy-x-get-y/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateBuyXGetYOfferValidation, validate, controller.updateBuyXGetYOffer);

/**
 * @openapi
 * /api/v1/marketing/buy-x-get-y/{id}:
 *   delete:
 *     tags:
 *       - Marketing Buy X Get Y
 *     summary: Delete a Buy X Get Y offer
 *     description: Permanently delete a Buy X Get Y offer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteBuyXGetYOffer
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Buy X Get Y offer ID
 *     responses:
 *       200:
 *         description: Buy X Get Y offer deleted successfully
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
 *         description: Buy X Get Y offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/buy-x-get-y/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteBuyXGetYOffer);

// Gift cards
/**
 * @openapi
 * /api/v1/marketing/gift-cards:
 *   post:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: Create a gift card
 *     description: Create a new gift card. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createGiftCard
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GiftCardInput'
 *     responses:
 *       201:
 *         description: Gift card created successfully
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
router.post('/gift-cards', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createGiftCardValidation, validate, controller.createGiftCard);

/**
 * @openapi
 * /api/v1/marketing/gift-cards:
 *   get:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: List gift cards
 *     description: Retrieve gift cards with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listGiftCards
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
 *     responses:
 *       200:
 *         description: Gift cards retrieved successfully
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
router.get('/gift-cards', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listGiftCardsValidation, validate, controller.listGiftCards);

/**
 * @openapi
 * /api/v1/marketing/gift-cards/{id}:
 *   get:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: Get gift card by ID
 *     description: Retrieve a single gift card by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getGiftCard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gift card ID
 *     responses:
 *       200:
 *         description: Gift card retrieved successfully
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
 *         description: Gift card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/gift-cards/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getGiftCard);

/**
 * @openapi
 * /api/v1/marketing/gift-cards/{id}:
 *   put:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: Update a gift card
 *     description: Update an existing gift card. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateGiftCard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gift card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GiftCardInput'
 *     responses:
 *       200:
 *         description: Gift card updated successfully
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
 *         description: Gift card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/gift-cards/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateGiftCardValidation, validate, controller.updateGiftCard);

/**
 * @openapi
 * /api/v1/marketing/gift-cards/{id}:
 *   delete:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: Delete a gift card
 *     description: Permanently delete a gift card. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteGiftCard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gift card ID
 *     responses:
 *       200:
 *         description: Gift card deleted successfully
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
 *         description: Gift card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/gift-cards/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteGiftCard);

/**
 * @openapi
 * /api/v1/marketing/gift-cards/{id}/redeem:
 *   post:
 *     tags:
 *       - Marketing Gift Cards
 *     summary: Redeem a gift card
 *     description: Redeem a gift card against a customer's account. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: redeemGiftCard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gift card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RedeemGiftCardInput'
 *     responses:
 *       200:
 *         description: Gift card redeemed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Validation error or gift card already redeemed/expired
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
 *         description: Gift card not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/gift-cards/:id/redeem', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), redeemGiftCardValidation, validate, controller.redeemGiftCard);

// Referral programs
/**
 * @openapi
 * /api/v1/marketing/referrals:
 *   post:
 *     tags:
 *       - Marketing Referrals
 *     summary: Create a referral program
 *     description: Create a new customer referral program. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createReferralProgram
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReferralProgramInput'
 *     responses:
 *       201:
 *         description: Referral program created successfully
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
router.post('/referrals', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createReferralProgramValidation, validate, controller.createReferralProgram);

/**
 * @openapi
 * /api/v1/marketing/referrals:
 *   get:
 *     tags:
 *       - Marketing Referrals
 *     summary: List referral programs
 *     description: Retrieve referral programs with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listReferralPrograms
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
 *     responses:
 *       200:
 *         description: Referral programs retrieved successfully
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
router.get('/referrals', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listReferralProgramsValidation, validate, controller.listReferralPrograms);

/**
 * @openapi
 * /api/v1/marketing/referrals/{id}:
 *   get:
 *     tags:
 *       - Marketing Referrals
 *     summary: Get referral program by ID
 *     description: Retrieve a single referral program by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getReferralProgram
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral program ID
 *     responses:
 *       200:
 *         description: Referral program retrieved successfully
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
 *         description: Referral program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/referrals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getReferralProgram);

/**
 * @openapi
 * /api/v1/marketing/referrals/{id}:
 *   put:
 *     tags:
 *       - Marketing Referrals
 *     summary: Update a referral program
 *     description: Update an existing referral program. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateReferralProgram
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReferralProgramInput'
 *     responses:
 *       200:
 *         description: Referral program updated successfully
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
 *         description: Referral program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/referrals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateReferralProgramValidation, validate, controller.updateReferralProgram);

/**
 * @openapi
 * /api/v1/marketing/referrals/{id}:
 *   delete:
 *     tags:
 *       - Marketing Referrals
 *     summary: Delete a referral program
 *     description: Permanently delete a referral program. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteReferralProgram
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Referral program ID
 *     responses:
 *       200:
 *         description: Referral program deleted successfully
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
 *         description: Referral program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/referrals/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteReferralProgram);

// Store credit
/**
 * @openapi
 * /api/v1/marketing/store-credits:
 *   post:
 *     tags:
 *       - Marketing Store Credit
 *     summary: Create a store credit
 *     description: Issue a new store credit to a customer. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createStoreCredit
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreCreditInput'
 *     responses:
 *       201:
 *         description: Store credit created successfully
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
router.post('/store-credits', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createStoreCreditValidation, validate, controller.createStoreCredit);

/**
 * @openapi
 * /api/v1/marketing/store-credits:
 *   get:
 *     tags:
 *       - Marketing Store Credit
 *     summary: List store credits
 *     description: Retrieve store credits with pagination and filtering. Accessible to any authenticated user.
 *     operationId: listStoreCredits
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
 *       - name: customerId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Store credits retrieved successfully
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
 */
router.get('/store-credits', listStoreCreditsValidation, validate, controller.listStoreCredits);

// Newsletter subscribers
/**
 * @openapi
 * /api/v1/marketing/subscribers:
 *   get:
 *     tags:
 *       - Marketing Newsletter
 *     summary: List newsletter subscribers
 *     description: Retrieve newsletter subscribers with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listNewsletterSubscribers
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
 *         description: Newsletter subscribers retrieved successfully
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
router.get('/subscribers', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listNewsletterSubscribersValidation, validate, controller.listNewsletterSubscribers);

/**
 * @openapi
 * /api/v1/marketing/subscribers/{id}:
 *   get:
 *     tags:
 *       - Marketing Newsletter
 *     summary: Get newsletter subscriber by ID
 *     description: Retrieve a single newsletter subscriber by their numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getNewsletterSubscriber
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter subscriber ID
 *     responses:
 *       200:
 *         description: Newsletter subscriber retrieved successfully
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
 *         description: Newsletter subscriber not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/subscribers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getNewsletterSubscriber);

/**
 * @openapi
 * /api/v1/marketing/subscribers/{id}:
 *   put:
 *     tags:
 *       - Marketing Newsletter
 *     summary: Update a newsletter subscriber
 *     description: Update an existing newsletter subscriber's details. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateNewsletterSubscriber
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter subscriber ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewsletterSubscriberInput'
 *     responses:
 *       200:
 *         description: Newsletter subscriber updated successfully
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
 *         description: Newsletter subscriber not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/subscribers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateNewsletterSubscriberValidation, validate, controller.updateNewsletterSubscriber);

/**
 * @openapi
 * /api/v1/marketing/subscribers/{id}:
 *   delete:
 *     tags:
 *       - Marketing Newsletter
 *     summary: Delete a newsletter subscriber
 *     description: Permanently delete a newsletter subscriber. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteNewsletterSubscriber
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter subscriber ID
 *     responses:
 *       200:
 *         description: Newsletter subscriber deleted successfully
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
 *         description: Newsletter subscriber not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/subscribers/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteNewsletterSubscriber);

// Landing pages
/**
 * @openapi
 * /api/v1/marketing/landing-pages:
 *   post:
 *     tags:
 *       - Marketing Landing Pages
 *     summary: Create a landing page
 *     description: Create a new marketing landing page. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createLandingPage
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandingPageInput'
 *     responses:
 *       201:
 *         description: Landing page created successfully
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
router.post('/landing-pages', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createLandingPageValidation, validate, controller.createLandingPage);

/**
 * @openapi
 * /api/v1/marketing/landing-pages:
 *   get:
 *     tags:
 *       - Marketing Landing Pages
 *     summary: List landing pages
 *     description: Retrieve landing pages with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listLandingPages
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
 *         description: Landing pages retrieved successfully
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
router.get('/landing-pages', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listLandingPagesValidation, validate, controller.listLandingPages);

/**
 * @openapi
 * /api/v1/marketing/landing-pages/{id}:
 *   get:
 *     tags:
 *       - Marketing Landing Pages
 *     summary: Get landing page by ID
 *     description: Retrieve a single landing page by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getLandingPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Landing page ID
 *     responses:
 *       200:
 *         description: Landing page retrieved successfully
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
 *         description: Landing page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/landing-pages/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getLandingPage);

/**
 * @openapi
 * /api/v1/marketing/landing-pages/{id}:
 *   put:
 *     tags:
 *       - Marketing Landing Pages
 *     summary: Update a landing page
 *     description: Update an existing landing page. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateLandingPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Landing page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LandingPageInput'
 *     responses:
 *       200:
 *         description: Landing page updated successfully
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
 *         description: Landing page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/landing-pages/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateLandingPageValidation, validate, controller.updateLandingPage);

/**
 * @openapi
 * /api/v1/marketing/landing-pages/{id}:
 *   delete:
 *     tags:
 *       - Marketing Landing Pages
 *     summary: Delete a landing page
 *     description: Permanently delete a landing page. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteLandingPage
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Landing page ID
 *     responses:
 *       200:
 *         description: Landing page deleted successfully
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
 *         description: Landing page not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/landing-pages/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteLandingPage);

// Popup campaigns
/**
 * @openapi
 * /api/v1/marketing/popup-campaigns:
 *   post:
 *     tags:
 *       - Marketing Popup Campaigns
 *     summary: Create a popup campaign
 *     description: Create a new on-site popup campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createPopupCampaign
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PopupCampaignInput'
 *     responses:
 *       201:
 *         description: Popup campaign created successfully
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
router.post('/popup-campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createPopupCampaignValidation, validate, controller.createPopupCampaign);

/**
 * @openapi
 * /api/v1/marketing/popup-campaigns:
 *   get:
 *     tags:
 *       - Marketing Popup Campaigns
 *     summary: List popup campaigns
 *     description: Retrieve popup campaigns with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listPopupCampaigns
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
 *     responses:
 *       200:
 *         description: Popup campaigns retrieved successfully
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
router.get('/popup-campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listPopupCampaignsValidation, validate, controller.listPopupCampaigns);

/**
 * @openapi
 * /api/v1/marketing/popup-campaigns/{id}:
 *   get:
 *     tags:
 *       - Marketing Popup Campaigns
 *     summary: Get popup campaign by ID
 *     description: Retrieve a single popup campaign by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getPopupCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Popup campaign ID
 *     responses:
 *       200:
 *         description: Popup campaign retrieved successfully
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
 *         description: Popup campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/popup-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getPopupCampaign);

/**
 * @openapi
 * /api/v1/marketing/popup-campaigns/{id}:
 *   put:
 *     tags:
 *       - Marketing Popup Campaigns
 *     summary: Update a popup campaign
 *     description: Update an existing popup campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updatePopupCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Popup campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PopupCampaignInput'
 *     responses:
 *       200:
 *         description: Popup campaign updated successfully
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
 *         description: Popup campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/popup-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updatePopupCampaignValidation, validate, controller.updatePopupCampaign);

/**
 * @openapi
 * /api/v1/marketing/popup-campaigns/{id}:
 *   delete:
 *     tags:
 *       - Marketing Popup Campaigns
 *     summary: Delete a popup campaign
 *     description: Permanently delete a popup campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deletePopupCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Popup campaign ID
 *     responses:
 *       200:
 *         description: Popup campaign deleted successfully
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
 *         description: Popup campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/popup-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deletePopupCampaign);

// Channel campaigns
/**
 * @openapi
 * /api/v1/marketing/channel-campaigns:
 *   post:
 *     tags:
 *       - Marketing Channel Campaigns
 *     summary: Create a channel campaign
 *     description: Create a new social/ad channel campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createChannelCampaign
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChannelCampaignInput'
 *     responses:
 *       201:
 *         description: Channel campaign created successfully
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
router.post('/channel-campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createChannelCampaignValidation, validate, controller.createChannelCampaign);

/**
 * @openapi
 * /api/v1/marketing/channel-campaigns:
 *   get:
 *     tags:
 *       - Marketing Channel Campaigns
 *     summary: List channel campaigns
 *     description: Retrieve channel campaigns with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listChannelCampaigns
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
 *       - name: channel
 *         in: query
 *         schema:
 *           type: string
 *           enum: [FACEBOOK, INSTAGRAM, GOOGLE, WHATSAPP, SMS]
 *     responses:
 *       200:
 *         description: Channel campaigns retrieved successfully
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
router.get('/channel-campaigns', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listChannelCampaignsValidation, validate, controller.listChannelCampaigns);

/**
 * @openapi
 * /api/v1/marketing/channel-campaigns/{id}:
 *   get:
 *     tags:
 *       - Marketing Channel Campaigns
 *     summary: Get channel campaign by ID
 *     description: Retrieve a single channel campaign by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getChannelCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel campaign ID
 *     responses:
 *       200:
 *         description: Channel campaign retrieved successfully
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
 *         description: Channel campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/channel-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getChannelCampaign);

/**
 * @openapi
 * /api/v1/marketing/channel-campaigns/{id}:
 *   put:
 *     tags:
 *       - Marketing Channel Campaigns
 *     summary: Update a channel campaign
 *     description: Update an existing channel campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateChannelCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChannelCampaignInput'
 *     responses:
 *       200:
 *         description: Channel campaign updated successfully
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
 *         description: Channel campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/channel-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateChannelCampaignValidation, validate, controller.updateChannelCampaign);

/**
 * @openapi
 * /api/v1/marketing/channel-campaigns/{id}:
 *   delete:
 *     tags:
 *       - Marketing Channel Campaigns
 *     summary: Delete a channel campaign
 *     description: Permanently delete a channel campaign. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteChannelCampaign
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Channel campaign ID
 *     responses:
 *       200:
 *         description: Channel campaign deleted successfully
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
 *         description: Channel campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/channel-campaigns/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteChannelCampaign);

// Abandoned cart recovery
/**
 * @openapi
 * /api/v1/marketing/abandoned-carts:
 *   post:
 *     tags:
 *       - Marketing Abandoned Carts
 *     summary: Create an abandoned cart recovery
 *     description: Create a new abandoned cart recovery record. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: createAbandonedCartRecovery
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbandonedCartRecoveryInput'
 *     responses:
 *       201:
 *         description: Abandoned cart recovery created successfully
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
router.post('/abandoned-carts', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), createAbandonedCartRecoveryValidation, validate, controller.createAbandonedCartRecovery);

/**
 * @openapi
 * /api/v1/marketing/abandoned-carts:
 *   get:
 *     tags:
 *       - Marketing Abandoned Carts
 *     summary: List abandoned cart recoveries
 *     description: Retrieve abandoned cart recovery records with pagination and filtering. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: listAbandonedCartRecoveries
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
 *     responses:
 *       200:
 *         description: Abandoned cart recoveries retrieved successfully
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
router.get('/abandoned-carts', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), listAbandonedCartRecoveriesValidation, validate, controller.listAbandonedCartRecoveries);

/**
 * @openapi
 * /api/v1/marketing/abandoned-carts/{id}:
 *   get:
 *     tags:
 *       - Marketing Abandoned Carts
 *     summary: Get abandoned cart recovery by ID
 *     description: Retrieve a single abandoned cart recovery record by its numeric ID. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getAbandonedCartRecovery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Abandoned cart recovery ID
 *     responses:
 *       200:
 *         description: Abandoned cart recovery retrieved successfully
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
 *         description: Abandoned cart recovery not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/abandoned-carts/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.getAbandonedCartRecovery);

/**
 * @openapi
 * /api/v1/marketing/abandoned-carts/{id}:
 *   put:
 *     tags:
 *       - Marketing Abandoned Carts
 *     summary: Update an abandoned cart recovery
 *     description: Update an existing abandoned cart recovery record. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: updateAbandonedCartRecovery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Abandoned cart recovery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AbandonedCartRecoveryInput'
 *     responses:
 *       200:
 *         description: Abandoned cart recovery updated successfully
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
 *         description: Abandoned cart recovery not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/abandoned-carts/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), updateAbandonedCartRecoveryValidation, validate, controller.updateAbandonedCartRecovery);

/**
 * @openapi
 * /api/v1/marketing/abandoned-carts/{id}:
 *   delete:
 *     tags:
 *       - Marketing Abandoned Carts
 *     summary: Delete an abandoned cart recovery
 *     description: Permanently delete an abandoned cart recovery record. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: deleteAbandonedCartRecovery
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Abandoned cart recovery ID
 *     responses:
 *       200:
 *         description: Abandoned cart recovery deleted successfully
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
 *         description: Abandoned cart recovery not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/abandoned-carts/:id', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), idParam, validate, controller.deleteAbandonedCartRecovery);

// Analytics
/**
 * @openapi
 * /api/v1/marketing/analytics:
 *   get:
 *     tags:
 *       - Marketing Analytics
 *     summary: Get campaign analytics
 *     description: Retrieve aggregated marketing campaign performance analytics. Requires Super Admin, Admin, or Marketing Manager role.
 *     operationId: getCampaignAnalytics
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: startDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the analytics window
 *       - name: endDate
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the analytics window
 *       - name: campaignId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter analytics by a specific campaign
 *     responses:
 *       200:
 *         description: Campaign analytics retrieved successfully
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
router.get('/analytics', roleGuard(['Super Admin', 'Admin', 'Marketing Manager']), analyticsQueryValidation, validate, controller.getCampaignAnalytics);

export default router;