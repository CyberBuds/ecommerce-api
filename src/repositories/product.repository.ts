import prisma from '../helpers/prisma';
import { ProductListQuery } from '../interfaces/product.dto';
import { buildPagination } from '../utils/pagination';

const db = prisma as any;

export default class ProductRepository {
  async findById(id: number) {
    return db.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: true,
        attributes: true,
        tags: true,
        categories: true,
        relations: true,
        auditLogs: true
      }
    });
  }

  async findVariantById(id: number) {
    return db.productVariant.findUnique({ where: { id } });
  }

  async findBySku(sku: string, excludeId?: number) {
    const where = excludeId ? { sku, NOT: { id: excludeId } } : { sku };
    return db.product.findFirst({ where });
  }

  async findBySlug(slug: string, excludeId?: number) {
    const where = excludeId ? { slug, NOT: { id: excludeId } } : { slug };
    return db.product.findFirst({ where });
  }

  async create(data: Record<string, unknown>) {
    return db.product.create({ data, include: { variants: true, images: true, attributes: true, tags: true, categories: true, relations: true } });
  }

  async update(id: number, data: Record<string, unknown>) {
    return db.product.update({ where: { id }, data, include: { variants: true, images: true, attributes: true, tags: true, categories: true, relations: true } });
  }

  async softDelete(id: number) {
    return db.product.update({ where: { id }, data: { status: 'ARCHIVED', isFeatured: false, isTrending: false, isBestSeller: false, isNewArrival: false } });
  }

  async list(query: ProductListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { productName: { contains: query.search, mode: 'insensitive' } },
        { productCode: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.fabricId) {
      where.fabricId = query.fabricId;
    }

    if (query.colorId) {
      where.colorId = query.colorId;
    }

    if (query.sizeId) {
      where.sizeId = query.sizeId;
    }

    if (typeof query.isFeatured === 'boolean') {
      where.isFeatured = query.isFeatured;
    }

    if (typeof query.isTrending === 'boolean') {
      where.isTrending = query.isTrending;
    }

    if (typeof query.isBestSeller === 'boolean') {
      where.isBestSeller = query.isBestSeller;
    }

    if (typeof query.isNewArrival === 'boolean') {
      where.isNewArrival = query.isNewArrival;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.sellingPrice = {} as Record<string, unknown>;
      if (query.minPrice !== undefined) {
        (where.sellingPrice as any).gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (where.sellingPrice as any).lte = query.maxPrice;
      }
    }

    if (query.availability) {
      const inStock = query.availability === 'in_stock';
      where.variants = inStock ? { some: { stock: { gt: 0 } } } : { every: { stock: { lte: 0 } } };
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

    if (query.filters) {
      Object.assign(where, query.filters);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['productName', 'sku', 'sellingPrice', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.product.findMany({ where, orderBy, skip, take: pageSize, include: { variants: true, images: true, attributes: true, tags: true, categories: true, relations: true } }),
      db.product.count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }

  async createVariant(productId: number, data: Record<string, unknown>) {
    return db.productVariant.create({ data: { ...data, productId } });
  }

  async updateVariant(variantId: number, data: Record<string, unknown>) {
    return db.productVariant.update({ where: { id: variantId }, data });
  }

  async deleteVariant(productId: number, variantId: number) {
    return db.productVariant.deleteMany({ where: { id: variantId, productId } });
  }

  async listVariants(productId: number) {
    return db.productVariant.findMany({ where: { productId } });
  }

  async createAttributes(productId: number, attributes: Record<string, unknown>[]) {
    return db.productAttributeValue.createMany({ data: attributes.map((attribute) => ({ ...attribute, productId })) });
  }

  async deleteAttributes(productId: number) {
    return db.productAttributeValue.deleteMany({ where: { productId } });
  }

  async updateAttribute(attributeId: number, data: Record<string, unknown>) {
    return db.productAttributeValue.update({ where: { id: attributeId }, data });
  }

  async deleteAttribute(productId: number, attributeId: number) {
    return db.productAttributeValue.deleteMany({ where: { id: attributeId, productId } });
  }

  async listAttributes(productId: number) {
    return db.productAttributeValue.findMany({ where: { productId } });
  }

  async createProductImage(productId: number, data: Record<string, unknown>) {
    return db.productImage.create({ data: { ...data, productId } });
  }

  async deleteProductImages(productId: number) {
    return db.productImage.deleteMany({ where: { productId } });
  }

  async createProductTag(productId: number, name: string) {
    return db.productTagLink.create({ data: { productId, name } });
  }

  async deleteProductTags(productId: number) {
    return db.productTagLink.deleteMany({ where: { productId } });
  }

  async createProductCategory(productId: number, categoryId: number) {
    return db.productCategory.create({ data: { productId, categoryId } });
  }

  async deleteProductCategories(productId: number) {
    return db.productCategory.deleteMany({ where: { productId } });
  }

  async createRelations(productId: number, relations: Record<string, unknown>[]) {
    return db.productRelation.createMany({ data: relations.map((relation) => ({ ...relation, productId })), skipDuplicates: true });
  }

  async listRelations(productId: number) {
    return db.productRelation.findMany({ where: { productId } });
  }

  async deleteRelation(relationId: number) {
    return db.productRelation.delete({ where: { id: relationId } });
  }

  async findAuditLogs(productId: number) {
    return db.productAuditLog.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  async recordAudit(productId: number, action: string, actorId: number | null, details?: Record<string, unknown> | null, previous?: Record<string, unknown> | null) {
    return db.productAuditLog.create({ data: { productId, action, actorId, details, previous } });
  }
}
