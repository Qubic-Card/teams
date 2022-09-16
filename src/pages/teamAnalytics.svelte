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
              class={`text-sm flex mb-1 rounded-md justify-between p-1 hover:p-1 ${
                item.type === 'DANGER'
                  ? 'bg-red-600/30 border-2 border-red-400/30 hover:bg-red-800'
                  : item.type === 'SUCCESS'
                  ? 'bg-green-600/30 border-2 border-green-400/30 hover:bg-green-800'
                  : item.type === 'WARN'
                  ? 'bg-yellow-600/30 border-2 border-yellow-400/30 hover:bg-yellow-800'
                  : 'bg-transparent hover:bg-neutral-800'
              }`}
            >
              {#if item.type === 'DANGER' || item.type === 'SUCCESS' || item.type === 'WARN'}
                <h1
                  class={`${
                    item.type === 'DANGER'
                      ? 'text-red-200'
                      : item.type === 'SUCCESS'
                      ? 'text-green-200'
                      : item.type === 'WARN'
                      ? 'text-yellow-200'
                      : 'text-neutral-500'
                  }`}
                >
                  {item?.message}
                </h1>
              {:else}
                <h1 class="text-white">
                  {`${item?.card_holder ?? 'Member'}'s` +
                    item?.message?.slice(4)}
                </h1>
              {/if}
              <p
                class={`${
                  item.type === 'DANGER'
                    ? 'text-red-200'
                    : item.type === 'SUCCESS'
                    ? 'text-green-200'
                    : item.type === 'WARN'
                    ? 'text-yellow-200'
                    : 'text-neutral-500'
                }`}
              >
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
  <PaginationButton {setPage} {page} {maxPage} />
{:else}
  <TeamAnalyticsLogsSkeleton />
{/if}
