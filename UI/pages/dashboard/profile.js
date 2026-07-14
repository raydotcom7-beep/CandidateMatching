/* ============================================================
   PROFILE MANAGEMENT JS
   pages/dashboard/profile.js
   ============================================================ */

(function() {
  'use strict';

  // Current language from storage
  const lang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';

  // Extend translations
  I18n.extend('hi', {
    'profile.section.identity': 'पहचान एवं आधार eKYC',
    'profile.section.contact': 'संपर्क एवं पता विवरण',
    'profile.ekyc_status': 'आधार सत्यापित',
    'profile.save_btn': 'प्रोफ़ाइल सहेजें',
    'toast.profile_save_success': 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!',
    'toast.invalid_ext': 'केवल {{ext}} फ़ाइलें मान्य हैं।',
    'toast.file_too_large': 'फ़ाइल {{maxMB}}MB से बड़ी नहीं होनी चाहिए।',
    'toast.aadhaar_required': 'आधार कार्ड अपलोड करना अनिवार्य है।',
    'toast.photo_required': 'पासपोर्ट फोटो अपलोड करना अनिवार्य है।',
    'reg.personal.ekyc_banner': 'आधार eKYC से स्वतः भरे गए फ़ील्ड संपादित नहीं किए जा सकते।',
    'reg.personal.job_details': 'व्यवसाय विवरण',
    'reg.docs.title': 'दस्तावेज़',
    'reg.docs.aadhaar_front': 'आधार कार्ड (Front)',
    'reg.docs.hint_2mb': 'JPG, PNG, PDF — max 2MB',
    'reg.docs.upload_zone_text': 'फ़ाइल चुनें या यहाँ छोड़ें',
    'reg.docs.passport_photo': 'पासपोर्ट फोटो',
    'reg.docs.hint_1mb': 'JPG, PNG — max 1MB',
    'reg.docs.bank_passbook': 'बैंक पासबुक',
    'trade.mason': 'राजमिस्त्री',
    'trade.carpenter': 'बढ़ई',
    'trade.electrician': 'इलेक्ट्रीशियन',
    'trade.plumber': 'प्लंबर',
    'trade.painter': 'पेंटर',
    'trade.welder': 'वेल्डर',
    'trade.helper': 'हेल्पर',
    'trade.other': 'अन्य',
    'form.domicile': 'मूल निवास',
    'form.samagra_id': 'समग्र आईडी',
    'form.marital_status': 'वैवाहिक स्थिति',
    'reg.step.edu': 'शैक्षणिक योग्यता',
    'edu.section.tenth': '10वीं की जानकारी',
    'edu.section.twelfth': '12वीं की जानकारी',
    'edu.section.higher': 'उच्च / तकनीकी शिक्षा',
    'edu.board': 'बोर्ड का नाम',
    'edu.passing_year': 'उत्तीर्ण होने का वर्ष',
    'edu.marks': 'प्राप्त अंक (%)',
    'edu.division': 'श्रेणी',
    'edu.division.first': 'प्रथम श्रेणी',
    'edu.division.second': 'द्वितीय श्रेणी',
    'edu.division.third': 'तृतीय श्रेणी',
    'edu.level': 'योग्यता स्तर',
    'edu.degree': 'डिग्री / कोर्स',
    'edu.specialization': 'विशेषज्ञता / शाखा',
    'edu.university': 'बोर्ड / विश्वविद्यालय',
    'edu.college': 'कॉलेज / संस्थान',
    'edu.status': 'उत्तीर्ण स्थिति',
    'edu.status.passed': 'उत्तीर्ण (Passed)',
    'edu.status.appearing': 'अध्ययनरत (Appearing)',
    'edu.pref_location': 'पसंदीदा स्थान',
    'edu.skills': 'कौशल / स्किल्स',
    'reg.docs.tenth_marksheet': '10वीं की अंकसूची (10th Marksheet)',
    'reg.docs.twelfth_marksheet': '12वीं की अंकसूची (12th Marksheet)',
    'placeholder.select': 'चुनें',
  });

  I18n.extend('en', {
    'profile.section.identity': 'Identity & Aadhaar eKYC',
    'profile.section.contact': 'Contact & Address Details',
    'profile.ekyc_status': 'Aadhaar Verified',
    'profile.save_btn': 'Save Profile',
    'toast.profile_save_success': 'Profile updated successfully!',
    'toast.invalid_ext': 'Only {{ext}} files are allowed.',
    'toast.file_too_large': 'File must not exceed {{maxMB}}MB.',
    'toast.aadhaar_required': 'Aadhaar card upload is required.',
    'toast.photo_required': 'Passport photo is required.',
    'reg.personal.ekyc_banner': 'Fields auto-filled from Aadhaar eKYC cannot be edited.',
    'reg.personal.job_details': 'Occupation Details',
    'reg.docs.title': 'Documents',
    'reg.docs.aadhaar_front': 'Aadhaar Card (Front)',
    'reg.docs.hint_2mb': 'JPG, PNG, PDF — max 2MB',
    'reg.docs.upload_zone_text': 'Choose file or drag here',
    'reg.docs.passport_photo': 'Passport Photo',
    'reg.docs.hint_1mb': 'JPG, PNG — max 1MB',
    'reg.docs.bank_passbook': 'Bank Passbook',
    'trade.mason': 'Mason',
    'trade.carpenter': 'Carpenter',
    'trade.electrician': 'Electrician',
    'trade.plumber': 'Plumber',
    'trade.painter': 'Painter',
    'trade.welder': 'Welder',
    'trade.helper': 'Helper',
    'trade.other': 'Other',
    'form.domicile': 'Domicile State',
    'form.samagra_id': 'Samagra ID',
    'form.marital_status': 'Marital Status',
    'reg.step.edu': 'Educational Qualification',
    'edu.section.tenth': '10th Class Details',
    'edu.section.twelfth': '12th Class Details',
    'edu.section.higher': 'Higher / Technical Education',
    'edu.board': 'Board Name',
    'edu.passing_year': 'Year of Passing',
    'edu.marks': 'Marks Obtained (%)',
    'edu.division': 'Division/Class',
    'edu.division.first': 'First Class',
    'edu.division.second': 'Second Class',
    'edu.division.third': 'Third Class',
    'edu.level': 'Qualification Level',
    'edu.degree': 'Degree / Course',
    'edu.specialization': 'Specialization / Stream',
    'edu.university': 'Board / University',
    'edu.college': 'College / Institute',
    'edu.status': 'Passing Status',
    'edu.status.passed': 'Passed',
    'edu.status.appearing': 'Appearing',
    'edu.pref_location': 'Preferred Location',
    'edu.skills': 'Skills / Key Skills',
    'reg.docs.tenth_marksheet': '10th Class Marksheet',
    'reg.docs.twelfth_marksheet': '12th Class Marksheet',
    'placeholder.select': 'Select',
  });

  I18n.init(lang);
  I18n.setupToggleButton();

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

  document.getElementById('add-higher-education-btn')?.addEventListener('click', () => createHigherEduCard());

  // Document files store
  const state = {
    documents: {}
  };

  // Form Validation
  const vProfile = new Validator('#form-profile', { lang, liveValidation: true });

  // ── Document upload utility ─────────────────────────────────
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
        <div class="upload-file__icon">${docKey === 'photo' ? '🖼️' : docKey === 'passbook' ? '📄' : '📎'}</div>
        <div class="upload-file__meta"><div class="upload-file__name">${file.name}</div><div class="upload-file__size">${(file.size / 1024).toFixed(0)} KB</div></div>
        <button class="upload-file__remove" aria-label="${I18n.t('action.delete')}" onclick="event.stopPropagation(); this.closest('.upload-file-item').remove(); delete state.documents['${docKey}']">✕</button>
      </div>`;
      input.value = '';
    }
  }

  setupDocUpload('upload-tenth-marksheet', 'list-tenth-marksheet', 'tenthMarksheet');
  setupDocUpload('upload-twelfth-marksheet', 'list-twelfth-marksheet', 'twelfthMarksheet');
  setupDocUpload('upload-photo', 'list-photo', 'photo', 1, ['jpg', 'jpeg', 'png']);

  // Override delete button for preloaded files to register delete actions correctly
  document.querySelectorAll('.upload-file__remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.upload-file-item');
      const key = item.parentElement.id.replace('list-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      item.remove();
      delete state.documents[key];
    });
  });

  // Dynamic Profile Loading
  async function loadProfileData() {
    let loggedMobile = localStorage.getItem('logged_in_candidate_mobile');
    
    // Set defaults if empty for testing/demo
    if (!loggedMobile) {
      loggedMobile = "9755728822";
      localStorage.setItem('logged_in_candidate_mobile', "9755728822");
    }

    let cand = null;
    try {
      const response = await fetch(`http://localhost:5000/api/candidate/profile?id=${loggedMobile}&lang=${lang}`);
      if (response.ok) {
        cand = await response.json();
      }
    } catch (err) {
      console.warn("Backend candidates API offline or failed.", err);
    }

    if (cand) {
      const name = `${cand.first_name} ${cand.last_name}`.trim() || "Candidate";
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setVal('full-name', name);
      setVal('father-name', cand.guardian_name);
      setVal('dob', '1995-01-01');
      setVal('mobile', cand.mobile_no);
      setVal('email', cand.email);
      setVal('address', cand.address);
      setVal('district', cand.district);
      setVal('pincode', cand.pincode);
      
      const expEl = document.getElementById('experience');
      if (expEl) expEl.value = cand.years_exp || '0';

      const hContainer = document.getElementById('higher-education-container');
      if (hContainer) {
        hContainer.innerHTML = '';
        if (cand.qualifications && cand.qualifications.length > 0) {
          cand.qualifications.forEach(q => {
            const level = q.level_name ? q.level_name.toLowerCase() : '';
            if (level.includes('high school') || level.includes('10th') || level.includes('10वीं')) {
              setVal('tenth-board', q.university_name);
              setVal('tenth-year', q.passing_year);
              setVal('tenth-marks', '75'); // Default marks fallback
              setVal('tenth-division', q.division_detail && q.division_detail.toLowerCase().includes('first') ? '1' : q.division_detail && q.division_detail.toLowerCase().includes('second') ? '2' : '3');
            } else if (level.includes('higher secondary') || level.includes('12th') || level.includes('12वीं')) {
              setVal('twelfth-board', q.university_name);
              setVal('twelfth-year', q.passing_year);
              setVal('twelfth-marks', '80'); // Default marks fallback
              setVal('twelfth-division', q.division_detail && q.division_detail.toLowerCase().includes('first') ? '1' : q.division_detail && q.division_detail.toLowerCase().includes('second') ? '2' : '3');
            } else {
              createHigherEduCard({
                level: level.includes('post') ? 'pg' : 'ug',
                degree: q.qualification_name,
                specialization: q.subject_name,
                university: q.university_name,
                college: q.university_name,
                status: 'passed',
                passing_year: q.passing_year,
                division: q.division_detail && q.division_detail.toLowerCase().includes('first') ? '1' : q.division_detail && q.division_detail.toLowerCase().includes('second') ? '2' : '3'
              });
            }
          });
        }
      }

      setVal('domicile', cand.is_domicile_mp ? "MP" : "Other");
      setVal('samagra-id', cand.samagra_id);
      
      const maritalVal = cand.marital_status.toLowerCase();
      if (maritalVal.includes('single') || maritalVal.includes('अविवाहित')) {
        setVal('marital-status', 'single');
      } else {
        setVal('marital-status', 'married');
      }

      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      document.querySelectorAll('.user-profile .user-name').forEach(el => el.textContent = name);
      document.querySelectorAll('.user-profile .user-avatar').forEach(el => el.textContent = initials);
      
      const cardName = document.querySelector('.profile-header-card__name');
      const cardAvatar = document.querySelector('.profile-header-card__avatar');
      if (cardName) cardName.textContent = name;
      if (cardAvatar) cardAvatar.textContent = initials;
    }
  }
  loadProfileData();

  // Save profile click
  document.getElementById('form-profile').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!vProfile.validate()) return;
    
    const loggedMobile = localStorage.getItem('logged_in_candidate_mobile');
    if (loggedMobile) {
      try {
        const getRes = await fetch("http://localhost:8000/candidates");
        if (getRes.ok) {
          const candidates = await getRes.json();
          let cand = candidates.find(c => c.candidate_id === loggedMobile || c.mobile === loggedMobile);
          if (!cand) cand = { candidate_id: loggedMobile };
          
          cand.name = document.getElementById('full-name').value;
          cand.father_name = document.getElementById('father-name').value;
          cand.dob = document.getElementById('dob').value;
          cand.gender = document.getElementById('gender').value;
          cand.mobile = document.getElementById('mobile').value;
          cand.email = document.getElementById('email').value;
          cand.address = document.getElementById('address').value;
          cand.district = document.getElementById('district').value;
          cand.pincode = document.getElementById('pincode').value;
          cand.years_exp = parseFloat(document.getElementById('experience').value) || 0.0;
          
          cand.tenth_board = document.getElementById('tenth-board').value;
          cand.tenth_year = document.getElementById('tenth-year').value;
          cand.tenth_marks = document.getElementById('tenth-marks').value;
          cand.tenth_division = document.getElementById('tenth-division').value;
          
          cand.twelfth_board = document.getElementById('twelfth-board').value;
          cand.twelfth_year = document.getElementById('twelfth-year').value;
          cand.twelfth_marks = document.getElementById('twelfth-marks').value;
          cand.twelfth_division = document.getElementById('twelfth-division').value;
          
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
          cand.higher_educations = higherEducations;

          if (higherEducations.length > 0) {
            const first = higherEducations[0];
            cand.higher_level = first.level;
            cand.higher_degree = first.degree;
            cand.higher_specialization = first.specialization;
            cand.higher_university = first.university;
            cand.higher_college = first.college;
            cand.higher_status = first.status;
            cand.higher_year = first.passing_year;
            cand.higher_division = first.division;
          } else {
            cand.higher_level = null;
            cand.higher_degree = null;
            cand.higher_specialization = null;
            cand.higher_university = null;
            cand.higher_college = null;
            cand.higher_status = null;
            cand.higher_year = null;
            cand.higher_division = null;
          }
          
          cand.pref_location = document.getElementById('pref-location').value;
          cand.skills_raw = document.getElementById('skills-input').value;
          
          cand.doc_tenth_marksheet = state.documents.tenthMarksheet ? state.documents.tenthMarksheet.name : null;
          cand.doc_twelfth_marksheet = state.documents.twelfthMarksheet ? state.documents.twelfthMarksheet.name : null;
          cand.doc_photo = state.documents.photo ? state.documents.photo.name : null;

          const tradeSelect = document.getElementById('trade');
          cand.current_title = tradeSelect.options[tradeSelect.selectedIndex].text;
          cand.skills = [tradeSelect.value];
          
          const postRes = await fetch("http://localhost:8000/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cand)
          });
          
          if (postRes.ok) {
            localStorage.setItem('logged_in_candidate_name', cand.name);
            Toast.success(I18n.t('toast.profile_save_success'));
            
            document.getElementById('user-trade-badge').textContent = tradeSelect.options[tradeSelect.selectedIndex].text;
            
            const initials = cand.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            document.querySelectorAll('.user-profile .user-name').forEach(el => el.textContent = cand.name);
            document.querySelectorAll('.user-profile .user-avatar').forEach(el => el.textContent = initials);
            const cardName = document.querySelector('.profile-header-card__name');
            const cardAvatar = document.querySelector('.profile-header-card__avatar');
            if (cardName) cardName.textContent = cand.name;
            if (cardAvatar) cardAvatar.textContent = initials;
          } else {
            Toast.error("Failed to update profile on backend database.");
          }
        }
      } catch (err) {
        console.error("Error saving candidate profile:", err);
        Toast.error("Backend connection failed.");
      }
    } else {
      Toast.success(I18n.t('toast.profile_save_success'));
    }
  });

  // Language Change Listener
  document.addEventListener('i18n:languageChanged', (e) => {
    window.location.reload();
  });

})();
