import type { FlashCard } from "@/types/flashcard";

// データエンジニアリング学習用のサンプルフラッシュカード
// 各用語ページからも個別に配置できるが、ここには全体で共有したいカードを置く
export const flashcards: FlashCard[] = [
  {
    id: "fc-etl-elt",
    front: "ETL と ELT の違いは？",
    back: "ETL は抽出後に外部エンジンで変換してから格納。ELT は生データを先にターゲット（DWH等）へ格納し、ターゲット上でSQL等で変換する。クラウドDWHの性能向上でELTが主流化。",
    tags: ["data-engineering", "etl", "elt"],
  },
  {
    id: "fc-dwh",
    front: "データウェアハウス（DWH）とは？",
    back: "分析用途（OLAP）に最適化されたデータ基盤。列指向ストレージやMPPアーキテクチャを採用し、大量データの集計・BIを高速化する。代表例: Snowflake, BigQuery, Redshift。",
    tags: ["data-engineering", "data-warehouse"],
  },
  {
    id: "fc-data-lake",
    front: "データレイクとは？",
    back: "構造化・非構造化を問わず、生データをオリジナル形式で大量蓄積する中央リポジトリ。Schema-on-Read が基本。S3/GCS等のオブジェクトストレージ上に構築されることが多い。",
    tags: ["data-engineering", "data-lake"],
  },
  {
    id: "fc-db-index",
    front: "データベースインデックスとは？",
    back: "検索を高速化する補助的なデータ構造（B+Treeやハッシュ等）。書き込み時の更新コストやストレージ消費とのトレードオフがある。",
    tags: ["data-engineering", "database", "index"],
  },
  {
    id: "fc-acid",
    front: "ACID特性とは？",
    back: "Atomicity（原子性）・Consistency（一貫性）・Isolation（分離性）・Durability（永続性）。信頼性のあるトランザクションが満たすべき4つの性質。",
    tags: ["data-engineering", "database", "transaction"],
  },
  {
    id: "fc-batch-stream",
    front: "バッチ処理とストリーム処理の違いは？",
    back: "バッチは一定期間蓄積したデータを一括処理（高スループット向き）。ストリームは到着したデータを継続処理（低レイテンシ向き）。",
    tags: ["data-engineering", "batch", "stream"],
  },
];
