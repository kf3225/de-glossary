// localStorage のキーは一元管理する
// 形式: <アプリ名>:<用途>:<スキーマバージョン>
export const STORAGE_KEYS = {
  progress: "personal-learning-site:progress:v1",
  settings: "personal-learning-site:settings:v1",
} as const;

// 進捗データのスキーマバージョン
export const PROGRESS_SCHEMA_VERSION = 1 as const;

// インポートファイルのサイズ上限（5MB）
// 個人用の進捗JSONとして不自然に巨大なファイルを拒否するため
export const IMPORT_FILE_SIZE_LIMIT = 5 * 1024 * 1024;

// 出題数の選択肢
export const QUIZ_COUNT_OPTIONS = [5, 10, 20] as const;

// 正答率を整数丸めした際の小数点以下桁数
export const ACCURACY_DECIMALS = 0;

// 苦手問題とみなすデフォルトしきい値（%）
export const DEFAULT_WEAK_ACCURACY_THRESHOLD = 80;

// 学習履歴保存失敗時のメッセージ
export const STORAGE_ERROR_MESSAGE =
  "学習履歴をブラウザに保存できませんでした。このページを閉じると、今回の履歴が失われる可能性があります。";

// 条件不一致時のメッセージ
export const NO_QUESTIONS_MESSAGE = "条件に一致する問題がありません。";
