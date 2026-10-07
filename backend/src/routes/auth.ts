import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// In-memory user store for demo purposes
interface User {
  id: number;
  email: string;
  rollno: string;
  passwordHash: string;
}

const users: User[] = [];
let nextUserId = 1;

router.post('/register', async (req: Request, res: Response) => {
  const { email, rollno, password } = req.body;
  if (!email || !rollno || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  const existing = users.find(u => u.email === email || u.rollno === rollno);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = { id: nextUserId++, email, rollno, passwordHash };
  users.push(user);
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.status(201).json({ token });
});

router.post('/login', async (req: Request, res: Response) => {
  const { emailOrRollno, password } = req.body;
  const user = users.find(u => u.email === emailOrRollno || u.rollno === emailOrRollno);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token });
});

export default router;
