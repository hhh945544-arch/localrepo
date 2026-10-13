const jwt = require('jsonwebtoken');

/**
 * Middleware: verify JWT from Authorization header.
 * Sets req.user on success.
 * Returns 401 if token is missing or invalid.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};

/**
 * Middleware: verify token AND require merchant role.
 */
const requireMerchant = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'merchant') {
      return res.status(403).json({ error: 'Only merchant accounts can perform this action.' });
    }
    next();
  });
};

module.exports = { verifyToken, requireMerchant };
