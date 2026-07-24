export type ProductStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type DiscountType = 'NONE' | 'PERCENTAGE' | 'FIXED';
export type ProductVariantStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
export type ProductRelationType = 'RELATED' | 'FREQUENTLY_BOUGHT_TOGETHER' | 'CROSS_SELL' | 'UP_SELL';

export interface CreateProductDto {
  productCode: string;
  sku: string;
  barcode?: string;
  productName: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  categoryId?: number;
  subCategoryId?: number;
  brandId?: number;
  fabricId?: number;
  colorId?: number;
  sizeId?: number;
  unitId?: number;
  gstId?: number;
  countryOfOriginId?: number;
  careInstructionId?: number;
  occasionId?: number;
  patternId?: number;
  weavingStyleId?: number;
  borderTypeId?: number;
  workTypeId?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
  discountType?: DiscountType;
  discountValue?: number;
  taxAmount?: number;
  netAmount?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaJsonLd?: Record<string, unknown>;
  openGraph?: Record<string, unknown>;
  twitterCard?: Record<string, unknown>;
  seoScore?: number;
  searchKeywords?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  status?: ProductStatus;
  variants?: CreateProductVariantDto[];
  images?: CreateProductImageDto[];
  attributes?: CreateProductAttributeDto[];
  tags?: string[];
  categories?: number[];
  relations?: CreateProductRelationDto[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateProductVariantDto {
  variantCode?: string;
  sku: string;
  barcode?: string;
  colorId?: number;
  sizeId?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  costPrice?: number;
  sellingPrice?: number;
  mrp?: number;
  discountType?: DiscountType;
  discountValue?: number;
  taxAmount?: number;
  netAmount?: number;
  stock?: number;
  minimumStock?: number;
  maximumStock?: number;
  status?: ProductVariantStatus;
}

export interface CreateProductImageDto {
  imageUrl: string;
  isPrimary?: boolean;
  displayOrder?: number;
  altText?: string;
}

export interface CreateProductAttributeDto {
  attributeKey: string;
  attributeValue: string;
}

export interface CreateProductRelationDto {
  relatedProductId: number;
  relationType: ProductRelationType;
}

export interface ProductListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  status?: ProductStatus;
  categoryId?: number;
  brandId?: number;
  fabricId?: number;
  colorId?: number;
  sizeId?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  availability?: 'in_stock' | 'out_of_stock';
  dateFrom?: string;
  dateTo?: string;
}

export interface ProductWorkflowDto {
  status: ProductStatus;
  notes?: string;
}

export interface ProductResponseDto extends CreateProductDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: number | null;
  updatedBy?: number | null;
}
