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
  {
    id: "de-fact-table-types-001",
    type: "single-choice" as const,
    prompt: "トランザクション・ファクトテーブルの説明として正しいものはどれですか？",
    choices: [
      "毎日や毎月など予測可能な間隔で状態を記録する",
      "1つのプロセス進行に合わせて同じ行を何度も更新する",
      "発生した瞬間または直後に完了する離散型イベントを1行として記録し、原則として過去行は更新しない",
      "マイルストーンごとのリードタイム分析に特化している",
    ],
    answer: 2,
    explanation:
      "トランザクション・ファクトは離散型イベントを記録する最も一般的な型です。1行 = 1トランザクション（または1明細）で、追加のみ（append-only）が基本です。",
    tags: [
      "data-engineering",
      "dimensional-modeling",
      "fact-table",
      "transaction",
    ],
    difficulty: "basic" as const,
  },
  {
    id: "de-fact-table-types-002",
    type: "true-false" as const,
    prompt:
      "定期スナップショット・ファクトテーブルの数値（例：日次在庫残高）は、時間軸で足し合わせても意味のある集計になるとは限らない。",
    answer: true,
    explanation:
      "定期スナップショットは半加算（semi-additive）の代表例です。店舗軸などでは足せますが、時間軸で足すと意味のない合計になるため、最新値・期末値・平均値などで集計します。",
    tags: [
      "data-engineering",
      "dimensional-modeling",
      "fact-table",
      "periodic-snapshot",
      "semi-additive",
    ],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-fact-table-types-003",
    type: "single-choice" as const,
    prompt: "累積スナップショット・ファクトテーブルが最も得意とする分析はどれですか？",
    choices: [
      "1件ごとの売上を時系列に蓄積する",
      "毎月末の口座残高の推移を見る",
      "注文→出荷→配達→支払い など、プロセス全体のリードタイムやボトルネックを見る",
      "個々のクリックイベントを分析する",
    ],
    answer: 2,
    explanation:
      "累積スナップショットは発展型イベントを1行で追跡し、各マイルストーンの日付列を持つため、マイルストーン間の日数（リードタイム）や未完了案件を一度に把握できます。",
    tags: [
      "data-engineering",
      "dimensional-modeling",
      "fact-table",
      "accumulating-snapshot",
    ],
    difficulty: "intermediate" as const,
  },
  {
    id: "de-fact-table-types-004",
    type: "true-false" as const,
    prompt:
      "発展型イベントの各マイルストーン（注文・出荷・配達など）は、それぞれ別の離散型イベントとしてモデリングすることもできるが、累積スナップショットで1行にまとめるとプロセス全体の重要指標が見えやすくなる。",
    answer: true,
    explanation:
      "各ステータスを独立したトランザクション・ファクトとして持つことも技術的には可能です。しかし、ステークホルダーが本当に欲しい「全体リードタイム」「ボトルネック工程」「保留案件」は、複数の動詞を1行に束ねた累積スナップショットでこそ一目で分かります。",
    tags: [
      "data-engineering",
      "dimensional-modeling",
      "fact-table",
      "accumulating-snapshot",
    ],
    difficulty: "advanced" as const,
  },
  {
    id: "de-fact-table-types-005",
    type: "single-choice" as const,
    prompt:
      "毎月初に全従業員の人数を記録するテーブルは、3種類のうちどれに該当しますか？",
    choices: [
      "トランザクション・ファクト",
      "定期スナップショット・ファクト",
      "累積スナップショット・ファクト",
      "どれにも該当しない",
    ],
    answer: 1,
    explanation:
      "毎月という一定間隔で状態（従業員数）を計測するため定期スナップショットです。月をまたいで人数を足しても意味がない（半加算）ため、最新月や平均で見るのが自然です。",
    tags: [
      "data-engineering",
      "dimensional-modeling",
      "fact-table",
      "periodic-snapshot",
    ],
    difficulty: "intermediate" as const,
  },
] satisfies QuizQuestion[];
