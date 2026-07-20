import { describe, expect, it } from "vitest";
import {
  findDuplicateIds,
  validateQuestion,
  validateQuestions,
  validateQuestionProgress,
  validateProgressStore,
  validateExportedData,
} from "@lib/quiz/validation";
import { allQuestions } from "@data/quizzes";

describe("validateQuestion", () => {
  it("正常な単一選択問題はパス", () => {
    const q = {
      id: "q1",
      type: "single-choice" as const,
      prompt: "p",
      explanation: "e",
      tags: ["a"],
      difficulty: "basic" as const,
      choices: ["x", "y"],
      answer: 0,
    };
    expect(validateQuestion(q).id).toBe("q1");
  });

  it("問題IDが空はエラー", () => {
    expect(() =>
      validateQuestion({
        id: "",
        type: "true-false",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "basic",
        answer: true,
      }),
    ).toThrow();
  });

  it("選択肢が1つはエラー", () => {
    expect(() =>
      validateQuestion({
        id: "q2",
        type: "single-choice",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "basic",
        choices: ["only"],
        answer: 0,
      }),
    ).toThrow();
  });

  it("正解インデックス範囲外はエラー", () => {
    expect(() =>
      validateQuestion({
        id: "q3",
        type: "single-choice",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "basic",
        choices: ["a", "b"],
        answer: 5,
      }),
    ).toThrow();
  });

  it("難易度が未定義はエラー", () => {
    expect(() =>
      validateQuestion({
        id: "q4",
        type: "true-false",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "super-hard",
        answer: true,
      }),
    ).toThrow();
  });
});

describe("validateQuestions", () => {
  it("問題IDの重複を検出", () => {
    const dup = [
      {
        id: "dup",
        type: "true-false" as const,
        prompt: "p1",
        explanation: "e1",
        tags: [],
        difficulty: "basic" as const,
        answer: true,
      },
      {
        id: "dup",
        type: "true-false" as const,
        prompt: "p2",
        explanation: "e2",
        tags: [],
        difficulty: "basic" as const,
        answer: false,
      },
    ];
    const result = validateQuestions(dup);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.includes("重複する問題ID"))).toBe(true);
    }
  });

  it("実データ allQuestions はすべて検証OK", () => {
    const result = validateQuestions(allQuestions as unknown[]);
    expect(result.ok).toBe(true);
  });
});

describe("findDuplicateIds", () => {
  it("重複を検出", () => {
    const dup = [
      {
        id: "x",
        type: "true-false",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "basic",
        answer: true,
      },
      {
        id: "x",
        type: "true-false",
        prompt: "p",
        explanation: "e",
        tags: [],
        difficulty: "basic",
        answer: false,
      },
    ];
    expect(findDuplicateIds(dup as any)).toEqual(["x"]);
  });

  it("重複なしは空配列", () => {
    expect(findDuplicateIds(allQuestions)).toEqual([]);
  });
});

describe("validateQuestionProgress", () => {
  it("正常データ", () => {
    const r = validateQuestionProgress({
      questionId: "q1",
      attempts: 3,
      correctCount: 2,
      incorrectCount: 1,
      lastAnsweredAt: "2026-01-01T00:00:00.000Z",
      lastResult: "incorrect",
      markedForReview: false,
    });
    expect(r.ok).toBe(true);
  });

  it("attempts 不整合はエラー", () => {
    const r = validateQuestionProgress({
      questionId: "q1",
      attempts: 5,
      correctCount: 2,
      incorrectCount: 1, // 2+1=3 != 5
      lastAnsweredAt: "2026-01-01T00:00:00.000Z",
      lastResult: "incorrect",
      markedForReview: false,
    });
    expect(r.ok).toBe(false);
  });

  it("負の数はエラー", () => {
    const r = validateQuestionProgress({
      questionId: "q1",
      attempts: -1,
      correctCount: 0,
      incorrectCount: 0,
      lastAnsweredAt: "2026-01-01T00:00:00.000Z",
      lastResult: "incorrect",
      markedForReview: false,
    });
    expect(r.ok).toBe(false);
  });
});

describe("validateProgressStore", () => {
  it("バージョン不一致はエラー", () => {
    const r = validateProgressStore({ version: 99, items: [] });
    expect(r.ok).toBe(false);
  });

  it("空ストアはOK", () => {
    const r = validateProgressStore({ version: 1, items: [] });
    expect(r.ok).toBe(true);
  });
});

describe("validateExportedData", () => {
  it("正常データ", () => {
    const r = validateExportedData({
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      progress: [],
    });
    expect(r.ok).toBe(true);
  });

  it("exportedAt 空文字はエラー", () => {
    const r = validateExportedData({
      version: 1,
      exportedAt: "",
      progress: [],
    });
    expect(r.ok).toBe(false);
  });
});
