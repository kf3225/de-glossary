<script lang="ts">
  import type { QuizQuestion } from "@/types/quiz";
  import QuizQuestionView from "./QuizQuestion.svelte";
  import QuizResult from "./QuizResult.svelte";
  import {
    initProgressStore,
    recordAnswer,
    storageError,
  } from "@lib/progress/store";
  import { STORAGE_ERROR_MESSAGE } from "@lib/constants";

  export let quizId: string;
  export let questions: QuizQuestion[];

  // 初期化
  initProgressStore();

  // 現在の問題インデックス
  let currentIndex = 0;
  // 各問題のユーザー回答
  let answers: Record<string, unknown> = {};
  // 確定済み回答のフラグ
  let lockedSet: Set<string> = new Set();
  // 完了フラグ
  let finished = false;

  $: currentQuestion = questions[currentIndex];
  $: currentAnswer = answers[currentQuestion?.id] ?? null;
  $: isLocked = lockedSet.has(currentQuestion?.id);
  $: storageErrorMessage = $storageError ? STORAGE_ERROR_MESSAGE : "";

  // 正答判定
  function isCorrect(q: QuizQuestion, value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (q.type === "single-choice") return value === q.answer;
    return value === q.answer;
  }

  // 回答する
  function submit() {
    if (!currentQuestion) return;
    if (currentAnswer === null || currentAnswer === undefined) return;
    if (lockedSet.has(currentQuestion.id)) return;

    const correct = isCorrect(currentQuestion, currentAnswer);
    recordAnswer(currentQuestion.id, correct ? "correct" : "incorrect");

    lockedSet = new Set([...lockedSet, currentQuestion.id]);
  }

  // 次へ
  function next() {
    if (currentIndex >= questions.length - 1) {
      finished = true;
      return;
    }
    currentIndex += 1;
  }

  // 再挑戦（同じ問題をもう一度回答可能にする）
  function retryAll() {
    answers = {};
    lockedSet = new Set();
    finished = false;
    currentIndex = 0;
  }

  // 解答済みでもう一度この問題に挑戦
  function retryCurrent() {
    if (!currentQuestion) return;
    const { [currentQuestion.id]: _omit, ...rest } = answers;
    answers = rest;
    const newSet = new Set(lockedSet);
    newSet.delete(currentQuestion.id);
    lockedSet = newSet;
  }

  // 正解ラベル
  function correctLabel(q: QuizQuestion): string {
    if (q.type === "single-choice") return q.choices[q.answer];
    return q.answer ? "正しい" : "誤り";
  }

  function answerLabel(q: QuizQuestion, value: unknown): string {
    if (value === null || value === undefined) return "未回答";
    if (q.type === "single-choice") {
      const idx = value as number;
      return q.choices[idx] ?? "未回答";
    }
    return value === true ? "正しい" : "誤り";
  }

  function setAnswer(value: unknown) {
    if (!currentQuestion) return;
    answers = { ...answers, [currentQuestion.id]: value };
  }
</script>

<div class="quiz" data-quiz-id={quizId}>
  {#if !finished && currentQuestion}
    <div class="quiz-header">
      <span class="position">問題 {currentIndex + 1} / {questions.length}</span>
    </div>

    <p class="prompt">{currentQuestion.prompt}</p>

    <QuizQuestionView
      question={currentQuestion}
      answer={currentAnswer}
      locked={isLocked}
      on:selected={(e) => setAnswer(e.detail)}
    />

    {#if isLocked}
      <div
        class={`result-box ${isCorrect(currentQuestion, currentAnswer) ? "is-correct" : "is-incorrect"}`}
        role="status"
        aria-live="polite"
      >
        <p class="result-status">
          {#if isCorrect(currentQuestion, currentAnswer)}正解{:else}不正解{/if}
        </p>
        <p>選択した回答: <span class="answer-user">{answerLabel(currentQuestion, currentAnswer)}</span></p>
        <p>正しい回答: <span class="answer-correct">{correctLabel(currentQuestion)}</span></p>
        <p class="explanation">{currentQuestion.explanation}</p>
      </div>
    {/if}

    <div class="actions">
      {#if !isLocked}
        <button
          type="button"
          class="btn primary"
          disabled={currentAnswer === null || currentAnswer === undefined}
          on:click={submit}
        >
          回答する
        </button>
      {:else}
        <button type="button" class="btn" on:click={retryCurrent}>
          この問題もう一度
        </button>
        {#if currentIndex < questions.length - 1}
          <button type="button" class="btn primary" on:click={next}>
            次の問題
          </button>
        {:else}
          <button type="button" class="btn primary" on:click={next}>
            結果を見る
          </button>
        {/if}
      {/if}
    </div>
  {:else if finished}
    <QuizResult {questions} {answers} />
    <div class="actions">
      <button type="button" class="btn primary" on:click={retryAll}>
        もう一度挑戦
      </button>
    </div>
  {:else}
    <p>問題がありません。</p>
  {/if}

  {#if storageErrorMessage}
    <p class="storage-error" role="alert">{storageErrorMessage}</p>
  {/if}
</div>

<style>
  .quiz {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .quiz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .position {
    color: var(--sl-color-gray-3);
    font-size: 0.85rem;
  }
  .prompt {
    font-size: 1.05rem;
    margin: 0.5rem 0;
    word-break: break-word;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
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
  .result-box {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    border-left: 4px solid;
  }
  .result-box.is-correct {
    border-color: var(--sl-color-green);
    background: var(--sl-color-green-low, rgba(0, 128, 0, 0.1));
  }
  .result-box.is-incorrect {
    border-color: var(--sl-color-red);
    background: var(--sl-color-red-low, rgba(255, 0, 0, 0.1));
  }
  .result-status {
    font-weight: 700;
    margin: 0 0 0.25rem;
  }
  .answer-user {
    color: var(--sl-color-red);
  }
  .answer-correct {
    color: var(--sl-color-green);
  }
  .explanation {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  .storage-error {
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    background: var(--sl-color-red-low, rgba(255, 0, 0, 0.1));
    color: var(--sl-color-red);
    font-size: 0.9rem;
  }
</style>
