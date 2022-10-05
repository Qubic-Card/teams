<script>
  import TableSkeleton from '@comp/basic/tableSkeleton.svelte';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';

  export let logs, setPage, page, loading, maxPage;
</script>

<div class="bg-white rounded-lg p-2 border">
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
        {#each logs as row, i}
          <TableSkeleton colLength={3} index={i} />
        {/each}
      {:else}
        {#each logs as row}
          <tr class="even:bg-white odd:bg-zinc-100 hover:border">
            <td class="pl-4 p-2 w-48">
              {new Date(row?.timestamp).toDateString().slice(4)}
            </td>
            <td class="pl-4 w-auto">{row?.data?.message}</td>
            <td class="flex flex-col h-[40px] justify-center">
              {row?.platform}
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
  {#if logs.length === 0 && !loading}
    <div class="text-center">
      <h1 class="text-xl mt-8">No activity found</h1>
    </div>
  {/if}
  <PaginationButton {setPage} {page} {maxPage} editor="basic" />
</div>
