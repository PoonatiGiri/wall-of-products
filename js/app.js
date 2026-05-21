import { products, makers } from './data.js';
import {
  currentView, setView, setFilters, setSearch,
  getFilteredProducts,
} from './state.js';
import { renderGrid }        from './views/grid.js';
import { renderList }        from './views/list.js';
import { renderLeaderboard } from './views/leaderboard.js';
import { renderFeed }        from './views/feed.js';
import { renderMakers }      from './views/makers.js';
import { renderStats }        from './views/stats.js';
import { openDrawer, closeDrawer } from './drawer.js';
import { initModal }         from './modal.js';
import { parseMRR }          from './utils.js';
import { tweets }            from './tweets.js';

/* ── VIEW DEFINITIONS ────────────────────────────────── */
const VIEWS = [
  { id: 'grid',        label: 'Grid' },
  { id: 'list',        label: 'List' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'feed',        label: 'Feed' },
  { id: 'makers',      label: 'Makers' },
  { id: 'stats',       label: 'Stats' },
];

/* ── RENDER CURRENT VIEW ─────────────────────────────── */
export function renderCurrentView() {
  const filtered = getFilteredProducts(products);
  switch (currentView) {
    case 'grid':
      renderGrid(filtered, document.getElementById('products-grid'), products, openDrawer);
      break;
    case 'list':
      renderList(filtered, document.getElementById('view-list'), products, openDrawer);
      break;
    case 'leaderboard':
      renderLeaderboard(filtered, document.getElementById('view-leaderboard'), products, openDrawer);
      break;
    case 'feed':
      renderFeed(filtered, document.getElementById('view-feed'), products, openDrawer);
      break;
    case 'makers':
      renderMakers(filtered, document.getElementById('view-makers'), products, openDrawer);
      break;
    case 'stats':
      renderStats(document.getElementById('view-stats'));
      break;
  }
}

/* ── COMPUTE STATS ───────────────────────────────────── */
function computeStats() {
  const totalMRR = products.reduce((sum, p) => sum + parseMRR(p.mrr), 0);
  const countries = new Set(Object.values(makers).map(m => m.country));
  return {
    products: products.length,
    makers: Object.keys(makers).length,
    mrr: totalMRR > 0
      ? '$' + (totalMRR >= 1000 ? (totalMRR / 1000).toFixed(1) + 'K' : totalMRR)
      : '$0',
    countries: countries.size,
  };
}

/* ── INIT ────────────────────────────────────────────── */
function init() {
  // Render stats
  const stats = computeStats();
  document.getElementById('stats-row').innerHTML = [
    { value: stats.products, label: 'Products' },
    { value: stats.makers,   label: 'Makers' },
    { value: stats.mrr,      label: 'Total MRR' },
    { value: stats.countries,label: 'Countries' },
  ].map(s => `<div class="stat"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`).join('');

  // Render view tabs
  const tabsEl = document.getElementById('view-tabs');
  VIEWS.forEach(v => {
    const btn = document.createElement('button');
    btn.className = 'view-tab' + (v.id === currentView ? ' active' : '');
    btn.textContent = v.label;
    btn.dataset.view = v.id;
    btn.addEventListener('click', () => {
      if (currentView === v.id) return;
      setView(v.id);
      document.querySelectorAll('.view-tab').forEach(t => t.classList.toggle('active', t.dataset.view === v.id));
      document.querySelectorAll('.view-container').forEach(c => c.classList.toggle('active', c.id === 'view-' + v.id));
      renderCurrentView();
    });
    tabsEl.appendChild(btn);
  });

  // Render filter pills (derived from all unique categories)
  const allCategories = ['ALL', ...new Set(products.map(p => p.category))];
  const pillsEl = document.getElementById('filter-pills');
  allCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill' + (cat === 'ALL' ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const activeCat = btn.dataset.cat;
      setFilters(activeCat === 'ALL' ? [] : [activeCat]);
      renderCurrentView();
    });
    pillsEl.appendChild(btn);
  });

  // Search input
  document.getElementById('search-input').addEventListener('input', e => {
    setSearch(e.target.value);
    renderCurrentView();
  });

  // Drawer close
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('overlay').addEventListener('click', closeDrawer);

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.getElementById('modal-overlay').classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // Modal
  initModal();

  // Footer view navigation links (data-goto="grid" etc.)
  document.querySelectorAll('.footer-nav-link[data-goto]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const viewId = link.dataset.goto;
      setView(viewId);
      document.querySelectorAll('.view-tab').forEach(t => t.classList.toggle('active', t.dataset.view === viewId));
      document.querySelectorAll('.view-container').forEach(c => c.classList.toggle('active', c.id === 'view-' + viewId));
      renderCurrentView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Footer submit / boost links open the modal
  ['footer-open-modal', 'footer-boost'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('modal-overlay').classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Render tweets sidebar
  const tweetFeed = document.getElementById('tweet-feed');
  if (tweetFeed) {
    tweetFeed.innerHTML = tweets.map(t => `
      <div class="tweet-card">
        <div class="tweet-card-top">
          <div class="tweet-avatar" style="background:${t.color}">${t.initials}</div>
          <div class="tweet-meta">
            <div class="tweet-name">${t.name}</div>
            <div class="tweet-time">${t.time} ago</div>
          </div>
        </div>
        <div class="tweet-text">${t.text}</div>
        <a class="tweet-handle" href="https://x.com/${t.handle.replace('@','')}" target="_blank" rel="noopener">${t.handle}</a>
      </div>
    `).join('');
  }

  // Initial render
  renderCurrentView();
}

init();
