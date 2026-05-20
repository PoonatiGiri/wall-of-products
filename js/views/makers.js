import { makers } from '../data.js';
import { parseMRR, parseUsers, getInitials, isPaid, paidStar } from '../utils.js';

export function renderMakers(filteredProducts, container, allProducts, openDrawer) {
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-results" style="border:1.5px solid var(--ink); margin-top:1.5rem">No products match — try a different filter or search term.</div>';
    return;
  }

  // Group products by maker key
  const byMaker = {};
  filteredProducts.forEach(p => {
    if (!byMaker[p.maker]) byMaker[p.maker] = [];
    byMaker[p.maker].push(p);
  });

  // Sort maker groups by total MRR desc, then by product count desc
  const sortedKeys = Object.keys(byMaker).sort((a, b) => {
    const aMRR = byMaker[a].reduce((s, p) => s + parseMRR(p.mrr), 0);
    const bMRR = byMaker[b].reduce((s, p) => s + parseMRR(p.mrr), 0);
    if (bMRR !== aMRR) return bMRR - aMRR;
    return byMaker[b].length - byMaker[a].length;
  });

  const groups = sortedKeys.map(key => {
    const maker = makers[key];
    const prods = byMaker[key];
    const totalMRR = prods.reduce((s, p) => s + parseMRR(p.mrr), 0);
    const mrrStr = totalMRR > 0
      ? (totalMRR >= 1000 ? '$' + (totalMRR / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : '$' + Math.round(totalMRR))
      : '—';
    const totalUsers = prods.reduce((s, p) => s + parseUsers(p.users), 0);
    const usersStr = totalUsers >= 1000
      ? (totalUsers / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
      : (totalUsers > 0 ? Math.round(totalUsers) : '—');

    const cells = prods.map(p => {
      const idx = allProducts.indexOf(p);
      const isEmpty = !p.mrr || p.mrr === '—';
      return `
        <div class="mini-cell" data-idx="${idx}">
          <div class="mini-name">${p.name}${paidStar(p)}</div>
          <div class="mini-tagline">${p.tagline}</div>
          <div class="mini-footer">
            <span class="mini-cat">${p.category}</span>
            <span class="mini-mrr ${isEmpty ? 'is-empty' : ''}">${isEmpty ? '—' : p.mrr}</span>
          </div>
        </div>`;
    }).join('');

    return `
      <section class="maker-group">
        <header class="maker-group-header">
          <div class="mg-avatar" style="background:${maker.color}">${getInitials(maker.name)}</div>
          <div class="mg-info">
            <div class="mg-name">${maker.name}</div>
            <div class="mg-meta">${maker.handle} · ${maker.flag} ${maker.country}</div>
          </div>
          <div class="mg-stats">
            <div class="mg-stat"><div class="mg-stat-val">${prods.length}</div><div class="mg-stat-lbl">Products</div></div>
            <div class="mg-stat"><div class="mg-stat-val">${mrrStr}</div><div class="mg-stat-lbl">Total MRR</div></div>
            <div class="mg-stat"><div class="mg-stat-val">${usersStr}</div><div class="mg-stat-lbl">Users</div></div>
          </div>
        </header>
        <div class="maker-products">${cells}</div>
      </section>`;
  }).join('');

  container.innerHTML = `<div class="makers-view">${groups}</div>`;
  container.querySelectorAll('.mini-cell').forEach(c => {
    c.addEventListener('click', () => openDrawer(parseInt(c.dataset.idx, 10)));
  });
}
