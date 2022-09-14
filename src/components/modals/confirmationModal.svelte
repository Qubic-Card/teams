<script>
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';
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
    heading,
    buttonLabel,
    showModal,
    toggleModal,
    id,
    deleteRoleHandler;
  const dispatch = createEventDispatcher();
  const action = () => dispatch('action');
  // Button Cancel
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
  <ModalWrapper
    title={isDelete
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
      : 'Change role'}
    {showModal}
    on:showModal={toggleModal}
    class="w-[90%] md:w-1/2"
  >
    <div
      class="flex flex-col w-full justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
    >
      <h1
        class="text-sm md:text-xl text-white font-bold text-center w-96 truncate"
      >
        {heading ?? ''} <br />{text ?? ''}
      </h1>
      {#if isDelete}
        <p class="text-xs md:text-sm text-neutral-100 font-semibold">
          This action cannot be undone.
        </p>
      {/if}
      <div class="flex gap-2 w-full">
        <button
          on:click={toggleModal}
          class="text-sm md:text-lg font-semibold text-white p-2 rounded-md border-2 border-neutral-700 w-full mt-6 hover:bg-neutral-800"
          >Cancel</button
        >
        <button
          disabled={isLoading}
          on:click={async () =>
            isDispatch ? action() : await deleteRoleHandler(id)}
          class={`text-sm md:text-lg font-semibold ${
            isDelete
              ? 'bg-red-600 hover:bg-red-600/80'
              : 'bg-blue-600 hover:bg-blue-600/80'
          } p-2 rounded-md border-2 text-white border-neutral-700 w-full mt-6 hover:bg-neutral-800 flex justify-center items-center gap-2`}
        >
          {#if isLoading}
            <Spinner class="w-6 h-6" />
          {/if}
          {buttonLabel ?? 'Action'}
        </button>
      </div>
    </div>
  </ModalWrapper>
{/if}
