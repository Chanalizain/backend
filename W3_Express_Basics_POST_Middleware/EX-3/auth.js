// auth.js
const VALID_TOKEN = 'xyz123'; // example fixed token

export function auth(req, res, next) {
  const token = req.query.token;
  if (!token || token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
  next();
}
