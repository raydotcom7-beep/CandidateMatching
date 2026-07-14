/* ============================================================
   SAFE-STORAGE.JS — localStorage polyfill for file:// protocol
   File: assets/js/common/safe-storage.js

   Problem: Chrome throws "file: URLs are treated as unique
   security origins" when localStorage is accessed on file://,
   especially with query-string parameters.

   Solution: Wrap localStorage in try/catch and silently fall
   back to an in-memory Map so the app still works correctly
   when opened directly as a file (no HTTP server).

   Usage (loaded FIRST before any other script):
     <script src="../../assets/js/common/safe-storage.js"></script>

   After loading, every script can call:
     _ckStorage.getItem('ck-ui-lang')  → 'hi' | null
     _ckStorage.setItem('ck-ui-lang', 'en')
     _ckStorage.removeItem('ck-ui-lang')
     _ckStorage.clear()
   ============================================================ */

(function () {
  'use strict';

  /* ── In-memory fallback store ─────────────────────────────── */
  var _mem = Object.create(null);   // plain key-value store
  var _usingFallback = false;

  /* ── Test whether localStorage is available ──────────────── */
  function _isAvailable() {
    try {
      var testKey = '__ck_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ── Determine storage backend once at load time ─────────── */
  var _available = _isAvailable();
  if (!_available) {
    _usingFallback = true;
    console.warn(
      '[Kaushal Setu] localStorage is not available on this origin ' +
      '(file:// with query-params). Using in-memory storage. ' +
      'Preferences will not persist across page reloads.'
    );
  }

  /* ── Public API ───────────────────────────────────────────── */
  var _ckStorage = {

    getItem: function (key) {
      if (_available) {
        try { return localStorage.getItem(key); } catch (e) { /* fall through */ }
      }
      return Object.prototype.hasOwnProperty.call(_mem, key) ? _mem[key] : null;
    },

    setItem: function (key, value) {
      if (_available) {
        try { localStorage.setItem(key, String(value)); return; } catch (e) { /* fall through */ }
      }
      _mem[key] = String(value);
    },

    removeItem: function (key) {
      if (_available) {
        try { localStorage.removeItem(key); return; } catch (e) { /* fall through */ }
      }
      delete _mem[key];
    },

    clear: function () {
      if (_available) {
        try { localStorage.clear(); return; } catch (e) { /* fall through */ }
      }
      _mem = Object.create(null);
    },

    /** True when using the in-memory fallback (i.e. file:// blocked) */
    get usingFallback() { return _usingFallback; },
  };

  /* ── Expose globally ──────────────────────────────────────── */
  window._ckStorage = _ckStorage;

})();
