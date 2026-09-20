import ProductService from '../product.service';

describe('ProductService', () => {
  it('creates an inventory row when a new product is created with initial stock', async () => {
    const repository = {
      create: jest.fn().mockResolvedValue({ id: 42, productName: 'Saree', sku: 'SKU-TEST', slug: 'saree' }),
      findBySku: jest.fn().mockResolvedValue(null),
      findBySlug: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue({ id: 42, productName: 'Saree', sku: 'SKU-TEST', slug: 'saree' }),
      createVariant: jest.fn(),
      createProductImage: jest.fn(),
      createAttributes: jest.fn(),
      createProductTag: jest.fn(),
      recordAudit: jest.fn(),
    };

    const inventoryRepository = {
      findFirstWarehouse: jest.fn().mockResolvedValue({ id: 7, warehouseName: 'Main Warehouse' }),
      findInventoryRecord: jest.fn().mockResolvedValue(null),
      createInventory: jest.fn().mockResolvedValue({ id: 99 }),
      updateInventory: jest.fn().mockResolvedValue({ id: 99 }),
    };

    const service = new ProductService(repository as any, inventoryRepository as any);

    await service.create({
      productCode: 'P-001',
      sku: 'SKU-TEST',
      productName: 'Saree',
      categoryId: 1,
      initialStock: 25,
      minStock: 5,
      warehouseId: 7,
    } as any);

    expect(inventoryRepository.createInventory).toHaveBeenCalledWith(expect.objectContaining({
      productId: 42,
      warehouseId: 7,
      currentStock: 25,
      availableStock: 25,
      minimumStock: 5,
    }));
  });

  it('strips stock and warehouse fields before updating a product record', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue({ id: 42, productName: 'Old Saree', sku: 'SKU-OLD', slug: 'old-saree' }),
      findBySku: jest.fn().mockResolvedValue(null),
      findBySlug: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({ id: 42, productName: 'Saree' }),
      createVariant: jest.fn(),
      createProductImage: jest.fn(),
      createAttributes: jest.fn(),
      createProductTag: jest.fn(),
      deleteProductTags: jest.fn(),
      deleteProductImages: jest.fn(),
      deleteAttributes: jest.fn(),
      recordAudit: jest.fn(),
    };

    const inventoryRepository = {
      findFirstWarehouse: jest.fn().mockResolvedValue({ id: 7, warehouseName: 'Main Warehouse' }),
      findInventoryRecord: jest.fn().mockResolvedValue({ id: 5, currentStock: 10, reservedStock: 0 }),
      createInventory: jest.fn().mockResolvedValue({ id: 99 }),
      updateInventory: jest.fn().mockResolvedValue({ id: 99 }),
    };

    const service = new ProductService(repository as any, inventoryRepository as any);

    await service.update(42, {
      productName: 'Updated Saree',
      sku: 'SKU-NEW',
      initialStock: 18,
      minStock: 3,
      warehouseId: 7,
      categoryId: 1,
    } as any);

    expect(repository.update).toHaveBeenCalledWith(
      42,
      expect.not.objectContaining({ initialStock: expect.anything(), minStock: expect.anything(), warehouseId: expect.anything() })
    );
  });
});
