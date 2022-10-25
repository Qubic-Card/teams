<script>
  import Input from '@comp/input.svelte';
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import TeamActivityCard from '@comp/cards/teamActivityCard.svelte';

  export let value, loading, teamMembers, toItem, setPage, maxPage, page;
</script>

<div class="hidden md:flex flex-col gap-2">
  <div class="flex justify-between mb-2">
    <h1 class="text-2xl font-bold">Team Activity</h1>
    <div class="flex gap-2 w-1/2 justify-end items-end">
      <div class="bg-neutral-800 p-2 w-1/3 h-11 mb-1 text-center rounded-md">
        Most Recent
      </div>
      <Input
        bind:value
        type="text"
        title=""
        placeholder="Search name"
        class="w-1/2"
        inputbg="bg-neutral-800"
        inputText="text-white"
      />
    </div>
  </div>
  {#if loading}
    <TeamAnalyticsLogsSkeleton length={teamMembers.length} />
  {:else if teamMembers}
    {#if teamMembers.length > 0}
      {#each teamMembers as member}
        <TeamActivityCard {member} />
      {/each}
    {:else}
      <div class="flex justify-center items-center h-32">
        <h1 class="text-center">No data found</h1>
      </div>
    {/if}
    {#if teamMembers.length > toItem}
      <PaginationButton {setPage} {page} {maxPage} />
    {/if}
  {/if}
</div>
