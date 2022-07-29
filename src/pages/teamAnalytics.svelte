<script>
  import Pagination from '@comp/pagination.svelte';
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';
  import { fade } from 'svelte/transition';

  export let totalPages, active, page, currentPageRows, setPage, loading;
</script>

{#if !loading}
  {#if currentPageRows.length > 0}
    {#each currentPageRows as log}
      <div class="pl-5 mb-1" in:fade|local>
        <h1 class="text-sm font-bold text-neutral-500">
          {log.date}
        </h1>
        <div class="flex flex-col pl-7">
          {#each log.logs as item}
            <div
              class="text-sm flex justify-between p-1 hover:bg-neutral-800 hover:p-1"
            >
              <h1 class="text-white">
                {`${item.team_member.firstname}'s` + item.message.slice(4)}
              </h1>
              <p class="text-neutral-500">
                {new Date(new Date(item.created_at).setUTCHours(7)).getHours() +
                  ':' +
                  new Date(
                    new Date(item.created_at).setUTCHours(7)
                  ).getMinutes()}
              </p>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {:else}
    <div class="flex justify-center" in:fade|local>
      <h1 class="text-sm font-bold text-white">No logs</h1>
    </div>
  {/if}
  <Pagination {currentPageRows} {totalPages} {active} {setPage} {page} />
{:else}
  <TeamAnalyticsLogsSkeleton />
{/if}
