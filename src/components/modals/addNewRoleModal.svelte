<script>
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let isOpen;
  export let roleName;
  $: console.log(roleName);
  let dispatch = createEventDispatcher();
  const closeDialog = () => dispatch('close', { isOpen: false });
  const setName = () => dispatch('setName', { roleName: roleName });
</script>

<Dialog
  open={isOpen}
  on:close={closeDialog}
  class="overflow-x-hidden overflow-y-auto fixed top-72 left-32 md:left-60 lg:left-96 inset-0 z-20 outline-none focus:outline-none flex flex-col bg-neutral-900 text-white p-4 h-1/2 w-1/2 rounded-lg"
>
  <DialogOverlay />

  <DialogTitle class="w-full font-bold text-2xl">Add new role</DialogTitle>
  <input
    type="text"
    bind:value={roleName}
    class="text-black p-2"
    placeholder="Role name"
  />
  <button class="bg-white p-4 w-20 text-black mt-2" on:click={setName}
    >Add</button
  >
  <button on:click={closeDialog}>Deactivate</button>
  <button on:click={closeDialog}>Cancel</button>
</Dialog>
