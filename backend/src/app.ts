import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, closeDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import systemRoutes from './routes/systems.js';
import planetRoutes from './routes/planets.js';
import baseRoutes from './routes/bases.js';
import entityRoutes from './routes/entities.js';
import statsRoutes from './routes/stats.js';
import generateRoutes from './routes/generate.js';
import importRoutes from './routes/import.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/systems', systemRoutes);
app.use('/api/planets', planetRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/import', importRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const server = app.listen(PORT, () => {
  getDatabase();
  console.log(`🚀 RSS Backend running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  closeDatabase();
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  closeDatabase();
  server.close(() => process.exit(0));
});

export default app;
