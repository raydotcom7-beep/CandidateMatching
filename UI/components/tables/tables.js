/* ============================================================
   TABLES.JS — Client-side DataTable
   File: components/tables/tables.js

   Usage:
     import DataTable from '../../components/tables/tables.js';
     const table = new DataTable('#applicants-table', {
       data: [...],
       columns: [
         { key: 'name',   label: 'नाम',        sortable: true },
         { key: 'mobile', label: 'मोबाइल',      sortable: false },
         { key: 'status', label: 'स्थिति',       render: (v) => `<span class="badge">${v}</span>` },
       ],
       pageSize: 10,
       searchable: true,
     });
   ============================================================ */
'use strict';

class DataTable {
  constructor(containerSelector, options = {}) {
    this._container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!this._container) {
      console.warn(`[DataTable] Container not found: ${containerSelector}`);
      return;
    }

    const {
      data       = [],
      columns    = [],
      pageSize   = 10,
      searchable = true,
      title      = '',
      emptyText  = 'कोई डेटा उपलब्ध नहीं है।',
    } = options;

    this._data      = [...data];
    this._filtered  = [...data];
    this._columns   = columns;
    this._pageSize  = pageSize;
    this._page      = 1;
    this._sortKey   = null;
    this._sortDir   = 'asc';
    this._searchQ   = '';
    this._emptyText = emptyText;
    this._title     = title;
    this._searchable = searchable;

    this._render();
  }

  /* ── Render Shell ─────────────────────────────────────────── */
  _render() {
    this._container.innerHTML = `
      <div class="table-wrapper">
        <div class="table-toolbar">
          <span class="table-toolbar__title">${this._title}</span>
          ${this._searchable ? `
          <div class="table-toolbar__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="search" id="${this._container.id}-search" placeholder="खोजें..." aria-label="तालिका खोजें" />
          </div>` : ''}
        </div>
        <table class="data-table" aria-live="polite">
          <thead><tr id="${this._container.id}-head"></tr></thead>
          <tbody id="${this._container.id}-body"></tbody>
        </table>
        <div class="table-footer">
          <span class="table-footer__info" id="${this._container.id}-info"></span>
          <div class="pagination" id="${this._container.id}-pagination"></div>
        </div>
      </div>`;

    this._headEl   = this._container.querySelector(`#${this._container.id}-head`);
    this._bodyEl   = this._container.querySelector(`#${this._container.id}-body`);
    this._infoEl   = this._container.querySelector(`#${this._container.id}-info`);
    this._paginEl  = this._container.querySelector(`#${this._container.id}-pagination`);
    this._searchEl = this._container.querySelector(`#${this._container.id}-search`);

    this._renderHead();
    this._update();

    if (this._searchEl) {
      this._searchEl.addEventListener('input', (e) => {
        this._searchQ = e.target.value.trim().toLowerCase();
        this._page = 1;
        this._update();
      });
    }
  }

  /* ── Render Head ──────────────────────────────────────────── */
  _renderHead() {
    this._headEl.innerHTML = this._columns.map(col => `
      <th ${col.sortable ? `data-sortable data-key="${col.key}"` : ''} class="${this._sortKey === col.key ? `sort-${this._sortDir}` : ''}">
        ${col.label}${col.sortable ? '<i class="sort-icon" aria-hidden="true"></i>' : ''}
      </th>
    `).join('');

    this._headEl.querySelectorAll('[data-sortable]').forEach(th => {
      th.addEventListener('click', () => {
        const key = th.dataset.key;
        if (this._sortKey === key) {
          this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this._sortKey = key; this._sortDir = 'asc';
        }
        this._update();
        this._renderHead();
      });
    });
  }

  /* ── Filter + Sort + Page ─────────────────────────────────── */
  _update() {
    // Filter
    this._filtered = this._data.filter(row =>
      !this._searchQ || this._columns.some(col => {
        const val = String(row[col.key] ?? '').toLowerCase();
        return val.includes(this._searchQ);
      })
    );

    // Sort
    if (this._sortKey) {
      this._filtered.sort((a, b) => {
        const aVal = a[this._sortKey] ?? '';
        const bVal = b[this._sortKey] ?? '';
        const cmp  = String(aVal).localeCompare(String(bVal), 'hi', { numeric: true });
        return this._sortDir === 'asc' ? cmp : -cmp;
      });
    }

    this._renderBody();
    this._renderFooter();
  }

  /* ── Render Body ──────────────────────────────────────────── */
  _renderBody() {
    const start = (this._page - 1) * this._pageSize;
    const rows  = this._filtered.slice(start, start + this._pageSize);

    if (rows.length === 0) {
      this._bodyEl.innerHTML = `
        <tr><td colspan="${this._columns.length}">
          <div class="table-empty">
            <span class="table-empty__icon" aria-hidden="true">📭</span>
            <p class="table-empty__title">${this._emptyText}</p>
          </div>
        </td></tr>`;
      return;
    }

    this._bodyEl.innerHTML = rows.map((row, ri) => `
      <tr data-row-index="${start + ri}">
        ${this._columns.map(col => {
          const val = row[col.key] ?? '';
          const cell = col.render ? col.render(val, row, start + ri) : val;
          return `<td class="${col.className || ''}">${cell}</td>`;
        }).join('')}
      </tr>`).join('');

    // Row click events
    this._bodyEl.querySelectorAll('tr[data-row-index]').forEach(tr => {
      tr.addEventListener('click', () => {
        const idx = Number(tr.dataset.rowIndex);
        this._container.dispatchEvent(new CustomEvent('table:rowclick', {
          bubbles: true,
          detail: { row: this._filtered[idx], index: idx },
        }));
      });
    });
  }

  /* ── Render Footer ────────────────────────────────────────── */
  _renderFooter() {
    const total      = this._filtered.length;
    const totalPages = Math.ceil(total / this._pageSize) || 1;
    const start      = (this._page - 1) * this._pageSize + 1;
    const end        = Math.min(this._page * this._pageSize, total);

    this._infoEl.textContent = total > 0
      ? `${start}–${end} / ${total} परिणाम` : '0 परिणाम';

    const pages = [];
    pages.push({ label: '«', page: 1, disabled: this._page === 1 });
    pages.push({ label: '‹', page: this._page - 1, disabled: this._page === 1 });

    const range = this._pageRange(this._page, totalPages);
    range.forEach(p => {
      if (p === '…') pages.push({ label: '…', ellipsis: true });
      else pages.push({ label: p, page: p, active: p === this._page });
    });

    pages.push({ label: '›', page: this._page + 1, disabled: this._page === totalPages });
    pages.push({ label: '»', page: totalPages,      disabled: this._page === totalPages });

    this._paginEl.innerHTML = pages.map(p => {
      if (p.ellipsis) return `<span class="pagination__ellipsis">…</span>`;
      return `<button class="pagination__btn ${p.active ? 'pagination__btn--active' : ''}"
                ${p.disabled ? 'disabled' : ''} data-page="${p.page}">${p.label}</button>`;
    }).join('');

    this._paginEl.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._page = Number(btn.dataset.page);
        this._update();
      });
    });
  }

  _pageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
    return [1, '…', current-1, current, current+1, '…', total];
  }

  /* ── Public API ───────────────────────────────────────────── */
  setData(data) { this._data = [...data]; this._page = 1; this._update(); }
  appendData(rows) { this._data.push(...rows); this._update(); }
  refresh() { this._update(); }
}

export default DataTable;
