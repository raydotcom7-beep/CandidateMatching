'use strict';
/* ============================================================
   JOBS JS — components/jobs/jobs.js
   Filter panel toggle, search, filter, pagination, load more
   ============================================================ */

// ── Dummy Job Data ──────────────────────────────────────────────
const JOBS_DATA = [
  {
    id: 1,
    title: 'Mason / राजमिस्त्री',
    employer: 'MP Construction Pvt. Ltd.',
    location: 'Bhopal, MP',
    district: 'bhopal',
    salary: '₹12,000 – ₹18,000/month',
    experience: '1–3 Years',
    expKey: '1-3',
    qualification: 'ITI',
    qualKey: 'iti',
    openings: 15,
    type: 'fulltime',
    typeLabel: 'Full Time',
    posted: '2 days ago',
    matchScore: 92,
    recommended: true,
    skills: ['masonry', 'construction', 'bricklaying']
  },
  {
    id: 2,
    title: 'Electrician / विद्युत मिस्त्री',
    employer: 'Power Grid Corp.',
    location: 'Indore, MP',
    district: 'indore',
    salary: '₹15,000 – ₹22,000/month',
    experience: '3–5 Years',
    expKey: '3-5',
    qualification: 'ITI / Diploma',
    qualKey: 'iti',
    openings: 8,
    type: 'fulltime',
    typeLabel: 'Full Time',
    posted: '1 day ago',
    matchScore: 87,
    recommended: true,
    skills: ['electrical', 'wiring', 'panels']
  },
  {
    id: 3,
    title: 'Plumber / प्लम्बर',
    employer: 'Smart City Works',
    location: 'Jabalpur, MP',
    district: 'jabalpur',
    salary: '₹10,000 – ₹15,000/month',
    experience: 'Fresher',
    expKey: '0-1',
    qualification: '10th / ITI',
    qualKey: '10th',
    openings: 20,
    type: 'contractual',
    typeLabel: 'Contractual',
    posted: '3 days ago',
    matchScore: 78,
    recommended: true,
    skills: ['plumbing', 'pipefitting']
  },
  {
    id: 4,
    title: 'Carpenter / बढ़ई',
    employer: 'Furniture Mart India',
    location: 'Gwalior, MP',
    district: 'gwalior',
    salary: '₹11,000 – ₹16,000/month',
    experience: '1–3 Years',
    expKey: '1-3',
    qualification: '10th / 12th',
    qualKey: '12th',
    openings: 12,
    type: 'fulltime',
    typeLabel: 'Full Time',
    posted: '5 days ago',
    matchScore: 80,
    recommended: false,
    skills: ['carpentry', 'woodwork', 'furniture']
  },
  {
    id: 5,
    title: 'Welder / वेल्डर',
    employer: 'Steel Fab Industries',
    location: 'Rewa, MP',
    district: 'rewa',
    salary: '₹13,000 – ₹19,000/month',
    experience: '0–1 Year',
    expKey: '0-1',
    qualification: 'ITI',
    qualKey: 'iti',
    openings: 6,
    type: 'parttime',
    typeLabel: 'Part Time',
    posted: '1 week ago',
    matchScore: 72,
    recommended: false,
    skills: ['welding', 'fabrication', 'metalwork']
  },
  {
    id: 6,
    title: 'Painter / पेंटर',
    employer: 'Urban Décor Pvt. Ltd.',
    location: 'Bhopal, MP',
    district: 'bhopal',
    salary: '₹9,000 – ₹14,000/month',
    experience: 'Fresher',
    expKey: '0-1',
    qualification: '10th',
    qualKey: '10th',
    openings: 25,
    type: 'contractual',
    typeLabel: 'Contractual',
    posted: '4 days ago',
    matchScore: 68,
    recommended: false,
    skills: ['painting', 'finishing']
  },
  {
    id: 7,
    title: 'Helper / सहायक',
    employer: 'Narmada Construction Co.',
    location: 'Ujjain, MP',
    district: 'ujjain',
    salary: '₹8,000 – ₹11,000/month',
    experience: 'Fresher',
    expKey: '0-1',
    qualification: '10th',
    qualKey: '10th',
    openings: 50,
    type: 'fulltime',
    typeLabel: 'Full Time',
    posted: '6 days ago',
    matchScore: 65,
    recommended: false,
    skills: ['general labour', 'helper']
  },
  {
    id: 8,
    title: 'AC Technician / AC तकनीशियन',
    employer: 'CoolTech Services',
    location: 'Indore, MP',
    district: 'indore',
    salary: '₹16,000 – ₹24,000/month',
    experience: '3–5 Years',
    expKey: '3-5',
    qualification: 'Diploma',
    qualKey: 'diploma',
    openings: 4,
    type: 'fulltime',
    typeLabel: 'Full Time',
    posted: '2 days ago',
    matchScore: 85,
    recommended: true,
    skills: ['ac', 'hvac', 'refrigeration']
  }
];

// ── Render a single job card ─────────────────────────────────────
function renderJobCard(job, showRecommendedBadge = false) {
  const showSaveButton = !showRecommendedBadge;
  const typeClass = {
    fulltime: 'job-card__type-badge--fulltime',
    parttime: 'job-card__type-badge--parttime',
    contractual: 'job-card__type-badge--contractual'
  }[job.type] || '';

  const matchBar = showRecommendedBadge
    ? `<div class="match-score">
        <div class="match-score__bar"><div class="match-score__fill" style="width:${job.matchScore}%"></div></div>
        <span>${job.matchScore}<span data-i18n="jobs.match">% Match</span></span>
      </div>` : '';

  const recommendedBadge = (showRecommendedBadge && job.recommended)
    ? `<span class="job-card__recommended" data-i18n="jobs.recommended">⭐ AI Recommended</span>` : '';

  return `
    <div class="job-card" data-id="${job.id}" data-district="${job.district}"
         data-exp="${job.expKey}" data-qual="${job.qualKey}" data-type="${job.type}">
      <div class="job-card__header">
        <div class="job-card__title-wrap">
          <h3 class="job-card__title">${job.title}</h3>
          <div class="job-card__employer">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            ${job.employer}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-2); flex-shrink: 0;">
          ${recommendedBadge}
          <span class="job-card__type-badge ${typeClass}" data-i18n="job_type.${job.type}">${job.typeLabel}</span>
        </div>
      </div>

      <div class="job-card__meta">
        <div class="job-meta-item">
          <div class="job-meta-item__icon job-meta-item__icon--salary">💰</div>
          <div class="job-meta-item__text">
            <span class="job-meta-item__label" data-i18n="jobs.label.salary">Salary</span>
            <span class="job-meta-item__value">${job.salary}</span>
          </div>
        </div>
        <div class="job-meta-item">
          <div class="job-meta-item__icon job-meta-item__icon--location">📍</div>
          <div class="job-meta-item__text">
            <span class="job-meta-item__label" data-i18n="jobs.label.location">Location</span>
            <span class="job-meta-item__value">${job.location}</span>
          </div>
        </div>
        <div class="job-meta-item">
          <div class="job-meta-item__icon job-meta-item__icon--exp">⏱️</div>
          <div class="job-meta-item__text">
            <span class="job-meta-item__label" data-i18n="jobs.label.experience">Experience</span>
            <span class="job-meta-item__value">${job.experience}</span>
          </div>
        </div>
        <div class="job-meta-item">
          <div class="job-meta-item__icon job-meta-item__icon--qual">🎓</div>
          <div class="job-meta-item__text">
            <span class="job-meta-item__label" data-i18n="jobs.label.qualification">Qualification</span>
            <span class="job-meta-item__value">${job.qualification}</span>
          </div>
        </div>
        <div class="job-meta-item">
          <div class="job-meta-item__icon job-meta-item__icon--openings">👥</div>
          <div class="job-meta-item__text">
            <span class="job-meta-item__label" data-i18n="jobs.label.openings">Openings</span>
            <span class="job-meta-item__value">${job.openings} <span data-i18n="jobs.label.posts">Posts</span></span>
          </div>
        </div>
      </div>

      <div class="job-card__footer">
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <span class="job-card__posted">Posted ${job.posted}</span>
          ${matchBar}
        </div>
        <div class="job-card__actions">
          ${showSaveButton ? `
          <button class="btn btn--ghost btn--sm" title="Save Job" onclick="event.stopPropagation()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span data-i18n="jobs.save">Save</span>
          </button>` : ''}
          <button class="btn btn--primary btn--sm" onclick="applyJob(${job.id}, event)" data-i18n="jobs.apply_now">
            Apply Now →
          </button>
        </div>
      </div>
    </div>`;
}

// ── Apply handler ──────────────────────────────────────────────
function applyJob(id, e) {
  if (e) e.stopPropagation();
  if (window.Toast) Toast.success('आवेदन सफलतापूर्वक सबमिट किया गया! / Application submitted successfully!');
  else alert('Application submitted!');
}

// ── Jobs Page Controller ───────────────────────────────────────
class JobsPage {
  constructor(opts = {}) {
    this.listEl     = document.getElementById(opts.listId || 'job-list');
    this.emptyEl    = document.getElementById(opts.emptyId || 'empty-state');
    this.countEl    = document.getElementById(opts.countId || 'result-count');
    this.sortEl     = document.getElementById('sort-select');
    this.filterToggleBtn = document.getElementById('filter-toggle-btn');
    this.filterPanel     = document.getElementById('filter-panel');
    this.filterResetBtn  = document.getElementById('filter-reset-btn');
    this.loadMoreBtn     = document.getElementById('load-more-btn');
    this.searchBtn       = document.getElementById('search-btn');
    this.isRecommended   = opts.recommended || false;

    this.PAGE_SIZE  = 5;
    this.page       = 1;
    this.filtered   = [];
    this.allJobs    = [];

    this._init();
  }

  async _init() {
    // Mobile filter toggle
    if (this.filterToggleBtn && this.filterPanel) {
      this.filterToggleBtn.addEventListener('click', () => {
        this.filterPanel.classList.toggle('is-open');
        const open = this.filterPanel.classList.contains('is-open');
        const labelEl = this.filterToggleBtn.querySelector('.toggle-label');
        if (open) {
          labelEl.setAttribute('data-i18n', 'filter.hide');
          labelEl.textContent = window.I18n ? window.I18n.t('filter.hide') : 'Hide Filters';
        } else {
          labelEl.setAttribute('data-i18n', 'filter.show');
          labelEl.textContent = window.I18n ? window.I18n.t('filter.show') : 'Show Filters';
        }
      });
    }

    // Filter change handlers
    document.querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('change', () => this._applyFilters());
    });

    // Reset filters
    if (this.filterResetBtn) {
      this.filterResetBtn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(el => {
          if (el.tagName === 'SELECT') el.value = '';
          else el.checked = false;
        });
        this._applyFilters();
      });
    }

    // Sort
    if (this.sortEl) {
      this.sortEl.addEventListener('change', () => this._applyFilters());
    }

    // Search button (search.html)
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this._applyFilters());
      document.querySelectorAll('[data-search]').forEach(el => {
        el.addEventListener('keydown', e => { if (e.key === 'Enter') this._applyFilters(); });
      });
    }

    // Load more
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener('click', () => {
        this.page++;
        this._render(false);
      });
    }

    // Initial render / API fetch
    if (this.isRecommended) {
      // Show loading state in container
      if (this.listEl) this.listEl.innerHTML = `<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">Calculating AI Recommendations...</div>`;
      try {
        const loggedMobile = (window._ckStorage || localStorage).getItem('logged_in_candidate_mobile') || "9755728822";
        const response = await fetch("http://localhost:8000/recommendations/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: loggedMobile })
        });
        const resData = await response.json();
        if (resData.status === "success") {
          this.allJobs = resData.recommendations;
        } else {
          this.allJobs = JOBS_DATA.filter(j => j.recommended);
        }
      } catch (err) {
        console.warn("API server not running, falling back to local mock data.", err);
        this.allJobs = JOBS_DATA.filter(j => j.recommended);
      }
      this.filtered = [...this.allJobs];
    } else {
      try {
        const response = await fetch("http://localhost:8000/jobs");
        const jobs = await response.json();
        this.allJobs = jobs.length ? jobs : JOBS_DATA;
      } catch (err) {
        this.allJobs = JOBS_DATA;
      }
      this.filtered = [...this.allJobs];
    }
    this._render(true);
  }

  _applyFilters() {
    this.page = 1;

    const district    = document.getElementById('filter-district')?.value || '';
    const city        = document.getElementById('filter-city')?.value || '';
    const expRange    = document.getElementById('filter-exp-range')?.value || '';
    const fresher     = document.getElementById('filter-fresher')?.checked;
    const quals       = [...document.querySelectorAll('[data-filter="qual"]:checked')].map(el => el.value);
    const types       = [...document.querySelectorAll('[data-filter="type"]:checked')].map(el => el.value);
    const sort        = this.sortEl?.value || 'match';

    // Search fields
    const titleQ      = (document.getElementById('search-title')?.value || '').toLowerCase().trim();
    const skillQ      = document.getElementById('search-skill')?.value || '';
    const locationQ   = document.getElementById('search-location')?.value || '';

    let data = [...this.allJobs];

    if (titleQ)     data = data.filter(j => j.title.toLowerCase().includes(titleQ) || j.employer.toLowerCase().includes(titleQ));
    if (skillQ)     data = data.filter(j => j.skills.some(s => s.includes(skillQ.toLowerCase())));
    if (locationQ)  data = data.filter(j => j.district === locationQ);
    if (district)   data = data.filter(j => j.district === district);
    if (fresher)    data = data.filter(j => j.expKey === '0-1');
    if (expRange)   data = data.filter(j => j.expKey === expRange);
    if (quals.length)  data = data.filter(j => quals.includes(j.qualKey));
    if (types.length)  data = data.filter(j => types.includes(j.type));

    // Sort
    if (sort === 'match')  data.sort((a, b) => b.matchScore - a.matchScore);
    if (sort === 'salary') data.sort((a, b) => b.openings - a.openings);
    if (sort === 'recent') data.sort((a, b) => a.id - b.id);

    this.filtered = data;
    this._render(true);
  }

  _render(reset = true) {
    if (reset) this.listEl.innerHTML = '';

    const start  = 0;
    const end    = this.page * this.PAGE_SIZE;
    const slice  = this.filtered.slice(start, end);
    const total  = this.filtered.length;

    // Count
    if (this.countEl) this.countEl.textContent = total;

    // Empty state
    if (this.emptyEl) {
      if (total === 0) {
        this.emptyEl.classList.add('is-visible');
        this.listEl.innerHTML = '';
        if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
        return;
      } else {
        this.emptyEl.classList.remove('is-visible');
      }
    }

    // Render cards
    const html = slice.map(j => renderJobCard(j, this.isRecommended)).join('');
    if (reset) this.listEl.innerHTML = html;
    else       this.listEl.insertAdjacentHTML('beforeend', html.slice(slice.length - this.PAGE_SIZE < 0 ? 0 : (slice.length - this.PAGE_SIZE)));

    // Actually just always reset since we slice from 0 to end
    this.listEl.innerHTML = slice.map(j => renderJobCard(j, this.isRecommended)).join('');
    
    if (window.I18n) window.I18n.translateDOM(this.listEl);

    // Load more
    if (this.loadMoreBtn) {
      if (end >= total) {
        this.loadMoreBtn.style.display = 'none';
      } else {
        this.loadMoreBtn.style.display = 'flex';
      }
    }
  }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  const isRecommended = document.body.dataset.page === 'recommended';
  const isSearch      = document.body.dataset.page === 'search';

  if (isRecommended || isSearch) {
    window._jobsPage = new JobsPage({ recommended: isRecommended });
  }
});
