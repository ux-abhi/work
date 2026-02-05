const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const templates = require('./templates');
const linkRoutes = require('./routes/links');
const qrRoutes = require('./routes/qr');
const walletRoutes = require('./routes/wallet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', linkRoutes);
app.use('/api', qrRoutes);
app.use('/api', walletRoutes);

/**
 * GET /s/:slug — Public smart link page
 * Serves a self-contained HTML page with the link data embedded.
 * This allows the smart link to work without loading the React SPA.
 */
app.get('/s/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM smart_links WHERE slug = ?').get(req.params.slug);

  if (!row) {
    return res.status(404).send('<h1>Link not found</h1>');
  }

  // Increment view count
  db.prepare('UPDATE smart_links SET views = views + 1 WHERE slug = ?').run(req.params.slug);

  const links = JSON.parse(row.links);
  const template = templates.find((t) => t.id === row.template) || templates[0];
  const css = template.css;

  // Generate self-contained HTML for the smart link page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${escapeHtml(row.title)} — SmartLink</title>
  <meta name="description" content="${escapeHtml(row.description || `${links.length} curated links`)}" />
  <meta property="og:title" content="${escapeHtml(row.title)}" />
  <meta property="og:description" content="${escapeHtml(row.description || `${links.length} curated links`)}" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${css.background};
      color: ${css.textColor};
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      justify-content: center;
      padding: 40px 20px 60px;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: ${css.accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: ${css.background.includes('#fff') || css.background.includes('#f5f') ? '#1d1d1f' : '#ffffff'};
      margin-bottom: 4px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-align: center;
    }

    .description {
      font-size: 14px;
      color: ${css.subtextColor};
      text-align: center;
      line-height: 1.5;
      margin-bottom: 12px;
    }

    .links {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      background: ${css.cardBackground};
      border: ${css.cardBorder};
      border-radius: ${css.borderRadius};
      box-shadow: ${css.cardShadow};
      text-decoration: none;
      color: ${css.textColor};
      transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      cursor: pointer;
      ${css.backdropFilter ? `backdrop-filter: ${css.backdropFilter}; -webkit-backdrop-filter: ${css.backdropFilter};` : ''}
    }

    .link-card:hover {
      transform: ${css.hoverTransform};
      box-shadow: ${css.cardShadow.replace(/[\d.]+\)$/, (m) => parseFloat(m) * 2 + ')')};
    }

    .link-card:active {
      transform: scale(0.98);
    }

    .link-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: ${css.accentColor}18;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .link-info {
      flex: 1;
      min-width: 0;
    }

    .link-title {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
    }

    .link-url {
      font-size: 12px;
      color: ${css.subtextColor};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .arrow {
      color: ${css.subtextColor};
      font-size: 16px;
      flex-shrink: 0;
    }

    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: ${css.subtextColor};
      text-align: center;
      opacity: 0.6;
    }

    .footer a {
      color: ${css.accentColor};
      text-decoration: none;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .container > * {
      animation: fadeUp 0.4s ease-out both;
    }

    ${links.map((_, i) => `.links .link-card:nth-child(${i + 1}) { animation: fadeUp 0.4s ease-out ${0.1 + i * 0.06}s both; }`).join('\n    ')}
  </style>
</head>
<body>
  <div class="container">
    <div class="avatar">${escapeHtml(row.title.charAt(0).toUpperCase())}</div>
    <h1>${escapeHtml(row.title)}</h1>
    ${row.description ? `<p class="description">${escapeHtml(row.description)}</p>` : ''}
    <div class="links">
      ${links
        .map(
          (link) => `
        <a class="link-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
          <div class="link-icon">${link.icon || '🔗'}</div>
          <div class="link-info">
            <div class="link-title">${escapeHtml(link.title || extractDomain(link.url))}</div>
            <div class="link-url">${escapeHtml(cleanUrl(link.url))}</div>
          </div>
          <span class="arrow">→</span>
        </a>`
        )
        .join('\n')}
    </div>
    <div class="footer">Built with <a href="/">SmartLink</a></div>
  </div>
</body>
</html>`;

  res.type('html').send(html);
});

// In production, serve the built React app
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`SmartLink server running on http://localhost:${PORT}`);
});

// --- Utility functions ---

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function cleanUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace('www.', '') + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    return url;
  }
}
