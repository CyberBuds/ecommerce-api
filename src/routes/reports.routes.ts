import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import roleGuard from '../middlewares/roleGuard';
import validate from '../middlewares/validation.middleware';
import ReportsRepository from '../repositories/reports.repository';
import ReportsService from '../services/reports.service';
import createReportsController from '../controllers/reports.controller';
import {
  dashboardQueryRules,
  salesReportQueryRules,
  orderReportQueryRules,
  productReportQueryRules,
  inventoryReportQueryRules,
  customerReportQueryRules,
  financeReportQueryRules,
  taxReportQueryRules,
  marketingReportQueryRules,
  paymentReportQueryRules,
  returnReportQueryRules,
  biQueryRules,
  exportReportRules,
  createScheduledReportRules,
  updateScheduledReportRules,
  scheduledReportIdRules,
  scheduledReportQueryRules,
} from '../validations/reports.validation';

// ─── DI ───────────────────────────────────────────────────────────────────────

const repo       = new ReportsRepository();
const service    = new ReportsService(repo);
const ctrl       = createReportsController(service);

// ─── Role Groups ──────────────────────────────────────────────────────────────

const ADMIN_ROLES        = ['Super Admin', 'Admin'];
const FINANCE_ROLES      = ['Super Admin', 'Admin', 'Finance Manager'];
const MARKETING_ROLES    = ['Super Admin', 'Admin', 'Marketing Manager'];
const INVENTORY_ROLES    = ['Super Admin', 'Admin', 'Inventory Manager'];
const ALL_REPORT_ROLES   = ['Super Admin', 'Admin', 'Finance Manager', 'Marketing Manager', 'Inventory Manager', 'Report Viewer'];

const router = Router();

// ─── All routes require authentication ───────────────────────────────────────

router.use(authenticate);

// ─────────────────────────────────────────────────────────────────────────────
// Executive Dashboard
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/dashboard',
  roleGuard(ALL_REPORT_ROLES),
  dashboardQueryRules, validate,
  ctrl.getDashboard
);

// ─────────────────────────────────────────────────────────────────────────────
// KPI Dashboard
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/kpi',
  roleGuard(ADMIN_ROLES),
  dashboardQueryRules, validate,
  ctrl.getKPIDashboard
);

// ─────────────────────────────────────────────────────────────────────────────
// Sales Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/sales',
  roleGuard(FINANCE_ROLES),
  salesReportQueryRules, validate,
  ctrl.getSalesReport
);

router.get(
  '/sales/by-category',
  roleGuard(FINANCE_ROLES),
  salesReportQueryRules, validate,
  ctrl.getSalesByCategory
);

router.get(
  '/sales/by-brand',
  roleGuard(FINANCE_ROLES),
  salesReportQueryRules, validate,
  ctrl.getSalesByBrand
);

// ─────────────────────────────────────────────────────────────────────────────
// Order Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/orders',
  roleGuard(ALL_REPORT_ROLES),
  orderReportQueryRules, validate,
  ctrl.getOrderReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Product Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/products',
  roleGuard(ALL_REPORT_ROLES),
  productReportQueryRules, validate,
  ctrl.getProductReport
);

router.get(
  '/products/low-stock',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getLowStockReport
);

router.get(
  '/products/out-of-stock',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getOutOfStockReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/inventory',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getInventoryReport
);

router.get(
  '/inventory/stock-ledger/:productId',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getStockLedger
);

router.get(
  '/inventory/grn',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getGRNReport
);

router.get(
  '/inventory/warehouse',
  roleGuard(INVENTORY_ROLES),
  inventoryReportQueryRules, validate,
  ctrl.getWarehouseReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Warehouse Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/warehouses',
  roleGuard(INVENTORY_ROLES),
  ctrl.getWarehouseReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Supplier Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/suppliers',
  roleGuard(INVENTORY_ROLES),
  salesReportQueryRules, validate,
  ctrl.getSupplierReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Customer Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/customers',
  roleGuard(ALL_REPORT_ROLES),
  customerReportQueryRules, validate,
  ctrl.getCustomerReport
);

router.get(
  '/customers/growth',
  roleGuard(ADMIN_ROLES),
  salesReportQueryRules, validate,
  ctrl.getCustomerGrowth
);

router.get(
  '/customers/clv',
  roleGuard(ADMIN_ROLES),
  ctrl.getCustomerCLV
);

router.get(
  '/customers/segmentation',
  roleGuard(ADMIN_ROLES),
  customerReportQueryRules, validate,
  ctrl.getCustomerSegmentation
);

// ─────────────────────────────────────────────────────────────────────────────
// Finance Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/finance',
  roleGuard(FINANCE_ROLES),
  financeReportQueryRules, validate,
  ctrl.getFinanceReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Tax / GST Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/tax',
  roleGuard(FINANCE_ROLES),
  taxReportQueryRules, validate,
  ctrl.getTaxReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Marketing Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/marketing',
  roleGuard(MARKETING_ROLES),
  marketingReportQueryRules, validate,
  ctrl.getMarketingReport
);

router.get(
  '/marketing/campaigns',
  roleGuard(MARKETING_ROLES),
  marketingReportQueryRules, validate,
  ctrl.getCampaignPerformance
);

// ─────────────────────────────────────────────────────────────────────────────
// Payment Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/payments',
  roleGuard(FINANCE_ROLES),
  paymentReportQueryRules, validate,
  ctrl.getPaymentReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Return & Refund Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/returns',
  roleGuard(ALL_REPORT_ROLES),
  returnReportQueryRules, validate,
  ctrl.getReturnReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Business Intelligence
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/business-intelligence',
  roleGuard(ADMIN_ROLES),
  biQueryRules, validate,
  ctrl.getBusinessIntelligence
);

router.get(
  '/bi/revenue-trends',
  roleGuard(ADMIN_ROLES),
  biQueryRules, validate,
  ctrl.getRevenueTrends
);

router.get(
  '/bi/abc-analysis',
  roleGuard(ADMIN_ROLES),
  ctrl.getABCAnalysis
);

router.get(
  '/bi/seasonal-trends',
  roleGuard(ADMIN_ROLES),
  ctrl.getSeasonalTrends
);

router.get(
  '/bi/demand-forecast',
  roleGuard(INVENTORY_ROLES),
  salesReportQueryRules, validate,
  ctrl.getDemandForecast
);

// ─────────────────────────────────────────────────────────────────────────────
// Audit Reports
// ─────────────────────────────────────────────────────────────────────────────

router.get(
  '/audit',
  roleGuard(ADMIN_ROLES),
  salesReportQueryRules, validate,
  ctrl.getAuditReport
);

// ─────────────────────────────────────────────────────────────────────────────
// Export Manager
// ─────────────────────────────────────────────────────────────────────────────

router.post(
  '/export',
  roleGuard(ALL_REPORT_ROLES),
  exportReportRules, validate,
  ctrl.exportReport
);

router.get(
  '/export/logs',
  roleGuard(ADMIN_ROLES),
  ctrl.listExportLogs
);

// ─────────────────────────────────────────────────────────────────────────────
// Scheduled Reports
// ─────────────────────────────────────────────────────────────────────────────

router.post(
  '/schedule',
  roleGuard(ADMIN_ROLES),
  createScheduledReportRules, validate,
  ctrl.createScheduledReport
);

router.get(
  '/schedule',
  roleGuard(ADMIN_ROLES),
  scheduledReportQueryRules, validate,
  ctrl.listScheduledReports
);

router.get(
  '/schedule/:id',
  roleGuard(ADMIN_ROLES),
  scheduledReportIdRules, validate,
  ctrl.getScheduledReport
);

router.put(
  '/schedule/:id',
  roleGuard(ADMIN_ROLES),
  updateScheduledReportRules, validate,
  ctrl.updateScheduledReport
);

router.delete(
  '/schedule/:id',
  roleGuard(ADMIN_ROLES),
  scheduledReportIdRules, validate,
  ctrl.deleteScheduledReport
);

export default router;
