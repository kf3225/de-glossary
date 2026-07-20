<script lang="ts">
  import type { QuizQuestion } from "@/types/quiz";
  import SingleChoiceQuestion from "./SingleChoiceQuestion.svelte";
  import TrueFalseQuestion from "./TrueFalseQuestion.svelte";

  export let question: QuizQuestion;
  // 回答としてユーザーが選択した値
  // - single-choice: number（選択肢インデックス）
  // - true-false: boolean
  export let answer: unknown = null;
  export let locked = false;

  // 型アサーションはテンプレート内で使えないため派生値で扱う
  $: answerNumber =
    question.type === "single-choice" ? (answer as number | null) : null;
  $: answerBoolean =
    question.type === "true-false" ? (answer as boolean | null) : null;

  function setAnswerNumber(value: number) {
    answer = value;
  }
  function setAnswerBoolean(value: boolean) {
    answer = value;
  }
</script>

<div class="quiz-question">
  {#if question.type === "single-choice"}
    <SingleChoiceQuestion
      question={question}
      selected={answerNumber}
      {locked}
      on:selected={(e) => setAnswerNumber(e.detail)}
    />
  {:else if question.type === "true-false"}
    <TrueFalseQuestion
      question={question}
      selected={answerBoolean}
      {locked}
      on:selected={(e) => setAnswerBoolean(e.detail)}
    />
  {:else}
    <p>未対応の問題形式です: {question.type}</p>
  {/if}
</div>

<style>
  .quiz-question {
    margin-top: 1rem;
  }
</style>
