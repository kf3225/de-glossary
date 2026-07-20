import type {
  OverallStats,
  ProgressStore,
  QuestionProgress,
} from "@/types/progress";
import type { QuizQuestion } from "@/types/quiz";
import { accuracyOf } from "@lib/quiz/review";

// 整数丸め
export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// 正答率（%）を計算して丸める
export function accuracyPercent(
  correct: number,
  attempts: number,
  decimals = 0,
): number {
  if (attempts <= 0) return 0;
  return round((correct / attempts) * 100, decimals);
}

// 回答回数0なら未回答として扱う
export function isUnattempted(p: QuestionProgress | undefined): boolean {
  return !p || p.attempts === 0;
}

// 最近の回答（最終回答日時の降順）
export function sortByRecent(
  items: QuestionProgress[],
): QuestionProgress[] {
  return [...items].sort((a, b) => {
    const ta = Date.parse(a.lastAnsweredAt);
    const tb = Date.parse(b.lastAnsweredAt);
    if (!Number.isFinite(ta)) return 1;
    if (!Number.isFinite(tb)) return -1;
    return tb - ta;
  });
}

// 全体統計を計算
export function computeOverallStats(
  allQuestions: readonly QuizQuestion[],
  store: ProgressStore,
  weakAccuracyThreshold: number,
): OverallStats {
  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let attempted = 0;
  let weak = 0;
  let marked = 0;

  for (const q of allQuestions) {
    const p = store.items.find((x) => x.questionId === q.id);
    if (!p || p.attempts === 0) continue;
    attempted += 1;
    totalAttempts += p.attempts;
    totalCorrect += p.correctCount;
    totalIncorrect += p.incorrectCount;

    if (p.markedForReview) {
      marked += 1;
      weak += 1;
      continue;
    }
    // 一度でも不正解 または 正答率がしきい値未満
    if (p.incorrectCount > 0 || accuracyOf(p) < weakAccuracyThreshold) {
      weak += 1;
    }
  }

  // markedはweakQuestionCountと重複するが、手動設定のみの件数も別途集計
  // 上のループでmarkedをweakにも加算してしまったため、ここで独立して再集計
  let onlyMarked = 0;
  for (const q of allQuestions) {
    const p = store.items.find((x) => x.questionId === q.id);
    if (p?.markedForReview) onlyMarked += 1;
  }

  return {
    registeredQuestionCount: allQuestions.length,
    attemptedQuestionCount: attempted,
    unattemptedQuestionCount: allQuestions.length - attempted,
    totalAttempts,
    totalCorrect,
    totalIncorrect,
    accuracyRate: accuracyPercent(totalCorrect, totalAttempts),
    weakQuestionCount: weak,
    markedCount: onlyMarked,
  };
}
