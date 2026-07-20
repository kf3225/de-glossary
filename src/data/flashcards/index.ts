import type { FlashCard } from "@/types/flashcard";

// サンプルのフラッシュカード
// 各用語ページからも個別に配置できるが、ここには全体で共有したいカードを置く
export const flashcards: FlashCard[] = [
  {
    id: "fc-tcp",
    front: "TCPとは？",
    back: "信頼性のある通信を提供する、コネクション型のトランスポート層プロトコル。順序保証・再送制御・フロー制御・輻輳制御を持つ。",
    tags: ["network", "tcp"],
  },
  {
    id: "fc-udp",
    front: "UDPとは？",
    back: "コネクションレス型のトランスポート層プロトコル。順序保証や再送制御を持たず、低遅延な通信が特徴。",
    tags: ["network", "udp"],
  },
  {
    id: "fc-http",
    front: "HTTPとは？",
    back: "Webでクライアントとサーバーが通信するためのアプリケーション層プロトコル。典型的にはTCP上で動作する。",
    tags: ["network", "http"],
  },
  {
    id: "fc-db-index",
    front: "データベースのインデックスとは？",
    back: "検索性能を向上させるためのデータ構造。書き込み性能とのトレードオフがある。",
    tags: ["database", "index"],
  },
  {
    id: "fc-acid",
    front: "ACID特性とは？",
    back: "Atomicity（原子性）・Consistency（一貫性）・Isolation（分離性）・Durability（永続性）の頭字母。信頼性のあるトランザクションが満たすべき性質。",
    tags: ["database", "transaction"],
  },
  {
    id: "fc-ts-inference",
    front: "TypeScriptの型推論とは？",
    back: "明示的な型注釈がなくても、代入値や文脈からコンパイラが型を自動的に推測する機能。",
    tags: ["typescript", "type-system"],
  },
];
