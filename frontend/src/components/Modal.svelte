<script lang="ts">
    import { X } from '@lucide/svelte';
    import type { ShoppingSearchResponse } from "../lib/types/search";
  
    let { data } = $props<{ data: ShoppingSearchResponse[] }>();
    let modalData = $state(data || []);
    let modalElement = $state<HTMLDivElement>();
  
    console.log('[MODAL] Modal component initialized with data:', {
      dataLength: data?.length,
      firstItem: data?.[0],
      shoppingResults: data?.[0]?.shopping_results
    });
  
    // Function to close modal
    function closeModal() {
      console.log('[MODAL] Close button clicked');
      chrome.runtime.sendMessage({ type: 'CLOSE_MODAL' });
    }
  
    // // Handle keyboard events
    // function handleKeydown(e: KeyboardEvent) {
    //   if (e.key === 'Enter' || e.key === ' ') {
    //     closeModal();
    //   }
    // }
  
    // // Handle content click
    // function handleContentClick(e: Event) {
    //   e.stopPropagation();
    // }
  
    // Add keyboard listener for Escape key and handle cleanup
    $effect(() => {
      console.log('[MODAL] Modal component mounted');
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          console.log('[MODAL] Escape key pressed, closing modal');
          closeModal();
        }
      };
      document.addEventListener('keydown', handleEscape);
  
      // Return cleanup function
      return () => {
        console.log('[MODAL] Modal component unmounting, removing event listener');
        document.removeEventListener('keydown', handleEscape);
        if (modalElement?.parentNode) {
          modalElement.parentNode.removeChild(modalElement);
        }
      };
    });
  </script>
  
  <div 
    class="modal-overlay"
    bind:this={modalElement}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="modal-content">
      <div class="modal-column left-column">
        <h2 class="company">K</h2>
        <h1 id="modal-title" class="modal-title">
          We've found you sustainable alternatives.
        </h1>
        <h3 class="sub-heading">Browse and compare environmentally conscious alternatives, and see how you can save trees 🌲, water 💧, and carbon ✈️.</h3>
      </div>
      <div class="modal-column right-column">
        <div class="secondary-heading">
          <div></div>
          <button 
            class="close-icon"
            onclick={() => closeModal()}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <h2 class="column-title">Product Details</h2>
        <div class="product-list">
          {#each modalData[0].shopping_results as shopping_result}
            <div class="content-section">
              <h3 class="item-title">
                <span class="item-name">{shopping_result.title}</span>
              </h3>
              <p class="item-description">{shopping_result.price}</p>
            </div>
          {/each}
        </div>
  
        <div class="modal-footer">
          <button 
            class="close-button"
            onclick={() => closeModal()}
          >
            Not this time.
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    * {
      font-family: 'PT Serif', serif;
      color: #1f2937;
      line-height: 1.5;
    }
  
    .company {
      font-size: 20px;
      font-weight: 400;
      color: #4b5563;
      padding-bottom: 8px;
      margin-bottom: 25%;
    }
   
    .modal-overlay {
      background-color: rgba(0, 0, 0, 0.5);
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      cursor: pointer;
      outline: none;
    }
   
    .modal-content {
      width: 80%;
      max-width: 900px;
      max-height: 90vh;
      min-height: 600px;
      background-color: #fff;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      padding: 32px;
      display: flex;
      flex-direction: row;
      gap: 24px;
      cursor: default;
      outline: none;
    }
  
    .modal-column {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
  
    .sub-heading {
      font-size: 18px;
      font-weight: 400;
      color: #4b5563;
      margin-bottom: 24px;
    }
  
    .left-column {
      padding-right: 24px;
    }
  
    .right-column {
      padding-left: 24px;
    }
  
    .column-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  
    .secondary-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  
    .product-list {
      flex-grow: 1;
      overflow-y: auto;
    }
  
    .modal-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 24px;
    }
  
    .content-section {
      margin-bottom: 16px;
    }
  
    .item-title {
      font-size: 18px;
      margin-bottom: 8px;
    }
  
    .item-name {
      font-weight: 600;
    }
  
    .item-description {
      color: #374151;
    }
  
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 16px;
    }
  
    .close-button {
      padding: 8px 24px;
      background-color: #1f2937;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      border: none;
    }
  
    .close-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
  </style>