const jwt = require('jsonwebtoken');

const secretKey = 'cdmi'; // Use env var in real apps

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  console.log(authHeader);

  // Check if token is present
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

//   if (!token) {
//     return res.status(401).json({ message: 'Access token missing' });
//   }

//   // Verify token
  jwt.verify(authHeader, secretKey, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    // Attach decoded user data to request
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;