/// <reference types="chrome"/>

import { defineContentScript } from 'wxt/sandbox';
import Modal from '../components/Modal.svelte';
import { mount } from 'svelte';
import { type ShoppingSearchResponse } from '../lib/types/search';

interface ModalProps {
  data: ShoppingSearchResponse[];
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  world: 'ISOLATED',
  main() {
    console.log('[CONTENT] Content script loaded in ISOLATED world');
    let modalInstance: ReturnType<typeof mount> | null = null;

    // Ensure the script is running in the correct context
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error('[CONTENT] Chrome APIs not available');
      return;
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[CONTENT] Message received:', message);
      
      if (message.type === 'SHOW_MODAL' && message.data) {
        console.log('[CONTENT] Showing modal with data:', message.data);
        
        try {
          // Create container if it doesn't exist
          let container = document.getElementById('keep-modal-container');
          if (container) {
            return;
          }

          console.log('[CONTENT] Creating container');
          container = document.createElement('div');
          container.id = 'keep-modal-container';
          document.body.appendChild(container);

          // Mount the Svelte component
          console.log('[CONTENT] Mounting Modal component');
          modalInstance = mount(Modal, {
            target: container,
            props: { data: [message.data] }
          });
          
          console.log('[CONTENT] Modal mounted successfully');
          sendResponse({ success: true });
        } catch (error) {
          console.error('[CONTENT] Error mounting modal:', error);
          sendResponse({ success: false, error: String(error) });
        }

        return true;
      }
      
      if (message.type === 'CLOSE_MODAL') {
        console.log('[CONTENT] Closing modal');
        const container = document.getElementById('keep-modal-container');
        if (container) {
          container.remove();
        }
        sendResponse({ success: true });
        return true;
      }

      if (message.type === 'PING') {
        console.log('[CONTENT] Ping received');
        sendResponse({ success: true, message: 'Content script is alive' });
        return true;
      }

      // Return true for async responses
      return true;
    });

    // Add debug function to window
    // @ts-ignore
    window.__debugModal = {
      showModal: (data: ModalProps = {
        data: [{
          search_metadata: {
            id: '1234',
            status: 'success',
            json_endpoint: 'https://example.com',
            created_at: '2021-09-01T00:00:00Z',
            processed_at: '2021-09-01T00:00:00Z',
            google_shopping_url: 'https://example.com',
            raw_html_file: 'https://example.com',
            total_time_taken: 1.23
          },
          search_parameters: {
            engine: 'google',
            q: 'iphone 13',
            location_requested: 'United States',
            location_used: 'United States',
            google_domain: 'google.com',
            hl: 'en',
            gl: 'us',
            start: 0,
            num: '10',
            device: 'desktop'
          },
          search_information: {
            shopping_results_state: 'success'
          },
          shopping_results: [
            {
              position: 1,
              title: 'iPhone 13',
              product_link: 'https://example.com',
              product_id: '1234',
              serpapi_product_api: 'https://example.com',
              immersive_product_page_token: '1234',
              serpapi_immersive_product_api: 'https://example.com',
              source: 'google',
              source_icon: 'https://example.com',
              price: '$799.00',
              extracted_price: 799,
              old_price: '$899.00',
              extracted_old_price: 899,
              rating: 4.5,
              reviews: 1000,
              thumbnail: 'https://example.com',
              delivery: 'Free delivery',
              extensions: ['Free returns'],
              tag: 'Best seller'
            }
          ]
        }]
      }) => {
        console.log('[DEBUG] Showing debug modal');
        const container = document.getElementById('keep-modal-container') || 
          document.createElement('div');
        container.id = 'keep-modal-container';
        document.body.appendChild(container);

        try {
          modalInstance = mount(Modal, {
            target: container,
            props: data
          });
          console.log('[DEBUG] Modal mounted successfully');
        } catch (error) {
          console.error('[DEBUG] Error mounting modal:', error);
        }
      },
      closeModal: () => {
        const container = document.getElementById('keep-modal-container');
        if (container) {
          container.remove();
        }
      }
    };

    // Notify that content script is ready
    chrome.runtime.sendMessage({ 
      type: 'CONTENT_SCRIPT_READY',
      url: window.location.href
    });

    console.log('[CONTENT] Setup complete');
  }
}); 