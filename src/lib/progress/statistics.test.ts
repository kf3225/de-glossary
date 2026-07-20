import { describe, expect, it } from "vitest";
import {
  accuracyPercent,
  computeOverallStats,
  isUnattempted,
  round,
  sortByRecent,
} from "@lib/progress/statistics";
import type { ProgressStore, QuestionProgress } from "@/types/progress";
import type { QuizQuestion } from "@/types/quiz";

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

describe("round", () => {
  it("整数丸め", () => {
    expect(round(83.45)).toBe(83);
    expect(round(83.5)).toBe(84);
  });
  it("小数桁指定", () => {
    expect(round(83.456, 2)).toBe(83.46);
  });
  it("NaNは0", () => {
    expect(round(Number.NaN)).toBe(0);
  });
});

describe("accuracyPercent", () => {
  it("回答回数0は0", () => {
    expect(accuracyPercent(5, 0)).toBe(0);
  });
  it("正答率を計算", () => {
    expect(accuracyPercent(8, 10)).toBe(80);
    expect(accuracyPercent(1, 3)).toBe(33); // 33.33.. -> 33
  });
});

describe("isUnattempted", () => {
  it("undefined は true", () => {
    expect(isUnattempted(undefined)).toBe(true);
  });
  it("attempts=0 は true", () => {
    expect(isUnattempted(buildProgress("q1", { attempts: 0 }))).toBe(true);
  });
  it("attempts>0 は false", () => {
    expect(isUnattempted(buildProgress("q1", { attempts: 1, correctCount: 1 }))).toBe(false);
  });
});

describe("sortByRecent", () => {
  it("降順で並ぶ", () => {
    const items = [
      buildProgress("a", { lastAnsweredAt: "2026-01-01T00:00:00.000Z" }),
      buildProgress("b", { lastAnsweredAt: "2026-03-01T00:00:00.000Z" }),
      buildProgress("c", { lastAnsweredAt: "2026-02-01T00:00:00.000Z" }),
    ];
    const sorted = sortByRecent(items);
    expect(sorted.map((p) => p.questionId)).toEqual(["b", "c", "a"]);
  });
});

describe("computeOverallStats", () => {
  const questions: QuizQuestion[] = [
    {
      id: "q1",
      type: "true-false",
      prompt: "p1",
      explanation: "e1",
      tags: [],
      difficulty: "basic",
      answer: true,
    },
    {
      id: "q2",
      type: "true-false",
      prompt: "p2",
      explanation: "e2",
      tags: [],
      difficulty: "basic",
      answer: true,
    },
    {
      id: "q3",
      type: "true-false",
      prompt: "p3",
      explanation: "e3",
      tags: [],
      difficulty: "basic",
      answer: true,
    },
  ];

  it("全問題未回答", () => {
    const stats = computeOverallStats(questions, { version: 1, items: [] }, 80);
    expect(stats.attemptedQuestionCount).toBe(0);
    expect(stats.unattemptedQuestionCount).toBe(3);
    expect(stats.totalAttempts).toBe(0);
    expect(stats.accuracyRate).toBe(0);
    expect(stats.weakQuestionCount).toBe(0);
  });

  it("1問正解のみ → 苦手問題0", () => {
    const store: ProgressStore = {
      version: 1,
      items: [buildProgress("q1", { attempts: 1, correctCount: 1, incorrectCount: 0 })],
    };
    const stats = computeOverallStats(questions, store, 80);
    expect(stats.attemptedQuestionCount).toBe(1);
    expect(stats.totalCorrect).toBe(1);
    expect(stats.accuracyRate).toBe(100);
    expect(stats.weakQuestionCount).toBe(0);
  });

  it("1問不正解あり → 苦手問題1", () => {
    const store: ProgressStore = {
      version: 1,
      items: [
        buildProgress("q1", {
          attempts: 2,
          correctCount: 1,
          incorrectCount: 1,
          lastResult: "incorrect",
        }),
      ],
    };
    const stats = computeOverallStats(questions, store, 80);
    expect(stats.weakQuestionCount).toBe(1);
    expect(stats.accuracyRate).toBe(50);
  });

  it("手動復習設定 → marked/weak に加算", () => {
    const store: ProgressStore = {
      version: 1,
      items: [buildProgress("q2", { attempts: 1, correctCount: 1, markedForReview: true })],
    };
    const stats = computeOverallStats(questions, store, 80);
    expect(stats.markedCount).toBe(1);
    expect(stats.weakQuestionCount).toBe(1);
  });
});
