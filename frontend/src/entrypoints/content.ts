import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Suppress YouTube widget errors
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('www-widgetapi.js')) return;
      originalError.apply(console, args);
    };

    function checkForCheckout() {
      // 1. Common words for detecting checkout-related URLs
      const checkoutKeywords = ["checkout", "payment", "order", "billing", "purchase", "confirm", "cart/checkout"];
      const url = window.location.href.toLowerCase();
      const isCheckoutURL = checkoutKeywords.some(keyword => url.includes(keyword));
  
      // 2. Common words for payment fields
      const paymentFieldKeywords = ["card", "credit", "cvv", "security", "expiration", "expiry", "cc"];
      const hasPaymentFields = paymentFieldKeywords.some(keyword =>
          document.querySelector(`input[name*="${keyword}"], input[id*="${keyword}"]`)
      );
  
      // 3. Common words for checkout buttons
      const checkoutButtonKeywords = ["place order", "pay now", "confirm purchase", "complete order", "submit payment"];
      const hasCheckoutButton = Array.from(document.querySelectorAll("button, input[type='submit']")).some(button =>
          checkoutButtonKeywords.some(keyword => (button as HTMLElement).innerText.toLowerCase().includes(keyword))
      );
  
      // 4. Common words for order summary & totals
      const totalKeywords = ["total", "order total", "grand total", "subtotal", "summary", "balance due"];
      const hasOrderSummary = totalKeywords.some(keyword =>
          document.body.innerText.toLowerCase().includes(keyword)
      );
  
      // 5. Require at least two positive indicators to avoid false positives
      const checkoutIndicators = [isCheckoutURL, hasPaymentFields, hasCheckoutButton, hasOrderSummary].filter(Boolean).length;
      return checkoutIndicators >= 2; // Ensures accuracy
    }

    async function sendToPythonServer(data: any) {
      try {
        console.log('[CONTENT] Sending data to Python server:', data);
        
        // First test the connection
        try {
          console.log('[CONTENT] Testing server connection...');
          const testResponse = await fetch('http://localhost:8000/test', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
            }
          });
          
          if (!testResponse.ok) {
            throw new Error(`Test failed with status: ${testResponse.status}`);
          }
          
          const testResult = await testResponse.json();
          console.log('[CONTENT] Server test successful:', testResult);
        } catch (testError) {
          console.error('[CONTENT] Server test failed:', testError);
          throw new Error('Failed to connect to analysis server');
        }
        
        // If test succeeds, send the actual request
        const response = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('[CONTENT] Received response from Python server:', result);
        
        // Send the results back to the background script
        chrome.runtime.sendMessage({ 
          type: 'PYTHON_SERVER_RESPONSE', 
          data: result 
        });

        return result;
      } catch (error) {
        console.error('[CONTENT] Error communicating with Python server:', error);
        throw error;
      }
    }


    function getPageData() {
      const isCheckoutPage = checkForCheckout();
      const data = {
        title: document.title,
        url: window.location.href,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        isCheckoutPage,
        text: document.body.innerText,
      };

      // If checkout is detected, notify the background script and send to Python server
      if (isCheckoutPage) {
        chrome.runtime.sendMessage({ type: 'CHECKOUT_DETECTED', data });
        sendToPythonServer(data).catch(error => {
          console.error('[CONTENT] Failed to get response from Python server:', error);
        });
      }

      return data;
    }

    // Initial check when script loads
    getPageData();

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'GET_PAGE_DATA') {
        sendResponse(getPageData());
        return true;
      }
      
      if (message.type === 'ANALYZE_WITH_PYTHON') {
        sendToPythonServer(message.data)
          .then(result => sendResponse({ success: true, data: result }))
          .catch(error => sendResponse({ success: false, error: String(error) }));
        return true; // Will respond asynchronously
      }
    });
  }
});