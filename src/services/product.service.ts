import { parse } from 'json2csv';
import PDFDocument from 'pdfkit';
import * as xlsx from 'xlsx';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import ProductRepository from '../repositories/product.repository';
import {
  CreateProductAttributeDto,
  CreateProductDto,
  CreateProductRelationDto,
  CreateProductVariantDto,
  ProductListQuery,
  ProductWorkflowDto,
  UpdateProductDto
} from '../interfaces/product.dto';
import { calculateSeoScore, buildOpenGraph, buildTwitterCard, generateSchemaJsonLd } from '../utils/seo';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sanitizeNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

export default class ProductService {
  constructor(private repository: ProductRepository) {}

  private async assertUnique(dto: Partial<CreateProductDto> | Partial<UpdateProductDto>, excludeId?: number) {
    if (dto.sku) {
      const existingSku = await this.repository.findBySku(dto.sku, excludeId);
      if (existingSku) {
        throw new AppError('SKU already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_SKU');
      }
    }

    if (dto.slug) {
      const existingSlug = await this.repository.findBySlug(dto.slug, excludeId);
      if (existingSlug) {
        throw new AppError('Slug already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_SLUG');
      }
    }
  }

  private buildPayload(dto: Partial<CreateProductDto> | Partial<UpdateProductDto>, createdBy?: number, updatedBy?: number) {
    const payload: Record<string, unknown> = { ...dto };

    if (payload.productName && !payload.slug) {
      payload.slug = slugify(String(payload.productName));
    }

    if (payload.slug) {
      payload.slug = slugify(String(payload.slug));
    }

    if (createdBy) payload.createdBy = createdBy;
    if (updatedBy) payload.updatedBy = updatedBy;

    if (payload.status) payload.status = String(payload.status).toUpperCase();
    if (payload.discountType) payload.discountType = String(payload.discountType).toUpperCase();

    if (payload.metaTitle || payload.metaDescription || payload.metaKeywords) {
      payload.seoScore = calculateSeoScore({
        title: String(payload.metaTitle || ''),
        description: String(payload.metaDescription || ''),
        keywords: String(payload.metaKeywords || '')
      });
    }

    if (!payload.openGraph && payload.metaTitle) {
      payload.openGraph = buildOpenGraph({
        title: String(payload.metaTitle),
        description: String(payload.metaDescription || ''),
        url: String(payload.canonicalUrl || ''),
        image: undefined
      });
    }

    if (!payload.twitterCard && payload.metaTitle) {
      payload.twitterCard = buildTwitterCard({
        title: String(payload.metaTitle),
        description: String(payload.metaDescription || ''),
        image: undefined,
        url: String(payload.canonicalUrl || '')
      });
    }

    if (!payload.schemaJsonLd && payload.productName) {
      payload.schemaJsonLd = generateSchemaJsonLd({
        name: String(payload.productName),
        description: String(payload.shortDescription || payload.description || ''),
        sku: String(payload.sku || ''),
        brand: String(payload.brandId || ''),
        url: String(payload.canonicalUrl || '')
      });
    }

    return payload;
  }

  private normalizeAttributes(attributes?: CreateProductAttributeDto[]) {
    if (!attributes || attributes.length === 0) return [];
    return attributes.map((attribute) => ({
      attributeKey: attribute.attributeKey,
      attributeValue: attribute.attributeValue
    }));
  }

  private buildExportRows(products: any[]) {
    return products.map((product) => ({
      id: product.id,
      productCode: product.productCode,
      sku: product.sku,
      productName: product.productName,
      status: product.status,
      sellingPrice: product.sellingPrice,
      mrp: product.mrp,
      categoryId: product.categoryId,
      brandId: product.brandId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
  }

  async create(dto: CreateProductDto, createdBy?: number) {
    const payload = this.buildPayload(dto, createdBy) as unknown as CreateProductDto;
    await this.assertUnique(payload);

    const { variants, images, attributes, tags, categories, relations, ...productData } = payload;
    const product = await this.repository.create(productData as Record<string, unknown>);

    if (variants && variants.length > 0) {
      await Promise.all(variants.map((variant) => this.repository.createVariant(product.id, toRecord(variant))));
    }

    if (images && images.length > 0) {
      await Promise.all(images.map((image) => this.repository.createProductImage(product.id, toRecord(image))));
    }

    if (attributes && attributes.length > 0) {
      await this.repository.createAttributes(product.id, this.normalizeAttributes(attributes));
    }

    if (tags && tags.length > 0) {
      await Promise.all(tags.map((tag) => this.repository.createProductTag(product.id, String(tag))));
    }

    if (categories && categories.length > 0) {
      await Promise.all(categories.map((categoryId) => this.repository.createProductCategory(product.id, Number(categoryId))));
    }

    if (relations && relations.length > 0) {
      await this.repository.createRelations(product.id, relations.map(toRecord));
    }

    await this.repository.recordAudit(product.id, 'CREATE_PRODUCT', createdBy ?? null, { productCode: product.productCode }, null);
    return this.repository.findById(product.id);
  }

  async update(id: number, dto: UpdateProductDto, updatedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    const payload = this.buildPayload(dto, undefined, updatedBy) as unknown as UpdateProductDto;
    await this.assertUnique(payload, id);

    const { variants, images, attributes, tags, categories, relations, ...productData } = payload;
    const updated = await this.repository.update(id, productData as Record<string, unknown>);

    if (variants) {
      await Promise.all(variants.map((variant) => {
        const variantRecord = toRecord(variant);
        if (variant && (variant as any).id) {
          return this.repository.updateVariant((variant as any).id, { ...variantRecord, productId: id });
        }
        return this.repository.createVariant(id, variantRecord);
      }));
    }

    if (images) {
      await this.repository.deleteProductImages(id);
      await Promise.all(images.map((image) => this.repository.createProductImage(id, toRecord(image))));
    }

    if (tags) {
      await this.repository.deleteProductTags(id);
      await Promise.all(tags.map((tag) => this.repository.createProductTag(id, String(tag))));
    }

    if (categories) {
      await this.repository.deleteProductCategories(id);
      await Promise.all(categories.map((categoryId) => this.repository.createProductCategory(id, Number(categoryId))));
    }

    if (attributes) {
      await this.repository.deleteAttributes(id);
      await this.repository.createAttributes(id, this.normalizeAttributes(attributes));
    }

    if (relations) {
      await this.repository.createRelations(id, relations.map(toRecord));
    }

    await this.repository.recordAudit(id, 'UPDATE_PRODUCT', updatedBy ?? null, { updates: productData }, existing as any);
    return this.repository.findById(id);
  }

  async delete(id: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }
    const deleted = await this.repository.softDelete(id);
    await this.repository.recordAudit(id, 'DELETE_PRODUCT', null, null, existing as any);
    return deleted;
  }

  async getById(id: number) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }
    return product;
  }

  async list(query: ProductListQuery) {
    return this.repository.list(query);
  }

  async createVariant(productId: number, dto: CreateProductVariantDto, createdBy?: number) {
    const variant = await this.repository.createVariant(productId, toRecord(dto));
    await this.repository.recordAudit(productId, 'CREATE_VARIANT', createdBy ?? null, variant as any, null);
    return variant;
  }

  async updateVariant(productId: number, variantId: number, dto: CreateProductVariantDto, updatedBy?: number) {
    const updated = await this.repository.updateVariant(variantId, toRecord(dto));
    await this.repository.recordAudit(productId, 'UPDATE_VARIANT', updatedBy ?? null, updated as any, null);
    return updated;
  }

  async deleteVariant(productId: number, variantId: number) {
    await this.repository.deleteVariant(productId, variantId);
    await this.repository.recordAudit(productId, 'DELETE_VARIANT', null, { variantId }, null);
  }

  async listVariants(productId: number) {
    return this.repository.listVariants(productId);
  }

  async createAttributes(productId: number, attributes: CreateProductAttributeDto[]) {
    const result = await this.repository.createAttributes(productId, this.normalizeAttributes(attributes));
    await this.repository.recordAudit(productId, 'CREATE_ATTRIBUTES', null, { count: attributes.length }, null);
    return result;
  }

  async updateAttribute(productId: number, attributeId: number, dto: CreateProductAttributeDto) {
    const updated = await this.repository.updateAttribute(attributeId, toRecord(dto));
    await this.repository.recordAudit(productId, 'UPDATE_ATTRIBUTE', null, updated as any, null);
    return updated;
  }

  async deleteAttribute(productId: number, attributeId: number) {
    await this.repository.deleteAttribute(productId, attributeId);
    await this.repository.recordAudit(productId, 'DELETE_ATTRIBUTE', null, { attributeId }, null);
  }

  async listAttributes(productId: number) {
    return this.repository.listAttributes(productId);
  }

  async createRelations(productId: number, relations: CreateProductRelationDto[]) {
    const result = await this.repository.createRelations(productId, relations as unknown as Record<string, unknown>[]);
    await this.repository.recordAudit(productId, 'CREATE_RELATIONS', null, { count: relations.length }, null);
    return result;
  }

  async deleteRelation(relationId: number) {
    await this.repository.deleteRelation(relationId);
    return { relationId };
  }

  async listRelations(productId: number) {
    return this.repository.listRelations(productId);
  }

  async updateWorkflow(productId: number, dto: ProductWorkflowDto, actorId?: number) {
    const current = await this.repository.findById(productId);
    if (!current) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    const updated = await this.repository.update(productId, { status: dto.status } as Record<string, unknown>);
    await this.repository.recordAudit(productId, 'WORKFLOW_UPDATE', actorId ?? null, { status: dto.status, notes: dto.notes }, current as any);
    return updated;
  }

  async duplicate(productId: number) {
    const source = await this.repository.findById(productId);
    if (!source) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    const copySlug = slugify(`${source.slug}-copy`);
    const { variants, images, attributes, tags, categories, relations, auditLogs, ...productData } = source as any;
    const duplicateProduct = await this.repository.create({
      ...productData,
      sku: `${source.sku}-copy`,
      productCode: `${source.productCode}-copy`,
      slug: copySlug,
      status: 'DRAFT'
    } as any);

    await Promise.all(source.variants.map((variant: any) => {
      const { id, createdAt, updatedAt, productId: _, ...variantPayload } = variant;
      return this.repository.createVariant(duplicateProduct.id, {
        ...variantPayload,
        sku: `${variantPayload.sku}-copy`,
        variantCode: variantPayload.variantCode ? `${variantPayload.variantCode}-copy` : undefined
      } as Record<string, unknown>);
    }));

    await Promise.all(source.images.map((image: any) =>
      this.repository.createProductImage(duplicateProduct.id, {
        imageUrl: image.imageUrl,
        isPrimary: image.isPrimary,
        displayOrder: image.displayOrder,
        altText: image.altText
      } as Record<string, unknown>)
    ));
    await Promise.all(source.attributes.map((attribute: any) =>
      this.repository.createAttributes(duplicateProduct.id, [{ attributeKey: attribute.attributeKey, attributeValue: attribute.attributeValue }])
    ));
    await Promise.all(source.tags.map((tag: any) => this.repository.createProductTag(duplicateProduct.id, tag.name)));
    await Promise.all(source.categories.map((category: any) =>
      this.repository.createProductCategory(duplicateProduct.id, category.categoryId)
    ));

    await this.repository.recordAudit(productId, 'DUPLICATE_PRODUCT', null, { duplicatedId: duplicateProduct.id }, source as any);
    return this.repository.findById(duplicateProduct.id);
  }

  async bulkImport(file: Express.Multer.File, format?: string) {
    const contentType = file.mimetype;
    const buffer = file.buffer;
    let rows: any[] = [];

    if (format === 'xlsx' || contentType.includes('sheet') || file.originalname.endsWith('.xlsx')) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    } else if (format === 'csv' || contentType.includes('csv') || file.originalname.endsWith('.csv')) {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    } else {
      throw new AppError('Unsupported import file type', HTTP_STATUS.BAD_REQUEST, 'UNSUPPORTED_FILE_TYPE');
    }

    const summary: { imported: number; errors: Array<{ row: number; reason: string }> } = { imported: 0, errors: [] };

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      try {
        if (!row.productCode || !row.sku || !row.productName) {
          summary.errors.push({ row: index + 1, reason: 'productCode, sku and productName are required' });
          continue;
        }

        const dto: CreateProductDto = {
          productCode: String(row.productCode),
          sku: String(row.sku),
          productName: String(row.productName),
          slug: row.slug ? String(row.slug) : undefined,
          shortDescription: row.shortDescription ? String(row.shortDescription) : undefined,
          description: row.description ? String(row.description) : undefined,
          categoryId: sanitizeNumber(row.categoryId),
          brandId: sanitizeNumber(row.brandId),
          fabricId: sanitizeNumber(row.fabricId),
          colorId: sanitizeNumber(row.colorId),
          sizeId: sanitizeNumber(row.sizeId),
          unitId: sanitizeNumber(row.unitId),
          gstId: sanitizeNumber(row.gstId),
          countryOfOriginId: sanitizeNumber(row.countryOfOriginId),
          careInstructionId: sanitizeNumber(row.careInstructionId),
          occasionId: sanitizeNumber(row.occasionId),
          patternId: sanitizeNumber(row.patternId),
          weavingStyleId: sanitizeNumber(row.weavingStyleId),
          borderTypeId: sanitizeNumber(row.borderTypeId),
          workTypeId: sanitizeNumber(row.workTypeId),
          weight: sanitizeNumber(row.weight),
          length: sanitizeNumber(row.length),
          width: sanitizeNumber(row.width),
          height: sanitizeNumber(row.height),
          costPrice: sanitizeNumber(row.costPrice),
          sellingPrice: sanitizeNumber(row.sellingPrice),
          mrp: sanitizeNumber(row.mrp),
          discountType: row.discountType ? String(row.discountType) as any : undefined,
          discountValue: sanitizeNumber(row.discountValue),
          taxAmount: sanitizeNumber(row.taxAmount),
          netAmount: sanitizeNumber(row.netAmount),
          metaTitle: row.metaTitle ? String(row.metaTitle) : undefined,
          metaDescription: row.metaDescription ? String(row.metaDescription) : undefined,
          metaKeywords: row.metaKeywords ? String(row.metaKeywords) : undefined,
          canonicalUrl: row.canonicalUrl ? String(row.canonicalUrl) : undefined,
          status: row.status ? String(row.status) as any : undefined
        };

        await this.create(dto);
        summary.imported += 1;
      } catch (err: unknown) {
        summary.errors.push({ row: index + 1, reason: (err as Error).message });
      }
    }

    return summary;
  }

  async export(query: ProductListQuery, format: string) {
    const products = await this.repository.list({ ...query, page: 1, pageSize: 1000 });
    const rows = this.buildExportRows(products.items || []);

    if (format === 'xlsx') {
      const workbook = xlsx.utils.book_new();
      const sheet = xlsx.utils.json_to_sheet(rows);
      xlsx.utils.book_append_sheet(workbook, sheet, 'Products');
      const data = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return { data, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));

      doc.text('Product Export', { underline: true, align: 'center' });
      doc.moveDown();
      rows.forEach((row) => {
        doc.text(JSON.stringify(row));
        doc.moveDown();
      });

      doc.end();
      await new Promise<void>((resolve, reject) => {
        doc.on('end', () => resolve());
        doc.on('error', (error) => reject(error));
      });
      return { data: Buffer.concat(buffers), contentType: 'application/pdf' };
    }

    const fields = Object.keys(rows[0] || {});
    const csv = parse(rows, { fields });
    return { data: Buffer.from(csv), contentType: 'text/csv' };
  }

  async listAuditLogs(productId: number) {
    return this.repository.findAuditLogs(productId);
  }
}
