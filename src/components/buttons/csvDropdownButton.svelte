<script>
  import {
    Menu,
    MenuItems,
    MenuItem,
    MenuButton,
  } from '@rgossiaux/svelte-headlessui';
  import getDates from '@lib/utils/getDates';
  import { CSVDownloader } from 'svelte-csv';
  import { createEventDispatcher } from 'svelte';
  import { user } from '@lib/stores/userStore';
  import { selectCsv, setSelectCsv } from '@lib/stores/selectCsv';

  export let data, updateLogs;

  const dispatch = createEventDispatcher();

  const select = (day) => {
    dispatch('select', day);
  };

  let days = ['7 Days', '30 Days', '90 Days', 'All'];
</script>

<Menu as="div" class="mx-2 flex justify-end mb-2" let:open>
  <MenuButton
    class={`text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md relative `}
  >
    Download CSV
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="white"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </MenuButton>

  {#if open}
    <MenuItems
      class={`${$$props.class} z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40`}
    >
      {#each days as item}
        <div
          class="p-2 hover:bg-black"
          on:click={async () => {
            await selectCsv.set(item);
            await updateLogs();
          }}
        >
          <CSVDownloader
            {data}
            filename={'qubic-analytics'}
            bom={true}
            type={'button'}
          >
            {item}
          </CSVDownloader>
        </div>
      {/each}
    </MenuItems>
  {/if}
</Menu>
