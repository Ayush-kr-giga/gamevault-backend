const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

function middleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

module.exports = middleware
