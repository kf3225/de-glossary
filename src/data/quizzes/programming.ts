import type { QuizQuestion } from "@/types/quiz";

// プログラミング（TypeScript中心）関連のサンプル問題
export const programmingQuestions = [
  {
    id: "pg-ts-001",
    type: "single-choice" as const,
    prompt: "TypeScriptの型推論に関する説明として正しいものはどれですか？",
    choices: [
      "明示的に型注釈を書かない場合、コンパイラが文脈から型を推測する",
      "型推論は一切行われない",
      "型推論は実行時に行われる",
      "型推論を有効にするには常に `any` を指定する必要がある",
    ],
    answer: 0,
    explanation:
      "TypeScriptは代入値や戻り値の文脈から型を推論します。そのため、すべてに型注釈を書かなくても型安全が保たれます。",
    tags: ["typescript", "type-system", "programming"],
    difficulty: "basic" as const,
  },
  {
    id: "pg-ts-002",
    type: "true-false" as const,
    prompt: "TypeScriptの `unknown` 型は `any` 型と同じで、一切の型チェックを行わない。",
    answer: false,
    explanation:
      "`unknown` は安全なトップ型で、実際に使用する前に型を絞り込む必要があります。`any` は型チェックを無効にしますが、`unknown` は型安全を保ちます。",
    tags: ["typescript", "type-system", "programming"],
    difficulty: "advanced" as const,
  },
  {
    id: "pg-ts-003",
    type: "single-choice" as const,
    prompt: "判別可能なUnion（Discriminated Union）を機能させるためのキーとなるものはどれですか？",
    choices: ["共通のリテラル型プロパティ", "数値型のプロパティ", "任意のboolean", "クラスデコレーター"],
    answer: 0,
    explanation:
      "判別可能なUnionは、各メンバが同じ名前のリテラル型プロパティ（typeタグなど）を持つことで、TypeScriptが型を安全に絞り込めます。",
    tags: ["typescript", "type-system", "programming"],
    difficulty: "intermediate" as const,
  },
] satisfies QuizQuestion[];
