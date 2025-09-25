<script lang="ts">
  import Launch from '../../components/Launch.svelte'
  import Product from '../../components/ProductPage.svelte'
  import { onMount } from 'svelte';

  let page = 'launch';

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message:', message);
    if (message.type === 'SHOW_PRODUCT_PAGE') {
      console.log('Switching to product page');
      page = 'product';
    }
  });

  onMount(() => {
    // Check if we should show product page on mount
    chrome.runtime.sendMessage({ type: 'CHECK_PRODUCT_PAGE' });
  });
</script>

<main class="font-serif">
  {#if page === 'launch'}
    <Launch />
  {:else}
    <Product />
  {/if}
</main>

<style>

</style>
