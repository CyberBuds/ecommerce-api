import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import documentationRoutes from './routes/documentation.routes';
import errorHandler from './middlewares/errorHandler';
import requestLogger from './middlewares/requestLogger';
import logger from './config/logger';
import config from './config/env';
import { swaggerSpec } from './config/swagger';

const app = express();

// Assign a request id for traceability
app.use((req, _res, next) => {
  (req as any).id = uuidv4();
  next();
});

// Security and performance middlewares
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN ? config.CORS_ORIGIN.split(',') : true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

// request logger middleware
app.use(requestLogger);

// Swagger/OpenAPI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api/swagger.json',
  },
  customCss: '.topbar { display: none }',
}));

// OpenAPI JSON endpoint
app.get('/api/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API docs landing page
app.use('/documentation', documentationRoutes);

// Mount API routes under /api
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  return res.status(404).json({ success: false, data: null, meta: null, message: 'Not Found', errors: null });
});

// Global error handler
app.use(errorHandler);

// Export app and logger
export { app, logger };
export default app;
