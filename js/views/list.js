import { makers } from '../data.js';
import { parseMRR, isPaid, paidStar, dotClass } from '../utils.js';

export function renderList(filteredProducts, container, allProducts, openDrawer) {
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

  const rows = sorted.map((p, i) => {
    const idx = allProducts.indexOf(p);
    const maker = makers[p.maker];
    const sinceData = p.extra.find(e => e.label === 'Since');
    const since = sinceData ? sinceData.value : '—';
    const isEmpty = !p.mrr || p.mrr === '—';
    return `
      <tr class="list-row" data-idx="${idx}">
        <td class="list-rank">${String(i + 1).padStart(2, '0')}</td>
        <td class="list-product">
          <span class="list-name">${p.name}${paidStar(p)}</span>
          <span class="list-tagline">${p.tagline}</span>
        </td>
        <td class="list-maker">${maker.handle} ${maker.flag}</td>
        <td class="list-cat">${p.category}</td>
        <td><div class="list-status"><span class="status-dot ${dotClass[p.status] || 'dot-paused'}"></span>${p.status}</div></td>
        <td class="list-mrr ${isEmpty ? 'is-empty' : ''}">${isEmpty ? '—' : p.mrr}</td>
        <td class="list-users">${p.users}</td>
        <td class="list-since">${since}</td>
      </tr>`;
  }).join('');

  container.innerHTML = `
    <table class="list-view">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th class="list-maker-h">Maker</th>
          <th class="list-cat-h">Category</th>
          <th>Status</th>
          <th>MRR</th>
          <th class="list-users-h">Users</th>
          <th class="list-since-h">Since</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  container.querySelectorAll('.list-row').forEach(r => {
    r.addEventListener('click', () => openDrawer(parseInt(r.dataset.idx, 10)));
  });
}
