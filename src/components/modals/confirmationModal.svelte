<script>
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

  export let text,
    heading,
    buttonLabel,
    showModal,
    toggleModal,
    isDelete,
    isIconVisible;

  // Button Cancel
</script>

{#if isIconVisible}
  <img
    src="/delete-icon.svg"
    alt=""
    class="w-6 h-6 cursor-pointer"
    on:click={toggleModal}
  />
{/if}

<ModalWrapper
  title={isDelete ? 'Delete connection' : 'Change role'}
  {showModal}
  on:showModal={toggleModal}
  class="w-1/2"
>
  <div
    class="flex flex-col w-full justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
  >
    <h1 class="text-xl text-white font-bold text-center">
      {heading ?? ''} <br />{text ?? ''}
    </h1>
    {#if isDelete}
      <p class="text-sm text-neutral-100 font-semibold">
        This action cannot be undone.
      </p>
    {/if}
    <div class="flex gap-2 w-full">
      <button
        on:click={toggleModal}
        class="text-lg font-semibold text-white p-2 rounded-md border-2 border-neutral-700 w-full mt-6 hover:bg-neutral-800"
        >Cancel</button
      >
      <button
        on:click
        class={`text-lg font-semibold ${
          isDelete
            ? 'text-red-600'
            : 'text-white bg-blue-600 hover:bg-blue-600/80'
        } p-2 rounded-md border-2 border-neutral-700 w-full mt-6 hover:bg-neutral-800`}
        >{buttonLabel ?? 'Action'}
      </button>
    </div>
  </div>
</ModalWrapper>
