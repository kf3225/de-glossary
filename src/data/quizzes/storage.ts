import type { QuizQuestion } from "@/types/quiz";

// ストレージ（データレイク、インデックス）関連の問題
export const storageQuestions = [
  {
    id: "de-data-lake-001",
    type: "single-choice" as const,
    prompt: "データレイクの特徴として最も適切なものはどれですか？",
    choices: [
      "事前に定義したスキーマにデータを当てはめて保存する",
      "構造化・非構造化を問わず、生データをオリジナル形式で蓄積する",
      "トランザクションのACID特性に特化する",
      "1件ごとの UPDATE を高速化する",
    ],
    answer: 1,
    explanation:
      "データレイクは Schema-on-Read を基本とし、後で使うときまでスキーマを確定させず多様なデータをそのまま保存します。",
    tags: ["data-engineering", "data-lake", "storage"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-data-lake-002",
    type: "true-false" as const,
    prompt: "データレイクに保存するデータは、Parquet のような列指向フォーマットよりも必ずCSVを使う必要がある。",
    answer: false,
    explanation:
      "データレイクはフォーマットを問いません。分析効率を考慮して Parquet/ORC などの列指向フォーマットがよく使われます。",
    tags: ["data-engineering", "data-lake", "parquet"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-db-index-001",
    type: "single-choice" as const,
    prompt: "データベースのインデックスに関する説明として正しいものはどれですか？",
    choices: [
      "データを必ず圧縮する",
      "検索性能を向上させるが、書き込み性能を下げる可能性がある",
      "データの整合性を保証する機能である",
      "バックアップ用途の機能である",
    ],
    answer: 1,
    explanation:
      "インデックスは検索を高速にしますが、書き込み時に更新が発生するため、書き込み性能とのトレードオフがあります。",
    tags: ["data-engineering", "database", "index", "performance"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-db-index-002",
    type: "true-false" as const,
    prompt: "複合インデックス (a, b, c) がある場合、WHERE b = ? だけの検索でも必ずインデックスが使用される。",
    answer: false,
    explanation:
      "複合インデックスは左端プレフィックスが重要で、先頭列 a を条件に含めないとインデックスは効きにくくなります。",
    tags: ["data-engineering", "database", "index"],
    difficulty: "advanced" as const,
  },
  {
    id: "de-db-index-003",
    type: "single-choice" as const,
    prompt: "ACID特性に含まれないものはどれですか？",
    choices: [
      "原子性 (Atomicity)",
      "一貫性 (Consistency)",
      "可用性 (Availability)",
      "分離性 (Isolation)",
    ],
    answer: 2,
    explanation:
      "ACID は Atomicity・Consistency・Isolation・Durability の頭文字です。Availability（可用性）は含まれません。",
    tags: ["data-engineering", "database", "transaction", "acid"],
    difficulty: "advanced" as const,
  },
] satisfies QuizQuestion[];
