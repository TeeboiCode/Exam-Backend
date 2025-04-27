/**
 * Role Authorization Middleware
 * Middleware to check if the authenticated user has the required role(s)
 * to access a specific route
 */

/**
 * Creates a middleware function that checks user roles
 * @param {...string} roles - List of allowed roles
 * @returns {Function} Middleware function that checks user roles
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Check if user exists in request (should be added by verifyToken middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    // Check if user's role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden - You don't have permission to access this resource",
      });
    }

    // User has required role, proceed to next middleware
    next();
  };
};

module.exports = authorizeRole;
