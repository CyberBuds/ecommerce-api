import prisma from '../helpers/prisma';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

export default class InvoiceService {
  async list(query: Record<string, any> = {}) {
    const page = Number(query.page && Number(query.page) > 0 ? query.page : 1);
    const pageSize = Number(query.pageSize && Number(query.pageSize) > 0 ? query.pageSize : 20);
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.orderId) {
      where.orderId = Number(query.orderId);
    }

    if (query.status) {
      where.invoiceStatus = query.status;
    }

    if (query.search) {
      const search = String(query.search).trim();
      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search, mode: 'insensitive' } },
          { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
          { order: { customer: { firstName: { contains: search, mode: 'insensitive' } } } },
          { order: { customer: { lastName: { contains: search, mode: 'insensitive' } } } }
        ];
      }
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['invoiceDate', 'invoiceStatus', 'netAmount', 'createdAt', 'updatedAt'].includes(String(query.sortBy)) ? String(query.sortBy) : 'invoiceDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          order: {
            include: {
              customer: true,
              items: { include: { product: true, variant: true } }
            }
          },
          payments: true
        }
      }),
      prisma.invoice.count({ where })
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize) || 1
    };
  }

  async getById(id: number) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: true,
            items: { include: { product: true, variant: true } }
          }
        },
        payments: true,
        creditNotes: true,
        debitNotes: true
      }
    });

    if (!invoice) {
      throw new AppError('Invoice not found', HTTP_STATUS.NOT_FOUND, 'INVOICE_NOT_FOUND');
    }

    return invoice;
  }

  async pay(id: number) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      throw new AppError('Invoice not found', HTTP_STATUS.NOT_FOUND, 'INVOICE_NOT_FOUND');
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        invoiceStatus: 'PAID',
        updatedAt: new Date()
      }
    });
  }

  async void(id: number) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      throw new AppError('Invoice not found', HTTP_STATUS.NOT_FOUND, 'INVOICE_NOT_FOUND');
    }

    return prisma.invoice.update({
      where: { id },
      data: {
        invoiceStatus: 'CANCELLED',
        updatedAt: new Date()
      }
    });
  }
}
