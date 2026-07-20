import type { QuizQuestion } from "@/types/quiz";

// データベース関連のサンプル問題
export const databaseQuestions = [
  {
    id: "db-index-001",
    type: "single-choice" as const,
    prompt: "データベースのインデックスに関する説明として正しいものはどれですか？",
    choices: [
      "データを必ず圧縮する",
      "検索性能を向上させるが書き込み性能を下げる可能性がある",
      "データの整合性を保証する機能である",
      "バックアップ用途の機能である",
    ],
    answer: 1,
    explanation:
      "インデックスは検索（特にWHERE句）を高速にしますが、書き込み時にインデックス更新が発生するため書き込み性能とのトレードオフがあります。",
    tags: ["database", "index", "performance"],
    difficulty: "intermediate" as const,
  },
  {
    id: "db-index-002",
    type: "true-false" as const,
    prompt: "インデックスを多数作成すればするほど、常にアプリケーション全体が高速になる。",
    answer: false,
    explanation:
      "インデックスは検索を高速にしますが、書き込み時のコストとストレージ消費が増えます。必要な列にのみ適切に設定すべきです。",
    tags: ["database", "index", "performance"],
    difficulty: "intermediate" as const,
  },
  {
    id: "db-tx-001",
    type: "single-choice" as const,
    prompt: "ACID特性に含まれないものはどれですか？",
    choices: ["原子性 (Atomicity)", "一貫性 (Consistency)", "可用性 (Availability)", "分離性 (Isolation)"],
    answer: 2,
    explanation:
      "ACIDはAtomicity・Consistency・Isolation・Durabilityの頭文字です。Availability（可用性）は含まれません（これはBASEやCAPで扱われる概念です）。",
    tags: ["database", "transaction", "acid"],
    difficulty: "advanced" as const,
  },
] satisfies QuizQuestion[];
