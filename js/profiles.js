/* ============================================================
   profiles.js — Profile Manager (API + localStorage fallback)
   ============================================================ */

var ProfileManager = (() => {
  const API        = '/api';
  const ACTIVE_KEY = 'synthSchoolActiveProfile';

  let _available    = false;
  let _active       = null;
  let _saveTimer    = null;

  // ── API detection ─────────────────────────────────────────────

  async function detectAPI() {
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 2000);
      const res  = await fetch(`${API}/profiles`, { signal: ctrl.signal });
      clearTimeout(tid);
      _available = res.ok;
    } catch {
      _available = false;
    }
    return _available;
  }

  function isAvailable() { return _available; }
  function getActive()   { return _active; }

  // ── Stored profile ID (which profile was last selected) ───────

  function getStoredId() {
    try { return localStorage.getItem(ACTIVE_KEY) || null; } catch { return null; }
  }
  function storeId(id) {
    try { id ? localStorage.setItem(ACTIVE_KEY, id) : localStorage.removeItem(ACTIVE_KEY); } catch {}
  }

  // ── API calls ─────────────────────────────────────────────────

  async function list() {
    try {
      const r = await fetch(`${API}/profiles`);
      return r.ok ? r.json() : [];
    } catch { return []; }
  }

  async function get(id) {
    try {
      const r = await fetch(`${API}/profiles/${encodeURIComponent(id)}`);
      return r.ok ? r.json() : null;
    } catch { return null; }
  }

  async function create(name, avatar) {
    const r = await fetch(`${API}/profiles`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, avatar }),
    });
    if (!r.ok) throw new Error('Kunde inte skapa profil');
    return r.json();
  }

  async function update(id, data) {
    try {
      await fetch(`${API}/profiles/${encodeURIComponent(id)}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
    } catch {}
  }

  async function remove(id) {
    try {
      const r = await fetch(`${API}/profiles/${encodeURIComponent(id)}`, { method: 'DELETE' });
      return r.ok || r.status === 204;
    } catch { return false; }
  }

  // ── Select / deselect ─────────────────────────────────────────

  async function select(id) {
    const profile = await get(id);
    if (!profile) return null;
    _active = profile;
    storeId(id);
    return profile;
  }

  function deselect() {
    _active = null;
    storeId(null);
  }

  // ── Debounced progress save ───────────────────────────────────

  function scheduleProgressSave(progress) {
    if (!_available || !_active) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
      update(_active.id, { progress, lastVisited: progress.lastVisited });
    }, 700);
  }

  return {
    detectAPI, isAvailable, getActive,
    getStoredId,
    list, get, create, update, remove,
    select, deselect,
    scheduleProgressSave,
  };
})();
