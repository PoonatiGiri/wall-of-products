import { makers } from '../data.js';
import { parseMRR, isPaid, paidStar, dotClass } from '../utils.js';

export function renderLeaderboard(filteredProducts, container, allProducts, openDrawer) {
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-results" style="border:1.5px solid var(--ink); margin-top:1.5rem">No products match — try a different filter or search term.</div>';
    return;
  }

  const sorted = [...filteredProducts].sort((a, b) => {
    const d = parseMRR(b.mrr) - parseMRR(a.mrr);
    if (d !== 0) return d;
    if (isPaid(a) && !isPaid(b)) return -1;
    if (!isPaid(a) && isPaid(b)) return 1;
    return 0;
  });

  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  // Visual order: 2nd, 1st, 3rd
  let podiumVisual = podium;
  if (podium.length === 3) podiumVisual = [podium[1], podium[0], podium[2]];
  else if (podium.length === 2) podiumVisual = [podium[1], podium[0]];

  const podiumHTML = podium.length > 0 ? `
    <div class="lb-intro">Top performers · ranked by self-reported MRR</div>
    <div class="podium">
      ${podiumVisual.map(p => {
        const idx = allProducts.indexOf(p);
        const maker = makers[p.maker];
        const trueRank = podium.indexOf(p) + 1;
        const isEmpty = !p.mrr || p.mrr === '—';
        return `
          <div class="podium-item rank-${trueRank}" data-idx="${idx}">
            <div class="podium-rank">${String(trueRank).padStart(2, '0')}</div>
            <div class="podium-name">${p.name}${paidStar(p)}</div>
            <div class="podium-tagline">${p.tagline}</div>
            <div class="podium-mrr ${isEmpty ? 'is-empty' : ''}">${isEmpty ? '—' : p.mrr}</div>
            <div class="podium-mrr-label">Monthly Revenue</div>
            <div class="podium-maker">${maker.handle} · ${maker.flag} ${maker.country}</div>
          </div>`;
      }).join('')}
    </div>` : '';

  const restHTML = rest.length > 0 ? `
    <div class="leaderboard-list">
      ${rest.map((p, i) => {
        const idx = allProducts.indexOf(p);
        const maker = makers[p.maker];
        const isEmpty = !p.mrr || p.mrr === '—';
        return `
          <div class="lb-row" data-idx="${idx}">
            <div class="lb-rank">${String(i + 4).padStart(2, '0')}</div>
            <div class="lb-product">
              <span class="lb-name">${p.name}${paidStar(p)}</span>
              <span class="lb-tagline">${p.tagline}</span>
            </div>
            <div class="lb-maker">${maker.handle} ${maker.flag}</div>
            <div class="lb-mrr-val ${isEmpty ? 'is-empty' : ''}">${isEmpty ? '—' : p.mrr}</div>
            <div class="status-dot lb-status-dot ${dotClass[p.status] || 'dot-paused'}"></div>
          </div>`;
      }).join('')}
    </div>` : '';

  container.innerHTML = podiumHTML + restHTML;
  container.querySelectorAll('[data-idx]').forEach(el => {
    el.addEventListener('click', () => openDrawer(parseInt(el.dataset.idx, 10)));
  });
}
