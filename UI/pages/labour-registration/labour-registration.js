/* ============================================================
   LABOUR REGISTRATION JS
   pages/labour-registration/labour-registration.js
   ============================================================ */
// All dependencies loaded as plain <script> tags (I18n, Validator, initOTPInput, Toast)

// ── Language & year ──────────────────────────────────────────
const lang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';

I18n.extend('hi', {
  'reg.step.mobile': 'मोबाइल सत्यापन',
  'reg.step.edu': 'शैक्षणिक योग्यता',
  'reg.mobile.title': 'मोबाइल OTP सत्यापन',
  'reg.mobile.subtitle': 'पंजीकरण के लिए अपना मोबाइल नंबर दर्ज करें।',
  'reg.ekyc.dpdp_hint': 'भारत सरकार के DPDP अधिनियम के तहत सुरक्षित।',
  'reg.personal.desc': 'कृपया अपनी व्यक्तिगत जानकारी भरें।',
  'reg.personal.ekyc_banner': 'कृपया ध्यान दें कि आपके द्वारा दी गई जानकारी सही होनी चाहिए।',
  'reg.personal.address_placeholder': 'गाँव/मोहल्ला, तहसील, जिला',
  'reg.personal.additional_details': 'अतिरिक्त व्यक्तिगत विवरण',
  'form.domicile': 'मूल निवास',
  'domicile.mp': 'मध्य प्रदेश (MP)',
  'domicile.other': 'अन्य राज्य (Other)',
  'form.samagra_id': 'समग्र आईडी',
  'placeholder.samagra_id': '9 अंकों की समग्र आईडी',
  'form.marital_status': 'वैवाहिक स्थिति',
  'marital.single': 'अविवाहित',
  'marital.married': 'विवाहित',
  'marital.divorced': 'तलाकशुदा',
  'marital.widowed': 'विधवा / विधुर',
  'reg.edu.subtitle': 'कृपया अपनी शैक्षणिक योग्यता का विवरण दर्ज करें।',
  'edu.section.tenth': '10वीं की जानकारी',
  'edu.section.twelfth': '12वीं की जानकारी',
  'edu.section.higher': 'उच्च / तकनीकी शिक्षा',
  'edu.section.additional': 'अतिरिक्त विवरण',
  'edu.pref_location': 'पसंदीदा स्थान',
  'edu.exp_years': 'अनुभव (वर्षों में)',
  'edu.skills': 'कौशल / स्किल्स',
  'edu.board': 'बोर्ड का नाम',
  'edu.passing_year': 'उत्तीर्ण होने का वर्ष',
  'edu.marks': 'प्राप्त अंक (%)',
  'edu.division': 'श्रेणी',
  'edu.division.first': 'प्रथम श्रेणी',
  'edu.division.second': 'द्वितीय श्रेणी',
  'edu.division.third': 'तृतीय श्रेणी',
  'edu.level': 'योग्यता स्तर',
  'edu.level.ug': 'स्नातक (UG)',
  'edu.level.pg': 'स्नातकोत्तर (PG)',
  'edu.level.diploma': 'डिप्लोमा (Diploma)',
  'edu.degree': 'डिग्री / कोर्स',
  'edu.specialization': 'विशेषज्ञता / शाखा',
  'edu.university': 'बोर्ड / विश्वविद्यालय',
  'edu.college': 'कॉलेज / संस्थान',
  'edu.status': 'उत्तीर्ण स्थिति',
  'edu.status.passed': 'उत्तीर्ण',
  'edu.status.appearing': 'अध्ययनरत',
  'reg.docs.title': 'दस्तावेज़ अपलोड',
  'reg.docs.desc': 'PDF, JPG या PNG — अधिकतम 2MB प्रत्येक।',
  'reg.docs.tenth_marksheet': '10वीं की अंकसूची (10th Marksheet)',
  'reg.docs.twelfth_marksheet': '12वीं की अंकसूची (12th Marksheet)',
  'reg.docs.hint_2mb': 'JPG, PNG, PDF — max 2MB',
  'reg.docs.upload_zone_text': 'फ़ाइल चुनें या यहाँ छोड़ें',
  'reg.docs.passport_photo': 'पासपोर्ट फोटो',
  'reg.docs.hint_1mb': 'JPG, PNG — max 1MB',
  'reg.review.desc': 'जमा करने से पहले सभी जानकारी की जाँच करें।',
  'reg.review.declaration': 'मैं प्रमाणित करता/करती हूं कि ऊपर दी गई सभी जानकारी सत्य और सही है।',
  'reg.success.go_home': 'होम पर जाएं',
  'toast.ekyc_otp_sent': 'OTP भेज दिया गया।',
  'toast.ekyc_invalid_otp': 'कृपया 6 अंकों का OTP दर्ज करें।',
  'toast.ekyc_success': 'मोबाइल सत्यापन सफल!',
  'toast.otp_resent': 'OTP पुनः भेजा गया।',
  'toast.invalid_ext': 'केवल {{ext}} फ़ाइलें मान्य हैं।',
  'toast.file_too_large': 'फ़ाइल {{maxMB}}MB से बड़ी नहीं होनी चाहिए।',
  'toast.tenth_marksheet_required': '10वीं की अंकसूची अपलोड करना अनिवार्य है।',
  'toast.twelfth_marksheet_required': '12वीं की अंकसूची अपलोड करना अनिवार्य है।',
  'toast.photo_required': 'पासपोर्ट फोटो अपलोड करना अनिवार्य है।',
  'toast.accept_declaration': 'कृपया घोषणा स्वीकार करें।',
  'toast.submit_success': 'पंजीकरण सफलतापूर्वक जमा किया गया!',
  'reg.review.personal_info': 'व्यक्तिगत जानकारी',
  'reg.review.value_empty': '—',
  'placeholder.tenth_board': 'उदा. MP Board',
  'placeholder.twelfth_board': 'उदा. MP Board',
  'placeholder.year_custom': 'उदा. 1995',
  'placeholder.higher_level_custom': 'उदा. B.Sc, Diploma',
  'placeholder.higher_degree': 'उदा. B.Tech',
  'placeholder.higher_spec': 'उदा. Computer Science',
  'placeholder.higher_univ': 'उदा. Barkatullah University',
  'placeholder.higher_coll': 'उदा. UIT, Bhopal',
  'placeholder.pref_loc': 'उदा. भोपाल, इंदौर',
  'placeholder.skills_input': 'उदा. वेल्डिंग, प्लंबिंग',
  'edu.level.other': 'अन्य',
  'edu.year.other': 'अन्य वर्ष'
});

I18n.extend('en', {
  'reg.step.mobile': 'Mobile Verification',
  'reg.step.edu': 'Education Details',
  'reg.mobile.title': 'Mobile OTP Verification',
  'reg.mobile.subtitle': 'Enter your mobile number for registration.',
  'reg.ekyc.dpdp_hint': 'Your data is secured under DPDP Act 2023.',
  'reg.personal.desc': 'Complete the remaining details.',
  'reg.personal.ekyc_banner': 'Please ensure the details entered are correct.',
  'reg.personal.address_placeholder': 'Village/Locality, Tehsil, District',
  'reg.personal.additional_details': 'Additional Personal Details',
  'form.domicile': 'Domicile',
  'domicile.mp': 'Madhya Pradesh (MP)',
  'domicile.other': 'Other State',
  'form.samagra_id': 'Samagra ID',
  'placeholder.samagra_id': '9-digit Samagra ID',
  'form.marital_status': 'Marital Status',
  'marital.single': 'Single',
  'marital.married': 'Married',
  'marital.divorced': 'Divorced',
  'marital.widowed': 'Widowed',
  'reg.edu.subtitle': 'Please enter your education details.',
  'edu.section.tenth': '10th Class Details',
  'edu.section.twelfth': '12th Class Details',
  'edu.section.higher': 'Higher / Technical Education',
  'edu.section.additional': 'Additional Information',
  'edu.pref_location': 'Preferred Location',
  'edu.exp_years': 'Experience (in Years)',
  'edu.skills': 'Key Skills',
  'edu.board': 'Board Name',
  'edu.passing_year': 'Year of Passing',
  'edu.marks': 'Marks Obtained (%)',
  'edu.division': 'Division',
  'edu.division.first': 'First Division',
  'edu.division.second': 'Second Division',
  'edu.division.third': 'Third Division',
  'edu.level': 'Qualification Level',
  'edu.level.ug': 'Graduation (UG)',
  'edu.level.pg': 'Post Graduation (PG)',
  'edu.level.diploma': 'Diploma',
  'edu.degree': 'Degree / Course',
  'edu.specialization': 'Specialization / Branch',
  'edu.university': 'Board / University',
  'edu.college': 'College / Institute',
  'edu.status': 'Passing Status',
  'edu.status.passed': 'Passed',
  'edu.status.appearing': 'Appearing',
  'reg.docs.title': 'Document Upload',
  'reg.docs.desc': 'PDF, JPG or PNG — maximum 2MB each.',
  'reg.docs.tenth_marksheet': '10th Marksheet',
  'reg.docs.twelfth_marksheet': '12th Marksheet',
  'reg.docs.hint_2mb': 'JPG, PNG, PDF — max 2MB',
  'reg.docs.upload_zone_text': 'Choose file or drag here',
  'reg.docs.passport_photo': 'Passport Photo',
  'reg.docs.hint_1mb': 'JPG, PNG — max 1MB',
  'reg.review.desc': 'Verify all details before submitting.',
  'reg.review.declaration': 'I certify that all the information provided above is true and correct.',
  'reg.success.go_home': 'Go to Home',
  'toast.ekyc_otp_sent': 'OTP has been sent.',
  'toast.ekyc_invalid_otp': 'Please enter a 6-digit OTP.',
  'toast.ekyc_success': 'Mobile verification successful!',
  'toast.otp_resent': 'OTP resent successfully.',
  'toast.invalid_ext': 'Only {{ext}} files are allowed.',
  'toast.file_too_large': 'File must not exceed {{maxMB}}MB.',
  'toast.tenth_marksheet_required': '10th marksheet upload is required.',
  'toast.twelfth_marksheet_required': '12th marksheet upload is required.',
  'toast.photo_required': 'Passport photo is required.',
  'toast.accept_declaration': 'Please accept the declaration.',
  'toast.submit_success': 'Registration submitted successfully!',
  'reg.review.personal_info': 'Personal Information',
  'reg.review.value_empty': '—',
  'placeholder.tenth_board': 'eg. MP Board',
  'placeholder.twelfth_board': 'eg. MP Board',
  'placeholder.year_custom': 'eg. 1995',
  'placeholder.higher_level_custom': 'eg. B.Sc, Diploma',
  'placeholder.higher_degree': 'eg. B.Tech',
  'placeholder.higher_spec': 'eg. Computer Science',
  'placeholder.higher_univ': 'eg. Barkatullah University',
  'placeholder.higher_coll': 'eg. UIT, Bhopal',
  'placeholder.pref_loc': 'eg. Bhopal, Indore',
  'placeholder.skills_input': 'eg. Welding, Plumbing',
  'edu.level.other': 'Other',
  'edu.year.other': 'Other Year'
});

I18n.init(lang);
I18n.setupToggleButton();

function populateYearDropdowns() {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  const selects = ['tenth-year', 'twelfth-year'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<option value="" data-i18n="placeholder.select">चुनें</option>`;
    const endYear = currentYear;
    for (let y = endYear; y >= startYear; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      el.appendChild(opt);
    }
    const otherOpt = document.createElement('option');
    otherOpt.value = 'other';
    otherOpt.setAttribute('data-i18n', 'edu.year.other');
    otherOpt.textContent = 'अन्य / Custom';
    el.appendChild(otherOpt);
  });
  I18n.translateDOM();
}
populateYearDropdowns();

function setupCustomToggle(selectId, customWrapperId, customInputId, resetBtnId, nameAttr, defaultRules = '') {
  const select = document.getElementById(selectId);
  const wrapper = document.getElementById(customWrapperId);
  const input = document.getElementById(customInputId);
  const resetBtn = document.getElementById(resetBtnId);
  
  if (!select || !wrapper || !input || !resetBtn) return;
  
  select.addEventListener('change', () => {
    if (select.value === 'other') {
      select.style.display = 'none';
      select.setAttribute('name', '');
      select.setAttribute('data-rules', '');
      
      wrapper.style.display = 'flex';
      input.setAttribute('name', nameAttr);
      input.setAttribute('data-rules', defaultRules);
      input.focus();
    }
  });
  
  resetBtn.addEventListener('click', () => {
    wrapper.style.display = 'none';
    input.setAttribute('name', '');
    input.setAttribute('data-rules', '');
    input.value = '';
    
    select.style.display = 'block';
    select.setAttribute('name', nameAttr);
    select.setAttribute('data-rules', defaultRules);
    select.value = '';
    
    const errEl = document.getElementById(`${customInputId}-error`) || document.getElementById(`${selectId}-error`);
    if (errEl) {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
    input.classList.remove('form-control--error');
    select.classList.remove('form-select--error');
  });
}

setupCustomToggle('tenth-year', 'tenth-year-custom-wrapper', 'tenth-year-custom', 'tenth-year-reset', 'tenthYear', 'min:1900|max:2090');
setupCustomToggle('twelfth-year', 'twelfth-year-custom-wrapper', 'twelfth-year-custom', 'twelfth-year-reset', 'twelfthYear', 'min:1900|max:2090');

let higherEduIndex = 0;
function createHigherEduCard(data = {}) {
  const container = document.getElementById('higher-education-container');
  if (!container) return;

  higherEduIndex++;
  const cardId = `higher-edu-card-${higherEduIndex}`;

  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  let yearOptions = `<option value="" data-i18n="placeholder.select">चुनें</option>`;
  for (let y = 2030; y >= startYear; y--) {
    yearOptions += `<option value="${y}">${y}</option>`;
  }
  yearOptions += `<option value="other" data-i18n="edu.year.other">अन्य / Custom</option>`;

  const cardHtml = `
<div class="widget surface--elevated higher-education-card" id="${cardId}" style="margin-bottom: 20px; border: 1px solid var(--color-border); padding: 16px; position: relative; border-radius: 8px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
    <div style="font-weight:600; color: var(--color-primary-dark);" data-i18n="edu.section.higher">उच्च / तकनीकी शिक्षा</div>
    <button type="button" class="btn btn--ghost btn--sm remove-higher-edu-btn" style="color: var(--color-error); padding: 4px 8px; font-weight: 500;">✕ हटाएं</button>
  </div>
  <!-- fields row 1 -->
  <div class="form-row form-row--2">
    <div class="form-group">
      <label class="form-label" data-i18n="edu.level">योग्यता स्तर</label>
      <select class="form-select higher-level">
        <option value="" data-i18n="placeholder.select">चुनें</option>
        <option value="ug" ${data.level === 'ug' ? 'selected' : ''} data-i18n="edu.level.ug">स्नातक (UG)</option>
        <option value="pg" ${data.level === 'pg' ? 'selected' : ''} data-i18n="edu.level.pg">स्नातकोत्तर (PG)</option>
        <option value="diploma" ${data.level === 'diploma' ? 'selected' : ''} data-i18n="edu.level.diploma">डिप्लोमा (Diploma)</option>
        <option value="other" ${data.level === 'other' ? 'selected' : ''} data-i18n="edu.level.other">अन्य</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" data-i18n="edu.degree">डिग्री / कोर्स</label>
      <input type="text" class="form-control higher-degree" placeholder="उदा. B.Tech" value="${data.degree || ''}" />
    </div>
  </div>
  <!-- fields row 2 -->
  <div class="form-row form-row--2">
    <div class="form-group">
      <label class="form-label" data-i18n="edu.specialization">विशेषज्ञता / शाखा</label>
      <input type="text" class="form-control higher-specialization" placeholder="उदा. Computer Science" value="${data.specialization || ''}" />
    </div>
    <div class="form-group">
      <label class="form-label" data-i18n="edu.university">बोर्ड / विश्वविद्यालय</label>
      <input type="text" class="form-control higher-university" placeholder="उदा. Barkatullah University" value="${data.university || ''}" />
    </div>
  </div>
  <!-- fields row 3 -->
  <div class="form-row form-row--2">
    <div class="form-group">
      <label class="form-label" data-i18n="edu.college">कॉलेज / संस्थान</label>
      <input type="text" class="form-control higher-college" placeholder="उदा. UIT, Bhopal" value="${data.college || ''}" />
    </div>
    <div class="form-group">
      <label class="form-label" data-i18n="edu.status">उत्तीर्ण स्थिति</label>
      <select class="form-select higher-status">
        <option value="" data-i18n="placeholder.select">चुनें</option>
        <option value="passed" ${data.status === 'passed' ? 'selected' : ''} data-i18n="edu.status.passed">उत्तीर्ण</option>
        <option value="appearing" ${data.status === 'appearing' ? 'selected' : ''} data-i18n="edu.status.appearing">अध्ययनरत (Appearing)</option>
      </select>
    </div>
  </div>
  <!-- fields row 4 -->
  <div class="form-row form-row--2">
    <div class="form-group">
      <label class="form-label" data-i18n="edu.passing_year">उत्तीर्ण होने का वर्ष</label>
      <select class="form-select higher-year">
        ${yearOptions}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label" data-i18n="edu.division">श्रेणी</label>
      <select class="form-select higher-division">
        <option value="" data-i18n="placeholder.select">चुनें</option>
        <option value="1" ${data.division === '1' ? 'selected' : ''} data-i18n="edu.division.first">प्रथम श्रेणी</option>
        <option value="2" ${data.division === '2' ? 'selected' : ''} data-i18n="edu.division.second">द्वितीय श्रेणी</option>
        <option value="3" ${data.division === '3' ? 'selected' : ''} data-i18n="edu.division.third">तृतीय श्रेणी</option>
      </select>
    </div>
  </div>
</div>
  `;

  const div = document.createElement('div');
  div.innerHTML = cardHtml;
  const cardElement = div.firstElementChild;
  container.appendChild(cardElement);

  if (data.passing_year) {
    const yearSel = cardElement.querySelector('.higher-year');
    if (yearSel) yearSel.value = data.passing_year;
  }

  cardElement.querySelector('.remove-higher-edu-btn').addEventListener('click', () => {
    if (container.querySelectorAll('.higher-education-card').length > 1) {
      cardElement.remove();
    } else {
      Toast.warning("At least one qualification is required.");
    }
  });

  I18n.translateDOM(cardElement);
}

// Add default card on startup and bind dynamic add button click listener
document.addEventListener('DOMContentLoaded', () => {
  createHigherEduCard();
  document.getElementById('add-higher-education-btn')?.addEventListener('click', () => createHigherEduCard());
});

document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// ── Stepper ──────────────────────────────────────────────────
let currentStep = 1;
const TOTAL = 5;

function goToStep(n) {
  if (n < 1 || n > TOTAL) return;
  document.querySelectorAll('.step-panel').forEach(p => p.setAttribute('hidden',''));
  document.getElementById(`step-panel-${n}`)?.removeAttribute('hidden');
  document.querySelectorAll('.stepper__item[data-step]').forEach(item => {
    const s = Number(item.dataset.step);
    item.classList.remove('stepper__item--active','stepper__item--done');
    if (s < n)  item.classList.add('stepper__item--done');
    if (s === n) item.classList.add('stepper__item--active');
  });
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Form state ────────────────────────────────────────────────
const state = { mobile: '', personal: {}, education: {}, documents: {} };

// ── Step 1: Mobile Verification ──────────────────────────────
const vEkyc     = new Validator('#form-ekyc', { lang, liveValidation: true });
const otpGrp    = initOTPInput('#ekyc-otp-group');
const ekycBtn   = document.getElementById('ekyc-action-btn');
const otpSec    = document.getElementById('ekyc-otp-section');
let   otpSent   = false;

ekycBtn.addEventListener('click', () => {
  if (!otpSent) {
    if (!vEkyc.validateField('mobile')) return;
    state.mobile = document.getElementById('mobile-num').value;
    otpSec.style.display = 'block';
    ekycBtn.setAttribute('data-i18n', 'reg.ekyc.verify');
    I18n.translateDOM(ekycBtn);
    otpSent = true;
    Toast.success(I18n.t('toast.ekyc_otp_sent'));
    document.getElementById('otp-1').focus();
  } else {
    const otp = otpGrp?.getValue() || '';
    if (otp.length < 6) { Toast.error(I18n.t('toast.ekyc_invalid_otp')); return; }
    // Prefill mobile number but keep personal details empty as requested
    _prefillPersonal({ fullName:'', fatherName:'', dob:'', gender:'', mobile: state.mobile, address:'', district:'', pincode:'', domicile:'', samagraId:'', maritalStatus:'' });
    Toast.success(I18n.t('toast.ekyc_success'));
    goToStep(2);
  }
});

document.getElementById('resend-ekyc-otp')?.addEventListener('click', () => {
  otpGrp?.reset(); Toast.info(I18n.t('toast.otp_resent'));
});

function _prefillPersonal(data) {
  Object.assign(state.personal, data);
  const set = (id, val) => { const el = document.getElementById(id); if(el){ el.value = val; } };
  set('full-name',  data.fullName);
  set('father-name',data.fatherName);
  set('dob',        data.dob);
  set('mobile',     data.mobile);
  set('address',    data.address);
  set('district',   data.district);
  set('pincode',    data.pincode);
  set('samagra-id', data.samagraId);
  
  const gSel = document.getElementById('gender');
  if(gSel){ gSel.value = data.gender; }
  
  const dSel = document.getElementById('domicile');
  if(dSel){ dSel.value = data.domicile; }

  const mSel = document.getElementById('marital-status');
  if(mSel){ mSel.value = data.maritalStatus; }
}

// ── Step 2: Personal ──────────────────────────────────────────
const vPersonal = new Validator('#form-personal', { lang, liveValidation: true });
document.getElementById('step2-back')?.addEventListener('click', () => goToStep(1));
document.getElementById('step2-next')?.addEventListener('click', () => {
  if (!vPersonal.validate()) return;
  const fd = new FormData(document.getElementById('form-personal'));
  fd.forEach((v, k) => state.personal[k] = v);
  goToStep(3);
});

// ── Step 3: Education Details ─────────────────────────────────
const vEducation = new Validator('#form-education', { lang, liveValidation: true });
const expYearsEl = document.getElementById('exp-years');
const skillsInputEl = document.getElementById('skills-input');
const skillsRequiredStar = document.getElementById('skills-required-star');

if (expYearsEl && skillsInputEl) {
  const handleExpChange = () => {
    const val = parseInt(expYearsEl.value, 10) || 0;
    if (val > 0) {
      skillsInputEl.disabled = false;
      skillsInputEl.setAttribute('data-rules', 'required');
      if (skillsRequiredStar) skillsRequiredStar.style.display = 'inline';
    } else {
      skillsInputEl.disabled = true;
      skillsInputEl.value = '';
      skillsInputEl.setAttribute('data-rules', '');
      if (skillsRequiredStar) skillsRequiredStar.style.display = 'none';
      const errEl = document.getElementById('skills-input-error');
      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }
      skillsInputEl.classList.remove('form-control--error');
    }
  };
  expYearsEl.addEventListener('input', handleExpChange);
  expYearsEl.addEventListener('change', handleExpChange);
}

document.getElementById('step3-back')?.addEventListener('click', () => goToStep(2));
document.getElementById('step3-next')?.addEventListener('click', () => {
  if (!vEducation.validate()) return;
  const fd = new FormData(document.getElementById('form-education'));
  fd.forEach((v, k) => state.education[k] = v);

  // Collect dynamic higher qualifications
  const higherEducations = [];
  document.querySelectorAll('.higher-education-card').forEach(card => {
    higherEducations.push({
      level: card.querySelector('.higher-level').value,
      degree: card.querySelector('.higher-degree').value,
      specialization: card.querySelector('.higher-specialization').value,
      university: card.querySelector('.higher-university').value,
      college: card.querySelector('.higher-college').value,
      status: card.querySelector('.higher-status').value,
      passing_year: card.querySelector('.higher-year').value,
      division: card.querySelector('.higher-division').value
    });
  });
  state.education.higherEducations = higherEducations;

  // Set first element to flat fields to maintain backward compatibility
  if (higherEducations.length > 0) {
    const first = higherEducations[0];
    state.education.higherLevel = first.level;
    state.education.higherDegree = first.degree;
    state.education.higherSpecialization = first.specialization;
    state.education.higherUniversity = first.university;
    state.education.higherCollege = first.college;
    state.education.higherStatus = first.status;
    state.education.higherYear = first.passing_year;
    state.education.higherDivision = first.division;
  }

  goToStep(4);
});

// ── Step 4: Documents ─────────────────────────────────────────
function setupDocUpload(zoneId, listId, docKey, maxMB = 2, accept = ['jpg','jpeg','png','pdf']) {
  const zone  = document.getElementById(zoneId);
  const list  = document.getElementById(listId);
  const input = zone?.querySelector('input[type="file"]');
  if (!input || !zone) return;

  zone.addEventListener('click', () => input.click());
  ['dragenter','dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(e  => zone.addEventListener(e, ev => { zone.classList.remove('drag-over'); }));
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
      <div class="upload-file__meta"><div class="upload-file__name">${file.name}</div><div class="upload-file__size">${(file.size/1024).toFixed(0)} KB</div></div>
      <button class="upload-file__remove" aria-label="${I18n.t('action.delete')}" onclick="this.closest('.upload-file-item').remove();delete state.documents['${docKey}']">✕</button>
    </div>`;
    input.value = '';
  }
}

setupDocUpload('upload-tenth-marksheet','list-tenth-marksheet','tenthMarksheet');
setupDocUpload('upload-twelfth-marksheet','list-twelfth-marksheet','twelfthMarksheet');
setupDocUpload('upload-photo','list-photo','photo',1,['jpg','jpeg','png']);

document.getElementById('step4-back')?.addEventListener('click', () => goToStep(3));
document.getElementById('step4-next')?.addEventListener('click', () => {
  if (!state.documents.tenthMarksheet)  { Toast.error(I18n.t('toast.tenth_marksheet_required')); return; }
  if (!state.documents.twelfthMarksheet) { Toast.error(I18n.t('toast.twelfth_marksheet_required')); return; }
  if (!state.documents.photo)           { Toast.error(I18n.t('toast.photo_required')); return; }
  _renderReview();
  goToStep(5);
});

// ── Step 5: Review & Submit ───────────────────────────────────
function _renderReview() {
  const p = state.personal;
  const edu = state.education;
  const docs = state.documents;
  
  const genderLabel = p.gender === 'M' ? I18n.t('form.gender.male') : p.gender === 'F' ? I18n.t('form.gender.female') : p.gender ? I18n.t('form.gender.other') : I18n.t('reg.review.value_empty');
  const domicileLabel = p.domicile === 'MP' ? I18n.t('domicile.mp') : p.domicile === 'Other' ? I18n.t('domicile.other') : I18n.t('reg.review.value_empty');
  const maritalLabel = p.maritalStatus ? I18n.t('marital.' + p.maritalStatus) : I18n.t('reg.review.value_empty');
  
  let eduLevelLabel = I18n.t('reg.review.value_empty');
  if (edu.higherLevel) {
    const key = 'edu.level.' + edu.higherLevel;
    const trans = I18n.t(key);
    eduLevelLabel = trans === key ? edu.higherLevel : trans;
  }
  const eduStatusLabel = edu.higherStatus ? I18n.t('edu.status.' + edu.higherStatus) : I18n.t('reg.review.value_empty');
  const tenthDivLabel = edu.tenthDivision ? I18n.t('edu.division.' + (edu.tenthDivision == '1' ? 'first' : edu.tenthDivision == '2' ? 'second' : 'third')) : I18n.t('reg.review.value_empty');
  const twelfthDivLabel = edu.twelfthDivision ? I18n.t('edu.division.' + (edu.twelfthDivision == '1' ? 'first' : edu.twelfthDivision == '2' ? 'second' : 'third')) : I18n.t('reg.review.value_empty');
  const higherDivLabel = edu.higherDivision ? I18n.t('edu.division.' + (edu.higherDivision == '1' ? 'first' : edu.higherDivision == '2' ? 'second' : 'third')) : I18n.t('reg.review.value_empty');

  document.getElementById('review-body').innerHTML = `
    <div class="review-section">
      <div class="review-section__title">${I18n.t('reg.review.personal_info')}</div>
      <div class="review-grid">
        <div class="review-item"><div class="review-item__key">${I18n.t('form.full_name')}</div><div class="review-item__value">${p.fullName||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.father_name')}</div><div class="review-item__value">${p.fatherName||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.dob')}</div><div class="review-item__value">${p.dob||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.gender')}</div><div class="review-item__value">${genderLabel}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.mobile')}</div><div class="review-item__value">${p.mobile||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.email')}</div><div class="review-item__value">${p.email||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.domicile')}</div><div class="review-item__value">${domicileLabel}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.samagra_id')}</div><div class="review-item__value">${p.samagraId||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.marital_status')}</div><div class="review-item__value">${maritalLabel}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.address')}</div><div class="review-item__value">${p.address||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.district')}</div><div class="review-item__value">${p.district||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('form.pincode')}</div><div class="review-item__value">${p.pincode||I18n.t('reg.review.value_empty')}</div></div>
      </div>
    </div>
    
    <div class="review-section" style="margin-top:20px;">
      <div class="review-section__title">${I18n.t('reg.step.edu')}</div>
      
      <div style="font-weight:600; margin-bottom: 5px; color: var(--color-primary-dark);">${I18n.t('edu.section.tenth')}</div>
      <div class="review-grid" style="margin-bottom: 15px;">
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.board')}</div><div class="review-item__value">${edu.tenthBoard||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.passing_year')}</div><div class="review-item__value">${edu.tenthYear||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.marks')}</div><div class="review-item__value">${edu.tenthMarks ? edu.tenthMarks + '%' : I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.division')}</div><div class="review-item__value">${tenthDivLabel}</div></div>
      </div>

      <div style="font-weight:600; margin-bottom: 5px; color: var(--color-primary-dark);">${I18n.t('edu.section.twelfth')}</div>
      <div class="review-grid" style="margin-bottom: 15px;">
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.board')}</div><div class="review-item__value">${edu.twelfthBoard||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.passing_year')}</div><div class="review-item__value">${edu.twelfthYear||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.marks')}</div><div class="review-item__value">${edu.twelfthMarks ? edu.twelfthMarks + '%' : I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.division')}</div><div class="review-item__value">${twelfthDivLabel}</div></div>
      </div>

      <!-- Dynamic Higher Education List -->
      ${(edu.higherEducations || []).map((h, idx) => {
        let levelLabel = I18n.t('reg.review.value_empty');
        if (h.level) {
          const key = 'edu.level.' + h.level;
          const trans = I18n.t(key);
          levelLabel = trans === key ? h.level : trans;
        }
        const statusLabel = h.status ? I18n.t('edu.status.' + h.status) : I18n.t('reg.review.value_empty');
        const divLabel = h.division ? I18n.t('edu.division.' + (h.division == '1' ? 'first' : h.division == '2' ? 'second' : 'third')) : I18n.t('reg.review.value_empty');
        return `
        <div style="font-weight:600; margin-top: 12px; margin-bottom: 5px; color: var(--color-primary-dark);">${I18n.t('edu.section.higher')} #${idx + 1}</div>
        <div class="review-grid" style="margin-bottom: 12px;">
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.level')}</div><div class="review-item__value">${levelLabel}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.degree')}</div><div class="review-item__value">${h.degree||I18n.t('reg.review.value_empty')}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.specialization')}</div><div class="review-item__value">${h.specialization||I18n.t('reg.review.value_empty')}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.university')}</div><div class="review-item__value">${h.university||I18n.t('reg.review.value_empty')}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.college')}</div><div class="review-item__value">${h.college||I18n.t('reg.review.value_empty')}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.status')}</div><div class="review-item__value">${statusLabel}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.passing_year')}</div><div class="review-item__value">${h.passing_year||I18n.t('reg.review.value_empty')}</div></div>
          <div class="review-item"><div class="review-item__key">${I18n.t('edu.division')}</div><div class="review-item__value">${divLabel}</div></div>
        </div>`;
      }).join('')}
      
      <div style="font-weight:600; margin-top: 15px; margin-bottom: 5px; color: var(--color-primary-dark);">${I18n.t('edu.section.additional')}</div>
      <div class="review-grid">
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.pref_location')}</div><div class="review-item__value">${edu.prefLocation||I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.exp_years')}</div><div class="review-item__value">${edu.expYears !== undefined && edu.expYears !== '' ? edu.expYears : I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('edu.skills')}</div><div class="review-item__value">${edu.skills||I18n.t('reg.review.value_empty')}</div></div>
      </div>
    </div>
    
    <div class="review-section" style="margin-top:20px;">
      <div class="review-section__title">${I18n.t('reg.docs.title')}</div>
      <div class="review-grid">
        <div class="review-item"><div class="review-item__key">${I18n.t('reg.docs.tenth_marksheet')}</div><div class="review-item__value">${docs.tenthMarksheet ? docs.tenthMarksheet.name : I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('reg.docs.twelfth_marksheet')}</div><div class="review-item__value">${docs.twelfthMarksheet ? docs.twelfthMarksheet.name : I18n.t('reg.review.value_empty')}</div></div>
        <div class="review-item"><div class="review-item__key">${I18n.t('reg.docs.passport_photo')}</div><div class="review-item__value">${docs.photo ? docs.photo.name : I18n.t('reg.review.value_empty')}</div></div>
      </div>
    </div>`;
}

document.getElementById('step5-back')?.addEventListener('click', () => goToStep(4));
document.getElementById('reg-submit-btn')?.addEventListener('click', async () => {
  const decl = document.getElementById('reg-declaration');
  if (!decl.checked) { Toast.error(I18n.t('toast.accept_declaration')); return; }

  const p = state.personal;
  const edu = state.education;
  const docs = state.documents;

  const skillsArray = edu.skills ? edu.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
  const summaryText = `${p.fullName || 'Labour'} is a qualified worker. Education: 10th Board - ${edu.tenthBoard || 'N/A'}, 12th Board - ${edu.twelfthBoard || 'N/A'}. Higher Degree: ${edu.higherDegree || 'N/A'} from ${edu.higherUniversity || 'N/A'}. Preferred Location: ${edu.prefLocation || 'N/A'}.`;

  const payload = {
    candidate_id: state.mobile,
    name: p.fullName || "Registered Jobseeker",
    headline: edu.higherDegree || "Skilled Worker",
    summary: summaryText,
    location: p.district || "Madhya Pradesh",
    country: "India",
    years_exp: parseFloat(edu.expYears) || 0.0,
    current_title: edu.higherDegree || "Labour",
    current_company: "N/A",
    skills: skillsArray,
    open_to_work: true,
    willing_relocate: true,
    github_score: -1.0,
    endorsements: 0,
    
    father_name: p.fatherName || null,
    dob: p.dob || null,
    gender: p.gender || null,
    mobile: state.mobile,
    email: p.email || null,
    domicile: p.domicile || null,
    samagra_id: p.samagraId || null,
    marital_status: p.maritalStatus || null,
    address: p.address || null,
    district: p.district || null,
    pincode: p.pincode || null,
    
    tenth_board: edu.tenthBoard || null,
    tenth_year: edu.tenthYear || null,
    tenth_marks: edu.tenthMarks || null,
    tenth_division: edu.tenthDivision || null,
    
    twelfth_board: edu.twelfthBoard || null,
    twelfth_year: edu.twelfthYear || null,
    twelfth_marks: edu.twelfthMarks || null,
    twelfth_division: edu.twelfthDivision || null,
    
    higher_level: edu.higherLevel || null,
    higher_degree: edu.higherDegree || null,
    higher_specialization: edu.higherSpecialization || null,
    higher_university: edu.higherUniversity || null,
    higher_college: edu.higherCollege || null,
    higher_status: edu.higherStatus || null,
    higher_year: edu.higherYear || null,
    higher_division: edu.higherDivision || null,
    higher_educations: edu.higherEducations || null,
    
    pref_location: edu.prefLocation || null,
    exp_years: edu.expYears || null,
    skills_raw: edu.skills || null,
    
    doc_tenth_marksheet: docs.tenthMarksheet ? docs.tenthMarksheet.name : null,
    doc_twelfth_marksheet: docs.twelfthMarksheet ? docs.twelfthMarksheet.name : null,
    doc_photo: docs.photo ? docs.photo.name : null
  };

  try {
    const response = await fetch("http://localhost:8000/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      localStorage.setItem('logged_in_candidate_mobile', state.mobile);
      localStorage.setItem('logged_in_candidate_name', p.fullName || "Registered Jobseeker");

      const rojgarId = `MP-LAB-${Date.now().toString().slice(-8)}`;
      document.querySelectorAll('.step-panel').forEach(panel => panel.setAttribute('hidden', ''));
      document.querySelectorAll('.stepper__item[data-step]').forEach(i => i.classList.add('stepper__item--done'));
      const success = document.getElementById('reg-success');
      success.removeAttribute('hidden');
      document.getElementById('reg-rojgar-id').textContent = rojgarId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      Toast.success(I18n.t('toast.submit_success'));
    } else {
      const errText = await response.text();
      console.error("Server error:", errText);
      Toast.error("Failed to save candidate to database.");
    }
  } catch (err) {
    console.error("Connection failed:", err);
    Toast.error("Backend server connection failed.");
  }
});

// ── Language Switcher Event ──────────────────────────────────
document.addEventListener('i18n:languageChanged', (e) => {
  const currentLang = e.detail.language;
  I18n.translateDOM();
  vEkyc.setLanguage(currentLang);
  vPersonal.setLanguage(currentLang);
  vEducation.setLanguage(currentLang);
  if (currentStep === 5) {
    _renderReview();
  }
});
