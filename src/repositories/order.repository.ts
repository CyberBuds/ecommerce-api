import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { OrderListQuery } from '../interfaces/order.dto';

const db = prisma as any;

export default class OrderRepository {
  async findOrderById(id: number) {
    return db.order.findUnique({
      where: { id },
      include: {
        customer: true,
        billingAddress: true,
        shippingAddress: true,
        shippingMethod: true,
        deliverySlot: true,
        coupon: true,
        items: { include: { product: true, variant: true } },
        payments: true,
        statusHistory: true,
        timeline: true,
        shipments: { include: { items: true } },
        invoice: true,
        returnRequests: { include: { items: true } },
        refunds: true,
        notes: true,
        auditLogs: true
      }
    });
  }

  async findOrderByNumber(orderNumber: string) {
    return db.order.findUnique({ where: { orderNumber } });
  }

  async listOrders(query: OrderListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { remarks: { contains: query.search, mode: 'insensitive' } },
        { customer: { firstName: { contains: query.search, mode: 'insensitive' } } },
        { customer: { lastName: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.orderStatus) {
      where.orderStatus = query.orderStatus;
    }

    if (query.paymentStatus) {
      where.paymentStatus = query.paymentStatus;
    }

    if (query.fulfillmentStatus) {
      where.fulfillmentStatus = query.fulfillmentStatus;
    }

    if (query.dateFrom || query.dateTo) {
      where.orderDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.orderDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.orderDate as any).lte = new Date(query.dateTo);
    }

    const sortBy = query.sortBy && ['orderDate', 'grandTotal', 'orderStatus', 'paymentStatus', 'fulfillmentStatus', 'createdAt', 'updatedAt'].includes(query.sortBy) ? query.sortBy : 'orderDate';
    const orderBy = { [sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;

    const [items, total] = await Promise.all([
      db.order.findMany({ where, include: { customer: true, billingAddress: true, shippingAddress: true }, orderBy, skip, take: pageSize }),
      db.order.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createOrder(data: Record<string, unknown>) {
    return db.order.create({ data, include: { items: true, statusHistory: true, timeline: true, shipments: true, invoice: true, returnRequests: true, refunds: true, notes: true, auditLogs: true } });
  }

  async updateOrder(id: number, data: Record<string, unknown>) {
    return db.order.update({ where: { id }, data, include: { items: true, statusHistory: true, timeline: true, shipments: true, invoice: true, returnRequests: true, refunds: true, notes: true, auditLogs: true } });
  }

  async createOrderItem(data: Record<string, unknown>) {
    return db.orderItem.create({ data });
  }

  async createStatusHistory(data: Record<string, unknown>) {
    return db.orderStatusHistory.create({ data });
  }

  async createTimelineEvent(data: Record<string, unknown>) {
    return db.orderTimeline.create({ data });
  }

  async createShipment(data: Record<string, unknown>) {
    return db.shipment.create({ data, include: { items: true } });
  }

  async createShipmentItem(data: Record<string, unknown>) {
    return db.shipmentItem.create({ data });
  }

  async findShipmentByOrderId(orderId: number) {
    return db.shipment.findMany({ where: { orderId }, include: { items: true } });
  }

  async createInvoice(data: Record<string, unknown>) {
    return db.invoice.create({ data });
  }

  async findInvoiceByOrderId(orderId: number) {
    return db.invoice.findUnique({ where: { orderId } });
  }

  async createReturnRequest(data: Record<string, unknown>) {
    return db.returnRequest.create({ data, include: { items: true } });
  }

  async createReturnItem(data: Record<string, unknown>) {
    return db.returnItem.create({ data });
  }

  async createRefund(data: Record<string, unknown>) {
    return db.refund.create({ data });
  }

  async createOrderNote(data: Record<string, unknown>) {
    return db.orderNote.create({ data });
  }

  async createOrderAuditLog(data: Record<string, unknown>) {
    return db.orderAuditLog.create({ data });
  }
}
