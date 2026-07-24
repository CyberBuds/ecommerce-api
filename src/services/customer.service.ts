import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import CustomerRepository from '../repositories/customer.repository';
import ProductRepository from '../repositories/product.repository';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerListQuery,
  CustomerProfileUpdateDto,
  CreateCustomerAddressDto,
  CustomerAddressListQuery,
  CreateCustomerGroupDto,
  UpdateCustomerGroupDto,
  CustomerGroupListQuery,
  CreateWishlistItemDto,
  CreateCustomerReviewDto,
  UpdateCustomerReviewDto,
  CustomerReviewListQuery,
  CreateWalletTransactionDto,
  WalletTransactionListQuery,
  CreateLoyaltyTransactionDto,
  LoyaltyTransactionListQuery,
  CreateNotificationDto,
  NotificationListQuery,
  CreateCustomerNoteDto,
  CreateCustomerDocumentDto,
  CustomerDocumentListQuery
} from '../interfaces/customer.dto';

export default class CustomerService {
  constructor(private repository: CustomerRepository, private productRepository: ProductRepository) {}

  private async assertUnique(dto: Partial<CreateCustomerDto> | Partial<UpdateCustomerDto>, excludeId?: number) {
    if (dto.email) {
      const existing = await this.repository.findByEmail(String(dto.email));
      if (existing && existing.id !== excludeId) {
        throw new AppError('Email already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_EMAIL');
      }
    }

    if (dto.mobile) {
      const existing = await this.repository.findByMobile(String(dto.mobile));
      if (existing && existing.id !== excludeId) {
        throw new AppError('Mobile already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_MOBILE');
      }
    }

    if (dto.customerCode) {
      const existing = await this.repository.findByCustomerCode(String(dto.customerCode));
      if (existing && existing.id !== excludeId) {
        throw new AppError('Customer code already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_CUSTOMER_CODE');
      }
    }
  }

  async create(dto: CreateCustomerDto, createdBy?: number) {
    await this.assertUnique(dto);
    return this.repository.create({ ...dto, createdBy, updatedBy: createdBy });
  }

  async update(id: number, dto: UpdateCustomerDto, updatedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }

    await this.assertUnique(dto, id);
    return this.repository.update(id, { ...dto, updatedBy });
  }

  async delete(id: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }
    return this.repository.softDelete(id);
  }

  async getById(id: number) {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }
    return customer;
  }

  async list(query: CustomerListQuery) {
    return this.repository.list(query);
  }

  async getProfile(customerId: number) {
    return this.getById(customerId);
  }

  async updateProfile(customerId: number, dto: CustomerProfileUpdateDto) {
    const existing = await this.repository.findById(customerId);
    if (!existing) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }
    return this.repository.update(customerId, dto);
  }

  async createAddress(customerId: number, dto: CreateCustomerAddressDto, createdBy?: number) {
    await this.ensureCustomerExists(customerId);
    return this.repository.createAddress(customerId, { ...dto, createdBy, updatedBy: createdBy });
  }

  async updateAddress(addressId: number, dto: CreateCustomerAddressDto, updatedBy?: number) {
    return this.repository.updateAddress(addressId, { ...dto, updatedBy });
  }

  async deleteAddress(addressId: number) {
    return this.repository.deleteAddress(addressId);
  }

  async listAddresses(customerId: number) {
    await this.ensureCustomerExists(customerId);
    return this.repository.listAddresses(customerId);
  }

  async createGroup(dto: CreateCustomerGroupDto, createdBy?: number) {
    return this.repository.createGroup({ ...dto, createdBy, updatedBy: createdBy });
  }

  async updateGroup(id: number, dto: UpdateCustomerGroupDto, updatedBy?: number) {
    const group = await this.repository.findGroupById(id);
    if (!group) {
      throw new AppError('Customer group not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_GROUP_NOT_FOUND');
    }
    return this.repository.updateGroup(id, { ...dto, updatedBy });
  }

  async deleteGroup(id: number) {
    return this.repository.deleteGroup(id);
  }

  async listGroups(query: CustomerGroupListQuery) {
    return this.repository.listGroups(query);
  }

  async addWishlistItem(customerId: number, dto: CreateWishlistItemDto) {
    await this.ensureCustomerExists(customerId);
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    if (dto.variantId) {
      const variant = await this.productRepository.findVariantById(dto.variantId);
      if (!variant || variant.productId !== dto.productId) {
        throw new AppError('Variant not found for product', HTTP_STATUS.BAD_REQUEST, 'INVALID_VARIANT');
      }
    }

    const existing = await this.repository.findWishlistItem(customerId, dto.productId, dto.variantId as number | undefined);
    if (existing) {
      throw new AppError('Wishlist item already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_WISHLIST_ITEM');
    }

    const item = await this.repository.createWishlistItem(customerId, { productId: dto.productId, variantId: dto.variantId });
    await this.recordActivity(customerId, 'WISHLIST', item.id, 'Wishlist item added');
    return item;
  }

  async removeWishlistItem(wishlistId: number) {
    return this.repository.deleteWishlistItem(wishlistId);
  }

  async listWishlist(customerId: number) {
    return this.repository.listWishlist(customerId);
  }

  async createReview(customerId: number, dto: CreateCustomerReviewDto) {
    await this.ensureCustomerExists(customerId);
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    if (dto.variantId) {
      const variant = await this.productRepository.findVariantById(dto.variantId);
      if (!variant || variant.productId !== dto.productId) {
        throw new AppError('Variant not found for product', HTTP_STATUS.BAD_REQUEST, 'INVALID_VARIANT');
      }
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new AppError('Rating must be between 1 and 5', HTTP_STATUS.BAD_REQUEST, 'INVALID_RATING');
    }

    const review = await this.repository.createReview(customerId, {
      productId: dto.productId,
      variantId: dto.variantId,
      rating: dto.rating,
      reviewTitle: dto.reviewTitle,
      review: dto.review,
      images: dto.images || []
    });
    await this.recordActivity(customerId, 'REVIEWS', review.id, 'Customer review submitted');
    return review;
  }

  async updateReview(reviewId: number, dto: UpdateCustomerReviewDto) {
    const review = await this.repository.findReviewById(reviewId);
    if (!review) {
      throw new AppError('Review not found', HTTP_STATUS.NOT_FOUND, 'REVIEW_NOT_FOUND');
    }
    return this.repository.updateReview(reviewId, { ...dto, approvedDate: dto.status === 'APPROVED' ? new Date() : review.approvedDate });
  }

  async deleteReview(reviewId: number) {
    return this.repository.deleteReview(reviewId);
  }

  async listReviews(query: CustomerReviewListQuery) {
    return this.repository.listReviews(query);
  }

  async createWalletTransaction(customerId: number, dto: CreateWalletTransactionDto) {
    const customer = await this.ensureCustomerExists(customerId);
    const amount = Number(dto.amount);
    if (amount <= 0) {
      throw new AppError('Amount must be greater than zero', HTTP_STATUS.BAD_REQUEST, 'INVALID_AMOUNT');
    }

    const balance = Number(customer.walletBalance ?? 0);
    const nextBalance = dto.type === 'DEBIT' ? balance - amount : balance + amount;
    if (dto.type === 'DEBIT' && nextBalance < 0) {
      throw new AppError('Insufficient wallet balance', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_BALANCE');
    }

    await this.repository.update(customerId, { walletBalance: nextBalance });
    return this.repository.createWalletTransaction(customerId, {
      type: dto.type,
      amount,
      reference: dto.reference,
      remarks: dto.remarks,
      balanceAfter: nextBalance
    });
  }

  async listWalletTransactions(customerId: number, query: WalletTransactionListQuery) {
    return this.repository.listWalletTransactions(customerId, query);
  }

  async createLoyaltyTransaction(customerId: number, dto: CreateLoyaltyTransactionDto) {
    const customer = await this.ensureCustomerExists(customerId);
    const points = Number(dto.points);
    if (points <= 0) {
      throw new AppError('Points must be greater than zero', HTTP_STATUS.BAD_REQUEST, 'INVALID_POINTS');
    }

    const balance = Number(customer.loyaltyPoints ?? 0);
    const nextBalance = dto.type === 'REDEEM' ? balance - points : balance + points;
    if (dto.type === 'REDEEM' && nextBalance < 0) {
      throw new AppError('Insufficient loyalty points', HTTP_STATUS.BAD_REQUEST, 'INSUFFICIENT_POINTS');
    }

    await this.repository.update(customerId, { loyaltyPoints: nextBalance });
    return this.repository.createLoyaltyTransaction(customerId, {
      type: dto.type,
      points,
      reference: dto.reference,
      remarks: dto.remarks,
      balanceAfter: nextBalance
    });
  }

  async listLoyaltyTransactions(customerId: number, query: LoyaltyTransactionListQuery) {
    return this.repository.listLoyaltyTransactions(customerId, query);
  }

  async createNotification(customerId: number, dto: CreateNotificationDto) {
    await this.ensureCustomerExists(customerId);
    return this.repository.createNotification(customerId, dto);
  }

  async listNotifications(customerId: number, query: NotificationListQuery) {
    return this.repository.listNotifications(customerId, query);
  }

  async createNote(customerId: number, dto: CreateCustomerNoteDto, createdBy?: number) {
    await this.ensureCustomerExists(customerId);
    return this.repository.createNote(customerId, { note: dto.note, createdBy, updatedBy: createdBy });
  }

  async updateNote(noteId: number, dto: Partial<CreateCustomerNoteDto>, updatedBy?: number) {
    return this.repository.updateNote(noteId, { ...dto, updatedBy });
  }

  async deleteNote(noteId: number) {
    return this.repository.deleteNote(noteId);
  }

  async listNotes(customerId: number) {
    await this.ensureCustomerExists(customerId);
    return this.repository.listNotes(customerId);
  }

  async createDocument(customerId: number, data: CreateCustomerDocumentDto, uploadedBy?: number) {
    await this.ensureCustomerExists(customerId);
    return this.repository.createDocument(customerId, { ...data, uploadedBy });
  }

  async listDocuments(customerId: number) {
    return this.repository.listDocuments(customerId);
  }

  async deleteDocument(documentId: number) {
    return this.repository.deleteDocument(documentId);
  }

  async listActivityLogs(customerId: number) {
    return this.repository.listActivityLogs(customerId);
  }

  private async ensureCustomerExists(customerId: number) {
    const customer = await this.repository.findById(customerId);
    if (!customer) {
      throw new AppError('Customer not found', HTTP_STATUS.NOT_FOUND, 'CUSTOMER_NOT_FOUND');
    }
    return customer;
  }

  private async recordActivity(customerId: number, activityType: string, referenceId?: number, description?: string) {
    return this.repository.createActivityLog(customerId, { activityType, referenceId, description });
  }
}
