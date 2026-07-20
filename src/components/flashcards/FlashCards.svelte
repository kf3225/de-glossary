<script lang="ts">
  import type { FlashCard } from "@/types/flashcard";
  import { shuffle } from "@lib/quiz/shuffle";

  export let cards: FlashCard[] = [];

  let current = 0;
  let flipped = false;
  let order: number[] = cards.map((_, i) => i);

  $: card = cards[order[current]];

  function next() {
    if (current >= cards.length - 1) return;
    current += 1;
    flipped = false;
  }
  function prev() {
    if (current <= 0) return;
    current -= 1;
    flipped = false;
  }
  function flip() {
    flipped = !flipped;
  }
  function shuffleCards() {
    order = shuffle(order);
    current = 0;
    flipped = false;
  }

  function onKey(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
        next();
        break;
      case "ArrowLeft":
        prev();
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        flip();
        break;
      case "s":
      case "S":
        shuffleCards();
        break;
    }
  }
</script>

<svelte:window on:keydown={onKey} />

<section class="flashcards" aria-label="フラッシュカード">
  {#if cards.length === 0}
    <p>カードがありません。</p>
  {:else}
    <div
      class="card"
      role="button"
      tabindex="0"
      aria-pressed={flipped}
      on:click={flip}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
    >
      <p class="card-position">{current + 1} / {cards.length}</p>
      {#if flipped}
        <div class="card-face back">
          <p class="card-label">裏面</p>
          <p class="card-text">{card.back}</p>
        </div>
      {:else}
        <div class="card-face front">
          <p class="card-label">表面</p>
          <p class="card-text">{card.front}</p>
        </div>
      {/if}
    </div>

    <div class="actions">
      <button type="button" class="btn" on:click={prev} disabled={current === 0}>
        前へ
      </button>
      <button type="button" class="btn primary" on:click={flip}>
        {flipped ? "表に戻す" : "裏を見る"}
      </button>
      <button type="button" class="btn" on:click={next} disabled={current === cards.length - 1}>
        次へ
      </button>
      <button type="button" class="btn" on:click={shuffleCards}>
        シャッフル
      </button>
    </div>
    <p class="hint">キーボード操作: ← → で移動、Space/Enter で裏表、S でシャッフル</p>
  {/if}
</section>

<style>
  .flashcards {
    margin: 1rem 0;
  }
  .card {
    display: block;
    width: 100%;
    min-height: 12rem;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 2px solid var(--sl-color-gray-5);
    background: var(--sl-color-gray-7);
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s ease;
  }
  .card:focus {
    outline: 3px solid var(--sl-color-text-accent);
    outline-offset: 2px;
  }
  .card:hover {
    border-color: var(--sl-color-text-accent);
  }
  .card-position {
    color: var(--sl-color-gray-3);
    font-size: 0.85rem;
    margin: 0 0 0.5rem;
  }
  .card-label {
    font-size: 0.75rem;
    color: var(--sl-color-gray-3);
    margin: 0 0 0.5rem;
  }
  .card-text {
    font-size: 1.1rem;
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
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
  .hint {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--sl-color-gray-3);
  }
</style>
