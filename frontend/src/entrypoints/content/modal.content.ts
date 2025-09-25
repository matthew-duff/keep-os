import { defineContentScript } from 'wxt/sandbox';
import type { ComponentType } from 'svelte';
import Modal from '../../components/Modal.svelte';

interface ModalProps {
  title?: string;
  url?: string;
  description?: string;
}

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  world: 'ISOLATED',
  main() {
    console.log('[CONTENT] Content script loaded in ISOLATED world');
    let modalInstance: any = null;

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
          if (!container) {
            console.log('[CONTENT] Creating container');
            container = document.createElement('div');
            container.id = 'keep-modal-container';
            document.body.appendChild(container);
          }

          // Mount the Svelte component
          console.log('[CONTENT] Mounting Modal component');
          modalInstance = new Modal({
            target: container!,
            props: message.data
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
        if (modalInstance) {
          modalInstance.$destroy();
          modalInstance = null;
          const container = document.getElementById('keep-modal-container');
          if (container) {
            container.remove();
          }
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
        title: 'Debug Modal',
        url: 'debug-url',
        description: 'This is a debug modal'
      }) => {
        console.log('[DEBUG] Showing debug modal');
        const container = document.getElementById('keep-modal-container') || 
          document.createElement('div');
        container.id = 'keep-modal-container';
        document.body.appendChild(container);

        try {
          modalInstance = new Modal({
            target: container,
            props: data
          });
          console.log('[DEBUG] Modal mounted successfully');
        } catch (error) {
          console.error('[DEBUG] Error mounting modal:', error);
        }
      },
      closeModal: () => {
        if (modalInstance) {
          modalInstance.$destroy();
          modalInstance = null;
          const container = document.getElementById('keep-modal-container');
          if (container) container.remove();
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