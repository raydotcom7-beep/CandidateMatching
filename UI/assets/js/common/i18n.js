/* ============================================================
   I18N.JS — Hindi / English Language Switcher
   File: assets/js/common/i18n.js

   Bilingual (हिंदी / English) string management.
   - Central string catalogue per language.
   - DOM auto-translation via [data-i18n="key"] attributes.
   - Supports interpolation: "नमस्ते, {{name}}!"
   - Integrates with App.js language state via custom events.
   - Falls back to English if key missing in Hindi catalogue.

   Usage:
     import I18n from '../../assets/js/common/i18n.js';
     I18n.init('hi');
     I18n.t('nav.home');            // → 'होम'
     I18n.t('greeting', {name:'राम'}) // → 'नमस्ते, राम!'
     I18n.setLanguage('en');        // switches all [data-i18n] elements
   ============================================================ */

const I18n = (() => {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */

  let _lang = 'hi';
  let _catalogue = {};
  let _initialized = false;

  /* ── String Catalogue ───────────────────────────────────── */

  const strings = {

    hi: {
      /* ── Navigation ── */
      'nav.home': 'होम',
      'nav.about': 'हमारे बारे में',
      'nav.services': 'सेवाएं',
      'nav.register': 'पंजीकरण',
      'nav.login': 'लॉगिन',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.citizen_dashboard': 'नागरिक डैशबोर्ड',
      'nav.impact': 'हमारा प्रभाव',
      'nav.recruiters': 'नियोक्ता',
      'nav.contact': 'संपर्क करें',
      'nav.logout': 'लॉगआउट',
      'nav.profile': 'प्रोफ़ाइल',
      'nav.help': 'सहायता',

      /* ── Common Actions ── */
      'action.submit': 'जमा करें',
      'action.save': 'सहेजें',
      'action.cancel': 'रद्द करें',
      'action.delete': 'हटाएं',
      'action.edit': 'संपादित करें',
      'action.view': 'देखें',
      'action.back': 'वापस',
      'action.next': 'आगे',
      'action.previous': 'पिछला',
      'action.search': 'खोजें',
      'action.filter': 'फ़िल्टर',
      'action.reset': 'रीसेट',
      'action.upload': 'अपलोड करें',
      'action.download': 'डाउनलोड करें',
      'action.print': 'प्रिंट करें',
      'action.close': 'बंद करें',
      'action.confirm': 'पुष्टि करें',
      'action.approve': 'स्वीकृत करें',
      'action.reject': 'अस्वीकार करें',
      'action.send': 'भेजें',
      'action.verify': 'सत्यापित करें',
      'action.update_profile': 'प्रोफ़ाइल अपडेट करें',

      /* ── Status Labels ── */
      'status.active': 'सक्रिय',
      'status.inactive': 'निष्क्रिय',
      'status.pending': 'लंबित',
      'status.approved': 'स्वीकृत',
      'status.rejected': 'अस्वीकृत',
      'status.verified': 'सत्यापित',
      'status.unverified': 'असत्यापित',
      'status.submitted': 'जमा किया गया',
      'status.processing': 'प्रक्रियाधीन',
      'status.completed': 'पूर्ण',

      /* ── Form Labels ── */
      'form.full_name': 'पूरा नाम',
      'form.father_name': 'पिता / पति का नाम',
      'form.dob': 'जन्म तिथि',
      'form.gender': 'लिंग',
      'form.gender.male': 'पुरुष',
      'form.gender.female': 'महिला',
      'form.gender.other': 'अन्य',
      'form.mobile': 'मोबाइल नंबर',
      'form.email': 'ईमेल पता',
      'form.aadhaar': 'आधार नंबर',
      'form.otp': 'OTP दर्ज करें',
      'form.address': 'पता',
      'form.district': 'जिला',
      'form.state': 'राज्य',
      'form.pincode': 'पिन कोड',
      'form.category': 'श्रेणी',
      'form.qualification': 'शैक्षिक योग्यता',
      'form.trade': 'व्यवसाय / ट्रेड',
      'form.experience': 'अनुभव (वर्षों में)',
      'form.password': 'पासवर्ड',
      'form.confirm_password': 'पासवर्ड पुनः दर्ज करें',
      'form.captcha': 'कैप्चा',
      'form.pan': 'PAN नंबर',
      'form.gstin': 'GSTIN',
      'form.company_name': 'संस्था / कंपनी का नाम',
      'form.designation': 'पदनाम',
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
      'reg.docs.tenth_marksheet': '10वीं की अंकसूची',
      'reg.docs.twelfth_marksheet': '12वीं की अंकसूची',

      /* ── Placeholders ── */
      'placeholder.search': 'खोजें...',
      'placeholder.select': 'चुनें',
      'placeholder.mobile': '10 अंकों का मोबाइल नंबर',
      'placeholder.aadhaar': '12 अंकों का आधार नंबर',
      'placeholder.otp': '6 अंकों का OTP',
      'placeholder.email': 'example@email.com',
      'placeholder.pincode': '6 अंकों का पिन कोड',

      /* ── Registration ── */
      'reg.title.labour': 'श्रमिक पंजीकरण',
      'reg.title.contractor': 'ठेकेदार पंजीकरण',
      'reg.title.industry': 'उद्योग पंजीकरण',
      'reg.step.personal': 'व्यक्तिगत जानकारी',
      'reg.step.contact': 'संपर्क जानकारी',
      'reg.step.documents': 'दस्तावेज़',
      'reg.step.review': 'समीक्षा करें',
      'reg.ekyc.prompt': 'आधार OTP सत्यापन',
      'reg.ekyc.send_otp': 'OTP भेजें',
      'reg.ekyc.resend_otp': 'OTP पुनः भेजें',
      'reg.ekyc.verify': 'OTP सत्यापित करें',
      'reg.ekyc.success': 'आधार सत्यापन सफल रहा।',
      'reg.success.title': 'पंजीकरण सफल!',
      'reg.success.msg': 'आपका पंजीकरण सफलतापूर्वक पूर्ण हो गया है।',

      /* ── Login ── */
      'login.title': 'लॉगिन करें',
      'login.with_aadhaar': 'आधार OTP से लॉगिन',
      'login.with_password': 'पासवर्ड से लॉगिन',
      'login.forgot_password': 'पासवर्ड भूल गए?',
      'login.no_account': 'खाता नहीं है?',
      'login.register_now': 'अभी पंजीकरण करें',

      /* ── Dashboard ── */
      'dashboard.welcome': 'स्वागत है, {{name}}!',
      'dashboard.rojgar_id': 'रोजगार आईडी',
      'dashboard.profile': 'मेरी प्रोफ़ाइल',
      'dashboard.applications': 'मेरे आवेदन',
      'dashboard.documents': 'मेरे दस्तावेज़',
      'dashboard.notifications': 'सूचनाएं',
      'dashboard.menu.dashboard': 'डैशबोर्ड',
      'dashboard.menu.profile_identity': 'प्रोफाइल एवं पहचान प्रबंधन',
      'dashboard.menu.personal_profile': 'प्रोफाइल प्रबंधन',
      'dashboard.menu.educational_qualification': 'शैक्षिक योग्यता',
      'dashboard.menu.experience_details': 'अनुभव विवरण',
      'dashboard.menu.upload_certificates': 'प्रमाणपत्र अपलोड करें',
      'dashboard.menu.employment_career': 'रोजगार एवं कैरियर सेवाएँ',
      'dashboard.menu.recommended_jobs': 'अनुशंसित नौकरियां',
      'dashboard.menu.ai_recommended_candidates': 'अनुशंसित उम्मीदवार',
      'dashboard.menu.recommended_jobs_subtitle': 'आपके कौशल, अनुभव और प्राथमिकताओं के आधार पर स्मार्ट मिलान',
      'dashboard.menu.shortlisted': 'शॉर्टलिस्टेड उम्मीदवार',
      'shortlisted.title': 'शॉर्टलिस्टेड उम्मीदवार',
      'shortlisted.desc': 'शॉर्टलिस्ट किए गए उम्मीदवारों की समीक्षा करें और नियुक्त करें।',
      'shortlisted.hire': 'नियुक्त करें',
      'shortlisted.success_hire': 'उम्मीदवार को सफलतापूर्वक नियुक्त कर लिया गया है।',
      'kpi.shortlisted': 'शॉर्टलिस्टेड उम्मीदवार',
      'dash.shortlisted': 'शॉर्टलिस्टेड',
      'jobs.showing_prefix_ai': '',
      'jobs.showing_suffix_ai': 'एआई अनुशंसित नौकरियां',
      'dashboard.menu.nearby_jobs': 'आस-पास की नौकरियां',
      'dashboard.menu.applied_jobs': 'आवेदन की गई नौकरियां',
      'dashboard.menu.recommended_courses': 'अनुशंसित पाठ्यक्रम',
      'dashboard.menu.completed_courses': 'पूरे किए गए पाठ्यक्रम',
      'dashboard.header.last_login': 'अंतिम लॉगिन:',
      'dashboard.guidelines.title': 'दिशानिर्देश',
      'dashboard.guidelines.desc': 'लेबर डैशबोर्ड में आपका स्वागत है। बेहतर नौकरी के सुझाव पाने के लिए अपनी प्रोफ़ाइल को अपडेट रखें।',
      'dashboard.signout': 'लॉग आउट',

      /* ── Jobs / Search ── */
      'dashboard.menu.search_jobs': 'नौकरी खोजें',
      'dashboard.menu.search': 'नौकरी खोजें',
      'filter.title': 'फ़िल्टर',
      'filter.clear_all': 'सभी साफ़ करें',
      'filter.show': 'फ़िल्टर दिखाएं',
      'filter.hide': 'फ़िल्टर छिपाएं',
      'filter.location': 'स्थान',
      'filter.all_districts': 'सभी ज़िले',
      'filter.all_cities': 'सभी शहर',
      'filter.experience': 'अनुभव',
      'filter.fresher': 'फ्रेशर (0 वर्ष)',
      'filter.any_experience': 'कोई भी अनुभव सीमा',
      'filter.qualification': 'योग्यता',
      'filter.job_type': 'नौकरी का प्रकार',
      'filter.clear_filters': 'फ़िल्टर साफ़ करें',
      'district.bhopal': 'भोपाल',
      'district.indore': 'इंदौर',
      'district.jabalpur': 'जबलपुर',
      'district.gwalior': 'ग्वालियर',
      'district.rewa': 'रीवा',
      'district.ujjain': 'उज्जैन',
      'city.bhopal': 'भोपाल शहर',
      'city.indore': 'इंदौर शहर',
      'exp.0_1': '0-1 वर्ष',
      'exp.1_3': '1-3 वर्ष',
      'exp.3_5': '3-5 वर्ष',
      'exp.5_plus': '5+ वर्ष',
      'qual.10th': '10वीं',
      'qual.12th': '12वीं',
      'qual.iti': 'आईटीआई',
      'qual.diploma': 'डिप्लोमा',
      'qual.graduate': 'स्नातक',
      'job_type.fulltime': 'पूर्णकालिक',
      'job_type.parttime': 'अंशकालिक',
      'job_type.contractual': 'संविदात्मक',
      'search.title': 'नौकरी खोजें',
      'search.subtitle': 'सही अवसर खोजें',
      'search.job_title': 'नौकरी का शीर्षक',
      'search.placeholder.job_title': 'जैसे राजमिस्त्री, इलेक्ट्रीशियन',
      'search.skill': 'कौशल',
      'search.any_skill': 'कोई भी कौशल',
      'skill.masonry': 'राजमिस्त्री',
      'skill.electrical': 'विद्युत',
      'skill.plumbing': 'प्लमिंग',
      'skill.carpentry': 'बढ़ईगिरी',
      'skill.welding': 'वेल्डिंग',
      'search.button': 'खोजें',
      'jobs.showing_recommended': '{{count}} अनुशंसित नौकरियां',
      'jobs.showing_search': '{{count}} नौकरियां',
      'jobs.sort_by': 'क्रमबद्ध करें:',
      'sort.match': 'मिलान स्कोर',
      'sort.recent': 'सबसे नया',
      'sort.salary': 'वेतन (अधिक से कम)',
      'empty.title': 'कोई नौकरी नहीं मिली',
      'empty.desc.recommended': 'हमें आपके मानदंडों से मेल खाने वाली कोई अनुशंसित नौकरी नहीं मिली। कृपया अपने फ़िल्टर समायोजित करें या अपनी प्रोफ़ाइल अपडेट करें।',
      'empty.desc.recommended_no_filter': 'हमें आपके कौशल से मेल खाने वाली कोई अनुशंसित नौकरी नहीं मिली। बेहतर नौकरी के सुझाव पाने के लिए कृपया अपनी प्रोफ़ाइल अपडेट करें।',
      'empty.desc.search': 'हमें आपके खोज मानदंडों से मेल खाने वाली कोई नौकरी नहीं मिली। कृपया अपने फ़िल्टर या खोज शब्द समायोजित करें।',
      'pagination.load_more': 'और लोड करें',
      'jobs.label.salary': 'वेतन',
      'jobs.label.location': 'स्थान',
      'jobs.label.experience': 'अनुभव',
      'jobs.label.qualification': 'योग्यता',
      'jobs.label.openings': 'रिक्तियां',
      'jobs.label.posts': 'पद',
      'jobs.save': 'सहेजें',
      'jobs.apply_now': 'अभी आवेदन करें →',
      'jobs.match': '% मिलान',
      'jobs.recommended': '⭐ एआई अनुशंसित',


      /* ── Alerts / Messages ── */
      'alert.success': 'सफलता',
      'alert.error': 'त्रुटि',
      'alert.warning': 'चेतावनी',
      'alert.info': 'जानकारी',
      'alert.confirm_delete': 'क्या आप वाकई हटाना चाहते हैं?',
      'alert.unsaved_changes': 'आपके पास सहेजे नहीं गए परिवर्तन हैं।',
      'alert.session_expired': 'आपका सत्र समाप्त हो गया। कृपया पुनः लॉगिन करें।',
      'alert.network_error': 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
      'alert.loading': 'लोड हो रहा है...',
      'alert.no_data': 'कोई डेटा उपलब्ध नहीं है।',
      'alert.server_error': 'सर्वर पर त्रुटि हुई। बाद में पुनः प्रयास करें।',
      'alert.otp_sent': 'OTP सफलतापूर्वक भेज दिया गया।',

      /* ── Theme / UI ── */
      'ui.dark_mode': 'डार्क मोड',
      'ui.light_mode': 'लाइट मोड',
      'ui.language': 'भाषा',
      'ui.skip_to_content': 'मुख्य सामग्री पर जाएं',
      'ui.scroll_to_top': 'ऊपर जाएं',
      'ui.open_menu': 'मेनू खोलें',
      'ui.close_menu': 'मेनू बंद करें',
      'ui.required_field': 'अनिवार्य फ़ील्ड',
      'ui.optional': '(वैकल्पिक)',
      'ui.page_of': 'पृष्ठ {{current}} / {{total}}',
      'ui.showing_results': '{{count}} परिणाम दिखाए जा रहे हैं',

      /* ── Footer ── */
      'footer.rights': 'सर्वाधिकार सुरक्षित',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.terms': 'नियम एवं शर्तें',
      'footer.grievance': 'शिकायत पोर्टल',
      'footer.helpdesk': 'हेल्पडेस्क',

      /* ── Home Page ── */
      'home.services.eyebrow': 'हमारी सेवाएं',
      'home.services.title': 'एक पोर्टल, सभी सेवाएं',
      'home.services.desc': 'श्रमिक, ठेकेदार और उद्योग — सभी के लिए समर्पित पंजीकरण और प्रबंधन सेवाएं।',
      'home.labour.desc': 'आधार eKYC से त्वरित पंजीकरण। डिजिटल रोजगार कार्ड, कौशल प्रमाण-पत्र और लाभ प्राप्त करें।',
      'home.contractor.desc': 'लाइसेंस नवीनीकरण, अनुपालन ट्रैकिंग और कुशल श्रमिकों तक सीधी पहुँच।',
      'home.industry.desc': 'कारखाना अधिनियम के तहत पंजीकरण, GSTIN लिंकिंग और अनुपालन डैशबोर्ड।',
      'home.how.eyebrow': 'यह कैसे काम करता है',
      'home.how.title': '3 आसान चरण',
      'home.how.step1.desc': 'अपना आधार नंबर दर्ज करें। UIDAI से OTP प्राप्त करें और eKYC से आपकी जानकारी स्वतः भर जाएगी।',
      'home.how.step2.title': 'जानकारी सत्यापित करें',
      'home.how.step2.desc': 'व्यक्तिगत विवरण, व्यवसाय और दस्तावेज़ अपलोड करें। सभी डेटा AES-256 से सुरक्षित है।',
      'home.how.step3.title': 'डिजिटल कार्ड प्राप्त करें',
      'home.how.step3.desc': 'स्वीकृति के बाद अपना डिजिटल रोजगार कार्ड और अद्वितीय Rojgar ID तुरंत डाउनलोड करें।',

      /* ── Features ── */
      'home.features.subtitle': 'कौशल सेतु पोर्टल की मुख्य विशेषताएं',
      'home.features.employer_title': 'नियोक्ताओं के लिए',
      'home.features.emp_new1': 'नौकरियां पोस्ट करें',
      'home.features.emp_new2': 'एआई अनुशंसित उम्मीदवार',
      'home.features.emp_new3': 'उम्मीदवार खोजें',
      'home.features.emp_new4': 'प्राप्त आवेदन',
      'home.features.emp1': 'नौकरियां पोस्ट करें',
      'home.features.emp2': 'नौकरी खोजने वालों से व्हाट्सएप के जरिए जुड़ें',
      'home.features.emp3': 'असीमित डेटाबेस खोज',
      'home.features.emp4': 'एक नियोक्ता के लिए कई लॉगिन',
      'home.features.emp5': 'नौकरी खोजने वालों को थोक में ईमेल/एसएमएस भेजें',
      'home.features.jobseeker_title': 'नौकरी चाहने वालों के लिए',
      'home.features.js_new1': 'एआई अनुशंसित नौकरियां',
      'home.features.js_new2': 'नौकरियां खोजें',
      'home.features.js_new3': 'नौकरियों के लिए आवेदन करें',
      'home.features.js1': 'उपयुक्त नौकरियां खोजें और आवेदन करें',
      'home.features.js2': 'रिज्यूमे अनुकूलन',
      'home.features.js3': 'वीडियो रिज्यूमे अपलोड करें',
      'home.features.js4': 'रिज्यूमे बूस्टर - नियोक्ताओं को प्रोफाइल हाइलाइट करना',
      'home.features.js5': 'स्वचालित रूप से रिज्यूमे बनाएं',
      'home.features.js6': 'नौकरी के अवसरों के लिए एसएमएस अलर्ट',

      /* ── Services Section ── */
      'services.cat1.title': '1. पहचान एवं पंजीकरण सेवाएं',
      'services.cat1.item1': 'श्रमिक पंजीकरण',
      'services.cat1.item2': 'उद्योग पंजीकरण',
      'services.cat1.item3': 'टीएसपी / एबी पंजीकरण',
      'services.cat1.item4': 'आधार ई-केवाईसी सत्यापन',
      'services.cat1.item5': 'डिजिटल स्किल वॉलेट',
      'services.cat1.item6': 'बहु-भूमिका लॉगिन',

      'services.cat2.title': '2. कौशल एवं प्रमाणन सेवाएं',
      'services.cat2.item1': 'कौशल मूल्यांकन',
      'services.cat2.item2': 'आरपीएल (RPL)',
      'services.cat2.item3': 'एआई कौशल अंतराल विश्लेषण',
      'services.cat2.item4': 'ऑनलाइन पाठ्यक्रम',
      'services.cat2.item5': 'ऑफलाइन प्रशिक्षण',
      'services.cat2.item6': 'डिजिटल प्रमाणन',

      'services.cat3.title': '3. रोजगार एवं प्लेसमेंट सेवाएं',
      'services.cat3.item1': 'एआई जॉब मैचिंग',
      'services.cat3.item2': 'नौकरियां खोजें',
      'services.cat3.item3': 'एआई अनुशंसित नौकरियां',
      'services.cat3.item4': 'रोजगार मेला',
      'services.cat3.item5': 'प्लेसमेंट ट्रैकिंग',
      'services.cat3.item6': 'नियोक्ता भर्ती',

      'services.cat4.title': '4. नागरिक एवं प्रशासन सेवाएं',
      'services.cat4.item1': 'नागरिक डैशबोर्ड',
      'services.cat4.item2': 'शिकायत प्रबंधन',
      'services.cat4.item3': 'सूचनाएं एवं अलर्ट',
      'services.cat4.item4': 'बायोमेट्रिक उपस्थिति',
      'services.cat4.item5': 'एनालिटिक्स और एमआईएस रिपोर्ट',
      'services.cat4.item6': 'एडमिन / नोडल निगरानी',

      /* ── Login / Contact ── */
      'home.login.title': 'पंजीकृत श्रमिक लॉगिन',
      'home.login.title.industry': 'पंजीकृत उद्योग लॉगिन',
      'login.title': 'लॉगिन करें',
      'login.sub': 'अपने रजिस्टर्ड मोबाइल नंबर / आधार से लॉगिन करें',
      'login.sub.industry': 'अपने GSTIN से लॉगिन करें',
      'login.tab.aadhaar': 'आधार OTP से',
      'login.tab.mobile': 'मोबाइल से',
      'login.tab.industry': 'उद्योग',
      'placeholder.gstin': '15 अंकों का GSTIN',
      'login.label.aadhaar': 'आधार नंबर',
      'login.otp': 'OTP दर्ज करें',
      'login.otp_send': 'OTP भेजें',
      'login.otp_resend': 'OTP पुनः भेजें',
      'login.no_account': 'खाता नहीं है?',
      'login.register_now': 'अभी पंजीकरण करें',
      'contact.helpline': 'हेल्पलाइन',
      'contact.helpline.note': 'सोम - शुक्र 08:00 AM - 08:00 PM<br>शनि - रवि 09:30 AM - 06:30 PM',
      'contact.email': 'ईमेल समर्थन',
      'contact.email.note': '24 घंटे के भीतर उत्तर',
      'contact.email.note2': '24 घंटे के भीतर उत्तर',
      'contact.grievance': 'शिकायत पोर्टल',
      'contact.grievance.note': 'ऑनलाइन शिकायत दर्ज करें',
      'contact.office': 'मुख्य कार्यालय',
      'contact.office.note': 'मध्य प्रदेश भवन, भोपाल',
      'footer.tagline': 'कुशल कारीगरों को सही अवसर से जोड़ने का डिजिटल मंच।',
      'footer.quick_links': 'त्वरित लिंक',
      'footer.gov': 'भारत सरकार | Government of India',
      'home.hero.title1': 'कुशल कारीगर,',
      'home.hero.title2': 'सही अवसर',
      'home.hero.subtitle': 'मध्य प्रदेश सरकार का आधिकारिक डिजिटल मंच — श्रमिकों, ठेकेदारों और उद्योगों को एक ही स्थान पर जोड़ता है।',
      'home.hero.cta.labour': 'श्रमिक पंजीकरण करें',
      'home.hero.cta.services': 'सेवाएं देखें',
      'home.hero.trust.aadhaar': '✅ आधार-सत्यापित',
      'home.hero.trust.secure': '🔒 100% सुरक्षित',
      'home.hero.trust.mobile': '📱 मोबाइल-फर्स्ट',
      'home.stats.count': '5 लाख+',
      'home.stats.labourers': 'पंजीकृत श्रमिक',
      'home.stats.employers': 'नियोक्ता',
      'home.stats.districts': '75 जिले',
      'home.stats.covered': 'कवर किए',
      'home.stats.placements': 'सफल नियुक्तियाँ',
      'login.placeholder.mobile': '10 अंकों का मोबाइल नंबर',
      'login.placeholder.aadhaar': '12 अंकों का आधार नंबर',
      'login.label.mobile': 'मोबाइल नंबर',

      /* ── Our Impact ── */
      'impact.title': 'हमारा प्रभाव',
      'impact.left_desc': 'कौशल सेतु राज्य भर में व्यापक प्रभाव डाल रहा है।',
      'impact.stat1': 'पंजीकृत श्रमिक',
      'impact.stat2': 'नियोक्ता और उद्योग',
      'impact.stat3': 'पंजीकृत ठेकेदार',
      'impact.right_desc': 'रोजगार मेले और प्लेसमेंट',
      'impact.stat4': 'उम्मीदवार नियुक्त',
      'impact.stat5': 'नौकरियां सृजित',
      'impact.stat6': 'जिले शामिल',

      /* ── Recruiters ── */
      'recruiters.title': 'शीर्ष नियोक्ता',

      /* ── Chatbot (Kaushal Mitra) ── */
      'chatbot.name': 'कौशल मित्र',
      'chatbot.welcome_msg': 'नमस्ते! मैं हूँ <b>कौशल मित्र</b>, आपका डिजिटल सहायक। कौशल सेतु पोर्टल पर मैं आपकी क्या मदद कर सकता हूँ?',
      'chatbot.q1': 'कौशल सेतु क्या है?',
      'chatbot.q2': 'श्रमिक पंजीकरण कैसे करें?',
      'chatbot.q3': 'उद्योग / नियोक्ता पंजीकरण कैसे करें?',
      'chatbot.q4': 'कौशल विकास पाठ्यक्रम क्या हैं?',
      'chatbot.placeholder': 'अपना प्रश्न यहाँ टाइप करें...',
    },

    en: {
      /* ── Navigation ── */
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.services': 'Services',
      'nav.register': 'Register',
      'nav.login': 'Login',
      'nav.dashboard': 'Dashboard',
      'nav.citizen_dashboard': 'Citizen Dashboard',
      'nav.impact': 'Our Impact',
      'nav.recruiters': 'Recruiters',
      'nav.contact': 'Contact Us',
      'nav.logout': 'Logout',
      'nav.profile': 'Profile',
      'nav.help': 'Help',

      /* ── Common Actions ── */
      'action.submit': 'Submit',
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.delete': 'Delete',
      'action.edit': 'Edit',
      'action.view': 'View',
      'action.back': 'Back',
      'action.next': 'Next',
      'action.previous': 'Previous',
      'action.search': 'Search',
      'action.filter': 'Filter',
      'action.reset': 'Reset',
      'action.upload': 'Upload',
      'action.download': 'Download',
      'action.print': 'Print',
      'action.close': 'Close',
      'action.confirm': 'Confirm',
      'action.approve': 'Approve',
      'action.reject': 'Reject',
      'action.send': 'Send',
      'action.verify': 'Verify',
      'action.update_profile': 'Update Profile',

      /* ── Status Labels ── */
      'status.active': 'Active',
      'status.inactive': 'Inactive',
      'status.pending': 'Pending',
      'status.approved': 'Approved',
      'status.rejected': 'Rejected',
      'status.verified': 'Verified',
      'status.unverified': 'Unverified',
      'status.submitted': 'Submitted',
      'status.processing': 'Processing',
      'status.completed': 'Completed',

      /* ── Form Labels ── */
      'form.full_name': 'Full Name',
      'form.father_name': 'Father / Husband Name',
      'form.dob': 'Date of Birth',
      'form.gender': 'Gender',
      'form.gender.male': 'Male',
      'form.gender.female': 'Female',
      'form.gender.other': 'Other',
      'form.mobile': 'Mobile Number',
      'form.email': 'Email Address',
      'form.aadhaar': 'Aadhaar Number',
      'form.otp': 'Enter OTP',
      'form.address': 'Address',
      'form.district': 'District',
      'form.state': 'State',
      'form.pincode': 'PIN Code',
      'form.category': 'Category',
      'form.qualification': 'Educational Qualification',
      'form.trade': 'Trade / Occupation',
      'form.experience': 'Experience (Years)',
      'form.password': 'Password',
      'form.confirm_password': 'Confirm Password',
      'form.captcha': 'Captcha',
      'form.pan': 'PAN Number',
      'form.gstin': 'GSTIN',
      'form.company_name': 'Organisation / Company Name',
      'form.designation': 'Designation',
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

      /* ── Placeholders ── */
      'placeholder.search': 'Search...',
      'placeholder.select': 'Select',
      'placeholder.mobile': '10-digit mobile number',
      'placeholder.aadhaar': '12-digit Aadhaar number',
      'placeholder.otp': '6-digit OTP',
      'placeholder.email': 'example@email.com',
      'placeholder.pincode': '6-digit PIN code',

      /* ── Registration ── */
      'reg.title.labour': 'Labour Registration',
      'reg.title.contractor': 'Contractor Registration',
      'reg.title.industry': 'Industry Registration',
      'reg.step.personal': 'Personal Information',
      'reg.step.contact': 'Contact Information',
      'reg.step.documents': 'Documents',
      'reg.step.review': 'Review',
      'reg.ekyc.prompt': 'Aadhaar OTP Verification',
      'reg.ekyc.send_otp': 'Send OTP',
      'reg.ekyc.resend_otp': 'Resend OTP',
      'reg.ekyc.verify': 'Verify OTP',
      'reg.ekyc.success': 'Aadhaar verification successful.',
      'reg.success.title': 'Registration Successful!',
      'reg.success.msg': 'Your registration has been completed successfully.',

      /* ── Login ── */
      'login.title': 'Login',
      'login.with_aadhaar': 'Login with Aadhaar OTP',
      'login.with_password': 'Login with Password',
      'login.forgot_password': 'Forgot Password?',
      'login.no_account': "Don't have an account?",
      'login.register_now': 'Register Now',

      /* ── Dashboard ── */
      'dashboard.welcome': 'Welcome, {{name}}!',
      'dashboard.rojgar_id': 'Rojgar ID',
      'dashboard.profile': 'My Profile',
      'dashboard.applications': 'My Applications',
      'dashboard.documents': 'My Documents',
      'dashboard.notifications': 'Notifications',
      'dashboard.menu.dashboard': 'Dashboard',
      'dashboard.menu.profile_identity': 'Profile & Identity Management',
      'dashboard.menu.personal_profile': 'Profile Management',
      'dashboard.menu.educational_qualification': 'Educational Qualification',
      'dashboard.menu.experience_details': 'Experience Details',
      'dashboard.menu.upload_certificates': 'Upload Certificates',
      'dashboard.menu.employment_career': 'Employment & Career Services',
      'dashboard.menu.recommended_jobs': 'Recommended Jobs',
      'dashboard.menu.ai_recommended_candidates': 'Recommended Candidates',
      'dashboard.menu.recommended_jobs_subtitle': 'Smart matching based on your skills, experience & preferences',
      'dashboard.menu.shortlisted': 'Shortlisted Candidates',
      'shortlisted.title': 'Shortlisted Candidates',
      'shortlisted.desc': 'Review and hire shortlisted candidates.',
      'shortlisted.hire': 'Hire',
      'shortlisted.success_hire': 'Candidate hired successfully.',
      'kpi.shortlisted': 'Shortlisted Candidates',
      'dash.shortlisted': 'Shortlisted',
      'jobs.showing_prefix_ai': 'Showing',
      'jobs.showing_suffix_ai': 'AI recommended jobs',
      'dashboard.menu.nearby_jobs': 'Nearby Jobs',
      'dashboard.menu.applied_jobs': 'Applied Jobs',
      'dashboard.menu.recommended_courses': 'Recommended Courses',
      'dashboard.menu.completed_courses': 'Completed Courses',
      'dashboard.header.last_login': 'Last login:',
      'dashboard.guidelines.title': 'Guidelines',
      'dashboard.guidelines.desc': 'Welcome to the Labour Dashboard. Keep your profile updated to get better job recommendations.',
      'dashboard.signout': 'Sign out',

      /* ── Alerts / Messages ── */
      'alert.success': 'Success',
      'alert.error': 'Error',
      'alert.warning': 'Warning',
      'alert.info': 'Information',
      'alert.confirm_delete': 'Are you sure you want to delete this?',
      'alert.unsaved_changes': 'You have unsaved changes.',
      'alert.session_expired': 'Your session has expired. Please log in again.',
      'alert.network_error': 'Network error. Please try again.',
      'alert.loading': 'Loading...',
      'alert.no_data': 'No data available.',
      'alert.server_error': 'A server error occurred. Please try again later.',
      'alert.otp_sent': 'OTP sent successfully.',

      /* ── Theme / UI ── */
      'ui.dark_mode': 'Dark Mode',
      'ui.light_mode': 'Light Mode',
      'ui.language': 'Language',
      'ui.skip_to_content': 'Skip to main content',
      'ui.scroll_to_top': 'Scroll to top',
      'ui.open_menu': 'Open menu',
      'ui.close_menu': 'Close menu',
      'ui.required_field': 'Required field',
      'ui.optional': '(Optional)',
      'ui.page_of': 'Page {{current}} of {{total}}',
      'ui.showing_results': 'Showing {{count}} results',

      /* ── Footer ── */
      'footer.rights': 'All Rights Reserved',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms & Conditions',
      'footer.grievance': 'Grievance Portal',
      'footer.helpdesk': 'Helpdesk',

      /* ── Home Page ── */
      'home.services.eyebrow': 'Our Services',
      'home.services.title': 'One Portal, All Services',
      'home.services.desc': 'Dedicated registration and management services for labourers, contractors, and industries.',
      'home.labour.desc': 'Instant registration via Aadhaar eKYC. Get digital employment card, skill certificates and benefits.',
      'home.contractor.desc': 'License renewal, compliance tracking, and direct access to skilled labourers.',
      'home.industry.desc': 'Registration under Factories Act, GSTIN linking, and compliance dashboard.',
      'home.how.eyebrow': 'How it works',
      'home.how.title': '3 Easy Steps',
      'home.how.step1.desc': 'Enter your Aadhaar number. Get OTP from UIDAI and your details will auto-fill via eKYC.',
      'home.how.step2.title': 'Verify Details',
      'home.how.step2.desc': 'Upload personal details, occupation, and documents. All data is AES-256 secured.',
      'home.how.step3.title': 'Get Digital Card',
      'home.how.step3.desc': 'Instantly download your digital employment card and unique Rojgar ID upon approval.',

      /* ── Features ── */
      'home.features.subtitle': 'Key Features of Kaushal Setu Portal',
      'home.features.employer_title': 'For Employers',
      'home.features.emp_new1': 'Post Jobs',
      'home.features.emp_new2': 'AI Recommended Candidates',
      'home.features.emp_new3': 'Search Candidate',
      'home.features.emp_new4': 'Received Applications',
      'home.features.emp1': 'Job postings',
      'home.features.emp2': 'Ability to connect with jobseekers via WhatsApp',
      'home.features.emp3': 'Unlimited database searches',
      'home.features.emp4': 'Multiple logins for a single employer',
      'home.features.emp5': 'Sending bulk emails/SMS to jobseekers',
      'home.features.jobseeker_title': 'For Jobseekers',
      'home.features.js_new1': 'AI Recommended Jobs',
      'home.features.js_new2': 'Search Jobs',
      'home.features.js_new3': 'Apply Jobs',
      'home.features.js1': 'Search and apply for suitable jobs',
      'home.features.js2': 'Resume customization',
      'home.features.js3': 'Upload video resumes',
      'home.features.js4': 'Resume Booster - highlighting profile to employers',
      'home.features.js5': 'Auto generate resume',
      'home.features.js6': 'SMS alerts for job openings',

      /* ── Services Section ── */
      'services.cat1.title': '1. Identity & Registration Services',
      'services.cat1.item1': 'Labour Registration',
      'services.cat1.item2': 'Industry Registration',
      'services.cat1.item3': 'TSP / AB Registration',
      'services.cat1.item4': 'Aadhaar eKYC Verification',
      'services.cat1.item5': 'Digital Skill Wallet',
      'services.cat1.item6': 'Multi-role Login',

      'services.cat2.title': '2. Skill & Certification Services',
      'services.cat2.item1': 'Skill Assessment',
      'services.cat2.item2': 'RPL',
      'services.cat2.item3': 'AI Skill Gap Analysis',
      'services.cat2.item4': 'Online Courses',
      'services.cat2.item5': 'Offline Training',
      'services.cat2.item6': 'Digital Certifications',

      'services.cat3.title': '3. Employment & Placement Services',
      'services.cat3.item1': 'AI Job Matching',
      'services.cat3.item2': 'Search Jobs',
      'services.cat3.item3': 'AI Recommended Jobs',
      'services.cat3.item4': 'Rozgar Mela',
      'services.cat3.item5': 'Placement Tracking',
      'services.cat3.item6': 'Employer Hiring',

      'services.cat4.title': '4. Citizen & Governance Services',
      'services.cat4.item1': 'Citizen Dashboard',
      'services.cat4.item2': 'Grievance Management',
      'services.cat4.item3': 'Notifications & Alerts',
      'services.cat4.item4': 'Biometric Attendance',
      'services.cat4.item5': 'Analytics & MIS Reports',
      'services.cat4.item6': 'Admin / Nodal Monitoring',

      /* ── Login / Contact ── */
      'home.login.title': 'Registered Labour Login',
      'home.login.title.industry': 'Registered Industry Login',
      'login.title': 'Login',
      'login.sub': 'Login with your registered Mobile Number / Aadhaar',
      'login.sub.industry': 'Login with your GSTIN',
      'login.tab.aadhaar': 'Aadhaar OTP',
      'login.tab.mobile': 'Mobile',
      'login.tab.industry': 'Industry',
      'placeholder.gstin': '15-digit GSTIN',
      'login.label.aadhaar': 'Aadhaar Number',
      'login.otp': 'Enter OTP',
      'login.otp_send': 'Send OTP',
      'login.otp_resend': 'Resend OTP',
      'login.no_account': 'Don\'t have an account?',
      'login.register_now': 'Register Now',
      'contact.helpline': 'Helpline',
      'contact.helpline.note': 'Mon-Fri 08:00 AM - 08:00 PM<br>Sat-Sun 09:30 AM - 06:30 PM',
      'contact.email': 'Email Support',
      'contact.email.note': 'Reply within 24 hours',
      'contact.email.note2': 'Reply within 24 hours',
      'contact.grievance': 'Grievance Portal',
      'contact.grievance.note': 'Lodge Online Grievance',
      'contact.office': 'Head Office',
      'contact.office.note': 'Madhya Pradesh Bhavan, Bhopal',
      'footer.tagline': 'A digital platform connecting skilled artisans to the right opportunities.',
      'footer.quick_links': 'Quick Links',
      'footer.gov': 'Govt of India',
      'home.hero.title1': 'Skilled Artisans,',
      'home.hero.title2': 'Right Opportunities',
      'home.hero.subtitle': 'Official digital platform of Govt of Madhya Pradesh — connecting labourers, contractors, and industries in one place.',
      'home.hero.cta.labour': 'Register as Labour',
      'home.hero.cta.services': 'View Services',
      'home.hero.trust.aadhaar': '✅ Aadhaar-Verified',
      'home.hero.trust.secure': '🔒 100% Secure',
      'home.hero.trust.mobile': '📱 Mobile-First',
      'home.stats.count': '5 Lakh+',
      'home.stats.labourers': 'Registered Labourers',
      'home.stats.employers': 'Employers',
      'home.stats.districts': '75 Districts',
      'home.stats.covered': 'Covered',
      'home.stats.placements': 'Successful Placements',
      'login.placeholder.mobile': '10 digit Mobile Number',
      'login.placeholder.aadhaar': '12 digit Aadhaar Number',
      'login.label.mobile': 'Mobile Number',

      /* ── Our Impact ── */
      'impact.title': 'Our Impact',
      'impact.left_desc': 'Kaushal Setu drives tremendous impact across the state.',
      'impact.stat1': 'Registered Labours',
      'impact.stat2': 'Employers & Industries',
      'impact.stat3': 'Registered Contractors',
      'impact.right_desc': 'Rozgar Melas & Placements',
      'impact.stat4': 'Candidates Placed',
      'impact.stat5': 'Job Posts Created',
      'impact.stat6': 'Districts Covered',

      /* ── Recruiters ── */
      'recruiters.title': 'Top Recruiters',

      /* ── Jobs / Search ── */
      'dashboard.menu.search_jobs': 'Search Jobs',
      'dashboard.menu.search': 'Search Jobs',
      'filter.title': 'Filters',
      'filter.clear_all': 'Clear All',
      'filter.show': 'Show Filters',
      'filter.hide': 'Hide Filters',
      'filter.location': 'Location',
      'filter.all_districts': 'All Districts',
      'filter.all_cities': 'All Cities',
      'filter.experience': 'Experience',
      'filter.fresher': 'Fresher',
      'filter.any_experience': 'Any Experience Range',
      'filter.qualification': 'Qualification',
      'filter.job_type': 'Job Type',
      'filter.clear_filters': 'Clear Filters',
      'district.bhopal': 'Bhopal',
      'district.indore': 'Indore',
      'district.jabalpur': 'Jabalpur',
      'district.gwalior': 'Gwalior',
      'district.rewa': 'Rewa',
      'district.ujjain': 'Ujjain',
      'city.bhopal': 'Bhopal City',
      'city.indore': 'Indore City',
      'exp.0_1': '0-1 Year',
      'exp.1_3': '1-3 Years',
      'exp.3_5': '3-5 Years',
      'exp.5_plus': '5+ Years',
      'qual.10th': '10th',
      'qual.12th': '12th',
      'qual.iti': 'ITI',
      'qual.diploma': 'Diploma',
      'qual.graduate': 'Graduate',
      'job_type.fulltime': 'Full Time',
      'job_type.parttime': 'Part Time',
      'job_type.contractual': 'Contractual',
      'search.title': 'Search Job',
      'search.subtitle': 'Find the Right Opportunity',
      'search.job_title': 'Job Title',
      'search.placeholder.job_title': 'e.g. Mason, Electrician',
      'search.skill': 'Skill',
      'search.any_skill': 'Any Skill',
      'skill.masonry': 'Masonry',
      'skill.electrical': 'Electrical',
      'skill.plumbing': 'Plumbing',
      'skill.carpentry': 'Carpentry',
      'skill.welding': 'Welding',
      'search.button': 'Search',
      'jobs.showing_recommended': '{{count}} recommended jobs',
      'jobs.showing_search': '{{count}} jobs',
      'jobs.sort_by': 'Sort by:',
      'sort.match': 'Match Score',
      'sort.recent': 'Most Recent',
      'sort.salary': 'Salary (High to Low)',
      'empty.title': 'No Jobs Found',
      'empty.desc.recommended': 'We couldn\'t find any recommended jobs matching your criteria. Try adjusting your filters or updating your profile.',
      'empty.desc.recommended_no_filter': 'We couldn\'t find any recommended jobs matching your skills. Try updating your profile to get better recommendations.',
      'empty.desc.search': 'We couldn\'t find any jobs matching your search criteria. Try adjusting your filters or search terms.',
      'pagination.load_more': 'Load More',
      'jobs.label.salary': 'Salary',
      'jobs.label.location': 'Location',
      'jobs.label.experience': 'Experience',
      'jobs.label.qualification': 'Qualification',
      'jobs.label.openings': 'Openings',
      'jobs.label.posts': 'Posts',
      'jobs.save': 'Save',
      'jobs.apply_now': 'Apply Now →',
      'jobs.match': '% Match',
      'jobs.recommended': '⭐ AI Recommended',

      /* ── Chatbot (Kaushal Mitra) ── */
      'chatbot.name': 'Kaushal Mitra',
      'chatbot.welcome_msg': 'Namaste! I am <b>Kaushal Mitra</b>, your digital assistant. How can I help you on the Kaushal Setu portal?',
      'chatbot.q1': 'What is Kaushal Setu?',
      'chatbot.q2': 'How to register as a Labour?',
      'chatbot.q3': 'How to register as an Industry/Employer?',
      'chatbot.q4': 'What are the skill training courses?',
      'chatbot.placeholder': 'Type your question here...',
    },
  };


  /* ── Init ──────────────────────────────────────────────── */

  /**
   * Initialize I18n with a language and optional custom strings.
   * @param {'hi'|'en'} lang
   * @param {Object} [customStrings] — merged into catalogue
   */
  function init(lang = 'hi', customStrings = {}) {
    _lang = ['hi', 'en'].includes(lang) ? lang : 'hi';

    // Merge custom strings into both languages if provided
    if (customStrings.hi) Object.assign(strings.hi, customStrings.hi);
    if (customStrings.en) Object.assign(strings.en, customStrings.en);

    _catalogue = strings[_lang];
    _initialized = true;

    // Apply to existing DOM
    translateDOM();

    // Set HTML lang attribute
    document.documentElement.setAttribute('lang', _lang === 'hi' ? 'hi-IN' : 'en-IN');

    console.info(`[I18n] Initialized with language: ${_lang}`);
  }


  /* ── Language Switching ─────────────────────────────────── */

  /**
   * Switch active language and re-translate the DOM.
   * @param {'hi'|'en'} lang
   */
  function setLanguage(lang) {
    if (!['hi', 'en'].includes(lang)) {
      console.warn(`[I18n] Unsupported language: ${lang}`);
      return;
    }

    _lang = lang;
    _catalogue = strings[_lang];

    translateDOM();

    document.documentElement.setAttribute('lang', lang === 'hi' ? 'hi-IN' : 'en-IN');

    try {
      (window._ckStorage || localStorage).setItem('ck-ui-lang', lang);
    } catch (e) { }

    // Dispatch event so App.js and other modules can react
    document.dispatchEvent(new CustomEvent('i18n:languageChanged', {
      bubbles: true,
      detail: { language: lang },
    }));
  }

  /**
   * Get current active language code.
   * @returns {'hi'|'en'}
   */
  function getLanguage() {
    return _lang;
  }

  /**
   * Toggle between Hindi and English.
   */
  function toggleLanguage() {
    setLanguage(_lang === 'hi' ? 'en' : 'hi');
  }


  /* ── Translation ────────────────────────────────────────── */

  /**
   * Translate a key, with optional interpolation.
   *
   * @param {string} key — e.g. 'nav.home', 'dashboard.welcome'
   * @param {Object} [vars] — e.g. { name: 'Ramesh' }
   * @returns {string}
   *
   * @example
   *   I18n.t('dashboard.welcome', { name: 'Ramesh' });
   *   // hi → 'स्वागत है, Ramesh!'
   *   // en → 'Welcome, Ramesh!'
   */
  function t(key, vars = {}) {
    if (!_initialized) {
      console.warn('[I18n] Called t() before init(). Defaulting to Hindi.');
      _catalogue = strings.hi;
      _initialized = true;
    }

    // Look up in current lang, fall back to English, then key itself
    let str = _catalogue[key]
      || strings.en[key]
      || key;

    // Interpolate {{variable}} placeholders
    str = str.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
      return vars[varName] !== undefined ? String(vars[varName]) : `{{${varName}}}`;
    });

    return str;
  }


  /* ── DOM Auto-Translation ───────────────────────────────── */

  /**
   * Translate all elements carrying [data-i18n] in the document.
   *
   * Attribute formats:
   *   <span data-i18n="nav.home"></span>
   *     → sets textContent
   *
   *   <input data-i18n="placeholder:placeholder.search" />
   *     → sets placeholder attribute
   *
   *   <img data-i18n="alt:ui.logo_alt" />
   *     → sets alt attribute
   *
   *   <button data-i18n="aria-label:ui.open_menu"></button>
   *     → sets aria-label attribute
   *
   * @param {Element} [root=document] — scope to a subtree after dynamic load
   */
  function translateDOM(root = document) {
    const elements = root.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
      const directives = el.getAttribute('data-i18n').split(';');

      directives.forEach(directive => {
        directive = directive.trim();
        if (!directive) return;

        if (directive.includes(':')) {
          // Attribute mode: "attr:key"
          const colonIdx = directive.indexOf(':');
          const attr = directive.slice(0, colonIdx).trim();
          const key = directive.slice(colonIdx + 1).trim();
          const val = t(key);

          if (attr === 'html') {
            el.innerHTML = val;
          } else {
            el.setAttribute(attr, val);
          }
        } else {
          // Text content mode
          el.textContent = t(directive);
        }
      });
    });
  }


  /* ── Extend Catalogue ───────────────────────────────────── */

  /**
   * Add or override strings at runtime (e.g. from page-specific JS).
   * @param {'hi'|'en'} lang
   * @param {Object} newStrings
   */
  function extend(lang, newStrings) {
    if (strings[lang]) {
      Object.assign(strings[lang], newStrings);
      // If active language, refresh catalogue
      if (lang === _lang) {
        _catalogue = strings[_lang];
      }
    }
  }


  /* ── Pluralization Helper ───────────────────────────────── */

  /**
   * Simple plural form selection.
   * @param {string} singularKey
   * @param {string} pluralKey
   * @param {number} count
   * @param {Object} [vars]
   * @returns {string}
   */
  function plural(singularKey, pluralKey, count, vars = {}) {
    const key = count === 1 ? singularKey : pluralKey;
    return t(key, { count, ...vars });
  }


  /* ── Language Toggle Button Setup ───────────────────────── */

  /**
   * Wire up a language toggle button automatically.
   * Looks for #lang-toggle or [data-lang-toggle] in the DOM.
   */
  function setupToggleButton() {
    const btn = document.getElementById('lang-toggle')
      || document.querySelector('[data-lang-toggle]');

    if (!btn) return;

    const updateBtn = () => {
      btn.textContent = _lang === 'hi' ? 'English' : 'हिंदी';
      btn.setAttribute('aria-label', _lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें');
      btn.setAttribute('lang', _lang === 'hi' ? 'en' : 'hi');
    };

    btn.addEventListener('click', () => {
      toggleLanguage();
      updateBtn();
    });

    updateBtn();
  }


  /* ── Public API ─────────────────────────────────────────── */

  return {
    init,
    t,
    setLanguage,
    getLanguage,
    toggleLanguage,
    translateDOM,
    extend,
    plural,
    setupToggleButton,
    get lang() { return _lang; },
  };

})();


if (typeof window !== 'undefined') window.I18n = I18n;
