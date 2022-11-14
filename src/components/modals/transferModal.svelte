<script>
  import TransferProfileDropdown from '@comp/buttons/transferProfileDropdown.svelte';
  import TransferAddressDropdown from '@comp/buttons/transferAddressDropdown.svelte';
  import Input from '@comp/input.svelte';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import {
    selectedAddress,
    selectedProfileMenu,
  } from '@lib/stores/subsEndStore';

  export let bulkTransfer = false,
    disabled;

  let showModal = false;

  const toggleModal = () => {
    showModal = !showModal;
    $selectedAddress.choosen = 0;
    $selectedProfileMenu = 'Transfer with current profile';
  };
  const dispatch = createEventDispatcher();

  const handleTransfer = () => {
    dispatch('transfer');
    toggleModal();
  };

  // $: console.log($selectedAddress);
</script>

<button
  {disabled}
  type="button"
  on:click={toggleModal}
  class="p-2 rounded-md text-xs md:text-sm disabled:opacity-50 flex justify-center items-center h-10 md:h-full {bulkTransfer
    ? 'bg-blue-600'
    : 'bg-neutral-800 outline outline-1 outline-neutral-700'}"
>
  {bulkTransfer ? 'Transfer Selected' : 'Transfer'}
</button>

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => {
      showModal = false;
      $selectedAddress.choosen = 0;
    }}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-30 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col justify-between bg-neutral-800 text-white w-full md:w-[30%] h-auto p-4 z-40 rounded-md gap-8 outline outline-1 outline-neutral-700"
    >
      <h1 class="text-lg">Select how you want to transfer</h1>
      <div class="flex flex-col gap-2">
        <TransferProfileDropdown />
        <TransferAddressDropdown />
        {#if $selectedAddress.choosen === 1}
          <Input
            title=""
            placeholder="Email"
            bind:value={$selectedAddress.email}
            inputbg="bg-neutral-900"
          />
        {/if}
      </div>
      <div class="flex flex-col">
        <h2>This action cannot be undone.</h2>
        <h2>Transfer card(s) cannot be recovered from their new owner.</h2>
      </div>
      <div class="flex gap-2 w-full justify-end mt-10">
        <button
          on:click={toggleModal}
          class="outline outline-1 outline-neutral-700 w-40 p-2 rounded-md text-center hover:outline-neutral-600"
          >Cancel</button
        >
        <button
          on:click={handleTransfer}
          class="outline outline-1 outline-red-500 hover:outline-red-600 w-40 bg-red-600/40 p-2 rounded-md text-center"
          >Proceed</button
        >
      </div>
    </div>
  </Dialog>
{/if}
