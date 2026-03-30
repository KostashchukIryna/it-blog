const jwt = require("jsonwebtoken");
const { unauthorized } = require("../response");

/**
 * Verify Bearer JWT.  Attaches decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return unauthorized(res, "No token provided");

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return unauthorized(res, "Invalid or expired token");
  }
};

/**
 * Require is_admin flag on the JWT payload.
 * Always chain AFTER authenticate.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    const { forbidden } = require("../response");
    return forbidden(res, "Admin access required");
  }
  next();
};

module.exports = { authenticate, requireAdmin };
