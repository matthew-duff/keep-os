<script lang="ts">
  import Settings from 'lucide-svelte/icons/settings';
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
      <h1>Welcome back</h1>
      <button class="login-button">Login</button>
    </div>
    <p>Popup content</p>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 600px;
    background-color: var(--background);
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
    font-weight: 500;
    font-size: var(--text-sm);
    transition: all 0.15s ease;
    box-shadow: var(--shadow-sm);
  }

  .login-button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .login-button:active {
    transform: translateY(0);
  }

  h1 {
    margin: 0;
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  h2 {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
  }
</style> 