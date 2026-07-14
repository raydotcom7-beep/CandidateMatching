/* ============================================================
   VALIDATION.JS — Form Validation Engine
   File: assets/js/common/validation.js

   Declarative, field-level form validation engine.
   - Rule-based: required, minLength, maxLength, pattern,
     email, phone, aadhaar, pan, pincode, gst, ifsc,
     numeric, date, min, max, custom.
   - DOM-aware: reads [data-rules], [data-label] attributes.
   - Bilingual: error messages in Hindi + English.
   - Non-destructive: works on any <form>.

   Usage:
     import Validator from '../../assets/js/common/validation.js';
     const v = new Validator('#my-form', { lang: 'hi' });
     form.addEventListener('submit', e => {
       if (!v.validate()) { e.preventDefault(); }
     });
   ============================================================ */

'use strict';


/* ── Bilingual Error Message Catalogue ─────────────────────── */

const MESSAGES = {
  hi: {
    required:     (label) => `${label} आवश्यक है।`,
    minLength:    (label, n) => `${label} कम से कम ${n} अक्षर होना चाहिए।`,
    maxLength:    (label, n) => `${label} अधिकतम ${n} अक्षर हो सकता है।`,
    email:        (label) => `${label} मान्य ईमेल पता होना चाहिए।`,
    phone:        (label) => `${label} 10 अंकों का मोबाइल नंबर होना चाहिए।`,
    aadhaar:      (label) => `${label} 12 अंकों का वैध आधार नंबर होना चाहिए।`,
    pan:          (label) => `${label} वैध PAN कार्ड नंबर होना चाहिए (जैसे: ABCDE1234F)।`,
    pincode:      (label) => `${label} 6 अंकों का वैध पिन कोड होना चाहिए।`,
    gst:          (label) => `${label} वैध GSTIN होना चाहिए।`,
    ifsc:         (label) => `${label} वैध IFSC कोड होना चाहिए (जैसे: SBIN0001234)।`,
    numeric:      (label) => `${label} में केवल अंक होने चाहिए।`,
    alpha:        (label) => `${label} में केवल अक्षर होने चाहिए।`,
    alphanumeric: (label) => `${label} में केवल अक्षर और अंक होने चाहिए।`,
    date:         (label) => `${label} मान्य दिनांक होनी चाहिए।`,
    min:          (label, n) => `${label} कम से कम ${n} होना चाहिए।`,
    max:          (label, n) => `${label} अधिकतम ${n} हो सकता है।`,
    minDate:      (label, d) => `${label} ${d} के बाद या उसी दिन होनी चाहिए।`,
    maxDate:      (label, d) => `${label} ${d} से पहले या उसी दिन होनी चाहिए।`,
    pattern:      (label) => `${label} का प्रारूप सही नहीं है।`,
    checked:      (label) => `${label} स्वीकार करना आवश्यक है।`,
    fileSize:     (label, n) => `${label} का आकार ${n}MB से अधिक नहीं होना चाहिए।`,
    fileType:     (label, types) => `${label} केवल ${types} फ़ाइलें स्वीकार्य हैं।`,
    match:        (label) => `${label} मेल नहीं खाता।`,
    custom:       (label) => `${label} मान्य नहीं है।`,
  },
  en: {
    required:     (label) => `${label} is required.`,
    minLength:    (label, n) => `${label} must be at least ${n} characters.`,
    maxLength:    (label, n) => `${label} must not exceed ${n} characters.`,
    email:        (label) => `${label} must be a valid email address.`,
    phone:        (label) => `${label} must be a valid 10-digit mobile number.`,
    aadhaar:      (label) => `${label} must be a valid 12-digit Aadhaar number.`,
    pan:          (label) => `${label} must be a valid PAN number (e.g. ABCDE1234F).`,
    pincode:      (label) => `${label} must be a valid 6-digit PIN code.`,
    gst:          (label) => `${label} must be a valid GSTIN.`,
    ifsc:         (label) => `${label} must be a valid IFSC code (e.g. SBIN0001234).`,
    numeric:      (label) => `${label} must contain only digits.`,
    alpha:        (label) => `${label} must contain only letters.`,
    alphanumeric: (label) => `${label} must contain only letters and digits.`,
    date:         (label) => `${label} must be a valid date.`,
    min:          (label, n) => `${label} must be at least ${n}.`,
    max:          (label, n) => `${label} must not exceed ${n}.`,
    minDate:      (label, d) => `${label} must be on or after ${d}.`,
    maxDate:      (label, d) => `${label} must be on or before ${d}.`,
    pattern:      (label) => `${label} format is invalid.`,
    checked:      (label) => `${label} must be accepted.`,
    fileSize:     (label, n) => `${label} must not exceed ${n}MB.`,
    fileType:     (label, types) => `${label} only accepts ${types} files.`,
    match:        (label) => `${label} does not match.`,
    custom:       (label) => `${label} is not valid.`,
  },
};


/* ── Built-in Rule Patterns ────────────────────────────────── */

const PATTERNS = {
  email:        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:        /^[6-9]\d{9}$/,
  aadhaar:      /^\d{12}$/,
  pan:          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  pincode:      /^\d{6}$/,
  gst:          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  ifsc:         /^[A-Z]{4}0[A-Z0-9]{6}$/,
  numeric:      /^\d+$/,
  alpha:        /^[a-zA-Z\u0900-\u097F\s]+$/,   // Latin + Devanagari letters
  alphanumeric: /^[a-zA-Z0-9\u0900-\u097F\s]+$/,
};


/* ── Validator Class ───────────────────────────────────────── */

class Validator {
  /**
   * @param {string|HTMLFormElement} formSelector
   * @param {Object} [options]
   * @param {'hi'|'en'} [options.lang='hi']       — Message language
   * @param {boolean}  [options.liveValidation=true] — Validate on blur
   * @param {boolean}  [options.scrollToError=true]  — Scroll to first error
   * @param {string}   [options.errorClass='form-group--error']
   * @param {string}   [options.successClass='form-group--success']
   * @param {string}   [options.errorTextSelector='.form-error-text']
   */
  constructor(formSelector, options = {}) {
    this.form = typeof formSelector === 'string'
      ? document.querySelector(formSelector)
      : formSelector;

    if (!this.form) {
      console.warn(`[Validator] Form not found: ${formSelector}`);
      return;
    }

    this.options = {
      lang:              options.lang            || 'hi',
      liveValidation:    options.liveValidation  !== false,
      scrollToError:     options.scrollToError   !== false,
      errorClass:        options.errorClass       || 'form-group--error',
      successClass:      options.successClass     || 'form-group--success',
      errorTextSelector: options.errorTextSelector || '.form-error-text',
    };

    /** @type {Map<string, Function[]>} custom rule registry */
    this._customRules = new Map();

    /** @type {Object[]} last validation errors */
    this.errors = [];

    if (this.options.liveValidation) {
      this._bindLiveValidation();
    }
  }


  /* ── Language ──────────────────────────────────────────── */

  /**
   * Switch message language at runtime
   * @param {'hi'|'en'} lang
   */
  setLanguage(lang) {
    if (['hi', 'en'].includes(lang)) {
      this.options.lang = lang;
    }
  }


  /* ── Custom Rule Registration ──────────────────────────── */

  /**
   * Register a named custom validation rule
   * @param {string} name — rule name (matches [data-rule-custom] value)
   * @param {Function} fn — (value, field) => true | errorMessage
   */
  addRule(name, fn) {
    this._customRules.set(name, fn);
  }


  /* ── Main Validate ─────────────────────────────────────── */

  /**
   * Validate all fields in the form.
   * @returns {boolean} — true if all fields pass
   */
  validate() {
    this.errors = [];
    const fields = this._getValidatableFields();

    fields.forEach(field => {
      const result = this._validateField(field);
      if (result) {
        this.errors.push({ field, message: result });
      }
    });

    if (this.errors.length > 0) {
      if (this.options.scrollToError) {
        this._scrollToFirstError();
      }
      this.form.dispatchEvent(new CustomEvent('validation:failed', {
        bubbles: true,
        detail: { errors: this.errors },
      }));
      return false;
    }

    this.form.dispatchEvent(new CustomEvent('validation:passed', { bubbles: true }));
    return true;
  }

  /**
   * Validate a single field by element reference or name
   * @param {HTMLElement|string} field
   * @returns {boolean}
   */
  validateField(field) {
    const el = typeof field === 'string'
      ? this.form.querySelector(`[name="${field}"]`)
      : field;
    if (!el) return true;
    const error = this._validateField(el);
    return !error;
  }

  /**
   * Clear all validation states
   */
  clearAll() {
    this._getValidatableFields().forEach(field => {
      this._clearFieldState(field);
    });
    this.errors = [];
  }

  /**
   * Clear a single field's validation state
   * @param {HTMLElement|string} field
   */
  clearField(field) {
    const el = typeof field === 'string'
      ? this.form.querySelector(`[name="${field}"]`)
      : field;
    if (el) this._clearFieldState(el);
  }


  /* ── Internal: Field Discovery ─────────────────────────── */

  _getValidatableFields() {
    const inputs = Array.from(
      this.form.querySelectorAll('input, select, textarea')
    );
    return inputs.filter(el => {
      // Skip hidden, disabled, or fields with no rules defined
      if (el.disabled || el.type === 'hidden') return false;
      // Include if it has a data-rules attribute OR is required
      return el.dataset.rules || el.required;
    });
  }


  /* ── Internal: Single Field Validation ─────────────────── */

  /**
   * @param {HTMLElement} field
   * @returns {string|null} — error message or null if valid
   */
  _validateField(field) {
    const rules = this._parseRules(field);
    const value = this._getValue(field);
    const label = field.dataset.label
      || field.getAttribute('aria-label')
      || field.placeholder
      || field.name
      || 'यह फ़ील्ड';

    const messages = MESSAGES[this.options.lang] || MESSAGES.hi;
    let errorMsg = null;

    for (const rule of rules) {
      const { name, param } = rule;

      switch (name) {

        /* ── Presence ── */
        case 'required':
          if (field.type === 'checkbox') {
            if (!field.checked) errorMsg = messages.checked(label);
          } else if (field.type === 'radio') {
            const radios = this.form.querySelectorAll(`[name="${field.name}"]`);
            const anyChecked = Array.from(radios).some(r => r.checked);
            if (!anyChecked) errorMsg = messages.required(label);
          } else if (!value || value.trim() === '') {
            errorMsg = messages.required(label);
          }
          break;

        /* ── Length ── */
        case 'minLength':
          if (value && value.length < Number(param)) {
            errorMsg = messages.minLength(label, param);
          }
          break;

        case 'maxLength':
          if (value && value.length > Number(param)) {
            errorMsg = messages.maxLength(label, param);
          }
          break;

        /* ── Format ── */
        case 'email':
          if (value && !PATTERNS.email.test(value)) {
            errorMsg = messages.email(label);
          }
          break;

        case 'phone':
          if (value && !PATTERNS.phone.test(value.replace(/\s/g, ''))) {
            errorMsg = messages.phone(label);
          }
          break;

        case 'aadhaar':
          if (value && !PATTERNS.aadhaar.test(value.replace(/\s/g, ''))) {
            errorMsg = messages.aadhaar(label);
          }
          break;

        case 'pan':
          if (value && !PATTERNS.pan.test(value.toUpperCase())) {
            errorMsg = messages.pan(label);
          }
          break;

        case 'pincode':
          if (value && !PATTERNS.pincode.test(value)) {
            errorMsg = messages.pincode(label);
          }
          break;

        case 'gst':
          if (value && !PATTERNS.gst.test(value.toUpperCase())) {
            errorMsg = messages.gst(label);
          }
          break;

        case 'ifsc':
          if (value && !PATTERNS.ifsc.test(value.toUpperCase())) {
            errorMsg = messages.ifsc(label);
          }
          break;

        case 'numeric':
          if (value && !PATTERNS.numeric.test(value)) {
            errorMsg = messages.numeric(label);
          }
          break;

        case 'alpha':
          if (value && !PATTERNS.alpha.test(value)) {
            errorMsg = messages.alpha(label);
          }
          break;

        case 'alphanumeric':
          if (value && !PATTERNS.alphanumeric.test(value)) {
            errorMsg = messages.alphanumeric(label);
          }
          break;

        /* ── Numeric Bounds ── */
        case 'min':
          if (value !== '' && Number(value) < Number(param)) {
            errorMsg = messages.min(label, param);
          }
          break;

        case 'max':
          if (value !== '' && Number(value) > Number(param)) {
            errorMsg = messages.max(label, param);
          }
          break;

        /* ── Date ── */
        case 'date': {
          const d = new Date(value);
          if (value && isNaN(d.getTime())) {
            errorMsg = messages.date(label);
          }
          break;
        }

        case 'minDate': {
          const d = new Date(value);
          const minD = new Date(param);
          if (value && !isNaN(d.getTime()) && d < minD) {
            errorMsg = messages.minDate(label, this._formatDate(minD));
          }
          break;
        }

        case 'maxDate': {
          const d = new Date(value);
          const maxD = new Date(param);
          if (value && !isNaN(d.getTime()) && d > maxD) {
            errorMsg = messages.maxDate(label, this._formatDate(maxD));
          }
          break;
        }

        /* ── Pattern (custom regex) ── */
        case 'pattern': {
          try {
            const regex = new RegExp(param);
            if (value && !regex.test(value)) {
              errorMsg = messages.pattern(label);
            }
          } catch (_) {
            console.warn(`[Validator] Invalid regex pattern: ${param}`);
          }
          break;
        }

        /* ── File Validation ── */
        case 'fileSize': {
          if (field.type === 'file' && field.files && field.files[0]) {
            const sizeMB = field.files[0].size / (1024 * 1024);
            if (sizeMB > Number(param)) {
              errorMsg = messages.fileSize(label, param);
            }
          }
          break;
        }

        case 'fileType': {
          if (field.type === 'file' && field.files && field.files[0]) {
            const allowed = param.split(',').map(t => t.trim().toLowerCase());
            const ext = field.files[0].name.split('.').pop().toLowerCase();
            if (!allowed.includes(ext)) {
              errorMsg = messages.fileType(label, param);
            }
          }
          break;
        }

        /* ── Match (confirm password) ── */
        case 'match': {
          const targetField = this.form.querySelector(`[name="${param}"]`);
          if (targetField && value !== targetField.value) {
            errorMsg = messages.match(label);
          }
          break;
        }

        /* ── Custom (registered rule) ── */
        case 'custom': {
          const ruleFn = this._customRules.get(param);
          if (ruleFn) {
            const result = ruleFn(value, field);
            if (result !== true) {
              errorMsg = typeof result === 'string' ? result : messages.custom(label);
            }
          } else {
            console.warn(`[Validator] Custom rule not found: ${param}`);
          }
          break;
        }

        default:
          console.warn(`[Validator] Unknown rule: ${name}`);
          break;
      }

      // Stop on first error per field
      if (errorMsg) break;
    }

    // Apply DOM state
    if (errorMsg) {
      this._setFieldError(field, errorMsg);
    } else if (value || field.type === 'checkbox' || field.type === 'radio') {
      this._setFieldSuccess(field);
    }

    return errorMsg;
  }


  /* ── Internal: Rule Parsing ────────────────────────────── */

  /**
   * Parse rules from [data-rules] attribute.
   * Format: "required|minLength:3|maxLength:50|email"
   * @param {HTMLElement} field
   * @returns {Array<{name: string, param: string|null}>}
   */
  _parseRules(field) {
    const rules = [];

    // Collect from [data-rules] attribute
    const rulesAttr = field.dataset.rules || '';
    if (rulesAttr) {
      rulesAttr.split('|').forEach(ruleStr => {
        const [name, param] = ruleStr.trim().split(':');
        if (name) rules.push({ name: name.trim(), param: param || null });
      });
    }

    // Also honour native HTML attributes if not already in rules list
    const hasRule = (n) => rules.some(r => r.name === n);

    if (field.required && !hasRule('required')) {
      rules.unshift({ name: 'required', param: null });
    }
    if (field.type === 'email' && !hasRule('email')) {
      rules.push({ name: 'email', param: null });
    }
    if (field.minLength > 0 && !hasRule('minLength')) {
      rules.push({ name: 'minLength', param: String(field.minLength) });
    }
    if (field.maxLength > 0 && field.maxLength < 32767 && !hasRule('maxLength')) {
      rules.push({ name: 'maxLength', param: String(field.maxLength) });
    }

    return rules;
  }

  /**
   * Get the current value of a field
   * @param {HTMLElement} field
   * @returns {string}
   */
  _getValue(field) {
    if (field.type === 'checkbox') return field.checked ? 'true' : '';
    if (field.type === 'radio') return field.checked ? field.value : '';
    return (field.value || '').trim();
  }


  /* ── Internal: DOM State Management ───────────────────── */

  /**
   * Find the wrapping .form-group container for a field
   * @param {HTMLElement} field
   * @returns {HTMLElement|null}
   */
  _getFormGroup(field) {
    return field.closest('.form-group') || field.closest('.form-field') || null;
  }

  _setFieldError(field, message) {
    const group = this._getFormGroup(field);
    if (group) {
      group.classList.add(this.options.errorClass);
      group.classList.remove(this.options.successClass);
    }

    // Update error text element
    const errorEl = group
      ? group.querySelector(this.options.errorTextSelector)
      : document.getElementById(`${field.id}-error`);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      errorEl.setAttribute('role', 'alert');
    }

    field.setAttribute('aria-invalid', 'true');
    if (errorEl && errorEl.id) {
      field.setAttribute('aria-describedby', errorEl.id);
    }

    field.dispatchEvent(new CustomEvent('field:error', {
      bubbles: true,
      detail: { message },
    }));
  }

  _setFieldSuccess(field) {
    const group = this._getFormGroup(field);
    if (group) {
      group.classList.remove(this.options.errorClass);
      group.classList.add(this.options.successClass);
    }

    const errorEl = group
      ? group.querySelector(this.options.errorTextSelector)
      : document.getElementById(`${field.id}-error`);

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
  }

  _clearFieldState(field) {
    const group = this._getFormGroup(field);
    if (group) {
      group.classList.remove(this.options.errorClass, this.options.successClass);
    }

    const errorEl = group
      ? group.querySelector(this.options.errorTextSelector)
      : null;

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }


  /* ── Internal: Live Validation ─────────────────────────── */

  _bindLiveValidation() {
    // Validate on blur (when user leaves a field)
    this.form.addEventListener('blur', (e) => {
      const field = e.target;
      if (field.matches('input, select, textarea') && !field.disabled) {
        if (field.dataset.rules || field.required) {
          this._validateField(field);
        }
      }
    }, true);

    // For select and checkbox/radio — validate immediately on change
    this.form.addEventListener('change', (e) => {
      const field = e.target;
      if (field.matches('select, input[type="checkbox"], input[type="radio"]')) {
        if (field.dataset.rules || field.required) {
          this._validateField(field);
        }
      }
    });

    // Clear error while typing (after first blur)
    this.form.addEventListener('input', (e) => {
      const field = e.target;
      const group = this._getFormGroup(field);
      if (group && group.classList.contains(this.options.errorClass)) {
        // Re-validate silently (no scroll) on input
        this._validateField(field);
      }
    });
  }


  /* ── Internal: Scroll to First Error ──────────────────── */

  _scrollToFirstError() {
    const firstError = this.form.querySelector(`.${this.options.errorClass}`);
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = firstError.querySelector('input, select, textarea');
      if (input) input.focus({ preventScroll: true });
    }
  }


  /* ── Internal: Date Formatter ──────────────────────────── */

  _formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }


  /* ── Static: Quick-validate a single value without DOM ── */

  /**
   * Validate a raw value against a rule without touching the DOM.
   * Useful for async checks (OTP, username availability, etc.)
   * @param {'email'|'phone'|'aadhaar'|'pan'|'pincode'|'gst'|'ifsc'} rule
   * @param {string} value
   * @returns {boolean}
   */
  static test(rule, value) {
    if (!PATTERNS[rule]) return true;
    return PATTERNS[rule].test(value.trim());
  }
}


/* ── OTP Input Helper ──────────────────────────────────────── */

/**
 * Enhances a group of OTP input boxes for a polished UX.
 * Auto-focus next box, handle paste, handle backspace.
 *
 * HTML pattern expected:
 *   <div class="otp-group" data-otp-length="6">
 *     <input type="text" inputmode="numeric" maxlength="1" class="otp-input" />
 *     ...repeat...
 *   </div>
 *
 * @param {string|HTMLElement} containerSelector
 * @returns {{ getValue: () => string, reset: () => void }}
 */
function initOTPInput(containerSelector) {
  const container = typeof containerSelector === 'string'
    ? document.querySelector(containerSelector)
    : containerSelector;

  if (!container) return null;

  const inputs = Array.from(container.querySelectorAll('.otp-input'));

  inputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? val[0] : '';
      if (val && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        inputs[idx - 1].focus();
        inputs[idx - 1].value = '';
      }
    });

    // Handle paste — distribute digits across inputs
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '');
      [...pasted].slice(0, inputs.length - idx).forEach((char, i) => {
        if (inputs[idx + i]) {
          inputs[idx + i].value = char;
        }
      });
      const nextEmpty = inputs.find(inp => !inp.value);
      if (nextEmpty) nextEmpty.focus();
      else inputs[inputs.length - 1].focus();
    });
  });

  return {
    /** Get full OTP string */
    getValue: () => inputs.map(i => i.value).join(''),
    /** Clear all OTP inputs */
    reset: () => {
      inputs.forEach(i => (i.value = ''));
      inputs[0].focus();
    },
  };
}


if (typeof window !== 'undefined') {
  window.Validator = Validator;
  window.initOTPInput = initOTPInput;
  window.PATTERNS = PATTERNS;
  window.MESSAGES = MESSAGES;
}
