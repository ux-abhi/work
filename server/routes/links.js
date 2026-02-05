const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const db = require('../db');
const templates = require('../templates');

const router = express.Router();

// GET /api/templates — Return all available templates
router.get('/templates', (req, res) => {
  res.json(templates);
});

// POST /api/links — Create a new smart link
router.post('/links', (req, res) => {
  const { title, description, template, links } = req.body;

  if (!links || !Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: 'At least one link is required' });
  }

  // Validate template exists
  const validTemplate = templates.find((t) => t.id === template);
  if (!validTemplate) {
    return res.status(400).json({ error: 'Invalid template' });
  }

  const id = uuidv4();
  const slug = nanoid(8); // Short, URL-friendly ID

  const stmt = db.prepare(`
    INSERT INTO smart_links (id, slug, title, description, template, links)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, slug, title || 'My Links', description || '', template, JSON.stringify(links));

  res.status(201).json({
    id,
    slug,
    title: title || 'My Links',
    description: description || '',
    template,
    links,
  });
});

// GET /api/links/:slug — Fetch a smart link by slug
router.get('/links/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM smart_links WHERE slug = ?').get(req.params.slug);

  if (!row) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  res.json({
    ...row,
    links: JSON.parse(row.links),
  });
});

// PUT /api/links/:id — Update a smart link
router.put('/links/:id', (req, res) => {
  const { title, description, template, links } = req.body;

  const existing = db.prepare('SELECT * FROM smart_links WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  const stmt = db.prepare(`
    UPDATE smart_links
    SET title = ?, description = ?, template = ?, links = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    title || existing.title,
    description !== undefined ? description : existing.description,
    template || existing.template,
    links ? JSON.stringify(links) : existing.links,
    req.params.id
  );

  res.json({ success: true });
});

// DELETE /api/links/:id — Delete a smart link
router.delete('/links/:id', (req, res) => {
  const result = db.prepare('DELETE FROM smart_links WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Smart link not found' });
  }

  res.json({ success: true });
});

// POST /api/links/:slug/view — Increment view counter
router.post('/links/:slug/view', (req, res) => {
  db.prepare('UPDATE smart_links SET views = views + 1 WHERE slug = ?').run(req.params.slug);
  res.json({ success: true });
});

module.exports = router;
