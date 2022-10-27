<script>
  import { fade } from 'svelte/transition';
  import Input from '@comp/input.svelte';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let value, searchMenu;
  export let editor = 'basic';

  const dispatch = createEventDispatcher();
  const selectedMenu = (menu) => dispatch('selected', menu.col);

  let selected = searchMenu[0];
</script>

<div
  class="flex justify-end items-center gap-2 {editor !== 'basic'
    ? 'w-full md:w-1/3 md:mr-4 md:ml-0 ml-4'
    : ''}"
>
  <Input
    class={editor === 'basic' ? 'w-full md:w-1/2 lg:w-1/4' : 'w-full'}
    placeholder="Search"
    title=""
    bind:value
    inputbg={editor === 'basic' ? 'bg-white' : 'bg-neutral-800'}
    inputText={editor === 'basic' ? 'text-black' : 'text-white'}
  />
  <Listbox value={selected} on:change={(e) => (selected = e.detail)} let:open>
    {#if open}
      <div
        transition:fade|local={{ duration: 200 }}
        class="fixed inset-0 bg-black/50 z-50"
        aria-hidden="true"
      />
    {/if}
    <ListboxButton
      class="{editor === 'basic'
        ? 'bg-black'
        : 'bg-neutral-800 border-2 border-neutral-700'} text-sm text-white rounded-md p-2 w-20"
      >{selected.label}</ListboxButton
    >
    {#if open}
      <div transition:fade|local={{ duration: 100 }}>
        <ListboxOptions
          class="absolute {editor === 'basic'
            ? 'bg-white -translate-x-24'
            : 'bg-neutral-900 -translate-x-20'} border border-neutral-700 p-2 w-40 mt-2 shadow-md z-50 rounded-md"
        >
          {#each searchMenu as menu}
            <ListboxOption
              value={menu}
              on:click={() => selectedMenu(menu)}
              class={`cursor-pointer my-1 text-sm ${
                editor === 'basic' ? 'hover:bg-black' : 'hover:bg-neutral-600'
              } hover:text-white p-2 rounded-md ${
                selected.label === menu.label
                  ? `${
                      editor === 'basic'
                        ? 'bg-black text-white'
                        : 'bg-neutral-600 text-white'
                    }`
                  : ''
              }`}
            >
              {menu.label}
            </ListboxOption>
          {/each}
        </ListboxOptions>
      </div>
    {/if}
  </Listbox>
</div>
