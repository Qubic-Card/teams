<script>
  import { Menu, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';

  const dispatch = createEventDispatcher();

  let selectedType = 'Choose Type';

  const select = (type) => {
    selectedType = type;
    dispatch('select', type);
  };

  let days = ['Logs', 'Connections'];
</script>

<Menu as="div" class="flex w-full" let:open>
  <div class="flex flex-col gap-2 w-full">
    <p>Type</p>
    <DropdownButton label={selectedType} class="w-full" />
  </div>

  {#if open}
    <MenuItems
      class={`${$$props.class} mt-24 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-64`}
    >
      {#each days as item}
        <MenuItem
          class={`p-2 hover:bg-black cursor-pointer rounded-md ${
            item === selectedType ? 'bg-black' : ''
          }`}
          on:click={() => {
            select(item);
            open = false;
          }}
        >
          {item}
        </MenuItem>
      {/each}
    </MenuItems>
  {/if}
</Menu>
