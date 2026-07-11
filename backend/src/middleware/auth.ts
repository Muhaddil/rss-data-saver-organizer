import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../config/auth.js';
import { getDatabase } from '../config/database.js';
import type { User } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token de acceso requerido' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const db = getDatabase();
    const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(decoded.id) as User | undefined;

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Se requieren permisos de administrador' });
    return;
  }
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyToken(token);
    const db = getDatabase();
    const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(decoded.id) as User | undefined;

    if (user) {
      req.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }
  } catch {
    // Token invalid, continue without auth
  }
  next();
}
