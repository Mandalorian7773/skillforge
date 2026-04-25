import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  credentials: true,
}));
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SkillForge Backend', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const server = app.listen(Number(PORT), '127.0.0.1', () => {
  console.log(`
  ⚡ SkillForge Backend running on port ${PORT}
  📡 API: http://localhost:${PORT}/api
  🏥 Health: http://localhost:${PORT}/health
  `);
});

server.on('error', (err: any) => {
  if (err.code === 'EPERM' || err.code === 'EACCES') {
    console.error(`Cannot bind to port ${PORT}. Trying port 0 (random)...`);
    const fallback = app.listen(0, '127.0.0.1', () => {
      const addr = fallback.address();
      console.log(`⚡ SkillForge Backend running on port ${typeof addr === 'object' ? addr?.port : addr}`);
    });
  }
});

export default app;
