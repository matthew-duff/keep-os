<script lang="ts">
  import Settings from 'lucide-svelte/icons/settings';
  import { pageStore } from './stores/pageStore';
  import { onMount } from 'svelte';

  let isLoading = true;

  onMount(async () => {
    try {
      await pageStore.refresh();
    } finally {
      isLoading = false;
    }
  });

  $: ({ title, url, description } = $pageStore);
</script>

<div class="app">
  <div class="top-bar">
    <div class="left-section">
      <img src="../public/icon/64.png" alt="Keep Logo" />
      <h2>Keep</h2>
    </div>
    <Settings class="settings-icon" />
  </div>

  <div class="content">
    <div class="heading-section">
      <h1>Current Page</h1>
      <button class="login-button">Save</button>
    </div>
    
    {#if isLoading}
      <div class="loading">Loading page data...</div>
    {:else}
      <div class="page-info">
        <h3>{title}</h3>
        <p class="url">{url}</p>
        {#if description}
          <p class="description">{description}</p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 600px;
    background-color: var(--background);
    font-family: var(--font-serif);
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) var(--space-md);
    background-color: var(--surface);
    border-bottom: 1px solid var(--surface-border);
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
    height: 48px;
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .content {
    padding: var(--space-lg);
    flex: 1;
    overflow-y: auto;
    background-color: var(--background);
  }

  .heading-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
  }

  .loading {
    color: var(--text-secondary);
    text-align: center;
    padding: var(--space-lg);
    font-style: italic;
  }

  .page-info {
    background-color: var(--surface);
    padding: var(--space-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-border);
  }

  .url {
    color: var(--primary);
    font-size: var(--text-sm);
    margin: var(--space-xs) 0;
    word-break: break-all;
  }

  .description {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin-top: var(--space-xs);
  }

  .settings-icon {
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: var(--radius-full);
    transition: all 0.15s ease;
    width: 20px;
    height: 20px;
  }

  .settings-icon:hover {
    background-color: var(--surface-hover);
    color: var(--text-primary);
  }

  .login-button {
    padding: var(--space-xs) var(--space-lg);
    background-color: var(--primary);
    color: var(--text-white);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: var(--font-weight-normal);
    font-size: var(--text-sm);
    transition: all 0.15s ease;
    box-shadow: var(--shadow-sm);
    font-family: var(--font-serif);
  }

  .login-button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .login-button:active {
    transform: translateY(0);
  }

  h1, h2, h3 {
    margin: 0;
    color: var(--text-primary);
    font-family: var(--font-serif);
  }

  h1 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-bold);
  }

  h2 {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-bold);
  }

  h3 {
    font-size: var(--text-base);
    font-weight: var(--font-weight-bold);
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    font-family: var(--font-serif);
  }
</style> 