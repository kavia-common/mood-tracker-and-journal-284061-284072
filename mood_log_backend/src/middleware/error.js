export function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

/**
 * PUBLIC_INTERFACE
 * errorHandler: Centralized error handler for the application.
 */
export function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
