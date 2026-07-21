/* ============================================================
   HOME PAGE JS — pages/home/home.js
   ============================================================ */
// All dependencies loaded as plain <script> tags (I18n, Validator, initOTPInput)

// ── Language ────────────────────────────────────────────────
const savedLang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';
I18n.init(savedLang);
I18n.setupToggleButton();
document.addEventListener('i18n:languageChanged', () => I18n.translateDOM());

// ── Footer year ──────────────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();

const loginTabs   = document.querySelectorAll('.auth-tabs .auth-tab');
const loginPanels = [document.getElementById('panel-aadhaar'), document.getElementById('panel-mobile')];
loginTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    loginTabs.forEach(t => { t.classList.remove('auth-tab--active'); t.setAttribute('aria-selected','false'); });
    loginPanels.forEach(p => { if (p) p.setAttribute('hidden',''); });
    tab.classList.add('auth-tab--active');
    tab.setAttribute('aria-selected','true');
    document.getElementById(tab.getAttribute('aria-controls'))?.removeAttribute('hidden');
  });
});



// ── OTP input group ──────────────────────────────────────────
const aadhaarOtp = initOTPInput('#otp-group-aadhaar');
const mobileOtp  = initOTPInput('#otp-group-mobile');
const industryOtp = initOTPInput('#otp-group-industry');

// ── Aadhaar login form ───────────────────────────────────────
const aadhaarForm  = document.getElementById('form-aadhaar-login');
const aadhaarInput = document.getElementById('login-aadhaar');
const sendBtn      = document.getElementById('aadhaar-send-btn');
const otpGroup     = document.getElementById('otp-group-aadhaar');
const resendBtn    = document.getElementById('resend-otp-btn');
let   otpSent      = false;

const vAadhaar = new Validator('#form-aadhaar-login', { lang: savedLang, liveValidation: true });

sendBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!otpSent) {
    if (!vAadhaar.validateField('aadhaar')) return;
    // Simulate OTP send
    Toast.success(I18n.t('alert.otp_sent'));
    otpGroup.style.display = 'block';
    sendBtn.textContent = I18n.t('login.title');
    otpSent = true;
  } else {
    const otp = aadhaarOtp?.getValue() || '';
    if (otp.length < 6) {
      alert('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }
    // Simulate verification — redirect
    window.location.href = '../dashboard/candidatedashboard.html';
  }
});

resendBtn?.addEventListener('click', () => {
  aadhaarOtp?.reset();
  Toast.success(I18n.t('alert.otp_sent'));
  resendBtn.disabled = true;
  setTimeout(() => { resendBtn.disabled = false; }, 30000);
});

// ── Mobile login form ────────────────────────────────────────
const mobileForm   = document.getElementById('form-mobile-login');
const mobileInput  = document.getElementById('login-mobile');
const mobileSendBtn= document.getElementById('mobile-send-btn');
const mobileOtpGrp = document.getElementById('otp-group-mobile');
const resendBtnMob = document.getElementById('resend-otp-btn-mobile');
let   mobileOtpSent= false;
let   loggedInCandidate = null;

const vMobile = new Validator('#form-mobile-login', { lang: savedLang, liveValidation: true });

mobileSendBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!mobileOtpSent) {
    if (!vMobile.validateField('mobile')) return;
    const phoneVal = mobileInput.value;
    
    // Check registered candidates in backend database
    try {
      const response = await fetch("http://localhost:5000/api/login/candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneVal })
      });
      if (response.ok) {
        const data = await response.json();
        loggedInCandidate = { name: data.name, candidate_id: data.candidate_id };
      } else {
        const errData = await response.json();
        const errMsg = savedLang === 'hi' ? 'यह मोबाइल नंबर पंजीकृत नहीं है।' : (errData.message || 'Login failed.');
        Toast.error(errMsg);
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed.", err);
      Toast.error("सर्वर से कनेक्शन विफल रहा।");
      return;
    }

    // Simulate OTP send
    Toast.success(I18n.t('alert.otp_sent'));
    mobileOtpGrp.style.display = 'block';
    mobileSendBtn.textContent = I18n.t('login.title');
    mobileOtpSent = true;
  } else {
    const otp = mobileOtp?.getValue() || '';
    if (otp.length < 6) {
      const errMsg = savedLang === 'hi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter a 6-digit OTP';
      alert(errMsg);
      return;
    }
    
    // Store credentials in localStorage
    if (loggedInCandidate) {
      localStorage.setItem('logged_in_candidate_mobile', loggedInCandidate.candidate_id);
      localStorage.setItem('logged_in_candidate_name', loggedInCandidate.name);
    }
    
    // Redirect
    window.location.href = '../dashboard/candidatedashboard.html';
  }
});

resendBtnMob?.addEventListener('click', () => {
  mobileOtp?.reset();
  Toast.success(I18n.t('alert.otp_sent'));
  resendBtnMob.disabled = true;
  setTimeout(() => { resendBtnMob.disabled = false; }, 30000);
});

// ── Industry login form ──────────────────────────────────────
const industryForm   = document.getElementById('form-industry-login');
const industryInput  = document.getElementById('login-gstin');
const industrySendBtn= document.getElementById('industry-send-btn');
const industryOtpGrp = document.getElementById('otp-group-industry');
const resendBtnInd   = document.getElementById('resend-otp-btn-industry');
let   industryOtpSent= false;

const vIndustry = new Validator('#form-industry-login', { lang: savedLang, liveValidation: true });

industrySendBtn?.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!industryOtpSent) {
    if (!vIndustry.validateField('gstin')) return;
    const phoneVal = industryInput.value;
    
    try {
      const response = await fetch("http://localhost:5000/api/login/employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phoneVal })
      });
      if (response.ok) {
        const data = await response.json();
        (window._ckStorage || localStorage).setItem('logged_in_company_id', data.company_id);
        (window._ckStorage || localStorage).setItem('logged_in_company_name', data.name);
      } else {
        const errData = await response.json();
        const errMsg = savedLang === 'hi' ? 'मोबाइल नंबर पंजीकृत नहीं है।' : (errData.message || 'Login failed.');
        Toast.error(errMsg);
        return;
      }
    } catch (err) {
      console.warn("Backend connection failed.", err);
      Toast.error("सर्वर से कनेक्शन विफल रहा।");
      return;
    }

    // Simulate OTP send
    Toast.success(I18n.t('alert.otp_sent'));
    industryOtpGrp.style.display = 'block';
    industrySendBtn.textContent = I18n.t('login.title');
    industryOtpSent = true;
  } else {
    const otp = industryOtp?.getValue() || '';
    if (otp.length < 6) {
      alert('कृपया 6 अंकों का OTP दर्ज करें');
      return;
    }
    // Simulate verification — redirect
    window.location.href = '../industry-registration/industrydashboard.html';
  }
});

resendBtnInd?.addEventListener('click', () => {
  industryOtp?.reset();
  Toast.success(I18n.t('alert.otp_sent'));
  resendBtnInd.disabled = true;
  setTimeout(() => { resendBtnInd.disabled = false; }, 30000);
});

// ── Animated stat counters ───────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const update = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.floor(eased * target);
    el.textContent = value >= 1000
      ? value >= 100000
        ? `${(value / 100000).toFixed(1)} लाख`
        : `${(value / 1000).toFixed(0)}K`
      : String(value);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target >= 100000
      ? `${(target / 100000).toFixed(0)} लाख+`
      : target >= 1000 ? `${(target/1000).toFixed(0)}K+` : String(target);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const strip = entry.target;
    strip.querySelectorAll('[data-count]').forEach((el, i) => {
      const valueEl = el.querySelector('.stat-counter__value');
      if (valueEl) setTimeout(() => animateCounter(valueEl, Number(el.dataset.count)), i * 200);
    });
    statsObserver.unobserve(strip);
  });
}, { threshold: 0.3 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

// ── Scroll-reveal for steps ──────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 150);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-observe]').forEach(el => revealObserver.observe(el));
