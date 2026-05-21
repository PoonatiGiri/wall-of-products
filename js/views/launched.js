import { makers } from '../data.js';
import { LAUNCHES, isThisWeek, daysLabel } from '../launches.js';
import { loveBtn, attachLoveBtn } from '../loves.js';
import { dotClass } from '../utils.js';

export function renderLaunched(filteredProducts, container, allProducts, openDrawer) {
  const recent = filteredProducts
    .filter(p => isThisWeek(p.name))
    .sort((a, b) => new Date(LAUNCHES[b.name]) - new Date(LAUNCHES[a.name]));

  container.innerHTML = '';

  if (recent.length === 0) {
    container.innerHTML = `
      <div class="launched-empty">
        <div class="launched-empty-icon">🚀</div>
        <div class="launched-empty-title">No launches this week${filteredProducts.length < allProducts.length ? ' matching this filter' : ''}</div>
        <div class="launched-empty-sub">Check back soon — or be the first to submit yours.</div>
      </div>`;
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'launched-wrap';
  wrap.innerHTML = `<div class="launched-top-bar">${recent.length} product${recent.length !== 1 ? 's' : ''} launched this week</div>`;

  recent.forEach((p, i) => {
    const maker   = makers[p.maker];
    const idx     = allProducts.indexOf(p);
    const label   = daysLabel(p.name);

    const row = document.createElement('div');
    row.className = 'launched-row';
    row.dataset.idx = idx;
    row.innerHTML = `
      <div class="launched-row-left">
        <span class="launched-rank">${String(i + 1).padStart(2, '0')}</span>
        <span class="launched-date-badge">${label}</span>
      </div>
      <div class="launched-row-body">
        <div class="launched-row-name">${p.name}</div>
        <div class="launched-row-tagline">${p.tagline}</div>
        <div class="launched-row-meta">
          <span class="launched-maker">${maker.handle} ${maker.flag}</span>
          <span class="launched-sep">·</span>
          <span class="launched-cat">${p.category}</span>
          <span class="launched-sep">·</span>
          <span class="launched-status">
            <span class="status-dot ${dotClass[p.status] || 'dot-paused'}"></span>
            ${p.status}
          </span>
        </div>
      </div>
      <div class="launched-row-right">
        ${loveBtn(p.name)}
      </div>`;

    row.addEventListener('click', e => {
      if (e.target.closest('[data-love]')) return;
      openDrawer(idx);
    });
    attachLoveBtn(row);
    wrap.appendChild(row);
  });

  container.appendChild(wrap);
}
