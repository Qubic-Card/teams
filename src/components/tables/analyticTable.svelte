<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import { fade } from 'svelte/transition';

  export let loading, isAlreadySeeMore, currentPageRows, setPage, page, maxPage;
</script>

<div class="bg-neutral-900 rounded-lg outline outline-1 outline-neutral-800">
  <!-- {#if loading}
    <div class="bg-black/90 w-full rounded-md h-12" />
  {/if} -->
  <table class="text-black w-full">
    {#if currentPageRows}
      {#if loading}
        {#each currentPageRows as item}
          <TableSkeleton colLength={3} />
        {/each}
      {:else}
        <thead class="text-neutral-200 ">
          <tr>
            <th class="text-left p-1 rounded-tl-lg"
              ><div class="bg-black/60 pl-3 py-2 rounded-md">Date</div></th
            >
            <th class="text-left p-1"
              ><div class="bg-black/60 pl-3 py-2 rounded-md">
                Description
              </div></th
            >
            <th class="text-left p-1"
              ><div class="bg-black/60 pl-3 py-2 rounded-md">Device</div></th
            >
          </tr>
        </thead>
        <tbody class="p-2">
          {#each currentPageRows as row, i}
            <tr
              in:fade={{ duration: 200 }}
              class=" text-neutral-300 border-b border-neutral-700 hover:border"
            >
              <td class="pl-4 p-2 w-48">
                {new Date(row.created_at).toDateString().slice(4)}
              </td>
              {#if row.type === 'DANGER'}
                <td class="pl-4 w-auto">
                  You have removed {row.message.split(' ')[0]} from team
                </td>
              {:else if row.type === 'SUCCESS'}
                <td class="pl-4 w-auto">{row.message}</td>
              {:else if row.type === 'WARN'}
                <td class="pl-4 w-auto"> You have changed team name</td>
              {:else}
                <td class="pl-4 w-auto">{row.message}</td>
              {/if}
              <td class="flex flex-col pl-4 h-[40px] justify-center">
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
        class="self-center w-full mt-3 p-2 h-12 bg-black hover:bg-black/90"
        on:click>See more</button
      >
    {/if}
  {/if}

  {#if currentPageRows?.length === 0 && !loading}
    <div class="text-center">
      <h1 class="text-xl my-4">No activity found</h1>
    </div>
  {/if}
</div>

{#if isAlreadySeeMore}
  <PaginationButton {setPage} {page} {maxPage} />
{/if}
