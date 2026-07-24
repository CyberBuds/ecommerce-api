import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import MarketingService from '../services/marketing.service';

export default function createMarketingController(service: MarketingService) {
  const getActorId = (req: Request) => (req as any).user?.sub ? Number((req as any).user.sub) : undefined;
  const getActorRole = (req: Request) => (req as any).user?.roleName || (req as any).user?.role;
  const getCurrentCustomerId = (req: Request) => (req as any).user?.sub ? Number((req as any).user.sub) : undefined;

  return {
    createBanner: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const banner = await service.createBanner(req.body, getActorId(req));
        return apiResponse.created(res, banner, 'Banner created successfully');
      } catch (error) {
        next(error);
      }
    },

    listBanners: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const banners = await service.listBanners(req.query as any);
        return apiResponse.success(res, banners, 'Banners fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getBanner: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const banner = await service.getBanner(id);
        return apiResponse.success(res, banner, 'Banner fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateBanner: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const banner = await service.updateBanner(id, req.body, getActorId(req));
        return apiResponse.success(res, banner, 'Banner updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteBanner: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteBanner(id);
        return apiResponse.success(res, null, 'Banner deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createHomepageSection: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const section = await service.createHomepageSection(req.body, getActorId(req));
        return apiResponse.created(res, section, 'Homepage section created successfully');
      } catch (error) {
        next(error);
      }
    },

    listHomepageSections: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sections = await service.listHomepageSections(req.query as any);
        return apiResponse.success(res, sections, 'Homepage sections fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getHomepageSection: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const section = await service.getHomepageSection(id);
        return apiResponse.success(res, section, 'Homepage section fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateHomepageSection: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const section = await service.updateHomepageSection(id, req.body, getActorId(req));
        return apiResponse.success(res, section, 'Homepage section updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteHomepageSection: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteHomepageSection(id);
        return apiResponse.success(res, null, 'Homepage section deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const campaign = await service.createCampaign(req.body, getActorId(req));
        return apiResponse.created(res, campaign, 'Campaign created successfully');
      } catch (error) {
        next(error);
      }
    },

    listCampaigns: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const campaigns = await service.listCampaigns(req.query as any);
        return apiResponse.success(res, campaigns, 'Campaigns fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const campaign = await service.getCampaign(id);
        return apiResponse.success(res, campaign, 'Campaign fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const campaign = await service.updateCampaign(id, req.body, getActorId(req));
        return apiResponse.success(res, campaign, 'Campaign updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteCampaign(id);
        return apiResponse.success(res, null, 'Campaign deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createFlashSale: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sale = await service.createFlashSale(req.body, getActorId(req));
        return apiResponse.created(res, sale, 'Flash sale created successfully');
      } catch (error) {
        next(error);
      }
    },

    listFlashSales: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sales = await service.listFlashSales(req.query as any);
        return apiResponse.success(res, sales, 'Flash sales fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getFlashSale: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const sale = await service.getFlashSale(id);
        return apiResponse.success(res, sale, 'Flash sale fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateFlashSale: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const sale = await service.updateFlashSale(id, req.body, getActorId(req));
        return apiResponse.success(res, sale, 'Flash sale updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteFlashSale: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteFlashSale(id);
        return apiResponse.success(res, null, 'Flash sale deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createDeal: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const deal = await service.createDealOfTheDay(req.body, getActorId(req));
        return apiResponse.created(res, deal, 'Deal of the day created successfully');
      } catch (error) {
        next(error);
      }
    },

    listDeals: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const deals = await service.listDeals(req.query as any);
        return apiResponse.success(res, deals, 'Deals fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getDeal: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const deal = await service.getDeal(id);
        return apiResponse.success(res, deal, 'Deal fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateDeal: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const deal = await service.updateDeal(id, req.body, getActorId(req));
        return apiResponse.success(res, deal, 'Deal updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteDeal: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteDeal(id);
        return apiResponse.success(res, null, 'Deal deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createComboOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const offer = await service.createComboOffer(req.body, getActorId(req));
        return apiResponse.created(res, offer, 'Combo offer created successfully');
      } catch (error) {
        next(error);
      }
    },

    listComboOffers: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const offers = await service.listComboOffers(req.query as any);
        return apiResponse.success(res, offers, 'Combo offers fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getComboOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const offer = await service.getComboOffer(id);
        return apiResponse.success(res, offer, 'Combo offer fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateComboOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const offer = await service.updateComboOffer(id, req.body, getActorId(req));
        return apiResponse.success(res, offer, 'Combo offer updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteComboOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteComboOffer(id);
        return apiResponse.success(res, null, 'Combo offer deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createBuyXGetYOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const offer = await service.createBuyXGetYOffer(req.body, getActorId(req));
        return apiResponse.created(res, offer, 'Buy X Get Y offer created successfully');
      } catch (error) {
        next(error);
      }
    },

    listBuyXGetYOffers: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const offers = await service.listBuyXGetYOffers(req.query as any);
        return apiResponse.success(res, offers, 'Buy X Get Y offers fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getBuyXGetYOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const offer = await service.getBuyXGetYOffer(id);
        return apiResponse.success(res, offer, 'Buy X Get Y offer fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateBuyXGetYOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const offer = await service.updateBuyXGetYOffer(id, req.body, getActorId(req));
        return apiResponse.success(res, offer, 'Buy X Get Y offer updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteBuyXGetYOffer: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteBuyXGetYOffer(id);
        return apiResponse.success(res, null, 'Buy X Get Y offer deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createGiftCard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const card = await service.createGiftCard(req.body, getActorId(req));
        return apiResponse.created(res, card, 'Gift card created successfully');
      } catch (error) {
        next(error);
      }
    },

    listGiftCards: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const cards = await service.listGiftCards(req.query as any);
        return apiResponse.success(res, cards, 'Gift cards fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getGiftCard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const card = await service.getGiftCard(id);
        return apiResponse.success(res, card, 'Gift card fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateGiftCard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const card = await service.updateGiftCard(id, req.body, getActorId(req));
        return apiResponse.success(res, card, 'Gift card updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteGiftCard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteGiftCard(id);
        return apiResponse.success(res, null, 'Gift card deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    redeemGiftCard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const { amount, reference } = req.body;
        const card = await service.redeemGiftCard(id, Number(amount), reference, getActorId(req));
        return apiResponse.success(res, card, 'Gift card redeemed successfully');
      } catch (error) {
        next(error);
      }
    },

    createReferralProgram: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const program = await service.createReferralProgram(req.body, getActorId(req));
        return apiResponse.created(res, program, 'Referral program created successfully');
      } catch (error) {
        next(error);
      }
    },

    listReferralPrograms: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const programs = await service.listReferralPrograms(req.query as any);
        return apiResponse.success(res, programs, 'Referral programs fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getReferralProgram: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const program = await service.getReferralProgram(id);
        return apiResponse.success(res, program, 'Referral program fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateReferralProgram: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const program = await service.updateReferralProgram(id, req.body, getActorId(req));
        return apiResponse.success(res, program, 'Referral program updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteReferralProgram: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteReferralProgram(id);
        return apiResponse.success(res, null, 'Referral program deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createStoreCredit: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const credit = await service.createStoreCredit(req.body, getActorId(req));
        return apiResponse.created(res, credit, 'Store credit transaction created successfully');
      } catch (error) {
        next(error);
      }
    },

    listStoreCredits: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const storeCredits = await service.listStoreCredits(req.query as any, getCurrentCustomerId(req));
        return apiResponse.success(res, storeCredits, 'Store credit transactions fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    createNewsletterSubscriber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const subscriber = await service.createNewsletterSubscriber(req.body);
        return apiResponse.created(res, subscriber, 'Subscriber created successfully');
      } catch (error) {
        next(error);
      }
    },

    listNewsletterSubscribers: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const subscribers = await service.listNewsletterSubscribers(req.query as any);
        return apiResponse.success(res, subscribers, 'Newsletter subscribers fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getNewsletterSubscriber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const subscriber = await service.getNewsletterSubscriber(id);
        return apiResponse.success(res, subscriber, 'Subscriber fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateNewsletterSubscriber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const subscriber = await service.updateNewsletterSubscriber(id, req.body, getActorId(req));
        return apiResponse.success(res, subscriber, 'Subscriber updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteNewsletterSubscriber: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteNewsletterSubscriber(id);
        return apiResponse.success(res, null, 'Subscriber deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createLandingPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = await service.createLandingPage(req.body, getActorId(req));
        return apiResponse.created(res, page, 'Landing page created successfully');
      } catch (error) {
        next(error);
      }
    },

    listLandingPages: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pages = await service.listLandingPages(req.query as any);
        return apiResponse.success(res, pages, 'Landing pages fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getLandingPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const page = await service.getLandingPage(id);
        return apiResponse.success(res, page, 'Landing page fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateLandingPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const page = await service.updateLandingPage(id, req.body, getActorId(req));
        return apiResponse.success(res, page, 'Landing page updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteLandingPage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteLandingPage(id);
        return apiResponse.success(res, null, 'Landing page deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createPopupCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const popup = await service.createPopupCampaign(req.body, getActorId(req));
        return apiResponse.created(res, popup, 'Popup campaign created successfully');
      } catch (error) {
        next(error);
      }
    },

    listPopupCampaigns: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const popups = await service.listPopupCampaigns(req.query as any);
        return apiResponse.success(res, popups, 'Popup campaigns fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getPopupCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const popup = await service.getPopupCampaign(id);
        return apiResponse.success(res, popup, 'Popup campaign fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updatePopupCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const popup = await service.updatePopupCampaign(id, req.body, getActorId(req));
        return apiResponse.success(res, popup, 'Popup campaign updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deletePopupCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deletePopupCampaign(id);
        return apiResponse.success(res, null, 'Popup campaign deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createChannelCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const campaign = await service.createChannelCampaign(req.body, getActorId(req));
        return apiResponse.created(res, campaign, 'Channel campaign created successfully');
      } catch (error) {
        next(error);
      }
    },

    listChannelCampaigns: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const campaigns = await service.listChannelCampaigns(req.query as any);
        return apiResponse.success(res, campaigns, 'Channel campaigns fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getChannelCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const campaign = await service.getChannelCampaign(id);
        return apiResponse.success(res, campaign, 'Channel campaign fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateChannelCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const campaign = await service.updateChannelCampaign(id, req.body, getActorId(req));
        return apiResponse.success(res, campaign, 'Channel campaign updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteChannelCampaign: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteChannelCampaign(id);
        return apiResponse.success(res, null, 'Channel campaign deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    createAbandonedCartRecovery: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const recovery = await service.createAbandonedCartRecovery(req.body, getActorId(req));
        return apiResponse.created(res, recovery, 'Abandoned cart recovery created successfully');
      } catch (error) {
        next(error);
      }
    },

    listAbandonedCartRecoveries: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const recoveries = await service.listAbandonedCartRecoveries(req.query as any);
        return apiResponse.success(res, recoveries, 'Abandoned cart recoveries fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getAbandonedCartRecovery: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const recovery = await service.getAbandonedCartRecovery(id);
        return apiResponse.success(res, recovery, 'Abandoned cart recovery fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    updateAbandonedCartRecovery: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const recovery = await service.updateAbandonedCartRecovery(id, req.body, getActorId(req));
        return apiResponse.success(res, recovery, 'Abandoned cart recovery updated successfully');
      } catch (error) {
        next(error);
      }
    },

    deleteAbandonedCartRecovery: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.deleteAbandonedCartRecovery(id);
        return apiResponse.success(res, null, 'Abandoned cart recovery deleted successfully');
      } catch (error) {
        next(error);
      }
    },

    getCampaignAnalytics: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const analytics = await service.listCampaignAnalytics(req.query as any);
        return apiResponse.success(res, analytics, 'Campaign analytics fetched successfully');
      } catch (error) {
        next(error);
      }
    }
  };
}
