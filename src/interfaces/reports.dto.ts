// ─────────────────────────────────────────────────────────────────────────────
// Reports, Analytics & BI — DTOs and Response Interfaces
// ─────────────────────────────────────────────────────────────────────────────

// ─── Common ──────────────────────────────────────────────────────────────────

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface ReportFilter extends DateRangeFilter {
  warehouseId?: number;
  supplierId?: number;
  categoryId?: number;
  brandId?: number;
  customerGroupId?: number;
  paymentMethod?: string;
  orderStatus?: string;
  productId?: number;
  campaignId?: number;
  state?: string;
  city?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  groupBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Charts ──────────────────────────────────────────────────────────────────

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'donut'
  | 'heatmap'
  | 'treemap'
  | 'funnel';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string;
}

export interface ChartData {
  type: ChartType;
  labels: string[];
  datasets: ChartDataset[];
}

// ─── Executive Dashboard ─────────────────────────────────────────────────────

export interface PeriodMetrics {
  revenue: number;
  orders: number;
  profit: number;
  newCustomers?: number;
}

export interface SalesSummaryDto {
  today: PeriodMetrics;
  yesterday: PeriodMetrics;
  thisWeek: PeriodMetrics;
  thisMonth: PeriodMetrics;
  thisYear: PeriodMetrics;
  growth: {
    dailyGrowth: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
  };
}

export interface OrderSummaryDto {
  pending: number;
  confirmed: number;
  processing: number;
  packed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  refunded: number;
  total: number;
}

export interface InventorySummaryDto {
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
  totalStockValue: number;
}

export interface TopItemDto {
  id: number;
  name: string;
  quantity?: number;
  revenue?: number;
  count?: number;
  percentage?: number;
  growth?: number;
}

export interface TopCustomerDto {
  id: number;
  customerCode: string;
  name: string;
  email: string;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate?: Date | null;
}

export interface RecentOrderDto {
  id: number;
  orderNumber: string;
  customerName: string;
  grandTotal: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: Date;
}

export interface ExecutiveDashboardResponse {
  salesSummary: SalesSummaryDto;
  orderSummary: OrderSummaryDto;
  inventorySummary: InventorySummaryDto;
  topSellingCategories: TopItemDto[];
  topSellingProducts: TopItemDto[];
  topCustomers: TopCustomerDto[];
  recentOrders: RecentOrderDto[];
  generatedAt: string;
}

// ─── Sales Reports ────────────────────────────────────────────────────────────

export interface SalesDataPoint {
  period: string;
  revenue: number;
  orders: number;
  quantity: number;
  discount: number;
  tax: number;
  profit: number;
  avgOrderValue: number;
}

export interface SalesTotals {
  revenue: number;
  orders: number;
  quantity: number;
  discount: number;
  tax: number;
  profit: number;
  avgOrderValue: number;
}

export interface SalesReportResponse {
  items: SalesDataPoint[];
  totals: SalesTotals;
  chart: ChartData;
  period: string;
}

// ─── Order Reports ────────────────────────────────────────────────────────────

export interface OrderReportItem {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: Date;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  grandTotal: number;
  shippingCharge: number;
  taxAmount: number;
  discountAmount: number;
  couponDiscount: number;
  city?: string;
  state?: string;
}

export interface OrderStatusSummary {
  status: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface OrderReportResponse {
  items: OrderReportItem[];
  summary: OrderStatusSummary[];
  chart: ChartData;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Product Reports ──────────────────────────────────────────────────────────

export interface ProductReportItem {
  id: number;
  productCode: string;
  productName: string;
  sku: string;
  category?: string;
  brand?: string;
  quantitySold: number;
  revenue: number;
  profit: number;
  margin: number;
  currentStock: number;
  rank?: number;
}

export interface ProductReportResponse {
  items: ProductReportItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  chart: ChartData;
}

// ─── Inventory Reports ────────────────────────────────────────────────────────

export interface StockLedgerItem {
  date: Date;
  movementType: string;
  quantity: number;
  reference?: string | null;
  warehouse: string;
  remarks?: string | null;
}

export interface WarehouseStockItem {
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  status: string;
}

export interface StockMovementSummaryItem {
  movementType: string;
  count: number;
  totalQuantity: number;
}

export interface SupplierPerformanceItem {
  supplierId: number;
  supplierName: string;
  totalPOs: number;
  completedPOs: number;
  totalAmount: number;
  onTimeDeliveryRate: number;
}

// ─── Customer Reports ─────────────────────────────────────────────────────────

export interface CustomerReportItem {
  id: number;
  customerCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string | null;
  totalOrders: number;
  totalSpend: number;
  walletBalance: number;
  loyaltyPoints: number;
  lastOrderDate?: Date | null;
  registeredAt: Date;
  status: string;
  segment: string;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  avgRevenue: number;
  totalRevenue: number;
  description: string;
}

export interface CLVData {
  customerId: number;
  customerName: string;
  avgOrderValue: number;
  purchaseFrequency: number;
  clv: number;
}

export interface CustomerGrowthPoint {
  period: string;
  newCustomers: number;
  activeCustomers: number;
  cumulativeCustomers: number;
}

// ─── Finance Reports ──────────────────────────────────────────────────────────

export interface FinanceReportItem {
  period: string;
  revenue: number;
  costOfGoods: number;
  grossProfit: number;
  grossMargin: number;
  taxCollected: number;
  totalOrders: number;
  avgOrderValue: number;
}

export interface PaymentCollectionItem {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface OutstandingPaymentItem {
  orderId: number;
  orderNumber: string;
  customerName: string;
  grandTotal: number;
  paidAmount: number;
  outstanding: number;
  orderDate: Date;
  daysOutstanding: number;
}

export interface SettlementSummaryItem {
  gateway: string;
  totalSettlements: number;
  grossAmount: number;
  charges: number;
  taxes: number;
  netAmount: number;
}

// ─── GST / Tax Reports ────────────────────────────────────────────────────────

export interface GSTLineItem {
  invoiceNumber: string;
  invoiceDate: Date;
  orderNumber: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalAmount: number;
}

export interface HSNSummaryItem {
  hsnCode: string;
  description: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
  totalTax: number;
}

export interface GSTSummaryResponse {
  period: string;
  totalTaxableAmount: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  items: GSTLineItem[];
  hsnSummary: HSNSummaryItem[];
}

// ─── Marketing Reports ────────────────────────────────────────────────────────

export interface CampaignPerformanceItem {
  id: number;
  campaignName: string;
  campaignType: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  roi: number;
  startDate?: Date | null;
  endDate?: Date | null;
  status: string;
}

export interface CouponPerformanceItem {
  id: number;
  couponCode: string;
  title: string;
  usageCount: number;
  usageLimit?: number | null;
  totalDiscount: number;
  ordersGenerated: number;
}

export interface GiftCardUsageItem {
  id: number;
  giftCardCode: string;
  amount: number;
  balance: number;
  status: string;
  expiryDate: Date;
}

export interface AbandonedCartSummary {
  total: number;
  recovered: number;
  recoveryRate: number;
  lostRevenue: number;
  recoveredRevenue: number;
}

// ─── Payment Reports ──────────────────────────────────────────────────────────

export interface GatewayPerformanceItem {
  gateway: string;
  totalTransactions: number;
  successful: number;
  failed: number;
  successRate: number;
  totalAmount: number;
  capturedAmount: number;
  refundedAmount: number;
  avgTransactionValue: number;
}

export interface RefundReportItem {
  id: number;
  refundNumber: string;
  orderNumber: string;
  refundMode: string;
  refundAmount: number;
  refundStatus: string;
  refundDate?: Date | null;
  createdAt: Date;
}

export interface ReconciliationSummaryItem {
  status: string;
  count: number;
  totalDifference: number;
}

// ─── Return Reports ───────────────────────────────────────────────────────────

export interface ReturnReportItem {
  id: number;
  returnNumber: string;
  orderNumber: string;
  reason?: string | null;
  status: string;
  itemCount: number;
  requestedDate: Date;
}

export interface ReturnReasonSummary {
  reason: string;
  count: number;
  percentage: number;
}

export interface ReturnRateSummary {
  totalOrders: number;
  returnedOrders: number;
  returnRate: number;
  totalRefunds: number;
  totalRefundAmount: number;
}

// ─── Business Intelligence ────────────────────────────────────────────────────

export interface RevenueTrendPoint {
  period: string;
  revenue: number;
  movingAverage: number;
  forecastedRevenue?: number;
}

export interface DemandForecastItem {
  productId: number;
  productName: string;
  sku: string;
  avgMonthlySales: number;
  forecastedDemand: number;
  currentStock: number;
  daysOfStock: number;
  reorderSuggestion: boolean;
}

export interface ABCAnalysisItem {
  productId: number;
  productName: string;
  sku: string;
  revenue: number;
  revenuePercentage: number;
  cumulativePercentage: number;
  category: 'A' | 'B' | 'C';
}

export interface SeasonalTrendItem {
  month: number;
  monthName: string;
  revenue: number;
  orders: number;
  avgRevenue: number;
}

export interface GrowthMetrics {
  revenueGrowthMoM: number;
  revenueGrowthYoY: number;
  orderGrowthMoM: number;
  orderGrowthYoY: number;
  customerGrowthMoM: number;
  customerGrowthYoY: number;
  newVsReturningCustomerRatio: number;
}

// ─── KPI Dashboard ────────────────────────────────────────────────────────────

export interface KPIPreviousPeriod {
  revenue: number;
  orders: number;
  newCustomers: number;
  returnedOrders: number;
  refundedOrders: number;
  avgOrderValue: number;
  grossProfit: number;
}

export interface KPIDashboard {
  currentPeriod: KPIPreviousPeriod;
  previousPeriod: KPIPreviousPeriod;
  revenueGrowth: number;
  orderGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  returnRate: number;
  refundRate: number;
  grossMargin: number;
  netMargin: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
}

// ─── Warehouse Reports ────────────────────────────────────────────────────────

export interface WarehouseReportItem {
  warehouseId: number;
  warehouseName: string;
  city?: string | null;
  state?: string | null;
  totalProducts: number;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockItems: number;
  outOfStockItems: number;
}

// ─── Supplier Reports ─────────────────────────────────────────────────────────

export interface SupplierReportItem {
  supplierId: number;
  supplierCode: string;
  supplierName: string;
  totalPOs: number;
  totalAmount: number;
  completedPOs: number;
  pendingPOs: number;
  rejectedPOs: number;
}

// ─── Audit Reports ────────────────────────────────────────────────────────────

export interface AuditLogItem {
  id: number;
  entity: string;
  entityId: number;
  action: string;
  actorId?: number | null;
  details?: Record<string, unknown> | null;
  createdAt: Date;
}

// ─── Export ──────────────────────────────────────────────────────────────────

export type ExportFormatType = 'EXCEL' | 'CSV' | 'PDF' | 'JSON';

export type ExportReportType =
  | 'dashboard'
  | 'sales'
  | 'orders'
  | 'products'
  | 'customers'
  | 'inventory'
  | 'payments'
  | 'finance'
  | 'tax'
  | 'marketing'
  | 'returns'
  | 'kpi'
  | 'warehouse'
  | 'supplier';

export interface ExportRequestDto {
  reportType: ExportReportType;
  format: ExportFormatType;
  filters?: ReportFilter;
}

// ─── Scheduled Reports ───────────────────────────────────────────────────────

export type ScheduleFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type ScheduleStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface CreateScheduledReportDto {
  reportCode: string;
  reportName: string;
  reportType: string;
  frequency: ScheduleFrequency;
  filters?: Record<string, unknown>;
  recipients?: string[];
  nextRunAt: string;
}

export interface UpdateScheduledReportDto {
  reportName?: string;
  frequency?: ScheduleFrequency;
  filters?: Record<string, unknown>;
  recipients?: string[];
  nextRunAt?: string;
  status?: ScheduleStatus;
}

export interface ScheduledReportQuery {
  status?: ScheduleStatus;
  reportType?: string;
  frequency?: ScheduleFrequency;
  page?: number;
  pageSize?: number;
}
