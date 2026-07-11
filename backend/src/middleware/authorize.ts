import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { getDatabase } from '../config/database.js';

type TableName = 'systems' | 'planets' | 'bases' | 'fauna' | 'flora' | 'minerals' | 'starships' | 'settlements' | 'multitools' | 'derelicts' | 'sandworms' | 'racetracks';

export function authorizeEdit(tableName: TableName) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticación requerida' });
      return;
    }

    const isAdmin = req.user.role === 'admin';
    if (isAdmin) {
      next();
      return;
    }

    const db = getDatabase();
    const record = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id) as Record<string, unknown> | undefined;

    if (!record) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const isOwner =
      record.discovered_by === req.user.username ||
      record.discovered_link === req.user.username ||
      record.doc_by === req.user.username;

    if (!isOwner) {
      res.status(403).json({ error: 'No tienes permiso para editar este registro. Solo el dueño o un administrador pueden editarlo.' });
      return;
    }

    next();
  };
}

export function authorizeDelete(tableName: TableName) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticación requerida' });
      return;
    }

    const isAdmin = req.user.role === 'admin';
    if (isAdmin) {
      next();
      return;
    }

    const db = getDatabase();
    const record = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id) as Record<string, unknown> | undefined;

    if (!record) {
      res.status(404).json({ error: 'Registro no encontrado' });
      return;
    }

    const isOwner =
      record.discovered_by === req.user.username ||
      record.discovered_link === req.user.username ||
      record.doc_by === req.user.username;

    if (!isOwner) {
      res.status(403).json({ error: 'No tienes permiso para eliminar este registro. Solo el dueño o un administrador pueden eliminarlo.' });
      return;
    }

    next();
  };
}
