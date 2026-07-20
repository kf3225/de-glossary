import { describe, expect, it } from "vitest";
import { mergeProgress, mergeStores, overwriteStore } from "@lib/progress/merge";
import type { QuestionProgress } from "@/types/progress";

function buildProgress(
  id: string,
  overrides: Partial<QuestionProgress> = {},
): QuestionProgress {
  return {
    questionId: id,
    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastAnsweredAt: "2026-01-01T00:00:00.000Z",
    lastResult: "correct",
    markedForReview: false,
    ...overrides,
  };
}

describe("mergeProgress", () => {
  it("各数値を合算する", () => {
    const a = buildProgress("q1", {
      attempts: 5,
      correctCount: 3,
      incorrectCount: 2,
      lastAnsweredAt: "2026-01-01T00:00:00.000Z",
      lastResult: "correct",
    });
    const b = buildProgress("q1", {
      attempts: 2,
      correctCount: 1,
      incorrectCount: 1,
      lastAnsweredAt: "2026-02-01T00:00:00.000Z",
      lastResult: "incorrect",
    });
    const m = mergeProgress(a, b);
    expect(m.attempts).toBe(7);
    expect(m.correctCount).toBe(4);
    expect(m.incorrectCount).toBe(3);
    expect(m.lastAnsweredAt).toBe("2026-02-01T00:00:00.000Z");
    expect(m.lastResult).toBe("incorrect"); // より新しい方の結果
  });

  it("異なる問題IDはエラー", () => {
    const a = buildProgress("q1");
    const b = buildProgress("q2");
    expect(() => mergeProgress(a, b)).toThrow();
  });

  it("markedForReview は OR を採用", () => {
    const a = buildProgress("q1", { markedForReview: true });
    const b = buildProgress("q1", { markedForReview: false });
    expect(mergeProgress(a, b).markedForReview).toBe(true);
  });

  it("lastResult は古い方を採用（aのほうが新しい場合）", () => {
    const a = buildProgress("q1", {
      attempts: 1,
      correctCount: 1,
      incorrectCount: 0,
      lastAnsweredAt: "2026-05-01T00:00:00.000Z",
      lastResult: "correct",
    });
    const b = buildProgress("q1", {
      attempts: 1,
      correctCount: 0,
      incorrectCount: 1,
      lastAnsweredAt: "2026-01-01T00:00:00.000Z",
      lastResult: "incorrect",
    });
    const m = mergeProgress(a, b);
    expect(m.lastResult).toBe("correct");
    expect(m.lastAnsweredAt).toBe("2026-05-01T00:00:00.000Z");
  });
});

describe("mergeStores", () => {
  it("既存項目はマージ、新規項目は追加", () => {
    const current = {
      version: 1 as const,
      items: [
        buildProgress("q1", { attempts: 1, correctCount: 1 }),
        buildProgress("q2", { attempts: 2, correctCount: 1, incorrectCount: 1 }),
      ],
    };
    const incoming = {
      version: 1 as const,
      items: [
        buildProgress("q1", { attempts: 2, correctCount: 0, incorrectCount: 2, lastResult: "incorrect" as const }),
        buildProgress("q3", { attempts: 1, correctCount: 0, incorrectCount: 1, lastResult: "incorrect" as const }),
      ],
    };
    const merged = mergeStores(current, incoming);
    const map = new Map(merged.items.map((p) => [p.questionId, p]));
    expect(map.get("q1")?.attempts).toBe(3);
    expect(map.get("q1")?.correctCount).toBe(1);
    expect(map.get("q1")?.incorrectCount).toBe(2);
    expect(map.get("q2")?.attempts).toBe(2);
    expect(map.get("q3")?.attempts).toBe(1);
  });
});

describe("overwriteStore", () => {
  it("incomingで置換", () => {
    const current = {
      version: 1 as const,
      items: [buildProgress("q1")],
    };
    const incoming = {
      version: 1 as const,
      items: [buildProgress("q2"), buildProgress("q3")],
    };
    const result = overwriteStore(incoming);
    expect(result.items.map((p) => p.questionId)).toEqual(["q2", "q3"]);
    // 元の current は影響を受けない
    expect(current.items.map((p) => p.questionId)).toEqual(["q1"]);
  });
});
