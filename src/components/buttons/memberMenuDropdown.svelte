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

<Listbox
  class={$$props.class}
  value={selected}
  on:change={(e) => (selected = e.detail)}
  let:open
>
  {#if open}
    <div
      transition:fade|local={{ duration: 200 }}
      class="fixed inset-0 bg-black/50 z-50"
      aria-hidden="true"
    />
  {/if}
  <ListboxButton class="flex justify-center items-center">
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
        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  </ListboxButton>

  <ListboxOptions
    class="absolute bg-neutral-900 -translate-x-44 border border-neutral-800 p-2 w-48 mt-2 shadow-md z-50 rounded-md"
  >
    <ListboxOption
      on:click={go}
      value="profile"
      class="flex hover:bg-neutral-800 text-white px-2 py-2 rounded-md cursor-pointer"
      >Edit user</ListboxOption
    >
    <ListboxOption
      value="remove"
      on:click={remove}
      class="flex hover:bg-neutral-800 text-red-600 px-2 py-2 rounded-md cursor-pointer"
      >Remove Member</ListboxOption
    >
  </ListboxOptions>
</Listbox>
