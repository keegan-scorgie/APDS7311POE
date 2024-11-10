import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request object
    next(); // Move to the next middleware/route handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};