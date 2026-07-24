import CmsService from '../../services/cms.service';
import CmsRepository from '../../repositories/cms.repository';
import AppError from '../../utils/AppError';
import {
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateBlogCategoryDto,
  CreateBlogTagDto,
  CreateBlogPostDto,
  CreateFaqDto,
  CreateTestimonialDto,
  CreatePolicyDto,
  CreateContactInquiryDto,
  CreateRedirectDto,
  CreateUrlRewriteDto,
  CreateSeoMetaDto,
} from '../../interfaces/cms.dto';

// ─────────────────────────────────────────────────────────────────────────────
// Mock CmsRepository
// ─────────────────────────────────────────────────────────────────────────────

jest.mock('../../repositories/cms.repository');

const MockedRepository = CmsRepository as jest.MockedClass<typeof CmsRepository>;

let service: CmsService;
let repo: jest.Mocked<CmsRepository>;

beforeEach(() => {
  jest.clearAllMocks();
  repo = new MockedRepository() as jest.Mocked<CmsRepository>;
  service = new CmsService(repo);
});

// ─────────────────────────────────────────────────────────────────────────────
// CMS Pages
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – CmsPage', () => {
  const pagePayload: CreateCmsPageDto = {
    pageCode: 'ABOUT_US',
    title: 'About Us',
  };

  describe('createCmsPage', () => {
    it('should create a CMS page with auto-generated slug', async () => {
      repo.findCmsPageBySlug = jest.fn().mockResolvedValue(null);
      repo.findCmsPageByCode = jest.fn().mockResolvedValue(null);
      repo.createCmsPage = jest.fn().mockResolvedValue({ id: 1, ...pagePayload, slug: 'about-us', status: 'DRAFT' });
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(0);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 1 });

      const result = await service.createCmsPage(pagePayload, 1);
      expect(result.slug).toBe('about-us');
      expect(repo.createCmsPage).toHaveBeenCalledWith(expect.objectContaining({ slug: 'about-us', status: 'DRAFT' }));
    });

    it('should use provided slug when given', async () => {
      const dto: CreateCmsPageDto = { ...pagePayload, slug: 'custom-slug' };
      repo.findCmsPageBySlug = jest.fn().mockResolvedValue(null);
      repo.findCmsPageByCode = jest.fn().mockResolvedValue(null);
      repo.createCmsPage = jest.fn().mockResolvedValue({ id: 1, ...dto, status: 'DRAFT' });
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(0);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 1 });

      const result = await service.createCmsPage(dto);
      expect(result.slug).toBe('custom-slug');
    });

    it('should throw CONFLICT when slug already exists', async () => {
      repo.findCmsPageBySlug = jest.fn().mockResolvedValue({ id: 99, slug: 'about-us' });
      repo.findCmsPageByCode = jest.fn().mockResolvedValue(null);

      await expect(service.createCmsPage(pagePayload)).rejects.toThrow(AppError);
      expect(repo.createCmsPage).not.toHaveBeenCalled();
    });

    it('should throw CONFLICT when pageCode already exists', async () => {
      repo.findCmsPageBySlug = jest.fn().mockResolvedValue(null);
      repo.findCmsPageByCode = jest.fn().mockResolvedValue({ id: 99, pageCode: 'ABOUT_US' });

      await expect(service.createCmsPage(pagePayload)).rejects.toThrow(AppError);
    });
  });

  describe('getCmsPage', () => {
    it('should return a page by id', async () => {
      repo.findCmsPageById = jest.fn().mockResolvedValue({ id: 1, title: 'About Us' });
      const result = await service.getCmsPage(1);
      expect(result.title).toBe('About Us');
    });

    it('should throw 404 if not found', async () => {
      repo.findCmsPageById = jest.fn().mockResolvedValue(null);
      await expect(service.getCmsPage(999)).rejects.toThrow(AppError);
    });
  });

  describe('updateCmsPage', () => {
    it('should update a page and create a version snapshot', async () => {
      const existing = { id: 1, slug: 'about-us', title: 'Old' };
      const updated = { ...existing, title: 'New' };
      repo.findCmsPageById = jest.fn().mockResolvedValue(existing);
      repo.updateCmsPage = jest.fn().mockResolvedValue(updated);
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(1);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 2 });

      const dto: UpdateCmsPageDto = { title: 'New' };
      const result = await service.updateCmsPage(1, dto);
      expect(result.title).toBe('New');
      expect(repo.createContentVersion).toHaveBeenCalled();
    });

    it('should throw CONFLICT when new slug already taken', async () => {
      const existing = { id: 1, slug: 'about-us' };
      repo.findCmsPageById = jest.fn().mockResolvedValue(existing);
      repo.findCmsPageBySlug = jest.fn().mockResolvedValue({ id: 99, slug: 'new-slug' });

      await expect(service.updateCmsPage(1, { slug: 'new-slug' })).rejects.toThrow(AppError);
    });
  });

  describe('deleteCmsPage', () => {
    it('should delete a page', async () => {
      repo.findCmsPageById = jest.fn().mockResolvedValue({ id: 1 });
      repo.deleteCmsPage = jest.fn().mockResolvedValue(undefined);
      await expect(service.deleteCmsPage(1)).resolves.toBeUndefined();
    });

    it('should throw 404 if not found', async () => {
      repo.findCmsPageById = jest.fn().mockResolvedValue(null);
      await expect(service.deleteCmsPage(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Blog Category
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – BlogCategory', () => {
  describe('createBlogCategory', () => {
    it('should auto-generate slug from categoryName', async () => {
      repo.findBlogCategoryBySlug = jest.fn().mockResolvedValue(null);
      repo.createBlogCategory = jest.fn().mockResolvedValue({ id: 1, categoryName: 'Silk Sarees', slug: 'silk-sarees' });

      const dto: CreateBlogCategoryDto = { categoryName: 'Silk Sarees' };
      const result = await service.createBlogCategory(dto);
      expect(result.slug).toBe('silk-sarees');
    });

    it('should throw CONFLICT when slug exists', async () => {
      repo.findBlogCategoryBySlug = jest.fn().mockResolvedValue({ id: 1 });
      await expect(service.createBlogCategory({ categoryName: 'Silk Sarees' })).rejects.toThrow(AppError);
    });
  });

  describe('getBlogCategory', () => {
    it('should return category by id', async () => {
      repo.findBlogCategoryById = jest.fn().mockResolvedValue({ id: 1, categoryName: 'Silk' });
      const result = await service.getBlogCategory(1);
      expect(result.categoryName).toBe('Silk');
    });

    it('should throw 404 if not found', async () => {
      repo.findBlogCategoryById = jest.fn().mockResolvedValue(null);
      await expect(service.getBlogCategory(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Blog Tags
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – BlogTag', () => {
  describe('createBlogTag', () => {
    it('should create a tag with generated slug', async () => {
      repo.findBlogTagBySlug = jest.fn().mockResolvedValue(null);
      repo.createBlogTag = jest.fn().mockResolvedValue({ id: 1, tagName: 'Trending', slug: 'trending' });

      const dto: CreateBlogTagDto = { tagName: 'Trending' };
      const result = await service.createBlogTag(dto);
      expect(result.slug).toBe('trending');
    });

    it('should throw CONFLICT when slug exists', async () => {
      repo.findBlogTagBySlug = jest.fn().mockResolvedValue({ id: 1 });
      await expect(service.createBlogTag({ tagName: 'Trending' })).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Blog Posts
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – BlogPost', () => {
  describe('createBlogPost', () => {
    it('should create a blog post and set tags', async () => {
      repo.findBlogPostBySlug = jest.fn().mockResolvedValue(null);
      repo.createBlogPost = jest.fn().mockResolvedValue({ id: 1, title: 'Test Post', slug: 'test-post' });
      repo.setBlogPostTags = jest.fn().mockResolvedValue(undefined);
      repo.findBlogPostById = jest.fn().mockResolvedValue({ id: 1, title: 'Test Post', slug: 'test-post', tags: [] });
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(0);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 1 });

      const dto: CreateBlogPostDto = { title: 'Test Post', tagIds: [1, 2] };
      const result = await service.createBlogPost(dto, 1);

      expect(result?.title).toBe('Test Post');
      expect(repo.setBlogPostTags).toHaveBeenCalledWith(1, [1, 2]);
    });

    it('should throw CONFLICT on duplicate slug', async () => {
      repo.findBlogPostBySlug = jest.fn().mockResolvedValue({ id: 1 });
      await expect(service.createBlogPost({ title: 'Test Post' })).rejects.toThrow(AppError);
    });
  });

  describe('getBlogPostBySlug', () => {
    it('should increment views on slug access', async () => {
      const mockPost = { id: 1, slug: 'test-post', views: 5 };
      repo.findBlogPostBySlug = jest.fn().mockResolvedValue(mockPost);
      repo.incrementBlogPostViews = jest.fn().mockResolvedValue({ ...mockPost, views: 6 });

      await service.getBlogPostBySlug('test-post');
      expect(repo.incrementBlogPostViews).toHaveBeenCalledWith(1);
    });

    it('should throw 404 if not found', async () => {
      repo.findBlogPostBySlug = jest.fn().mockResolvedValue(null);
      await expect(service.getBlogPostBySlug('missing')).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – FAQ', () => {
  describe('createFaq', () => {
    it('should create an FAQ', async () => {
      repo.createFaq = jest.fn().mockResolvedValue({ id: 1, question: 'Q?', answer: 'A' });
      const dto: CreateFaqDto = { question: 'Q?', answer: 'A' };
      const result = await service.createFaq(dto);
      expect(result.question).toBe('Q?');
    });
  });

  describe('getFaq', () => {
    it('should return FAQ by id', async () => {
      repo.findFaqById = jest.fn().mockResolvedValue({ id: 1, question: 'Q?' });
      const result = await service.getFaq(1);
      expect(result.question).toBe('Q?');
    });

    it('should throw 404 if not found', async () => {
      repo.findFaqById = jest.fn().mockResolvedValue(null);
      await expect(service.getFaq(999)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – Testimonial', () => {
  describe('createTestimonial', () => {
    it('should create a testimonial with valid rating', async () => {
      repo.createTestimonial = jest.fn().mockResolvedValue({ id: 1, customerName: 'John', rating: 5 });
      const dto: CreateTestimonialDto = { customerName: 'John', review: 'Great!', rating: 5 };
      const result = await service.createTestimonial(dto);
      expect(result.rating).toBe(5);
    });

    it('should throw on invalid rating > 5', async () => {
      const dto: CreateTestimonialDto = { customerName: 'John', review: 'Great!', rating: 6 };
      await expect(service.createTestimonial(dto)).rejects.toThrow(AppError);
    });

    it('should throw on invalid rating < 1', async () => {
      const dto: CreateTestimonialDto = { customerName: 'John', review: 'Great!', rating: 0 };
      await expect(service.createTestimonial(dto)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Policies
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – Policy', () => {
  describe('createPolicy', () => {
    it('should create a policy if type is new', async () => {
      repo.findPolicyByType = jest.fn().mockResolvedValue(null);
      repo.createPolicy = jest.fn().mockResolvedValue({ id: 1, policyType: 'PRIVACY_POLICY', title: 'Privacy' });
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(0);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 1 });

      const dto: CreatePolicyDto = { policyType: 'PRIVACY_POLICY', title: 'Privacy', content: '...' };
      const result = await service.createPolicy(dto);
      expect(result.policyType).toBe('PRIVACY_POLICY');
    });

    it('should throw CONFLICT if policy type already exists', async () => {
      repo.findPolicyByType = jest.fn().mockResolvedValue({ id: 1, policyType: 'PRIVACY_POLICY' });
      const dto: CreatePolicyDto = { policyType: 'PRIVACY_POLICY', title: 'Privacy', content: '...' };
      await expect(service.createPolicy(dto)).rejects.toThrow(AppError);
    });
  });

  describe('getPolicyByType', () => {
    it('should return policy by type', async () => {
      repo.findPolicyByType = jest.fn().mockResolvedValue({ id: 1, policyType: 'REFUND_POLICY' });
      const result = await service.getPolicyByType('REFUND_POLICY');
      expect(result.policyType).toBe('REFUND_POLICY');
    });

    it('should throw 404 if not found', async () => {
      repo.findPolicyByType = jest.fn().mockResolvedValue(null);
      await expect(service.getPolicyByType('COOKIE_POLICY')).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Contact Inquiry
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – ContactInquiry', () => {
  describe('createContactInquiry', () => {
    it('should create inquiry with NEW status', async () => {
      repo.createContactInquiry = jest.fn().mockResolvedValue({ id: 1, status: 'NEW', subject: 'Help' });
      const dto: CreateContactInquiryDto = {
        customerName: 'Jane',
        email: 'jane@example.com',
        subject: 'Help',
        message: 'I need help',
      };
      const result = await service.createContactInquiry(dto);
      expect(result.status).toBe('NEW');
    });
  });

  describe('updateContactInquiry', () => {
    it('should set resolvedAt when status becomes RESOLVED', async () => {
      const existing = { id: 1, status: 'ASSIGNED', resolvedAt: null };
      repo.findContactInquiryById = jest.fn().mockResolvedValue(existing);
      repo.updateContactInquiry = jest.fn().mockResolvedValue({ ...existing, status: 'RESOLVED', resolvedAt: new Date() });

      const result = await service.updateContactInquiry(1, { status: 'RESOLVED' });
      expect(result.status).toBe('RESOLVED');
      expect(repo.updateContactInquiry).toHaveBeenCalledWith(1, expect.objectContaining({ resolvedAt: expect.any(Date) }));
    });

    it('should throw 404 if inquiry not found', async () => {
      repo.findContactInquiryById = jest.fn().mockResolvedValue(null);
      await expect(service.updateContactInquiry(999, { status: 'RESOLVED' })).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Redirects
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – Redirect', () => {
  describe('createRedirect', () => {
    it('should create a 301 redirect', async () => {
      repo.findRedirectBySource = jest.fn().mockResolvedValue(null);
      repo.createRedirect = jest.fn().mockResolvedValue({ id: 1, sourceUrl: '/old', destinationUrl: '/new', redirectType: 'PERMANENT_301' });

      const dto: CreateRedirectDto = { sourceUrl: '/old', destinationUrl: '/new' };
      const result = await service.createRedirect(dto);
      expect(result.redirectType).toBe('PERMANENT_301');
    });

    it('should throw BAD_REQUEST when source equals destination (loop)', async () => {
      const dto: CreateRedirectDto = { sourceUrl: '/same', destinationUrl: '/same' };
      await expect(service.createRedirect(dto)).rejects.toThrow(AppError);
    });

    it('should throw CONFLICT if source URL already has a redirect', async () => {
      repo.findRedirectBySource = jest.fn().mockResolvedValue({ id: 1, sourceUrl: '/old' });
      const dto: CreateRedirectDto = { sourceUrl: '/old', destinationUrl: '/new' };
      await expect(service.createRedirect(dto)).rejects.toThrow(AppError);
    });
  });

  describe('resolveRedirect', () => {
    it('should increment hit count when redirect is active', async () => {
      const redirect = { id: 1, sourceUrl: '/old', destinationUrl: '/new', isActive: true };
      repo.findRedirectBySource = jest.fn().mockResolvedValue(redirect);
      repo.incrementRedirectHit = jest.fn().mockResolvedValue({ ...redirect, hitCount: 1 });

      await service.resolveRedirect('/old');
      expect(repo.incrementRedirectHit).toHaveBeenCalledWith(1);
    });

    it('should not increment hit count for inactive redirect', async () => {
      const redirect = { id: 1, sourceUrl: '/old', destinationUrl: '/new', isActive: false };
      repo.findRedirectBySource = jest.fn().mockResolvedValue(redirect);
      repo.incrementRedirectHit = jest.fn();

      await service.resolveRedirect('/old');
      expect(repo.incrementRedirectHit).not.toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// URL Rewrites
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – UrlRewrite', () => {
  describe('createUrlRewrite', () => {
    it('should create a URL rewrite', async () => {
      repo.findUrlRewriteByOldUrl = jest.fn().mockResolvedValue(null);
      repo.createUrlRewrite = jest.fn().mockResolvedValue({ id: 1, oldUrl: '/a', newUrl: '/b' });

      const dto: CreateUrlRewriteDto = { oldUrl: '/a', newUrl: '/b' };
      const result = await service.createUrlRewrite(dto);
      expect(result.oldUrl).toBe('/a');
    });

    it('should throw BAD_REQUEST when old and new URL are the same', async () => {
      const dto: CreateUrlRewriteDto = { oldUrl: '/same', newUrl: '/same' };
      await expect(service.createUrlRewrite(dto)).rejects.toThrow(AppError);
    });

    it('should throw CONFLICT if URL rewrite already exists', async () => {
      repo.findUrlRewriteByOldUrl = jest.fn().mockResolvedValue({ id: 1 });
      await expect(service.createUrlRewrite({ oldUrl: '/a', newUrl: '/b' })).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SEO Meta
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – SeoMeta', () => {
  describe('createSeoMeta', () => {
    it('should create SEO meta for a CMS page', async () => {
      repo.findSeoMetaByCmsPage = jest.fn().mockResolvedValue(null);
      repo.findSeoMetaByBlogPost = jest.fn().mockResolvedValue(null);
      repo.findSeoMetaBySlug = jest.fn().mockResolvedValue(null);
      repo.createSeoMeta = jest.fn().mockResolvedValue({ id: 1, pageType: 'CMS_PAGE', cmsPageId: 5 });

      const dto: CreateSeoMetaDto = { pageType: 'CMS_PAGE', cmsPageId: 5, metaTitle: 'About Us' };
      const result = await service.createSeoMeta(dto);
      expect(result.cmsPageId).toBe(5);
    });

    it('should throw CONFLICT when CMS page already has SEO meta', async () => {
      repo.findSeoMetaByCmsPage = jest.fn().mockResolvedValue({ id: 1, cmsPageId: 5 });
      const dto: CreateSeoMetaDto = { pageType: 'CMS_PAGE', cmsPageId: 5 };
      await expect(service.createSeoMeta(dto)).rejects.toThrow(AppError);
    });

    it('should throw CONFLICT when slug already exists', async () => {
      repo.findSeoMetaByCmsPage = jest.fn().mockResolvedValue(null);
      repo.findSeoMetaByBlogPost = jest.fn().mockResolvedValue(null);
      repo.findSeoMetaBySlug = jest.fn().mockResolvedValue({ id: 1, slug: 'about-us' });

      const dto: CreateSeoMetaDto = { pageType: 'CUSTOM', slug: 'about-us' };
      await expect(service.createSeoMeta(dto)).rejects.toThrow(AppError);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Robots.txt
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – RobotsTxt', () => {
  describe('getRobotsTxt', () => {
    it('should return stored content when config exists', async () => {
      repo.findActiveRobotsConfig = jest.fn().mockResolvedValue({ id: 1, content: 'User-agent: *\nDisallow: /' });
      const result = await service.getRobotsTxt();
      expect(result).toContain('User-agent');
    });

    it('should return default robots.txt when no config', async () => {
      repo.findActiveRobotsConfig = jest.fn().mockResolvedValue(null);
      const result = await service.getRobotsTxt();
      expect(result).toContain('User-agent: *');
      expect(result).toContain('/admin');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Content Version Rollback
// ─────────────────────────────────────────────────────────────────────────────

describe('CmsService – ContentVersionRollback', () => {
  describe('rollbackVersion', () => {
    it('should rollback CMS page to a previous version', async () => {
      const versionContent = { title: 'Old Title', content: 'Old content' };
      const version = { id: 10, entityType: 'CmsPage', entityId: 1, version: 1, content: versionContent };
      const cmsPage = { id: 1, title: 'Current Title' };
      const updated = { id: 1, title: 'Old Title' };

      repo.findContentVersionById = jest.fn().mockResolvedValue(version);
      repo.findCmsPageById = jest.fn().mockResolvedValue(cmsPage);
      repo.updateCmsPage = jest.fn().mockResolvedValue(updated);
      repo.getLatestVersionNumber = jest.fn().mockResolvedValue(2);
      repo.createContentVersion = jest.fn().mockResolvedValue({ id: 11 });

      const result = await service.rollbackVersion(1, 10, 99);
      expect(result.title).toBe('Old Title');
      expect(repo.createContentVersion).toHaveBeenCalled();
    });

    it('should throw VERSION_MISMATCH when version belongs to a different entity', async () => {
      const version = { id: 10, entityType: 'CmsPage', entityId: 99, content: {} };
      repo.findContentVersionById = jest.fn().mockResolvedValue(version);

      await expect(service.rollbackVersion(1, 10)).rejects.toThrow(AppError);
    });

    it('should throw VERSION_NOT_FOUND when version does not exist', async () => {
      repo.findContentVersionById = jest.fn().mockResolvedValue(null);
      await expect(service.rollbackVersion(1, 999)).rejects.toThrow(AppError);
    });
  });
});
