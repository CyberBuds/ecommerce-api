import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import {
  CartQuery,
  DeliverySlotListQuery,
  ShippingEstimateQuery,
  ShippingMethodListQuery,
  SavedCartQuery
} from '../interfaces/cart.dto';

const db = prisma as any;

export default class CartRepository {
  async findActiveCartByCustomer(customerId: number) {
    return db.cart.findFirst({
      where: { customerId, status: 'ACTIVE' },
      include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true, savedCart: true }
    });
  }

  async findCartBySession(sessionId: string) {
    return db.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true, savedCart: true }
    });
  }

  async findCartById(cartId: number) {
    return db.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true, savedCart: true }
    });
  }

  async createCart(data: Record<string, unknown>) {
    return db.cart.create({ data });
  }

  async updateCart(id: number, data: Record<string, unknown>) {
    return db.cart.update({ where: { id }, data });
  }

  async findCartItemByProductVariant(cartId: number, productId: number, variantId?: number) {
    return db.cartItem.findFirst({ where: { cartId, productId, variantId: variantId || null } });
  }

  async findCartItemById(itemId: number) {
    return db.cartItem.findUnique({ where: { id: itemId } });
  }

  async createCartItem(data: Record<string, unknown>) {
    return db.cartItem.create({ data });
  }

  async updateCartItem(itemId: number, data: Record<string, unknown>) {
    return db.cartItem.update({ where: { id: itemId }, data });
  }

  async deleteCartItem(itemId: number) {
    return db.cartItem.delete({ where: { id: itemId } });
  }

  async listCartItems(cartId: number) {
    return db.cartItem.findMany({ where: { cartId }, include: { product: true, variant: true } });
  }

  async findCouponByCode(couponCode: string) {
    return db.coupon.findUnique({ where: { couponCode } });
  }

  async countCouponUsages(couponId: number) {
    return db.couponUsage.count({ where: { couponId } });
  }

  async countCustomerCouponUsages(customerId: number, couponId: number) {
    return db.couponUsage.count({ where: { customerId, couponId } });
  }

  async createCouponUsage(data: Record<string, unknown>) {
    return db.couponUsage.create({ data });
  }

  async findShippingMethodById(id: number) {
    return db.shippingMethod.findUnique({ where: { id } });
  }

  async listShippingMethods(query: ShippingMethodListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    const sortBy = query.sortBy && ['name', 'code', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.shippingMethod.findMany({ where, orderBy, skip, take: pageSize }),
      db.shippingMethod.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findDeliverySlotById(id: number) {
    return db.deliverySlot.findUnique({ where: { id } });
  }

  async listDeliverySlots(query: DeliverySlotListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.date) {
      where.date = new Date(query.date);
    }

    const sortBy = query.sortBy && ['date', 'startTime', 'endTime', 'status', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'date';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.deliverySlot.findMany({ where, orderBy, skip, take: pageSize }),
      db.deliverySlot.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findShippingZoneByAddress(query: ShippingEstimateQuery) {
    const where: Record<string, unknown> = { country: query.country };
    if (query.state) where.state = query.state;
    if (query.city) where.city = query.city;
    if (query.postalCode) where.postalCode = query.postalCode;
    return db.shippingZone.findFirst({ where, include: { charges: true } });
  }

  async findShippingCharge(methodId: number, zoneId: number, weight?: number) {
    const where: any = { shippingMethodId: methodId, zoneId };
    if (typeof weight === 'number') {
      where.AND = [
        { minimumWeight: { lte: weight } },
        { maximumWeight: { gte: weight } }
      ];
    }
    return db.shippingCharge.findFirst({ where, orderBy: { charge: 'asc' } });
  }

  async findSavedCartById(savedCartId: number) {
    return db.savedCart.findUnique({ where: { id: savedCartId }, include: { cart: { include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true } } } });
  }

  async findSavedCartsByCustomer(customerId: number) {
    return db.savedCart.findMany({ where: { customerId }, include: { cart: { include: { items: { include: { product: true, variant: true } }, coupon: true, shippingMethod: true, deliverySlot: true } } } });
  }

  async createSavedCart(data: Record<string, unknown>) {
    return db.savedCart.create({ data });
  }

  async updateSavedCart(id: number, data: Record<string, unknown>) {
    return db.savedCart.update({ where: { id }, data });
  }
}
