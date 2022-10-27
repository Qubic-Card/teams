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

  let selected = sortOptions[0];

  const dispatch = createEventDispatcher();

  const remove = () => dispatch('remove');
  const go = () => dispatch('go');
</script>

<Listbox
  class="w-1/2"
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
    class="bg-neutral-800 p-2 w-full h-11 md:text-sm text-xs flex items-center rounded-md"
  >
    <span class="text-neutral-400 mr-2">Added by:</span>
    {selected}</ListboxButton
  >

  <ListboxOptions
    class="absolute bg-neutral-900 outline outline-1 outline-neutral-700 p-2 w-72 mt-2 shadow-md z-50 rounded-md"
  >
    {#each sortOptions as item}
      <ListboxOption
        on:click={go}
        value={item}
        class="flex hover:bg-neutral-700 text-white px-2 py-2 rounded-md cursor-pointer"
        >{item}</ListboxOption
      >
    {/each}
  </ListboxOptions>
</Listbox>
