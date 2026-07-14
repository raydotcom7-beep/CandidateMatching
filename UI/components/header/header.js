/* ============================================================
   HEADER.JS — Header Enhancement Module
   File: components/header/header.js

   Provides: transparent-on-hero detection,
   active page highlighting, external link warnings.
   Core scroll/mobile-menu behaviour is in app.js.

   Usage: import './../../components/header/header.js';
   ============================================================ */
'use strict';

const Header = (() => {



  /**
   * Highlight nav link matching current URL path segment.
   */
  function highlightActiveLink() {
    const path    = location.pathname;
    const segment = path.split('/').filter(Boolean).pop()?.replace('.html', '') || 'home';

    document.querySelectorAll('[data-nav-link]').forEach(link => {
      link.classList.toggle('active', link.dataset.navLink === segment);
    });
  }

  /**
   * Auto-init when DOM ready.
   */
  function init() {
    highlightActiveLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init, highlightActiveLink };
})();

if (typeof window !== 'undefined') window.Header = Header;
