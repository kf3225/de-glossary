// 日時のフォーマット
// 保存はISO 8601、表示は日本語読みやすい形式

// ISO 8601 形式で現在日時を取得
export function nowIso(): string {
  return new Date().toISOString();
}

// 無効な日時でクラッシュしないようにする
export function isValidIsoDate(value: string): boolean {
  if (typeof value !== "string" || value.length === 0) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

// 表示用: "2026年7月20日 19:30" のような形式
// Intl.DateTimeFormat を使用し、無効な日時はフォールバックする
export function formatDateTime(iso: string): string {
  if (!isValidIsoDate(iso)) return "無効な日時";
  try {
    const formatter = new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tokyo",
    });
    return formatter.format(new Date(iso));
  } catch {
    return iso;
  }
}

// 表示用: 日付のみ "2026-07-20"
export function formatDateForFilename(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 2つのISO日時を比較し、より新しい方を返す
export function laterIso(a: string, b: string): string {
  const ta = Date.parse(a);
  const tb = Date.parse(b);
  if (!Number.isFinite(ta)) return b;
  if (!Number.isFinite(tb)) return a;
  return ta >= tb ? a : b;
}
