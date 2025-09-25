import { defineBackground } from 'wxt/sandbox';

interface PageData {
  title: string;
  url: string;
  description: string;
  isCheckoutPage: boolean;
}

export default defineBackground({
  main() {
    console.log('[BACKGROUND] Background script initialized');
    let lastDetectedPage: PageData | null = null;

    // Keep track of tabs where content script is ready
    const contentScriptTabs = new Set<number>();

    // Listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[BACKGROUND] Received message:', message.type, message);
      
      if (message.type === 'CONTENT_SCRIPT_READY' && sender.tab?.id) {
        console.log('[BACKGROUND] Content script ready in tab:', sender.tab.id);
        contentScriptTabs.add(sender.tab.id);
        sendResponse({ success: true });
        return true;
      }

      if (message.type === 'PYTHON_SERVER_RESPONSE' && message.data) {
        console.log('[BACKGROUND] Received Python server response:', message.data);
        // Show the modal with the Python server's response data
        if (sender.tab?.id) {
          sendModalMessage(sender.tab.id, message.data);
        }
        return true;
      }

      if (message.type === 'CHECKOUT_DETECTED') {
        console.log('[BACKGROUND] Checkout detected with data:', message.data);
        // Save the last detected page
        lastDetectedPage = message.data;

        // Ping API
        // Ping Python API server
        fetch('http://localhost:5000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message.data)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('[BACKGROUND] Python API response:', data);
          // Send analysis results to content script
          if (sender.tab?.id) {
            sendModalMessage(sender.tab.id, data);
          }
        })
        .catch(error => {
          console.error('[BACKGROUND] Error calling Python API:', error);
        });
        
        // Send message to content script to show modal
        if (sender.tab?.id) {
          console.log('[BACKGROUND] Sending SHOW_MODAL to tab', sender.tab.id);
          try {
            if (!contentScriptTabs.has(sender.tab.id)) {
              console.log('[BACKGROUND] Content script not ready, injecting...');
              chrome.scripting.executeScript({
                target: { tabId: sender.tab.id },
                files: ['content-scripts/modal.content.js']
              }).then(() => {
                // Wait a bit for the script to initialize
                setTimeout(() => {
                  sendModalMessage(sender.tab!.id!, message.data);
                }, 500);
              }).catch(err => {
                console.error('[BACKGROUND] Error injecting content script:', err);
              });
            } else {
              sendModalMessage(sender.tab.id, message.data);
            }
          } catch (err) {
            console.error('[BACKGROUND] Exception sending message:', err);
          }
        } else {
          console.error('[BACKGROUND] No tab ID found in sender:', sender);
        }
      }

      // Handle modal close request
      if (message.type === 'CLOSE_MODAL') {
        console.log('[BACKGROUND] Closing modal');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            try {
              chrome.tabs.sendMessage(
                tabs[0].id, 
                { type: 'CLOSE_MODAL' },
                (response) => {
                  const lastError = chrome.runtime.lastError;
                  if (lastError) {
                    const errorMsg = typeof lastError.message === 'string' ? 
                      lastError.message : JSON.stringify(lastError);
                    console.error('[BACKGROUND] Error closing modal:', errorMsg);
                  } else {
                    console.log('[BACKGROUND] Close modal response:', response);
                  }
                }
              );
            } catch (err) {
              console.error('[BACKGROUND] Exception closing modal:', err);
            }
          }
        });
        
        // Always send a response to the caller
        sendResponse({ success: true });
        return true;
      }

      // Debug command to test the modal directly
      if (message.type === 'DEBUG_SHOW_MODAL') {
        console.log('[BACKGROUND] Debug show modal requested');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            const debugData = {
              title: 'Debug Modal',
              url: tabs[0].url || 'unknown',
              description: 'This is a test modal triggered for debugging',
              isCheckoutPage: true
            };
            try {
              chrome.tabs.sendMessage(
                tabs[0].id, 
                { type: 'SHOW_MODAL', data: debugData },
                (response) => {
                  const lastError = chrome.runtime.lastError;
                  if (lastError) {
                    const errorMsg = typeof lastError.message === 'string' ? 
                      lastError.message : JSON.stringify(lastError);
                    console.error('[BACKGROUND] Error showing debug modal:', errorMsg);
                    // Try pinging to see if content script is alive
                    if (tabs[0]?.id) {
                      pingContentScript(tabs[0].id);
                    }
                  } else {
                    console.log('[BACKGROUND] Debug modal response:', response);
                  }
                }
              );
            } catch (err) {
              console.error('[BACKGROUND] Exception showing debug modal:', err);
            }
          }
        });
        
        // Always send a response to the caller
        sendResponse({ success: true });
        return true;
      }
      
      // Return true for async responses
      return true;
    });

    function sendModalMessage(tabId: number, data: any) {
      chrome.tabs.sendMessage(
        tabId, 
        { type: 'SHOW_MODAL', data },
        (response) => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            const errorMsg = typeof lastError.message === 'string' ? 
              lastError.message : JSON.stringify(lastError);
            console.error('[BACKGROUND] Error sending message:', errorMsg);
            
            // Try pinging to see if content script is alive
            pingContentScript(tabId);
          } else {
            console.log('[BACKGROUND] Response from content script:', response);
          }
        }
      );
    }

    function pingContentScript(tabId: number) {
      console.log('[BACKGROUND] Pinging content script in tab', tabId);
      try {
        chrome.tabs.sendMessage(
          tabId, 
          { type: 'PING' },
          (response) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) {
              const errorMsg = typeof lastError.message === 'string' ? 
                lastError.message : JSON.stringify(lastError);
              console.error('[BACKGROUND] Content script not responding:', errorMsg);
              console.log('[BACKGROUND] This may mean the content script is not injected in this tab.');
              
              // Try injecting the content script
              chrome.scripting.executeScript({
                target: { tabId },
                files: ['content-scripts/modal.content.js']
              }).catch(err => {
                console.error('[BACKGROUND] Error injecting content script:', err);
              });
            } else {
              console.log('[BACKGROUND] Ping response:', response);
            }
          }
        );
      } catch (err) {
        console.error('[BACKGROUND] Exception pinging content script:', err);
      }
    }

    // Add global debugging functions
    // @ts-ignore
    chrome.runtime.__debugModal = {
      showDebugModal: () => {
        console.log('[BACKGROUND] Manual debug modal trigger');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            const debugData = {
              title: 'Debug Modal',
              url: tabs[0].url || 'unknown',
              description: 'This is a test modal triggered for debugging',
              isCheckoutPage: true
            };
            sendModalMessage(tabs[0].id, debugData);
          }
        });
      },
      pingContentScript: () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) pingContentScript(tabs[0].id);
        });
      }
    };

    console.log('[BACKGROUND] Background script setup complete');
  }
});
