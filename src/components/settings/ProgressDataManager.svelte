<script lang="ts">
  import {
    initProgressStore,
    progressStore,
    clearAllProgress,
    replaceProgress,
  } from "@lib/progress/store";
  import {
    downloadProgressJson,
    parseAndValidateImport,
    applyImport,
    assertFileSize,
    type ImportSummary,
  } from "@lib/progress/importExport";
  import type { ImportMode } from "@/types/progress";
  import { emptyProgressStore, isLocalStorageAvailable } from "@lib/progress/storage";
  import { IMPORT_FILE_SIZE_LIMIT } from "@lib/constants";
  import { get } from "svelte/store";

  initProgressStore();

  let importSummary: ImportSummary | null = null;
  let importError = "";
  let importMode: ImportMode = "merge";
  let pendingImport: unknown = null;
  let statusMessage = "";
  let statusType: "success" | "error" = "success";
  let resetCheckbox = false;
  let storageReady = isLocalStorageAvailable();

  function onExport() {
    const store = get(progressStore);
    const ok = downloadProgressJson(store);
    if (!ok) {
      statusType = "error";
      statusMessage = "エクスポートに失敗しました。";
    } else {
      statusType = "success";
      statusMessage = "進捗データをエクスポートしました。";
    }
  }

  function onFileSelected(event: Event) {
    importError = "";
    importSummary = null;
    pendingImport = null;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // ファイルサイズ検証
    const sizeCheck = assertFileSize(file.size);
    if (sizeCheck !== true) {
      importError = sizeCheck;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const result = parseAndValidateImport(text);
      if (!result.ok) {
        importError = result.error;
        return;
      }
      importSummary = result.summary;
      pendingImport = result.data;
      statusMessage = "";
    };
    reader.onerror = () => {
      importError = "ファイルの読み込みに失敗しました。";
    };
    reader.readAsText(file, "utf-8");
  }

  function onImportConfirm() {
    if (!pendingImport) return;
    try {
      const current = get(progressStore);
      const newStore = applyImport(current, pendingImport as any, importMode);
      const ok = replaceProgress(newStore);
      if (ok) {
        statusType = "success";
        statusMessage = `進捗データをインポートしました（${importSummary?.count ?? 0}件 / ${importMode === "merge" ? "マージ" : "上書き"}）。`;
        importSummary = null;
        pendingImport = null;
      } else {
        statusType = "error";
        statusMessage = "インポートに失敗しました。ブラウザのストレージ設定を確認してください。";
      }
    } catch (e) {
      statusType = "error";
      statusMessage = e instanceof Error ? e.message : "インポートに失敗しました。";
    }
  }

  function onImportCancel() {
    importSummary = null;
    importError = "";
    pendingImport = null;
  }

  function onReset() {
    if (!resetCheckbox) return;
    const ok = clearAllProgress();
    if (ok) {
      statusType = "success";
      statusMessage = "学習履歴をリセットしました。";
    } else {
      statusType = "error";
      statusMessage = "リセットに失敗しました。";
    }
    resetCheckbox = false;
  }
</script>

<section class="settings" aria-label="進捗データ管理">
  {#if !storageReady}
    <p class="warning" role="alert">
      この環境では <code>localStorage</code> が利用できないため、学習履歴の保存・読み込みはできません。
    </p>
  {/if}

  {#if statusMessage}
    <p class={`status ${statusType}`} role="status">{statusMessage}</p>
  {/if}

  <div class="card">
    <h2>エクスポート</h2>
    <p>
      学習履歴をJSONファイルとしてダウンロードします。
      ファイル名は <code>personal-learning-progress-YYYY-MM-DD.json</code> になります。
    </p>
    <button type="button" class="btn primary" on:click={onExport} disabled={!storageReady}>
      エクスポート
    </button>
  </div>

  <div class="card">
    <h2>インポート</h2>
    <p>
      エクスポートしたJSONファイルを選択して学習履歴を復元します。
      ファイルサイズ上限は {Math.floor(IMPORT_FILE_SIZE_LIMIT / 1024 / 1024)}MB です。
    </p>

    <label class="file">
      <input
        type="file"
        accept="application/json,.json"
        on:change={onFileSelected}
        disabled={!storageReady}
      />
      <span>JSONファイルを選択</span>
    </label>

    {#if importError}
      <p class="status error" role="alert">{importError}</p>
    {/if}

    {#if importSummary}
      <div class="import-confirm">
        <p>
          インポート内容: {importSummary.count} 件 / バージョン {importSummary.version}
        </p>
        <fieldset class="mode">
          <legend>インポート方式</legend>
          <label>
            <input type="radio" name="mode" value="merge" bind:group={importMode} />
            <span>マージ（同一問題IDは統合）</span>
          </label>
          <label>
            <input type="radio" name="mode" value="overwrite" bind:group={importMode} />
            <span>上書き（既存データを破棄）</span>
          </label>
        </fieldset>
        <div class="actions">
          <button type="button" class="btn primary" on:click={onImportConfirm}>
            インポートを実行
          </button>
          <button type="button" class="btn" on:click={onImportCancel}>
            キャンセル
          </button>
        </div>
      </div>
    {/if}
  </div>

  <div class="card danger">
    <h2>学習履歴のリセット</h2>
    <p>
      学習履歴をすべて削除します。用語集や問題データは削除されません。
      この操作は元に戻せません。必要なら先にエクスポートしてください。
    </p>
    <label class="confirm">
      <input type="checkbox" bind:checked={resetCheckbox} />
      <span>履歴を削除することに同意する</span>
    </label>
    <button type="button" class="btn danger" on:click={onReset} disabled={!resetCheckbox || !storageReady}>
      履歴を削除
    </button>
  </div>

  <div class="card info">
    <h2>学習履歴の保存に関する注意</h2>
    <ul>
      <li>学習履歴はブラウザの <code>localStorage</code> に保存されます。</li>
      <li>別のブラウザ・別の端末には自動同期されません。</li>
      <li>ローカル環境とGitHub Pagesでは保存領域が別になります。</li>
      <li>ブラウザデータ削除で失われます。定期的なエクスポートをおすすめします。</li>
      <li>公開URLが変更された場合、以前のURLの履歴は引き継がれません。</li>
      <li>プライベートブラウジングでは保存が制限される場合があります。</li>
      <li>GitHubリポジトリへは一切送信されません。</li>
    </ul>
  </div>
</section>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
  }
  .card {
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    background: var(--sl-color-gray-7);
  }
  .card.danger {
    border-color: var(--sl-color-red);
  }
  .card.info {
    background: var(--sl-color-gray-6);
  }
  .card h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }
  .card p {
    margin: 0 0 0.75rem;
  }
  .file {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.375rem;
    cursor: pointer;
    width: fit-content;
  }
  .file input {
    font-size: 0.85rem;
  }
  .mode {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    margin: 0.75rem 0;
  }
  .mode legend {
    padding: 0 0.25rem;
    font-size: 0.85rem;
  }
  .mode label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0.25rem 0;
    cursor: pointer;
  }
  .confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    cursor: pointer;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
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
  .btn.danger {
    background: var(--sl-color-red);
    border-color: var(--sl-color-red);
    color: var(--sl-color-white);
  }
  .status {
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.9rem;
  }
  .status.success {
    background: var(--sl-color-green-low, rgba(0, 128, 0, 0.1));
    color: var(--sl-color-green);
  }
  .status.error {
    background: var(--sl-color-red-low, rgba(255, 0, 0, 0.1));
    color: var(--sl-color-red);
  }
  .warning {
    padding: 0.75rem 1rem;
    background: var(--sl-color-yellow-low, rgba(255, 200, 0, 0.15));
    border-left: 4px solid var(--sl-color-yellow, #d39d00);
    border-radius: 0.375rem;
  }
  code {
    background: var(--sl-color-gray-5);
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
  ul {
    margin: 0;
    padding-left: 1.25rem;
  }
  li {
    margin: 0.25rem 0;
  }
</style>
