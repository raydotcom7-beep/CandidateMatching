/* ============================================================
   DASHBOARD LAYOUT JS — layouts/dashboard-layout/dashboard-layout.js
   Handles sidebar toggling on mobile.
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('dashboard-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleBtn = document.getElementById('sidebar-toggle');

  if (!sidebar || !toggleBtn) return;

  function openSidebar() {
    sidebar.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden'; // prevent bg scrolling
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      if (sidebar.classList.contains('is-open')) closeSidebar();
      else openSidebar();
    } else {
      sidebar.classList.toggle('is-collapsed');
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Highlight active link
  const currentPath = window.location.pathname.split('/').pop() || 'servicehome.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPath)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ── Global Header Sync ───────────────────────────
  function syncHeader() {
    const isIndustry = window.location.pathname.includes('/industry-registration/');

    if (isIndustry) {
      let loggedName = localStorage.getItem('logged_in_company_name');
      let loggedId = localStorage.getItem('logged_in_company_id');

      // Fallback for demo
      if (!loggedName) {
        loggedName = "Dixon Technologies";
        loggedId = "comp_1";
        localStorage.setItem('logged_in_company_name', "Dixon Technologies");
        localStorage.setItem('logged_in_company_id', "comp_1");
      }

      const initials = loggedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      document.querySelectorAll('.user-profile .user-name').forEach(el => el.textContent = loggedName);
      document.querySelectorAll('.user-profile .user-avatar').forEach(el => el.textContent = initials);

      const cardName = document.querySelector('.profile-header-card__name');
      const cardAvatar = document.querySelector('.profile-header-card__avatar');
      if (cardName) cardName.textContent = loggedName;
      if (cardAvatar) cardAvatar.textContent = initials;
    } else {
      let loggedName = localStorage.getItem('logged_in_candidate_name');
      let loggedMobile = localStorage.getItem('logged_in_candidate_mobile');

      // Default fallback to Nisha Pandey if empty
      if (!loggedName) {
        loggedName = "Nisha Pandey";
        loggedMobile = "9755728822";
        localStorage.setItem('logged_in_candidate_name', "Nisha Pandey");
        localStorage.setItem('logged_in_candidate_mobile', "9755728822");
      }

      if (loggedName) {
        const initials = loggedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        document.querySelectorAll('.user-profile .user-name').forEach(el => el.textContent = loggedName);
        document.querySelectorAll('.user-profile .user-avatar').forEach(el => el.textContent = initials);

        const cardName = document.querySelector('.profile-header-card__name');
        const cardAvatar = document.querySelector('.profile-header-card__avatar');
        if (cardName) cardName.textContent = loggedName;
        if (cardAvatar) cardAvatar.textContent = initials;
      }

      fetch("http://localhost:8000/candidates")
        .then(res => res.json())
        .then(candidates => {
          const cand = candidates.find(c => c.candidate_id === loggedMobile || c.mobile === loggedMobile);
          if (cand) {
            const tradeBadge = document.getElementById('user-trade-badge') || document.querySelector('.profile-header-card__role');
            if (tradeBadge && cand.current_title) {
              tradeBadge.textContent = cand.current_title;
            }
          }
        })
        .catch(err => {
          if (loggedMobile === "9755728822") {
            const tradeBadge = document.getElementById('user-trade-badge') || document.querySelector('.profile-header-card__role');
            if (tradeBadge) tradeBadge.textContent = "Msc";
          }
        });
    }
  }
  syncHeader();
});
