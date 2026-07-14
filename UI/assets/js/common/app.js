/* ============================================================
   APP.JS — Application Core
   File: assets/js/common/app.js
   
   App initialization, HTML partial loader, theme toggle,
   scroll handlers, and global event orchestration.
   
   Usage: <script type="module" src="../../assets/js/common/app.js"></script>
   ============================================================ */

const App = (() => {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */
  const state = {
    theme: 'light',
    language: 'hi',
    initialized: false,
    componentsLoaded: new Set(),
  };

  /* ── Configuration ─────────────────────────────────────── */
  const config = {
    defaultTheme: 'light',
    defaultLanguage: 'hi',
    storageKeys: {
      theme: 'ck-ui-theme',
      language: 'ck-ui-lang',
    },
    headerScrollThreshold: 60,
    scrollTopThreshold: 300,
  };


  /* ── Initialization ────────────────────────────────────── */

  function init() {
    if (state.initialized) return;

    restorePreferences();
    applyTheme(state.theme);
    setupThemeToggle();
    setupScrollHandlers();
    setupScrollToTop();
    setupMobileMenuToggle();
    observeAnimatedElements();

    state.initialized = true;

    document.dispatchEvent(new CustomEvent('app:ready', { 
      detail: { theme: state.theme, language: state.language } 
    }));

    console.info('[Kaushal Setu UI] App initialized', {
      theme: state.theme,
      lang: state.language,
    });
  }


  /* ── Preferences (LocalStorage) ────────────────────────── */

  function restorePreferences() {
    var storage = window._ckStorage || localStorage;
    try {
      var savedTheme = storage.getItem(config.storageKeys.theme);
      var savedLang  = storage.getItem(config.storageKeys.language);

      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        state.theme = savedTheme;
      } else {
        // Respect OS preference
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.theme = prefersDark ? 'dark' : config.defaultTheme;
      }

      if (savedLang && ['hi', 'en'].includes(savedLang)) {
        state.language = savedLang;
      } else {
        state.language = config.defaultLanguage;
      }
    } catch (e) {
      // storage may be blocked
      state.theme = config.defaultTheme;
      state.language = config.defaultLanguage;
    }
  }

  function savePreference(key, value) {
    var storage = window._ckStorage || localStorage;
    try {
      storage.setItem(key, value);
    } catch (e) {
      // Silently fail
    }
  }


  /* ── Theme Management ──────────────────────────────────── */

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    savePreference(config.storageKeys.theme, theme);

    // Update toggle button icon if present
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const sunIcon = toggleBtn.querySelector('.icon-sun');
      const moonIcon = toggleBtn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'light' ? 'block' : 'none';
      }
      toggleBtn.setAttribute('aria-label', 
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }

    document.dispatchEvent(new CustomEvent('app:themeChanged', { 
      detail: { theme } 
    }));
  }

  function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }

  function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      var storage = window._ckStorage || localStorage;
      var savedTheme;
      try { savedTheme = storage.getItem(config.storageKeys.theme); } catch(_) {}
      if (!savedTheme) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }


  /* ── Component Loader (HTML Partials via fetch) ─────────── */

  async function loadComponent(targetSelector, componentPath) {
    const target = document.querySelector(targetSelector);
    if (!target) {
      console.warn(`[App] Target "${targetSelector}" not found for component "${componentPath}"`);
      return null;
    }

    if (state.componentsLoaded.has(componentPath)) {
      return target;
    }

    try {
      const response = await fetch(componentPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      target.innerHTML = html;
      state.componentsLoaded.add(componentPath);

      // Dispatch event so component JS can initialize
      document.dispatchEvent(new CustomEvent('app:componentLoaded', {
        detail: { selector: targetSelector, path: componentPath, element: target }
      }));

      return target;
    } catch (error) {
      console.error(`[App] Failed to load component "${componentPath}":`, error);
      target.innerHTML = `<!-- Component load failed: ${componentPath} -->`;
      return null;
    }
  }

  async function loadComponents(componentMap) {
    const promises = Object.entries(componentMap).map(
      ([selector, path]) => loadComponent(selector, path)
    );
    return Promise.allSettled(promises);
  }


  /* ── Scroll Handlers ───────────────────────────────────── */

  function setupScrollHandlers() {
    let lastScrollY = 0;
    let ticking = false;

    const header = document.querySelector('[data-header]');
    
    function onScroll() {
      const currentScrollY = window.scrollY;

      // Header scroll effect — add/remove classes
      if (header) {
        if (currentScrollY > config.headerScrollThreshold) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }

        // Hide/show on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      }

      // Scroll-to-top button visibility
      const scrollTopBtn = document.getElementById('scroll-top');
      if (scrollTopBtn) {
        if (currentScrollY > config.scrollTopThreshold) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ── Scroll to Top ─────────────────────────────────────── */

  function setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }


  /* ── Mobile Menu Toggle ────────────────────────────────── */

  function setupMobileMenuToggle() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (!menuToggle || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (menuOverlay) menuOverlay.classList.add('visible');
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (menuOverlay) menuOverlay.classList.remove('visible');
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu on link click (SPA-style navigation)
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  /* ── Intersection Observer for Animations ──────────────── */

  function observeAnimatedElements() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animationType = el.dataset.animate;
          const delay = el.dataset.animateDelay || '0';
          
          el.style.animationDelay = `${delay}ms`;
          el.classList.add(`animate-${animationType}`);
          el.classList.add('animated');
          
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // Re-observe after dynamic content load
  function refreshAnimations() {
    observeAnimatedElements();
  }


  /* ── Active Page Highlighting ──────────────────────────── */

  function setActivePage(pageName) {
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.navLink === pageName) {
        link.classList.add('active');
      }
    });
  }


  /* ── Public API ─────────────────────────────────────────── */

  return {
    init,
    loadComponent,
    loadComponents,
    toggleTheme,
    applyTheme,
    setActivePage,
    refreshAnimations,
    
    get theme() { return state.theme; },
    get language() { return state.language; },
    set language(lang) {
      if (['hi', 'en'].includes(lang)) {
        state.language = lang;
        savePreference(config.storageKeys.language, lang);
        document.documentElement.setAttribute('lang', lang);
        document.dispatchEvent(new CustomEvent('app:languageChanged', { 
          detail: { language: lang } 
        }));
      }
    },
  };
})();


/* ── Auto-initialize on DOM ready ────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

if (typeof window !== 'undefined') window.App = App;
