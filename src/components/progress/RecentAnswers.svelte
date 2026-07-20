<script lang="ts">
  import type { QuestionProgress } from "@/types/progress";
  import type { QuizQuestion } from "@/types/quiz";
  import { formatDateTime } from "@lib/date/formatDate";
  import { accuracyOf } from "@lib/quiz/review";
  import { round } from "@lib/progress/statistics";
  import { findQuestion } from "@data/quizzes";

  export let items: QuestionProgress[] = [];
  export let limit = 10;

  // 最終回答日時の降順で上位N件
  $: sorted = [...items]
    .filter((p) => p.attempts > 0)
    .sort((a, b) => {
      const ta = Date.parse(a.lastAnsweredAt);
      const tb = Date.parse(b.lastAnsweredAt);
      if (!Number.isFinite(ta)) return 1;
      if (!Number.isFinite(tb)) return -1;
      return tb - ta;
    })
    .slice(0, limit);

  function findQ(id: string): QuizQuestion | undefined {
    return findQuestion(id);
  }
</script>

<section class="recent-answers" aria-label="最近の回答">
  {#if sorted.length === 0}
    <p class="empty">まだ回答履歴がありません。</p>
  {:else}
    <table class="recent-table">
      <thead>
        <tr>
          <th>問題</th>
          <th>結果</th>
          <th>正答率</th>
          <th>回答日時</th>
        </tr>
      </thead>
      <tbody>
        {#each sorted as p}
          {@const q = findQ(p.questionId)}
          <tr>
            <td class="prompt-cell">
              {q ? q.prompt : `(削除された問題: ${p.questionId})`}
            </td>
            <td class={`result ${p.lastResult}`}>
              {p.lastResult === "correct" ? "正解" : "不正解"}
            </td>
            <td>{round(accuracyOf(p))}%</td>
            <td>{formatDateTime(p.lastAnsweredAt)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  .recent-answers {
    margin: 1rem 0;
  }
  .empty {
    padding: 1rem;
    text-align: center;
    color: var(--sl-color-gray-3);
    border: 1px dashed var(--sl-color-gray-5);
    border-radius: 0.5rem;
  }
  .recent-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  .recent-table th,
  .recent-table td {
    padding: 0.5rem;
    border-bottom: 1px solid var(--sl-color-gray-5);
    text-align: left;
    vertical-align: top;
  }
  .recent-table th {
    background: var(--sl-color-gray-7);
    font-weight: 600;
  }
  .prompt-cell {
    max-width: 24rem;
    word-break: break-word;
  }
  .result.correct {
    color: var(--sl-color-green);
    font-weight: 600;
  }
  .result.incorrect {
    color: var(--sl-color-red);
    font-weight: 600;
  }
</style>
