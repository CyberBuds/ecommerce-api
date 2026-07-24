import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { CustomerListQuery, CustomerAddressListQuery, CustomerGroupListQuery, CustomerReviewListQuery, WalletTransactionListQuery, LoyaltyTransactionListQuery, NotificationListQuery } from '../interfaces/customer.dto';

const db = prisma as any;

export default class CustomerRepository {
  async findById(id: number) {
    return db.customer.findUnique({
      where: { id },
      include: {
        customerGroup: true,
        addresses: true,
        wishlist: { include: { product: true, variant: true } },
        reviews: { include: { product: true, variant: true } },
        walletTransactions: true,
        loyaltyTransactions: true,
        notifications: true,
        activityLogs: true,
        notes: true,
        documents: true,
        storeCreditTransactions: true,
        savedCarts: { include: { cart: { include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true } } } }
      }
    });
  }

  async findByEmail(email: string) {
    return db.customer.findUnique({ where: { email } });
  }

  async findByMobile(mobile: string) {
    return db.customer.findUnique({ where: { mobile } });
  }

  async findByCustomerCode(customerCode: string) {
    return db.customer.findUnique({ where: { customerCode } });
  }

  async create(data: any) {
    return db.customer.create({
      data,
      include: {
        customerGroup: true,
        addresses: true,
        wishlist: true,
        reviews: true,
        walletTransactions: true,
        loyaltyTransactions: true,
        notifications: true,
        activityLogs: true,
        notes: true,
        documents: true,
        storeCreditTransactions: true,
        savedCarts: true
      }
    });
  }

  async update(id: number, data: any) {
    return db.customer.update({
      where: { id },
      data,
      include: {
        customerGroup: true,
        addresses: true,
        wishlist: true,
        reviews: true,
        walletTransactions: true,
        loyaltyTransactions: true,
        notifications: true,
        activityLogs: true,
        notes: true,
        documents: true,
        storeCreditTransactions: true,
        savedCarts: true
      }
    });
  }

  async softDelete(id: number) {
    return db.customer.update({ where: { id }, data: { status: 'INACTIVE' } });
  }

  async list(query: CustomerListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { mobile: { contains: query.search, mode: 'insensitive' } },
        { customerCode: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.customerGroupId) {
      where.customerGroupId = query.customerGroupId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (typeof query.isEmailVerified === 'boolean') {
      where.isEmailVerified = query.isEmailVerified;
    }

    if (typeof query.isMobileVerified === 'boolean') {
      where.isMobileVerified = query.isMobileVerified;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) {
        (where.createdAt as any).gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (where.createdAt as any).lte = new Date(query.dateTo);
      }
    }

    const sortBy = query.sortBy && ['firstName', 'lastName', 'email', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.customer.findMany({ where, orderBy, skip, take: pageSize, include: { customerGroup: true } }),
      db.customer.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createAddress(customerId: number, data: any) {
    return db.customerAddress.create({ data: { ...data, customerId } });
  }

  async updateAddress(addressId: number, data: any) {
    return db.customerAddress.update({ where: { id: addressId }, data });
  }

  async deleteAddress(addressId: number) {
    return db.customerAddress.delete({ where: { id: addressId } });
  }

  async listAddresses(customerId: number) {
    return db.customerAddress.findMany({ where: { customerId } });
  }

  async findAddressById(addressId: number) {
    return db.customerAddress.findUnique({ where: { id: addressId } });
  }

  async createGroup(data: any) {
    return db.customerGroup.create({ data });
  }

  async updateGroup(id: number, data: any) {
    return db.customerGroup.update({ where: { id }, data });
  }

  async deleteGroup(id: number) {
    return db.customerGroup.delete({ where: { id } });
  }

  async findGroupById(id: number) {
    return db.customerGroup.findUnique({ where: { id } });
  }

  async listGroups(query: CustomerGroupListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const sortBy = query.sortBy && ['name', 'code', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.customerGroup.findMany({ where, orderBy, skip, take: pageSize }),
      db.customerGroup.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async findWishlistItem(customerId: number, productId: number, variantId?: number) {
    return db.customerWishlist.findFirst({ where: { customerId, productId, variantId } });
  }

  async createWishlistItem(customerId: number, data: any) {
    return db.customerWishlist.create({ data: { ...data, customerId } });
  }

  async deleteWishlistItem(wishlistId: number) {
    return db.customerWishlist.delete({ where: { id: wishlistId } });
  }

  async listWishlist(customerId: number) {
    return db.customerWishlist.findMany({ where: { customerId }, include: { product: true, variant: true } });
  }

  async createReview(customerId: number, data: any) {
    return db.customerReview.create({ data: { ...data, customerId } });
  }

  async updateReview(reviewId: number, data: any) {
    return db.customerReview.update({ where: { id: reviewId }, data });
  }

  async deleteReview(reviewId: number) {
    return db.customerReview.delete({ where: { id: reviewId } });
  }

  async findReviewById(reviewId: number) {
    return db.customerReview.findUnique({ where: { id: reviewId } });
  }

  async listReviews(query: CustomerReviewListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.rating) {
      where.rating = query.rating;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) {
        (where.createdAt as any).gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (where.createdAt as any).lte = new Date(query.dateTo);
      }
    }

    const sortBy = query.sortBy && ['rating', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.customerReview.findMany({ where, orderBy, skip, take: pageSize, include: { product: true, variant: true } }),
      db.customerReview.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createWalletTransaction(customerId: number, data: any) {
    return db.customerWalletTransaction.create({ data: { ...data, customerId } });
  }

  async listWalletTransactions(customerId: number, query: WalletTransactionListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = { customerId };

    if (query.type) {
      where.type = query.type;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) {
        (where.createdAt as any).gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (where.createdAt as any).lte = new Date(query.dateTo);
      }
    }

    const sortBy = query.sortBy && ['amount', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.customerWalletTransaction.findMany({ where, orderBy, skip, take: pageSize }),
      db.customerWalletTransaction.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createLoyaltyTransaction(customerId: number, data: any) {
    return db.loyaltyTransaction.create({ data: { ...data, customerId } });
  }

  async listLoyaltyTransactions(customerId: number, query: LoyaltyTransactionListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = { customerId };

    if (query.type) {
      where.type = query.type;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) {
        (where.createdAt as any).gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (where.createdAt as any).lte = new Date(query.dateTo);
      }
    }

    const sortBy = query.sortBy && ['points', 'createdAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.loyaltyTransaction.findMany({ where, orderBy, skip, take: pageSize }),
      db.loyaltyTransaction.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createNotification(customerId: number, data: any) {
    return db.customerNotification.create({ data: { ...data, customerId } });
  }

  async listNotifications(customerId: number, query: NotificationListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = { customerId };

    if (query.channel) {
      where.channel = query.channel;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (typeof query.isRead === 'boolean') {
      where.isRead = query.isRead;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) {
        (where.createdAt as any).gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        (where.createdAt as any).lte = new Date(query.dateTo);
      }
    }

    const sortBy = query.sortBy && ['createdAt', 'channel', 'status'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.customerNotification.findMany({ where, orderBy, skip, take: pageSize }),
      db.customerNotification.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createNote(customerId: number, data: any) {
    return db.customerNote.create({ data: { ...data, customerId } });
  }

  async updateNote(noteId: number, data: Record<string, unknown>) {
    return db.customerNote.update({ where: { id: noteId }, data });
  }

  async deleteNote(noteId: number) {
    return db.customerNote.delete({ where: { id: noteId } });
  }

  async listNotes(customerId: number) {
    return db.customerNote.findMany({ where: { customerId } });
  }

  async createDocument(customerId: number, data: any) {
    return db.customerDocument.create({ data: { ...data, customerId } });
  }

  async listDocuments(customerId: number) {
    return db.customerDocument.findMany({ where: { customerId } });
  }

  async deleteDocument(documentId: number) {
    return db.customerDocument.delete({ where: { id: documentId } });
  }

  async createActivityLog(customerId: number, data: Record<string, unknown>) {
    return db.customerActivityLog.create({ data: { ...data, customerId } });
  }

  async listActivityLogs(customerId: number) {
    return db.customerActivityLog.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' } });
  }
}
