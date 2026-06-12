import {
  formatPlanDate,
  formatPlanTitleDate,
  getPlanDate,
  getYmd,
} from "./date";

describe("planOfDay/date", () => {
  it("formats dates as ymd", () => {
    expect(getYmd(new Date("2026-05-01T12:00:00"))).toBe("2026-05-01");
  });

  it("uses the previous calendar day before 8am", () => {
    expect(getPlanDate(new Date("2026-05-01T07:59:59"))).toBe("2026-04-30");
  });

  it("uses the current calendar day at 8am", () => {
    expect(getPlanDate(new Date("2026-05-01T08:00:00"))).toBe("2026-05-01");
  });

  it("uses the current calendar day after 8am", () => {
    expect(getPlanDate(new Date("2026-05-01T18:30:00"))).toBe("2026-05-01");
  });

  it("formats selected dates for display", () => {
    expect(formatPlanDate("2026-05-01")).toContain("May");
  });

  it("formats the title date", () => {
    expect(formatPlanTitleDate("2026-05-01")).toBe("5/1");
  });
});
