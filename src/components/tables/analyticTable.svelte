<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import Pagination from '@comp/pagination.svelte';

  export let loading,
    totalPages,
    isAlreadySeeMore,
    page,
    currentPageRows,
    active,
    setPage;
</script>

<div class="bg-neutral-800 rounded-lg border border-neutral-700">
  <table class="text-black w-full">
    {#if currentPageRows}
      {#if loading}
        <TableSkeleton colLength={3} />
        <TableSkeleton colLength={3} />
        <TableSkeleton colLength={3} />
        <TableSkeleton colLength={3} />
        <TableSkeleton colLength={3} />
      {:else}
        <thead class="text-neutral-200 bg-black/60">
          <tr>
            <th class="text-left pl-4 p-2">Date</th>
            <th class="text-left pl-4 p-2">Description</th>
            <th class="text-left">Device</th>
          </tr>
        </thead>
        <tbody class="p-2">
          {#each currentPageRows as row}
            <tr
              class="bg-neutral-800 text-neutral-300 border-b border-neutral-700 hover:border"
            >
              <td class="pl-4 p-2 w-48">
                {new Date(row.created_at).toDateString().slice(4)}
              </td>
              <td class="pl-4 w-auto">{row.message}</td>
              <td class="flex flex-col h-[40px] justify-center">
                {row?.platform ?? 'Unknown'}
              </td>
            </tr>
          {/each}
        </tbody>
      {/if}
    {/if}
  </table>
  {#if !loading}
    {#if !isAlreadySeeMore && currentPageRows?.length !== 0 && currentPageRows?.length > 4}
      <button
        class="self-center w-full mt-3 p-2 h-12 bg-neutral-900 hover:bg-neutral-900/80"
        on:click>See more</button
      >
    {/if}
  {/if}
  {#if totalPages.length === 0}
    {#if currentPageRows?.length === 0 && !loading}
      <div class="text-center">
        <h1 class="text-xl my-4">No activity found</h1>
      </div>
    {/if}
  {/if}
</div>

<Pagination {currentPageRows} {totalPages} {active} {setPage} {page} />
