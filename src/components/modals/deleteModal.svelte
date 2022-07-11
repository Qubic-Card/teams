<script>
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

  export let data, showModal, toggleModal;
</script>

<img
  src="/delete-icon.svg"
  alt=""
  class="w-6 h-6 cursor-pointer"
  on:click={toggleModal}
/>
<ModalWrapper
  title="Delete connection"
  {showModal}
  on:showModal={toggleModal}
  class="w-1/2"
>
  <div
    class="flex flex-col w-full justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
  >
    <h1 class="text-xl text-white font-bold text-center">
      Are you sure you want to delete <br />
      {data.profileData?.firstname ?? data?.name}
      {data.profileData?.lastname ?? ''} ?
    </h1>
    <p class="text-sm text-neutral-100 font-semibold">
      This action cannot be undone.
    </p>
    <button
      on:click
      class="text-lg font-semibold text-red-600 p-2 rounded-md border-2 border-neutral-700 w-full mt-6 hover:bg-neutral-800"
      >Delete
    </button>
  </div>
</ModalWrapper>
