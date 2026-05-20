/* ── SHARED HELPERS ──────────────────────────────────── */

export const dotClass = {
  active:   'dot-active',
  building: 'dot-building',
  beta:     'dot-beta',
  shipped:  'dot-shipped',
  paused:   'dot-paused',
};

/**
 * Parse an MRR string like "$4.2k", "$1.1m", "$540" → number
 */
export function parseMRR(mrrStr) {
  if (!mrrStr || mrrStr === '—') return 0;
  const cleaned = String(mrrStr).replace(/[$,]/g, '').toLowerCase();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (cleaned.includes('m')) return num * 1000000;
  if (cleaned.includes('k')) return num * 1000;
  return num;
}

/**
 * Parse a users string like "1.2K", "4.8K", "310" → number
 */
export function parseUsers(usersStr) {
  if (!usersStr || usersStr === '—') return 0;
  const cleaned = String(usersStr).replace(/,/g, '').toLowerCase();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (cleaned.includes('k')) return num * 1000;
  return num;
}

/**
 * Fisher-Yates shuffle — returns a new array, does not mutate input
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Returns true if a product has a paid listing tier
 */
export function isPaid(p) {
  return p.listing && p.listing.tier === 'paid';
}

/**
 * Gold star span for paid products in list/feed/leaderboard/makers views
 */
export function paidStar(p) {
  return isPaid(p) ? '<span class="paid-star" title="Featured listing">★</span>' : '';
}

/**
 * Deterministic days ago based on position in the launch order array
 */
export function daysAgoFor(name, launchOrderByName) {
  const idx = launchOrderByName.indexOf(name);
  return idx === -1 ? 365 : idx * 17 + 4;
}

/**
 * Format a days number as a relative time string
 */
export function formatRelative(days) {
  if (days < 7) return days + (days === 1 ? ' day ago' : ' days ago');
  if (days < 30) { const w = Math.floor(days / 7); return w + (w === 1 ? ' week ago' : ' weeks ago'); }
  if (days < 365) { const m = Math.floor(days / 30); return m + (m === 1 ? ' month ago' : ' months ago'); }
  const y = Math.floor(days / 365);
  return y + (y === 1 ? ' year ago' : ' years ago');
}

/**
 * Get two-letter initials from a full name
 */
export function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}
