<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SingleChoiceQuestion } from "@/types/quiz";

  export let question: SingleChoiceQuestion;
  export let selected: number | null = null;
  export let locked = false;

  const dispatch = createEventDispatcher<{ selected: number }>();

  function choose(idx: number) {
    if (locked) return;
    selected = idx;
    dispatch("selected", idx);
  }
</script>

<fieldset class="single-choice">
  <legend class="visually-hidden">選択肢</legend>
  {#each question.choices as choice, idx}
    <label class={`choice ${selected === idx ? "is-selected" : ""}`}>
      <input
        type="radio"
        name={`q-${question.id}`}
        value={idx}
        checked={selected === idx}
        disabled={locked}
        on:change={() => choose(idx)}
      />
      <span class="choice-label">{choice}</span>
    </label>
  {/each}
</fieldset>

<style>
  .single-choice {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 0;
    padding: 0;
    margin: 0;
  }
  .choice {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    cursor: pointer;
  }
  .choice.is-selected {
    border-color: var(--sl-color-text-accent);
    background: var(--sl-color-gray-7);
  }
  .choice input {
    margin-top: 0.15rem;
    flex: 0 0 auto;
  }
  .choice-label {
    flex: 1 1 auto;
    word-break: break-word;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
