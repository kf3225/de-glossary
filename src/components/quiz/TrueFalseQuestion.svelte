<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { TrueFalseQuestion } from "@/types/quiz";

  export let question: TrueFalseQuestion;
  export let selected: boolean | null = null;
  export let locked = false;

  const dispatch = createEventDispatcher<{ selected: boolean }>();

  function choose(value: boolean) {
    if (locked) return;
    selected = value;
    dispatch("selected", value);
  }
</script>

<fieldset class="true-false">
  <legend class="visually-hidden">選択肢</legend>
  <label class={`choice ${selected === true ? "is-selected" : ""}`}>
    <input
      type="radio"
      name={`q-${question.id}`}
      value="true"
      checked={selected === true}
      disabled={locked}
      on:change={() => choose(true)}
    />
    <span>正しい</span>
  </label>
  <label class={`choice ${selected === false ? "is-selected" : ""}`}>
    <input
      type="radio"
      name={`q-${question.id}`}
      value="false"
      checked={selected === false}
      disabled={locked}
      on:change={() => choose(false)}
    />
    <span>誤り</span>
  </label>
</fieldset>

<style>
  .true-false {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 0;
    padding: 0;
    margin: 0;
  }
  .choice {
    display: flex;
    align-items: center;
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
