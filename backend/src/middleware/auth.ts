import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // Attach payload to request for later use if needed
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
