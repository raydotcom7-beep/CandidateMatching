/* ============================================================
   UTILS.JS — DOM Helpers & Formatters
   File: assets/js/common/utils.js
   
   Utility functions for DOM manipulation, event delegation,
   debounce/throttle, data formatting, and common patterns.
   ============================================================ */

const Utils = (() => {
  'use strict';

  /* ── DOM Selection ─────────────────────────────────────── */

  /**
   * Shorthand for querySelector
   * @param {string} selector 
   * @param {Element} context 
   * @returns {Element|null}
   */
  function $(selector, context = document) {
    return context.querySelector(selector);
  }

  /**
   * Shorthand for querySelectorAll (returns Array)
   * @param {string} selector 
   * @param {Element} context 
   * @returns {Element[]}
   */
  function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  /**
   * Get element by ID
   * @param {string} id 
   * @returns {Element|null}
   */
  function byId(id) {
    return document.getElementById(id);
  }


  /* ── DOM Manipulation ──────────────────────────────────── */

  /**
   * Create element with attributes and children
   * @param {string} tag 
   * @param {Object} attrs 
   * @param  {...(Element|string)} children 
   * @returns {Element}
   */
  function createElement(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'dataset') {
        Object.assign(el.dataset, value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }

    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });

    return el;
  }

  /**
   * Insert HTML from string safely
   * @param {Element} container 
   * @param {string} html 
   * @param {'beforeend'|'afterbegin'|'beforebegin'|'afterend'} position 
   */
  function insertHTML(container, html, position = 'beforeend') {
    container.insertAdjacentHTML(position, html);
  }

  /**
   * Remove all children from an element
   * @param {Element} el 
   */
  function clearChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  /**
   * Toggle class with optional force
   * @param {Element} el 
   * @param {string} className 
   * @param {boolean} [force]
   */
  function toggleClass(el, className, force) {
    if (force !== undefined) {
      el.classList.toggle(className, force);
    } else {
      el.classList.toggle(className);
    }
  }


  /* ── Event Handling ────────────────────────────────────── */

  /**
   * Event delegation — attach listener to parent, filter by selector
   * @param {Element} parent 
   * @param {string} eventType 
   * @param {string} selector 
   * @param {Function} handler 
   * @param {Object} [options]
   */
  function delegate(parent, eventType, selector, handler, options = {}) {
    parent.addEventListener(eventType, (e) => {
      const target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    }, options);
  }

  /**
   * One-time event listener
   * @param {Element} el 
   * @param {string} eventType 
   * @param {Function} handler 
   */
  function once(el, eventType, handler) {
    el.addEventListener(eventType, handler, { once: true });
  }

  /**
   * Dispatch a custom event
   * @param {Element} el 
   * @param {string} name 
   * @param {*} detail 
   */
  function emit(el, name, detail = null) {
    el.dispatchEvent(new CustomEvent(name, { 
      bubbles: true, 
      cancelable: true, 
      detail 
    }));
  }


  /* ── Timing ────────────────────────────────────────────── */

  /**
   * Debounce — delay execution until pause
   * @param {Function} fn 
   * @param {number} delay — ms
   * @returns {Function}
   */
  function debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Throttle — execute at most once per interval
   * @param {Function} fn 
   * @param {number} interval — ms
   * @returns {Function}
   */
  function throttle(fn, interval = 200) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  /**
   * Wait / sleep
   * @param {number} ms 
   * @returns {Promise}
   */
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  /* ── Data Formatting ───────────────────────────────────── */

  /**
   * Format Indian phone number: +91 XXXXX XXXXX
   * @param {string} phone — 10-digit number
   * @returns {string}
   */
  function formatPhone(phone) {
    const digits = String(phone).replace(/\D/g, '').slice(-10);
    if (digits.length !== 10) return phone;
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  /**
   * Format date to Indian format: DD/MM/YYYY
   * @param {Date|string} date 
   * @returns {string}
   */
  function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  /**
   * Format currency in Indian Rupee format: ₹1,23,456
   * @param {number} amount 
   * @returns {string}
   */
  function formatCurrency(amount) {
    const num = Number(amount);
    if (isNaN(num)) return '₹0';
    return '₹' + num.toLocaleString('en-IN');
  }

  /**
   * Format number in Indian locale: 1,23,456
   * @param {number} num 
   * @returns {string}
   */
  function formatNumber(num) {
    return Number(num).toLocaleString('en-IN');
  }

  /**
   * Capitalize first letter
   * @param {string} str 
   * @returns {string}
   */
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  }

  /**
   * Truncate string with ellipsis
   * @param {string} str 
   * @param {number} maxLen 
   * @returns {string}
   */
  function truncate(str, maxLen = 100) {
    if (!str || str.length <= maxLen) return str;
    return str.slice(0, maxLen).trimEnd() + '…';
  }

  /**
   * Mask Aadhaar number: XXXX XXXX 1234
   * @param {string} aadhaar — 12-digit number
   * @returns {string}
   */
  function maskAadhaar(aadhaar) {
    const digits = String(aadhaar).replace(/\D/g, '');
    if (digits.length !== 12) return aadhaar;
    return `XXXX XXXX ${digits.slice(8)}`;
  }

  /**
   * Generate a unique ID
   * @param {string} prefix 
   * @returns {string}
   */
  function uniqueId(prefix = 'ck') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }


  /* ── Data Fetching ─────────────────────────────────────── */

  /**
   * Fetch JSON data
   * @param {string} url 
   * @param {Object} [options]
   * @returns {Promise<any>}
   */
  async function fetchJSON(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Load static JSON data file (cached)
   */
  const jsonCache = new Map();

  async function loadJSON(path) {
    if (jsonCache.has(path)) {
      return jsonCache.get(path);
    }
    const data = await fetchJSON(path);
    jsonCache.set(path, data);
    return data;
  }


  /* ── Dropdown Helpers ──────────────────────────────────── */

  /**
   * Populate a <select> element from an array of {value, label} objects
   * @param {HTMLSelectElement} selectEl 
   * @param {Array<{value: string, label: string}>} options 
   * @param {string} [placeholder]
   */
  function populateSelect(selectEl, options, placeholder = '') {
    clearChildren(selectEl);
    
    if (placeholder) {
      const placeholderOption = createElement('option', { value: '' }, placeholder);
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      selectEl.appendChild(placeholderOption);
    }

    options.forEach(opt => {
      selectEl.appendChild(
        createElement('option', { value: opt.value }, opt.label)
      );
    });

    emit(selectEl, 'options:populated');
  }

  /**
   * Get selected values from a multi-select
   * @param {HTMLSelectElement} selectEl 
   * @returns {string[]}
   */
  function getSelectedValues(selectEl) {
    return Array.from(selectEl.selectedOptions).map(o => o.value).filter(Boolean);
  }


  /* ── Form Data Helpers ─────────────────────────────────── */

  /**
   * Serialize form to plain object
   * @param {HTMLFormElement} form 
   * @returns {Object}
   */
  function serializeForm(form) {
    const data = {};
    const formData = new FormData(form);
    for (const [key, value] of formData.entries()) {
      if (data[key] !== undefined) {
        // Handle multiple values (checkboxes, multi-selects)
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  /**
   * Reset form and clear validation states
   * @param {HTMLFormElement} form 
   */
  function resetForm(form) {
    form.reset();
    $$('.form-group--error, .form-group--success', form).forEach(el => {
      el.classList.remove('form-group--error', 'form-group--success');
    });
    $$('.form-error-text', form).forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }


  /* ── Animated Counter ──────────────────────────────────── */

  /**
   * Animate a number counter
   * @param {Element} el — element to update
   * @param {number} target — target number
   * @param {number} [duration] — ms
   * @param {string} [prefix] — e.g. '₹'
   * @param {string} [suffix] — e.g. '+'
   */
  function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
    let start = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = `${prefix}${formatNumber(current)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${prefix}${formatNumber(target)}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }


  /* ── File Size Formatter ───────────────────────────────── */

  /**
   * Format bytes to human-readable size
   * @param {number} bytes 
   * @returns {string}
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }


  /* ── Public API ────────────────────────────────────────── */

  return {
    $, $$, byId,
    createElement, insertHTML, clearChildren, toggleClass,
    delegate, once, emit,
    debounce, throttle, wait,
    formatPhone, formatDate, formatCurrency, formatNumber,
    capitalize, truncate, maskAadhaar, uniqueId,
    fetchJSON, loadJSON,
    populateSelect, getSelectedValues,
    serializeForm, resetForm,
    animateCounter, formatFileSize,
  };
})();

export default Utils;
