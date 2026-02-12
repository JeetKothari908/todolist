import {
  calculateCappedHeights,
  type ListMeasurement,
} from "../calculateCappedHeights";

const open = (scrollHeight: number): ListMeasurement => ({
  scrollHeight,
  isOpen: true,
});

const closed = (scrollHeight: number): ListMeasurement => ({
  scrollHeight,
  isOpen: false,
});

describe("calculateCappedHeights", () => {
  // ── Edge cases ──────────────────────────────────────────────────

  it("returns zeros when freeSpace is 0", () => {
    const r = calculateCappedHeights(0, [open(100), open(100)], 0);
    expect(r.heights).toEqual([0, 0]);
    expect(r.capped).toEqual([false, false]);
  });

  it("returns zeros when no lists are provided", () => {
    const r = calculateCappedHeights(400, [], 0);
    expect(r.heights).toEqual([]);
    expect(r.capped).toEqual([]);
  });

  // ── Both small (everything fits) ────────────────────────────────

  it("gives each list its natural size when total fits", () => {
    const r = calculateCappedHeights(400, [open(100), open(100)], 0);
    expect(r.heights).toEqual([100, 100]);
    expect(r.capped).toEqual([false, false]);
  });

  it("gives each list its natural size when total exactly equals free", () => {
    const r = calculateCappedHeights(400, [open(200), open(200)], 1);
    expect(r.heights).toEqual([200, 200]);
    expect(r.capped).toEqual([false, false]);
  });

  // ── Active list large, inactive small ───────────────────────────

  it("caps the active list when it alone causes overflow", () => {
    // active = 0, needs 500; inactive = 1, needs 100
    const r = calculateCappedHeights(400, [open(500), open(100)], 0);
    // Inactive gets natural 100, active gets remainder 300 (capped)
    expect(r.heights).toEqual([300, 100]);
    expect(r.capped).toEqual([true, false]);
  });

  it("caps the active list (index 1) when it causes overflow", () => {
    const r = calculateCappedHeights(400, [open(100), open(500)], 1);
    expect(r.heights).toEqual([100, 300]);
    expect(r.capped).toEqual([false, true]);
  });

  // ── Both large (both capped at equal share) ─────────────────────

  it("caps both lists at equal share when both exceed it", () => {
    const r = calculateCappedHeights(400, [open(500), open(600)], 0);
    expect(r.heights).toEqual([200, 200]);
    expect(r.capped).toEqual([true, true]);
  });

  it("caps both lists at equal share regardless of active index", () => {
    const r = calculateCappedHeights(400, [open(500), open(600)], 1);
    expect(r.heights).toEqual([200, 200]);
    expect(r.capped).toEqual([true, true]);
  });

  // ── Active small, inactive large ────────────────────────────────

  it("redistributes surplus when active is smaller than equal share", () => {
    // active = 0, needs 100; inactive = 1, needs 500
    // equalShare = 200; inactive first gets 200, active gets 200
    // but active only needs 100 → give surplus 100 to inactive
    // final: active=100, inactive=min(500,300)=300
    const r = calculateCappedHeights(400, [open(100), open(500)], 0);
    expect(r.heights).toEqual([100, 300]);
    expect(r.capped).toEqual([false, true]);
  });

  // ── Moderate overflow ───────────────────────────────────────────

  it("caps active and keeps inactive uncapped when inactive fits in equal share", () => {
    // active = 0, needs 250; inactive = 1, needs 180
    // equalShare = 200; inactive gets min(180, 200) = 180
    // active gets 400-180 = 220 (needs 250 → capped)
    const r = calculateCappedHeights(400, [open(250), open(180)], 0);
    expect(r.heights).toEqual([220, 180]);
    expect(r.capped).toEqual([true, false]);
  });

  // ── Closed panels ──────────────────────────────────────────────

  it("gives all space to the open list when one is closed", () => {
    const r = calculateCappedHeights(400, [open(500), closed(300)], 0);
    // closed list need = 0, so totalNeed = 500 > 400 → overflow
    // inactive(1) closed → need 0, gets 0; active(0) gets min(500,400) = 400
    expect(r.heights).toEqual([400, 0]);
    expect(r.capped).toEqual([true, false]);
  });

  it("handles only inactive list open", () => {
    const r = calculateCappedHeights(400, [closed(500), open(200)], 0);
    // active(0) closed → need 0; inactive(1) open → need 200
    // total 200 <= 400 → fits
    expect(r.heights).toEqual([0, 200]);
    expect(r.capped).toEqual([false, false]);
  });

  it("handles both lists closed", () => {
    const r = calculateCappedHeights(400, [closed(500), closed(300)], 0);
    expect(r.heights).toEqual([0, 0]);
    expect(r.capped).toEqual([false, false]);
  });

  // ── Odd free space (rounding) ──────────────────────────────────

  it("handles odd freeSpace without losing a pixel", () => {
    const r = calculateCappedHeights(401, [open(500), open(500)], 0);
    // equalShare = 200; inactive gets 200, active gets 201
    expect(r.heights[0] + r.heights[1]).toBe(401);
    expect(r.capped).toEqual([true, true]);
  });
});
