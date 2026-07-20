import { describe, expect, it } from "vitest";
import {
  collectDifficulties,
  collectTags,
  filterQuestions,
  matchesFilter,
  pickQuestions,
} from "@lib/quiz/filter";
import type { QuizQuestion } from "@/types/quiz";
import { shuffle } from "@lib/quiz/shuffle";

const questions: QuizQuestion[] = [
  {
    id: "q1",
    type: "single-choice",
    prompt: "prompt1",
    explanation: "exp1",
    tags: ["network", "tcp"],
    difficulty: "basic",
    choices: ["a", "b"],
    answer: 0,
  },
  {
    id: "q2",
    type: "true-false",
    prompt: "prompt2",
    explanation: "exp2",
    tags: ["network", "udp"],
    difficulty: "intermediate",
    answer: true,
  },
  {
    id: "q3",
    type: "single-choice",
    prompt: "prompt3",
    explanation: "exp3",
    tags: ["database"],
    difficulty: "advanced",
    choices: ["x", "y", "z"],
    answer: 2,
  },
];

describe("filterQuestions / matchesFilter", () => {
  it("フィルタ指定なしはすべて一致", () => {
    expect(filterQuestions(questions, {}).length).toBe(3);
  });

  it("タグ単体で絞り込める", () => {
    expect(filterQuestions(questions, { tags: ["tcp"] }).map((q) => q.id)).toEqual(["q1"]);
  });

  it("複数タグは OR で絞り込む", () => {
    expect(filterQuestions(questions, { tags: ["tcp", "database"] }).map((q) => q.id)).toEqual([
      "q1",
      "q3",
    ]);
  });

  it("難易度で絞り込める", () => {
    expect(
      filterQuestions(questions, { difficulties: ["basic", "intermediate"] }).map((q) => q.id),
    ).toEqual(["q1", "q2"]);
  });

  it("questionIds 指定は ID 一致のみ", () => {
    expect(filterQuestions(questions, { questionIds: ["q2", "q3"] }).map((q) => q.id)).toEqual([
      "q2",
      "q3",
    ]);
  });

  it("一致なしは空配列", () => {
    expect(filterQuestions(questions, { tags: ["not-exist"] })).toEqual([]);
  });

  it("matchesFilter は外部URLに影響されない", () => {
    expect(matchesFilter(questions[0]!, { tags: ["network"] })).toBe(true);
  });
});

describe("pickQuestions", () => {
  it("指定数だけ抽出し、重複がない", () => {
    const picked = pickQuestions(questions, {}, 2, shuffle);
    expect(picked.length).toBe(2);
    expect(new Set(picked.map((q) => q.id)).size).toBe(2);
  });

  it("指定数が全体より大きい場合は存在する分だけ", () => {
    const picked = pickQuestions(questions, {}, 99, shuffle);
    expect(picked.length).toBe(3);
  });

  it("count=0 は空配列", () => {
    expect(pickQuestions(questions, {}, 0, shuffle)).toEqual([]);
  });

  it("count='all' は全件", () => {
    expect(pickQuestions(questions, {}, "all", shuffle).length).toBe(3);
  });

  it("条件不一致は空配列", () => {
    expect(pickQuestions(questions, { tags: ["not-exist"] }, 5, shuffle)).toEqual([]);
  });
});

describe("collectTags / collectDifficulties", () => {
  it("タグ一覧を重複なしで返す", () => {
    const tags = collectTags(questions);
    expect(tags.sort()).toEqual(["database", "network", "tcp", "udp"]);
  });

  it("難易度一覧を返す", () => {
    expect(collectDifficulties(questions).sort()).toEqual([
      "advanced",
      "basic",
      "intermediate",
    ]);
  });
});
