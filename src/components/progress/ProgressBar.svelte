<script lang="ts">
  export let value: number; // 0..100
  export let label = "";

  $: clamped = Math.max(0, Math.min(100, value));
</script>

<div class="progress-bar" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
  <div class="progress-bar-fill" style={`width:${clamped}%`}></div>
</div>

<style>
  .progress-bar {
    width: 100%;
    height: 0.75rem;
    background: var(--sl-color-gray-6);
    border-radius: 9999px;
    overflow: hidden;
    border: 1px solid var(--sl-color-gray-5);
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--sl-color-text-accent);
    transition: width 0.2s ease;
  }
</style>
