import { STORAGE_KEYS, PROGRESS_SCHEMA_VERSION } from "@lib/constants";
import { DEFAULT_SETTINGS, type LearningSettings, type ProgressStore, type QuestionProgress } from "@/types/progress";
import { validateLearningSettings, validateProgressStore } from "@lib/quiz/validation";

// localStorage が利用可能か
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    if (!("localStorage" in window)) return false;
    const probe = "__pls_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

// 空のストア
export function emptyProgressStore(): ProgressStore {
  return { version: PROGRESS_SCHEMA_VERSION, items: [] };
}

// 読み込み: 安全にパースし、失敗時は空ストア
export function loadProgress(): { data: ProgressStore; available: boolean } {
  if (!isLocalStorageAvailable()) {
    return { data: emptyProgressStore(), available: false };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return { data: emptyProgressStore(), available: true };
    const parsed = JSON.parse(raw);
    const result = validateProgressStore(parsed);
    if (result.ok) return { data: result.data, available: true };
    // 不正データの場合は上書きせず空ストアを返す（利用者に見せる）
    console.error("学習履歴の読み込みに失敗しました:", result.error);
    return { data: emptyProgressStore(), available: true };
  } catch (e) {
    console.error("学習履歴の読み込みに失敗しました:", e);
    return { data: emptyProgressStore(), available: true };
  }
}

// 保存: 失敗時は例外を投げず false を返す
export function saveProgress(store: ProgressStore): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    // 保存前に整合性を再検証
    const result = validateProgressStore(store);
    if (!result.ok) {
      console.error("進捗データの検証に失敗しました:", result.error);
      return false;
    }
    window.localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(store));
    return true;
  } catch (e) {
    console.error("学習履歴の保存に失敗しました:", e);
    return false;
  }
}

// 指定問題IDの進捗を取得
export function getProgressByQuestionId(
  store: ProgressStore,
  questionId: string,
): QuestionProgress | undefined {
  return store.items.find((p) => p.questionId === questionId);
}

// 進捗を追加または更新
// 追加の上書き保存に失敗した場合は false を返す
export function upsertProgress(
  store: ProgressStore,
  progress: QuestionProgress,
): { store: ProgressStore; saved: boolean } {
  const items = store.items.filter((p) => p.questionId !== progress.questionId);
  const newStore: ProgressStore = {
    version: PROGRESS_SCHEMA_VERSION,
    items: [...items, progress],
  };
  const saved = saveProgress(newStore);
  return { store: newStore, saved };
}

// 指定問題IDの復習設定を切替
export function setMarkedForReview(
  store: ProgressStore,
  questionId: string,
  markedForReview: boolean,
): { store: ProgressStore; saved: boolean } {
  const items = store.items.map((p) =>
    p.questionId === questionId ? { ...p, markedForReview } : p,
  );
  const newStore: ProgressStore = {
    version: PROGRESS_SCHEMA_VERSION,
    items,
  };
  const saved = saveProgress(newStore);
  return { store: newStore, saved };
}

// 1回の回答を記録
export function recordAnswer(
  store: ProgressStore,
  questionId: string,
  result: "correct" | "incorrect",
  answeredAt: string,
): { store: ProgressStore; saved: boolean } {
  const existing = getProgressByQuestionId(store, questionId);
  const updated: QuestionProgress = existing
    ? {
        ...existing,
        attempts: existing.attempts + 1,
        correctCount:
          result === "correct" ? existing.correctCount + 1 : existing.correctCount,
        incorrectCount:
          result === "incorrect"
            ? existing.incorrectCount + 1
            : existing.incorrectCount,
        lastAnsweredAt: answeredAt,
        lastResult: result,
      }
    : {
        questionId,
        attempts: 1,
        correctCount: result === "correct" ? 1 : 0,
        incorrectCount: result === "incorrect" ? 1 : 0,
        lastAnsweredAt: answeredAt,
        lastResult: result,
        markedForReview: false,
      };
  return upsertProgress(store, updated);
}

// 全削除
export function clearProgress(): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.progress);
    return true;
  } catch (e) {
    console.error("学習履歴の削除に失敗しました:", e);
    return false;
  }
}

// ========================================
// 設定
// ========================================

export function loadSettings(): {
  data: LearningSettings;
  available: boolean;
} {
  if (!isLocalStorageAvailable()) {
    return { data: DEFAULT_SETTINGS, available: false };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return { data: DEFAULT_SETTINGS, available: true };
    const parsed = JSON.parse(raw);
    const result = validateLearningSettings(parsed);
    if (result.ok) return { data: result.data, available: true };
    return { data: DEFAULT_SETTINGS, available: true };
  } catch {
    return { data: DEFAULT_SETTINGS, available: true };
  }
}

export function saveSettings(settings: LearningSettings): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    const result = validateLearningSettings(settings);
    if (!result.ok) return false;
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}
