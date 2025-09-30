const { jwtVerify } = require('jose');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const token = req.headers['x-token'];
    if (!token) return res.status(403).send('A token is required for authentication');

    const secret = new TextEncoder().encode('your_jwt_secret'); // Convert string to Uint8Array

    const { payload } = await jwtVerify(token, secret); 
    req.user = payload; // payload contains your JWT data, e.g., { id: 'user_id_here' }

    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).send('Unauthorized: Invalid token');
  }
};
