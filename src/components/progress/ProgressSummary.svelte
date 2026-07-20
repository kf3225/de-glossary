<script lang="ts">
  import type { OverallStats } from "@/types/progress";
  import ProgressBar from "./ProgressBar.svelte";

  export let stats: OverallStats;
</script>

<section class="progress-summary" aria-label="学習サマリー">
  <div class="stat-grid">
    <div class="stat">
      <span class="stat-label">登録問題数</span>
      <span class="stat-value">{stats.registeredQuestionCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">回答済み</span>
      <span class="stat-value">{stats.attemptedQuestionCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">未回答</span>
      <span class="stat-value">{stats.unattemptedQuestionCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">苦手問題数</span>
      <span class="stat-value">{stats.weakQuestionCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">復習対象（手動）</span>
      <span class="stat-value">{stats.markedCount}</span>
    </div>
  </div>

  <div class="accuracy-block">
    <div class="accuracy-row">
      <span>全体の正答率</span>
      <span class="accuracy-value">
        {stats.totalAttempts > 0 ? `${stats.accuracyRate}%` : "未回答"}
      </span>
    </div>
    <ProgressBar value={stats.totalAttempts > 0 ? stats.accuracyRate : 0} label="正答率" />

    <div class="attempts-grid">
      <div>回答回数: {stats.totalAttempts}</div>
      <div>正解: {stats.totalCorrect}</div>
      <div>不正解: {stats.totalIncorrect}</div>
    </div>
  </div>
</section>

<style>
  .progress-summary {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.5rem;
  }
  .stat {
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .stat-label {
    font-size: 0.8rem;
    color: var(--sl-color-gray-3);
  }
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .accuracy-block {
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .accuracy-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .accuracy-value {
    color: var(--sl-color-text-accent);
  }
  .attempts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-size: 0.9rem;
  }
</style>
