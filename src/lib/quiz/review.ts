import type { QuestionProgress } from "@/types/progress";

// 正答率を計算（回答回数0なら0）
export function accuracyOf(progress: QuestionProgress | undefined): number {
  if (!progress || progress.attempts === 0) return 0;
  return (progress.correctCount / progress.attempts) * 100;
}

// 回答回数0の問題は苦手問題に含めない（要件）
// それ以外は次のいずれかに該当する場合を苦手問題とする
// - 一度でも不正解になった
// - 正答率がしきい値未満
// - ユーザーが手動で復習対象に設定した
export function isWeakQuestion(
  progress: QuestionProgress | undefined,
  weakAccuracyThreshold: number,
): boolean {
  if (!progress) return false;

  // 手動復習設定は最優先（回答回数0でも対象にする）
  if (progress.markedForReview) return true;

  // 回答回数0は苦手問題にしない
  if (progress.attempts === 0) return false;

  // 一度でも不正解
  if (progress.incorrectCount > 0) return true;

  // 正答率がしきい値未満（不正解0でも満たない場合）
  return accuracyOf(progress) < weakAccuracyThreshold;
}

// 復習対象か（手動設定のみ）
export function isMarkedForReview(
  progress: QuestionProgress | undefined,
): boolean {
  return progress?.markedForReview ?? false;
}
