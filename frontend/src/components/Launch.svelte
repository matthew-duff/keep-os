<script lang="ts">
  import { Ellipsis } from '@lucide/svelte';
</script>

<div class="flex flex-col w-[400px] h-[600px] bg-primary font-serif text-base">
  <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
    <div class="flex items-center gap-3">
      <h1>K</h1>
    </div>
    <button class="px-4 py-1 bg-gray-800 hover:bg-gray-600 text-white font-sans text-sm transition-all duration-200 hover:shadow-md">
      Sign in
    </button>
  </div>

  <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
    <h2 class="text-gray-800 font-medium">You're more conscious with Keep.</h2>
    <button class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
      <Ellipsis size={20} class="text-gray-800" />
    </button>
  </div>

  <div class="p-4 flex-1">
    <h3 class="text-gray-800 font-medium mb-8">This year,</h3>
    
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <span class="text-gray-600">🌊 Water conserved</span>
        <span class="text-gray-800 font-medium">2,450 L</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">🌲 Trees conserved</span>
        <span class="text-gray-800 font-medium">12 trees</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">✈️ Carbon conserved</span>
        <span class="text-gray-800 font-medium">145 kg</span>
      </div>
    </div>
  </div>

  <div class="border-t border-gray-200 p-4 flex justify-between items-center mt-auto">
    <span class="text-gray-600">You're more conscious with friends.</span>
    <button class="px-4 py-1 bg-gray-800 hover:bg-gray-600 text-white font-sans text-sm transition-all duration-200 hover:shadow-md">
      Invite
    </button>
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    width: 400px;
    height: 600px;
    background-color: (--background);
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid (--border-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
    height: 48px;
  }
  
  .heading-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid (--border-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .left-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .content {
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
  }

  

  .settings-icon {
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .login-button {
    padding: 0.5rem 1rem;
    background-color: (--secondary);
    color: (--text);
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .login-button:hover {
    background-color: (--primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .login-button:active {
    transform: translateY(0);
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  p {
    margin: 0;
  }
</style>
