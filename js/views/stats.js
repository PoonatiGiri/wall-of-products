import { products, makers } from '../data.js';
import { parseMRR, parseUsers } from '../utils.js';

const STATUS_COLOR = {
  active:   '#16a34a',
  building: '#2563eb',
  beta:     '#d97706',
  shipped:  '#7c3aed',
  paused:   '#9ca3af',
};

function bar(value, max, color = '#111') {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return `<div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

export function renderStats(container) {
  /* ── compute ─────────────────────────── */
  const totalMRR   = products.reduce((s, p) => s + parseMRR(p.mrr), 0);
  const totalUsers = products.reduce((s, p) => s + parseUsers(p.users), 0);

  // by country
  const byCountry = {};
  Object.values(makers).forEach(m => {
    if (!byCountry[m.country]) byCountry[m.country] = { flag: m.flag, makers: 0, products: 0, mrr: 0 };
    byCountry[m.country].makers++;
  });
  products.forEach(p => {
    const m = makers[p.maker];
    if (m && byCountry[m.country]) {
      byCountry[m.country].products++;
      byCountry[m.country].mrr += parseMRR(p.mrr);
    }
  });
  const countryList = Object.entries(byCountry)
    .sort((a, b) => b[1].products - a[1].products);
  const maxCountryProducts = countryList[0]?.[1].products || 1;

  // by category
  const byCat = {};
  products.forEach(p => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
  const catList = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const maxCat = catList[0]?.[1] || 1;

  // by status
  const byStatus = {};
  products.forEach(p => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

  // top 5 by MRR
  const topMRR = [...products]
    .filter(p => parseMRR(p.mrr) > 0)
    .sort((a, b) => parseMRR(b.mrr) - parseMRR(a.mrr))
    .slice(0, 8);

  // most prolific makers
  const makerProductCount = {};
  products.forEach(p => { makerProductCount[p.maker] = (makerProductCount[p.maker] || 0) + 1; });
  const topMakers = Object.entries(makerProductCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({ ...makers[id], id, count }));
  const maxMakerCount = topMakers[0]?.count || 1;

  // category MRR
  const catMRR = {};
  products.forEach(p => { catMRR[p.category] = (catMRR[p.category] || 0) + parseMRR(p.mrr); });
  const catMRRList = Object.entries(catMRR)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const maxCatMRR = catMRRList[0]?.[1] || 1;

  /* ── render ──────────────────────────── */
  container.innerHTML = `
<div class="stats-view">

  <!-- Summary strip -->
  <div class="stats-summary">
    <div class="stats-big-card">
      <div class="stats-big-val">${products.length}</div>
      <div class="stats-big-lbl">Products</div>
    </div>
    <div class="stats-big-card">
      <div class="stats-big-val">${Object.keys(makers).length}</div>
      <div class="stats-big-lbl">Makers</div>
    </div>
    <div class="stats-big-card">
      <div class="stats-big-val">${totalMRR >= 1000 ? '$' + (totalMRR / 1000).toFixed(1) + 'K' : '$' + totalMRR}</div>
      <div class="stats-big-lbl">Combined MRR</div>
    </div>
    <div class="stats-big-card">
      <div class="stats-big-val">${totalUsers >= 1000 ? (totalUsers / 1000).toFixed(1) + 'K' : totalUsers}</div>
      <div class="stats-big-lbl">Total Users</div>
    </div>
    <div class="stats-big-card">
      <div class="stats-big-val">${Object.keys(byCountry).length}</div>
      <div class="stats-big-lbl">Countries</div>
    </div>
  </div>

  <!-- Two-column -->
  <div class="stats-cols">

    <!-- Makers by country -->
    <div class="stats-panel">
      <div class="stats-panel-title">Makers by Country</div>
      <div class="stats-list">
        ${countryList.map(([country, d]) => `
          <div class="stats-list-row">
            <span class="stats-flag">${d.flag}</span>
            <span class="stats-label">${country}</span>
            <span class="stats-count">${d.products} products</span>
            ${bar(d.products, maxCountryProducts)}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Products by category -->
    <div class="stats-panel">
      <div class="stats-panel-title">Products by Category</div>
      <div class="stats-list">
        ${catList.map(([cat, count]) => `
          <div class="stats-list-row">
            <span class="stats-label stats-label-wide">${cat}</span>
            <span class="stats-count">${count}</span>
            ${bar(count, maxCat)}
          </div>
        `).join('')}
      </div>
    </div>

  </div>

  <!-- Two-column row 2 -->
  <div class="stats-cols">

    <!-- Status breakdown -->
    <div class="stats-panel">
      <div class="stats-panel-title">Status Breakdown</div>
      <div class="stats-status-grid">
        ${Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => `
          <div class="stats-status-card">
            <div class="stats-status-dot" style="background:${STATUS_COLOR[status] || '#ccc'}"></div>
            <div class="stats-status-count">${count}</div>
            <div class="stats-status-lbl">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
          </div>
        `).join('')}
      </div>

      <div class="stats-panel-title" style="margin-top:1.5rem">MRR by Domain</div>
      <div class="stats-list">
        ${catMRRList.map(([cat, mrr]) => `
          <div class="stats-list-row">
            <span class="stats-label stats-label-wide">${cat}</span>
            <span class="stats-count">$${mrr >= 1000 ? (mrr/1000).toFixed(1)+'K' : mrr}</span>
            ${bar(mrr, maxCatMRR, '#c08703')}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Top by MRR -->
    <div class="stats-panel">
      <div class="stats-panel-title">Top Earners by MRR</div>
      <div class="stats-leaderboard">
        ${topMRR.map((p, i) => {
          const m = makers[p.maker];
          return `
          <div class="stats-lb-row">
            <span class="stats-lb-rank">${i + 1}</span>
            <div class="stats-lb-info">
              <div class="stats-lb-name">${p.name}</div>
              <div class="stats-lb-maker">${m.handle} ${m.flag}</div>
            </div>
            <div class="stats-lb-mrr">${p.mrr}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

  </div>

  <!-- Most prolific makers -->
  <div class="stats-panel stats-panel-full">
    <div class="stats-panel-title">Most Prolific Makers</div>
    <div class="stats-makers-grid">
      ${topMakers.map(m => `
        <div class="stats-maker-card">
          <div class="stats-maker-avatar" style="background:${m.color}">${m.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
          <div class="stats-maker-info">
            <div class="stats-maker-name">${m.name}</div>
            <div class="stats-maker-handle">${m.handle} · ${m.flag} ${m.country}</div>
            ${bar(m.count, maxMakerCount, m.color)}
          </div>
          <div class="stats-maker-count">${m.count}<span>products</span></div>
        </div>
      `).join('')}
    </div>
  </div>

</div>`;
}
