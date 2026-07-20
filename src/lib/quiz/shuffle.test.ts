import { describe, expect, it } from "vitest";
import { shuffle } from "@lib/quiz/shuffle";

describe("shuffle", () => {
  it("元配列を変更しない", () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    shuffle(input);
    expect(input).toEqual(snapshot);
  });

  it("要素数が変わらない", () => {
    const input = [1, 2, 3, 4, 5, 6, 7];
    const shuffled = shuffle(input);
    expect(shuffled.length).toBe(input.length);
  });

  it("要素が欠落しない・重複しない（要素の集合が同じ）", () => {
    const input = [1, 2, 3, 4, 5];
    const shuffled = shuffle(input);
    expect(new Set(shuffled)).toEqual(new Set(input));
  });

  it("空配列を渡すと空配列", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("1要素配列はそのまま返る", () => {
    expect(shuffle([42])).toEqual([42]);
  });
});
