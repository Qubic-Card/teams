<script>
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';

  export let title, showModal, isUnsplash, state;

  const dispatch = createEventDispatcher();

  const toggleModal = () => dispatch('showModal');
</script>

<!-- <button class="bg-neutral-400 p-2" on:click={() => (open = true)}>Open</button> -->
<ModalOverlay isOpen={showModal} on:click={() => (showModal = false)} />

<Dialog
  open={showModal}
  on:close={toggleModal}
  class={`transition-all duration-300 ease-in-out flex flex-col h-auto w-1/2 p-3 gap-2 ${
    state === 'unsplash' ? 'top-10' : 'top-1/3'
  } right-1/4 z-50 fixed bg-neutral-800 text-white overflow-y-auto snap-y snap-mandatory rounded-md`}
>
  <div class="p-3 border-b-2 border-neutral-700 border-solid rounded-t">
    <div class="flex w-full text-white justify-between items-center">
      {#if isUnsplash}
        <div class="flex items-center">
          <p class="text-center">Powered By</p>
          <img
            src="/unsplash.svg"
            alt=""
            class="w-32 ml-2 mb-2 bg-white p-2 rounded-md"
          />
        </div>
      {:else}
        <h3 class="text-xl font-regular">{title ?? ''}</h3>
      {/if}
      <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">x</p>
    </div>
  </div>

  <slot />
</Dialog>
