// backend/middleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, 'YOUR_SUPER_SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user; // Add user payload to the request object
    next(); // Proceed to the route handler
  });
};

module.exports = { authenticateToken };