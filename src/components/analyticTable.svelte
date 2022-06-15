<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import Pagination from '@comp/pagination.svelte';

  export let loading, totalPages, isAlreadySeeMore;

  let page = 0;
  let currentPageRows = [];
  let active = 0;

  $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];

  const setPage = (p) => {
    if (p >= 0 && p < totalPages.length) {
      page = p;
      active = p;
    }
  };
</script>

<div class="bg-neutral-800 rounded-lg border border-neutral-700 p-2">
  <table class="text-black w-full">
    <thead class="text-neutral-200 bg-black/60">
      <tr>
        <th class="text-left pl-4 p-2">Date</th>
        <th class="text-left pl-4 p-2">Description</th>
        <th class="text-left">Device</th>
      </tr>
    </thead>
    <tbody>
      {#if loading}
        {#each currentPageRows as item}
          <TableSkeleton colLength={3} />
        {/each}
      {:else}
        {#each currentPageRows as row}
          <tr
            class="bg-neutral-800 text-neutral-300 border-b border-neutral-700 hover:border"
          >
            <td class="pl-4 p-2 w-48">
              {new Date(row.created_at).toDateString().slice(4)}
            </td>
            <td class="pl-4 w-auto">{row.data.message}</td>
            <td class="flex flex-col h-[40px] justify-center">
              {row.platform ?? 'Unknown'}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
  {#if !isAlreadySeeMore && currentPageRows.length !== 0}
    <button
      class="self-center w-full mt-3 p-2 h-12 bg-neutral-900 hover:bg-neutral-900/80"
      on:click>See more</button
    >
  {/if}
  {#if currentPageRows.length === 0 && !loading}
    <div class="text-center">
      <h1 class="text-xl my-4">No activity found</h1>
    </div>
  {/if}
</div>

<Pagination {currentPageRows} {totalPages} {active} {setPage} {page} />
