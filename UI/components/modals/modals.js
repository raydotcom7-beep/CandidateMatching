/* ============================================================
   MODALS.JS — Modal Manager
   File: components/modals/modals.js

   Usage:
     import Modal from '../../components/modals/modals.js';

     // Open by ID
     Modal.open('confirm-delete');

     // Or: create + open programmatically
     const m = new Modal({
       title: 'पुष्टि करें', size: 'sm',
       content: '<p>क्या आप हटाना चाहते हैं?</p>',
       onConfirm: () => deleteRecord(),
     });
     m.open();
   ============================================================ */
'use strict';

class Modal {
  /**
   * @param {Object|string} options — config object OR selector of existing modal-backdrop
   */
  constructor(options = {}) {
    if (typeof options === 'string') {
      // Attach to existing DOM element
      this._backdrop = document.querySelector(options);
      if (!this._backdrop) throw new Error(`[Modal] Element not found: ${options}`);
      this._attach();
      return;
    }

    const {
      id        = `modal-${Date.now()}`,
      title     = '',
      content   = '',
      size      = 'md',
      type      = 'default',    // 'default' | 'confirm'
      confirmText   = 'पुष्टि करें',
      cancelText    = 'रद्द करें',
      onConfirm = null,
      onCancel  = null,
      onClose   = null,
    } = options;

    this._id       = id;
    this._onConfirm = onConfirm;
    this._onCancel  = onCancel;
    this._onClose   = onClose;

    const iconHtml = type === 'confirm'
      ? `<div class="confirm__icon confirm__icon--warning" aria-hidden="true">⚠️</div>` : '';

    this._backdrop = document.createElement('div');
    this._backdrop.className = 'modal-backdrop';
    this._backdrop.id = `${id}-backdrop`;
    this._backdrop.setAttribute('role', 'dialog');
    this._backdrop.setAttribute('aria-modal', 'true');
    this._backdrop.setAttribute('aria-labelledby', `${id}-title`);

    this._backdrop.innerHTML = `
      <div class="modal modal--${size}${type === 'confirm' ? ' modal--confirm' : ''}" role="document">
        <div class="modal__header">
          <h2 class="modal__title" id="${id}-title">${title}</h2>
          <button class="modal__close js-modal-close" aria-label="बंद करें">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal__body">
          ${iconHtml}
          ${type === 'confirm' ? `<h3 class="confirm__title">${title}</h3><p class="confirm__msg">${content}</p>` : content}
        </div>
        ${type === 'confirm' || onConfirm ? `
        <div class="modal__footer">
          <button class="btn btn--ghost js-modal-cancel">${cancelText}</button>
          <button class="btn btn--primary js-modal-confirm">${confirmText}</button>
        </div>` : ''}
      </div>`;

    document.body.appendChild(this._backdrop);
    this._attach();
  }

  /* ── Internal: wire up events ─────────────────────────────── */
  _attach() {
    // Close button
    this._backdrop.querySelector('.js-modal-close')?.addEventListener('click', () => this.close());

    // Cancel button
    this._backdrop.querySelector('.js-modal-cancel')?.addEventListener('click', () => {
      if (this._onCancel) this._onCancel();
      this.close();
    });

    // Confirm button
    this._backdrop.querySelector('.js-modal-confirm')?.addEventListener('click', () => {
      if (this._onConfirm) this._onConfirm();
      this.close();
    });

    // Backdrop click to close
    this._backdrop.addEventListener('click', (e) => {
      if (e.target === this._backdrop) this.close();
    });

    // ESC key
    this._escHandler = (e) => { if (e.key === 'Escape') this.close(); };
  }

  /* ── Open ─────────────────────────────────────────────────── */
  open() {
    this._backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._escHandler);

    // Focus first focusable element
    requestAnimationFrame(() => {
      const focusable = this._backdrop.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    });

    this._backdrop.dispatchEvent(new CustomEvent('modal:opened', { bubbles: true }));
    return this;
  }

  /* ── Close ────────────────────────────────────────────────── */
  close() {
    this._backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._escHandler);

    if (this._onClose) this._onClose();
    this._backdrop.dispatchEvent(new CustomEvent('modal:closed', { bubbles: true }));
    return this;
  }

  /* ── Destroy ──────────────────────────────────────────────── */
  destroy() {
    this.close();
    setTimeout(() => this._backdrop.remove(), 300);
  }

  /* ── Static: open by backdrop ID ─────────────────────────── */
  static open(backdropId) {
    const el = document.getElementById(backdropId);
    if (!el) return console.warn(`[Modal] Not found: #${backdropId}`);
    const m = new Modal(`#${backdropId}`);
    m.open();
    return m;
  }

  /* ── Static: confirm dialog shortcut ─────────────────────── */
  static confirm({ title = 'पुष्टि करें', message, onConfirm, confirmText, cancelText } = {}) {
    const m = new Modal({ title, content: message, type: 'confirm', size: 'sm', onConfirm, confirmText, cancelText });
    m.open();
    return m;
  }
}

export default Modal;
