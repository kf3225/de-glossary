import type { QuizQuestion } from "@/types/quiz";

// ネットワーク関連のサンプル問題
// 問題IDは全体で一意にする
export const networkingQuestions = [
  {
    id: "net-tcp-001",
    type: "single-choice" as const,
    prompt: "TCPの特徴として正しいものはどれですか？",
    choices: [
      "順序保証と再送制御がある",
      "名前解決を行う",
      "IPアドレスを自動割り当てする",
      "常にUDPより高速である",
    ],
    answer: 0,
    explanation:
      "TCPはコネクション型のプロトコルで、順序保証、再送制御、フロー制御、輻輳制御を提供します。",
    tags: ["network", "tcp", "transport-layer"],
    difficulty: "basic" as const,
  },
  {
    id: "net-tcp-002",
    type: "true-false" as const,
    prompt: "TCPはコネクションを確立してからデータを送信する。",
    answer: true,
    explanation:
      "TCPは3ウェイハンドシェイクでコネクションを確立してからデータ送信を行います。",
    tags: ["network", "tcp", "transport-layer"],
    difficulty: "basic" as const,
  },
  {
    id: "net-udp-001",
    type: "single-choice" as const,
    prompt: "UDPがTCPに比べて優れている点は何ですか？",
    choices: [
      "信頼性が高い",
      "順序保証がある",
      "オーバーヘッドが小さく遅延が少ない",
      "必ずデータが届く",
    ],
    answer: 2,
    explanation:
      "UDPはコネクション確立や再送処理を行わないため、オーバーヘッドが小さくリアルタイム性が求められる用途に向いています。",
    tags: ["network", "udp", "transport-layer"],
    difficulty: "intermediate" as const,
  },
  {
    id: "net-udp-002",
    type: "true-false" as const,
    prompt: "UDPはデータ到達保証を持たない。",
    answer: true,
    explanation:
      "UDPはベストエフォート型で、データ損失や到達順序の保証を持ちません。必要ならアプリケーション層で制御します。",
    tags: ["network", "udp", "transport-layer"],
    difficulty: "basic" as const,
  },
  {
    id: "net-http-001",
    type: "single-choice" as const,
    prompt: "HTTP/1.1でホスト名に基づくバーチャルホストを実現するヘッダーはどれですか？",
    choices: ["User-Agent", "Host", "Referer", "Accept-Language"],
    answer: 1,
    explanation:
      "HostヘッダーはHTTP/1.1で必須で、1つのIPアドレスで複数のホスト名を扱うバーチャルホストを可能にします。",
    tags: ["network", "http", "web"],
    difficulty: "intermediate" as const,
  },
  {
    id: "net-http-002",
    type: "true-false" as const,
    prompt: "HTTPSはHTTPをTLSで暗号化したプロトコルである。",
    answer: true,
    explanation:
      "HTTPSはHTTPの通信をTLS（かつてはSSL）で暗号化し、盗聴・改ざん・なりすましを防ぎます。",
    tags: ["network", "http", "https", "security"],
    difficulty: "basic" as const,
  },
] satisfies QuizQuestion[];
