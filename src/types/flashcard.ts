// フラッシュカード1枚
export type FlashCard = {
  /** カードID（一意） */
  id: string;
  /** 表面（用語や質問） */
  front: string;
  /** 裏面（説明や答え） */
  back: string;
  /** 関連タグ（任意） */
  tags?: string[];
};
