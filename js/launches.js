/* ── LAUNCH DATE REGISTRY ─────────────────────────────
   Products listed here appear in the "Launched This Week" view.
   "This week" = within 7 days of the most-recently-listed product,
   so the demo always has content regardless of real-world date.
───────────────────────────────────────────────────── */
export const LAUNCHES = {
  'InstaPoll':             '2026-05-21',
  'peersupport':           '2026-05-20',
  'DataPulse':             '2026-05-19',
  'RepoReview':            '2026-05-18',
  'QuizBase':              '2026-05-17',
  'StandupBot':            '2026-05-16',
  'LocaleKit':             '2026-05-16',
  'Indians International': '2026-05-15',
};

const _dates  = Object.values(LAUNCHES).map(d => new Date(d).getTime());
const _newest = Math.max(..._dates);

export function daysAgo(name) {
  if (!LAUNCHES[name]) return null;
  const diff = _newest - new Date(LAUNCHES[name]).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isThisWeek(name) {
  const d = daysAgo(name);
  return d !== null && d <= 7;
}

export function daysLabel(name) {
  const d = daysAgo(name);
  if (d === null) return '';
  if (d === 0) return 'Today';
  if (d === 1) return '1 day ago';
  return `${d} days ago`;
}
