<script>
  import { Menu, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let selectedType;

  const select = (type) => {
    selectedType = type;
    dispatch('select', type);
    // selectedType = 'Choose Type';
  };

  let days = ['Activities', 'Connections'];
</script>

<Menu as="div" class="flex w-full" let:open>
  <div class="flex flex-col gap-2 w-full">
    <p class="text-gray-400">Type</p>
    <DropdownButton label={selectedType} class="w-full" />
  </div>

  {#if open}
    <div
      transition:fade|local={{ duration: 200 }}
      class="fixed inset-0 bg-black/50 z-20"
      aria-hidden="true"
    />
  {/if}

  {#if open}
    <MenuItems
      class={`${$$props.class} mt-24 gap-2 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md outline outline-1 outline-neutral-800 p-2 w-64`}
    >
      {#each days as item}
        <MenuItem
          class={`p-2 hover:bg-neutral-800 cursor-pointer rounded-md ${
            item === selectedType ? 'bg-neutral-800' : ''
          }`}
          on:click={() => {
            select(item);
            // selectedType = 'Choose Type';
            // open = false;
          }}
        >
          {item}
        </MenuItem>
      {/each}
    </MenuItems>
  {/if}
</Menu>
