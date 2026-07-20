// 問題データの整合性を検証するスクリプト
// `pnpm validate:questions` で実行
// CI で `pnpm test` より前に実行される
//
// 注意: tsx 経由で実行するため、@lib や @types のエイリアスは解決されません。
// 相対パスでインポートしています。
import { allQuestions } from "./index";
import {
  findDuplicateIds,
  validateQuestions,
} from "../../lib/quiz/validation";

function main(): void {
  const result = validateQuestions(allQuestions as unknown[]);
  if (!result.ok) {
    console.error("問題データの検証に失敗しました:");
    for (const err of result.errors) {
      console.error(" -", err);
    }
    process.exit(1);
  }

  const dupes = findDuplicateIds(result.data);
  if (dupes.length > 0) {
    console.error("重複する問題IDが存在します:");
    for (const id of dupes) {
      console.error(" -", id);
    }
    process.exit(1);
  }

  console.log(`OK: ${result.data.length} 問の問題データを検証しました。`);
}

main();
