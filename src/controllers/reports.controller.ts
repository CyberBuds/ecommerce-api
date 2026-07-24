import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import ReportsService from '../services/reports.service';
import { ReportFilter } from '../interfaces/reports.dto';

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports, Analytics & Business Intelligence APIs
 */

export default function createReportsController(service: ReportsService) {
  const actor = (req: Request): number | undefined => {
    const user = (req as any).user;
    return user?.sub ? Number(user.sub) : undefined;
  };

  const toFilter = (q: Record<string, unknown>): ReportFilter => ({
    startDate:       q.startDate    as string | undefined,
    endDate:         q.endDate      as string | undefined,
    warehouseId:     q.warehouseId  ? Number(q.warehouseId)  : undefined,
    supplierId:      q.supplierId   ? Number(q.supplierId)   : undefined,
    categoryId:      q.categoryId   ? Number(q.categoryId)   : undefined,
    brandId:         q.brandId      ? Number(q.brandId)      : undefined,
    customerGroupId: q.customerGroupId ? Number(q.customerGroupId) : undefined,
    paymentMethod:   q.paymentMethod as string | undefined,
    orderStatus:     q.orderStatus  as string | undefined,
    productId:       q.productId    ? Number(q.productId)    : undefined,
    campaignId:      q.campaignId   ? Number(q.campaignId)   : undefined,
    state:           q.state        as string | undefined,
    city:            q.city         as string | undefined,
    page:            q.page         ? Number(q.page)         : undefined,
    pageSize:        q.pageSize     ? Number(q.pageSize)     : undefined,
    limit:           q.limit        ? Number(q.limit)        : undefined,
    groupBy:         q.groupBy      as string | undefined,
    sortBy:          q.sortBy       as string | undefined,
    sortOrder:       q.sortOrder    as 'asc' | 'desc' | undefined,
  });

  return {
    // ──────────────────────────────────────────────────────────────────────
    // Executive Dashboard
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/dashboard:
     *   get:
     *     summary: Get executive dashboard summary
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: startDate
     *         schema: { type: string, format: date }
     *       - in: query
     *         name: endDate
     *         schema: { type: string, format: date }
     *     responses:
     *       200:
     *         description: Dashboard data
     */
    getDashboard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getExecutiveDashboard(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Dashboard fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Sales Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/sales:
     *   get:
     *     summary: Get sales report by period
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getSalesReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSalesReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Sales report fetched successfully');
      } catch (e) { next(e); }
    },

    getSalesByCategory: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSalesByCategory(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Sales by category fetched successfully');
      } catch (e) { next(e); }
    },

    getSalesByBrand: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSalesByBrand(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Sales by brand fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Order Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/orders:
     *   get:
     *     summary: Get order report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getOrderReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getOrderReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Order report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Product Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/products:
     *   get:
     *     summary: Get product sales report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getProductReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getProductReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Product report fetched successfully');
      } catch (e) { next(e); }
    },

    getLowStockReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getLowStockReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Low stock report fetched successfully');
      } catch (e) { next(e); }
    },

    getOutOfStockReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getOutOfStockReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Out of stock report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Inventory Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/inventory:
     *   get:
     *     summary: Get warehouse stock inventory report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getInventoryReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filter = toFilter(req.query as Record<string, unknown>);
        const [warehouseStock, movements, supplierPerf] = await Promise.all([
          service.getWarehouseStock(filter),
          service.getStockMovementSummary(filter),
          service.getSupplierPerformance(filter),
        ]);
        return apiResponse.success(res, { warehouseStock, movements, supplierPerf }, 'Inventory report fetched successfully');
      } catch (e) { next(e); }
    },

    getStockLedger: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = Number(req.params.productId);
        const data = await service.getStockLedger(productId, toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Stock ledger fetched successfully');
      } catch (e) { next(e); }
    },

    getGRNReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getGRNReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'GRN report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Customer Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/customers:
     *   get:
     *     summary: Get customer report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getCustomerReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCustomerReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Customer report fetched successfully');
      } catch (e) { next(e); }
    },

    getCustomerGrowth: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCustomerGrowth(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Customer growth report fetched successfully');
      } catch (e) { next(e); }
    },

    getCustomerCLV: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const limit = req.query.limit ? Number(req.query.limit) : 50;
        const data = await service.getCustomerCLV(limit);
        return apiResponse.success(res, data, 'Customer lifetime value fetched successfully');
      } catch (e) { next(e); }
    },

    getCustomerSegmentation: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCustomerSegmentation(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Customer segmentation fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Finance Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/finance:
     *   get:
     *     summary: Get finance report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getFinanceReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filter = toFilter(req.query as Record<string, unknown>);
        const [finance, collection, settlements] = await Promise.all([
          service.getFinanceReport(filter),
          service.getPaymentCollectionSummary(filter),
          service.getSettlementReport(filter),
        ]);
        return apiResponse.success(res, { finance, collection, settlements }, 'Finance report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Tax / GST Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/tax:
     *   get:
     *     summary: Get GST and tax report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getTaxReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getGSTReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Tax report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Marketing Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/marketing:
     *   get:
     *     summary: Get marketing and campaign report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getMarketingReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getMarketingReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Marketing report fetched successfully');
      } catch (e) { next(e); }
    },

    getCampaignPerformance: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getCampaignPerformance(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Campaign performance fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Payment Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/payments:
     *   get:
     *     summary: Get payment and gateway report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getPaymentReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getPaymentReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Payment report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Return Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/returns:
     *   get:
     *     summary: Get return and refund report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getReturnReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getReturnReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Return report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Warehouse Reports
    // ──────────────────────────────────────────────────────────────────────

    getWarehouseReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getWarehouseReport();
        return apiResponse.success(res, data, 'Warehouse report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Supplier Reports
    // ──────────────────────────────────────────────────────────────────────

    getSupplierReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSupplierReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Supplier report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Business Intelligence
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/business-intelligence:
     *   get:
     *     summary: Get business intelligence and analytics
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    getBusinessIntelligence: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filter = toFilter(req.query as Record<string, unknown>);
        const periods = req.query.periods ? Number(req.query.periods) : 12;

        const [trends, abc, seasonal, growth, demand] = await Promise.all([
          service.getRevenueTrends(periods),
          service.getABCAnalysis(),
          service.getSeasonalTrends(),
          service.getGrowthMetrics(),
          service.getDemandForecast(filter),
        ]);

        return apiResponse.success(
          res,
          { trends, abc, seasonal, growth, demand },
          'Business intelligence data fetched successfully'
        );
      } catch (e) { next(e); }
    },

    getRevenueTrends: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const periods = req.query.periods ? Number(req.query.periods) : 12;
        const data = await service.getRevenueTrends(periods);
        return apiResponse.success(res, data, 'Revenue trends fetched successfully');
      } catch (e) { next(e); }
    },

    getABCAnalysis: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getABCAnalysis();
        return apiResponse.success(res, data, 'ABC analysis fetched successfully');
      } catch (e) { next(e); }
    },

    getSeasonalTrends: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getSeasonalTrends();
        return apiResponse.success(res, data, 'Seasonal trends fetched successfully');
      } catch (e) { next(e); }
    },

    getDemandForecast: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getDemandForecast(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Demand forecast fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // KPI Dashboard
    // ──────────────────────────────────────────────────────────────────────

    getKPIDashboard: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getKPIDashboard(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'KPI dashboard fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Audit Reports
    // ──────────────────────────────────────────────────────────────────────

    getAuditReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getAuditReport(toFilter(req.query as Record<string, unknown>));
        return apiResponse.success(res, data, 'Audit report fetched successfully');
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Export Manager
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/export:
     *   post:
     *     summary: Export a report in the requested format
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [reportType, format]
     *             properties:
     *               reportType:
     *                 type: string
     *                 enum: [dashboard,sales,orders,products,customers,inventory,payments,finance,tax,marketing,returns,kpi,warehouse,supplier]
     *               format:
     *                 type: string
     *                 enum: [EXCEL,CSV,PDF,JSON]
     *               filters:
     *                 type: object
     *     responses:
     *       200:
     *         description: Binary file download
     */
    exportReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { buffer, mimeType, filename } = await service.exportReport(req.body, actor(req));
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', buffer.length);
        return res.end(buffer);
      } catch (e) { next(e); }
    },

    // ──────────────────────────────────────────────────────────────────────
    // Scheduled Reports
    // ──────────────────────────────────────────────────────────────────────

    /**
     * @swagger
     * /api/v1/reports/schedule:
     *   post:
     *     summary: Create a scheduled report
     *     tags: [Reports]
     *     security:
     *       - bearerAuth: []
     */
    createScheduledReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const report = await service.createScheduledReport(req.body, actor(req));
        return apiResponse.created(res, report, 'Scheduled report created successfully');
      } catch (e) { next(e); }
    },

    listScheduledReports: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.listScheduledReports(req.query as any);
        return apiResponse.success(res, data, 'Scheduled reports fetched successfully');
      } catch (e) { next(e); }
    },

    getScheduledReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.getScheduledReport(Number(req.params.id));
        return apiResponse.success(res, data, 'Scheduled report fetched successfully');
      } catch (e) { next(e); }
    },

    updateScheduledReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await service.updateScheduledReport(Number(req.params.id), req.body, actor(req));
        return apiResponse.success(res, data, 'Scheduled report updated successfully');
      } catch (e) { next(e); }
    },

    deleteScheduledReport: async (req: Request, res: Response, next: NextFunction) => {
      try {
        await service.deleteScheduledReport(Number(req.params.id));
        return apiResponse.success(res, null, 'Scheduled report deleted successfully');
      } catch (e) { next(e); }
    },

    listExportLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
        const data = await service.listExportLogs(page, pageSize);
        return apiResponse.success(res, data, 'Export logs fetched successfully');
      } catch (e) { next(e); }
    },
  };
}
