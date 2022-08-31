<script>
  import { Menu, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';
  import { createEventDispatcher } from 'svelte';

  export let value, label, searchMenu;

  const dispatch = createEventDispatcher();

  const selectHandler = (item) => dispatch('select', item);
</script>

<div class="flex w-full md:w-auto">
  <input
    type="text"
    class="w-full rounded-md md:w-[300px] lg:w-[400px] h-12 p-2 mb-2 border-2 border-neutral-700
  text-white bg-neutral-900"
    placeholder="Search"
    bind:value
  />
  <Menu as="div" class="mx-2" let:open>
    <DropdownButton class="w-28" label={label ?? 'Name'} />
    {#if open}
      <div>
        <MenuItems
          class={`${$$props.class} z-50 absolute rounded-md flex flex-col bg-neutral-900 -translate-y-5 translate-x-4 shadow-md border border-neutral-700 p-2 w-40`}
        >
          {#each searchMenu as item}
            <MenuItem
              class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
              on:click={() => {
                selectHandler(item);
                open = false;
              }}
            >
              {item.name}
            </MenuItem>
          {/each}
        </MenuItems>
      </div>
    {/if}
  </Menu>
</div>
