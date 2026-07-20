// URL 生成を一元化するヘルパ
// GitHub Pages のサブパス（base）を考慮する
const BASE_URL: string = import.meta.env.BASE_URL ?? "/";

// base を付与したパスを生成する
// - 先頭のスラッシュは正規化する
// - 末尾にはスラッシュを付けない（呼び出し側で制御）
export function withBase(path: string): string {
  if (!path) return BASE_URL;

  // 外部URLはそのまま返す
  if (/^https?:\/\//i.test(path) || path.startsWith("//")) {
    return path;
  }

  // `#anchor` や `?query` のみのケースはそのまま
  if (path.startsWith("#") || path.startsWith("?")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const normalizedBase = BASE_URL.endsWith("/")
    ? BASE_URL.slice(0, -1)
    : BASE_URL;

  return `${normalizedBase}/${normalizedPath}`;
}
