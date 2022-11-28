<script>
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import Spinner from '@comp/loading/spinner.svelte';
  import { createEventDispatcher } from 'svelte';

  export let isDelete,
    isIconVisible,
    isLoading,
    buttonLabel,
    showModal,
    toggleModal;

  const dispatch = createEventDispatcher();
  const action = () => dispatch('action');
</script>

{#if isIconVisible}
  <img
    src="/delete-icon.svg"
    alt=""
    class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
    on:click={toggleModal}
  />
{/if}

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-50 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col bg-neutral-800 text-white w-full md:w-[60%] lg:w-[40%] h-auto p-2 z-40 rounded-md border border-neutral-700"
    >
      <div
        class="text-md md:text-lg border-b border-neutral-700 flex justify-between"
      >
        <slot name="title" />

        <button on:click={toggleModal} class="self-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        class="flex flex-col w-full justify-center items-center p-2 rounded-lg gap-3"
      >
        <h1 class="text-white text-center w-96 text-sm md:text-md break-all">
          <slot name="text" />
        </h1>
        {#if isDelete}
          <p class="text-xs text-neutral-100 font-light">
            This action cannot be undone.
          </p>
        {/if}
        <div class="flex gap-2 w-full">
          <button
            on:click={toggleModal}
            class="text-sm text-white p-2 rounded-md border-2 border-neutral-700 w-full mt-6 hover:border-neutral-600"
            >Cancel</button
          >
          <button
            disabled={isLoading}
            on:click={action}
            class={`text-sm   ${
              buttonLabel === 'Remove' ||
              buttonLabel === 'Disconnect' ||
              buttonLabel === 'Proceed'
                ? 'bg-red-600/30 outline outline-1 outline-red-500 hover:outline-red-600'
                : 'bg-blue-600 hover:bg-blue-600/60'
            } p-2 rounded-md  text-white border-neutral-700 w-full mt-6 flex justify-center items-center gap-2`}
          >
            {#if isLoading}
              <Spinner bg={isDelete ? '#8d2020' : '#1f4496'} class="w-6 h-6" />
            {/if}
            {buttonLabel ?? 'Action'}
          </button>
        </div>
      </div>
    </div>
  </Dialog>
{/if}
