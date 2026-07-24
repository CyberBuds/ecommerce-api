import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import MarketingRepository from '../repositories/marketing.repository';
import CustomerRepository from '../repositories/customer.repository';
import {
  AbandonedCartRecoveryQuery,
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
  CreateBannerDto,
  CreateHomepageSectionDto,
  CreateCampaignDto,
  CreateFlashSaleDto,
  CreateDealOfTheDayDto,
  CreateComboOfferDto,
  CreateBuyXGetYOfferDto,
  CreateGiftCardDto,
  CreateReferralProgramDto,
  CreateStoreCreditDto,
  CreateNewsletterSubscriberDto,
  CreateLandingPageDto,
  CreatePopupCampaignDto,
  CreateChannelCampaignDto,
  CreateAbandonedCartRecoveryDto,
  UpdateBannerDto,
  UpdateHomepageSectionDto,
  UpdateCampaignDto,
  UpdateFlashSaleDto,
  UpdateDealOfTheDayDto,
  UpdateComboOfferDto,
  UpdateBuyXGetYOfferDto,
  UpdateGiftCardDto,
  UpdateReferralProgramDto,
  UpdateStoreCreditDto,
  UpdateNewsletterSubscriberDto,
  UpdateLandingPageDto,
  UpdatePopupCampaignDto,
  UpdateChannelCampaignDto,
  UpdateAbandonedCartRecoveryDto
} from '../interfaces/marketing.dto';

function parseDate(value: string | undefined) {
  return value ? new Date(value) : undefined;
}

function validateDateRange(start?: string, end?: string, label = 'Date range') {
  if (start && end && new Date(start) > new Date(end)) {
    throw new AppError(`${label} is invalid. Start date must come before end date.`, HTTP_STATUS.BAD_REQUEST, 'INVALID_DATE_RANGE');
  }
}

function normalizePaginationResult(result: any) {
  if (!result || !Array.isArray(result.items)) {
    return result;
  }

  return result;
}

export default class MarketingService {
  constructor(
    private repository: MarketingRepository,
    private customerRepository: CustomerRepository
  ) {}

  async createBanner(dto: CreateBannerDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Banner dates');
    return this.repository.createBanner({
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate),
      priority: dto.priority ?? 0,
          } as any);
  }

  async listBanners(query: BannerQuery) {
    return normalizePaginationResult(await this.repository.listBanners(query));
  }

  async getBanner(id: number) {
    const banner = await this.repository.findBannerById(id);
    if (!banner) {
      throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND, 'BANNER_NOT_FOUND');
    }
    return banner;
  }

  async updateBanner(id: number, dto: UpdateBannerDto, actorId?: number) {
    const existing = await this.repository.findBannerById(id);
    if (!existing) {
      throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND, 'BANNER_NOT_FOUND');
    }

    validateDateRange(dto.startDate, dto.endDate, 'Banner dates');
    return this.repository.updateBanner(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate)    } as any);
  }

  async deleteBanner(id: number) {
    const existing = await this.repository.findBannerById(id);
    if (!existing) {
      throw new AppError('Banner not found', HTTP_STATUS.NOT_FOUND, 'BANNER_NOT_FOUND');
    }
    return this.repository.deleteBanner(id);
  }

  async createHomepageSection(dto: CreateHomepageSectionDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Homepage section dates');
    return this.repository.createHomepageSection({
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate),
      priority: dto.priority ?? 0,
          } as any);
  }

  async listHomepageSections(query: HomepageSectionQuery) {
    return normalizePaginationResult(await this.repository.listHomepageSections(query));
  }

  async getHomepageSection(id: number) {
    const section = await this.repository.findHomepageSectionById(id);
    if (!section) {
      throw new AppError('Homepage section not found', HTTP_STATUS.NOT_FOUND, 'HOMEPAGE_SECTION_NOT_FOUND');
    }
    return section;
  }

  async updateHomepageSection(id: number, dto: UpdateHomepageSectionDto, actorId?: number) {
    const existing = await this.repository.findHomepageSectionById(id);
    if (!existing) {
      throw new AppError('Homepage section not found', HTTP_STATUS.NOT_FOUND, 'HOMEPAGE_SECTION_NOT_FOUND');
    }

    validateDateRange(dto.startDate, dto.endDate, 'Homepage section dates');
    return this.repository.updateHomepageSection(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate)    } as any);
  }

  async deleteHomepageSection(id: number) {
    const existing = await this.repository.findHomepageSectionById(id);
    if (!existing) {
      throw new AppError('Homepage section not found', HTTP_STATUS.NOT_FOUND, 'HOMEPAGE_SECTION_NOT_FOUND');
    }
    return this.repository.deleteHomepageSection(id);
  }

  async createCampaign(dto: CreateCampaignDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Campaign dates');
    return this.repository.createCampaign({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      budget: Number(dto.budget ?? 0),
      priority: dto.priority ?? 0,
          } as any);
  }

  async listCampaigns(query: CampaignQuery) {
    const response = await this.repository.listCampaigns(query);
    return normalizePaginationResult(response);
  }

  async getCampaign(id: number) {
    const campaign = await this.repository.findCampaignById(id);
    if (!campaign) {
      throw new AppError('Campaign not found', HTTP_STATUS.NOT_FOUND, 'CAMPAIGN_NOT_FOUND');
    }
    return campaign;
  }

  async updateCampaign(id: number, dto: UpdateCampaignDto, actorId?: number) {
    const existing = await this.repository.findCampaignById(id);
    if (!existing) {
      throw new AppError('Campaign not found', HTTP_STATUS.NOT_FOUND, 'CAMPAIGN_NOT_FOUND');
    }

    validateDateRange(dto.startDate, dto.endDate, 'Campaign dates');
    return this.repository.updateCampaign(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate),
      budget: dto.budget !== undefined ? Number(dto.budget) : undefined    } as any);
  }

  async deleteCampaign(id: number) {
    const existing = await this.repository.findCampaignById(id);
    if (!existing) {
      throw new AppError('Campaign not found', HTTP_STATUS.NOT_FOUND, 'CAMPAIGN_NOT_FOUND');
    }
    return this.repository.deleteCampaign(id);
  }

  async createFlashSale(dto: CreateFlashSaleDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Flash sale dates');
    return this.repository.createFlashSale({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      maximumDiscount: Number(dto.maximumDiscount ?? 0),
      maximumQuantityPerCustomer: dto.maximumQuantityPerCustomer ?? 0,
      status: dto.status ?? 'ACTIVE',
          } as any);
  }

  async listFlashSales(query: FlashSaleQuery) {
    return normalizePaginationResult(await this.repository.listFlashSales(query));
  }

  async getFlashSale(id: number) {
    const sale = await this.repository.findFlashSaleById(id);
    if (!sale) {
      throw new AppError('Flash sale not found', HTTP_STATUS.NOT_FOUND, 'FLASH_SALE_NOT_FOUND');
    }
    return sale;
  }

  async updateFlashSale(id: number, dto: UpdateFlashSaleDto, actorId?: number) {
    const existing = await this.repository.findFlashSaleById(id);
    if (!existing) {
      throw new AppError('Flash sale not found', HTTP_STATUS.NOT_FOUND, 'FLASH_SALE_NOT_FOUND');
    }

    validateDateRange(dto.startDate, dto.endDate, 'Flash sale dates');
    return this.repository.updateFlashSale(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate),
      maximumDiscount: dto.maximumDiscount !== undefined ? Number(dto.maximumDiscount) : undefined,
      maximumQuantityPerCustomer: dto.maximumQuantityPerCustomer ?? undefined    } as any);
  }

  async deleteFlashSale(id: number) {
    const existing = await this.repository.findFlashSaleById(id);
    if (!existing) {
      throw new AppError('Flash sale not found', HTTP_STATUS.NOT_FOUND, 'FLASH_SALE_NOT_FOUND');
    }
    return this.repository.deleteFlashSale(id);
  }

  async createDealOfTheDay(dto: CreateDealOfTheDayDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Deal dates');
    return this.repository.createDealOfTheDay({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listDeals(query: DealOfTheDayQuery) {
    return normalizePaginationResult(await this.repository.listDealOfTheDay(query));
  }

  async getDeal(id: number) {
    const deal = await this.repository.findDealOfTheDayById(id);
    if (!deal) {
      throw new AppError('Deal of the day not found', HTTP_STATUS.NOT_FOUND, 'DEAL_NOT_FOUND');
    }
    return deal;
  }

  async updateDeal(id: number, dto: UpdateDealOfTheDayDto, actorId?: number) {
    const existing = await this.repository.findDealOfTheDayById(id);
    if (!existing) {
      throw new AppError('Deal of the day not found', HTTP_STATUS.NOT_FOUND, 'DEAL_NOT_FOUND');
    }

    validateDateRange(dto.startDate, dto.endDate, 'Deal dates');
    return this.repository.updateDealOfTheDay(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate)    } as any);
  }

  async deleteDeal(id: number) {
    const existing = await this.repository.findDealOfTheDayById(id);
    if (!existing) {
      throw new AppError('Deal of the day not found', HTTP_STATUS.NOT_FOUND, 'DEAL_NOT_FOUND');
    }
    return this.repository.deleteDealOfTheDay(id);
  }

  async createComboOffer(dto: CreateComboOfferDto, actorId?: number) {
    return this.repository.createComboOffer({
      ...dto,
      discount: Number(dto.discount ?? 0),
      productIds: dto.productIds ?? [],
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listComboOffers(query: ComboOfferQuery) {
    return normalizePaginationResult(await this.repository.listComboOffers(query));
  }

  async getComboOffer(id: number) {
    const offer = await this.repository.findComboOfferById(id);
    if (!offer) {
      throw new AppError('Combo offer not found', HTTP_STATUS.NOT_FOUND, 'COMBO_OFFER_NOT_FOUND');
    }
    return offer;
  }

  async updateComboOffer(id: number, dto: UpdateComboOfferDto, actorId?: number) {
    const existing = await this.repository.findComboOfferById(id);
    if (!existing) {
      throw new AppError('Combo offer not found', HTTP_STATUS.NOT_FOUND, 'COMBO_OFFER_NOT_FOUND');
    }

    return this.repository.updateComboOffer(id, {
      ...dto,
      productIds: dto.productIds ?? undefined,
      discount: dto.discount !== undefined ? Number(dto.discount) : undefined    } as any);
  }

  async deleteComboOffer(id: number) {
    const existing = await this.repository.findComboOfferById(id);
    if (!existing) {
      throw new AppError('Combo offer not found', HTTP_STATUS.NOT_FOUND, 'COMBO_OFFER_NOT_FOUND');
    }
    return this.repository.deleteComboOffer(id);
  }

  async createBuyXGetYOffer(dto: CreateBuyXGetYOfferDto, actorId?: number) {
    if (dto.buyQuantity <= 0 || dto.getQuantity <= 0) {
      throw new AppError('Quantities must be greater than zero', HTTP_STATUS.BAD_REQUEST, 'INVALID_QUANTITY');
    }
    return this.repository.createBuyXGetYOffer({
      ...dto,
      discount: Number(dto.discount),
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listBuyXGetYOffers(query: any) {
    return normalizePaginationResult(await this.repository.listBuyXGetYOffers(query));
  }

  async getBuyXGetYOffer(id: number) {
    const offer = await this.repository.findBuyXGetYOfferById(id);
    if (!offer) {
      throw new AppError('Buy X Get Y offer not found', HTTP_STATUS.NOT_FOUND, 'BUY_X_GET_Y_NOT_FOUND');
    }
    return offer;
  }

  async updateBuyXGetYOffer(id: number, dto: UpdateBuyXGetYOfferDto, actorId?: number) {
    const existing = await this.repository.findBuyXGetYOfferById(id);
    if (!existing) {
      throw new AppError('Buy X Get Y offer not found', HTTP_STATUS.NOT_FOUND, 'BUY_X_GET_Y_NOT_FOUND');
    }
    return this.repository.updateBuyXGetYOffer(id, {
      ...dto,
      discount: dto.discount !== undefined ? Number(dto.discount) : undefined    } as any);
  }

  async deleteBuyXGetYOffer(id: number) {
    const existing = await this.repository.findBuyXGetYOfferById(id);
    if (!existing) {
      throw new AppError('Buy X Get Y offer not found', HTTP_STATUS.NOT_FOUND, 'BUY_X_GET_Y_NOT_FOUND');
    }
    return this.repository.deleteBuyXGetYOffer(id);
  }

  async createGiftCard(dto: CreateGiftCardDto, actorId?: number) {
    const existing = await this.repository.findGiftCardByCode(dto.giftCardCode);
    if (existing) {
      throw new AppError('Gift card code already exists', HTTP_STATUS.BAD_REQUEST, 'GIFT_CARD_DUPLICATE');
    }
    if (new Date(dto.expiryDate) < new Date()) {
      throw new AppError('Expiry date must be in the future', HTTP_STATUS.BAD_REQUEST, 'INVALID_EXPIRY_DATE');
    }
    return this.repository.createGiftCard({
      ...dto,
      balance: dto.balance !== undefined ? Number(dto.balance) : Number(dto.amount),
      amount: Number(dto.amount),
      status: dto.status ?? 'ACTIVE',
      expiryDate: new Date(dto.expiryDate)
    } as any);
  }

  async listGiftCards(query: GiftCardQuery) {
    return normalizePaginationResult(await this.repository.listGiftCards(query));
  }

  async getGiftCard(id: number) {
    const giftCard = await this.repository.findGiftCardById(id);
    if (!giftCard) {
      throw new AppError('Gift card not found', HTTP_STATUS.NOT_FOUND, 'GIFT_CARD_NOT_FOUND');
    }
    return giftCard;
  }

  async updateGiftCard(id: number, dto: UpdateGiftCardDto, actorId?: number) {
    const existing = await this.repository.findGiftCardById(id);
    if (!existing) {
      throw new AppError('Gift card not found', HTTP_STATUS.NOT_FOUND, 'GIFT_CARD_NOT_FOUND');
    }
    const data: Record<string, unknown> = {
      ...dto,
      amount: dto.amount !== undefined ? Number(dto.amount) : undefined,
      balance: dto.balance !== undefined ? Number(dto.balance) : undefined,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined    };
    return this.repository.updateGiftCard(id, data);
  }

  async deleteGiftCard(id: number) {
    const existing = await this.repository.findGiftCardById(id);
    if (!existing) {
      throw new AppError('Gift card not found', HTTP_STATUS.NOT_FOUND, 'GIFT_CARD_NOT_FOUND');
    }
    return this.repository.deleteGiftCard(id);
  }

  async redeemGiftCard(id: number, amount: number, reference?: string, actorId?: number) {
    const giftCard = await this.repository.findGiftCardById(id);
    if (!giftCard) {
      throw new AppError('Gift card not found', HTTP_STATUS.NOT_FOUND, 'GIFT_CARD_NOT_FOUND');
    }
    if (giftCard.status !== 'ACTIVE') {
      throw new AppError('Gift card is not active', HTTP_STATUS.BAD_REQUEST, 'GIFT_CARD_INACTIVE');
    }
    if (new Date(giftCard.expiryDate) < new Date()) {
      throw new AppError('Gift card has expired', HTTP_STATUS.BAD_REQUEST, 'GIFT_CARD_EXPIRED');
    }
    const remainingBalance = Number(giftCard.balance) - amount;
    if (remainingBalance < 0) {
      throw new AppError('Gift card balance is insufficient', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_GIFT_CARD_BALANCE');
    }
    return this.repository.updateGiftCard(id, {
      balance: remainingBalance,
      status: remainingBalance === 0 ? 'REDEEMED' : giftCard.status
    } as any);
  }

  async createReferralProgram(dto: CreateReferralProgramDto, actorId?: number) {
    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new AppError('Referral program end date must be after start date', HTTP_STATUS.BAD_REQUEST, 'INVALID_REFERRAL_DATES');
    }
    return this.repository.createReferralProgram({
      ...dto,
      referrerReward: Number(dto.referrerReward),
      refereeReward: Number(dto.refereeReward),
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listReferralPrograms(query: ReferralProgramQuery) {
    return normalizePaginationResult(await this.repository.listReferralPrograms(query));
  }

  async getReferralProgram(id: number) {
    const program = await this.repository.findReferralProgramById(id);
    if (!program) {
      throw new AppError('Referral program not found', HTTP_STATUS.NOT_FOUND, 'REFERRAL_PROGRAM_NOT_FOUND');
    }
    return program;
  }

  async updateReferralProgram(id: number, dto: UpdateReferralProgramDto, actorId?: number) {
    const existing = await this.repository.findReferralProgramById(id);
    if (!existing) {
      throw new AppError('Referral program not found', HTTP_STATUS.NOT_FOUND, 'REFERRAL_PROGRAM_NOT_FOUND');
    }
    if (dto.startDate && dto.endDate) {
      validateDateRange(dto.startDate, dto.endDate, 'Referral program dates');
    }
    return this.repository.updateReferralProgram(id, {
      ...dto,
      referrerReward: dto.referrerReward !== undefined ? Number(dto.referrerReward) : undefined,
      refereeReward: dto.refereeReward !== undefined ? Number(dto.refereeReward) : undefined,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate)    } as any);
  }

  async deleteReferralProgram(id: number) {
    const existing = await this.repository.findReferralProgramById(id);
    if (!existing) {
      throw new AppError('Referral program not found', HTTP_STATUS.NOT_FOUND, 'REFERRAL_PROGRAM_NOT_FOUND');
    }
    return this.repository.deleteReferralProgram(id);
  }

  async createStoreCredit(dto: CreateStoreCreditDto, actorId?: number) {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }

    const previous = await this.repository.findLatestStoreCredit(dto.customerId);
    const balance = Number(previous?.balance ?? 0);
    const creditAmount = Number(dto.creditAmount ?? 0);
    const debitAmount = Number(dto.debitAmount ?? 0);
    const nextBalance = balance + creditAmount - debitAmount;

    if (debitAmount > balance) {
      throw new AppError('Store credit balance is insufficient for debit', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_STORE_CREDITS');
    }

    return this.repository.createStoreCreditTransaction({
      customerId: dto.customerId,
      type: dto.type,
      creditAmount,
      debitAmount,
      balance: nextBalance,
      reason: dto.reason ?? null,
      reference: dto.reference ?? null,
          } as any);
  }

  async listStoreCredits(query: StoreCreditQuery, currentCustomerId?: number) {
    if (currentCustomerId && !query.customerId) {
      query.customerId = currentCustomerId;
    }
    if (!query.customerId) {
      throw new AppError('Customer id is required for store credit queries', HTTP_STATUS.BAD_REQUEST, 'CUSTOMER_ID_REQUIRED');
    }
    return normalizePaginationResult(await this.repository.findStoreCreditTransactions(query.customerId, query));
  }

  async getNewsletterSubscriber(id: number) {
    const subscriber = await this.repository.findNewsletterSubscriberById(id);
    if (!subscriber) {
      throw new AppError('Subscriber not found', HTTP_STATUS.NOT_FOUND, 'SUBSCRIBER_NOT_FOUND');
    }
    return subscriber;
  }

  async createNewsletterSubscriber(dto: CreateNewsletterSubscriberDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.repository.findNewsletterSubscriberByEmail(email);
    if (existing) {
      return this.repository.updateNewsletterSubscriber(existing.id, {
        status: 'ACTIVE',
        subscribedAt: new Date(),
        updatedAt: new Date()
      } as any);
    }
    return this.repository.createNewsletterSubscriber({
      email,
      status: dto.status ?? 'ACTIVE',
      subscribedAt: new Date()
    } as any);
  }

  async listNewsletterSubscribers(query: NewsletterSubscriberQuery) {
    return normalizePaginationResult(await this.repository.listNewsletterSubscribers(query));
  }

  async updateNewsletterSubscriber(id: number, dto: UpdateNewsletterSubscriberDto, actorId?: number) {
    const subscriber = await this.repository.findNewsletterSubscriberById(id);
    if (!subscriber) {
      throw new AppError('Subscriber not found', HTTP_STATUS.NOT_FOUND, 'SUBSCRIBER_NOT_FOUND');
    }
    return this.repository.updateNewsletterSubscriber(id, {
      ...dto,
      updatedAt: new Date()    } as any);
  }

  async deleteNewsletterSubscriber(id: number) {
    const subscriber = await this.repository.findNewsletterSubscriberById(id);
    if (!subscriber) {
      throw new AppError('Subscriber not found', HTTP_STATUS.NOT_FOUND, 'SUBSCRIBER_NOT_FOUND');
    }
    return this.repository.deleteNewsletterSubscriber(id);
  }

  async createLandingPage(dto: CreateLandingPageDto, actorId?: number) {
    return this.repository.createLandingPage({
      ...dto,
      sections: dto.sections ?? null,
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listLandingPages(query: LandingPageQuery) {
    return normalizePaginationResult(await this.repository.listLandingPages(query));
  }

  async getLandingPage(id: number) {
    const page = await this.repository.findLandingPageById(id);
    if (!page) {
      throw new AppError('Landing page not found', HTTP_STATUS.NOT_FOUND, 'LANDING_PAGE_NOT_FOUND');
    }
    return page;
  }

  async updateLandingPage(id: number, dto: UpdateLandingPageDto, actorId?: number) {
    const existing = await this.repository.findLandingPageById(id);
    if (!existing) {
      throw new AppError('Landing page not found', HTTP_STATUS.NOT_FOUND, 'LANDING_PAGE_NOT_FOUND');
    }
    return this.repository.updateLandingPage(id, {
      ...dto,
      sections: dto.sections ?? undefined
    } as any);
  }

  async deleteLandingPage(id: number) {
    const existing = await this.repository.findLandingPageById(id);
    if (!existing) {
      throw new AppError('Landing page not found', HTTP_STATUS.NOT_FOUND, 'LANDING_PAGE_NOT_FOUND');
    }
    return this.repository.deleteLandingPage(id);
  }

  async createPopupCampaign(dto: CreatePopupCampaignDto, actorId?: number) {
    validateDateRange(dto.startDate, dto.endDate, 'Popup campaign dates');
    return this.repository.createPopupCampaign({
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate),
      status: dto.status ?? 'ACTIVE'
    } as any);
  }

  async listPopupCampaigns(query: PopupCampaignQuery) {
    return normalizePaginationResult(await this.repository.listPopupCampaigns(query));
  }

  async getPopupCampaign(id: number) {
    const popup = await this.repository.findPopupCampaignById(id);
    if (!popup) {
      throw new AppError('Popup campaign not found', HTTP_STATUS.NOT_FOUND, 'POPUP_CAMPAIGN_NOT_FOUND');
    }
    return popup;
  }

  async updatePopupCampaign(id: number, dto: UpdatePopupCampaignDto, actorId?: number) {
    const existing = await this.repository.findPopupCampaignById(id);
    if (!existing) {
      throw new AppError('Popup campaign not found', HTTP_STATUS.NOT_FOUND, 'POPUP_CAMPAIGN_NOT_FOUND');
    }
    validateDateRange(dto.startDate, dto.endDate, 'Popup campaign dates');
    return this.repository.updatePopupCampaign(id, {
      ...dto,
      startDate: parseDate(dto.startDate),
      endDate: parseDate(dto.endDate)
    } as any);
  }

  async deletePopupCampaign(id: number) {
    const existing = await this.repository.findPopupCampaignById(id);
    if (!existing) {
      throw new AppError('Popup campaign not found', HTTP_STATUS.NOT_FOUND, 'POPUP_CAMPAIGN_NOT_FOUND');
    }
    return this.repository.deletePopupCampaign(id);
  }

  async createChannelCampaign(dto: CreateChannelCampaignDto, actorId?: number) {
    return this.repository.createChannelCampaign({
      ...dto,
      scheduleAt: parseDate(dto.scheduleAt),
      status: dto.status ?? 'DRAFT'
    } as any);
  }

  async listChannelCampaigns(query: ChannelCampaignQuery) {
    return normalizePaginationResult(await this.repository.listChannelCampaigns(query));
  }

  async getChannelCampaign(id: number) {
    const campaign = await this.repository.findChannelCampaignById(id);
    if (!campaign) {
      throw new AppError('Channel campaign not found', HTTP_STATUS.NOT_FOUND, 'CHANNEL_CAMPAIGN_NOT_FOUND');
    }
    return campaign;
  }

  async updateChannelCampaign(id: number, dto: UpdateChannelCampaignDto, actorId?: number) {
    const existing = await this.repository.findChannelCampaignById(id);
    if (!existing) {
      throw new AppError('Channel campaign not found', HTTP_STATUS.NOT_FOUND, 'CHANNEL_CAMPAIGN_NOT_FOUND');
    }
    return this.repository.updateChannelCampaign(id, {
      ...dto,
      scheduleAt: parseDate(dto.scheduleAt)
    } as any);
  }

  async deleteChannelCampaign(id: number) {
    const existing = await this.repository.findChannelCampaignById(id);
    if (!existing) {
      throw new AppError('Channel campaign not found', HTTP_STATUS.NOT_FOUND, 'CHANNEL_CAMPAIGN_NOT_FOUND');
    }
    return this.repository.deleteChannelCampaign(id);
  }

  async createAbandonedCartRecovery(dto: CreateAbandonedCartRecoveryDto, actorId?: number) {
    return this.repository.createAbandonedCartRecovery({
      ...dto,
      reminderCount: dto.reminderCount ?? 0,
      nextReminderAt: parseDate(dto.nextReminderAt),
      recoveryStatus: dto.recoveryStatus ?? 'PENDING'
    } as any);
  }

  async listAbandonedCartRecoveries(query: AbandonedCartRecoveryQuery) {
    return normalizePaginationResult(await this.repository.listAbandonedCartRecoveries(query));
  }

  async getAbandonedCartRecovery(id: number) {
    const recovery = await this.repository.findAbandonedCartRecoveryById(id);
    if (!recovery) {
      throw new AppError('Abandoned cart recovery record not found', HTTP_STATUS.NOT_FOUND, 'ABANDONED_CART_RECOVERY_NOT_FOUND');
    }
    return recovery;
  }

  async updateAbandonedCartRecovery(id: number, dto: UpdateAbandonedCartRecoveryDto, actorId?: number) {
    const existing = await this.repository.findAbandonedCartRecoveryById(id);
    if (!existing) {
      throw new AppError('Abandoned cart recovery record not found', HTTP_STATUS.NOT_FOUND, 'ABANDONED_CART_RECOVERY_NOT_FOUND');
    }
    return this.repository.updateAbandonedCartRecovery(id, {
      ...dto,
      lastReminderDate: parseDate(dto.lastReminderDate),
      nextReminderAt: parseDate(dto.nextReminderAt)    } as any);
  }

  async deleteAbandonedCartRecovery(id: number) {
    const existing = await this.repository.findAbandonedCartRecoveryById(id);
    if (!existing) {
      throw new AppError('Abandoned cart recovery record not found', HTTP_STATUS.NOT_FOUND, 'ABANDONED_CART_RECOVERY_NOT_FOUND');
    }
    return this.repository.deleteAbandonedCartRecovery(id);
  }

  async listCampaignAnalytics(query: CampaignAnalyticsQuery) {
    const result = await this.repository.listCampaignAnalytics(query);
    const metrics = result.items.reduce(
      (aggregation: any, item: any) => {
        aggregation.totalRevenue += Number(item.revenue ?? 0);
        aggregation.totalClicks += Number(item.clicks ?? 0);
        aggregation.totalConversions += Number(item.conversions ?? 0);
        return aggregation;
      },
      { totalRevenue: 0, totalClicks: 0, totalConversions: 0 }
    );

    const totalItems = result.items.length;
    const averageCTR = totalItems ? result.items.reduce((sum: number, item: any) => sum + Number(item.ctr ?? 0), 0) / totalItems : 0;
    const averageConversionRate = totalItems ? result.items.reduce((sum: number, item: any) => sum + Number(item.conversionRate ?? 0), 0) / totalItems : 0;

    return {
      ...result,
      metrics: {
        totalRevenue: metrics.totalRevenue,
        totalClicks: metrics.totalClicks,
        totalConversions: metrics.totalConversions,
        averageCTR,
        averageConversionRate
      }
    };
  }
}


