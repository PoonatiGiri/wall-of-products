/* ── APP STATE ───────────────────────────────────────── */

export let currentView = 'grid';
export let activeFilters = [];
export let searchQuery = '';

export function setView(v) {
  currentView = v;
}

export function setFilters(arr) {
  activeFilters = arr;
}

export function setSearch(q) {
  searchQuery = q;
}

/**
 * Apply the current activeFilters (category array) and searchQuery
 * to the products array and return the filtered result.
 * When activeFilters is empty or contains 'ALL', no category filter is applied.
 */
export function getFilteredProducts(products) {
  const hasAll = activeFilters.length === 0 || activeFilters.includes('ALL');
  const term = searchQuery.toLowerCase().trim();
  return products.filter(p => {
    const catMatch = hasAll || activeFilters.includes(p.category);
    const nameMatch = !term || p.name.toLowerCase().includes(term) || p.tagline.toLowerCase().includes(term);
    return catMatch && nameMatch;
  });
}
