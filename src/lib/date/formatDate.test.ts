import { describe, expect, it } from "vitest";
import { formatDateTime, isValidIsoDate, laterIso, nowIso } from "@lib/date/formatDate";

describe("nowIso", () => {
  it("ISO 8601 形式の文字列を返す", () => {
    const iso = nowIso();
    expect(isValidIsoDate(iso)).toBe(true);
  });
});

describe("isValidIsoDate", () => {
  it("有効なISO", () => {
    expect(isValidIsoDate("2026-07-20T10:30:00.000Z")).toBe(true);
  });
  it("無効な文字列", () => {
    expect(isValidIsoDate("")).toBe(false);
    expect(isValidIsoDate("not a date")).toBe(false);
    expect(isValidIsoDate("2026-13-99T99:99:99Z")).toBe(false);
  });
});

describe("formatDateTime", () => {
  it("日本語形式に変換", () => {
    const s = formatDateTime("2026-07-20T10:30:00.000Z");
    // Asia/Tokyo では 19:30 になるはず
    expect(s).toContain("2026");
    expect(s).toContain("7月");
    expect(s).toContain("20日");
  });

  it("無効な日時はフォールバック", () => {
    expect(formatDateTime("invalid")).toBe("無効な日時");
  });
});

describe("laterIso", () => {
  it("より新しい方を返す", () => {
    expect(laterIso("2026-01-01T00:00:00.000Z", "2026-02-01T00:00:00.000Z")).toBe(
      "2026-02-01T00:00:00.000Z",
    );
    expect(laterIso("2026-03-01T00:00:00.000Z", "2026-02-01T00:00:00.000Z")).toBe(
      "2026-03-01T00:00:00.000Z",
    );
  });

  it("片方が無効な場合はもう一方", () => {
    expect(laterIso("invalid", "2026-02-01T00:00:00.000Z")).toBe("2026-02-01T00:00:00.000Z");
  });
});
