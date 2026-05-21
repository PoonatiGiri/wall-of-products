/* ── LOVE / HEART SYSTEM ──────────────────────────────
   SEEDED  = pre-loaded community counts shown to all visitors
   localStorage tracks whether THIS browser has loved each product
   Display count = SEEDED + (user has loved ? 1 : 0)
───────────────────────────────────────────────────── */
const SEEDED = {
  'ShipFast': 247,    'FormCraft': 186,  'StandupBot': 143,
  'APIforge': 128,    'DevLog': 112,     'ColorToken': 98,
  'TaskFlow AI': 91,  'PriceAlert': 84,  'TranslateNow': 76,
  'QuizBase': 69,     'DataPulse': 64,   'DesignSync': 58,
  'LearnPath': 54,    'RepoReview': 49,  'LaunchKit': 43,
  'LocaleKit': 38,    'PivotAI': 31,     'InstaPoll': 27,
  'DocSearch': 24,    'BrandVoice': 22,  'SlackDigest': 19,
  'MeetingCost': 17,  'HostCheck': 12,   'CashFlow': 10,
  'SurveyFast': 9,    'CopyLens': 8,     'EquityCalc': 7,
  'PagePulse': 6,     'SpeedRead': 5,    'MetricMate': 4,
};

const LS_KEY = 'wop_loves_v1';

function load()      { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
function save(obj)   { try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch {} }

export function isLoved(name)     { return !!load()[name]; }
export function getSeeded(name)   { return SEEDED[name] || 0; }
export function getLoveCount(name){ return getSeeded(name) + (isLoved(name) ? 1 : 0); }

export function toggleLove(name) {
  const ul = load();
  if (ul[name]) delete ul[name]; else ul[name] = 1;
  save(ul);
  return !!ul[name];
}

export function loveBtn(name, extraClass = '') {
  const loved = isLoved(name);
  const count = getLoveCount(name);
  return `<button class="cell-love${loved ? ' is-loved' : ''}${extraClass ? ' ' + extraClass : ''}" data-love="${name}">${loved ? '♥' : '♡'} ${count}</button>`;
}

export function attachLoveBtn(el, onToggle) {
  el.querySelectorAll('[data-love]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const name = btn.dataset.love;
      const newState = toggleLove(name);
      btn.innerHTML = (newState ? '♥' : '♡') + ' ' + getLoveCount(name);
      btn.classList.toggle('is-loved', newState);
      if (onToggle) onToggle(name, newState);
    });
  });
}
