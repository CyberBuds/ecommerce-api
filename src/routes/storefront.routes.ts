import { Router } from 'express';
import prisma from '../helpers/prisma';
import apiResponse from '../utils/apiResponse';

const router = Router();
const db = prisma as any;

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

export default router;