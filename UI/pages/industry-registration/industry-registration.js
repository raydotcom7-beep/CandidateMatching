/* ============================================================
   INDUSTRY REGISTRATION JS
   pages/industry-registration/industry-registration.js
   ============================================================ */
// All dependencies loaded as plain <script> tags (I18n, Validator, initOTPInput, Toast)

// ── Language & year ──────────────────────────────────────────
const lang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';

I18n.extend('hi', {
  'reg.step.mobile': 'मोबाइल सत्यापन',
  'reg.mobile.title': 'प्रबंधक / मालिक का मोबाइल सत्यापन',
  'reg.mobile.subtitle': 'उद्योग पंजीकरण के लिए अधिकृत व्यक्ति का मोबाइल OTP से सत्यापन करें।',
  'reg.step.industry_details': 'उद्योग विवरण',
  'form.industry_name': 'उद्योग / कारखाने का नाम',
  'form.industry_type': 'उद्योग का प्रकार',
  'industry_type.manufacturing': 'विनिर्माण',
  'industry_type.construction': 'निर्माण',
  'industry_type.textile': 'वस्त्र उद्योग',
  'industry_type.food': 'खाद्य प्रसंस्करण',
  'industry_type.chemical': 'रसायन उद्योग',
  'industry_type.engineering': 'इंजीनियरिंग',
  'form.worker_count': 'कुल श्रमिक संख्या',
  'placeholder.worker_count': 'जैसे: 50',
  'form.industry_address': 'उद्योग का पूरा पता',
  'placeholder.industry_address': 'गाँव/मोहल्ला, तहसील, जिला',
  'doc.factory_license': 'कारखाना पंजीकरण प्रमाण-पत्र',
  'doc.gst_cert': 'GST प्रमाण-पत्र',
  'reg.review.declaration_ind': 'मैं प्रमाणित करता/करती हूं कि उपरोक्त सभी जानकारी सत्य है।',
  'reg.success.msg_ind': 'आपका उद्योग पंजीकरण सफलतापूर्वक जमा किया गया।',
  'reg.success.id_label_ind': 'उद्योग आईडी',
  'toast.ekyc_otp_sent': 'OTP भेज दिया गया।',
  'toast.ekyc_invalid_otp': 'कृपया 6 अंकों का OTP दर्ज करें।',
  'toast.ekyc_success': 'आधार सत्यापन सफल!',
  'toast.otp_resent': 'OTP पुनः भेजा गया।',
  'toast.invalid_ext': 'केवल {{ext}} फ़ाइलें मान्य हैं।',
  'toast.file_too_large': 'फ़ाइल {{maxMB}}MB से बड़ी नहीं होनी चाहिए।',
  'toast.doc_factory_license_required': 'कारखाना पंजीकरण प्रमाण-पत्र अपलोड करना अनिवार्य है।',
  'toast.doc_gst_cert_required': 'GST प्रमाण-पत्र अपलोड करना अनिवार्य है।',
  'toast.doc_pan_card_required': 'PAN कार्ड अपलोड करना अनिवार्य है।',
  'toast.accept_declaration': 'कृपया घोषणा स्वीकार करें।',
  'toast.submit_success': 'पंजीकरण सफलतापूर्वक जमा किया गया!',
  'reg.review.value_empty': '—',
  'reg.docs.title': 'दस्तावेज़ अपलोड',
  'reg.docs.hint_2mb': 'PDF — max 2MB',
  'reg.docs.upload_zone_text': 'फ़ाइल चुनें',
});

I18n.extend('en', {
  'reg.step.mobile': 'Mobile Verification',
  'reg.mobile.title': 'Manager / Owner Mobile Verification',
  'reg.mobile.subtitle': 'Verify the mobile number of the authorized person for industry registration via OTP.',
  'reg.step.industry_details': 'Industry Details',
  'form.industry_name': 'Industry / Factory Name',
  'form.industry_type': 'Industry Type',
  'industry_type.manufacturing': 'Manufacturing',
  'industry_type.construction': 'Construction',
  'industry_type.textile': 'Textiles',
  'industry_type.food': 'Food Processing',
  'industry_type.chemical': 'Chemicals',
  'industry_type.engineering': 'Engineering',
  'form.worker_count': 'Total Number of Workers',
  'placeholder.worker_count': 'e.g. 50',
  'form.industry_address': 'Full Address of Industry',
  'placeholder.industry_address': 'Village/Locality, Tehsil, District',
  'doc.factory_license': 'Factory Registration Certificate',
  'doc.gst_cert': 'GST Certificate',
  'reg.review.declaration_ind': 'I certify that all the information provided above is true.',
  'reg.success.msg_ind': 'Your industry registration has been submitted successfully.',
  'reg.success.id_label_ind': 'Industry ID',
  'toast.ekyc_otp_sent': 'OTP has been sent.',
  'toast.ekyc_invalid_otp': 'Please enter a 6-digit OTP.',
  'toast.ekyc_success': 'Aadhaar verification successful!',
  'toast.otp_resent': 'OTP resent successfully.',
  'toast.invalid_ext': 'Only {{ext}} files are allowed.',
  'toast.file_too_large': 'File must not exceed {{maxMB}}MB.',
  'toast.doc_factory_license_required': 'Factory registration certificate is required.',
  'toast.doc_gst_cert_required': 'GST certificate is required.',
  'toast.doc_pan_card_required': 'PAN card is required.',
  'toast.accept_declaration': 'Please accept the declaration.',
  'toast.submit_success': 'Registration submitted successfully!',
  'reg.review.value_empty': '—',
  'reg.docs.title': 'Document Upload',
  'reg.docs.hint_2mb': 'PDF — max 2MB',
  'reg.docs.upload_zone_text': 'Choose file',
});

I18n.init(lang);
I18n.setupToggleButton();

document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// ── Stepper ──────────────────────────────────────────────────
let currentStep = 1;
const TOTAL = 4;

function goToStep(n) {
  if (n < 1 || n > TOTAL) return;
  document.querySelectorAll('.step-panel').forEach(p => p.setAttribute('hidden', ''));
  document.getElementById(`step-panel-${n}`)?.removeAttribute('hidden');
  document.querySelectorAll('.stepper__item[data-step]').forEach(item => {
    const s = Number(item.dataset.step);
    item.classList.remove('stepper__item--active', 'stepper__item--done');
    if (s < n)  item.classList.add('stepper__item--done');
    if (s === n) item.classList.add('stepper__item--active');
  });
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Form State ────────────────────────────────────────────────
const state = {
  mobile: '',
  industry: {
    industryName: '',
    industryType: '',
    pan: '',
    gstin: '',
    workerCount: '',
    pincode: '',
    address: ''
  },
  documents: {
    factoryLicense: null,
    gstCert: null,
    panCard: null
  }
};

// ── Step 1: eKYC ─────────────────────────────────────────────
const vEkyc   = new Validator('#form-ekyc-i', { lang, liveValidation: true });
const otpGrp  = initOTPInput('#otp-group-i');
const ekycBtn = document.getElementById('ekyc-btn-i');
const otpSec  = document.getElementById('otp-sec-i');
let otpSent   = false;

ekycBtn.addEventListener('click', () => {
  if (!otpSent) {
    if (!vEkyc.validateField('mobile')) return;
    state.mobile = document.getElementById('mobile-i').value;
    otpSec.style.display = 'block';
    ekycBtn.setAttribute('data-i18n', 'reg.ekyc.verify');
    I18n.translateDOM(ekycBtn);
    otpSent = true;
    Toast.success(I18n.t('toast.ekyc_otp_sent'));
    document.getElementById('otp-i1').focus();
  } else {
    const otp = otpGrp?.getValue() || '';
    if (otp.length < 6) { Toast.error(I18n.t('toast.ekyc_invalid_otp')); return; }
    Toast.success(I18n.t('toast.ekyc_success'));
    goToStep(2);
  }
});

// ── Step 2: Industry Details ──────────────────────────────────
const vIndustry = new Validator('#form-industry', { lang, liveValidation: true });
document.getElementById('i-s2-back').addEventListener('click', () => goToStep(1));
document.getElementById('i-s2-next').addEventListener('click', () => {
  if (!vIndustry.validate()) return;
  const fd = new FormData(document.getElementById('form-industry'));
  fd.forEach((v, k) => state.industry[k] = v);
  goToStep(3);
});

// ── Step 3: Documents ─────────────────────────────────────────
function setupDocUpload(zoneId, listId, docKey, maxMB = 2, accept = ['jpg', 'jpeg', 'png', 'pdf']) {
  const zone  = document.getElementById(zoneId);
  const list  = document.getElementById(listId);
  const input = zone?.querySelector('input[type="file"]');
  if (!input || !zone) return;

  zone.addEventListener('click', () => input.click());
  ['dragenter', 'dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('drag-over'); }));
  ['dragleave', 'drop'].forEach(e  => zone.addEventListener(e, ev => { zone.classList.remove('drag-over'); }));
  zone.addEventListener('drop', ev => { ev.preventDefault(); handleFile(ev.dataTransfer.files[0]); });
  input.addEventListener('change', () => handleFile(input.files[0]));

  function handleFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!accept.includes(ext)) { Toast.error(I18n.t('toast.invalid_ext', { ext: accept.join(', ') })); return; }
    if (file.size > maxMB * 1024 * 1024) { Toast.error(I18n.t('toast.file_too_large', { maxMB })); return; }
    state.documents[docKey] = file;
    list.innerHTML = `<div class="upload-file-item">
      <div class="upload-file__icon">📎</div>
      <div class="upload-file__meta"><div class="upload-file__name">${file.name}</div><div class="upload-file__size">${(file.size / 1024).toFixed(0)} KB</div></div>
      <button class="upload-file__remove" aria-label="${I18n.t('action.delete')}" onclick="this.closest('.upload-file-item').remove();delete state.documents['${docKey}']">✕</button>
    </div>`;
    input.value = '';
  }
}

setupDocUpload('upload-factory-license', 'list-factory-license', 'factoryLicense', 2, ['pdf', 'jpg', 'jpeg']);
setupDocUpload('upload-gst-cert', 'list-gst-cert', 'gstCert', 2, ['pdf', 'jpg', 'jpeg']);
setupDocUpload('upload-pan-card', 'list-pan-card', 'panCard', 2, ['jpg', 'png', 'pdf', 'jpeg']);

document.getElementById('i-s3-back').addEventListener('click', () => goToStep(2));
document.getElementById('i-s3-next').addEventListener('click', () => {
  if (!state.documents.factoryLicense) { Toast.error(I18n.t('toast.doc_factory_license_required')); return; }
  if (!state.documents.gstCert)        { Toast.error(I18n.t('toast.doc_gst_cert_required')); return; }
  if (!state.documents.panCard)        { Toast.error(I18n.t('toast.doc_pan_card_required')); return; }
  _renderReview();
  goToStep(4);
});

// ── Step 4: Review & Submit ───────────────────────────────────
function _renderReview() {
  const p = state.industry;
  const industryTypeLabel = p.industryType ? I18n.t('industry_type.' + p.industryType) : I18n.t('reg.review.value_empty');
  document.getElementById('review-body-i').innerHTML = `
    <div class="review-section">
      <div class="review-section__title">${I18n.t('reg.step.industry_details')}</div>
      <div class="review-grid">
        <div class="review-item"><div class="review-item__key">${I18n.t('form.industry_name')}</div><div class="review-item__value">${p.industryName || I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.industry_type')}</div><div class="review-item__value">${industryTypeLabel}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.pan')}</div><div class="review-item__value">${p.pan || I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.gstin')}</div><div class="review-item__value">${p.gstin || I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.worker_count')}</div><div class="review-item__value">${p.workerCount || I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.pincode')}</div><div class="review-item__value">${p.pincode || I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.industry_address')}</div><div class="review-item__value">${p.address || I18n.t('reg.review.value_empty')}</div></div>
      </div>
    </div>`;
}

document.getElementById('i-s4-back').addEventListener('click', () => goToStep(3));
document.getElementById('i-submit').addEventListener('click', () => {
  const decl = document.getElementById('decl-i');
  if (!decl.checked) { Toast.error(I18n.t('toast.accept_declaration')); return; }

  const id = 'MP-IND-' + Date.now().toString().slice(-8);
  document.querySelectorAll('.step-panel').forEach(p => p.setAttribute('hidden', ''));
  document.querySelectorAll('.stepper__item[data-step]').forEach(i => i.classList.add('stepper__item--done'));
  document.getElementById('reg-success').removeAttribute('hidden');
  document.getElementById('industry-reg-id').textContent = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  Toast.success(I18n.t('toast.submit_success'));
});

// ── Language Switcher Event ──────────────────────────────────
document.addEventListener('i18n:languageChanged', (e) => {
  const currentLang = e.detail.language;
  I18n.translateDOM();
  vEkyc.setLanguage(currentLang);
  vIndustry.setLanguage(currentLang);
  if (currentStep === 4) {
    _renderReview();
  }
});
