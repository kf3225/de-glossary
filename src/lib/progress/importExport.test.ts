import { describe, expect, it } from "vitest";
import {
  applyImport,
  assertFileSize,
  buildExportFileName,
  buildExportJson,
  parseAndValidateImport,
} from "@lib/progress/importExport";
import type { ProgressStore } from "@/types/progress";
import { IMPORT_FILE_SIZE_LIMIT } from "@lib/constants";

describe("buildExportJson", () => {
  it("version 1, exportedAt 含むJSONを生成", () => {
    const store: ProgressStore = { version: 1, items: [] };
    const json = buildExportJson(store);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(typeof parsed.exportedAt).toBe("string");
    expect(parsed.exportedAt.length).toBeGreaterThan(0);
    expect(Array.isArray(parsed.progress)).toBe(true);
  });

  it("問題文・正解データは含まれない", () => {
    const store: ProgressStore = {
      version: 1,
      items: [
        {
          questionId: "q1",
          attempts: 1,
          correctCount: 1,
          incorrectCount: 0,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
      ],
    };
    const json = buildExportJson(store);
    expect(json).not.toContain("prompt");
    expect(json).not.toContain("explanation");
    expect(json).not.toContain("choices");
  });
});

describe("buildExportFileName", () => {
  it("日付ベースのファイル名", () => {
    const name = buildExportFileName(new Date("2026-07-20T00:00:00.000Z"));
    expect(name).toMatch(/^personal-learning-progress-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

describe("assertFileSize", () => {
  it("0バイトはエラーではない", () => {
    expect(assertFileSize(0)).toBe(true);
  });
  it("上限超はエラー", () => {
    const result = assertFileSize(IMPORT_FILE_SIZE_LIMIT + 1);
    expect(typeof result).toBe("string");
  });
  it("負の値はエラー", () => {
    expect(typeof assertFileSize(-1)).toBe("string");
  });
});

describe("parseAndValidateImport", () => {
  it("正常JSON", () => {
    const payload = {
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      progress: [
        {
          questionId: "q1",
          attempts: 1,
          correctCount: 1,
          incorrectCount: 0,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
      ],
    };
    const result = parseAndValidateImport(JSON.stringify(payload));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.summary.count).toBe(1);
    }
  });

  it("JSONでない文字列はエラー", () => {
    const result = parseAndValidateImport("not json");
    expect(result.ok).toBe(false);
  });

  it("version 不一致はエラー", () => {
    const result = parseAndValidateImport(
      JSON.stringify({ version: 2, exportedAt: "x", progress: [] }),
    );
    expect(result.ok).toBe(false);
  });

  it("attempts 不整合はエラー", () => {
    const payload = {
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      progress: [
        {
          questionId: "q1",
          attempts: 5,
          correctCount: 1,
          incorrectCount: 1,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
      ],
    };
    const result = parseAndValidateImport(JSON.stringify(payload));
    expect(result.ok).toBe(false);
  });

  it("同一問題IDの重複はエラー", () => {
    const payload = {
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      progress: [
        {
          questionId: "q1",
          attempts: 1,
          correctCount: 1,
          incorrectCount: 0,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
        {
          questionId: "q1",
          attempts: 1,
          correctCount: 0,
          incorrectCount: 1,
          lastAnsweredAt: "2026-01-02T00:00:00.000Z",
          lastResult: "incorrect",
          markedForReview: false,
        },
      ],
    };
    const result = parseAndValidateImport(JSON.stringify(payload));
    expect(result.ok).toBe(false);
  });

  it("空 progress 配列は許容", () => {
    const payload = {
      version: 1,
      exportedAt: "2026-01-01T00:00:00.000Z",
      progress: [],
    };
    const result = parseAndValidateImport(JSON.stringify(payload));
    expect(result.ok).toBe(true);
  });
});

describe("applyImport", () => {
  it("overwrite は置換", () => {
    const current: ProgressStore = {
      version: 1,
      items: [
        {
          questionId: "old",
          attempts: 0,
          correctCount: 0,
          incorrectCount: 0,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
      ],
    };
    const incoming = {
      version: 1 as const,
      exportedAt: "2026-02-01T00:00:00.000Z",
      progress: [
        {
          questionId: "new",
          attempts: 1,
          correctCount: 1,
          incorrectCount: 0,
          lastAnsweredAt: "2026-02-01T00:00:00.000Z",
          lastResult: "correct" as const,
          markedForReview: false,
        },
      ],
    };
    const result = applyImport(current, incoming, "overwrite");
    expect(result.items.map((p) => p.questionId)).toEqual(["new"]);
  });

  it("merge は統合", () => {
    const current: ProgressStore = {
      version: 1,
      items: [
        {
          questionId: "q1",
          attempts: 2,
          correctCount: 2,
          incorrectCount: 0,
          lastAnsweredAt: "2026-01-01T00:00:00.000Z",
          lastResult: "correct",
          markedForReview: false,
        },
      ],
    };
    const incoming = {
      version: 1 as const,
      exportedAt: "2026-02-01T00:00:00.000Z",
      progress: [
        {
          questionId: "q1",
          attempts: 1,
          correctCount: 0,
          incorrectCount: 1,
          lastAnsweredAt: "2026-02-01T00:00:00.000Z",
          lastResult: "incorrect" as const,
          markedForReview: false,
        },
      ],
    };
    const result = applyImport(current, incoming, "merge");
    const q1 = result.items.find((p) => p.questionId === "q1");
    expect(q1?.attempts).toBe(3);
    expect(q1?.correctCount).toBe(2);
    expect(q1?.incorrectCount).toBe(1);
  });
});
