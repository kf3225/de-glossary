import type { Difficulty, QuizQuestion } from "@/types/quiz";

// 横断クイズの絞り込み条件
export type QuizFilter = {
  tags?: string[]; // 指定タグのいずれかを含む問題
  difficulties?: Difficulty[]; // 指定難易度のいずれかに一致する問題
  questionIds?: string[]; // 問題IDで直接指定（苦手問題モード等）
};

// 1つの問題がフィルタ条件を満たすか
export function matchesFilter(
  question: QuizQuestion,
  filter: QuizFilter,
): boolean {
  // 問題ID指定がある場合は ID 一致のみで判定
  if (filter.questionIds && filter.questionIds.length > 0) {
    return filter.questionIds.includes(question.id);
  }

  // タグ絞り込み: 指定タグのいずれかを含む場合に一致
  if (filter.tags && filter.tags.length > 0) {
    const hasTag = filter.tags.some((t) => question.tags.includes(t));
    if (!hasTag) return false;
  }

  // 難易度絞り込み
  if (filter.difficulties && filter.difficulties.length > 0) {
    if (!filter.difficulties.includes(question.difficulty)) return false;
  }

  return true;
}

// 条件で絞り込んだ問題一覧を返す
export function filterQuestions(
  questions: readonly QuizQuestion[],
  filter: QuizFilter,
): QuizQuestion[] {
  return questions.filter((q) => matchesFilter(q, filter));
}

// 指定数だけランダムに抽出（重複なし）
export function pickQuestions(
  questions: readonly QuizQuestion[],
  filter: QuizFilter,
  count: number | "all",
  shuffleFn: <T>(arr: readonly T[]) => T[],
): QuizQuestion[] {
  const filtered = filterQuestions(questions, filter);
  const shuffled = shuffleFn(filtered);
  if (count === "all") return shuffled;
  if (!Number.isFinite(count) || count <= 0) return [];
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 全問題からタグ一覧を取得（重複排除、小文字化）
export function collectTags(questions: readonly QuizQuestion[]): string[] {
  const set = new Set<string>();
  for (const q of questions) {
    for (const tag of q.tags) {
      const normalized = tag.toLowerCase().trim();
      if (normalized) set.add(normalized);
    }
  }
  return [...set].sort();
}

// 全問題から難易度一覧を取得（出現順）
export function collectDifficulties(
  questions: readonly QuizQuestion[],
): Difficulty[] {
  const set = new Set<Difficulty>();
  for (const q of questions) set.add(q.difficulty);
  return [...set];
}
