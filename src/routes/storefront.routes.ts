import { Router } from 'express';
import prisma from '../helpers/prisma';
import apiResponse from '../utils/apiResponse';
import OrderRepository from '../repositories/order.repository';
import CartRepository from '../repositories/cart.repository';
import InventoryRepository from '../repositories/inventory.repository';
import ProductRepository from '../repositories/product.repository';
import CustomerRepository from '../repositories/customer.repository';
import OrderService from '../services/order.service';

const router = Router();
const db = prisma as any;
const orderService = new OrderService(
  new OrderRepository(),
  new CartRepository(),
  new InventoryRepository(),
  new ProductRepository(),
  new CustomerRepository()
);

router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await db.category.findMany({
      where: { isDeleted: false, isActive: true, status: 'ACTIVE' },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }]
    });

    return apiResponse.success(res, categories, 'Storefront categories fetched');
  } catch (error) {
    next(error);
  }
});

router.get('/products', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 50, 1), 100);
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const where: Record<string, unknown> = {
      status: 'ACTIVE',
      ...(categoryId && Number.isFinite(categoryId) ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { productName: { contains: search, mode: 'insensitive' } },
              { productCode: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {})
    };
    const skip = (page - 1) * pageSize;

    const [products, total, categories] = await Promise.all([
      db.product.findMany({
        where: { ...where, status: { in: ['ACTIVE', 'PUBLISHED'] } },
        skip,
        take: pageSize,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: { variants: true, images: true, attributes: true, tags: true }
      }),
      db.product.count({ where: { ...where, status: { in: ['ACTIVE', 'PUBLISHED'] } } }),
      db.category.findMany({
        where: { isDeleted: false, isActive: true, status: 'ACTIVE' },
        select: { id: true, name: true }
      })
    ]);

    const categoryNames = new Map(categories.map((category: { id: number; name: string }) => [category.id, category.name]));
    const items = products.map((product: any) => ({
      ...product,
      category: product.categoryId ? { name: categoryNames.get(product.categoryId) || null } : null
    }));

    return apiResponse.success(
      res,
      {
        items,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      },
      'Storefront products fetched'
    );
  } catch (error) {
    next(error);
  }
});

router.post('/checkout', async (req, res, next) => {
  try {
    const { sessionId, name, email, phone, address, city, state, pincode, paymentMethod } = req.body;
    if (!sessionId || !name || !email || !phone || !address || !city || !state || !pincode) {
      return apiResponse.badRequest(res, null, 'Checkout customer and address details are required');
    }
    if (paymentMethod !== 'COD') {
      return apiResponse.badRequest(res, null, 'Only cash on delivery is currently available');
    }

    const nameParts = String(name).trim().split(/\s+/);
    const firstName = nameParts.shift() || 'Guest';
    const lastName = nameParts.join(' ') || 'Customer';
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();
    const customer = await db.customer.upsert({
      where: { email: normalizedEmail },
      update: { firstName, lastName, mobile: normalizedPhone },
      create: {
        customerCode: `WEB-${Date.now()}`,
        firstName,
        lastName,
        email: normalizedEmail,
        mobile: normalizedPhone,
        isEmailVerified: false,
        isMobileVerified: false
      }
    });

    const customerAddress = await db.customerAddress.create({
      data: {
        customerId: customer.id,
        addressType: 'SHIPPING',
        isDefaultShipping: true,
        isDefaultBilling: true,
        addressLine1: String(address).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        country: 'India',
        pincode: String(pincode).trim()
      }
    });

    const cart = await db.cart.findUnique({ where: { sessionId: String(sessionId) } });
    if (!cart) {
      return apiResponse.badRequest(res, null, 'Cart not found');
    }

    const order = await orderService.create({
      cartId: cart.id,
      customerId: customer.id,
      billingAddressId: customerAddress.id,
      shippingAddressId: customerAddress.id,
      paymentMethod: 'COD',
      orderType: 'ONLINE',
      orderSource: 'WEB'
    });

    return apiResponse.created(res, order, 'COD order created successfully');
  } catch (error) {
    next(error);
  }
});

router.get('/orders/track/:orderNumber', async (req, res, next) => {
  try {
    const orderNumber = String(req.params.orderNumber).trim();
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!orderNumber || !email) {
      return apiResponse.badRequest(res, null, 'Order number and email are required');
    }

    const order = await db.order.findFirst({
      where: { orderNumber, customer: { email } },
      include: { items: true, statusHistory: true, timeline: true }
    });
    if (!order) {
      return apiResponse.notFound(res, null, 'Order not found');
    }

    return apiResponse.success(res, order, 'Order tracking fetched');
  } catch (error) {
    next(error);
  }
});

export default router;