// 問題ごとの学習履歴。localStorage に保存する
export type QuestionProgress = {
  /** 問題ID（QuizQuestion.id と対応） */
  questionId: string;
  /** 回答回数（= correctCount + incorrectCount） */
  attempts: number;
  /** 正答数 */
  correctCount: number;
  /** 不正解数 */
  incorrectCount: number;
  /** 最終回答日時（ISO 8601） */
  lastAnsweredAt: string;
  /** 最終回答結果 */
  lastResult: "correct" | "incorrect";
  /** 手動の復習対象設定 */
  markedForReview: boolean;
};

// 進捗データ全体
export type ProgressStore = {
  /** スキーマバージョン */
  version: 1;
  /** 全問題の進捗リスト */
  items: QuestionProgress[];
};

// エクスポート形式（JSONファイルに書き出す内容）
export type ExportedProgressData = {
  version: 1;
  exportedAt: string;
  progress: QuestionProgress[];
};

// インポート時のマージ方式
export type ImportMode = "overwrite" | "merge";

// 直近の回答履歴（進捗画面の「最近の回答」表示用）
export type RecentAnswer = {
  questionId: string;
  result: "correct" | "incorrect";
  answeredAt: string;
};

// 全体統計
export type OverallStats = {
  registeredQuestionCount: number;
  attemptedQuestionCount: number;
  unattemptedQuestionCount: number;
  totalAttempts: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracyRate: number;
  weakQuestionCount: number;
  markedCount: number;
};

// 学習設定
export type LearningSettings = {
  /** 苦手問題とみなす正答率のしきい値（%、未満を苦手とする） */
  weakAccuracyThreshold: number;
};

export const DEFAULT_SETTINGS: LearningSettings = {
  weakAccuracyThreshold: 80,
};
