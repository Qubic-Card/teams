<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import Pagination from '@comp/pagination.svelte';

  export let currentPageRows;
  export let setPage;
  export let page;
  export let active;
  export let totalPages;
  export let loading;
  console.log(currentPageRows);
</script>

<div class="bg-neutral-800 rounded-lg p-2 border border-neutral-500">
  <table class="text-black w-full mt-2">
    <thead class="text-neutral-400">
      <tr>
        <th class="text-left pl-4 p-2">Date</th>
        <th class="text-left pl-4 p-2">Description</th>
        <th class="text-left">Device</th>
      </tr>
    </thead>
    <tbody>
      {#if loading}
        <TableSkeleton colLength={3} />
      {:else}
        {#each currentPageRows as row}
          <tr class="even:bg-white odd:bg-zinc-100 hover:border">
            <td class="pl-4 p-2 w-48">
              {new Date(row.timestamp).toDateString().slice(4)}
            </td>
            <td class="pl-4 w-auto">{row.data.message}</td>
            <td class="flex flex-col h-[40px] justify-center">
              {row.platform}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
  {#if currentPageRows.length === 0 && !loading}
    <div class="text-center">
      <h1 class="text-xl my-4">No activity found</h1>
    </div>
  {/if}
  <Pagination {currentPageRows} {totalPages} {active} {setPage} {page} />
</div>
