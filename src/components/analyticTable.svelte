<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';

  export let loading, logs;
</script>

<div class="bg-neutral-800 rounded-lg p-2 border border-neutral-500 pb-6">
  <table class="text-black w-full mt-2">
    <thead class="text-neutral-200">
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
        {#each logs as row}
          <tr
            class="even:bg-neutral-700 odd:bg-neutral-900 text-white hover:border"
          >
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
  {#if logs.length === 0 && !loading}
    <div class="text-center">
      <h1 class="text-xl my-4">No activity found</h1>
    </div>
  {/if}
</div>
