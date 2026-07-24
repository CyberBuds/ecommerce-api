import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { PaymentQuery, SettlementQuery, ReconciliationQuery } from '../interfaces/payment.dto';

const db = prisma as any;

export default class PaymentRepository {
  async findPaymentById(id: number) {
    return db.payment.findUnique({
      where: { id },
      include: {
        order: true,
        customer: true,
        transactions: true,
        settlements: true,
        webhooks: true,
        invoicePayments: true,
        auditLogs: true
      }
    });
  }

  async findPaymentByNumber(paymentNumber: string) {
    return db.payment.findUnique({ where: { paymentNumber } });
  }

  async findPaymentByOrderId(orderId: number) {
    return db.payment.findMany({ where: { orderId }, include: { transactions: true, invoicePayments: true } });
  }

  async findPaymentByGatewayOrderId(gatewayOrderId: string) {
    return db.payment.findFirst({ where: { gatewayOrderId } });
  }

  async findPaymentByGatewayPaymentId(gatewayPaymentId: string) {
    return db.payment.findFirst({ where: { gatewayPaymentId } });
  }

  async listPayments(query: PaymentQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { paymentNumber: { contains: query.search, mode: 'insensitive' } },
        { transactionReference: { contains: query.search, mode: 'insensitive' } },
        { gatewayReference: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.orderId) {
      where.orderId = query.orderId;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.gateway) {
      where.gateway = query.gateway;
    }

    if (query.paymentMethod) {
      where.paymentMethod = query.paymentMethod;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) (where.createdAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.createdAt as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'amount', 'status', 'gateway', 'paymentMethod'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.payment.findMany({ where, orderBy, skip, take: pageSize, include: { order: true, customer: true } }),
      db.payment.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createPayment(data: Record<string, unknown>) {
    return db.payment.create({ data, include: { order: true, customer: true, transactions: true, invoicePayments: true, auditLogs: true } });
  }

  async updatePayment(id: number, data: Record<string, unknown>) {
    return db.payment.update({ where: { id }, data, include: { order: true, customer: true, transactions: true, invoicePayments: true, auditLogs: true } });
  }

  async createPaymentTransaction(data: Record<string, unknown>) {
    return db.paymentTransaction.create({ data });
  }

  async createPaymentWebhook(data: Record<string, unknown>) {
    return db.paymentWebhook.create({ data });
  }

  async updatePaymentWebhook(id: number, data: Record<string, unknown>) {
    return db.paymentWebhook.update({ where: { id }, data });
  }

  async listPaymentWebhooks(query: Record<string, unknown> = {}) {
    return db.paymentWebhook.findMany({ where: query, orderBy: { receivedAt: 'desc' } });
  }

  async createPaymentSettlement(data: Record<string, unknown>) {
    return db.paymentSettlement.create({ data });
  }

  async listPaymentSettlements(query: SettlementQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.gateway) where.gateway = query.gateway;
    if (query.status) where.status = query.status;
    if (query.dateFrom || query.dateTo) {
      where.settlementDate = {} as Record<string, unknown>;
      if (query.dateFrom) (where.settlementDate as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.settlementDate as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['settlementDate', 'grossAmount', 'netAmount', 'status'].includes(query.sortBy) ? query.sortBy : 'settlementDate';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.paymentSettlement.findMany({ where, orderBy, skip, take: pageSize }),
      db.paymentSettlement.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async createPaymentReconciliation(data: Record<string, unknown>) {
    return db.paymentReconciliation.create({ data });
  }

  async listPaymentReconciliations(query: ReconciliationQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { gatewayTransactionReference: { contains: query.search, mode: 'insensitive' } },
        { internalTransactionReference: { contains: query.search, mode: 'insensitive' } }
      ];
    }
    if (query.dateFrom || query.dateTo) {
      where.createdAt = {} as Record<string, unknown>;
      if (query.dateFrom) (where.createdAt as any).gte = new Date(query.dateFrom);
      if (query.dateTo) (where.createdAt as any).lte = new Date(query.dateTo);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['createdAt', 'differenceAmount', 'status'].includes(query.sortBy) ? query.sortBy : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      db.paymentReconciliation.findMany({ where, orderBy, skip, take: pageSize }),
      db.paymentReconciliation.count({ where })
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async findPaymentGatewayByProvider(provider: string) {
    return db.paymentGateway.findUnique({ where: { provider } });
  }

  async listPaymentMethods() {
    return db.paymentMethod.findMany();
  }

  async createPaymentMethod(data: Record<string, unknown>) {
    return db.paymentMethod.create({ data });
  }

  async listPaymentGateways() {
    return db.paymentGateway.findMany();
  }

  async createPaymentGateway(data: Record<string, unknown>) {
    return db.paymentGateway.create({ data });
  }

  async createCreditNote(data: Record<string, unknown>) {
    return db.creditNote.create({ data });
  }

  async createDebitNote(data: Record<string, unknown>) {
    return db.debitNote.create({ data });
  }

  async createTaxConfiguration(data: Record<string, unknown>) {
    return db.taxConfiguration.create({ data });
  }

  async listTaxConfigurations() {
    return db.taxConfiguration.findMany();
  }

  async createGSTConfiguration(data: Record<string, unknown>) {
    return db.gSTConfiguration.create({ data });
  }

  async listGSTConfigurations() {
    return db.gSTConfiguration.findMany();
  }

  async createInvoicePayment(data: Record<string, unknown>) {
    return db.invoicePayment.create({ data });
  }

  async updateInvoice(id: number, data: Record<string, unknown>) {
    return db.invoice.update({ where: { id }, data });
  }

  async createPaymentAuditLog(data: Record<string, unknown>) {
    return db.paymentAuditLog.create({ data });
  }
}
