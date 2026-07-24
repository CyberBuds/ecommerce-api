import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import {
  BannerQuery,
  CampaignAnalyticsQuery,
  CampaignQuery,
  ChannelCampaignQuery,
  ComboOfferQuery,
  DealOfTheDayQuery,
  FlashSaleQuery,
  GiftCardQuery,
  HomepageSectionQuery,
  LandingPageQuery,
  PopupCampaignQuery,
  ReferralProgramQuery,
  StoreCreditQuery,
  NewsletterSubscriberQuery,
  AbandonedCartRecoveryQuery,
  BuyXGetYOfferQuery
} from '../interfaces/marketing.dto';

const db = prisma as any;

export default class MarketingRepository {
  async findBannerById(id: number) {
    return db.banner.findUnique({ where: { id } });
  }

  async listBanners(query: BannerQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { subtitle: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.displayOn) {
      where.displayOn = query.displayOn;
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['priority', 'startDate', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'priority';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.banner.findMany({ where, orderBy, skip, take: pageSize }),
      db.banner.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createBanner(data: Record<string, unknown>) {
    return db.banner.create({ data });
  }

  async updateBanner(id: number, data: Record<string, unknown>) {
    return db.banner.update({ where: { id }, data });
  }

  async deleteBanner(id: number) {
    return db.banner.delete({ where: { id } });
  }

  async findHomepageSectionById(id: number) {
    return db.homepageSection.findUnique({ where: { id } });
  }

  async listHomepageSections(query: HomepageSectionQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.sectionType) {
      where.sectionType = query.sectionType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['priority', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'priority';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.homepageSection.findMany({ where, orderBy, skip, take: pageSize }),
      db.homepageSection.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createHomepageSection(data: Record<string, unknown>) {
    return db.homepageSection.create({ data });
  }

  async updateHomepageSection(id: number, data: Record<string, unknown>) {
    return db.homepageSection.update({ where: { id }, data });
  }

  async deleteHomepageSection(id: number) {
    return db.homepageSection.delete({ where: { id } });
  }

  async findCampaignById(id: number) {
    return db.campaign.findUnique({ where: { id } });
  }

  async listCampaigns(query: CampaignQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { campaignName: { contains: query.search, mode: 'insensitive' } },
        { campaignCode: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.campaignType) {
      where.campaignType = query.campaignType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom || query.dateTo) {
      where.startDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.startDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.startDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['startDate', 'endDate', 'priority', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'priority';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.campaign.findMany({ where, orderBy, skip, take: pageSize }),
      db.campaign.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createCampaign(data: Record<string, unknown>) {
    return db.campaign.create({ data });
  }

  async updateCampaign(id: number, data: Record<string, unknown>) {
    return db.campaign.update({ where: { id }, data });
  }

  async deleteCampaign(id: number) {
    return db.campaign.delete({ where: { id } });
  }

  async findFlashSaleById(id: number) {
    return db.flashSale.findUnique({ where: { id } });
  }

  async listFlashSales(query: FlashSaleQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { flashSaleName: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom || query.dateTo) {
      where.startDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.startDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.startDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['startDate', 'endDate', 'priority', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'startDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.flashSale.findMany({ where, orderBy, skip, take: pageSize }),
      db.flashSale.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createFlashSale(data: Record<string, unknown>) {
    return db.flashSale.create({ data });
  }

  async updateFlashSale(id: number, data: Record<string, unknown>) {
    return db.flashSale.update({ where: { id }, data });
  }

  async deleteFlashSale(id: number) {
    return db.flashSale.delete({ where: { id } });
  }

  async findDealOfTheDayById(id: number) {
    return db.dealOfTheDay.findUnique({ where: { id } });
  }

  async listDealOfTheDay(query: DealOfTheDayQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['startDate', 'endDate', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'startDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.dealOfTheDay.findMany({ where, orderBy, skip, take: pageSize }),
      db.dealOfTheDay.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createDealOfTheDay(data: Record<string, unknown>) {
    return db.dealOfTheDay.create({ data });
  }

  async updateDealOfTheDay(id: number, data: Record<string, unknown>) {
    return db.dealOfTheDay.update({ where: { id }, data });
  }

  async deleteDealOfTheDay(id: number) {
    return db.dealOfTheDay.delete({ where: { id } });
  }

  async findComboOfferById(id: number) {
    return db.comboOffer.findUnique({ where: { id } });
  }

  async listComboOffers(query: ComboOfferQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.offerName = { contains: query.search, mode: 'insensitive' };
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['bundlePrice', 'discount', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.comboOffer.findMany({ where, orderBy, skip, take: pageSize }),
      db.comboOffer.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createComboOffer(data: Record<string, unknown>) {
    return db.comboOffer.create({ data });
  }

  async updateComboOffer(id: number, data: Record<string, unknown>) {
    return db.comboOffer.update({ where: { id }, data });
  }

  async deleteComboOffer(id: number) {
    return db.comboOffer.delete({ where: { id } });
  }

  async findBuyXGetYOfferById(id: number) {
    return db.buyXGetYOffer.findUnique({ where: { id } });
  }

  async listBuyXGetYOffers(query: BuyXGetYOfferQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { buyProductId: { equals: Number(query.search) } },
        { getProductId: { equals: Number(query.search) } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'buyQuantity', 'getQuantity'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.buyXGetYOffer.findMany({ where, orderBy, skip, take: pageSize }),
      db.buyXGetYOffer.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createBuyXGetYOffer(data: Record<string, unknown>) {
    return db.buyXGetYOffer.create({ data });
  }

  async updateBuyXGetYOffer(id: number, data: Record<string, unknown>) {
    return db.buyXGetYOffer.update({ where: { id }, data });
  }

  async deleteBuyXGetYOffer(id: number) {
    return db.buyXGetYOffer.delete({ where: { id } });
  }

  async findGiftCardById(id: number) {
    return db.giftCard.findUnique({ where: { id } });
  }

  async findGiftCardByCode(code: string) {
    return db.giftCard.findUnique({ where: { giftCardCode: code } });
  }

  async listGiftCards(query: GiftCardQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { giftCardCode: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.dateFrom || query.dateTo) {
      where.expiryDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.expiryDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.expiryDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['expiryDate', 'amount', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.giftCard.findMany({ where, orderBy, skip, take: pageSize }),
      db.giftCard.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createGiftCard(data: Record<string, unknown>) {
    return db.giftCard.create({ data });
  }

  async updateGiftCard(id: number, data: Record<string, unknown>) {
    return db.giftCard.update({ where: { id }, data });
  }

  async deleteGiftCard(id: number) {
    return db.giftCard.delete({ where: { id } });
  }

  async findReferralProgramById(id: number) {
    return db.referralProgram.findUnique({ where: { id } });
  }

  async listReferralPrograms(query: ReferralProgramQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { referralCode: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['startDate', 'endDate', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.referralProgram.findMany({ where, orderBy, skip, take: pageSize }),
      db.referralProgram.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createReferralProgram(data: Record<string, unknown>) {
    return db.referralProgram.create({ data });
  }

  async updateReferralProgram(id: number, data: Record<string, unknown>) {
    return db.referralProgram.update({ where: { id }, data });
  }

  async deleteReferralProgram(id: number) {
    return db.referralProgram.delete({ where: { id } });
  }

  async findStoreCreditTransactions(customerId: number, query: StoreCreditQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = { customerId };

    if (query.type) {
      where.type = query.type;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'creditAmount', 'debitAmount'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.storeCreditTransaction.findMany({ where, orderBy, skip, take: pageSize }),
      db.storeCreditTransaction.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findLatestStoreCredit(customerId: number) {
    return db.storeCreditTransaction.findFirst({ where: { customerId }, orderBy: { createdAt: 'desc' } });
  }

  async createStoreCreditTransaction(data: Record<string, unknown>) {
    return db.storeCreditTransaction.create({ data });
  }

  async findNewsletterSubscriberById(id: number) {
    return db.newsletterSubscriber.findUnique({ where: { id } });
  }

  async findNewsletterSubscriberByEmail(email: string) {
    return db.newsletterSubscriber.findUnique({ where: { email } });
  }

  async listNewsletterSubscribers(query: NewsletterSubscriberQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.email = { contains: query.search, mode: 'insensitive' };
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['subscribedAt', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.newsletterSubscriber.findMany({ where, orderBy, skip, take: pageSize }),
      db.newsletterSubscriber.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createNewsletterSubscriber(data: Record<string, unknown>) {
    return db.newsletterSubscriber.create({ data });
  }

  async updateNewsletterSubscriber(id: number, data: Record<string, unknown>) {
    return db.newsletterSubscriber.update({ where: { id }, data });
  }

  async deleteNewsletterSubscriber(id: number) {
    return db.newsletterSubscriber.delete({ where: { id } });
  }

  async findLandingPageById(id: number) {
    return db.landingPage.findUnique({ where: { id } });
  }

  async listLandingPages(query: LandingPageQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { slug: { contains: query.search, mode: 'insensitive' } },
        { seoTitle: { contains: query.search, mode: 'insensitive' } },
        { seoDescription: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.landingPage.findMany({ where, orderBy, skip, take: pageSize }),
      db.landingPage.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createLandingPage(data: Record<string, unknown>) {
    return db.landingPage.create({ data });
  }

  async updateLandingPage(id: number, data: Record<string, unknown>) {
    return db.landingPage.update({ where: { id }, data });
  }

  async deleteLandingPage(id: number) {
    return db.landingPage.delete({ where: { id } });
  }

  async findPopupCampaignById(id: number) {
    return db.popupCampaign.findUnique({ where: { id } });
  }

  async listPopupCampaigns(query: PopupCampaignQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.popupType) {
      where.popupType = query.popupType;
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['startDate', 'endDate', 'priority', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.popupCampaign.findMany({ where, orderBy, skip, take: pageSize }),
      db.popupCampaign.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createPopupCampaign(data: Record<string, unknown>) {
    return db.popupCampaign.create({ data });
  }

  async updatePopupCampaign(id: number, data: Record<string, unknown>) {
    return db.popupCampaign.update({ where: { id }, data });
  }

  async deletePopupCampaign(id: number) {
    return db.popupCampaign.delete({ where: { id } });
  }

  async findChannelCampaignById(id: number) {
    return db.marketingChannelCampaign.findUnique({ where: { id } });
  }

  async listChannelCampaigns(query: ChannelCampaignQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.channel) {
      where.channel = query.channel;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { message: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['scheduleAt', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.marketingChannelCampaign.findMany({ where, orderBy, skip, take: pageSize }),
      db.marketingChannelCampaign.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createChannelCampaign(data: Record<string, unknown>) {
    return db.marketingChannelCampaign.create({ data });
  }

  async updateChannelCampaign(id: number, data: Record<string, unknown>) {
    return db.marketingChannelCampaign.update({ where: { id }, data });
  }

  async deleteChannelCampaign(id: number) {
    return db.marketingChannelCampaign.delete({ where: { id } });
  }

  async findAbandonedCartRecoveryById(id: number) {
    return db.abandonedCartRecovery.findUnique({ where: { id } });
  }

  async listAbandonedCartRecoveries(query: AbandonedCartRecoveryQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.cartId) {
      where.cartId = query.cartId;
    }

    if (query.recoveryStatus) {
      where.recoveryStatus = query.recoveryStatus;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['nextReminderAt', 'lastReminderDate', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.abandonedCartRecovery.findMany({ where, orderBy, skip, take: pageSize }),
      db.abandonedCartRecovery.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createAbandonedCartRecovery(data: Record<string, unknown>) {
    return db.abandonedCartRecovery.create({ data });
  }

  async updateAbandonedCartRecovery(id: number, data: Record<string, unknown>) {
    return db.abandonedCartRecovery.update({ where: { id }, data });
  }

  async deleteAbandonedCartRecovery(id: number) {
    return db.abandonedCartRecovery.delete({ where: { id } });
  }

  async listCampaignAnalytics(query: CampaignAnalyticsQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.campaignId) {
      where.campaignId = query.campaignId;
    }

    if (query.channelCampaignId) {
      where.channelCampaignId = query.channelCampaignId;
    }

    if (query.dateFrom || query.dateTo) {
      where.date = {} as Record<string, unknown>;
      if (query.dateFrom) (where.date as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.date as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['date', 'revenue', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'date';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.campaignAnalytics.findMany({ where, orderBy, skip, take: pageSize }),
      db.campaignAnalytics.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }
}
