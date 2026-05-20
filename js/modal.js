/**
 * All submit modal logic: open/close, tier picker, pricing calculator, live preview.
 */

function recalcAndPreview() {
  const tier = document.querySelector('input[name="tier"]:checked').value;
  const cells = parseInt(document.querySelector('input[name="cells"]:checked').value, 10);
  const hasBorder = document.getElementById('cb-border').checked;
  const hasFill   = document.getElementById('cb-fill').checked;
  const borderColor = document.getElementById('border-color').value;
  const fillColor   = document.getElementById('fill-color').value;

  // Show / hide options block
  document.getElementById('tier-options-block').classList.toggle('is-visible', tier === 'paid');

  // Enable / disable color pickers based on toggle state
  document.getElementById('border-color').disabled = !hasBorder;
  document.getElementById('fill-color').disabled   = !hasFill;

  // Reflect checkbox state visually on toggle-card
  document.querySelector('[data-toggle="border"]').classList.toggle('is-on', hasBorder);
  document.querySelector('[data-toggle="fill"]').classList.toggle('is-on', hasFill);

  // Price calculation
  let cellCost = 0, borderCost = 0, fillCost = 0;
  if (tier === 'paid') {
    cellCost   = (cells - 1) * 2.99;
    borderCost = hasBorder ? 4.99 : 0;
    fillCost   = hasFill ? 7.99 : 0;
  }
  const total = cellCost + borderCost + fillCost;

  // Render price summary breakdown
  const rows = ['<div class="price-row"><span>Base listing</span><span>$0.00</span></div>'];
  if (cellCost > 0) {
    const extra = cells - 1;
    rows.push(`<div class="price-row"><span>${cells} cells · ${extra} extra × $2.99</span><span>+$${cellCost.toFixed(2)}</span></div>`);
  }
  if (borderCost > 0) rows.push(`<div class="price-row"><span>Colored border</span><span>+$${borderCost.toFixed(2)}</span></div>`);
  if (fillCost > 0)   rows.push(`<div class="price-row"><span>Fill color</span><span>+$${fillCost.toFixed(2)}</span></div>`);
  rows.push(`<div class="price-row is-total"><span>Total</span><b>$${total.toFixed(2)} / month</b></div>`);
  document.getElementById('price-summary').innerHTML = rows.join('');

  // Update submit button text
  const btn = document.getElementById('form-submit-btn');
  btn.textContent = total > 0 ? `Subscribe $${total.toFixed(2)}/mo & Submit →` : 'Submit Product →';

  // Render live preview (only when paid section is visible)
  if (tier === 'paid') renderPreview({ cells, hasBorder, hasFill, borderColor, fillColor });
}

function renderPreview({ cells, hasBorder, hasFill, borderColor, fillColor }) {
  const canvas = document.getElementById('preview-canvas');
  let colSpan = 1, rowSpan = 1;
  if (cells === 2) { colSpan = 2; rowSpan = 1; }
  if (cells === 4) { colSpan = 2; rowSpan = 2; }

  const targetClass = ['preview-cell', 'is-target', hasBorder ? 'has-border' : '', hasFill ? 'has-fill' : ''].filter(Boolean).join(' ');
  const targetStyle = `grid-column: span ${colSpan}; grid-row: span ${rowSpan};` +
    (hasBorder ? ` --prev-border:${borderColor};` : '') +
    (hasFill   ? ` --prev-fill:${fillColor};`   : '');

  const cellsUsed = colSpan * rowSpan;
  const totalSlots = 30; // 5×6 — matches the actual wall grid column count
  // Put 2 placeholders before the target so it doesn't anchor to top-left —
  // more honestly represents it appearing among other products on the wall.
  const beforeCount = 2;
  const afterCount  = Math.max(0, totalSlots - cellsUsed - beforeCount);

  canvas.innerHTML =
    Array(beforeCount).fill('<div class="preview-cell is-placeholder"></div>').join('') +
    `<div class="${targetClass}" style="${targetStyle}">
       <div class="preview-cell-name">YOUR<br/>PRODUCT</div>
     </div>` +
    Array(afterCount).fill('<div class="preview-cell is-placeholder"></div>').join('');
}

/**
 * Initialise all modal event listeners. Call once on DOMContentLoaded.
 */
export function initModal() {
  const modalOverlay = document.getElementById('modal-overlay');

  document.getElementById('open-modal').addEventListener('click', () => {
    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    recalcAndPreview();
  });

  document.getElementById('modal-close').addEventListener('click', () => {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // Tier card selection
  document.querySelectorAll('.tier-card').forEach(card => {
    card.addEventListener('click', () => {
      const tier = card.dataset.tier;
      document.getElementById('tier-' + tier).checked = true;
      document.querySelectorAll('.tier-card').forEach(c => c.classList.toggle('is-selected', c === card));
      recalcAndPreview();
    });
  });

  // Size option selection
  document.querySelectorAll('.size-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      const cells = opt.dataset.cells;
      document.getElementById('cells-' + cells).checked = true;
      document.querySelectorAll('.size-opt').forEach(s => s.classList.toggle('is-selected', s === opt));
      recalcAndPreview();
    });
  });

  // Toggle card (border/fill) — flip checkbox, ignore swatch clicks
  document.querySelectorAll('.toggle-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'color') return;
      if (e.target.classList && e.target.classList.contains('color-swatch')) return;
      const cb = card.querySelector('input[type="checkbox"]');
      cb.checked = !cb.checked;
      recalcAndPreview();
    });
  });

  // Color picker live update
  document.getElementById('border-color').addEventListener('input', recalcAndPreview);
  document.getElementById('fill-color').addEventListener('input', recalcAndPreview);
}
