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
});
