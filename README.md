# de-glossary

個人用の **データエンジニアリング** 学習サイトです。
[Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) + [Svelte](https://svelte.dev/) + [TypeScript](https://www.typescriptlang.org/) で構築された静的サイトで、GitHub Pagesへデプロイして利用します。

学習履歴はブラウザの `localStorage` にのみ保存され、サーバーへは送信されません。

---

## 公開サイト

次のURLで公開しています。

> **https://kf3225.github.io/de-glossary/**

Pull Request のプレビューやローカル確認以外は、上記URLを開けばいつでも学習できます。

---

## 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [使用技術](#使用技術)
- [必要な環境](#必要な環境)
- [ローカル開発](#ローカル開発)
- [品質チェック](#品質チェック)
- [プレビュー](#プレビュー)
- [コンテンツ追加](#コンテンツ追加)
- [学習履歴について](#学習履歴について)
- [GitHub Pages設定](#github-pages設定)
- [`site` と `base` の設計](#site-と-base-の設計)
- [GitHub Actions](#github-actions)
- [公開に関する注意](#公開に関する注意)
- [トラブルシューティング](#トラブルシューティング)
- [実装の制約](#実装の制約)

---

## 概要

データエンジニアリングの概念を Markdown/MDX で整理し、各用語ページに確認クイズを配置しています。
さらに横断クイズ、苦手問題モード、フラッシュカード、進捗画面、学習履歴のバックアップ/復元を備えています。

扱う領域の例:

- **基礎**: ETL/ELT、データウェアハウス（DWH）
- **ストレージ**: データレイク、データベースインデックス
- **処理モデル**: バッチ処理、ストリーム処理

- 静的サイトとして生成されるため、GitHub Pagesでホストできます
- バックエンド・データベースは使用しません
- 学習履歴は利用者のブラウザにのみ保存されます
- 用語集・問題データはGitで管理します

> **重要**: GitHub Pagesへデプロイしたコンテンツは**公開情報**として扱ってください。秘密情報・個人情報・業務機密は絶対にMDXやソースコードへ書かないでください。

## 主な機能

- 用語集（MDXで記述、タグ・難易度・別名・関連用語付き）
- ページ固有のクイズ（MDX内にSvelteコンポーネントとして配置）
- 横断クイズ（タグ・難易度・出題数で絞り込み）
- 苦手問題モード（一度でも間違えた問題、正答率80%未満、手動復習対象）
- フラッシュカード（表裏切替・シャッフル・キーボード操作）
- 進捗画面（全体統計・最近の回答）
- 学習履歴のエクスポート/インポート/リセット（マージ・上書き対応）

## 使用技術

| 用途 | 技术 |
|---|---|
| サイト生成 | Astro 5 + Starlight + MDX |
| インタラクティブUI | Svelte 5 |
| 言語 | TypeScript |
| テスト | Vitest |
| パッケージマネージャ | pnpm |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions |

## 必要な環境

- **Node.js**: >= 22.0.0 （本リポジトリのCIでは22 LTSを使用）
- **pnpm**: 9.x（`package.json` の `packageManager` で固定）
- **Git**
- **GitHub アカウント**（Pages公開・CI/CD実行用）

`package.json` の `engines` と `packageManager` でバージョンを明示しています。

## ローカル開発

```bash
pnpm install
pnpm dev
```

アクセス先:

```text
http://localhost:4321/
```

> ローカルの dev サーバーでは `base` が `/` 扱いになります（Astroの仕様）。
> GitHub Pages用の `/de-glossary/` 付きURLで確認したい場合は、後述の `pnpm preview` を使います。

## 品質チェック

```bash
pnpm check    # astro check（型チェック・.astro検証）
pnpm test     # vitest run（ユニットテスト）
pnpm build    # astro build（本番ビルド）
pnpm validate:questions  # 問題データの検証スクリプト（重複ID等）
```

一括実行:

```bash
pnpm run ci   # check + test + build （※ pnpm ci は別コマンドなので run 必須）
```

## プレビュー

```bash
pnpm build
pnpm preview
```

`astro.config.mjs` で `base` を設定している場合、プレビューURLにも `base` が付与されます。

```text
http://localhost:4321/de-glossary/
```

## コンテンツ追加

### 用語ページの追加

`src/content/docs/glossary/<カテゴリ>/<term>.mdx` を作成します。

現在のカテゴリ構成:

```text
src/content/docs/glossary/
├─ fundamentals/   # ETL/ELT, DWH 等
├─ storage/        # データレイク, インデックス 等
└─ processing/     # バッチ, ストリーム 等
```

frontmatter の例:

```yaml
---
title: データレイク
description: 構造化・非構造化を問わず生データを蓄積する中央リポジトリ
tags:
  - data-engineering
  - data-lake
  - storage
aliases:
  - Data Lake
difficulty: intermediate
related:
  - data-warehouse
---
```

- `title`: 必須。ページタイトル・サイドバー表示に使われます
- `description`: 必須。メタ情報・一覧表示に使われます
- `tags`: 任意。小文字・英数字・ハイフン推奨（例: `data-engineering`、`data-lake`）
- `aliases`: 任意。別名一覧
- `difficulty`: 任意。`basic` / `intermediate` / `advanced` のいずれか
- `related`: 任意。関連用語（同じカテゴリ内のファイル名から拡張子を除いたものを推奨）

本文には Astro/Starlight のMDX記法が使えます。必要に応じて `## 概要`、`## 要点`、`## 具体例`、`## 関連用語`、`## 確認問題` などの見出しを使います。

### クイズ問題の追加（横断クイズ用）

横断クイズに含めたい問題は `src/data/quizzes/` 以下にTypeScriptファイルとして追加します。現在の構成:

- `fundamentals.ts` （ETL/ELT、DWH）
- `storage.ts` （データレイク、インデックス）
- `processing.ts` （バッチ、ストリーム）

例: `src/data/quizzes/storage.ts`

```ts
import type { QuizQuestion } from "@/types/quiz";

export const storageQuestions = [
  {
    id: "de-data-lake-001", // ← 全体で一意
    type: "single-choice",
    prompt: "...",
    choices: ["A", "B", "C", "D"],
    answer: 0,
    explanation: "...",
    tags: ["data-engineering", "data-lake"],
    difficulty: "intermediate",
  },
] satisfies QuizQuestion[];
```

集約は `src/data/quizzes/index.ts` で行います。

```ts
import { fundamentalsQuestions } from "./fundamentals";
import { storageQuestions } from "./storage";
import { processingQuestions } from "./processing";

export const allQuestions: QuizQuestion[] = [
  ...fundamentalsQuestions,
  ...storageQuestions,
  ...processingQuestions,
];
```

#### 問題IDの付け方

- 全体で一意にする
- カテゴリプレフィックス＋連番を推奨（例: `de-dwh-001`、`de-db-index-001`）
- **問題IDを変更すると過去の進捗と紐付かなくなります**
- `pnpm validate:questions` で重複を検出できます

### MDX内へのクイズ配置

用語ページの中に、そのページ限定のクイズを置けます。

```mdx
import Quiz from "../../../../components/quiz/Quiz.svelte";

<Quiz
  client:load
  quizId="etl-elt-page"
  questions={[ ... ]}
/>
```

`quizId` はそのページ内で一意にします。`questions` は `QuizQuestion[]` に適合する配列です。

> MDX内に直接書いた問題は、現在の実装では横断クイズの対象にはなりません。
> 横断クイズにも出題したい場合は、必ず `src/data/quizzes/` のTSファイルへ追加してください。

### フラッシュカードの追加

全カード共有なら `src/data/flashcards/index.ts` に追加します。

```ts
export const flashcards: FlashCard[] = [
  { id: "fc-etl-elt", front: "ETL と ELT の違いは？", back: "..." },
];
```

用語ページ固有のカードを置きたい場合は、MDX内で直接使います。

```mdx
import FlashCards from "../../../../components/flashcards/FlashCards.svelte";

<FlashCards client:load cards={[ ... ]} />
```

### タグ・難易度・関連用語

- タグ: 小文字・英数字・ハイフンを推奨（例: `data-engineering`、`etl`）
- 難易度: `basic` / `intermediate` / `advanced` の3段階固定
  - 画面表示は `基礎` / `中級` / `上級` に自動変換されます
- 関連用語: frontmatter の `related` にスラッグを書くか、本文で直接 `[テキスト](../other/)` のようにリンクします

## 学習履歴について

- **保存場所**: 利用者のブラウザの `localStorage`
- **同期**: 別ブラウザ・別端末には自動同期されません
- **環境差**: ローカル (`http://localhost:4321`) とGitHub Pages (`https://...`) では別々の保存領域になります
- **URL変更時**: 公開URLが変わると以前のURLの履歴は引き継がれません
- **消失リスク**: ブラウザデータ削除・シークレットモード終了等で失われる可能性があります
- **バックアップ**: 設定画面からJSONファイルとしてエクスポート/インポートできます

バックアップ手順:

1. 設定画面（`/settings/`）を開く
2. 「エクスポート」で `personal-learning-progress-YYYY-MM-DD.json` をダウンロード
3. 安全な場所（ローカルストレージやクラウドストレージ）へ保存

復元手順:

1. 設定画面の「インポート」でJSONファイルを選択
2. 「マージ」か「上書き」を選択
3. 「インポートを実行」を押す

リセット:

1. 設定画面の「学習履歴のリセット」で確認チェックを入れる
2. 「履歴を削除」を押す

## GitHub Pages設定

本リポジトリでは、すでに GitHub Pages が **Source = GitHub Actions** として有効化済みです。
`main` ブランチへpushすると、自動的にビルド・デプロイが走り、次のURLで公開されます。

> **https://kf3225.github.io/de-glossary/**

新しいリポジトリで同様に設定したい場合は、次の手順を実施します:

1. GitHubリポジトリを開く
2. `Settings` → `Pages`
3. `Build and deployment` → `Source` を **`GitHub Actions`** に設定
   - または `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow` を実行
4. `main` ブランチへpushする（またはPRをマージする）
5. リポジトリの `Actions` タブで `Deploy` ワークフローを確認

> GitHub UIの名称は変更される可能性があります。実行時点の公式ドキュメントと画面を確認してください。

### Actions権限

- リポジトリ全体の権限は「読み取りのみ（Read repository contents permission）」を推奨します
- ワークフロー内の `permissions` で必要な権限だけを付与しています（`pages: write`、`id-token: write` など）

### Branch protection（推奨）

個人運用でも次を推奨します:

- `main` への直接pushを制限
- Pull Requestを必須にする
- CI成功をマージ条件にする

※ GitHub Freeプランでは一部制限があります。

## `site` と `base` の設計

`astro.config.mjs` で次のように設定しています。

```js
const githubUser = "kf3225";
const repositoryName = "de-glossary";
const isUserSite =
  String(repositoryName) === `${githubUser}.github.io`;

export default defineConfig({
  site: `https://${githubUser}.github.io`,
  base: isUserSite ? undefined : `/${repositoryName}`,
  output: "static",
  trailingSlash: "always",
  ...
});
```

### 通常のプロジェクトページ（本リポジトリ）

```text
GitHubユーザー名: kf3225
リポジトリ名: de-glossary

site:    https://kf3225.github.io
base:    /de-glossary
公開URL: https://kf3225.github.io/de-glossary/
```

### ユーザーサイト（<user>.github.io）

もしリポジトリ名が `kf3225.github.io` の場合:

```text
site:    https://kf3225.github.io
base:    設定しない（undefined）
公開URL: https://kf3225.github.io/
```

> `site` には **origin のみ** を指定します。リポジトリ名を `site` に含めないでください。
> リポジトリ名は `base` だけに指定します。

### 他のアカウントへフォークした場合

`astro.config.mjs` の `githubUser` と `repositoryName` を書き換えてください。
GitHub Pages の Source も新リポジトリで再度 `GitHub Actions` に設定する必要があります。

## GitHub Actions

### `ci.yml` （Pull Request CI）

**トリガー**:
- `main` ブランチを対象とするPull Request
- GitHub上からの手動実行（`workflow_dispatch`）

**ステップ**:
1. `pnpm install --frozen-lockfile`
2. `pnpm validate:questions`
3. `pnpm check`
4. `pnpm test`
5. `pnpm build`

**権限**: `contents: read` のみ
**並行制御**: 同じPRの古い実行をキャンセル

### `deploy.yml` （本番デプロイ）

**トリガー**:
- `main` ブランチへのpush
- GitHub上からの手動実行

**ジョブ構成**:
- `build`: 品質チェック → `astro build` → `dist` を成果物としてアップロード
- `deploy`: `build` に依存。GitHub Pages Environmentで `dist` を公開

**権限**（ジョブごと）:
- `build`: `contents: read`、`pages: write`、`id-token: write`
- `deploy`: `pages: write`、`id-token: write`

**並行制御**: GitHub Pagesのデプロイ競合を防ぐため `pages` グループで直列化

**手動デプロイ**: GitHubのActionsタブ → `Deploy` ワークフロー → `Run workflow`

**失敗時の確認箇所**:
1. Actionsタブで該当ワークフローのログを開く
2. `pnpm install --frozen-lockfile` が失敗していないか（`pnpm-lock.yaml` がコミット済みか）
3. `pnpm check` / `pnpm test` / `pnpm build` のいずれかが失敗していないか
4. リポジトリ設定で `Source` が `GitHub Actions` になっているか
5. `deploy` ジョブの権限が正しいか

### `pnpm-lock.yaml` が必要な理由

CI/CDでは `pnpm install --frozen-lockfile` を使います。
ロックファイルがないとインストールすらできず、また依存関係の意図しない更新を防ぐために必須です。

## 公開に関する注意

- **GitHub Pages上のコンテンツは公開情報です**
- パスワード・APIキー・アクセストークン・秘密鍵・個人情報・業務機密を絶対に書かないでください
- クライアント側コード（Svelteコンポーネント等）に秘密情報を埋め込まないでください
- `PUBLIC_` で始まる環境変数はビルド成果物に埋め込まれ、ブラウザから読める可能性があります
- 学習メモも公開される前提で書いてください

## トラブルシューティング

### CSSやJavaScriptが404になる

- `astro.config.mjs` の `base` が正しいか確認してください
- リポジトリ直下を前提とした絶対URL（`/style.css` など）を独自に書いていないか確認してください

### 内部リンクがおかしい

- Markdown/MDX内のリンクは相対URL（`./other/` など）を使うか、Starlightのリンク機能を使ってください
- `/quiz/` のようなルート相対URLはGitHub Pagesではドメイン直下を指してしまいます

### GitHub Pagesで画面が真っ白になる

- リポジトリ設定で `Pages` → `Source` が `GitHub Actions` になっているか確認
- デプロイのActionsログでエラーがないか確認
- ブラウザの開発者ツールでコンソール・ネットワークエラーを確認

### `site` または `base` が間違っている

- `astro.config.mjs` の `githubUser` と `repositoryName` を実際のリポジトリに合わせてください
- フォークした場合は必ず書き換えてください

### GitHub PagesのSourceがGitHub Actionsになっていない

- リポジトリの `Settings` → `Pages` → `Build and deployment` → `Source` を `GitHub Actions` に変更してください
- または `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow` を実行

### Actionsの権限不足

- `Settings` → `Actions` → `General` → `Workflow permissions` で「Read and write permissions」ではなく、ワークフロー内の `permissions` を使う運用を推奨します
- `deploy.yml` で `pages: write` と `id-token: write` を明示しています

### `pnpm-lock.yaml` がない

- ローカルで `pnpm install` を実行して生成してください
- 生成された `pnpm-lock.yaml` をコミットしてください

### `pnpm install --frozen-lockfile` が失敗する

- ローカルで `pnpm install` を実行し直して `pnpm-lock.yaml` を更新してください
- ロックファイルと `package.json` の整合性が取れていない可能性があります

### `pnpm check` が失敗する

- TypeScriptの型エラー、または `.astro` ファイルの検証エラーです
- ログを確認して該当箇所を修正してください

### `pnpm test` が失敗する

- Vitestのエラーです
- ログを確認して該当テスト・実装を修正してください

### `pnpm build` が失敗する

- Astroのビルドエラーです
- MDXの構文エラーや、存在しない import がないか確認してください

### ローカルとGitHub Pagesで学習履歴が異なる

- これは仕様です。`localStorage` はオリジンごとに独立しています
- 設定画面からエクスポート/インポートで移行できます

### ブラウザデータ削除後に履歴が消えた

- これも仕様です。事前にエクスポートしておいてください

## 実装の制約

- 問題IDを変更すると過去の進捗と紐付かなくなります
- MDX内に直接書いた問題は横断クイズの対象になりません（`src/data/quizzes/` のTSファイルに記述してください）
- 学習履歴はブラウザ単位・URL単位で独立します
- `localStorage` が無効な環境（シークレットモード等）では履歴保存ができません（サイト自体は利用可能です）

---

## ライセンス

個人利用を想定したリポジトリです。外部公開する場合は適切なライセンスを検討してください。
