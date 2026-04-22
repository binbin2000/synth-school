'use strict';

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.DATA_DIR || '/data';
const PORT     = parseInt(process.env.PORT || '3001', 10);

fs.mkdirSync(DATA_DIR, { recursive: true });

// ── File helpers ──────────────────────────────────────────────

function isValidId(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);
}

function profilePath(id) {
  if (!isValidId(id)) return null;
  return path.join(DATA_DIR, `${id}.json`);
}

function readProfile(id) {
  const p = profilePath(id);
  if (!p) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
}

function writeProfile(profile) {
  const p = profilePath(profile.id);
  if (!p) throw new Error('invalid id');
  fs.writeFileSync(p, JSON.stringify(profile, null, 2), 'utf8');
}

function listProfiles() {
  return fs.readdirSync(DATA_DIR)
    .filter(f => /^[0-9a-f-]{36}\.json$/.test(f))
    .map(f => readProfile(f.slice(0, -5)))
    .filter(Boolean)
    .map(({ id, name, avatar, createdAt, lastVisited }) => ({ id, name, avatar, createdAt, lastVisited }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

// ── Body / response helpers ────────────────────────────────────

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); }
      catch (e) { const err = new Error('Invalid JSON'); err.status = 400; reject(err); }
    });
    req.on('error', reject);
  });
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS_HEADERS });
  res.end(JSON.stringify(body));
}

function noContent(res) {
  res.writeHead(204, CORS_HEADERS);
  res.end();
}

// ── Request handler ────────────────────────────────────────────

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return noContent(res);

  const segs = new URL(req.url, 'http://x').pathname
    .replace(/^\/api\//, '').split('/').filter(Boolean);
  const [resource, id] = segs;

  if (resource !== 'profiles') return json(res, 404, { error: 'not found' });

  try {
    // GET /api/profiles
    if (req.method === 'GET' && !id)
      return json(res, 200, listProfiles());

    // POST /api/profiles
    if (req.method === 'POST' && !id) {
      const body = await parseBody(req);
      if (!String(body.name || '').trim()) return json(res, 400, { error: 'name required' });
      const profile = {
        id:          crypto.randomUUID(),
        name:        String(body.name).trim().slice(0, 40),
        avatar:      String(body.avatar || '🎹').slice(0, 8),
        createdAt:   new Date().toISOString(),
        lastVisited: null,
        progress:    { version: 1, lessons: {} },
      };
      writeProfile(profile);
      return json(res, 201, profile);
    }

    // GET /api/profiles/:id
    if (req.method === 'GET' && id) {
      const p = readProfile(id);
      return p ? json(res, 200, p) : json(res, 404, { error: 'not found' });
    }

    // PUT /api/profiles/:id
    if (req.method === 'PUT' && id) {
      const existing = readProfile(id);
      if (!existing) return json(res, 404, { error: 'not found' });
      const body = await parseBody(req);
      writeProfile({
        ...existing,
        name:        body.name        ? String(body.name).trim().slice(0, 40) : existing.name,
        avatar:      body.avatar      ? String(body.avatar).slice(0, 8)       : existing.avatar,
        lastVisited: body.lastVisited ?? existing.lastVisited,
        progress:    body.progress    ?? existing.progress,
      });
      return json(res, 200, readProfile(id));
    }

    // DELETE /api/profiles/:id
    if (req.method === 'DELETE' && id) {
      const p = profilePath(id);
      if (!p || !fs.existsSync(p)) return json(res, 404, { error: 'not found' });
      fs.unlinkSync(p);
      return noContent(res);
    }

    json(res, 405, { error: 'method not allowed' });

  } catch (err) {
    if (err.status) return json(res, err.status, { error: err.message });
    console.error(err);
    json(res, 500, { error: 'internal server error' });
  }

}).listen(PORT, () => console.log(`Profiles API :${PORT}  data=${DATA_DIR}`));
