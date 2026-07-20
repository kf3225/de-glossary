import type { QuizQuestion } from "@/types/quiz";

// DWHモデリング（ファクトの加算性）関連の問題
export const modelingQuestions = [
  {
    id: "de-fact-additivity-001",
    type: "single-choice" as const,
    prompt: "加算ファクト（additive fact）の説明として正しいものはどれですか？",
    choices: [
      "すべてのディメンションに沿って単純に足し算できる",
      "時間軸に対しては足せない",
      "基本的に足し算できない",
      "必ずパーセンテージで表される",
    ],
    answer: 0,
    explanation:
      "加算ファクトは、日付・店舗・商品など、どのディメンション方向に集計しても単純に合計できる数値項目です。代表例は売上金額、販売数量、原価など。",
    tags: ["data-engineering", "dimensional-modeling", "fact", "additivity"],
    difficulty: "basic" as const,
  },
  {
    id: "de-fact-additivity-002",
    type: "single-choice" as const,
    prompt: "次のうち、加算ファクトとして扱いやすいものはどれですか？",
    choices: ["利益率", "平均単価", "売上金額", "コンバージョン率"],
    answer: 2,
    explanation:
      "売上金額はすべてのディメンションで足し算できます。利益率・平均単価・コンバージョン率は比率や平均であり、非加算ファクトに分類されます。",
    tags: ["data-engineering", "dimensional-modeling", "fact"],
    difficulty: "basic" as const,
  },
  {
    id: "de-fact-additivity-003",
    type: "true-false" as const,
    prompt:
      "在庫残高は、店舗間では足せるが、日付をまたいで足すのは不適切なことが多い。",
    answer: true,
    explanation:
      "在庫残高は半加算ファクトの代表例。店舗ディメンションでは足せますが、時間軸では意味のない合計になるため、最新値・期末値・平均値などで集計します。",
    tags: ["data-engineering", "dimensional-modeling", "semi-additive"],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-fact-additivity-004",
    type: "single-choice" as const,
    prompt:
      "店舗A（売上100万円・利益率10%）と店舗B（売上10万円・利益率50%）の全体利益率を正しく求めるにはどうすればよいですか？",
    choices: [
      "(10% + 50%) ÷ 2 = 30%",
      "10% + 50% = 60%",
      "全体利益額 ÷ 全体売上額 で再計算する",
      "売上が大きい店舗Aの10%を採用する",
    ],
    answer: 2,
    explanation:
      "利益率は非加算ファクトです。単純な平均や加算は不正確で、元の加算ファクト（利益額と売上額）を足し合わせてから全体利益率を再計算する必要があります。",
    tags: ["data-engineering", "dimensional-modeling", "non-additive"],
    difficulty: "advanced" as const,
  },
  {
    id: "de-fact-additivity-005",
    type: "true-false" as const,
    prompt:
      "平均単価だけをファクトテーブルに保存するより、売上金額と販売数量を保存しておく方が、集計時の柔軟性が高い。",
    answer: true,
    explanation:
      "平均単価は非加算ファクトで集計時に単純に足せません。一方、売上金額と販売数量はどちらも加算ファクトなので、任意の粒度で SUM した後に SUM(売上金額)/SUM(販売数量) で正確な平均単価を再計算できます。",
    tags: ["data-engineering", "dimensional-modeling", "fact"],
    difficulty: "advanced" as const,
  },
  {
    id: "de-fact-additivity-006",
    type: "single-choice" as const,
    prompt:
      "ファクトテーブルの1行が「注文明細」であるとき、行数をそのまま足した値は何を表しますか？",
    choices: ["注文数", "注文明細数", "顧客数", "商品数"],
    answer: 1,
    explanation:
      "1注文が複数明細を持つ場合、行数を足した結果は「注文明細数」であり「注文数」とは異なります。注文数が必要な場合は DISTINCT で注文IDを数えるなど、別の集計方法が必要です。",
    tags: ["data-engineering", "dimensional-modeling", "fact", "granularity"],
    difficulty: "intermediate" as const,
  },
] satisfies QuizQuestion[];
