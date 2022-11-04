<script>
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let sortOptions = [];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const dispatch = createEventDispatcher();

  const handleFilter = (e) => dispatch('filter', e);

  let selected = sortOptions[0];
</script>

<Listbox
  class="w-full"
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
  <ListboxButton
    class="bg-neutral-800 p-2 w-full h-8 md:text-sm text-xs flex items-center justify-between rounded-md"
  >
    <span class="text-neutral-400 mr-2"
      >Added by: <span class="text-white">{capitalize(selected)}</span></span
    >
    <span>▼</span></ListboxButton
  >

  <ListboxOptions
    class="absolute bg-neutral-900 border border-neutral-700 p-2 w-52 mt-2 shadow-md z-50 rounded-md"
  >
    {#each sortOptions as item}
      <ListboxOption
        on:click={() => handleFilter(item)}
        value={item}
        class="flex hover:bg-neutral-700 text-white px-2 py-2 rounded-md cursor-pointer md:text-sm text-xs {item ===
        selected
          ? 'bg-neutral-700'
          : ''}">{capitalize(item)}</ListboxOption
      >
    {/each}
  </ListboxOptions>
</Listbox>
