/**
 * Citizen Dashboard Scripts
 * Initializes Chart.js instances based on the static data
 */

(function() {
    'use strict';

    // Current language from storage
    const lang = (window._ckStorage || localStorage).getItem('ck-ui-lang') || 'hi';

    // Extend translations
    I18n.extend('hi', {
        'dashboard.title': 'नागरिक डैशबोर्ड (Citizen Dashboard)',
        'dashboard.subtitle': 'रीयल-टाइम पोर्टल आँकड़े और रोजगार डेटा',
        
        'dashboard.metric.total_registered_labours': 'कुल पंजीकृत श्रमिक',
        'dashboard.metric.total_active_labours': 'कुल सक्रिय श्रमिक',
        'dashboard.metric.contractors_registered': 'पंजीकृत ठेकेदार',
        'dashboard.metric.industries_registered': 'पंजीकृत उद्योग',
        'dashboard.metric.employers_registered': 'पंजीकृत नियोक्ता',
        'dashboard.metric.total_job_posts': 'कुल सृजित नौकरियां',
        'dashboard.metric.total_jobs_filled': 'कुल भरी गई नौकरियां',
        'dashboard.metric.total_active_vacancies': 'कुल सक्रिय रिक्तियां',
        'dashboard.metric.women_labour_registered': 'पंजीकृत महिला श्रमिक',
        'dashboard.metric.migrant_workers_registered': 'पंजीकृत प्रवासी श्रमिक',
        'dashboard.metric.total_labour_placed': 'कुल नियोजित श्रमिक',
        'dashboard.metric.placement_ratio': 'रोजगार दर (Placement Ratio)',
        'dashboard.metric.jobs_applied': 'कुल आवेदित नौकरियां',
        'dashboard.metric.interview_scheduled': 'नियत साक्षात्कार',
        'dashboard.metric.active_job_seekers': 'सक्रिय रोजगार चाहने वाले',

        'dashboard.chart.gender': 'जेंडर-वार पंजीकृत श्रमिक',
        'dashboard.chart.age': 'आयु वर्ग-वार श्रमिक वितरण',
        'dashboard.chart.qualification': 'पंजीकृत श्रमिकों की उच्चतम योग्यता',
        'dashboard.chart.certification': 'श्रमिक प्रमाणन वितरण',
        'dashboard.chart.placement': 'पंजीकृत श्रमिक बनाम रोजगार प्राप्त श्रमिक',
        'dashboard.chart.skills': 'शीर्ष पंजीकृत कौशल',

        'dashboard.label.percentage': 'प्रतिशत (%)',
        'dashboard.label.registered_workers': 'पंजीकृत श्रमिक',
        
        'chart.gender.male': 'पुरुष',
        'chart.gender.female': 'महिला',
        'chart.gender.other': 'अन्य',
        
        'chart.qual.below_10': '10वीं से कम',
        'chart.qual.10th': '10वीं',
        'chart.qual.12th': '12वीं',
        'chart.qual.iti': 'आईटीआई',
        'chart.qual.diploma': 'डिप्लोमा',
        'chart.qual.grad': 'स्नातक',
        'chart.qual.post_grad': 'स्नातकोत्तर',

        'chart.cert.iti': 'आईटीआई प्रमाणित',
        'chart.cert.nsdc': 'एनएसडीसी प्रमाणित',
        'chart.cert.skill': 'कौशल विकास',
        'chart.cert.apprentice': 'अपरेंटिसशिप',
        'chart.cert.safety': 'सुरक्षा प्रशिक्षण',
        'chart.cert.none': 'गैर-प्रमाणित',

        'chart.place.got_jobs': 'रोजगार प्राप्त',
        'chart.place.not_placed': 'अभी तक अप्राप्त',

        'chart.skill.electrician': 'इलेक्ट्रीशियन',
        'chart.skill.welder': 'वेल्डर',
        'chart.skill.mason': 'राजमिस्त्री',
        'chart.skill.plumber': 'प्लंबर',
        'chart.skill.operator': 'मशीन ऑपरेटर'
    });

    I18n.extend('en', {
        'dashboard.title': 'Citizen Dashboard',
        'dashboard.subtitle': 'Real-time Portal Statistics & Employment Data',

        'dashboard.metric.total_registered_labours': 'Total Registered Labours',
        'dashboard.metric.total_active_labours': 'Total Active Labours',
        'dashboard.metric.contractors_registered': 'Contractors Registered',
        'dashboard.metric.industries_registered': 'Industries Registered',
        'dashboard.metric.employers_registered': 'Employers Registered',
        'dashboard.metric.total_job_posts': 'Total Job Posts Created',
        'dashboard.metric.total_jobs_filled': 'Total Jobs Filled',
        'dashboard.metric.total_active_vacancies': 'Total Active Vacancies',
        'dashboard.metric.women_labour_registered': 'Women Labour Registered',
        'dashboard.metric.migrant_workers_registered': 'Migrant Workers Registered',
        'dashboard.metric.total_labour_placed': 'Total Labour Placed',
        'dashboard.metric.placement_ratio': 'Placement Ratio',
        'dashboard.metric.jobs_applied': 'Jobs Applied',
        'dashboard.metric.interview_scheduled': 'Interviews Scheduled',
        'dashboard.metric.active_job_seekers': 'Active Job Seekers',

        'dashboard.chart.gender': 'Gender-wise Registered Labour',
        'dashboard.chart.age': 'Age Group-wise Labour Distribution',
        'dashboard.chart.qualification': 'Highest Qualification of Registered Labour',
        'dashboard.chart.certification': 'Labour Certification Distribution',
        'dashboard.chart.placement': 'Registered Labour vs Labour Got Jobs',
        'dashboard.chart.skills': 'Top Skills Registered',

        'dashboard.label.percentage': 'Percentage (%)',
        'dashboard.label.registered_workers': 'Registered Workers',

        'chart.gender.male': 'Male',
        'chart.gender.female': 'Female',
        'chart.gender.other': 'Other',

        'chart.qual.below_10': 'Below 10th',
        'chart.qual.10th': '10th',
        'chart.qual.12th': '12th',
        'chart.qual.iti': 'ITI',
        'chart.qual.diploma': 'Diploma',
        'chart.qual.grad': 'Graduate',
        'chart.qual.post_grad': 'Post Grad',

        'chart.cert.iti': 'ITI Certified',
        'chart.cert.nsdc': 'NSDC Certified',
        'chart.cert.skill': 'Skill Dev',
        'chart.cert.apprentice': 'Apprenticeship',
        'chart.cert.safety': 'Safety Training',
        'chart.cert.none': 'Non-Certified',

        'chart.place.got_jobs': 'Got Jobs',
        'chart.place.not_placed': 'Not Yet Placed',

        'chart.skill.electrician': 'Electrician',
        'chart.skill.welder': 'Welder',
        'chart.skill.mason': 'Mason',
        'chart.skill.plumber': 'Plumber',
        'chart.skill.operator': 'Machine Operator'
    });

    I18n.init(lang);
    I18n.setupToggleButton();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Check if Chart is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded.');
        return;
    }

    // Common Colors Palette
    const colors = {
        primary: '#1d4ed8',     // Blue
        secondary: '#0369a1',   // Light Blue
        accent: '#ea580c',      // Orange
        success: '#15803d',     // Green
        warning: '#eab308',     // Yellow
        purple: '#7e22ce',      // Purple
        teal: '#0f766e',        // Teal
        gray: '#64748b',        // Gray
        lightGray: '#cbd5e1'
    };

    // Common Chart Options
    Chart.defaults.font.family = "'Inter', 'Noto Sans Devanagari', sans-serif";
    Chart.defaults.color = '#475569';
    
    const commonPieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    boxWidth: 8
                }
            }
        }
    };

    const commonBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Global references to Chart instances
    let genderChart, ageChart, qualificationChart, certificationChart, placementChart, skillsChart;

    function renderOrUpdateCharts(currentLang) {
        const isHi = (currentLang === 'hi');

        // 1. Gender-wise Registered Labour (%) - Pie Chart
        const ctxGender = document.getElementById('genderChart');
        if (ctxGender) {
            const genderLabels = [
                I18n.t('chart.gender.male'),
                I18n.t('chart.gender.female'),
                I18n.t('chart.gender.other')
            ];
            if (genderChart) {
                genderChart.data.labels = genderLabels;
                genderChart.update();
            } else {
                genderChart = new Chart(ctxGender, {
                    type: 'pie',
                    data: {
                        labels: genderLabels,
                        datasets: [{
                            data: [68, 31, 1],
                            backgroundColor: [colors.primary, colors.accent, colors.gray],
                            borderWidth: 1,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: commonPieOptions
                });
            }
        }

        // 2. Age Group-wise Labour Distribution (%) - Bar Chart
        const ctxAge = document.getElementById('ageChart');
        if (ctxAge) {
            const ageLabel = I18n.t('dashboard.label.percentage');
            if (ageChart) {
                ageChart.data.datasets[0].label = ageLabel;
                ageChart.update();
            } else {
                ageChart = new Chart(ctxAge, {
                    type: 'bar',
                    data: {
                        labels: ['18–25', '26–35', '36–45', '46–60'],
                        datasets: [{
                            label: ageLabel,
                            data: [35, 42, 15, 8],
                            backgroundColor: colors.secondary,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        ...commonBarOptions,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.parsed.y + '%';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // 3. Highest Qualification of Registered Labour (%) - Pie Chart
        const ctxQualification = document.getElementById('qualificationChart');
        if (ctxQualification) {
            const qualLabels = [
                I18n.t('chart.qual.below_10'),
                I18n.t('chart.qual.10th'),
                I18n.t('chart.qual.12th'),
                I18n.t('chart.qual.iti'),
                I18n.t('chart.qual.diploma'),
                I18n.t('chart.qual.grad'),
                I18n.t('chart.qual.post_grad')
            ];
            if (qualificationChart) {
                qualificationChart.data.labels = qualLabels;
                qualificationChart.update();
            } else {
                qualificationChart = new Chart(ctxQualification, {
                    type: 'pie',
                    data: {
                        labels: qualLabels,
                        datasets: [{
                            data: [4, 28, 32, 18, 4, 12, 2],
                            backgroundColor: [
                                colors.gray,
                                colors.primary, 
                                colors.secondary, 
                                colors.teal,
                                colors.warning,
                                colors.purple,
                                colors.accent
                            ],
                            borderWidth: 1,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: commonPieOptions
                });
            }
        }

        // 4. Labour Certification Distribution (%) - Pie Chart
        const ctxCertification = document.getElementById('certificationChart');
        if (ctxCertification) {
            const certLabels = [
                I18n.t('chart.cert.iti'), 
                I18n.t('chart.cert.nsdc'), 
                I18n.t('chart.cert.skill'), 
                I18n.t('chart.cert.apprentice'),
                I18n.t('chart.cert.safety'),
                I18n.t('chart.cert.none')
            ];
            if (certificationChart) {
                certificationChart.data.labels = certLabels;
                certificationChart.update();
            } else {
                certificationChart = new Chart(ctxCertification, {
                    type: 'pie',
                    data: {
                        labels: certLabels,
                        datasets: [{
                            data: [35, 22, 5, 5, 3, 30],
                            backgroundColor: [
                                colors.primary,
                                colors.purple,
                                colors.teal,
                                colors.warning,
                                colors.success,
                                colors.gray
                            ],
                            borderWidth: 1,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: commonPieOptions
                });
            }
        }

        // 5. Registered Labour vs Labour Got Jobs (%) - Donut Chart
        const ctxPlacement = document.getElementById('placementChart');
        if (ctxPlacement) {
            const placeLabels = [
                I18n.t('chart.place.got_jobs'),
                I18n.t('chart.place.not_placed')
            ];
            if (placementChart) {
                placementChart.data.labels = placeLabels;
                placementChart.update();
            } else {
                placementChart = new Chart(ctxPlacement, {
                    type: 'doughnut',
                    data: {
                        labels: placeLabels,
                        datasets: [{
                            data: [47, 53],
                            backgroundColor: [colors.success, colors.lightGray],
                            borderWidth: 1,
                            borderColor: '#ffffff',
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        ...commonPieOptions,
                        cutout: '70%'
                    }
                });
            }
        }

        // 6. Top Skills Registered - Bar Chart
        const ctxSkills = document.getElementById('skillsChart');
        if (ctxSkills) {
            const skillLabels = [
                I18n.t('chart.skill.electrician'),
                I18n.t('chart.skill.welder'),
                I18n.t('chart.skill.mason'),
                I18n.t('chart.skill.plumber'),
                I18n.t('chart.skill.operator')
            ];
            const skillDatasetLabel = I18n.t('dashboard.label.registered_workers');
            if (skillsChart) {
                skillsChart.data.labels = skillLabels;
                skillsChart.data.datasets[0].label = skillDatasetLabel;
                skillsChart.update();
            } else {
                skillsChart = new Chart(ctxSkills, {
                    type: 'bar',
                    data: {
                        labels: skillLabels,
                        datasets: [{
                            label: skillDatasetLabel,
                            data: [150000, 120000, 95000, 80000, 65000],
                            backgroundColor: [
                                colors.primary,
                                colors.secondary,
                                colors.teal,
                                colors.purple,
                                colors.accent
                            ],
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0,0,0,0.05)'
                                }
                            },
                            y: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    // Initial render
    renderOrUpdateCharts(lang);

    // Listen for language change
    document.addEventListener('i18n:languageChanged', (e) => {
        const currentLang = e.detail.language;
        I18n.translateDOM();
        renderOrUpdateCharts(currentLang);
    });

})();
