import MarketingService from '../../services/marketing.service';
import MarketingRepository from '../../repositories/marketing.repository';
import CustomerRepository from '../../repositories/customer.repository';
import AppError from '../../utils/AppError';
import {
  CreateBannerDto,
  CreateCampaignDto,
  CreateFlashSaleDto,
  CreateGiftCardDto,
  CreateStoreCreditDto,
  CreateNewsletterSubscriberDto,
  CreateLandingPageDto,
} from '../../interfaces/marketing.dto';

// ─────────────────────────────────────────────────────────────────────────────
// Mock repositories
// ─────────────────────────────────────────────────────────────────────────────

jest.mock('../../repositories/marketing.repository');
jest.mock('../../repositories/customer.repository');

const MockedMarketingRepository = MarketingRepository as jest.MockedClass<typeof MarketingRepository>;
const MockedCustomerRepository = CustomerRepository as jest.MockedClass<typeof CustomerRepository>;

let service: MarketingService;
let repo: jest.Mocked<MarketingRepository>;
let customerRepo: jest.Mocked<CustomerRepository>;

beforeEach(() => {
  jest.clearAllMocks();
  repo = new MockedMarketingRepository() as jest.Mocked<MarketingRepository>;
  customerRepo = new MockedCustomerRepository() as jest.Mocked<CustomerRepository>;
  service = new MarketingService(repo, customerRepo);
});

// ─────────────────────────────────────────────────────────────────────────────
// Banner
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – Banner', () => {
  const bannerPayload: CreateBannerDto = {
    bannerCode: 'BANNER001',
    title: 'Summer Sale',
    position: 'TOP',
    displayOn: 'ALL',
    priority: 1,
  };

  describe('createBanner', () => {
    it('should create a banner successfully', async () => {
      const mockBanner = { id: 1, ...bannerPayload, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() };
      repo.createBanner = jest.fn().mockResolvedValue(mockBanner);

      const result = await service.createBanner(bannerPayload);

      expect(repo.createBanner).toHaveBeenCalled();
      expect(result).toEqual(mockBanner);
    });

    it('should reject when endDate is before startDate', async () => {
      const invalidPayload: CreateBannerDto = {
        ...bannerPayload,
        startDate: '2025-12-31',
        endDate: '2025-01-01',
      };

      await expect(service.createBanner(invalidPayload)).rejects.toThrow(AppError);
      expect(repo.createBanner).not.toHaveBeenCalled();
    });
  });

  describe('getBanner', () => {
    it('should return a banner by id', async () => {
      const mock = { id: 1, title: 'Banner 1' };
      repo.findBannerById = jest.fn().mockResolvedValue(mock);

      const result = await service.getBanner(1);
      expect(result).toEqual(mock);
    });

    it('should throw 404 if banner not found', async () => {
      repo.findBannerById = jest.fn().mockResolvedValue(null);

      await expect(service.getBanner(999)).rejects.toThrow(AppError);
    });
  });

  describe('updateBanner', () => {
    it('should update an existing banner', async () => {
      const existing = { id: 1, bannerCode: 'B1', title: 'Old' };
      const updated = { ...existing, title: 'New' };
      repo.findBannerById = jest.fn().mockResolvedValue(existing);
      repo.updateBanner = jest.fn().mockResolvedValue(updated);

      const result = await service.updateBanner(1, { title: 'New' });
      expect(result.title).toBe('New');
    });

    it('should throw 404 if banner not found', async () => {
      repo.findBannerById = jest.fn().mockResolvedValue(null);

      await expect(service.updateBanner(999, { title: 'X' })).rejects.toThrow(AppError);
    });
  });

  describe('deleteBanner', () => {
    it('should delete an existing banner', async () => {
      repo.findBannerById = jest.fn().mockResolvedValue({ id: 1 });
      repo.deleteBanner = jest.fn().mockResolvedValue(undefined);

      await expect(service.deleteBanner(1)).resolves.toBeUndefined();
    });

    it('should throw 404 if banner not found', async () => {
      repo.findBannerById = jest.fn().mockResolvedValue(null);

      await expect(service.deleteBanner(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Campaign
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – Campaign', () => {
  const campaignPayload: CreateCampaignDto = {
    campaignCode: 'CAMP001',
    campaignName: 'Diwali Sale',
    campaignType: 'FLASH_SALE',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    priority: 1,
  };

  describe('createCampaign', () => {
    it('should create a campaign', async () => {
      const mock = { id: 1, ...campaignPayload, status: 'DRAFT' };
      repo.createCampaign = jest.fn().mockResolvedValue(mock);

      const result = await service.createCampaign(campaignPayload);
      expect(result.campaignCode).toBe('CAMP001');
    });

    it('should reject when endDate is before startDate', async () => {
      const invalidPayload: CreateCampaignDto = {
        ...campaignPayload,
        startDate: '2025-12-31',
        endDate: '2025-01-01',
      };

      await expect(service.createCampaign(invalidPayload)).rejects.toThrow(AppError);
    });
  });

  describe('getCampaign', () => {
    it('should return a campaign by id', async () => {
      repo.findCampaignById = jest.fn().mockResolvedValue({ id: 1, campaignCode: 'CAMP001' });

      const result = await service.getCampaign(1);
      expect(result.campaignCode).toBe('CAMP001');
    });

    it('should throw 404 if not found', async () => {
      repo.findCampaignById = jest.fn().mockResolvedValue(null);

      await expect(service.getCampaign(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Flash Sale
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – FlashSale', () => {
  const salePayload: CreateFlashSaleDto = {
    flashSaleName: 'Flash 50',
    startDate: '2025-06-01',
    endDate: '2025-06-02',
    discountType: 'PERCENTAGE',
    discountValue: 50,
  };

  describe('createFlashSale', () => {
    it('should create a flash sale', async () => {
      const mock = { id: 1, ...salePayload, status: 'DRAFT' };
      repo.createFlashSale = jest.fn().mockResolvedValue(mock);

      const result = await service.createFlashSale(salePayload);
      expect(result.flashSaleName).toBe('Flash 50');
    });

    it('should reject when endDate is before startDate', async () => {
      const invalid: CreateFlashSaleDto = {
        ...salePayload,
        startDate: '2025-12-31',
        endDate: '2025-01-01',
      };

      await expect(service.createFlashSale(invalid)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Gift Card
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – GiftCard', () => {
  const giftCardPayload: CreateGiftCardDto = {
    giftCardCode: 'GIFT001',
    amount: 500,
    balance: 500,
    expiryDate: '2099-12-31',
  };

  describe('createGiftCard', () => {
    it('should create a gift card', async () => {
      const mock = { id: 1, ...giftCardPayload, status: 'ACTIVE' };
      repo.createGiftCard = jest.fn().mockResolvedValue(mock);

      const result = await service.createGiftCard(giftCardPayload);
      expect(result.balance).toBe(500);
    });
  });

  describe('redeemGiftCard', () => {
    it('should deduct balance on valid redemption', async () => {
      const existing = { id: 1, giftCardCode: 'GIFT001', balance: 500, status: 'ACTIVE', expiryDate: new Date('2099-01-01') };
      repo.findGiftCardById = jest.fn().mockResolvedValue(existing);
      repo.updateGiftCard = jest.fn().mockResolvedValue({ ...existing, balance: 300 });

      const result = await service.redeemGiftCard(1, 200);
      expect(result.balance).toBe(300);
    });

    it('should throw if gift card not found', async () => {
      repo.findGiftCardById = jest.fn().mockResolvedValue(null);

      await expect(service.redeemGiftCard(999, 100)).rejects.toThrow(AppError);
    });

    it('should throw if gift card is expired', async () => {
      const expired = {
        id: 1, giftCardCode: 'GIFT001', balance: 500, status: 'ACTIVE',
        expiryDate: new Date('2020-01-01'),
      };
      repo.findGiftCardById = jest.fn().mockResolvedValue(expired);

      await expect(service.redeemGiftCard(1, 100)).rejects.toThrow(AppError);
    });

    it('should throw if insufficient balance', async () => {
      const card = { id: 1, giftCardCode: 'GIFT001', balance: 50, status: 'ACTIVE', expiryDate: new Date('2099-01-01') };
      repo.findGiftCardById = jest.fn().mockResolvedValue(card);

      await expect(service.redeemGiftCard(1, 100)).rejects.toThrow(AppError);
    });

    it('should throw if gift card is inactive', async () => {
      const inactive = { id: 1, giftCardCode: 'GIFT001', balance: 500, status: 'CANCELLED', expiryDate: new Date('2099-01-01') };
      repo.findGiftCardById = jest.fn().mockResolvedValue(inactive);

      await expect(service.redeemGiftCard(1, 100)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Store Credits
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – StoreCredits', () => {
  describe('createStoreCredit', () => {
    it('should create a credit transaction', async () => {
      const dto: CreateStoreCreditDto = {
        customerId: 1,
        type: 'CREDIT',
        creditAmount: 200,
        reason: 'Referral reward',
      };
      customerRepo.findById = jest.fn().mockResolvedValue({ id: 1 });
      repo.findLatestStoreCredit = jest.fn().mockResolvedValue({ balance: 100 });
      repo.createStoreCreditTransaction = jest.fn().mockResolvedValue({ id: 1, ...dto, balance: 300 });

      const result = await service.createStoreCredit(dto);
      expect(result.balance).toBe(300);
    });

    it('should throw if customer not found', async () => {
      const dto: CreateStoreCreditDto = { customerId: 99, type: 'CREDIT', creditAmount: 100 };
      customerRepo.findById = jest.fn().mockResolvedValue(null);

      await expect(service.createStoreCredit(dto)).rejects.toThrow(AppError);
    });

    it('should throw if insufficient balance for debit', async () => {
      const dto: CreateStoreCreditDto = {
        customerId: 1,
        type: 'DEBIT',
        debitAmount: 500,
        reason: 'Order payment',
      };
      customerRepo.findById = jest.fn().mockResolvedValue({ id: 1 });
      repo.findLatestStoreCredit = jest.fn().mockResolvedValue({ balance: 100 });

      await expect(service.createStoreCredit(dto)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – Newsletter', () => {
  describe('createNewsletterSubscriber', () => {
    it('should create a new subscriber', async () => {
      const dto: CreateNewsletterSubscriberDto = { email: 'test@example.com' };
      repo.findNewsletterSubscriberByEmail = jest.fn().mockResolvedValue(null);
      repo.createNewsletterSubscriber = jest.fn().mockResolvedValue({ id: 1, email: dto.email, status: 'ACTIVE' });

      const result = await service.createNewsletterSubscriber(dto);
      expect(result.email).toBe('test@example.com');
    });

    it('should reactivate an unsubscribed email', async () => {
      const dto: CreateNewsletterSubscriberDto = { email: 'old@example.com' };
      const existing = { id: 1, email: dto.email, status: 'UNSUBSCRIBED' };
      repo.findNewsletterSubscriberByEmail = jest.fn().mockResolvedValue(existing);
      repo.updateNewsletterSubscriber = jest.fn().mockResolvedValue({ ...existing, status: 'ACTIVE' });

      const result = await service.createNewsletterSubscriber(dto);
      expect(result.status).toBe('ACTIVE');
      expect(repo.createNewsletterSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('getNewsletterSubscriber', () => {
    it('should return subscriber by id', async () => {
      repo.findNewsletterSubscriberById = jest.fn().mockResolvedValue({ id: 1, email: 'a@b.com' });
      const result = await service.getNewsletterSubscriber(1);
      expect(result.email).toBe('a@b.com');
    });

    it('should throw 404 if not found', async () => {
      repo.findNewsletterSubscriberById = jest.fn().mockResolvedValue(null);
      await expect(service.getNewsletterSubscriber(999)).rejects.toThrow(AppError);
    });
  });

  describe('deleteNewsletterSubscriber', () => {
    it('should delete subscriber', async () => {
      repo.findNewsletterSubscriberById = jest.fn().mockResolvedValue({ id: 1 });
      repo.deleteNewsletterSubscriber = jest.fn().mockResolvedValue(undefined);

      await expect(service.deleteNewsletterSubscriber(1)).resolves.toBeUndefined();
    });

    it('should throw 404 if not found', async () => {
      repo.findNewsletterSubscriberById = jest.fn().mockResolvedValue(null);
      await expect(service.deleteNewsletterSubscriber(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – LandingPage', () => {
  describe('createLandingPage', () => {
    it('should create a landing page', async () => {
      const dto: CreateLandingPageDto = {
        slug: 'summer-sale-2025',
        seoTitle: 'Summer Sale',
      };
      const mock = { id: 1, ...dto, status: 'ACTIVE' };
      repo.createLandingPage = jest.fn().mockResolvedValue(mock);

      const result = await service.createLandingPage(dto);
      expect(result.slug).toBe('summer-sale-2025');
    });
  });

  describe('getLandingPage', () => {
    it('should return landing page by id', async () => {
      repo.findLandingPageById = jest.fn().mockResolvedValue({ id: 1, slug: 'test-page' });
      const result = await service.getLandingPage(1);
      expect(result.slug).toBe('test-page');
    });

    it('should throw 404 if not found', async () => {
      repo.findLandingPageById = jest.fn().mockResolvedValue(null);
      await expect(service.getLandingPage(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Campaign Analytics
// ─────────────────────────────────────────────────────────────────────────────

describe('MarketingService – CampaignAnalytics', () => {
  describe('listCampaignAnalytics', () => {
    it('should aggregate analytics metrics across all records', async () => {
      const mockResult = {
        items: [
          { id: 1, campaignId: 1, ctr: 10, conversionRate: 5, revenue: 5000, clicks: 100, conversions: 10 },
          { id: 2, campaignId: 1, ctr: 8, conversionRate: 4, revenue: 2500, clicks: 50, conversions: 5 },
        ],
        pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
      };
      repo.listCampaignAnalytics = jest.fn().mockResolvedValue(mockResult);

      const result = await service.listCampaignAnalytics({ campaignId: 1 });

      expect(result.metrics.totalRevenue).toBe(7500);
      expect(result.metrics.totalClicks).toBe(150);
      expect(result.metrics.totalConversions).toBe(15);
      expect(result.metrics.averageCTR).toBe(9);
      expect(result.metrics.averageConversionRate).toBe(4.5);
    });

    it('should handle empty analytics without errors', async () => {
      const mockResult = {
        items: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      };
      repo.listCampaignAnalytics = jest.fn().mockResolvedValue(mockResult);

      const result = await service.listCampaignAnalytics({ campaignId: 99 });

      expect(result.metrics.totalRevenue).toBe(0);
      expect(result.metrics.averageCTR).toBe(0);
      expect(result.metrics.averageConversionRate).toBe(0);
    });
  });
});

