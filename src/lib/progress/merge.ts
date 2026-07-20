import { PROGRESS_SCHEMA_VERSION } from "@lib/constants";
import type { ProgressStore, QuestionProgress } from "@/types/progress";
import { laterIso } from "@lib/date/formatDate";
import { validateQuestionProgress } from "@lib/quiz/validation";

// 2つのQuestionProgressをマージ
// - attempts/correctCount/incorrectCount は合算
// - lastAnsweredAt はより新しい方
// - lastResult は採用した最新日時に対応する値
// - markedForReview はどちらかが true なら true
export function mergeProgress(
  a: QuestionProgress,
  b: QuestionProgress,
): QuestionProgress {
  if (a.questionId !== b.questionId) {
    throw new Error(
      `異なる問題IDの進捗はマージできません: ${a.questionId} != ${b.questionId}`,
    );
  }
  const ta = Date.parse(a.lastAnsweredAt);
  const tb = Date.parse(b.lastAnsweredAt);
  const bIsNewer = Number.isFinite(tb) && (!Number.isFinite(ta) || tb > ta);

  const merged: QuestionProgress = {
    questionId: a.questionId,
    attempts: a.attempts + b.attempts,
    correctCount: a.correctCount + b.correctCount,
    incorrectCount: a.incorrectCount + b.incorrectCount,
    lastAnsweredAt: laterIso(a.lastAnsweredAt, b.lastAnsweredAt),
    lastResult: bIsNewer ? b.lastResult : a.lastResult,
    markedForReview: a.markedForReview || b.markedForReview,
  };
  // 整合性を検証（attempts = correct + incorrect）
  const result = validateQuestionProgress(merged);
  if (!result.ok) {
    throw new Error(
      `マージ結果が不正です (${a.questionId}): ${result.error}`,
    );
  }
  return merged;
}

// ストア全体をマージ
export function mergeStores(
  current: ProgressStore,
  incoming: ProgressStore,
): ProgressStore {
  const map = new Map<string, QuestionProgress>();

  for (const item of current.items) {
    map.set(item.questionId, item);
  }

  for (const item of incoming.items) {
    const existing = map.get(item.questionId);
    if (existing) {
      map.set(item.questionId, mergeProgress(existing, item));
    } else {
      // 新規追加の前に検証
      const result = validateQuestionProgress(item);
      if (!result.ok) {
        throw new Error(
          `インポートデータの問題 ${item.questionId} が不正です: ${result.error}`,
        );
      }
      map.set(item.questionId, item);
    }
  }

  return {
    version: PROGRESS_SCHEMA_VERSION,
    items: [...map.values()],
  };
}

// 上書き: 既存データを破棄してincomingで置換
export function overwriteStore(incoming: ProgressStore): ProgressStore {
  // すべて検証
  for (const item of incoming.items) {
    const result = validateQuestionProgress(item);
    if (!result.ok) {
      throw new Error(
        `インポートデータの問題 ${item.questionId} が不正です: ${result.error}`,
      );
    }
  }
  return {
    version: PROGRESS_SCHEMA_VERSION,
    items: incoming.items.map((x) => ({ ...x })),
  };
}
