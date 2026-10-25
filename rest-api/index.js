import 'dotenv/config';
import express from 'express';
import { redirectUrl } from './controllers/urlController.js';
import urlRoutes from './router/url.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Route order matters: /api/url must stay before /:code,
// otherwise the short-code route shadows the API.
app.use('/api/url', urlRoutes);
app.get('/:code', redirectUrl);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler: body-parser errors (e.g. malformed JSON)
// never reach controllers, so sanitize them here instead of
// leaking stack traces via Express's default handler.
app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;