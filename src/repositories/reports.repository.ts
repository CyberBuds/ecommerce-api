import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { ReportFilter, ScheduledReportQuery } from '../interfaces/reports.dto';

const db = prisma as any;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dateRange(filter: ReportFilter): { gte?: Date; lte?: Date } {
  const range: { gte?: Date; lte?: Date } = {};
  if (filter.startDate) range.gte = new Date(filter.startDate);
  if (filter.endDate) {
    const end = new Date(filter.endDate);
    end.setHours(23, 59, 59, 999);
    range.lte = end;
  }
  return range;
}

function paged(query: { page?: number; pageSize?: number }) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
  return { page, pageSize, skip: (page - 1) * pageSize };
}

function startOf(unit: 'day' | 'week' | 'month' | 'year', ref = new Date()): Date {
  const d = new Date(ref);
  if (unit === 'day') { d.setHours(0, 0, 0, 0); }
  if (unit === 'week') { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); }
  if (unit === 'month') { d.setDate(1); d.setHours(0, 0, 0, 0); }
  if (unit === 'year') { d.setMonth(0, 1); d.setHours(0, 0, 0, 0); }
  return d;
}

function mysqlDateFormat(groupBy?: string): string {
  switch (groupBy) {
    case 'week':    return '%Y-%u';
    case 'month':   return '%Y-%m';
    case 'quarter': return '%Y-Q%q';
    case 'year':    return '%Y';
    default:        return '%Y-%m-%d';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Executive Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default class ReportsRepository {

  async getDashboardSalesSummary() {
    const now = new Date();
    const todayStart  = startOf('day', now);
    const weekStart   = startOf('week', now);
    const monthStart  = startOf('month', now);
    const yearStart   = startOf('year', now);

    const yesterday   = new Date(todayStart); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(todayStart); yesterdayEnd.setMilliseconds(-1);

    const prevWeekStart  = new Date(weekStart);  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevMonthStart = new Date(monthStart); prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

    const deliveredWhere = { orderStatus: 'DELIVERED' };

    const [today, yest, week, month, year, prevWeek, prevMonth] = await Promise.all([
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: todayStart } } }),
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: yesterday, lte: yesterdayEnd } } }),
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: weekStart } } }),
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: monthStart } } }),
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: yearStart } } }),
      db.order.aggregate({ _sum: { grandTotal: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: prevWeekStart, lt: weekStart } } }),
      db.order.aggregate({ _sum: { grandTotal: true }, _count: { id: true }, where: { ...deliveredWhere, createdAt: { gte: prevMonthStart, lt: monthStart } } }),
    ]);

    const toNum = (v: any) => Number(v ?? 0);

    const dailyGrowth = yest._sum.grandTotal
      ? ((toNum(today._sum.grandTotal) - toNum(yest._sum.grandTotal)) / toNum(yest._sum.grandTotal)) * 100
      : 0;
    const weeklyGrowth = prevWeek._sum.grandTotal
      ? ((toNum(week._sum.grandTotal) - toNum(prevWeek._sum.grandTotal)) / toNum(prevWeek._sum.grandTotal)) * 100
      : 0;
    const monthlyGrowth = prevMonth._sum.grandTotal
      ? ((toNum(month._sum.grandTotal) - toNum(prevMonth._sum.grandTotal)) / toNum(prevMonth._sum.grandTotal)) * 100
      : 0;

    return {
      today:     { revenue: toNum(today._sum.grandTotal),  orders: today._count.id,  profit: toNum(today._sum.profit) },
      yesterday: { revenue: toNum(yest._sum.grandTotal),   orders: yest._count.id,   profit: toNum(yest._sum.profit) },
      thisWeek:  { revenue: toNum(week._sum.grandTotal),   orders: week._count.id,   profit: toNum(week._sum.profit) },
      thisMonth: { revenue: toNum(month._sum.grandTotal),  orders: month._count.id,  profit: toNum(month._sum.profit) },
      thisYear:  { revenue: toNum(year._sum.grandTotal),   orders: year._count.id,   profit: toNum(year._sum.profit) },
      growth: { dailyGrowth, weeklyGrowth, monthlyGrowth },
    };
  }

  async getDashboardOrderSummary() {
    const statuses = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','DELIVERED','CANCELLED','RETURNED','REFUNDED'];
    const counts = await db.order.groupBy({ by: ['orderStatus'], _count: { id: true } });
    const map: Record<string, number> = {};
    counts.forEach((c: any) => { map[c.orderStatus] = c._count.id; });
    const result: Record<string, number> = { total: 0 };
    let total = 0;
    statuses.forEach(s => { result[s.toLowerCase()] = map[s] ?? 0; total += map[s] ?? 0; });
    result.total = total;
    return result;
  }

  async getDashboardInventorySummary() {
    const [totalProducts, activeProducts, lowStockRaw, outOfStockRaw] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { status: 'ACTIVE' } }),
      prisma.$queryRawUnsafe<Array<{ cnt: number }>>(`
        SELECT COUNT(*) as cnt FROM inventory
        WHERE availableStock > 0 AND availableStock <= reorderLevel
      `),
      db.inventory.count({ where: { availableStock: 0 } }),
    ]);

    const stockValueRaw = await prisma.$queryRawUnsafe<Array<{ total: string }>>(`
      SELECT COALESCE(SUM(i.availableStock * COALESCE(p.costPrice, 0)), 0) as total
      FROM inventory i
      INNER JOIN \`product\` p ON p.id = i.productId
    `);

    return {
      totalProducts,
      activeProducts,
      lowStock: Number(lowStockRaw[0]?.cnt ?? 0),
      outOfStock: outOfStockRaw,
      totalStockValue: Number(stockValueRaw[0]?.total ?? 0),
    };
  }

  async getTopSellingCategories(limit = 5, filter: ReportFilter = {}) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;

    const rows = await prisma.$queryRawUnsafe<Array<{ id: number; name: string; quantity: bigint; revenue: string }>>(
      `SELECT c.id, c.name, SUM(oi.quantity) as quantity, SUM(oi.netAmount) as revenue
       FROM order_item oi
       INNER JOIN \`order\` o ON o.id = oi.orderId
       INNER JOIN product p ON p.id = oi.productId
       INNER JOIN category c ON c.id = p.categoryId
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY c.id, c.name
       ORDER BY revenue DESC
       LIMIT ${limit}`
    );

    return rows.map(r => ({ id: r.id, name: r.name, quantity: Number(r.quantity), revenue: Number(r.revenue) }));
  }

  async getTopSellingProducts(limit = 10, filter: ReportFilter = {}) {
    const range = dateRange(filter);
    const rows = await prisma.$queryRawUnsafe<Array<{ id: number; productName: string; sku: string; quantity: bigint; revenue: string }>>(
      `SELECT p.id, p.productName, p.sku, SUM(oi.quantity) as quantity, SUM(oi.netAmount) as revenue
       FROM order_item oi
       INNER JOIN \`order\` o ON o.id = oi.orderId
       INNER JOIN product p ON p.id = oi.productId
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY p.id, p.productName, p.sku
       ORDER BY revenue DESC
       LIMIT ${limit}`
    );

    return rows.map(r => ({ id: r.id, name: r.productName, sku: r.sku, quantity: Number(r.quantity), revenue: Number(r.revenue) }));
  }

  async getTopCustomers(limit = 10, filter: ReportFilter = {}) {
    const range = dateRange(filter);
    const rows = await prisma.$queryRawUnsafe<Array<{ id: number; customerCode: string; firstName: string; lastName: string; email: string; totalOrders: bigint; totalRevenue: string; lastOrderDate: Date | null }>>(
      `SELECT c.id, c.customerCode, c.firstName, c.lastName, c.email,
              COUNT(o.id) as totalOrders, SUM(o.grandTotal) as totalRevenue, MAX(o.createdAt) as lastOrderDate
       FROM \`order\` o
       INNER JOIN customer c ON c.id = o.customerId
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY c.id, c.customerCode, c.firstName, c.lastName, c.email
       ORDER BY totalRevenue DESC
       LIMIT ${limit}`
    );

    return rows.map(r => ({
      id: r.id, customerCode: r.customerCode,
      name: `${r.firstName} ${r.lastName}`, email: r.email,
      totalOrders: Number(r.totalOrders), totalRevenue: Number(r.totalRevenue),
      lastOrderDate: r.lastOrderDate,
    }));
  }

  async getRecentOrders(limit = 10) {
    const orders = await db.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { firstName: true, lastName: true } } },
    });

    return orders.map((o: any) => ({
      id: o.id, orderNumber: o.orderNumber,
      customerName: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : 'Guest',
      grandTotal: Number(o.grandTotal),
      orderStatus: o.orderStatus, paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sales Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getSalesReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const fmt = mysqlDateFormat(filter.groupBy);

    const rows = await prisma.$queryRawUnsafe<Array<{
      period: string; revenue: string; orders: bigint;
      quantity: bigint; discount: string; tax: string; profit: string;
    }>>(
      `SELECT DATE_FORMAT(o.createdAt, '${fmt}') as period,
              SUM(o.grandTotal) as revenue,
              COUNT(o.id) as orders,
              SUM(oi.quantity) as quantity,
              SUM(o.discountAmount + o.couponDiscount) as discount,
              SUM(o.taxAmount) as tax,
              SUM(oi.profit) as profit
       FROM \`order\` o
       INNER JOIN order_item oi ON oi.orderId = o.id
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       ${filter.categoryId ? `AND p.categoryId = ${filter.categoryId}` : ''}
       ${filter.state ? `AND sa.state = '${filter.state.replace(/'/g, "\\'")}'` : ''}
       GROUP BY period
       ORDER BY period ASC`
    );

    return rows.map(r => ({
      period: r.period,
      revenue: Number(r.revenue),
      orders: Number(r.orders),
      quantity: Number(r.quantity),
      discount: Number(r.discount),
      tax: Number(r.tax),
      profit: Number(r.profit),
      avgOrderValue: Number(r.orders) > 0 ? Number(r.revenue) / Number(r.orders) : 0,
    }));
  }

  async getSalesByCategory(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{ id: number; name: string; revenue: string; orders: bigint; quantity: bigint }>>(
      `SELECT c.id, c.name, SUM(o.grandTotal) as revenue, COUNT(DISTINCT o.id) as orders, SUM(oi.quantity) as quantity
       FROM \`order\` o
       INNER JOIN order_item oi ON oi.orderId = o.id
       INNER JOIN product p ON p.id = oi.productId
       INNER JOIN category c ON c.id = p.categoryId
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY c.id, c.name ORDER BY revenue DESC`
    );
  }

  async getSalesByBrand(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{ id: number; name: string; revenue: string; orders: bigint; quantity: bigint }>>(
      `SELECT b.id, b.name, SUM(o.grandTotal) as revenue, COUNT(DISTINCT o.id) as orders, SUM(oi.quantity) as quantity
       FROM \`order\` o
       INNER JOIN order_item oi ON oi.orderId = o.id
       INNER JOIN product p ON p.id = oi.productId
       INNER JOIN brand b ON b.id = p.brandId
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY b.id, b.name ORDER BY revenue DESC`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Order Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getOrderReport(filter: ReportFilter) {
    const { page, pageSize, skip } = paged(filter);
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};

    if (range.gte || range.lte) where.createdAt = range;
    if (filter.orderStatus)   where.orderStatus = filter.orderStatus;
    if (filter.paymentMethod) where.paymentMethod = filter.paymentMethod;

    const [items, total] = await Promise.all([
      db.order.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { firstName: true, lastName: true } },
          shippingAddress: { select: { city: true, state: true } },
        },
      }),
      db.order.count({ where }),
    ]);

    return {
      items: items.map((o: any) => ({
        id: o.id, orderNumber: o.orderNumber,
        customerName: o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : 'Guest',
        orderDate: o.orderDate, orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus, fulfillmentStatus: o.fulfillmentStatus,
        grandTotal: Number(o.grandTotal), shippingCharge: Number(o.shippingCharge),
        taxAmount: Number(o.taxAmount), discountAmount: Number(o.discountAmount),
        couponDiscount: Number(o.couponDiscount),
        city: o.shippingAddress?.city, state: o.shippingAddress?.state,
      })),
      ...buildPagination(page, pageSize, total),
    };
  }

  async getOrderStatusSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;

    const [groups, totals] = await Promise.all([
      db.order.groupBy({
        by: ['orderStatus'],
        _count: { id: true },
        _sum: { grandTotal: true },
        where,
      }),
      db.order.aggregate({ _count: { id: true }, where }),
    ]);

    const total = totals._count.id || 1;
    return groups.map((g: any) => ({
      status: g.orderStatus,
      count: g._count.id,
      revenue: Number(g._sum.grandTotal ?? 0),
      percentage: Math.round((g._count.id / total) * 100 * 10) / 10,
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Product Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getProductSalesReport(filter: ReportFilter) {
    const { page, pageSize, skip } = paged(filter);
    const range = dateRange(filter);
    const sortBy = ['revenue', 'quantity', 'margin', 'profit'].includes(filter.sortBy ?? '') ? filter.sortBy : 'revenue';
    const sortOrder = filter.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const rows = await prisma.$queryRawUnsafe<Array<{
      id: number; productCode: string; productName: string; sku: string;
      category: string | null; brand: string | null;
      quantitySold: bigint; revenue: string; profit: string; margin: string;
      currentStock: bigint;
    }>>(
      `SELECT p.id, p.productCode, p.productName, p.sku,
              c.name as category, b.name as brand,
              COALESCE(SUM(oi.quantity), 0) as quantitySold,
              COALESCE(SUM(oi.netAmount), 0) as revenue,
              COALESCE(SUM(oi.profit), 0) as profit,
              CASE WHEN SUM(oi.netAmount) > 0
                   THEN (SUM(oi.profit) / SUM(oi.netAmount)) * 100
                   ELSE 0 END as margin,
              COALESCE(SUM(inv.availableStock), 0) as currentStock
       FROM product p
       LEFT JOIN category c ON c.id = p.categoryId
       LEFT JOIN brand b ON b.id = p.brandId
       LEFT JOIN order_item oi ON oi.productId = p.id
       LEFT JOIN \`order\` o ON o.id = oi.orderId AND o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       LEFT JOIN inventory inv ON inv.productId = p.id
       WHERE 1=1
       ${filter.categoryId ? `AND p.categoryId = ${filter.categoryId}` : ''}
       ${filter.brandId ? `AND p.brandId = ${filter.brandId}` : ''}
       GROUP BY p.id, p.productCode, p.productName, p.sku, c.name, b.name
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT ${pageSize} OFFSET ${skip}`
    );

    const countResult = await prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(
      `SELECT COUNT(DISTINCT p.id) as cnt FROM product p
       ${filter.categoryId ? `WHERE p.categoryId = ${filter.categoryId}` : ''}
       ${filter.brandId ? (filter.categoryId ? `AND p.brandId = ${filter.brandId}` : `WHERE p.brandId = ${filter.brandId}`) : ''}`
    );

    const total = Number(countResult[0]?.cnt ?? 0);

    return {
      items: rows.map((r, idx) => ({
        id: r.id, productCode: r.productCode, productName: r.productName, sku: r.sku,
        category: r.category, brand: r.brand,
        quantitySold: Number(r.quantitySold), revenue: Number(r.revenue),
        profit: Number(r.profit), margin: Number(r.margin),
        currentStock: Number(r.currentStock), rank: skip + idx + 1,
      })),
      ...buildPagination(page, pageSize, total),
    };
  }

  async getLowStockProducts(filter: ReportFilter) {
    const warehouseFilter = filter.warehouseId ? `AND inv.warehouseId = ${filter.warehouseId}` : '';
    return prisma.$queryRawUnsafe<Array<{
      productId: number; productName: string; sku: string;
      availableStock: bigint; reorderLevel: bigint; warehouseName: string;
    }>>(
      `SELECT p.id as productId, p.productName, p.sku,
              inv.availableStock, inv.reorderLevel, w.warehouseName
       FROM inventory inv
       INNER JOIN product p ON p.id = inv.productId
       INNER JOIN warehouse w ON w.id = inv.warehouseId
       WHERE inv.availableStock <= inv.reorderLevel AND inv.availableStock > 0
       ${warehouseFilter}
       ORDER BY inv.availableStock ASC
       LIMIT ${filter.limit ?? 100}`
    );
  }

  async getOutOfStockProducts(filter: ReportFilter) {
    const warehouseFilter = filter.warehouseId ? `AND inv.warehouseId = ${filter.warehouseId}` : '';
    return prisma.$queryRawUnsafe<Array<{
      productId: number; productName: string; sku: string;
      warehouseName: string; lastMovementDate: Date | null;
    }>>(
      `SELECT p.id as productId, p.productName, p.sku,
              w.warehouseName, MAX(sm.createdAt) as lastMovementDate
       FROM inventory inv
       INNER JOIN product p ON p.id = inv.productId
       INNER JOIN warehouse w ON w.id = inv.warehouseId
       LEFT JOIN stock_movement sm ON sm.productId = p.id AND sm.warehouseId = w.id
       WHERE inv.availableStock = 0
       ${warehouseFilter}
       GROUP BY p.id, p.productName, p.sku, w.warehouseName
       ORDER BY p.productName ASC
       LIMIT ${filter.limit ?? 100}`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Inventory Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getStockLedger(productId: number, filter: ReportFilter) {
    const range = dateRange(filter);
    const { page, pageSize, skip } = paged(filter);
    const warehouseFilter = filter.warehouseId ? `AND sm.warehouseId = ${filter.warehouseId}` : '';

    const [items, total] = await Promise.all([
      prisma.$queryRawUnsafe<Array<{
        date: Date; movementType: string; quantity: number;
        reference: string | null; warehouseName: string; remarks: string | null;
      }>>(
        `SELECT sm.date, sm.movementType, sm.quantity, sm.referenceNumber as reference,
                w.warehouseName, sm.remarks
         FROM stock_movement sm
         INNER JOIN warehouse w ON w.id = sm.warehouseId
         WHERE sm.productId = ${productId}
         ${warehouseFilter}
         ${range.gte ? `AND sm.date >= '${range.gte.toISOString()}'` : ''}
         ${range.lte ? `AND sm.date <= '${range.lte.toISOString()}'` : ''}
         ORDER BY sm.date DESC
         LIMIT ${pageSize} OFFSET ${skip}`
      ),
      prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(
        `SELECT COUNT(*) as cnt FROM stock_movement sm
         WHERE sm.productId = ${productId}
         ${warehouseFilter}
         ${range.gte ? `AND sm.date >= '${range.gte.toISOString()}'` : ''}
         ${range.lte ? `AND sm.date <= '${range.lte.toISOString()}'` : ''}`
      ),
    ]);

    return { items, ...buildPagination(page, pageSize, Number(total[0]?.cnt ?? 0)) };
  }

  async getWarehouseStockSummary(filter: ReportFilter) {
    const warehouseFilter = filter.warehouseId ? `AND inv.warehouseId = ${filter.warehouseId}` : '';
    return prisma.$queryRawUnsafe<Array<{
      warehouseId: number; warehouseName: string;
      productId: number; productName: string; sku: string;
      currentStock: bigint; reservedStock: bigint; availableStock: bigint; reorderLevel: bigint; status: string;
    }>>(
      `SELECT w.id as warehouseId, w.warehouseName,
              p.id as productId, p.productName, p.sku,
              inv.currentStock, inv.reservedStock, inv.availableStock, inv.reorderLevel, inv.status
       FROM inventory inv
       INNER JOIN warehouse w ON w.id = inv.warehouseId
       INNER JOIN product p ON p.id = inv.productId
       WHERE 1=1 ${warehouseFilter}
       ORDER BY w.warehouseName, p.productName
       LIMIT ${filter.limit ?? 500}`
    );
  }

  async getStockMovementSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    return db.stockMovement.groupBy({
      by: ['movementType'],
      _count: { id: true },
      _sum: { quantity: true },
      where: {
        ...(range.gte || range.lte ? { date: range } : {}),
        ...(filter.warehouseId ? { warehouseId: filter.warehouseId } : {}),
      },
      orderBy: { _count: { id: 'desc' } },
    });
  }

  async getGRNReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.receivedDate = range;
    if (filter.warehouseId) where.warehouseId = filter.warehouseId;
    if (filter.supplierId) where.purchaseOrder = { supplierId: filter.supplierId };

    const { page, pageSize, skip } = paged(filter);
    const [items, total] = await Promise.all([
      db.goodsReceiptNote.findMany({
        where, skip, take: pageSize,
        orderBy: { receivedDate: 'desc' },
        include: {
          warehouse: { select: { warehouseName: true } },
          purchaseOrder: { include: { supplier: { select: { supplierName: true } } } },
        },
      }),
      db.goodsReceiptNote.count({ where }),
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async getSupplierPerformance(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{
      supplierId: number; supplierName: string;
      totalPOs: bigint; completedPOs: bigint;
      totalAmount: string; pendingPOs: bigint;
    }>>(
      `SELECT s.id as supplierId, s.supplierName,
              COUNT(po.id) as totalPOs,
              SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedPOs,
              COALESCE(SUM(po.netAmount), 0) as totalAmount,
              SUM(CASE WHEN po.status IN ('PENDING','APPROVED','PARTIAL') THEN 1 ELSE 0 END) as pendingPOs
       FROM supplier s
       LEFT JOIN purchase_order po ON po.supplierId = s.id
       ${range.gte ? `AND po.orderDate >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND po.orderDate <= '${range.lte.toISOString()}'` : ''}
       GROUP BY s.id, s.supplierName
       ORDER BY totalAmount DESC`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Customer Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getCustomerReport(filter: ReportFilter) {
    const { page, pageSize, skip } = paged(filter);
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;
    if (filter.customerGroupId) where.customerGroupId = filter.customerGroupId;

    const sortBy = ['totalSpend','totalOrders','registeredAt','lastOrderDate'].includes(filter.sortBy ?? '') ? filter.sortBy : 'totalSpend';

    const rows = await prisma.$queryRawUnsafe<Array<{
      id: number; customerCode: string; firstName: string; lastName: string;
      email: string; mobile: string | null; walletBalance: string; loyaltyPoints: number;
      totalOrders: bigint; totalSpend: string; lastOrderDate: Date | null;
      registeredAt: Date; status: string;
    }>>(
      `SELECT c.id, c.customerCode, c.firstName, c.lastName, c.email, c.mobile,
              c.walletBalance, c.loyaltyPoints, c.createdAt as registeredAt, c.status,
              COUNT(o.id) as totalOrders,
              COALESCE(SUM(o.grandTotal), 0) as totalSpend,
              MAX(o.createdAt) as lastOrderDate
       FROM customer c
       LEFT JOIN \`order\` o ON o.customerId = c.id AND o.orderStatus NOT IN ('CANCELLED','FAILED')
       WHERE 1=1
       ${range.gte ? `AND c.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND c.createdAt <= '${range.lte.toISOString()}'` : ''}
       ${filter.customerGroupId ? `AND c.customerGroupId = ${filter.customerGroupId}` : ''}
       GROUP BY c.id
       ORDER BY ${sortBy} ${filter.sortOrder === 'asc' ? 'ASC' : 'DESC'}
       LIMIT ${pageSize} OFFSET ${skip}`
    );

    const countResult = await db.customer.count({ where });

    return {
      items: rows.map(r => ({
        id: r.id, customerCode: r.customerCode,
        firstName: r.firstName, lastName: r.lastName,
        email: r.email, mobile: r.mobile,
        totalOrders: Number(r.totalOrders), totalSpend: Number(r.totalSpend),
        walletBalance: Number(r.walletBalance), loyaltyPoints: r.loyaltyPoints,
        lastOrderDate: r.lastOrderDate, registeredAt: r.registeredAt, status: r.status,
        segment: Number(r.totalSpend) > 50000 ? 'VIP' : Number(r.totalOrders) > 5 ? 'Repeat' : Number(r.totalOrders) > 0 ? 'Active' : 'New',
      })),
      ...buildPagination(page, pageSize, countResult),
    };
  }

  async getCustomerGrowth(filter: ReportFilter) {
    const range = dateRange(filter);
    const fmt = mysqlDateFormat(filter.groupBy);
    return prisma.$queryRawUnsafe<Array<{ period: string; newCustomers: bigint }>>(
      `SELECT DATE_FORMAT(createdAt, '${fmt}') as period, COUNT(id) as newCustomers
       FROM customer
       WHERE 1=1
       ${range.gte ? `AND createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY period ORDER BY period ASC`
    );
  }

  async getCustomerCLV(limit = 50) {
    return prisma.$queryRawUnsafe<Array<{
      customerId: number; customerName: string;
      avgOrderValue: string; purchaseFrequency: string; clv: string;
    }>>(
      `SELECT c.id as customerId, CONCAT(c.firstName, ' ', c.lastName) as customerName,
              AVG(o.grandTotal) as avgOrderValue,
              COUNT(o.id) as purchaseFrequency,
              AVG(o.grandTotal) * COUNT(o.id) as clv
       FROM customer c
       INNER JOIN \`order\` o ON o.customerId = c.id
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       GROUP BY c.id, customerName
       ORDER BY clv DESC
       LIMIT ${limit}`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Finance Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getFinanceReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const fmt = mysqlDateFormat(filter.groupBy);
    return prisma.$queryRawUnsafe<Array<{
      period: string; revenue: string; costOfGoods: string;
      taxCollected: string; totalOrders: bigint;
    }>>(
      `SELECT DATE_FORMAT(o.createdAt, '${fmt}') as period,
              SUM(o.grandTotal) as revenue,
              SUM(oi.costPrice * oi.quantity) as costOfGoods,
              SUM(o.taxAmount) as taxCollected,
              COUNT(DISTINCT o.id) as totalOrders
       FROM \`order\` o
       INNER JOIN order_item oi ON oi.orderId = o.id
       WHERE o.orderStatus NOT IN ('CANCELLED','FAILED')
       ${range.gte ? `AND o.createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND o.createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY period ORDER BY period ASC`
    );
  }

  async getPaymentCollectionSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = { status: 'PAID' };
    if (range.gte || range.lte) where.paidAt = range;

    const [rows, total] = await Promise.all([
      db.payment.groupBy({
        by: ['paymentMethod'],
        _count: { id: true },
        _sum: { capturedAmount: true },
        where,
      }),
      db.payment.aggregate({ _sum: { capturedAmount: true }, where }),
    ]);

    const totalAmount = Number(total._sum.capturedAmount ?? 1);
    return rows.map((r: any) => ({
      method: r.paymentMethod,
      count: r._count.id,
      amount: Number(r._sum.capturedAmount ?? 0),
      percentage: Math.round((Number(r._sum.capturedAmount ?? 0) / totalAmount) * 100 * 10) / 10,
    }));
  }

  async getSettlementReport(filter: ReportFilter) {
    const range = dateRange(filter);
    return db.paymentSettlement.groupBy({
      by: ['gateway'],
      _count: { id: true },
      _sum: { grossAmount: true, charges: true, taxes: true, netAmount: true },
      where: range.gte || range.lte ? { settlementDate: range } : undefined,
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GST / Tax Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getGSTReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const { page, pageSize, skip } = paged(filter);

    const [items, total] = await Promise.all([
      prisma.$queryRawUnsafe<Array<{
        invoiceNumber: string; invoiceDate: Date; orderNumber: string;
        taxableAmount: string; cgst: string; sgst: string; igst: string;
        totalTax: string; totalAmount: string;
      }>>(
        `SELECT inv.invoiceNumber, inv.invoiceDate, o.orderNumber,
                o.grandTotal - o.taxAmount as taxableAmount,
                inv.cgst, inv.sgst, inv.igst,
                inv.gstAmount as totalTax,
                o.grandTotal as totalAmount
         FROM invoice inv
         INNER JOIN \`order\` o ON o.id = inv.orderId
         WHERE inv.invoiceStatus = 'PAID'
         ${range.gte ? `AND inv.invoiceDate >= '${range.gte.toISOString()}'` : ''}
         ${range.lte ? `AND inv.invoiceDate <= '${range.lte.toISOString()}'` : ''}
         ORDER BY inv.invoiceDate DESC
         LIMIT ${pageSize} OFFSET ${skip}`
      ),
      prisma.$queryRawUnsafe<Array<{ cnt: bigint }>>(
        `SELECT COUNT(*) as cnt FROM invoice WHERE invoiceStatus = 'PAID'
         ${range.gte ? `AND invoiceDate >= '${range.gte.toISOString()}'` : ''}
         ${range.lte ? `AND invoiceDate <= '${range.lte.toISOString()}'` : ''}`
      ),
    ]);

    return { items, ...buildPagination(page, pageSize, Number(total[0]?.cnt ?? 0)) };
  }

  async getGSTSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    const result = await prisma.$queryRawUnsafe<Array<{
      totalTaxableAmount: string; totalCGST: string;
      totalSGST: string; totalIGST: string; totalTax: string;
    }>>(
      `SELECT
         SUM(o.grandTotal - o.taxAmount) as totalTaxableAmount,
         SUM(inv.cgst) as totalCGST,
         SUM(inv.sgst) as totalSGST,
         SUM(inv.igst) as totalIGST,
         SUM(inv.gstAmount) as totalTax
       FROM invoice inv
       INNER JOIN \`order\` o ON o.id = inv.orderId
       WHERE inv.invoiceStatus = 'PAID'
       ${range.gte ? `AND inv.invoiceDate >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND inv.invoiceDate <= '${range.lte.toISOString()}'` : ''}`
    );

    return result[0] ?? { totalTaxableAmount: '0', totalCGST: '0', totalSGST: '0', totalIGST: '0', totalTax: '0' };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Marketing Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getCampaignPerformance(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.startDate = range;
    if (filter.campaignId) where.id = filter.campaignId;

    return db.campaign.findMany({
      where,
      include: {
        analytics: {
          select: { impressions: true, clicks: true, conversions: true, revenue: true, ctr: true, conversionRate: true, roi: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit ?? 50,
    });
  }

  async getCouponPerformance(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{
      id: number; couponCode: string; title: string;
      usageCount: bigint; usageLimit: number | null; totalDiscount: string; ordersGenerated: bigint;
    }>>(
      `SELECT c.id, c.couponCode, c.title,
              COUNT(cu.id) as usageCount, c.usageLimit,
              COALESCE(SUM(cu.discountAmount), 0) as totalDiscount,
              COUNT(DISTINCT cu.orderId) as ordersGenerated
       FROM coupon c
       LEFT JOIN coupon_usage cu ON cu.couponId = c.id
       ${range.gte ? `AND cu.usedAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND cu.usedAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY c.id, c.couponCode, c.title, c.usageLimit
       ORDER BY usageCount DESC
       LIMIT ${filter.limit ?? 50}`
    );
  }

  async getAbandonedCartSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;

    const [total, recovered] = await Promise.all([
      db.abandonedCartRecovery.count({ where }),
      db.abandonedCartRecovery.count({ where: { ...where, recoveryStatus: 'RECOVERED' } }),
    ]);

    return { total, recovered, recoveryRate: total > 0 ? Math.round((recovered / total) * 100 * 10) / 10 : 0 };
  }

  async getNewsletterStats(filter: ReportFilter) {
    const range = dateRange(filter);
    const [total, active, unsubscribed] = await Promise.all([
      db.newsletterSubscriber.count(),
      db.newsletterSubscriber.count({ where: { status: 'ACTIVE' } }),
      db.newsletterSubscriber.count({ where: { status: 'UNSUBSCRIBED' } }),
    ]);

    const newSubscribers = range.gte || range.lte
      ? await db.newsletterSubscriber.count({ where: { subscribedAt: range } })
      : 0;

    return { total, active, unsubscribed, newSubscribers };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Payment Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getGatewayPerformance(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{
      gateway: string; totalTransactions: bigint; successful: bigint; failed: bigint;
      totalAmount: string; capturedAmount: string; refundedAmount: string;
    }>>(
      `SELECT gateway,
              COUNT(id) as totalTransactions,
              SUM(CASE WHEN status = 'PAID' THEN 1 ELSE 0 END) as successful,
              SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed,
              COALESCE(SUM(amount), 0) as totalAmount,
              COALESCE(SUM(capturedAmount), 0) as capturedAmount,
              COALESCE(SUM(refundedAmount), 0) as refundedAmount
       FROM payment
       WHERE 1=1
       ${range.gte ? `AND createdAt >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND createdAt <= '${range.lte.toISOString()}'` : ''}
       GROUP BY gateway ORDER BY totalAmount DESC`
    );
  }

  async getRefundReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;
    const { page, pageSize, skip } = paged(filter);

    const [items, total] = await Promise.all([
      db.refund.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { order: { select: { orderNumber: true } } },
      }),
      db.refund.count({ where }),
    ]);

    return {
      items: items.map((r: any) => ({
        id: r.id, refundNumber: r.refundNumber,
        orderNumber: r.order?.orderNumber ?? '',
        refundMode: r.refundMode, refundAmount: Number(r.refundAmount),
        refundStatus: r.refundStatus, refundDate: r.refundDate, createdAt: r.createdAt,
      })),
      ...buildPagination(page, pageSize, total),
    };
  }

  async getReconciliationSummary(filter: ReportFilter) {
    return db.paymentReconciliation.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { differenceAmount: true },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Return Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getReturnReport(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.requestedDate = range;
    if (filter.orderStatus) where.status = filter.orderStatus;
    const { page, pageSize, skip } = paged(filter);

    const [items, total] = await Promise.all([
      db.returnRequest.findMany({
        where, skip, take: pageSize,
        orderBy: { requestedDate: 'desc' },
        include: {
          order: { select: { orderNumber: true } },
          items: { select: { id: true } },
        },
      }),
      db.returnRequest.count({ where }),
    ]);

    return {
      items: items.map((r: any) => ({
        id: r.id, returnNumber: r.returnNumber,
        orderNumber: r.order?.orderNumber ?? '',
        reason: r.reason, status: r.status,
        itemCount: r.items?.length ?? 0,
        requestedDate: r.requestedDate,
      })),
      ...buildPagination(page, pageSize, total),
    };
  }

  async getReturnRateSummary(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;

    const [totalOrders, returnedOrders, totalRefunds, refundTotal] = await Promise.all([
      db.order.count({ where }),
      db.order.count({ where: { ...where, orderStatus: 'RETURNED' } }),
      db.refund.count({ where: range.gte || range.lte ? { createdAt: range } : {} }),
      db.refund.aggregate({ _sum: { refundAmount: true }, where: range.gte || range.lte ? { createdAt: range } : {} }),
    ]);

    return {
      totalOrders, returnedOrders,
      returnRate: totalOrders > 0 ? Math.round((returnedOrders / totalOrders) * 100 * 100) / 100 : 0,
      totalRefunds, totalRefundAmount: Number(refundTotal._sum.refundAmount ?? 0),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Warehouse Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getWarehouseReport() {
    return prisma.$queryRawUnsafe<Array<{
      warehouseId: number; warehouseName: string; city: string | null; state: string | null;
      totalProducts: bigint; totalStock: bigint; reservedStock: bigint;
      availableStock: bigint; lowStockItems: bigint; outOfStockItems: bigint;
    }>>(
      `SELECT w.id as warehouseId, w.warehouseName, w.city, w.state,
              COUNT(inv.id) as totalProducts,
              COALESCE(SUM(inv.currentStock), 0) as totalStock,
              COALESCE(SUM(inv.reservedStock), 0) as reservedStock,
              COALESCE(SUM(inv.availableStock), 0) as availableStock,
              SUM(CASE WHEN inv.availableStock > 0 AND inv.availableStock <= inv.reorderLevel THEN 1 ELSE 0 END) as lowStockItems,
              SUM(CASE WHEN inv.availableStock = 0 THEN 1 ELSE 0 END) as outOfStockItems
       FROM warehouse w
       LEFT JOIN inventory inv ON inv.warehouseId = w.id
       GROUP BY w.id, w.warehouseName, w.city, w.state
       ORDER BY w.warehouseName`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Supplier Reports
  // ─────────────────────────────────────────────────────────────────────────

  async getSupplierReport(filter: ReportFilter) {
    const range = dateRange(filter);
    return prisma.$queryRawUnsafe<Array<{
      supplierId: number; supplierCode: string; supplierName: string;
      totalPOs: bigint; totalAmount: string; completedPOs: bigint;
      pendingPOs: bigint; rejectedPOs: bigint;
    }>>(
      `SELECT s.id as supplierId, s.supplierCode, s.supplierName,
              COUNT(po.id) as totalPOs,
              COALESCE(SUM(po.netAmount), 0) as totalAmount,
              SUM(CASE WHEN po.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedPOs,
              SUM(CASE WHEN po.status IN ('PENDING','APPROVED','PARTIAL') THEN 1 ELSE 0 END) as pendingPOs,
              SUM(CASE WHEN po.status = 'REJECTED' THEN 1 ELSE 0 END) as rejectedPOs
       FROM supplier s
       LEFT JOIN purchase_order po ON po.supplierId = s.id
       ${range.gte ? `AND po.orderDate >= '${range.gte.toISOString()}'` : ''}
       ${range.lte ? `AND po.orderDate <= '${range.lte.toISOString()}'` : ''}
       GROUP BY s.id, s.supplierCode, s.supplierName
       ORDER BY totalAmount DESC`
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BI – Revenue Trends & Forecasting
  // ─────────────────────────────────────────────────────────────────────────

  async getRevenueTrends(periods = 12) {
    return prisma.$queryRawUnsafe<Array<{ period: string; revenue: string; orders: bigint }>>(
      `SELECT DATE_FORMAT(createdAt, '%Y-%m') as period,
              SUM(grandTotal) as revenue,
              COUNT(id) as orders
       FROM \`order\`
       WHERE orderStatus NOT IN ('CANCELLED','FAILED')
         AND createdAt >= DATE_SUB(NOW(), INTERVAL ${periods} MONTH)
       GROUP BY period ORDER BY period ASC`
    );
  }

  async getSeasonalTrends() {
    return prisma.$queryRawUnsafe<Array<{ month: number; revenue: string; orders: bigint }>>(
      `SELECT MONTH(createdAt) as month, SUM(grandTotal) as revenue, COUNT(id) as orders
       FROM \`order\`
       WHERE orderStatus NOT IN ('CANCELLED','FAILED')
       GROUP BY month ORDER BY month ASC`
    );
  }

  async getABCAnalysisData() {
    return prisma.$queryRawUnsafe<Array<{
      productId: number; productName: string; sku: string; revenue: string;
    }>>(
      `SELECT p.id as productId, p.productName, p.sku,
              COALESCE(SUM(oi.netAmount), 0) as revenue
       FROM product p
       LEFT JOIN order_item oi ON oi.productId = p.id
       LEFT JOIN \`order\` o ON o.id = oi.orderId AND o.orderStatus NOT IN ('CANCELLED','FAILED')
       GROUP BY p.id, p.productName, p.sku
       ORDER BY revenue DESC`
    );
  }

  async getGrowthMetrics() {
    const now = new Date();
    const currentMonth  = startOf('month', now);
    const prevMonth     = new Date(currentMonth); prevMonth.setMonth(prevMonth.getMonth() - 1);
    const currentYear   = startOf('year', now);
    const prevYear      = new Date(currentYear); prevYear.setFullYear(prevYear.getFullYear() - 1);
    const nextYear      = new Date(currentYear); nextYear.setFullYear(nextYear.getFullYear() + 1);
    const prevYearEnd   = new Date(currentYear); prevYearEnd.setMilliseconds(-1);

    const [
      curMonthRevenue, prevMonthRevenue,
      curYearRevenue, prevYearRevenue,
      curMonthOrders, prevMonthOrders,
      curYearOrders, prevYearOrders,
      curMonthCustomers, prevMonthCustomers,
    ] = await Promise.all([
      db.order.aggregate({ _sum: { grandTotal: true }, where: { createdAt: { gte: currentMonth }, orderStatus: { notIn: ['CANCELLED','FAILED'] } } }),
      db.order.aggregate({ _sum: { grandTotal: true }, where: { createdAt: { gte: prevMonth, lt: currentMonth }, orderStatus: { notIn: ['CANCELLED','FAILED'] } } }),
      db.order.aggregate({ _sum: { grandTotal: true }, where: { createdAt: { gte: currentYear }, orderStatus: { notIn: ['CANCELLED','FAILED'] } } }),
      db.order.aggregate({ _sum: { grandTotal: true }, where: { createdAt: { gte: prevYear, lte: prevYearEnd }, orderStatus: { notIn: ['CANCELLED','FAILED'] } } }),
      db.order.count({ where: { createdAt: { gte: currentMonth } } }),
      db.order.count({ where: { createdAt: { gte: prevMonth, lt: currentMonth } } }),
      db.order.count({ where: { createdAt: { gte: currentYear } } }),
      db.order.count({ where: { createdAt: { gte: prevYear, lte: prevYearEnd } } }),
      db.customer.count({ where: { createdAt: { gte: currentMonth } } }),
      db.customer.count({ where: { createdAt: { gte: prevMonth, lt: currentMonth } } }),
    ]);

    const growth = (cur: number, prev: number) => prev > 0 ? Math.round(((cur - prev) / prev) * 100 * 100) / 100 : 0;
    const toNum = (v: any) => Number(v ?? 0);

    return {
      revenueGrowthMoM: growth(toNum(curMonthRevenue._sum.grandTotal), toNum(prevMonthRevenue._sum.grandTotal)),
      revenueGrowthYoY: growth(toNum(curYearRevenue._sum.grandTotal), toNum(prevYearRevenue._sum.grandTotal)),
      orderGrowthMoM: growth(curMonthOrders, prevMonthOrders),
      orderGrowthYoY: growth(curYearOrders, prevYearOrders),
      customerGrowthMoM: growth(curMonthCustomers, prevMonthCustomers),
      customerGrowthYoY: 0,
      newVsReturningCustomerRatio: 0,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // KPI Dashboard
  // ─────────────────────────────────────────────────────────────────────────

  async getKPIData(filter: ReportFilter) {
    const range = dateRange(filter);
    const monthStart = startOf('month');
    const prevMonthStart = new Date(monthStart); prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    const prevMonthEnd = new Date(monthStart); prevMonthEnd.setMilliseconds(-1);

    const curWhere: Record<string, unknown> = {
      orderStatus: { notIn: ['CANCELLED', 'FAILED'] },
      ...(range.gte || range.lte ? { createdAt: range } : { createdAt: { gte: monthStart } }),
    };
    const prevWhere = { orderStatus: { notIn: ['CANCELLED', 'FAILED'] }, createdAt: { gte: prevMonthStart, lte: prevMonthEnd } };

    const [cur, prev, curNew, prevNew, curReturned, prevReturned, curRefunded, prevRefunded] = await Promise.all([
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, _avg: { grandTotal: true }, where: curWhere }),
      db.order.aggregate({ _sum: { grandTotal: true, profit: true }, _count: { id: true }, _avg: { grandTotal: true }, where: prevWhere }),
      db.customer.count({ where: range.gte || range.lte ? { createdAt: range } : { createdAt: { gte: monthStart } } }),
      db.customer.count({ where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd } } }),
      db.order.count({ where: { ...curWhere, orderStatus: 'RETURNED' } }),
      db.order.count({ where: { ...prevWhere, orderStatus: 'RETURNED' } }),
      db.order.count({ where: { ...curWhere, orderStatus: 'REFUNDED' } }),
      db.order.count({ where: { ...prevWhere, orderStatus: 'REFUNDED' } }),
    ]);

    const toNum = (v: any) => Number(v ?? 0);

    const currentRevenue = toNum(cur._sum.grandTotal);
    const prevRevenue = toNum(prev._sum.grandTotal);
    const currentProfit = toNum(cur._sum.profit);
    const curOrders = cur._count.id;
    const prevOrders = prev._count.id;

    const growth = (c: number, p: number) => p > 0 ? Math.round(((c - p) / p) * 100 * 100) / 100 : 0;

    return {
      currentPeriod: {
        revenue: currentRevenue, orders: curOrders, newCustomers: curNew,
        returnedOrders: curReturned, refundedOrders: curRefunded,
        avgOrderValue: toNum(cur._avg.grandTotal), grossProfit: currentProfit,
      },
      previousPeriod: {
        revenue: prevRevenue, orders: prevOrders, newCustomers: prevNew,
        returnedOrders: prevReturned, refundedOrders: prevRefunded,
        avgOrderValue: toNum(prev._avg.grandTotal), grossProfit: toNum(prev._sum.profit),
      },
      revenueGrowth: growth(currentRevenue, prevRevenue),
      orderGrowth: growth(curOrders, prevOrders),
      conversionRate: 0,
      averageOrderValue: toNum(cur._avg.grandTotal),
      returnRate: curOrders > 0 ? Math.round((curReturned / curOrders) * 100 * 100) / 100 : 0,
      refundRate: curOrders > 0 ? Math.round((curRefunded / curOrders) * 100 * 100) / 100 : 0,
      grossMargin: currentRevenue > 0 ? Math.round((currentProfit / currentRevenue) * 100 * 100) / 100 : 0,
      netMargin: 0,
      customerAcquisitionCost: 0,
      customerLifetimeValue: 0,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Scheduled Reports
  // ─────────────────────────────────────────────────────────────────────────

  async createScheduledReport(data: Record<string, unknown>) {
    return db.scheduledReport.create({ data });
  }

  async findScheduledReportById(id: number) {
    return db.scheduledReport.findUnique({ where: { id } });
  }

  async findScheduledReportByCode(reportCode: string) {
    return db.scheduledReport.findUnique({ where: { reportCode } });
  }

  async listScheduledReports(query: ScheduledReportQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.frequency) where.frequency = query.frequency;
    if (query.reportType) where.reportType = query.reportType;

    const [items, total] = await Promise.all([
      db.scheduledReport.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.scheduledReport.count({ where }),
    ]);

    return { items, ...buildPagination(page, pageSize, total) };
  }

  async updateScheduledReport(id: number, data: Record<string, unknown>) {
    return db.scheduledReport.update({ where: { id }, data });
  }

  async deleteScheduledReport(id: number) {
    return db.scheduledReport.delete({ where: { id } });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Export Log
  // ─────────────────────────────────────────────────────────────────────────

  async createExportLog(data: Record<string, unknown>) {
    return db.reportExportLog.create({ data });
  }

  async updateExportLog(id: number, data: Record<string, unknown>) {
    return db.reportExportLog.update({ where: { id }, data });
  }

  async listExportLogs(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      db.reportExportLog.findMany({ skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.reportExportLog.count(),
    ]);
    return { items, ...buildPagination(page, pageSize, total) };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Audit
  // ─────────────────────────────────────────────────────────────────────────

  async getOrderAuditLogs(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;
    const { page, pageSize, skip } = paged(filter);
    const [items, total] = await Promise.all([
      db.orderAuditLog.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.orderAuditLog.count({ where }),
    ]);
    return { items: items.map((a: any) => ({ ...a, entity: 'Order' })), ...buildPagination(page, pageSize, total) };
  }

  async getPaymentAuditLogs(filter: ReportFilter) {
    const range = dateRange(filter);
    const where: Record<string, unknown> = {};
    if (range.gte || range.lte) where.createdAt = range;
    const { page, pageSize, skip } = paged(filter);
    const [items, total] = await Promise.all([
      db.paymentAuditLog.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      db.paymentAuditLog.count({ where }),
    ]);
    return { items: items.map((a: any) => ({ ...a, entity: 'Payment' })), ...buildPagination(page, pageSize, total) };
  }
}
