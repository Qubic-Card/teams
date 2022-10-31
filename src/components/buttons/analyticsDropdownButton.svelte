<script>
  import { Menu, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let selectedDays = '3 Days';

  const select = (day) => {
    selectedDays = day;
    dispatch('select', day);
  };

  let days = ['3 Days', '7 Days', '14 Days', '30 Days'];
</script>

<Menu as="div" class="mx-2 flex justify-end" let:open>
  {#if open}
    <div
      transition:fade|local={{ duration: 200 }}
      class="fixed inset-0 bg-black/50 z-20"
      aria-hidden="true"
    />
  {/if}
  <DropdownButton label={selectedDays ?? '3 Days'} />

  {#if open}
    <MenuItems
      class={`${$$props.class} mt-16 z-40 gap-2 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40`}
    >
      {#each days as item}
        <MenuItem
          class={`p-2 hover:bg-neutral-700 cursor-pointer rounded-md ${
            item === selectedDays ? 'bg-neutral-700' : ''
          }`}
          on:click={() => {
            select(item);
          }}
        >
          {item}
        </MenuItem>
      {/each}
    </MenuItems>
  {/if}
</Menu>
