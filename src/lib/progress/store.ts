import { writable, type Readable, derived } from "svelte/store";
import {
  DEFAULT_SETTINGS,
  type LearningSettings,
  type ProgressStore,
  type QuestionProgress,
} from "@/types/progress";
import {
  emptyProgressStore,
  isLocalStorageAvailable,
  loadProgress,
  loadSettings,
  recordAnswer as storageRecordAnswer,
  saveProgress,
  saveSettings,
  setMarkedForReview as storageSetMarked,
  clearProgress as storageClear,
} from "@lib/progress/storage";
import { nowIso } from "@lib/date/formatDate";

// 初期化済みフラグ
let initialized = false;
// ストレージ利用可否（一度判定したらキャッシュ）
let storageAvailable = false;

// グローバルな進捗ストア
const progressInternal = writable<ProgressStore>(emptyProgressStore());

// ストレージエラー（保存失敗）をUIへ伝えるためのフラグ
const storageErrorInternal = writable<boolean>(false);

// 設定ストア
const settingsInternal = writable<LearningSettings>(DEFAULT_SETTINGS);

// ブラウザでのみ初期化する
export function initProgressStore(): void {
  if (initialized) return;
  initialized = true;
  storageAvailable = isLocalStorageAvailable();
  if (storageAvailable) {
    const { data } = loadProgress();
    progressInternal.set(data);
    const { data: settings } = loadSettings();
    settingsInternal.set(settings);
  } else {
    storageErrorInternal.set(true);
  }
}

// 強制再読み込み
export function reloadProgress(): void {
  if (!isLocalStorageAvailable()) {
    storageErrorInternal.set(true);
    return;
  }
  const { data } = loadProgress();
  progressInternal.set(data);
  const { data: settings } = loadSettings();
  settingsInternal.set(settings);
}

// 読み取り専用ストアを公開
export const progressStore: Readable<ProgressStore> = { subscribe: progressInternal.subscribe };
export const settingsStore: Readable<LearningSettings> = { subscribe: settingsInternal.subscribe };
export const storageError: Readable<boolean> = { subscribe: storageErrorInternal.subscribe };

// 1回の回答を記録してストアへ反映
export function recordAnswer(
  questionId: string,
  result: "correct" | "incorrect",
): void {
  let saved = true;
  progressInternal.update((store) => {
    const { store: newStore, saved: ok } = storageRecordAnswer(
      store,
      questionId,
      result,
      nowIso(),
    );
    saved = ok;
    return newStore;
  });
  storageErrorInternal.set(!saved);
}

// 手動復習設定を切替
export function toggleMarkedForReview(
  questionId: string,
  markedForReview: boolean,
): void {
  let saved = true;
  progressInternal.update((store) => {
    const { store: newStore, saved: ok } = storageSetMarked(
      store,
      questionId,
      markedForReview,
    );
    saved = ok;
    return newStore;
  });
  storageErrorInternal.set(!saved);
}

// インポートやリセットなど、外部からストアを上書き
export function replaceProgress(store: ProgressStore): boolean {
  const ok = saveProgress(store);
  progressInternal.set(store);
  storageErrorInternal.set(!ok);
  return ok;
}

// 設定を保存
export function updateSettings(settings: LearningSettings): boolean {
  const ok = saveSettings(settings);
  if (ok) settingsInternal.set(settings);
  return ok;
}

// 全削除
export function clearAllProgress(): boolean {
  const ok = storageClear();
  progressInternal.set(emptyProgressStore());
  storageErrorInternal.set(!ok);
  return ok;
}

// 指定問題の進捗を取得するderivedストア
export function questionProgress(questionId: string): Readable<QuestionProgress | undefined> {
  return derived(progressStore, ($store) =>
    $store.items.find((p) => p.questionId === questionId),
  );
}
