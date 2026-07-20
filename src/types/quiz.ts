// 難易度は3段階に統一
export type Difficulty = "basic" | "intermediate" | "advanced";

export const DIFFICULTIES: readonly Difficulty[] = [
  "basic",
  "intermediate",
  "advanced",
] as const;

// 画面表示用の日本語ラベル
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  basic: "基礎",
  intermediate: "中級",
  advanced: "上級",
};

// 問題形式のベース
export type BaseQuestion = {
  /** 全体で一意の問題ID。回答履歴との紐付けに使用する */
  id: string;
  /** 問題文 */
  prompt: string;
  /** 解説 */
  explanation: string;
  /** タグ（小文字・英数字・ハイフン推奨） */
  tags: string[];
  /** 難易度 */
  difficulty: Difficulty;
};

// 単一選択問題
export type SingleChoiceQuestion = BaseQuestion & {
  type: "single-choice";
  /** 選択肢（2つ以上） */
  choices: string[];
  /** 正解の選択肢インデックス（0始まり） */
  answer: number;
};

// 真偽問題
export type TrueFalseQuestion = BaseQuestion & {
  type: "true-false";
  /** 正解（true=正しい / false=誤り） */
  answer: boolean;
};

// 判別可能なUnion型。将来の拡張はここに追加する
export type QuizQuestion = SingleChoiceQuestion | TrueFalseQuestion;

// クイズ全体の識別子（MDXに複数のクイズを置く場合などに使用）
export type Quiz = {
  id: string;
  questions: QuizQuestion[];
};
