// logger.js
export function logger(req, res, next) {
  const method = req.method;
  const path = req.path;
  const query = req.query;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${path} - Query:`, query);
  next();
}
