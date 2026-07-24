import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import ReportsRepository from '../repositories/reports.repository';
import {
  ReportFilter,
  ExportRequestDto,
  CreateScheduledReportDto,
  UpdateScheduledReportDto,
  ScheduledReportQuery,
  ABCAnalysisItem,
  RevenueTrendPoint,
  SeasonalTrendItem,
} from '../interfaces/reports.dto';

// ─── Simple in-memory cache with TTL ─────────────────────────────────────────

interface CacheEntry<T> { data: T; expiresAt: number; }

class ReportCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { this.store.delete(key); return null; }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  invalidate(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }
}

const cache = new ReportCache();

const CACHE_TTL = {
  DASHBOARD: 300,    // 5 min
  REPORTS:   900,    // 15 min
  BI:        1800,   // 30 min
};

function cacheKey(name: string, filter: ReportFilter = {}): string {
  return `${name}:${JSON.stringify(filter)}`;
}

// ─── Month names ─────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─────────────────────────────────────────────────────────────────────────────

export default class ReportsService {
  constructor(private readonly repo: ReportsRepository) {}

  // ─── Executive Dashboard ──────────────────────────────────────────────────

  async getExecutiveDashboard(filter: ReportFilter = {}) {
    const key = cacheKey('dashboard', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [salesSummary, orderSummary, inventorySummary, topCategories, topProducts, topCustomers, recentOrders] =
      await Promise.all([
        this.repo.getDashboardSalesSummary(),
        this.repo.getDashboardOrderSummary(),
        this.repo.getDashboardInventorySummary(),
        this.repo.getTopSellingCategories(5, filter),
        this.repo.getTopSellingProducts(10, filter),
        this.repo.getTopCustomers(10, filter),
        this.repo.getRecentOrders(10),
      ]);

    const result = {
      salesSummary,
      orderSummary,
      inventorySummary,
      topSellingCategories: topCategories,
      topSellingProducts: topProducts,
      topCustomers,
      recentOrders,
      generatedAt: new Date().toISOString(),
    };

    cache.set(key, result, CACHE_TTL.DASHBOARD);
    return result;
  }

  // ─── Sales ────────────────────────────────────────────────────────────────

  async getSalesReport(filter: ReportFilter) {
    const key = cacheKey('sales', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const items = await this.repo.getSalesReport(filter);

    const totals = items.reduce(
      (acc, row) => {
        acc.revenue += row.revenue;
        acc.orders += row.orders;
        acc.quantity += row.quantity;
        acc.discount += row.discount;
        acc.tax += row.tax;
        acc.profit += row.profit;
        return acc;
      },
      { revenue: 0, orders: 0, quantity: 0, discount: 0, tax: 0, profit: 0 }
    );

    const avgOrderValue = totals.orders > 0 ? totals.revenue / totals.orders : 0;

    const result = {
      items,
      totals: { ...totals, avgOrderValue },
      period: filter.groupBy ?? 'day',
      chart: {
        type: 'line' as const,
        labels: items.map(i => i.period),
        datasets: [
          { label: 'Revenue', data: items.map(i => i.revenue), borderColor: '#4CAF50' },
          { label: 'Orders',  data: items.map(i => i.orders),  borderColor: '#2196F3' },
          { label: 'Profit',  data: items.map(i => i.profit),  borderColor: '#FF9800' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getSalesByCategory(filter: ReportFilter) {
    const key = cacheKey('sales-category', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getSalesByCategory(filter);
    const items = rows.map((r: any) => ({
      id: r.id, name: r.name,
      revenue: Number(r.revenue), orders: Number(r.orders), quantity: Number(r.quantity),
    }));

    const result = {
      items,
      chart: {
        type: 'pie' as const,
        labels: items.map((i: any) => i.name),
        datasets: [{ label: 'Revenue', data: items.map((i: any) => i.revenue) }],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getSalesByBrand(filter: ReportFilter) {
    const key = cacheKey('sales-brand', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getSalesByBrand(filter);
    const items = rows.map((r: any) => ({
      id: r.id, name: r.name,
      revenue: Number(r.revenue), orders: Number(r.orders), quantity: Number(r.quantity),
    }));

    const result = {
      items,
      chart: {
        type: 'bar' as const,
        labels: items.map((i: any) => i.name),
        datasets: [{ label: 'Revenue', data: items.map((i: any) => i.revenue), borderColor: '#9C27B0' }],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Orders ───────────────────────────────────────────────────────────────

  async getOrderReport(filter: ReportFilter) {
    const key = cacheKey('orders', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [data, summary] = await Promise.all([
      this.repo.getOrderReport(filter),
      this.repo.getOrderStatusSummary(filter),
    ]);

    const result = {
      ...data,
      summary,
      chart: {
        type: 'donut' as const,
        labels: summary.map((s: any) => s.status),
        datasets: [{ label: 'Orders', data: summary.map((s: any) => s.count) }],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Products ─────────────────────────────────────────────────────────────

  async getProductReport(filter: ReportFilter) {
    const key = cacheKey('products', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const data = await this.repo.getProductSalesReport(filter);

    const result = {
      ...data,
      chart: {
        type: 'bar' as const,
        labels: data.items.slice(0, 10).map((i: any) => i.productName),
        datasets: [
          { label: 'Revenue',  data: data.items.slice(0, 10).map((i: any) => i.revenue),  borderColor: '#4CAF50' },
          { label: 'Quantity', data: data.items.slice(0, 10).map((i: any) => i.quantitySold), borderColor: '#2196F3' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getLowStockReport(filter: ReportFilter) {
    const rows = await this.repo.getLowStockProducts(filter);
    return rows.map((r: any) => ({
      productId: r.productId, productName: r.productName, sku: r.sku,
      availableStock: Number(r.availableStock), reorderLevel: Number(r.reorderLevel),
      warehouseName: r.warehouseName,
    }));
  }

  async getOutOfStockReport(filter: ReportFilter) {
    return this.repo.getOutOfStockProducts(filter);
  }

  // ─── Inventory ────────────────────────────────────────────────────────────

  async getStockLedger(productId: number, filter: ReportFilter) {
    if (!productId) throw new AppError('productId is required', HTTP_STATUS.BAD_REQUEST, 'PRODUCT_REQUIRED');
    return this.repo.getStockLedger(productId, filter);
  }

  async getWarehouseStock(filter: ReportFilter) {
    const key = cacheKey('warehouse-stock', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getWarehouseStockSummary(filter);
    const result = rows.map((r: any) => ({
      warehouseId: r.warehouseId, warehouseName: r.warehouseName,
      productId: r.productId, productName: r.productName, sku: r.sku,
      currentStock: Number(r.currentStock), reservedStock: Number(r.reservedStock),
      availableStock: Number(r.availableStock), reorderLevel: Number(r.reorderLevel),
      status: r.status,
    }));

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getStockMovementSummary(filter: ReportFilter) {
    return this.repo.getStockMovementSummary(filter);
  }

  async getGRNReport(filter: ReportFilter) {
    return this.repo.getGRNReport(filter);
  }

  async getSupplierPerformance(filter: ReportFilter) {
    const key = cacheKey('supplier-perf', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getSupplierPerformance(filter);
    const result = rows.map((r: any) => ({
      supplierId: r.supplierId, supplierName: r.supplierName,
      totalPOs: Number(r.totalPOs), completedPOs: Number(r.completedPOs),
      totalAmount: Number(r.totalAmount), pendingPOs: Number(r.pendingPOs),
      onTimeDeliveryRate: Number(r.totalPOs) > 0
        ? Math.round((Number(r.completedPOs) / Number(r.totalPOs)) * 100 * 10) / 10 : 0,
    }));

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Customer ─────────────────────────────────────────────────────────────

  async getCustomerReport(filter: ReportFilter) {
    const key = cacheKey('customers', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const data = await this.repo.getCustomerReport(filter);
    cache.set(key, data, CACHE_TTL.REPORTS);
    return data;
  }

  async getCustomerGrowth(filter: ReportFilter) {
    const key = cacheKey('customer-growth', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getCustomerGrowth(filter);
    let cumulative = 0;
    const items = rows.map((r: any) => {
      const newCustomers = Number(r.newCustomers);
      cumulative += newCustomers;
      return { period: r.period, newCustomers, activeCustomers: 0, cumulativeCustomers: cumulative };
    });

    const result = {
      items,
      chart: {
        type: 'area' as const,
        labels: items.map(i => i.period),
        datasets: [
          { label: 'New Customers',       data: items.map(i => i.newCustomers),        borderColor: '#4CAF50' },
          { label: 'Cumulative Customers', data: items.map(i => i.cumulativeCustomers), borderColor: '#2196F3' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getCustomerCLV(limit = 50) {
    const rows = await this.repo.getCustomerCLV(limit);
    return rows.map((r: any) => ({
      customerId: r.customerId, customerName: r.customerName,
      avgOrderValue: Number(r.avgOrderValue),
      purchaseFrequency: Number(r.purchaseFrequency),
      clv: Number(r.clv),
    }));
  }

  async getCustomerSegmentation(filter: ReportFilter) {
    const data = await this.repo.getCustomerReport({ ...filter, pageSize: 10000 });

    const segments: Record<string, { count: number; totalRevenue: number }> = {
      VIP:     { count: 0, totalRevenue: 0 },
      Repeat:  { count: 0, totalRevenue: 0 },
      Active:  { count: 0, totalRevenue: 0 },
      New:     { count: 0, totalRevenue: 0 },
      Inactive:{ count: 0, totalRevenue: 0 },
    };

    data.items.forEach((c: any) => { segments[c.segment].count++; segments[c.segment].totalRevenue += c.totalSpend; });

    return Object.entries(segments).map(([segment, { count, totalRevenue }]) => ({
      segment, count,
      avgRevenue: count > 0 ? Math.round((totalRevenue / count) * 100) / 100 : 0,
      totalRevenue,
      description: getSegmentDescription(segment),
    }));
  }

  // ─── Finance ──────────────────────────────────────────────────────────────

  async getFinanceReport(filter: ReportFilter) {
    const key = cacheKey('finance', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getFinanceReport(filter);
    const items = rows.map((r: any) => {
      const revenue = Number(r.revenue);
      const cogs = Number(r.costOfGoods);
      const grossProfit = revenue - cogs;
      const totalOrders = Number(r.totalOrders);
      return {
        period: r.period, revenue, costOfGoods: cogs,
        grossProfit, grossMargin: revenue > 0 ? Math.round((grossProfit / revenue) * 100 * 100) / 100 : 0,
        taxCollected: Number(r.taxCollected),
        totalOrders, avgOrderValue: totalOrders > 0 ? revenue / totalOrders : 0,
      };
    });

    const result = {
      items,
      chart: {
        type: 'area' as const,
        labels: items.map(i => i.period),
        datasets: [
          { label: 'Revenue',      data: items.map(i => i.revenue),      borderColor: '#4CAF50' },
          { label: 'Gross Profit', data: items.map(i => i.grossProfit),  borderColor: '#2196F3' },
          { label: 'Tax',          data: items.map(i => i.taxCollected), borderColor: '#FF9800' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getPaymentCollectionSummary(filter: ReportFilter) {
    return this.repo.getPaymentCollectionSummary(filter);
  }

  async getSettlementReport(filter: ReportFilter) {
    const rows = await this.repo.getSettlementReport(filter);
    return rows.map((r: any) => ({
      gateway: r.gateway, totalSettlements: r._count.id,
      grossAmount: Number(r._sum.grossAmount ?? 0), charges: Number(r._sum.charges ?? 0),
      taxes: Number(r._sum.taxes ?? 0), netAmount: Number(r._sum.netAmount ?? 0),
    }));
  }

  // ─── GST / Tax ────────────────────────────────────────────────────────────

  async getGSTReport(filter: ReportFilter) {
    const key = cacheKey('gst', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [data, summary] = await Promise.all([
      this.repo.getGSTReport(filter),
      this.repo.getGSTSummary(filter),
    ]);

    const result = {
      ...data,
      items: data.items.map((i: any) => ({
        ...i,
        taxableAmount: Number(i.taxableAmount),
        cgst: Number(i.cgst), sgst: Number(i.sgst), igst: Number(i.igst),
        totalTax: Number(i.totalTax), totalAmount: Number(i.totalAmount),
      })),
      summary: {
        totalTaxableAmount: Number(summary.totalTaxableAmount),
        totalCGST: Number(summary.totalCGST),
        totalSGST: Number(summary.totalSGST),
        totalIGST: Number(summary.totalIGST),
        totalTax: Number(summary.totalTax),
      },
    };

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Marketing ────────────────────────────────────────────────────────────

  async getMarketingReport(filter: ReportFilter) {
    const key = cacheKey('marketing', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [campaigns, coupons, abandoned, newsletter] = await Promise.all([
      this.repo.getCampaignPerformance(filter),
      this.repo.getCouponPerformance(filter),
      this.repo.getAbandonedCartSummary(filter),
      this.repo.getNewsletterStats(filter),
    ]);

    const result = { campaigns, coupons, abandoned, newsletter };
    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getCampaignPerformance(filter: ReportFilter) {
    const rows = await this.repo.getCampaignPerformance(filter);
    return rows.map((c: any) => {
      const analytics = c.analytics ?? [];
      const totals = analytics.reduce((acc: any, a: any) => {
        acc.impressions += a.impressions; acc.clicks += a.clicks;
        acc.conversions += a.conversions; acc.revenue += Number(a.revenue);
        return acc;
      }, { impressions: 0, clicks: 0, conversions: 0, revenue: 0 });

      return {
        id: c.id, campaignName: c.campaignName, campaignType: c.campaignType,
        status: c.status, startDate: c.startDate, endDate: c.endDate,
        ...totals,
        ctr: totals.impressions > 0 ? Math.round((totals.clicks / totals.impressions) * 100 * 100) / 100 : 0,
        conversionRate: totals.clicks > 0 ? Math.round((totals.conversions / totals.clicks) * 100 * 100) / 100 : 0,
        roi: totals.revenue > 0 ? totals.revenue : 0,
      };
    });
  }

  // ─── Payment ──────────────────────────────────────────────────────────────

  async getPaymentReport(filter: ReportFilter) {
    const key = cacheKey('payments', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [gateways, refunds, reconciliation] = await Promise.all([
      this.repo.getGatewayPerformance(filter),
      this.repo.getRefundReport(filter),
      this.repo.getReconciliationSummary(filter),
    ]);

    const gatewayItems = gateways.map((g: any) => ({
      gateway: g.gateway,
      totalTransactions: Number(g.totalTransactions),
      successful: Number(g.successful),
      failed: Number(g.failed),
      successRate: Number(g.totalTransactions) > 0
        ? Math.round((Number(g.successful) / Number(g.totalTransactions)) * 100 * 10) / 10 : 0,
      totalAmount: Number(g.totalAmount),
      capturedAmount: Number(g.capturedAmount),
      refundedAmount: Number(g.refundedAmount),
      avgTransactionValue: Number(g.totalTransactions) > 0
        ? Number(g.totalAmount) / Number(g.totalTransactions) : 0,
    }));

    const result = { gateways: gatewayItems, refunds, reconciliation };
    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Returns ──────────────────────────────────────────────────────────────

  async getReturnReport(filter: ReportFilter) {
    const key = cacheKey('returns', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const [data, summary] = await Promise.all([
      this.repo.getReturnReport(filter),
      this.repo.getReturnRateSummary(filter),
    ]);

    const result = { ...data, summary };
    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Warehouse ────────────────────────────────────────────────────────────

  async getWarehouseReport() {
    const key = 'warehouse-report';
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getWarehouseReport();
    const result = rows.map((r: any) => ({
      warehouseId: r.warehouseId, warehouseName: r.warehouseName,
      city: r.city, state: r.state,
      totalProducts: Number(r.totalProducts), totalStock: Number(r.totalStock),
      reservedStock: Number(r.reservedStock), availableStock: Number(r.availableStock),
      lowStockItems: Number(r.lowStockItems), outOfStockItems: Number(r.outOfStockItems),
    }));

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Supplier ─────────────────────────────────────────────────────────────

  async getSupplierReport(filter: ReportFilter) {
    const key = cacheKey('supplier', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getSupplierReport(filter);
    const result = rows.map((r: any) => ({
      supplierId: r.supplierId, supplierCode: r.supplierCode, supplierName: r.supplierName,
      totalPOs: Number(r.totalPOs), totalAmount: Number(r.totalAmount),
      completedPOs: Number(r.completedPOs), pendingPOs: Number(r.pendingPOs),
      rejectedPOs: Number(r.rejectedPOs),
    }));

    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  // ─── Business Intelligence ────────────────────────────────────────────────

  async getRevenueTrends(periods = 12) {
    const key = `bi-revenue-trends:${periods}`;
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getRevenueTrends(periods);
    const revenues = rows.map((r: any) => Number(r.revenue));
    const windowSize = Math.min(3, revenues.length);

    const items: RevenueTrendPoint[] = rows.map((r: any, idx: number) => {
      const start = Math.max(0, idx - windowSize + 1);
      const slice = revenues.slice(start, idx + 1);
      const movingAverage = slice.reduce((a, b) => a + b, 0) / slice.length;

      let forecastedRevenue: number | undefined;
      if (idx >= windowSize) {
        const trend = revenues[idx] - revenues[idx - 1];
        forecastedRevenue = revenues[idx] + trend;
      }

      return { period: r.period, revenue: Number(r.revenue), movingAverage, forecastedRevenue };
    });

    const result = {
      items,
      chart: {
        type: 'line' as const,
        labels: items.map(i => i.period),
        datasets: [
          { label: 'Actual Revenue',   data: items.map(i => i.revenue),        borderColor: '#4CAF50' },
          { label: 'Moving Average',   data: items.map(i => i.movingAverage),  borderColor: '#2196F3' },
          { label: 'Forecast',         data: items.map(i => i.forecastedRevenue ?? 0), borderColor: '#FF9800' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.BI);
    return result;
  }

  async getABCAnalysis() {
    const key = 'bi-abc-analysis';
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getABCAnalysisData();
    const totalRevenue = rows.reduce((sum: number, r: any) => sum + Number(r.revenue), 0);

    let cumulative = 0;
    const items: ABCAnalysisItem[] = rows.map((r: any) => {
      const revenue = Number(r.revenue);
      const revenuePercentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
      cumulative += revenuePercentage;

      return {
        productId: r.productId, productName: r.productName, sku: r.sku,
        revenue, revenuePercentage: Math.round(revenuePercentage * 100) / 100,
        cumulativePercentage: Math.round(cumulative * 100) / 100,
        category: (cumulative <= 80 ? 'A' : cumulative <= 95 ? 'B' : 'C') as 'A' | 'B' | 'C',
      };
    });

    const summary = { A: 0, B: 0, C: 0 };
    items.forEach(i => summary[i.category]++);

    const result = {
      items,
      summary,
      chart: {
        type: 'bar' as const,
        labels: ['A (Top 80%)', 'B (Next 15%)', 'C (Bottom 5%)'],
        datasets: [{ label: 'Products', data: [summary.A, summary.B, summary.C] }],
      },
    };

    cache.set(key, result, CACHE_TTL.BI);
    return result;
  }

  async getSeasonalTrends() {
    const key = 'bi-seasonal-trends';
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getSeasonalTrends();
    const items: SeasonalTrendItem[] = rows.map((r: any) => ({
      month: r.month, monthName: MONTHS[r.month - 1] ?? String(r.month),
      revenue: Number(r.revenue), orders: Number(r.orders),
      avgRevenue: Number(r.orders) > 0 ? Number(r.revenue) / Number(r.orders) : 0,
    }));

    const result = {
      items,
      chart: {
        type: 'bar' as const,
        labels: items.map(i => i.monthName),
        datasets: [
          { label: 'Revenue', data: items.map(i => i.revenue), borderColor: '#4CAF50' },
          { label: 'Orders',  data: items.map(i => i.orders),  borderColor: '#2196F3' },
        ],
      },
    };

    cache.set(key, result, CACHE_TTL.BI);
    return result;
  }

  async getGrowthMetrics() {
    const key = 'bi-growth-metrics';
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const result = await this.repo.getGrowthMetrics();
    cache.set(key, result, CACHE_TTL.REPORTS);
    return result;
  }

  async getDemandForecast(filter: ReportFilter) {
    const key = cacheKey('bi-demand', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const rows = await this.repo.getTopSellingProducts(200, filter);
    const stock = await this.repo.getWarehouseStockSummary(filter);

    const stockMap: Record<number, number> = {};
    stock.forEach((s: any) => {
      stockMap[s.productId] = (stockMap[s.productId] ?? 0) + Number(s.availableStock);
    });

    const result = rows.map((r: any) => {
      const avgMonthlySales = Math.ceil(r.quantity / 12);
      const currentStock = stockMap[r.id] ?? 0;
      const daysOfStock = avgMonthlySales > 0 ? Math.floor((currentStock / avgMonthlySales) * 30) : 999;
      return {
        productId: r.id, productName: r.name, sku: r.sku,
        avgMonthlySales, forecastedDemand: avgMonthlySales,
        currentStock, daysOfStock, reorderSuggestion: daysOfStock < 30,
      };
    });

    cache.set(key, result, CACHE_TTL.BI);
    return result;
  }

  // ─── KPI Dashboard ────────────────────────────────────────────────────────

  async getKPIDashboard(filter: ReportFilter) {
    const key = cacheKey('kpi', filter);
    const cached = cache.get<any>(key);
    if (cached) return cached;

    const result = await this.repo.getKPIData(filter);
    cache.set(key, result, CACHE_TTL.DASHBOARD);
    return result;
  }

  // ─── Audit ────────────────────────────────────────────────────────────────

  async getAuditReport(filter: ReportFilter) {
    const [orderAudit, paymentAudit] = await Promise.all([
      this.repo.getOrderAuditLogs(filter),
      this.repo.getPaymentAuditLogs(filter),
    ]);
    return { orders: orderAudit, payments: paymentAudit };
  }

  // ─── Export Manager ───────────────────────────────────────────────────────

  async exportReport(dto: ExportRequestDto, actorId?: number): Promise<{
    buffer: Buffer; mimeType: string; filename: string;
  }> {
    const filter = dto.filters ?? {};
    let data: unknown[] = [];

    switch (dto.reportType) {
      case 'dashboard': {
        const dash = await this.getExecutiveDashboard(filter);
        data = [dash.salesSummary];
        break;
      }
      case 'sales': {
        const s = await this.getSalesReport(filter);
        data = s.items;
        break;
      }
      case 'orders': {
        const o = await this.getOrderReport(filter);
        data = o.items;
        break;
      }
      case 'products': {
        const p = await this.getProductReport(filter);
        data = p.items;
        break;
      }
      case 'customers': {
        const c = await this.getCustomerReport(filter);
        data = c.items;
        break;
      }
      case 'inventory': {
        data = await this.getWarehouseStock(filter);
        break;
      }
      case 'finance': {
        const f = await this.getFinanceReport(filter);
        data = f.items;
        break;
      }
      case 'tax': {
        const t = await this.getGSTReport(filter);
        data = t.items;
        break;
      }
      case 'payments': {
        const pay = await this.getPaymentReport(filter);
        data = pay.gateways;
        break;
      }
      case 'returns': {
        const ret = await this.getReturnReport(filter);
        data = ret.items;
        break;
      }
      case 'kpi': {
        const kpi = await this.getKPIDashboard(filter);
        data = [kpi];
        break;
      }
      case 'warehouse': {
        data = await this.getWarehouseReport();
        break;
      }
      case 'supplier': {
        data = await this.getSupplierReport(filter);
        break;
      }
      default:
        throw new AppError('Unsupported report type', HTTP_STATUS.BAD_REQUEST, 'INVALID_REPORT_TYPE');
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const baseName = `${dto.reportType}-report-${timestamp}`;

    switch (dto.format) {
      case 'JSON': {
        const json = JSON.stringify({ reportType: dto.reportType, generatedAt: new Date().toISOString(), data }, null, 2);
        return { buffer: Buffer.from(json, 'utf-8'), mimeType: 'application/json', filename: `${baseName}.json` };
      }
      case 'CSV': {
        const { Parser } = await import('json2csv');
        const parser = new Parser({ fields: data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : [] });
        const csv = parser.parse(data as Record<string, unknown>[]);
        return { buffer: Buffer.from(csv, 'utf-8'), mimeType: 'text/csv', filename: `${baseName}.csv` };
      }
      case 'EXCEL': {
        const XLSX = await import('xlsx');
        const ws = XLSX.utils.json_to_sheet(data as Record<string, unknown>[]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, dto.reportType);
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        return {
          buffer: Buffer.from(buf),
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          filename: `${baseName}.xlsx`,
        };
      }
      case 'PDF': {
        const PDFDocument = (await import('pdfkit')).default;
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        await new Promise<void>(resolve => doc.on('end', resolve));

        doc.fontSize(18).text(`${dto.reportType.toUpperCase()} REPORT`, { align: 'center' });
        doc.fontSize(10).text(`Generated: ${new Date().toISOString()}`, { align: 'center' });
        doc.moveDown();

        if (data.length > 0) {
          const headers = Object.keys(data[0] as Record<string, unknown>);
          const colWidth = 500 / Math.max(headers.length, 1);

          doc.fontSize(9).fillColor('#666');
          headers.forEach((h, i) => { doc.text(h, 50 + i * colWidth, doc.y, { width: colWidth, continued: i < headers.length - 1 }); });
          doc.fillColor('#000').moveDown(0.5);

          data.slice(0, 100).forEach((row: any) => {
            headers.forEach((h, i) => {
              const val = String(row[h] ?? '');
              doc.fontSize(8).text(val, 50 + i * colWidth, doc.y, { width: colWidth, continued: i < headers.length - 1 });
            });
          });
        }

        doc.end();
        const pdfBuffer = Buffer.concat(chunks);
        return { buffer: pdfBuffer, mimeType: 'application/pdf', filename: `${baseName}.pdf` };
      }
      default:
        throw new AppError('Unsupported export format', HTTP_STATUS.BAD_REQUEST, 'INVALID_FORMAT');
    }
  }

  // ─── Scheduled Reports ────────────────────────────────────────────────────

  async createScheduledReport(dto: CreateScheduledReportDto, actorId?: number) {
    const existing = await this.repo.findScheduledReportByCode(dto.reportCode);
    if (existing) throw new AppError(`Report code "${dto.reportCode}" already exists`, HTTP_STATUS.CONFLICT, 'REPORT_CODE_CONFLICT');

    return this.repo.createScheduledReport({
      ...dto,
      nextRunAt: new Date(dto.nextRunAt),
      status: 'ACTIVE',
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    });
  }

  async listScheduledReports(query: ScheduledReportQuery) {
    return this.repo.listScheduledReports(query);
  }

  async getScheduledReport(id: number) {
    const report = await this.repo.findScheduledReportById(id);
    if (!report) throw new AppError('Scheduled report not found', HTTP_STATUS.NOT_FOUND, 'SCHEDULE_NOT_FOUND');
    return report;
  }

  async updateScheduledReport(id: number, dto: UpdateScheduledReportDto, actorId?: number) {
    const existing = await this.repo.findScheduledReportById(id);
    if (!existing) throw new AppError('Scheduled report not found', HTTP_STATUS.NOT_FOUND, 'SCHEDULE_NOT_FOUND');

    return this.repo.updateScheduledReport(id, {
      ...dto,
      nextRunAt: dto.nextRunAt ? new Date(dto.nextRunAt) : undefined,
      updatedBy: actorId ?? null,
    });
  }

  async deleteScheduledReport(id: number) {
    const existing = await this.repo.findScheduledReportById(id);
    if (!existing) throw new AppError('Scheduled report not found', HTTP_STATUS.NOT_FOUND, 'SCHEDULE_NOT_FOUND');
    return this.repo.deleteScheduledReport(id);
  }

  async listExportLogs(page = 1, pageSize = 20) {
    return this.repo.listExportLogs(page, pageSize);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSegmentDescription(segment: string): string {
  switch (segment) {
    case 'VIP':      return 'High-value customers with >₹50,000 lifetime spend';
    case 'Repeat':   return 'Loyal customers with >5 orders';
    case 'Active':   return 'Customers with at least 1 order';
    case 'New':      return 'Customers with no orders yet';
    case 'Inactive': return 'Customers with no activity in last 90 days';
    default:         return '';
  }
}
