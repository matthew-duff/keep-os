import Modal from '../../components/Modal.svelte';

let modalInstance: Modal | null = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SHOW_MODAL' && message.data) {
    showModal(message.data);
  } else if (message.type === 'CLOSE_MODAL') {
    closeModal();
  }
});

function showModal(data: any) {
  // Create container if it doesn't exist
  let container = document.getElementById('keep-modal-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'keep-modal-container';
    document.body.appendChild(container);
  }

  // Create new modal instance
  modalInstance = new Modal({
    target: container,
    props: {
      title: data.title,
      url: data.url,
      description: data.description
    }
  });
}

function closeModal() {
  if (modalInstance) {
    modalInstance.$destroy();
    modalInstance = null;
    
    // Remove container
    const container = document.getElementById('keep-modal-container');
    if (container) {
      container.remove();
    }
  }
} 