import type { QuizQuestion } from "@/types/quiz";
import { fundamentalsQuestions } from "./fundamentals";
import { storageQuestions } from "./storage";
import { processingQuestions } from "./processing";

// 全問題を集約する
// 横断クイズや進捗画面はこれを参照する
export const allQuestions: QuizQuestion[] = [
  ...fundamentalsQuestions,
  ...storageQuestions,
  ...processingQuestions,
];

// 問題ID -> 問題 のマップ（高速参照用）
export const questionById = new Map<string, QuizQuestion>(
  allQuestions.map((q) => [q.id, q]),
);

// IDで1問を取得
export function findQuestion(id: string): QuizQuestion | undefined {
  return questionById.get(id);
}
