<script lang="ts">
  import ProgressSummary from "./ProgressSummary.svelte";
  import RecentAnswers from "./RecentAnswers.svelte";
  import ReviewQuestionList from "@components/review/ReviewQuestionList.svelte";
  import { allQuestions } from "@data/quizzes";
  import { computeOverallStats } from "@lib/progress/statistics";
  import {
    initProgressStore,
    progressStore,
    settingsStore,
  } from "@lib/progress/store";

  initProgressStore();

  // ストアの値をリアクティブに参照
  $: store = $progressStore;
  $: threshold = $settingsStore.weakAccuracyThreshold;
  $: stats = computeOverallStats(allQuestions, store, threshold);
</script>

<section class="progress-page" aria-label="学習状況">
  <h2>全体サマリー</h2>
  <ProgressSummary {stats} />

  <h2>最近の回答</h2>
  <RecentAnswers items={store.items} />

  <h2>苦手問題</h2>
  <ReviewQuestionList />
</section>

<style>
  .progress-page {
    margin: 1rem 0;
  }
  .progress-page :global(h2) {
    margin-top: 1.5rem;
  }
</style>
