import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { analyzeWithGemini, extractTextFromScreenshot } from './server/geminiService';
import { analyzeLocally } from './server/localHeuristicEngine';
import { parseUpiString } from './server/upiParser';

const app = express();
const PORT = 3000;

// Middleware with size limits
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'UPI-Shield Contextual Digital Payment Scam Detector',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    gemini_configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// 2. Primary Analysis Endpoint: POST /api/analyze
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { text, language } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({
        error: 'Invalid request: "text" field is required and must not be empty.',
      });
      return;
    }

    if (text.length > 8000) {
      res.status(400).json({
        error: 'Text exceeds maximum allowable length of 8,000 characters.',
      });
      return;
    }

    // Call analysis service (Gemini with automatic local fallback)
    const result = await analyzeWithGemini(text.trim(), language);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    // Graceful fallback to local heuristics so server NEVER crashes
    try {
      const fallbackResult = analyzeLocally(req.body?.text || '', req.body?.language);
      res.json(fallbackResult);
    } catch (fallbackError) {
      res.status(500).json({
        error: 'An internal analysis error occurred. Please try again.',
      });
    }
  }
});

// 3. Dedicated UPI Intent Parser: POST /api/parse-upi
app.post('/api/parse-upi', (req: Request, res: Response) => {
  try {
    const { uri } = req.body;
    if (!uri || typeof uri !== 'string') {
      res.status(400).json({ error: 'URI string is required.' });
      return;
    }

    const parsed = parseUpiString(uri.trim());
    if (!parsed) {
      res.status(422).json({
        error: 'Unable to parse valid UPI parameters from input. Expected format: upi://pay?pa=... or valid VPA.',
      });
      return;
    }

    res.json(parsed);
  } catch (err) {
    console.error('Error in /api/parse-upi:', err);
    res.status(500).json({ error: 'Failed to parse UPI string.' });
  }
});

// 4. OCR Screenshot Analyzer: POST /api/ocr
app.post('/api/ocr', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || typeof image !== 'string') {
      res.status(400).json({ error: 'Base64 image data is required.' });
      return;
    }

    const extracted = await extractTextFromScreenshot(image, mimeType || 'image/png');
    res.json(extracted);
  } catch (error) {
    console.error('Error in /api/ocr:', error);
    res.status(500).json({
      error: 'OCR processing failed. You can paste the message text manually into the analyzer.',
    });
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UPI-Shield] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
