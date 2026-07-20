import { z } from "zod";
import type {
  Difficulty,
  QuizQuestion,
  SingleChoiceQuestion,
} from "@/types/quiz";
import { DIFFICULTIES } from "@/types/quiz";
import type {
  ExportedProgressData,
  LearningSettings,
  ProgressStore,
  QuestionProgress,
} from "@/types/progress";

// 難易度のZodスキーマ
const difficultySchema = z.enum(
  DIFFICULTIES as unknown as [Difficulty, ...Difficulty[]],
);

// タグのスキーマ（空文字は不可）
const tagsSchema = z
  .array(z.string().min(1))
  .min(0)
  .refine((tags) => tags.every((t) => t.trim().length > 0), {
    message: "タグに空文字を含めることはできません",
  });

// 問題のベーススキーマ
const baseQuestionSchema = z.object({
  id: z.string().min(1, "問題IDは必須です"),
  prompt: z.string().min(1, "問題文は必須です"),
  explanation: z.string().min(1, "解説は必須です"),
  tags: tagsSchema,
  difficulty: difficultySchema,
});

// 単一選択問題
const singleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal("single-choice"),
  choices: z.array(z.string().min(1)).min(2, "選択肢は2つ以上必要です"),
  answer: z.number().int().nonnegative(),
});

// 真偽問題
const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal("true-false"),
  answer: z.boolean(),
});

// Union型のスキーマ
export const quizQuestionSchema = z.discriminatedUnion("type", [
  singleChoiceSchema,
  trueFalseSchema,
]);

// 単一選択問題の正解インデックスが選択肢範囲内にあるか追加検証
export function validateSingleChoiceAnswer(
  q: SingleChoiceQuestion,
): true | string {
  if (q.answer < 0 || q.answer >= q.choices.length) {
    return `問題 ${q.id}: 正解インデックスが選択肢の範囲外です (${q.answer} / choices=${q.choices.length})`;
  }
  return true;
}

// 1問題の包括的バリデーション
export function validateQuestion(q: unknown): QuizQuestion {
  // 1. Zodで基本構文を検証
  const parsed = quizQuestionSchema.parse(q);

  // 2. 追加検証（正解インデックスの範囲）
  if (parsed.type === "single-choice") {
    const result = validateSingleChoiceAnswer(parsed);
    if (result !== true) {
      throw new Error(result);
    }
  }
  return parsed;
}

// 問題配列全体のバリデーション
// - 各問題を検証
// - 問題IDの一意性を検証
export function validateQuestions(
  questions: unknown[],
): { ok: true; data: QuizQuestion[] } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const validated: QuizQuestion[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < questions.length; i++) {
    const raw = questions[i];
    try {
      const q = validateQuestion(raw);
      if (seenIds.has(q.id)) {
        errors.push(`重複する問題ID: ${q.id}`);
      } else {
        seenIds.add(q.id);
      }
      validated.push(q);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`問題 #${i}: ${msg}`);
    }
  }

  return errors.length === 0
    ? { ok: true, data: validated }
    : { ok: false, errors };
}

// 重複する問題IDを検出
export function findDuplicateIds(
  questions: readonly QuizQuestion[],
): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const q of questions) {
    if (seen.has(q.id)) dupes.add(q.id);
    seen.add(q.id);
  }
  return [...dupes];
}

// 真偽問題の正解がbooleanか
export function isTrueFalseAnswer(value: unknown): value is boolean {
  return typeof value === "boolean";
}

// ========================================
// 進捗データのバリデーション
// ========================================

const questionProgressSchema: z.ZodType<QuestionProgress> = z.object({
  questionId: z.string().min(1),
  attempts: z.number().int().nonnegative(),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
  lastAnsweredAt: z.string().min(1),
  lastResult: z.enum(["correct", "incorrect"]),
  markedForReview: z.boolean(),
}).superRefine((val, ctx) => {
  if (val.attempts !== val.correctCount + val.incorrectCount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `attempts (${val.attempts}) は correctCount + incorrectCount (${val.correctCount} + ${val.incorrectCount}) と一致する必要があります`,
      path: ["attempts"],
    });
  }
});

export const progressStoreSchema: z.ZodType<ProgressStore> = z.object({
  version: z.literal(1),
  items: z.array(questionProgressSchema),
});

export const exportedProgressDataSchema: z.ZodType<ExportedProgressData> =
  z.object({
    version: z.literal(1),
    exportedAt: z.string().min(1),
    progress: z.array(questionProgressSchema),
  });

const learningSettingsSchema: z.ZodType<LearningSettings> = z.object({
  weakAccuracyThreshold: z.number().min(0).max(100),
});

export function validateProgressStore(
  value: unknown,
): { ok: true; data: ProgressStore } | { ok: false; error: string } {
  const result = progressStoreSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.message };
}

export function validateExportedData(
  value: unknown,
): { ok: true; data: ExportedProgressData } | { ok: false; error: string } {
  const result = exportedProgressDataSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.message };
}

export function validateLearningSettings(
  value: unknown,
): { ok: true; data: LearningSettings } | { ok: false; error: string } {
  const result = learningSettingsSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.message };
}

// 1つのQuestionProgressを検証（整合性チェック含む）
export function validateQuestionProgress(
  value: unknown,
): { ok: true; data: QuestionProgress } | { ok: false; error: string } {
  const result = questionProgressSchema.safeParse(value);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, error: result.error.message };
}
