import { makers, palette } from '../data.js';
import { isPaid, shuffle, dotClass } from '../utils.js';
import { loveBtn, attachLoveBtn } from '../loves.js';

export function arrangeForGrid(filteredProducts) {
  return shuffle(filteredProducts);
}

/**
 * Render the grid view into the given container element.
 * allProducts is the full unfiltered array (needed for palette index lookup).
 */
export function renderGrid(filteredProducts, container, allProducts, openDrawer) {
  container.innerHTML = '';
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-results">No products match — try a different filter or search term.</div>';
    return;
  }

  const sorted = arrangeForGrid(filteredProducts);
  sorted.forEach(p => {
    const idx = allProducts.indexOf(p);
    const maker = makers[p.maker];
    const cell = document.createElement('article');
    const l = p.listing;
    const sizeCls = l.cells === 4 ? 'is-2x2' : l.cells === 2 ? 'is-2x1' : '';
    cell.className = ['cell', sizeCls, l.border ? 'has-border' : '', l.fill ? 'has-fill' : ''].filter(Boolean).join(' ');
    cell.style.setProperty('--hover-color', palette[idx % palette.length]);
    if (l.border && l.borderColor) cell.style.setProperty('--cell-border-color', l.borderColor);
    if (l.fill && l.fillColor) cell.style.setProperty('--cell-fill-color', l.fillColor);

    const star = isPaid(p) ? '<span class="cell-featured" title="Featured listing">★</span>' : '';

    if (l.cells === 4) {
      // Hero (2x2) template
      cell.innerHTML = `
        ${star}
        <div class="cell-hero-top">
          <span class="cell-hero-maker">${maker.handle} · ${maker.flag} ${maker.country}</span>
          <span class="cell-hero-cat">${p.category}</span>
        </div>
        <div class="cell-hero-name">${p.name}</div>
        <div class="cell-hero-tagline">${p.tagline}</div>
        <div class="cell-hero-desc">${p.desc}</div>
        <div class="cell-hero-stats">
          <div class="cell-hero-stat"><div class="hero-stat-val">${p.mrr || '—'}</div><div class="hero-stat-lbl">MRR</div></div>
          <div class="cell-hero-stat"><div class="hero-stat-val">${p.users || '—'}</div><div class="hero-stat-lbl">Users</div></div>
          <div class="cell-hero-stat"><div class="hero-stat-val">${p.growth || '—'}</div><div class="hero-stat-lbl">Growth</div></div>
        </div>
        <div class="cell-hero-foot">
          <span class="cell-hero-status s-${p.status}">${p.status}</span>
          ${loveBtn(p.name)}
          <span class="cell-hero-cta">Visit →</span>
        </div>`;
    } else if (l.cells === 2) {
      // Medium (2x1) banner template
      const statsHtml = (p.mrr && p.mrr !== '—') || (p.users && p.users !== '—')
        ? `<div class="cell-medium-stats">
             ${p.mrr && p.mrr !== '—' ? `<span><b>${p.mrr}</b>MRR</span>` : ''}
             ${p.users && p.users !== '—' ? `<span><b>${p.users}</b>users</span>` : ''}
           </div>`
        : '';
      cell.innerHTML = `
        ${star}
        <div class="cell-medium">
          <span class="cell-name">${p.name}</span>
          <span class="cell-tagline">${p.tagline}</span>
          <span class="cell-desc-line">${p.desc}</span>
          ${statsHtml}
        </div>
        <div class="cell-bottom cell-medium-bottom">
          <span class="cell-maker">${maker.handle} ${maker.flag}</span>
          ${loveBtn(p.name)}
          <div style="display:flex;align-items:center;gap:0.35rem">
            <span class="status-dot ${dotClass[p.status] || 'dot-paused'}"></span>
            <span class="cell-tag">${p.category}</span>
          </div>
        </div>`;
    } else {
      // Standard (1x1) template
      cell.innerHTML = `
        ${star}
        <div class="cell-top">
          <span class="cell-name">${p.name}</span>
          <span class="cell-tagline">${p.tagline}</span>
        </div>
        <div class="cell-bottom">
          <span class="cell-maker">${maker.handle} ${maker.flag}</span>
          ${loveBtn(p.name)}
          <div style="display:flex;align-items:center;gap:0.35rem">
            <span class="status-dot ${dotClass[p.status] || 'dot-paused'}"></span>
            <span class="cell-tag">${p.category}</span>
          </div>
        </div>`;
    }

    cell.addEventListener('click', e => {
      if (e.target.closest('[data-love]')) return;
      openDrawer(idx);
    });
    attachLoveBtn(cell);
    container.appendChild(cell);
  });
}
