// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

// GitHub Pages の公開情報
// - 通常のプロジェクトページ: https://<user>.github.io/<repo>/
// - ユーザーサイト (<user>.github.io リポジトリ): https://<user>.github.io/
const githubUser = "kf3225";
const repositoryName = "de-glossary";
// リテラル型推論による「比較不可」警告を避けるため String() で比較する
const isUserSite =
  String(repositoryName) === `${githubUser}.github.io`;

export default defineConfig({
  // site には origin のみを指定する（リポジトリ名を含めない）
  site: `https://${githubUser}.github.io`,
  // base にはサブパスを指定する（ユーザーサイトの場合は undefined）
  base: isUserSite ? undefined : `/${repositoryName}`,
  output: "static",
  trailingSlash: "always",
  integrations: [
    svelte(),
    starlight({
      title: "データエンジニアリング学習サイト",
      description: "用語集とクイズで学ぶ、個人用のデータエンジニアリング学習サイト",
      defaultLocale: "ja",
      locales: {
        ja: { label: "日本語", lang: "ja" },
      },
      social: {
        github: `https://github.com/${githubUser}/${repositoryName}`,
      },
      sidebar: [
        { label: "ホーム", link: "/" },
        {
          label: "用語集",
          items: [
            { label: "概要", link: "/glossary/" },
            { label: "基礎", link: "/glossary/fundamentals/" },
            { label: "ストレージ", link: "/glossary/storage/" },
            { label: "処理モデル", link: "/glossary/processing/" },
          ],
        },
        { label: "クイズ", link: "/quiz/" },
        { label: "苦手問題", link: "/quiz/review/" },
        { label: "フラッシュカード", link: "/flashcards/" },
        { label: "学習状況", link: "/progress/" },
        { label: "設定", link: "/settings/" },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
    mdx(),
  ],
});
