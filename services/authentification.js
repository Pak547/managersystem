require('dotenv').config();
const jwt = require('jsonwebtoken');

// function to authenticate token for user login
function authenticateToken(req, res, next) {
  // Get auth header value
  const authHeader = req.headers['authorization'];
  // Check if bearer is undefined
  const token = authHeader && authHeader.split(' ')[1];
  // Check if token is null
  if (token == null) 
    return res.sendStatus(401);
  // Verify token and call next middleware function if token is valid 
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.locals = response;
      next();
    })
}

module.exports = { authenticateToken: authenticateToken };