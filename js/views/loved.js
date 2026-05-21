import { makers } from '../data.js';
import { getLoveCount, loveBtn, attachLoveBtn } from '../loves.js';
import { dotClass, isPaid, paidStar } from '../utils.js';

export function renderLoved(filteredProducts, container, allProducts, openDrawer) {
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-results" style="border:1.5px solid var(--ink);margin-top:1.5rem">No products match — try a different filter or search term.</div>';
    return;
  }

  const sorted = [...filteredProducts].sort((a, b) => getLoveCount(b.name) - getLoveCount(a.name));
  const podium = sorted.slice(0, 3);
  const rest   = sorted.slice(3);

  // Visual podium order: 2nd, 1st, 3rd
  let podiumVisual = podium;
  if (podium.length === 3) podiumVisual = [podium[1], podium[0], podium[2]];
  else if (podium.length === 2) podiumVisual = [podium[1], podium[0]];

  const podiumHTML = podium.length > 0 ? `
    <div class="lb-intro">Community favourites · ranked by ♥ loves</div>
    <div class="loved-podium">
      ${podiumVisual.map(p => {
        const idx      = allProducts.indexOf(p);
        const maker    = makers[p.maker];
        const rank     = podium.indexOf(p) + 1;
        const count    = getLoveCount(p.name);
        return `
          <div class="loved-podium-item rank-${rank}" data-idx="${idx}">
            <div class="loved-podium-rank">${String(rank).padStart(2, '0')}</div>
            <div class="loved-podium-count">♥ ${count}</div>
            <div class="loved-podium-name">${p.name}${paidStar(p)}</div>
            <div class="loved-podium-tagline">${p.tagline}</div>
            <div class="loved-podium-maker">${maker.handle} · ${maker.flag} ${maker.country}</div>
            ${loveBtn(p.name, 'loved-podium-btn')}
          </div>`;
      }).join('')}
    </div>` : '';

  const restHTML = rest.length > 0 ? `
    <div class="leaderboard-list">
      ${rest.map((p, i) => {
        const idx   = allProducts.indexOf(p);
        const maker = makers[p.maker];
        const count = getLoveCount(p.name);
        return `
          <div class="lb-row loved-row" data-idx="${idx}">
            <div class="lb-rank">${String(i + 4).padStart(2, '0')}</div>
            <div class="lb-product">
              <span class="lb-name">${p.name}${paidStar(p)}</span>
              <span class="lb-tagline">${p.tagline}</span>
            </div>
            <div class="lb-maker">${maker.handle} ${maker.flag}</div>
            <div class="loved-row-count">♥ ${count}</div>
            ${loveBtn(p.name)}
            <div class="status-dot lb-status-dot ${dotClass[p.status] || 'dot-paused'}"></div>
          </div>`;
      }).join('')}
    </div>` : '';

  container.innerHTML = podiumHTML + restHTML;

  container.querySelectorAll('[data-idx]').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('[data-love]')) return;
      openDrawer(parseInt(el.dataset.idx, 10));
    });
  });
  attachLoveBtn(container, (name) => {
    // Re-sort the rest list counts in place (podium counts update via DOM)
    container.querySelectorAll('.loved-row-count').forEach(el => {
      const row  = el.closest('[data-idx]');
      const idx  = parseInt(row.dataset.idx, 10);
      const prod = allProducts[idx];
      if (prod) el.textContent = '♥ ' + getLoveCount(prod.name);
    });
  });
}
