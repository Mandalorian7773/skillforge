import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in production — frontend is on a different domain
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

// Bind to 0.0.0.0 — required for Render/Docker (127.0.0.1 rejects external traffic)
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`
  ⚡ SkillForge Backend running on ${HOST}:${PORT}
  📡 API: http://${HOST}:${PORT}/api
  🏥 Health: http://${HOST}:${PORT}/health
  `);
});

server.on('error', (err: any) => {
  if (err.code === 'EPERM' || err.code === 'EACCES') {
    console.error(`Cannot bind to port ${PORT}. Trying port 0 (random)...`);
    const fallback = app.listen(0, HOST, () => {
      const addr = fallback.address();
      console.log(`⚡ SkillForge Backend running on port ${typeof addr === 'object' ? addr?.port : addr}`);
    });
  }
});

export default app;
