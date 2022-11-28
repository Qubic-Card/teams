<script>
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let mode = 'member',
    widthMenu = 'w-36';

  export let sortOptions = ['Most Recent', 'Oldest'];
  export let selectedIndex = 0;
  let selected = sortOptions[selectedIndex];

  const dispatch = createEventDispatcher();

  const asc = () => dispatch('asc');
  const dsc = () => dispatch('dsc');
  // const select = (i) => dispatch('select', i);
</script>

<Listbox
  class={mode === 'member' ? 'w-full' : 'w-1/2'}
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
    class="bg-neutral-800 p-2 w-full {mode === 'member'
      ? 'h-8'
      : 'h-full'} md:text-sm text-xs flex items-center justify-between rounded-md"
  >
    {selected} <span>▼</span></ListboxButton
  >

  <ListboxOptions
    class="absolute bg-neutral-900 border border-neutral-700 p-2 w-[90%] md:w-40 mt-2 flex flex-col gap-2 {mode ===
    'member'
      ? ''
      : ''} shadow-md z-50 rounded-md"
  >
    {#each sortOptions as item, i}
      <ListboxOption
        on:click={() => {
          if (i === 0) {
            asc();
            selectedIndex = i;
          } else {
            dsc();
            selectedIndex = i;
          }
        }}
        value={item}
        class="flex hover:bg-neutral-700 text-white px-2 py-2 rounded-md cursor-pointer md:text-sm text-xs {selectedIndex ===
        i
          ? 'bg-neutral-700'
          : ''}">{item}</ListboxOption
      >
    {/each}
  </ListboxOptions>
</Listbox>
