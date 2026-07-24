import http from 'http';
import { app, logger } from './app';
import config from './config/env';

const PORT = config.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`API server listening on http://localhost:${PORT}`);
});

// Graceful shutdown
function shutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close((err) => {
    if (err) {
      logger.error('Error during server close', err);
      process.exit(1);
    }
    logger.info('Closed out remaining connections. Exiting now.');
    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', reason as any);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err as any);
  process.exit(1);
});
