<script>
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';
  import { fade } from 'svelte/transition';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';

  export let page, currentPageRows, setPage, loading, maxPage;

  const setHours4Digit = (hours, minute) => {
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    return hours + ':' + minute;
  };
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
                {`${item.team_member?.firstname ?? 'Member'}'s` +
                  item?.message?.slice(4)}
              </h1>
              <p class="text-neutral-500">
                {setHours4Digit(
                  convertToGMT7(item.created_at).getHours(),
                  convertToGMT7(item.created_at).getMinutes()
                )}
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
  <PaginationButton {currentPageRows} {setPage} {page} {maxPage} />
{:else}
  <TeamAnalyticsLogsSkeleton />
{/if}
