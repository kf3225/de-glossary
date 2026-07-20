import type { QuizQuestion } from "@/types/quiz";

// データエンジニアリング基礎（ETL/ELT、DWH）関連の問題
export const fundamentalsQuestions = [
  {
    id: "de-etl-elt-001",
    type: "single-choice" as const,
    prompt: "ETL と ELT の最大の違いは何ですか？",
    choices: [
      "Transform を行うタイミング",
      "データの暗号化方式",
      "ストレージのコスト計算方法",
      "ネットワークプロトコルの違い",
    ],
    answer: 0,
    explanation:
      "ETL は抽出後・格納前に変換し、ELT はターゲットへ格納した後に変換します。",
    tags: ["data-engineering", "etl", "elt", "pipeline"],
    difficulty: "basic" as const,
  },
  {
    id: "de-etl-elt-002",
    type: "true-false" as const,
    prompt: "ELT はターゲットとなるクラウドDWHの計算能力を活用して変換を行うのが一般的である。",
    answer: true,
    explanation:
      "現代のDWH（Snowflake、BigQuery、Redshift など）は強力なSQLエンジンを持つため、生データを先にロードしてSQLで変換するELTが広く採用されています。",
    tags: ["data-engineering", "elt", "data-warehouse"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-etl-elt-003",
    type: "single-choice" as const,
    prompt: "次のうち、ELT パイプラインで一般的に変換（Transform）ツールとして使われるのはどれですか？",
    choices: ["dbt", "nginx", "Kubernetes", "Redis"],
    answer: 0,
    explanation:
      "dbt（data build tool）は、DWH上のSQLで変換を定義・実行する、ELT アーキテクチャの定番ツールです。",
    tags: ["data-engineering", "elt", "dbt"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-dwh-001",
    type: "single-choice" as const,
    prompt: "データウェアハウスが最も最適化されている処理はどれですか？",
    choices: [
      "トランザクション処理（OLTP）",
      "分析処理（OLAP）",
      "画像処理",
      "ストリーミング配信",
    ],
    answer: 1,
    explanation:
      "DWH は大量データの集計・分析（OLAP）向けに設計されており、列指向ストレージや MPP アーキテクチャを採用しています。",
    tags: ["data-engineering", "data-warehouse", "olap"],
    difficulty: "basic" as const,
  },
  {
    id: "de-dwh-002",
    type: "true-false" as const,
    prompt: "DWH は、1件ごとの UPDATE/DELETE をOLTPシステムと同等に高速に処理することを主目的として設計されている。",
    answer: false,
    explanation:
      "DWH はバッチロードと大量スキャンを主目的としており、1件更新のレイテンシよりも集計スループットを優先します。",
    tags: ["data-engineering", "data-warehouse"],
    difficulty: "intermediate" as const,
  },
] satisfies QuizQuestion[];
