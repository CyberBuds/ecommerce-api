import MasterRepository from '../../repositories/master.repository';

describe('MasterRepository', () => {
  it('should map attribute groupId to Prisma relation input on create', async () => {
    const attributeCreate = jest.fn().mockResolvedValue({ id: 1 });
    const prismaClient = {
      attribute: { create: attributeCreate }
    };

    const repository = new MasterRepository('attribute', prismaClient as any);

    await repository.create({
      name: 'Size',
      code: 'SIZE',
      slug: 'size',
      status: 'ACTIVE',
      groupId: 7,
      displayOrder: 0,
      createdBy: 1
    });

    expect(attributeCreate).toHaveBeenCalledWith({
      data: {
        name: 'Size',
        code: 'SIZE',
        slug: 'size',
        status: 'ACTIVE',
        displayOrder: 0,
        createdBy: 1,
        group: { connect: { id: 7 } }
      }
    });
  });

  it('should ignore empty or zero groupId values instead of creating an invalid Prisma relation', async () => {
    const attributeCreate = jest.fn().mockResolvedValue({ id: 1 });
    const prismaClient = {
      attribute: { create: attributeCreate }
    };

    const repository = new MasterRepository('attribute', prismaClient as any);

    await repository.create({
      name: 'Size',
      code: 'SIZE',
      slug: 'size',
      status: 'ACTIVE',
      groupId: '0',
      displayOrder: 0,
      createdBy: 1
    });

    expect(attributeCreate).toHaveBeenCalledWith({
      data: {
        name: 'Size',
        code: 'SIZE',
        slug: 'size',
        status: 'ACTIVE',
        displayOrder: 0,
        createdBy: 1,
      }
    });
  });
});
