import { IMPORT_FILE_SIZE_LIMIT, PROGRESS_SCHEMA_VERSION } from "@lib/constants";
import { formatDateForFilename, nowIso } from "@lib/date/formatDate";
import type {
  ExportedProgressData,
  ImportMode,
  ProgressStore,
} from "@/types/progress";
import {
  mergeStores,
  overwriteStore,
} from "@lib/progress/merge";
import {
  validateExportedData,
  validateQuestionProgress,
} from "@lib/quiz/validation";

// エクスポート用のJSON文字列を生成
export function buildExportJson(store: ProgressStore): string {
  const payload: ExportedProgressData = {
    version: 1,
    exportedAt: nowIso(),
    progress: store.items.map((p) => ({ ...p })),
  };
  return JSON.stringify(payload, null, 2);
}

// ダウンロード用のファイル名
export function buildExportFileName(date: Date = new Date()): string {
  return `personal-learning-progress-${formatDateForFilename(date)}.json`;
}

// ブラウザでダウンロードを実行
export function downloadProgressJson(store: ProgressStore): boolean {
  if (typeof window === "undefined") return false;
  try {
    const json = buildExportJson(store);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildExportFileName();
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // 少し待ってから解放（一部ブラウザ対策）
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  } catch (e) {
    console.error("進捗データのエクスポートに失敗しました:", e);
    return false;
  }
}

// インポートの事前検証結果
export type ImportValidation =
  | { ok: true; data: ExportedProgressData; summary: ImportSummary }
  | { ok: false; error: string };

export type ImportSummary = {
  count: number;
  version: number;
  exportedAt: string;
};

// ファイルサイズ検証
export function assertFileSize(bytes: number): true | string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "ファイルサイズを取得できませんでした。";
  }
  if (bytes > IMPORT_FILE_SIZE_LIMIT) {
    return `ファイルサイズが大きすぎます（上限 ${
      Math.floor(IMPORT_FILE_SIZE_LIMIT / 1024 / 1024)
    }MB）。`;
  }
  return true;
}

// 文字列からJSONをパース＆検証
export function parseAndValidateImport(text: string): ImportValidation {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: `JSONのパースに失敗しました: ${msg}`,
    };
  }

  const result = validateExportedData(parsed);
  if (!result.ok) {
    return {
      ok: false,
      error: `インポートするデータの形式が正しくありません: ${result.error}`,
    };
  }

  // 各項目を再検証（整合性）
  for (const item of result.data.progress) {
    const r = validateQuestionProgress(item);
    if (!r.ok) {
      return {
        ok: false,
        error: `問題 ${item.questionId} の進捗データが不正です: ${r.error}`,
      };
    }
  }

  // 同一 questionId が複数回含まれていないか
  const seen = new Set<string>();
  for (const item of result.data.progress) {
    if (seen.has(item.questionId)) {
      return {
        ok: false,
        error: `インポートデータ内で問題IDが重複しています: ${item.questionId}`,
      };
    }
    seen.add(item.questionId);
  }

  return {
    ok: true,
    data: result.data,
    summary: {
      count: result.data.progress.length,
      version: result.data.version,
      exportedAt: result.data.exportedAt,
    },
  };
}

// インポートの実行
export function applyImport(
  current: ProgressStore,
  incoming: ExportedProgressData,
  mode: ImportMode,
): ProgressStore {
  const incomingStore: ProgressStore = {
    version: PROGRESS_SCHEMA_VERSION,
    items: incoming.progress.map((p) => ({ ...p })),
  };
  if (mode === "overwrite") {
    return overwriteStore(incomingStore);
  }
  return mergeStores(current, incomingStore);
}
