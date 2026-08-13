import { Router } from 'express';
import healthController from '../controllers/health.controller';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';
import masterRoutes from './master.routes';
import attributeValueRoutes from './attribute-values.routes';
import mediaRoutes from './media.routes';
import productRoutes from './products.routes';
import inventoryRoutes from './inventory.routes';
import customerRoutes from './customers.routes';
import cartRoutes from './cart.routes';
import shippingRoutes from './shipping.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import marketingRoutes from './marketing.routes';
import cmsRoutes from './cms.routes';
import reportsRoutes from './reports.routes';
import sysadminRoutes from './sysadmin.routes';
import { collectRoutes, RouteInfo } from '../utils/routeUtils';

const router = Router();

// GET /api/v1/health
router.get('/health', healthController.healthCheck);

// Auth routes
router.use('/auth', authRoutes);

// User management
router.use('/users', userRoutes);

// Master data
router.use('/master', masterRoutes);
router.use('/master/attributes', attributeValueRoutes);

// Media management
router.use('/media', mediaRoutes);

// Product management
router.use('/products', productRoutes);

// Inventory and warehouse management
router.use('/inventory', inventoryRoutes);

// Customer and CRM management
router.use('/customers', customerRoutes);

// Shopping cart and checkout
router.use('/cart', cartRoutes);
router.use('/', shippingRoutes);

// Order management
router.use('/orders', orderRoutes);

// Payment and billing
router.use('/payments', paymentRoutes);

// Marketing, promotions, and engagement
router.use('/marketing', marketingRoutes);

// CMS, content management, and SEO
router.use('/cms', cmsRoutes);

// Reports, Analytics & Business Intelligence
router.use('/reports', reportsRoutes);

// System Administration & Configuration
router.use('/admin', sysadminRoutes);

router.get('/docs/endpoints', (_req, res) => {
  const routes: RouteInfo[] = collectRoutes(router, '/api/v1');
  const uniqueRoutes = new Map<string, RouteInfo>();
  routes.forEach((route) => {
    const key = `${route.path}:${route.methods.join(',')}`;
    if (!uniqueRoutes.has(key)) {
      uniqueRoutes.set(key, route);
    }
  });
  res.json({ success: true, data: Array.from(uniqueRoutes.values()), meta: null, message: 'Route catalog', errors: null });
});

export default router;
