import { products, makers, palette } from './data.js';
import { getInitials } from './utils.js';

const statusMap = { active: 'active', building: 'building', beta: 'beta', shipped: 'shipped', paused: 'paused' };

/**
 * Open the product drawer for the product at the given index in products[].
 */
export function openDrawer(idx) {
  const p = products[idx];
  const maker = makers[p.maker];
  const color = palette[idx % palette.length];

  const accent = document.getElementById('drawer-accent');
  const inner  = document.getElementById('drawer-inner');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('overlay');

  accent.style.background = color;

  const initials = getInitials(maker.name);

  inner.innerHTML = `
    <div class="drawer-maker-card">
      <div class="maker-avatar" style="background:${maker.color}">${initials}</div>
      <div class="maker-info">
        <div class="maker-name">${maker.name}</div>
        <div class="maker-meta">${maker.handle} &nbsp;·&nbsp; ${maker.flag} ${maker.country}</div>
      </div>
    </div>

    <div class="drawer-category">${p.category}</div>
    <div class="drawer-title">${p.name}</div>
    <div class="drawer-tagline">${p.tagline}</div>

    <div class="drawer-badges">
      <span class="badge badge--${statusMap[p.status] || 'paused'}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
      ${p.extra.find(e => e.label === 'Platform') ? `<span class="badge badge--neutral">${p.extra.find(e => e.label === 'Platform').value}</span>` : ''}
      ${p.extra.find(e => e.label === 'Since') ? `<span class="badge badge--neutral">Since ${p.extra.find(e => e.label === 'Since').value}</span>` : ''}
    </div>

    <hr class="drawer-divider"/>
    <div class="drawer-section-label">Key Metrics</div>
    <div class="metrics-grid">
      <div class="metric">
        <div class="metric-value">${p.mrr === '—' ? '—' : p.mrr.startsWith('$') ? p.mrr : '$' + p.mrr}</div>
        <div class="metric-label">MRR</div>
      </div>
      <div class="metric">
        <div class="metric-value">${p.users}</div>
        <div class="metric-label">Users</div>
      </div>
      <div class="metric">
        <div class="metric-value">${p.growth}</div>
        <div class="metric-label">Growth</div>
      </div>
    </div>

    <hr class="drawer-divider"/>
    <div class="drawer-section-label">About</div>
    <div class="drawer-desc">${p.desc}</div>

    <hr class="drawer-divider"/>
    <div class="drawer-section-label">Links</div>
    <div class="links-list">
      ${p.links.map(l => `<a class="link-item" href="${l.url}" target="_blank" rel="noopener"><span>${l.label}</span><span class="link-type">${l.type}</span><span class="link-arrow">↗</span></a>`).join('')}
    </div>

    <hr class="drawer-divider"/>
    <div class="drawer-section-label">Details</div>
    <div class="info-grid">
      ${p.extra.map(e => `<div class="info-item"><div class="info-label">${e.label}</div><div class="info-value">${e.value}</div></div>`).join('')}
    </div>
  `;

  drawer.classList.add('is-open');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the product drawer.
 */
export function closeDrawer() {
  document.getElementById('drawer').classList.remove('is-open');
  document.getElementById('overlay').classList.remove('is-open');
  document.body.style.overflow = '';
}
