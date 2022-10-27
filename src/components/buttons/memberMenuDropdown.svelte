<script>
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  let selected = 'Remove Member';

  const dispatch = createEventDispatcher();

  const remove = () => dispatch('remove');
  const go = () => dispatch('go');
</script>

<Listbox value={selected} on:change={(e) => (selected = e.detail)} let:open>
  {#if open}
    <div
      transition:fade|local={{ duration: 200 }}
      class="fixed inset-0 bg-black/50 z-50"
      aria-hidden="true"
    />
  {/if}
  <ListboxButton>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="white"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg></ListboxButton
  >

  <ListboxOptions
    class="absolute bg-neutral-900 -translate-x-44 border border-neutral-700 p-2 w-48 mt-2 shadow-md z-50 rounded-md"
  >
    <ListboxOption
      on:click={go}
      value="profile"
      class="flex hover:bg-neutral-700 text-white px-2 py-2 rounded-md cursor-pointer"
      >Edit user</ListboxOption
    >
    <ListboxOption
      value="remove"
      on:click={remove}
      class="flex hover:bg-neutral-700 text-red-600 px-2 py-2 rounded-md cursor-pointer"
      >Remove Member</ListboxOption
    >
  </ListboxOptions>
</Listbox>
