/**
 * Pure calculation for dynamically sizing two (or more) lists that share
 * a fixed amount of vertical space.
 *
 * Rules
 * ─────
 * 1. Lists grow to show all items when the total fits in available space.
 * 2. When overflow occurs the *active* list (the one whose mutation caused
 *    the overflow) is capped first and receives a scrollbar.
 * 3. The *inactive* list may continue to expand up to an equal share of
 *    the available space (i.e. `freeSpace / N`).
 * 4. Once both lists exceed the equal share, both are capped.
 *
 * If the active list needs less than its share the surplus is given to the
 * inactive list so no vertical space is wasted.
 */

export interface ListMeasurement {
  /** The total content height of the list (element.scrollHeight). */
  scrollHeight: number;
  /** Whether the panel/list is expanded (open). Collapsed → need = 0. */
  isOpen: boolean;
}

export interface CappedHeightsResult {
  /** Assigned maxHeight for each list (px). */
  heights: number[];
  /** Whether each list is capped (content exceeds assigned height). */
  capped: boolean[];
}

export function calculateCappedHeights(
  freeSpace: number,
  measurements: ListMeasurement[],
  activeListIndex: number,
): CappedHeightsResult {
  const n = measurements.length;
  const heights: number[] = new Array(n).fill(0);
  const capped: boolean[] = new Array(n).fill(false);

  if (freeSpace <= 0 || n === 0) {
    return { heights, capped };
  }

  // Derive content needs (closed lists need 0).
  const needs = measurements.map((m) => (m.isOpen ? m.scrollHeight : 0));
  const totalNeed = needs.reduce((sum, v) => sum + v, 0);

  // ── All content fits ──────────────────────────────────────────────
  if (totalNeed <= freeSpace) {
    for (let i = 0; i < n; i++) heights[i] = needs[i];
    return { heights, capped };
  }

  // ── Overflow: two-list fast path ──────────────────────────────────
  if (n === 2) {
    const ai = Math.max(0, Math.min(activeListIndex, 1)); // active index
    const ii = ai === 0 ? 1 : 0; // inactive index
    const equalShare = Math.floor(freeSpace / 2);

    // Step 1 – give inactive list up to its equal share.
    let inactiveH = Math.min(needs[ii], equalShare);
    let activeH = freeSpace - inactiveH;

    // Step 2 – if the active list doesn't need all of its allocation,
    //          redistribute the surplus to the inactive list.
    if (activeH > needs[ai]) {
      activeH = needs[ai];
      inactiveH = Math.min(needs[ii], freeSpace - activeH);
    }

    heights[ai] = activeH;
    heights[ii] = inactiveH;
    capped[ai] = needs[ai] > activeH;
    capped[ii] = needs[ii] > inactiveH;

    return { heights, capped };
  }

  // ── General N-list fallback: equal distribution ───────────────────
  const equalShare = Math.floor(freeSpace / n);
  for (let i = 0; i < n; i++) {
    heights[i] = Math.min(needs[i], equalShare);
    capped[i] = needs[i] > equalShare;
  }

  return { heights, capped };
}
