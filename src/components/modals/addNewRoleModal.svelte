<script>
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let isOpen;

  let dispatch = createEventDispatcher();
  const closeDialog = () => dispatch('close', { isOpen: false });
</script>

<Dialog
  open={isOpen}
  on:close={closeDialog}
  class="overflow-x-hidden overflow-y-auto fixed top-72 left-32 md:left-60 lg:left-96 inset-0 z-20 outline-none focus:outline-none justify-center items-center flex flex-col bg-neutral-200 h-1/2 w-1/2 rounded-lg"
>
  <DialogOverlay />

  <DialogTitle class="bg-white p-4 w-56">Deactivate account</DialogTitle>
  <DialogDescription>
    This will permanently deactivate your account
  </DialogDescription>

  <p>
    Are you sure you want to deactivate your account? All of your data will be
    permanently removed. This action cannot be undone.
  </p>

  <button on:click={closeDialog}>Deactivate</button>
  <button on:click={closeDialog}>Cancel</button>
</Dialog>
