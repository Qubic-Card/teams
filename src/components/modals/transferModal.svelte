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
  import { searchProfile } from '@lib/query/transferCard';
  export let bulkTransfer = false,
    disabled,
    card,
    selectedCards;

  let showModal = false;
  let email = '';

  const toggleModal = () => {
    showModal = !showModal;

    if (
      card
        ? card.email == null
        : selectedCards.filter((c) => c.email == null).length > 0
    ) {
      $selectedAddress.choosen = 1;
    } else {
      $selectedAddress.choosen = 0;
    }

    $selectedAddress.uid = '';
    email = '';
    $selectedProfileMenu = 'Transfer with current profile';
  };
  const dispatch = createEventDispatcher();

  const handleTransfer = () => {
    dispatch('transfer');
    toggleModal();
  };
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
      class="flex flex-col justify-between bg-neutral-800 text-white w-full md:w-[30%] h-auto p-4 z-40 rounded-md gap-8"
    >
      <h1 class="text-lg">Select how you want to transfer</h1>
      <div class="flex flex-col gap-2">
        {#if card ? card.email == null : selectedCards.filter((c) => c.email == null).length > 0}
          <h1
            class="outline outline-1 outline-neutral-700 text-left p-2 rounded-md hover:outline-neutral-600 w-full flex justify-between items-center"
          >
            Transfer card only
          </h1>
          <h1
            class="outline outline-1 outline-neutral-700 text-left p-2 rounded-md hover:outline-neutral-600 w-full flex justify-between items-center"
          >
            Transfer to a Qubic User
          </h1>
        {:else}
          <TransferProfileDropdown />
          <TransferAddressDropdown />
        {/if}
        {#if $selectedAddress.choosen === 1}
          <Input
            title=""
            placeholder="Email"
            bind:value={email}
            on:change={async () => await searchProfile(email)}
            inputbg="bg-neutral-900"
            isEmailInput
          />
          {#if email !== ''}
            {#if $selectedAddress.uid}
              <small class="text-green-500"> User found! </small>
            {:else}
              <small class="text-red-500"> User not found! </small>
            {/if}
          {/if}
          <small class="text-red-500">
            All selected card(s) will be tranferred to this email
          </small>
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
          disabled={$selectedAddress.choosen === 1
            ? $selectedAddress.uid === ''
            : false}
          on:click={handleTransfer}
          class="outline outline-1 outline-red-500 hover:outline-red-600 w-40 bg-red-600/40 p-2 rounded-md text-center disabled:opacity-50"
          >Proceed</button
        >
      </div>
    </div>
  </Dialog>
{/if}
