// Fisher–Yates shuffle の非破壊実装
// 元配列は書き換えず、要素数・要素の重複がないことを保証する

function isCryptoAvailable(): boolean {
  return (
    typeof globalThis !== "undefined" &&
    typeof globalThis.crypto?.getRandomValues === "function"
  );
}

function randomIntExclusive(max: number): number {
  if (isCryptoAvailable()) {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    // 一様分布のために拒否再サンプリング
    const limit = Math.floor(0x100000000 / max) * max;
    let r = buf[0];
    while (r >= limit) {
      globalThis.crypto.getRandomValues(buf);
      r = buf[0];
    }
    return r % max;
  }
  return Math.floor(Math.random() * max);
}

// 配列をシャッフルした新しい配列を返す（元は変更しない）
export function shuffle<T>(input: readonly T[]): T[] {
  if (!Array.isArray(input)) return [];
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIntExclusive(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
