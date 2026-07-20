<script lang="ts">
  import { DIFFICULTY_LABELS, type Difficulty } from "@/types/quiz";

  type GlossaryEntry = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    difficulty: Difficulty;
    url: string;
  };

  export let entries: GlossaryEntry[] = [];

  let query = "";
  let selectedTags: string[] = [];
  let selectedDifficulties: Difficulty[] = [];

  const difficultyOptions: { value: Difficulty; label: string }[] = (
    Object.keys(DIFFICULTY_LABELS) as Difficulty[]
  ).map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));

  $: allTags = Array.from(new Set(entries.flatMap((e) => e.tags))).sort();
  $: filtered = entries.filter((e) => {
    if (
      query.trim().length > 0 &&
      !e.title.toLowerCase().includes(query.trim().toLowerCase()) &&
      !e.description.toLowerCase().includes(query.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((t) => e.tags.includes(t))
    ) {
      return false;
    }
    if (
      selectedDifficulties.length > 0 &&
      !selectedDifficulties.includes(e.difficulty)
    ) {
      return false;
    }
    return true;
  });

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
</script>

<section class="glossary-list" aria-label="用語一覧">
  <div class="filters">
    <label class="search">
      <span class="search-label">検索</span>
      <input
        type="search"
        placeholder="用語名や説明で絞り込み"
        bind:value={query}
      />
    </label>

    {#if allTags.length > 0}
      <fieldset class="chip-field">
        <legend>タグ</legend>
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
      </fieldset>
    {/if}

    <fieldset class="chip-field">
      <legend>難易度</legend>
      <div class="chip-group">
        {#each difficultyOptions as opt}
          <label class={`chip ${selectedDifficulties.includes(opt.value) ? "is-active" : ""}`}>
            <input
              type="checkbox"
              value={opt.value}
              checked={selectedDifficulties.includes(opt.value)}
              on:change={() => toggleDifficulty(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        {/each}
      </div>
    </fieldset>
  </div>

  <p class="count">{filtered.length} 件</p>

  {#if filtered.length === 0}
    <p class="empty">該当する用語がありません。</p>
  {:else}
    <ul class="entries">
      {#each filtered as entry}
        <li class="entry">
          <a class="entry-title" href={entry.url}>{entry.title}</a>
          <p class="entry-desc">{entry.description}</p>
          <div class="entry-meta">
            <span class="difficulty">{DIFFICULTY_LABELS[entry.difficulty]}</span>
            {#each entry.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .filters {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .search {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .search-label {
    font-size: 0.85rem;
    color: var(--sl-color-gray-3);
  }
  .search input {
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.375rem;
    background: var(--sl-color-gray-7);
    color: inherit;
    font: inherit;
  }
  .chip-field {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    margin: 0;
  }
  .chip-field legend {
    font-size: 0.85rem;
    color: var(--sl-color-gray-3);
    padding: 0 0.25rem;
  }
  .chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.25rem;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
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
  .count {
    margin: 0.5rem 0;
    color: var(--sl-color-gray-3);
    font-size: 0.85rem;
  }
  .empty {
    padding: 1rem;
    text-align: center;
    color: var(--sl-color-gray-3);
  }
  .entries {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }
  .entry {
    padding: 0.75rem 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .entry-title {
    font-weight: 600;
    text-decoration: none;
    color: var(--sl-color-text-accent);
  }
  .entry-title:hover {
    text-decoration: underline;
  }
  .entry-desc {
    margin: 0.25rem 0 0.5rem;
    font-size: 0.9rem;
  }
  .entry-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    font-size: 0.75rem;
  }
  .difficulty {
    padding: 0.1rem 0.5rem;
    border-radius: 9999px;
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
  }
  .tag {
    padding: 0.1rem 0.5rem;
    border-radius: 9999px;
    background: var(--sl-color-gray-6);
    border: 1px solid var(--sl-color-gray-5);
  }
</style>
