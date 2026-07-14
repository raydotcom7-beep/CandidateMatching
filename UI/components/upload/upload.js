/* ============================================================
   UPLOAD.JS — Drag-and-Drop File Upload Component
   File: components/upload/upload.js

   Usage:
     import FileUpload from '../../components/upload/upload.js';
     const uploader = new FileUpload('#doc-upload', {
       accept:   ['pdf','jpg','png'],
       maxSizeMB: 2,
       multiple:  false,
       lang:      'hi',
       onChange:  (files) => console.log(files),
     });
   ============================================================ */
'use strict';

const EXT_ICONS = { pdf: '📄', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', default: '📎' };

const MSG = {
  hi: {
    dropTitle:  'यहाँ फ़ाइल छोड़ें या',
    dropBrowse: 'फ़ाइल चुनें',
    maxSize:    (n) => `अधिकतम ${n}MB प्रत्येक फ़ाइल`,
    errSize:    (n, max) => `${n} बहुत बड़ी है (अधिकतम ${max}MB)`,
    errType:    (n, types) => `${n} अस्वीकृत प्रकार (केवल ${types} मान्य)`,
    remove:     'हटाएं',
  },
  en: {
    dropTitle:  'Drop file here or',
    dropBrowse: 'browse',
    maxSize:    (n) => `Max ${n}MB per file`,
    errSize:    (n, max) => `${n} exceeds ${max}MB`,
    errType:    (n, types) => `${n} type not allowed (${types} only)`,
    remove:     'Remove',
  },
};

class FileUpload {
  constructor(containerSelector, options = {}) {
    this._el = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!this._el) { console.warn(`[FileUpload] Not found: ${containerSelector}`); return; }

    const {
      accept    = [],
      maxSizeMB = 5,
      multiple  = true,
      lang      = 'hi',
      onChange  = null,
      preview   = false,
    } = options;

    this._accept    = accept.map(e => e.toLowerCase());
    this._maxSizeMB = maxSizeMB;
    this._multiple  = multiple;
    this._lang      = MSG[lang] || MSG.hi;
    this._onChange  = onChange;
    this._preview   = preview;
    this._files     = [];

    this._build();
    this._bind();
  }

  /* ── Build DOM ────────────────────────────────────────────── */
  _build() {
    const acceptAttr = this._accept.map(e => `.${e}`).join(',');
    this._el.innerHTML = `
      <div class="upload-zone" id="${this._el.id}-zone" tabindex="0" role="button"
           aria-label="फ़ाइल अपलोड क्षेत्र">
        <input type="file" class="upload-zone__input"
               ${this._multiple ? 'multiple' : ''}
               ${acceptAttr ? `accept="${acceptAttr}"` : ''}
               aria-hidden="true" tabindex="-1" />
        <div class="upload-zone__icon" aria-hidden="true">☁️</div>
        <p class="upload-zone__title">
          ${this._lang.dropTitle}
          <strong class="upload-zone__browse">${this._lang.dropBrowse}</strong>
        </p>
        <p class="upload-zone__hint">${this._lang.maxSize(this._maxSizeMB)}</p>
        <p class="upload-zone__error" id="${this._el.id}-error" role="alert" style="display:none"></p>
      </div>
      <div class="upload-file-list" id="${this._el.id}-list"></div>
      ${this._preview ? `<div class="upload-preview" id="${this._el.id}-preview"></div>` : ''}`;

    this._zone      = this._el.querySelector('.upload-zone');
    this._input     = this._el.querySelector('.upload-zone__input');
    this._list      = this._el.querySelector('.upload-file-list');
    this._errorEl   = this._el.querySelector('.upload-zone__error');
    this._previewEl = this._el.querySelector('.upload-preview');
  }

  /* ── Bind Events ──────────────────────────────────────────── */
  _bind() {
    // Click to open file picker
    this._zone.addEventListener('click', () => this._input.click());
    this._zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._input.click(); }
    });

    // File input change
    this._input.addEventListener('change', () => this._handleFiles(Array.from(this._input.files)));

    // Drag events
    ['dragenter', 'dragover'].forEach(ev => {
      this._zone.addEventListener(ev, (e) => { e.preventDefault(); this._zone.classList.add('drag-over'); });
    });
    ['dragleave', 'dragend', 'drop'].forEach(ev => {
      this._zone.addEventListener(ev, () => this._zone.classList.remove('drag-over'));
    });
    this._zone.addEventListener('drop', (e) => {
      e.preventDefault();
      this._handleFiles(Array.from(e.dataTransfer.files));
    });
  }

  /* ── Handle Files ─────────────────────────────────────────── */
  _handleFiles(incoming) {
    this._clearError();

    if (!this._multiple) {
      this._files = [];
      this._list.innerHTML = '';
      if (this._previewEl) this._previewEl.innerHTML = '';
    }

    incoming.forEach(file => {
      const ext     = file.name.split('.').pop().toLowerCase();
      const sizeMB  = file.size / (1024 * 1024);
      let   errMsg  = null;

      if (this._accept.length && !this._accept.includes(ext)) {
        errMsg = this._lang.errType(file.name, this._accept.join(', '));
      } else if (sizeMB > this._maxSizeMB) {
        errMsg = this._lang.errSize(file.name, this._maxSizeMB);
      }

      const entry = { file, ext, sizeMB, error: errMsg, id: `${Date.now()}-${Math.random()}` };
      this._files.push(entry);
      this._renderFileItem(entry);

      if (errMsg) this._showError(errMsg);
      else if (this._preview && file.type.startsWith('image/')) {
        this._renderPreview(entry);
      }
    });

    this._input.value = '';
    if (this._onChange) this._onChange(this._getValidFiles());
    this._el.dispatchEvent(new CustomEvent('upload:change', {
      bubbles: true, detail: { files: this._getValidFiles() }
    }));
  }

  /* ── Render File Item ─────────────────────────────────────── */
  _renderFileItem(entry) {
    const icon = EXT_ICONS[entry.ext] || EXT_ICONS.default;
    const size = entry.sizeMB < 1
      ? `${(entry.file.size / 1024).toFixed(1)} KB`
      : `${entry.sizeMB.toFixed(1)} MB`;

    const item = document.createElement('div');
    item.className = `upload-file-item${entry.error ? ' upload-file-item--error' : ''}`;
    item.dataset.id = entry.id;
    item.innerHTML = `
      <div class="upload-file__icon" aria-hidden="true">${icon}</div>
      <div class="upload-file__meta">
        <div class="upload-file__name" title="${entry.file.name}">${entry.file.name}</div>
        ${entry.error
          ? `<div class="upload-file__err">${entry.error}</div>`
          : `<div class="upload-file__size">${size}</div>`}
      </div>
      <button class="upload-file__remove" aria-label="${this._lang.remove} ${entry.file.name}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;

    item.querySelector('.upload-file__remove').addEventListener('click', () => this._removeFile(entry.id));
    this._list.appendChild(item);
  }

  /* ── Render Preview ───────────────────────────────────────── */
  _renderPreview(entry) {
    if (!this._previewEl) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const thumb = document.createElement('div');
      thumb.className = 'upload-preview__item';
      thumb.dataset.id = entry.id;
      thumb.innerHTML = `
        <img src="${e.target.result}" alt="${entry.file.name}" />
        <button class="upload-preview__remove" aria-label="हटाएं">×</button>`;
      thumb.querySelector('button').addEventListener('click', () => this._removeFile(entry.id));
      this._previewEl.appendChild(thumb);
    };
    reader.readAsDataURL(entry.file);
  }

  /* ── Remove File ──────────────────────────────────────────── */
  _removeFile(id) {
    this._files = this._files.filter(f => f.id !== id);
    this._list.querySelector(`[data-id="${id}"]`)?.remove();
    this._previewEl?.querySelector(`[data-id="${id}"]`)?.remove();
    if (this._onChange) this._onChange(this._getValidFiles());
    this._el.dispatchEvent(new CustomEvent('upload:change', {
      bubbles: true, detail: { files: this._getValidFiles() }
    }));
  }

  _showError(msg)  { this._errorEl.textContent = msg; this._errorEl.style.display = 'flex'; this._zone.classList.add('has-error'); }
  _clearError()    { this._errorEl.style.display = 'none'; this._zone.classList.remove('has-error'); }
  _getValidFiles() { return this._files.filter(f => !f.error).map(f => f.file); }

  /* ── Public API ───────────────────────────────────────────── */
  getFiles()  { return this._getValidFiles(); }
  reset()     { this._files = []; this._list.innerHTML = ''; if (this._previewEl) this._previewEl.innerHTML = ''; this._clearError(); }
}

export default FileUpload;
