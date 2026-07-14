/* ============================================================
   INDUSTRY PROFILE MANAGEMENT JS
   pages/industry-registration/profile.js
   ============================================================ */

(function() {
  'use strict';

  // Current language from storage
  const lang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';

  // Extend translations
  I18n.extend('hi', {
    'profile.ekyc_status': 'आधार सत्यापित',
    'profile.save_btn': 'सहेजें',
    'toast.profile_save_success': 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!',
    'toast.invalid_ext': 'केवल {{ext}} फ़ाइलें मान्य हैं।',
    'toast.file_too_large': 'फ़ाइल {{maxMB}}MB से बड़ी नहीं होनी चाहिए।',
    'toast.factory_license_required': 'कारखाना पंजीकरण प्रमाण-पत्र अपलोड करना अनिवार्य है।',
    'toast.gst_cert_required': 'GST प्रमाण-पत्र अपलोड करना अनिवार्य है।',
    'toast.pan_card_required': 'PAN कार्ड अपलोड करना अनिवार्य है।',
    'reg.personal.ekyc_banner': 'आधार eKYC से स्वतः भरे गए फ़ील्ड संपादित नहीं किए जा सकते।',
    'reg.step.owner_aadhaar_verification': 'प्रबंधक / मालिक का आधार सत्यापन',
    'form.aadhaar': 'आधार नंबर',
    'form.designation': 'पदनाम',
    'reg.step.industry_details': 'उद्योग विवरण',
    'form.industry_name': 'उद्योग / कारखाने का नाम',
    'form.industry_type': 'उद्योग का प्रकार',
    'form.pan': 'PAN नंबर',
    'form.gstin': 'GSTIN',
    'form.worker_count': 'कुल श्रमिक संख्या',
    'form.pincode': 'पिन कोड',
    'form.industry_address': 'उद्योग का पूरा पता',
    'reg.docs.title': 'दस्तावेज़ अपलोड',
    'doc.factory_license': 'कारखाना पंजीकरण प्रमाण-पत्र',
    'doc.gst_cert': 'GST प्रमाण-पत्र',
    'reg.docs.hint_2mb': 'PDF — max 2MB',
    'reg.docs.upload_zone_text': 'फ़ाइल चुनें',
    
    // Industry Type translations
    'industry_type.manufacturing': 'विनिर्माण',
    'industry_type.construction': 'निर्माण',
    'industry_type.textile': 'वस्त्र उद्योग',
    'industry_type.food': 'खाद्य प्रसंस्करण',
    'industry_type.chemical': 'रसायन उद्योग',
    'industry_type.engineering': 'इंजीनियरिंग',
    'trade.other': 'अन्य',
    
    // Sidebar menu overrides
    'dashboard.menu.profile_identity': 'प्रोफाइल एवं पहचान प्रबंधन',
        'dashboard.menu.dashboard': 'डैशबोर्ड',
    'dashboard.menu.personal_profile': 'प्रोफाइल प्रबंधन',
    'dashboard.menu.change_password': 'पासवर्ड बदलें',
    'dashboard.menu.employment_career': 'रोजगार एवं कैरियर सेवाएँ',
    'dashboard.menu.post_jobs': 'नौकरियां पोस्ट करें',
    'dashboard.menu.active_jobs': 'सक्रिय नौकरियां',
    'dashboard.menu.received_apps': 'प्राप्त आवेदन',
    'dashboard.menu.shortlisted': 'शॉर्टलिस्टेड उम्मीदवार',
    'dashboard.menu.search_candidate': 'उम्मीदवार खोजें'
  });

  I18n.extend('en', {
    'profile.ekyc_status': 'Aadhaar Verified',
    'profile.save_btn': 'Save Profile',
    'toast.profile_save_success': 'Profile updated successfully!',
    'toast.invalid_ext': 'Only {{ext}} files are allowed.',
    'toast.file_too_large': 'File must not exceed {{maxMB}}MB.',
    'toast.factory_license_required': 'Factory Registration Certificate is required.',
    'toast.gst_cert_required': 'GST Certificate is required.',
    'toast.pan_card_required': 'PAN Card is required.',
    'reg.personal.ekyc_banner': 'Fields auto-filled from Aadhaar eKYC cannot be edited.',
    'reg.step.owner_aadhaar_verification': 'Manager / Owner Aadhaar Verification',
    'form.aadhaar': 'Aadhaar Number',
    'form.designation': 'Designation',
    'reg.step.industry_details': 'Industry Details',
    'form.industry_name': 'Industry / Factory Name',
    'form.industry_type': 'Industry Type',
    'form.pan': 'PAN Number',
    'form.gstin': 'GSTIN',
    'form.worker_count': 'Total Worker Count',
    'form.pincode': 'Pincode',
    'form.industry_address': 'Full Industry Address',
    'reg.docs.title': 'Upload Documents',
    'doc.factory_license': 'Factory Registration Certificate',
    'doc.gst_cert': 'GST Certificate',
    'reg.docs.hint_2mb': 'PDF — max 2MB',
    'reg.docs.upload_zone_text': 'Choose file',

    // Industry Type translations
    'industry_type.manufacturing': 'Manufacturing',
    'industry_type.construction': 'Construction',
    'industry_type.textile': 'Textile Industry',
    'industry_type.food': 'Food Processing',
    'industry_type.chemical': 'Chemical Industry',
    'industry_type.engineering': 'Engineering',
    'trade.other': 'Other',

    // Sidebar menu overrides
    'dashboard.menu.profile_identity': 'Profile & Identity Management',
        'dashboard.menu.dashboard': 'Dashboard',
    'dashboard.menu.personal_profile': 'Profile Management',
    'dashboard.menu.change_password': 'Change Password',
    'dashboard.menu.employment_career': 'Employment & Career Services',
    'dashboard.menu.post_jobs': 'Post Jobs',
    'dashboard.menu.active_jobs': 'Active Job Postings',
    'dashboard.menu.received_apps': 'Received Applications',
    'dashboard.menu.shortlisted': 'Shortlisted Candidates',
    'dashboard.menu.search_candidate': 'Search Candidate'
  });

  I18n.init(lang);
  I18n.setupToggleButton();

  // Document state store
  const state = {
    documents: {
      factoryLicense: { name: 'factory_license.pdf', size: 1258291 },
      gstCert: { name: 'gst_certificate.pdf', size: 870400 },
      panCard: { name: 'pan_card.jpg', size: 430080 }
    }
  };

  // Form Validation
  const vProfile = new Validator('#form-profile', { lang, liveValidation: true });

  // ── Document upload utility ─────────────────────────────────
  function setupDocUpload(zoneId, listId, docKey, maxMB = 2, accept = ['jpg', 'jpeg', 'png', 'pdf']) {
    const zone  = document.getElementById(zoneId);
    const list  = document.getElementById(listId);
    const input = zone?.querySelector('input[type="file"]');
    if (!input || !zone) return;

    zone.addEventListener('click', (e) => {
      if (e.target !== input) {
        input.click();
      }
    });

    ['dragenter', 'dragover'].forEach(e => {
      zone.addEventListener(e, ev => {
        ev.preventDefault();
        zone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(e => {
      zone.addEventListener(e, ev => {
        zone.classList.remove('dragover');
      });
    });

    zone.addEventListener('drop', ev => {
      ev.preventDefault();
      handleFile(ev.dataTransfer.files[0]);
    });

    input.addEventListener('change', () => {
      handleFile(input.files[0]);
    });

    function handleFile(file) {
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (!accept.includes(ext)) {
        Toast.error(I18n.t('toast.invalid_ext', { ext: accept.join(', ') }));
        return;
      }
      if (file.size > maxMB * 1024 * 1024) {
        Toast.error(I18n.t('toast.file_too_large', { maxMB }));
        return;
      }
      
      state.documents[docKey] = file;
      renderFileList();
    }

    function renderFileList() {
      if (!state.documents[docKey]) {
        list.innerHTML = '';
        return;
      }
      const file = state.documents[docKey];
      const fileSizeText = file.size ? `${(file.size / 1024).toFixed(0)} KB` : '';
      list.innerHTML = `
        <div class="uploaded-file-item" data-filename="${file.name}">
          <span class="uploaded-file-item__name">${file.name} ${fileSizeText ? `(${fileSizeText})` : ''}</span>
          <button type="button" class="btn-remove-file" aria-label="Remove File">×</button>
        </div>
      `;
      
      // Wire up remove event
      list.querySelector('.btn-remove-file').addEventListener('click', (e) => {
        e.stopPropagation();
        delete state.documents[docKey];
        renderFileList();
      });
    }

    // Bind remove handler for pre-loaded files
    const removeBtn = list.querySelector('.btn-remove-file');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        delete state.documents[docKey];
        renderFileList();
      });
    }
  }

  setupDocUpload('upload-factory-license', 'list-factory-license', 'factoryLicense');
  setupDocUpload('upload-gst-cert', 'list-gst-cert', 'gstCert');
  setupDocUpload('upload-pan-card', 'list-pan-card', 'panCard');

  // Submit profile handler
  document.getElementById('form-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!vProfile.validate()) return;
    
    // Check documents
    if (!state.documents.factoryLicense) {
      Toast.error(I18n.t('toast.factory_license_required'));
      return;
    }
    if (!state.documents.gstCert) {
      Toast.error(I18n.t('toast.gst_cert_required'));
      return;
    }
    if (!state.documents.panCard) {
      Toast.error(I18n.t('toast.pan_card_required'));
      return;
    }

    // Success action
    Toast.success(I18n.t('toast.profile_save_success'));

    // Update displays dynamically
    const nameVal = document.getElementById('industry-name').value;
    document.getElementById('display-company-name').textContent = nameVal;
    document.getElementById('header-user-name').textContent = nameVal;
    
    const typeSelect = document.getElementById('industry-type');
    const selectedTypeText = typeSelect.options[typeSelect.selectedIndex].text;
    document.getElementById('display-industry-type').textContent = selectedTypeText;
  });

  // Language toggling integration
  document.addEventListener('i18n:languageChanged', (e) => {
    window.location.reload();
  });

  // Last Login & Avatar updates
  function updateLastLogin() {
    const now = new Date();
    const datePart = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let timePart = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const lastLoginEl = document.getElementById('last-login-time');
    if (lastLoginEl) {
      lastLoginEl.textContent = 'Last login: ' + datePart + ', ' + timePart;
    }
  }
  updateLastLogin();

  async function loadCompanyProfile() {
    let compId = localStorage.getItem('logged_in_company_id');
    if (!compId) {
      compId = "comp_1";
      localStorage.setItem('logged_in_company_id', "comp_1");
    }

    try {
      const response = await fetch(`http://localhost:5000/api/company/profile?id=${compId}&lang=${lang}`);
      if (response.ok) {
        const data = await response.json();
        
        // Populate inputs
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('industry-name', data.name);
        setVal('industry-address', data.location);
        
        // Display values
        document.getElementById('display-company-name').textContent = data.name;
        
        const headerNameEl = document.getElementById('header-user-name') || document.querySelector('.user-name');
        if (headerNameEl) headerNameEl.textContent = data.name;
        
        document.getElementById('display-industry-type').textContent = data.industry;
        
        const avatarEl = document.querySelector('.user-avatar');
        if (avatarEl) {
          avatarEl.textContent = data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
      }
    } catch (err) {
      console.warn("Failed to load company profile.", err);
    }
  }
  loadCompanyProfile();

})();


