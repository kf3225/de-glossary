<script lang="ts">
  import type { QuestionProgress } from "@/types/progress";
  import type { QuizQuestion } from "@/types/quiz";
  import { DIFFICULTY_LABELS } from "@/types/quiz";
  import { allQuestions } from "@data/quizzes";
  import { accuracyOf, isWeakQuestion } from "@lib/quiz/review";
  import { round } from "@lib/progress/statistics";
  import { formatDateTime } from "@lib/date/formatDate";
  import {
    initProgressStore,
    progressStore,
    settingsStore,
    toggleMarkedForReview,
  } from "@lib/progress/store";
  import QuizLauncher from "@components/quiz/QuizLauncher.svelte";

  initProgressStore();

  // ストアから直接購読（MDX側からデータを渡す必要はない）
  $: progress = $progressStore.items;
  $: weakAccuracyThreshold = $settingsStore.weakAccuracyThreshold;

  // 苦手問題だけのクイズモード
  let reviewSessionActive = false;

  $: weakQuestions = allQuestions.filter((q) => {
    const p = progress.find((x) => x.questionId === q.id);
    return isWeakQuestion(p, weakAccuracyThreshold);
  });

  function findProgress(id: string): QuestionProgress | undefined {
    return progress.find((p) => p.questionId === id);
  }
</script>

<section class="review-list" aria-label="苦手問題">
  <div class="actions">
    <button
      type="button"
      class="btn primary"
      disabled={weakQuestions.length === 0}
      on:click={() => (reviewSessionActive = true)}
    >
      苦手問題でクイズ開始 ({weakQuestions.length}問)
    </button>
  </div>

  {#if reviewSessionActive}
    <QuizLauncher
      title="苦手問題クイズ"
      filterOverride={{ questionIds: weakQuestions.map((q) => q.id) }}
      hideConditions={true}
    />
    <div class="actions">
      <button type="button" class="btn" on:click={() => (reviewSessionActive = false)}>
        一覧に戻る
      </button>
    </div>
  {:else if weakQuestions.length === 0}
    <p class="empty">苦手問題はありません。よくできています！</p>
  {:else}
    <table class="review-table">
      <thead>
        <tr>
          <th>問題</th>
          <th>難易度</th>
          <th>タグ</th>
          <th>回答回数</th>
          <th>正答率</th>
          <th>最終回答</th>
          <th>復習対象</th>
        </tr>
      </thead>
      <tbody>
        {#each weakQuestions as q (q.id)}
          {@const p = findProgress(q.id)}
          <tr>
            <td class="prompt-cell">{q.prompt}</td>
            <td>{DIFFICULTY_LABELS[q.difficulty]}</td>
            <td class="tags-cell">
              {#each q.tags as t}<span class="tag">{t}</span>{/each}
            </td>
            <td>{p?.attempts ?? 0}</td>
            <td>
              {p && p.attempts > 0 ? `${round(accuracyOf(p))}%` : "未回答"}
            </td>
            <td>{p ? formatDateTime(p.lastAnsweredAt) : "未回答"}</td>
            <td>
              <label class="toggle">
                <input
                  type="checkbox"
                  checked={p?.markedForReview ?? false}
                  on:change={(e) =>
                    toggleMarkedForReview(q.id, e.currentTarget.checked)}
                />
                <span>復習対象</span>
              </label>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style>
  .review-list {
    margin: 1rem 0;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin: 0.75rem 0;
  }
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid var(--sl-color-gray-5);
    background: var(--sl-color-gray-6);
    color: inherit;
    cursor: pointer;
    font: inherit;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn.primary {
    background: var(--sl-color-text-accent);
    border-color: var(--sl-color-text-accent);
    color: var(--sl-color-white);
  }
  .empty {
    padding: 1rem;
    text-align: center;
    color: var(--sl-color-gray-3);
    border: 1px dashed var(--sl-color-gray-5);
    border-radius: 0.5rem;
  }
  .review-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  .review-table th,
  .review-table td {
    padding: 0.5rem;
    border-bottom: 1px solid var(--sl-color-gray-5);
    text-align: left;
    vertical-align: top;
  }
  .review-table th {
    background: var(--sl-color-gray-7);
    font-weight: 600;
  }
  .prompt-cell {
    max-width: 24rem;
    word-break: break-word;
  }
  .tags-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    max-width: 12rem;
  }
  .tag {
    font-size: 0.75rem;
    padding: 0.1rem 0.5rem;
    border-radius: 9999px;
    background: var(--sl-color-gray-6);
    border: 1px solid var(--sl-color-gray-5);
  }
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    font-size: 0.85rem;
  }
</style>
