/* ============================================================
   ALERTS.JS — Toast Notification Manager
   File: components/alerts/alerts.js

   Usage:
     import Toast from '../../components/alerts/alerts.js';
     Toast.show('रिकॉर्ड सहेजा गया', 'success');
     Toast.show('नेटवर्क त्रुटि', 'error', 5000);
     Toast.show({ title: 'चेतावनी', message: 'डेटा अधूरा है', type: 'warning' });
   ============================================================ */
'use strict';

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
const TITLES = {
  hi: { success: 'सफलता', error: 'त्रुटि', warning: 'चेतावनी', info: 'जानकारी' },
  en: { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' },
};

const Toast = (() => {
  let _container = null;

  function _getContainer() {
    if (!_container) {
      _container = document.createElement('div');
      _container.id = 'toast-container';
      _container.setAttribute('aria-live', 'polite');
      _container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(_container);
    }
    return _container;
  }

  /**
   * Show a toast notification.
   * @param {string|Object} messageOrOptions
   * @param {'success'|'error'|'warning'|'info'} [type='info']
   * @param {number} [duration=4000] ms; 0 = sticky
   */
  function show(messageOrOptions, type = 'info', duration = 4000) {
    const lang = document.documentElement.lang?.startsWith('hi') ? 'hi' : 'en';

    let title, message;
    if (typeof messageOrOptions === 'string') {
      message = messageOrOptions;
      title   = TITLES[lang][type] || type;
    } else {
      ({ title, message, type = 'info', duration = 4000 } = messageOrOptions);
      title = title || TITLES[lang][type];
    }

    const container = _getContainer();
    const toast     = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">${ICONS[type] || 'ℹ️'}</span>
      <div class="toast__body">
        ${title ? `<div class="toast__title">${title}</div>` : ''}
        <div class="toast__msg">${message}</div>
      </div>
      <button class="toast__close" aria-label="बंद करें">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('is-visible'));
    });

    // Close handler
    const dismiss = () => {
      toast.classList.remove('is-visible');
      toast.classList.add('is-hiding');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast__close').addEventListener('click', dismiss);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }

    return { dismiss };
  }

  /** Shortcut methods */
  const success = (msg, dur) => show(msg, 'success', dur);
  const error   = (msg, dur) => show(msg, 'error',   dur);
  const warning = (msg, dur) => show(msg, 'warning', dur);
  const info    = (msg, dur) => show(msg, 'info',    dur);

  return { show, success, error, warning, info };
})();

if (typeof window !== 'undefined') window.Toast = Toast;
