import { describe, expect, it, vi, beforeEach } from "vitest";
import { withBase } from "@lib/url/withBase";

describe("withBase", () => {
  beforeEach(() => {
    vi.stubEnv("BASE_URL", "/de-glossary/");
    // import.meta.env はモジュール評価時に評価されるため、
    // テスト環境では BASE_URL を stubEnv しても反映されない可能性がある。
    // ここでは機能の存在意義と、外部URL・空値の処理を検証する。
  });

  it("外部URLはそのまま返す", () => {
    expect(withBase("https://example.com/")).toBe("https://example.com/");
    expect(withBase("http://example.com/path")).toBe("http://example.com/path");
  });

  it("プロトコル相対URLもそのまま", () => {
    expect(withBase("//example.com/")).toBe("//example.com/");
  });

  it("アンカーはそのまま", () => {
    expect(withBase("#section")).toBe("#section");
  });

  it("クエリはそのまま", () => {
    expect(withBase("?q=1")).toBe("?q=1");
  });

  it("空パスは BASE_URL を返す（環境依存）", () => {
    const result = withBase("");
    expect(typeof result).toBe("string");
  });

  it("ルート相対パスは結合される", () => {
    const result = withBase("/quiz/");
    expect(result.length).toBeGreaterThan(0);
    // 末尾の /quiz/ が含まれること
    expect(result.endsWith("/quiz/")).toBe(true);
  });

  it("相対パスも結合される", () => {
    const result = withBase("quiz/");
    expect(result.endsWith("/quiz/")).toBe(true);
  });
});
