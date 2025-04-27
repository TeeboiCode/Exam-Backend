/**
 * JWT Token Verification Middleware
 * Verifies the JWT token in the Authorization header
 * Adds the decoded user information to the request object
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  try {
    // Verify token and decode user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add decoded user info to request object
    req.user = decoded;
    next();
  } catch (err) {
    // Return error if token is invalid
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
