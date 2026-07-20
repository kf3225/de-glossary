<script lang="ts">
  import type { QuizQuestion, Difficulty } from "@/types/quiz";
  import { DIFFICULTY_LABELS, DIFFICULTIES } from "@/types/quiz";
  import { allQuestions } from "@data/quizzes";
  import {
    collectTags,
    collectDifficulties,
    pickQuestions,
    type QuizFilter,
  } from "@lib/quiz/filter";
  import { shuffle } from "@lib/quiz/shuffle";
  import Quiz from "./Quiz.svelte";
  import { NO_QUESTIONS_MESSAGE, QUIZ_COUNT_OPTIONS } from "@lib/constants";

  // 外部から指定可能にする（苦手問題モード等）
  export let title = "横断クイズ";
  export let filterOverride: QuizFilter | null = null;
  export let hideConditions = false;

  let selectedTags: string[] = [];
  let selectedDifficulties: Difficulty[] = [];
  let selectedCount: number | "all" = 10;

  // 開始中のセッション
  let session: { id: string; questions: QuizQuestion[] } | null = null;
  let errorMessage = "";

  $: allTags = collectTags(allQuestions);
  $: allDifficulties = collectDifficulties(allQuestions);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
  function toggleDifficulty(d: Difficulty) {
    if (selectedDifficulties.includes(d)) {
      selectedDifficulties = selectedDifficulties.filter((x) => x !== d);
    } else {
      selectedDifficulties = [...selectedDifficulties, d];
    }
  }

  function start() {
    errorMessage = "";
    const filter: QuizFilter = filterOverride ?? {
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      difficulties:
        selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
    };
    const picked = pickQuestions(allQuestions, filter, selectedCount, shuffle);
    if (picked.length === 0) {
      errorMessage = NO_QUESTIONS_MESSAGE;
      return;
    }
    session = {
      id: `session-${Date.now()}`,
      questions: picked,
    };
  }

  function endSession() {
    session = null;
  }

  function backToConditions() {
    session = null;
    errorMessage = "";
  }
</script>

<section class="quiz-launcher">
  <h2>{title}</h2>

  {#if !session}
    {#if !hideConditions && !filterOverride}
      <fieldset class="conditions">
        <legend>出題条件</legend>

        <div class="condition-group">
          <h3>タグ</h3>
          <div class="chip-group">
            {#each allTags as tag}
              <label class={`chip ${selectedTags.includes(tag) ? "is-active" : ""}`}>
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  on:change={() => toggleTag(tag)}
                />
                <span>{tag}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="condition-group">
          <h3>難易度</h3>
          <div class="chip-group">
            {#each allDifficulties as d}
              <label class={`chip ${selectedDifficulties.includes(d) ? "is-active" : ""}`}>
                <input
                  type="checkbox"
                  value={d}
                  checked={selectedDifficulties.includes(d)}
                  on:change={() => toggleDifficulty(d)}
                />
                <span>{DIFFICULTY_LABELS[d]}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="condition-group">
          <h3>出題数</h3>
          <div class="chip-group">
            {#each QUIZ_COUNT_OPTIONS as opt}
              <label class={`chip ${selectedCount === opt ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="count"
                  value={opt}
                  checked={selectedCount === opt}
                  on:change={() => (selectedCount = opt)}
                />
                <span>{opt}問</span>
              </label>
            {/each}
            <label class={`chip ${selectedCount === "all" ? "is-active" : ""}`}>
              <input
                type="radio"
                name="count"
                value="all"
                checked={selectedCount === "all"}
                on:change={() => (selectedCount = "all")}
              />
              <span>全問</span>
            </label>
          </div>
        </div>
      </fieldset>
    {/if}

    {#if errorMessage}
      <p class="error" role="alert">{errorMessage}</p>
    {/if}

    <div class="actions">
      <button type="button" class="btn primary" on:click={start}>
        クイズを開始
      </button>
    </div>
  {:else}
    <Quiz quizId={session.id} questions={session.questions} />
    <div class="actions">
      <button type="button" class="btn" on:click={backToConditions}>
        条件選択へ戻る
      </button>
      <button type="button" class="btn primary" on:click={endSession}>
        終了
      </button>
    </div>
  {/if}
</section>

<style>
  .quiz-launcher {
    margin: 1rem 0;
  }
  .conditions {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.5rem 0 1rem;
  }
  .conditions legend {
    padding: 0 0.5rem;
    font-weight: 600;
  }
  .condition-group {
    margin: 0.75rem 0;
  }
  .condition-group h3 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
  }
  .chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 9999px;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .chip.is-active {
    border-color: var(--sl-color-text-accent);
    background: var(--sl-color-gray-7);
  }
  .chip input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
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
  .btn.primary {
    background: var(--sl-color-text-accent);
    border-color: var(--sl-color-text-accent);
    color: var(--sl-color-white);
  }
  .error {
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--sl-color-red-low, rgba(255, 0, 0, 0.1));
    color: var(--sl-color-red);
    border-radius: 0.375rem;
  }
</style>
