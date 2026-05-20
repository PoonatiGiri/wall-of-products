import { makers, launchOrderByName } from '../data.js';
import { daysAgoFor, formatRelative, getInitials, isPaid, paidStar } from '../utils.js';

export function renderFeed(filteredProducts, container, allProducts, openDrawer) {
  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="no-results" style="border:1.5px solid var(--ink); margin-top:1.5rem">No products match — try a different filter or search term.</div>';
    return;
  }

  const sorted = [...filteredProducts].sort((a, b) =>
    daysAgoFor(a.name, launchOrderByName) - daysAgoFor(b.name, launchOrderByName)
  );

  const cards = sorted.map(p => {
    const idx = allProducts.indexOf(p);
    const maker = makers[p.maker];
    return `
      <article class="feed-card" data-idx="${idx}">
        <div class="feed-header">
          <span class="feed-date">${formatRelative(daysAgoFor(p.name, launchOrderByName))}</span>
          <span class="feed-dot-sep"></span>
          <span class="feed-status-badge s-${p.status}">${p.status}</span>
        </div>
        <div class="feed-maker-row">
          <div class="feed-avatar" style="background:${maker.color}">${getInitials(maker.name)}</div>
          <div class="feed-maker-info">
            <span class="feed-maker-name">${maker.name}</span>
            <span class="feed-maker-handle">${maker.handle} · ${maker.flag} ${maker.country}</span>
          </div>
        </div>
        <h3 class="feed-name">${p.name}${paidStar(p)}</h3>
        <p class="feed-tagline">${p.tagline}</p>
        <p class="feed-desc">${p.desc}</p>
        <div class="feed-footer">
          <span class="feed-cat">${p.category}</span>
          <span class="feed-cta">View details →</span>
        </div>
      </article>`;
  }).join('');

  container.innerHTML = `<div class="feed-view">${cards}</div>`;
  container.querySelectorAll('.feed-card').forEach(c => {
    c.addEventListener('click', () => openDrawer(parseInt(c.dataset.idx, 10)));
  });
}
