import { writable } from 'svelte/store';

export interface PageData {
  title: string;
  url: string;
  description: string;
  isCheckoutPage: boolean;
}

const defaultData: PageData = {
  title: '',
  url: '',
  description: '',
  isCheckoutPage: false
};

const createPageStore = () => {
  const { subscribe, set, update } = writable<PageData>(defaultData);

  return {
    subscribe,
    set,
    update,
    async refresh() {
      try {
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
          console.error('No active tab found');
          return;
        }

        // Request data from content script
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' });
        if (response) {
          set(response);
        }
      } catch (error) {
        console.error('Failed to get page data:', error);
        set(defaultData);
      }
    }
  };
};

export const pageStore = createPageStore(); 