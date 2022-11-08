<script>
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import Spinner from '@comp/loading/spinner.svelte';
  import { createEventDispatcher } from 'svelte';

  export let text,
    isRecord,
    isMember,
    isRole,
    isTransfer,
    isDelete,
    isIconVisible,
    isDispatch,
    isLoading,
    isRedButton,
    isDisconnect,
    heading,
    buttonLabel,
    showModal,
    toggleModal,
    id,
    deleteRoleHandler;
  const dispatch = createEventDispatcher();
  const action = () => dispatch('action');
</script>

{#if isIconVisible}
  {#if isRedButton}
    <div
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
    </div>
  {:else}
    <img
      src="/delete-icon.svg"
      alt=""
      class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
      on:click={toggleModal}
    />
  {/if}
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
      class="flex flex-col bg-neutral-800 text-white w-full md:w-[40%] h-auto p-2 z-40 rounded-md"
    >
      <div
        class="text-md md:text-lg border-b border-neutral-700 flex justify-between"
      >
        {isDelete
          ? `Delete ${
              isRecord
                ? 'Record'
                : isMember
                ? 'Member'
                : isRole
                ? 'Role'
                : 'Connection'
            }`
          : isTransfer
          ? 'Transfer card'
          : isDisconnect
          ? 'Disconnect Card'
          : 'Change role'}
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
        <h1 class="text-white text-center w-96 text-sm md:text-md">
          {heading ?? ''} <br />{text ?? ''}
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
            on:click={async () =>
              isDispatch ? action() : await deleteRoleHandler(id)}
            class={`text-sm   ${
              isDelete || isTransfer || isDisconnect
                ? 'bg-red-600/30 outline outline-1 outline-red-500 hover:bg-red-600/80'
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
