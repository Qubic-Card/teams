<script>
  import { fade } from 'svelte/transition';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { selectedProfileMenu } from '@lib/stores/subsEndStore';

  let options = ['Transfer to owner(s)', 'Transfer to a Qubic user'];

  let selected = options[0];
</script>

<div class="flex items-center gap-2">
  <Listbox
    value={selected}
    class="w-full"
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
      class="outline outline-1 outline-neutral-700 text-left p-2 rounded-md hover:outline-neutral-600 w-full flex justify-between items-center"
    >
      {selected} <span>▼</span>
    </ListboxButton>

    {#if open}
      <div transition:fade|local={{ duration: 100 }}>
        <ListboxOptions
          class="absolute bg-neutral-900 outline outline-1 outline-neutral-700 p-2 w-96 mt-2 shadow-md z-50 gap-2 flex flex-col rounded-md"
        >
          {#each options as item}
            <ListboxOption
              class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer text-xs md:text-sm break-all {selected ===
              item
                ? 'bg-neutral-700'
                : ''}"
              on:click={() => ($selectedProfileMenu = item)}
              value={item}
            >
              {item}
            </ListboxOption>
          {/each}
        </ListboxOptions>
      </div>
    {/if}
  </Listbox>
</div>
