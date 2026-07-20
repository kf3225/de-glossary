<script lang="ts">
  import type { QuizQuestion } from "@/types/quiz";
  import { accuracyPercent } from "@lib/progress/statistics";

  export let questions: QuizQuestion[];
  // ユーザーの回答: questionId -> answer値
  export let answers: Record<string, unknown>;

  function isCorrect(q: QuizQuestion): boolean {
    const a = answers[q.id];
    if (a === null || a === undefined) return false;
    if (q.type === "single-choice") return a === q.answer;
    return a === q.answer;
  }

  $: correctCount = questions.filter(isCorrect).length;
  $: totalCount = questions.length;
  $: incorrectCount = totalCount - correctCount;
  $: accuracy = accuracyPercent(correctCount, totalCount);
  $: incorrectQuestions = questions.filter((q) => !isCorrect(q));

  function answerLabel(q: QuizQuestion, value: unknown): string {
    if (value === null || value === undefined) return "未回答";
    if (q.type === "single-choice") {
      const idx = value as number;
      return q.choices[idx] ?? "未回答";
    }
    return value === true ? "正しい" : "誤り";
  }

  function correctLabel(q: QuizQuestion): string {
    if (q.type === "single-choice") return q.choices[q.answer];
    return q.answer ? "正しい" : "誤り";
  }
</script>

<section class="quiz-result" aria-label="クイズ結果">
  <h3>結果</h3>
  <dl class="result-summary">
    <div><dt>正解数</dt><dd>{correctCount}</dd></div>
    <div><dt>不正解数</dt><dd>{incorrectCount}</dd></div>
    <div><dt>正答率</dt><dd>{totalCount > 0 ? `${accuracy}%` : "未回答"}</dd></div>
  </dl>

  {#if incorrectQuestions.length > 0}
    <details class="incorrect-list">
      <summary>不正解だった問題（{incorrectQuestions.length}）</summary>
      <ol>
        {#each incorrectQuestions as q}
          <li class="incorrect-item">
            <p class="prompt">{q.prompt}</p>
            <p>選択した回答: <span class="answer-user">{answerLabel(q, answers[q.id])}</span></p>
            <p>正しい回答: <span class="answer-correct">{correctLabel(q)}</span></p>
            <p class="explanation">{q.explanation}</p>
          </li>
        {/each}
      </ol>
    </details>
  {/if}
</section>

<style>
  .quiz-result {
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .result-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
    margin: 0.5rem 0 1rem;
  }
  .result-summary > div {
    padding: 0.5rem 0.75rem;
    background: var(--sl-color-gray-6);
    border-radius: 0.375rem;
  }
  .result-summary dt {
    font-size: 0.85rem;
    color: var(--sl-color-gray-3);
  }
  .result-summary dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  .incorrect-list {
    margin-top: 1rem;
  }
  .incorrect-list summary {
    cursor: pointer;
    font-weight: 600;
  }
  .incorrect-list ol {
    margin: 0.5rem 0 0 1.25rem;
  }
  .incorrect-item {
    margin: 0.5rem 0;
    padding: 0.5rem 0.75rem;
    border-left: 3px solid var(--sl-color-red);
    background: var(--sl-color-gray-6);
  }
  .prompt {
    font-weight: 600;
    margin: 0 0 0.25rem;
  }
  .answer-user {
    color: var(--sl-color-red);
  }
  .answer-correct {
    color: var(--sl-color-green);
  }
  .explanation {
    margin-top: 0.25rem;
    font-size: 0.9rem;
  }
</style>
