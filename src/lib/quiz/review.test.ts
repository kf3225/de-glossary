import { describe, expect, it } from "vitest";
import {
  accuracyOf,
  isMarkedForReview,
  isWeakQuestion,
} from "@lib/quiz/review";
import type { QuestionProgress } from "@/types/progress";

function buildProgress(
  overrides: Partial<QuestionProgress> = {},
): QuestionProgress {
  return {
    questionId: "q1",
    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    lastAnsweredAt: "2026-01-01T00:00:00.000Z",
    lastResult: "correct",
    markedForReview: false,
    ...overrides,
  };
}

describe("accuracyOf", () => {
  it("未回答は0", () => {
    expect(accuracyOf(undefined)).toBe(0);
    expect(accuracyOf(buildProgress({ attempts: 0 }))).toBe(0);
  });

  it("正答率を計算する", () => {
    expect(accuracyOf(buildProgress({ attempts: 10, correctCount: 8, incorrectCount: 2 }))).toBe(80);
    expect(accuracyOf(buildProgress({ attempts: 4, correctCount: 1, incorrectCount: 3 }))).toBe(25);
  });
});

describe("isWeakQuestion", () => {
  it("未回答は苦手問題ではない", () => {
    expect(isWeakQuestion(undefined, 80)).toBe(false);
    expect(isWeakQuestion(buildProgress({ attempts: 0 }), 80)).toBe(false);
  });

  it("手動復習設定は最優先で苦手問題", () => {
    expect(isWeakQuestion(buildProgress({ markedForReview: true }), 80)).toBe(true);
  });

  it("一度でも不正解は苦手問題", () => {
    expect(
      isWeakQuestion(
        buildProgress({ attempts: 10, correctCount: 9, incorrectCount: 1 }),
        80,
      ),
    ).toBe(true);
  });

  it("正答率がしきい値未満は苦手問題", () => {
    // 正答率 70% < 80%
    expect(
      isWeakQuestion(
        buildProgress({ attempts: 10, correctCount: 7, incorrectCount: 3 }),
        80,
      ),
    ).toBe(true);
  });

  it("全問正解かつ手動設定なしは苦手問題ではない", () => {
    expect(
      isWeakQuestion(
        buildProgress({ attempts: 10, correctCount: 10, incorrectCount: 0 }),
        80,
      ),
    ).toBe(false);
  });

  it("しきい値未満でも回答回数0は苦手問題ではない", () => {
    expect(isWeakQuestion(buildProgress({ attempts: 0, correctCount: 0 }), 80)).toBe(false);
  });
});

describe("isMarkedForReview", () => {
  it("undefined は false", () => {
    expect(isMarkedForReview(undefined)).toBe(false);
  });

  it("markedForReview を返す", () => {
    expect(isMarkedForReview(buildProgress({ markedForReview: true }))).toBe(true);
    expect(isMarkedForReview(buildProgress({ markedForReview: false }))).toBe(false);
  });
});
