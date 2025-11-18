const jwt = require("jsonwebtoken");

// Verify token middleware
const verifyToken = (req, res, next) => {
  // Accepts either:
  // - Authorization: Bearer <token>
  // - token: <token>
  const authHeader = req.headers.authorization || req.headers.token;

  if (!authHeader) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  // If "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid!" });
    }

    req.user = decodedUser; // Contains: id, isAdmin
    next();
  });
};

// Verify admin middleware
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin === true) {
      next();
    } else {
      return res.status(403).json({ message: "Admin access required!" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
