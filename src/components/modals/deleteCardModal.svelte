<script>
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let bulkDelete = false,
    disabled;

  let showModal = false;

  const toggleModal = () => (showModal = !showModal);
  const dispatch = createEventDispatcher();
  const handleDelete = () => {
    dispatch('delete');
    toggleModal();
  };
</script>

{#if bulkDelete}
  <button
    {disabled}
    type="button"
    on:click={toggleModal}
    class="p-2 rounded-md text-xs md:text-sm flex justify-center items-center h-10 md:h-full bg-red-600/30 outline outline-1 outline-red-500 disabled:opacity-50"
  >
    Delete Selected
  </button>
{:else}
  <button
    class="outline outline-1 outline-neutral-700 p-1 rounded-md ml-2 w-8 justify-center items-center flex cursor-pointer"
    on:click={toggleModal}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#ef4444"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </button>
{/if}

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-30 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col justify-between bg-neutral-800 text-white w-full md:w-[30%] h-auto p-4 z-40 rounded-md gap-8 outline outline-1 outline-neutral-700"
    >
      <h1 class="text-lg">Are you sure?</h1>
      <div class="flex flex-col">
        <h2>This action cannot be undone.</h2>
        <h2>Deleted card(s) are not recoverable.</h2>
        <h2>Make sure you only delete if you don't need the card.</h2>
      </div>
      <div class="flex gap-2 w-full justify-end mt-10">
        <button
          on:click={toggleModal}
          class="outline outline-1 outline-neutral-700 w-40 p-2 rounded-md text-center hover:outline-neutral-600"
          >Cancel</button
        >
        <button
          on:click={handleDelete}
          class="outline outline-1 outline-red-500 hover:outline-red-600 w-40 bg-red-600/40 p-2 rounded-md text-center"
          >Proceed</button
        >
      </div>
    </div>
  </Dialog>
{/if}
