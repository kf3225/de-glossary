import type { QuizQuestion } from "@/types/quiz";

// 処理モデル（バッチ、ストリーム）関連の問題
export const processingQuestions = [
  {
    id: "de-batch-stream-001",
    type: "single-choice" as const,
    prompt: "ストリーム処理がバッチ処理に比べて優れている点はどれですか？",
    choices: [
      "レイテンシが低く、イベント到着後にすぐ結果を出せる",
      "単純な集計において常に高スループットである",
      "ジョブの再実行が容易である",
      "ストレージコストが常に安い",
    ],
    answer: 0,
    explanation:
      "ストリーム処理はイベント到着ごとに継続的に処理するため、バッチに比べて低レイテンシです。反面、大規模な再処理はバッチの方が向いています。",
    tags: ["data-engineering", "stream", "batch", "processing"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-batch-stream-002",
    type: "true-false" as const,
    prompt: "バッチ処理は、夜間に1日分のデータを一括で集計するようなユースケースに向いている。",
    answer: true,
    explanation:
      "スループット重視で、ある程度まとまったデータ量をまとめて処理する用途ではバッチが効率的です。",
    tags: ["data-engineering", "batch", "processing"],
    difficulty: "basic" as const,
  },
  {
    id: "de-batch-stream-003",
    type: "single-choice" as const,
    prompt: "次のうち、分散型ストリーム／バッチ処理エンジンとしてよく使われるのはどれですか？",
    choices: ["Apache Spark", "nginx", "memcached", "PostgreSQL"],
    answer: 0,
    explanation:
      "Apache Spark はバッチ・ストリーム両方を扱える分散処理エンジンとして、データエンジニアリングで広く使われています。",
    tags: ["data-engineering", "spark", "processing"],
    difficulty: "intermediate" as const,
  },
] satisfies QuizQuestion[];
