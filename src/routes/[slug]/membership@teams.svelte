<script>
  import Input from '@comp/input.svelte';
  import MembershipCard from '@comp/cards/membershipCard.svelte';
  import MembershipSortDropdown from '@comp/buttons/membershipSortDropdown.svelte';
  import MembershipAnalyticCard from '@comp/cards/membershipAnalyticCard.svelte';
  import { getContext } from 'svelte';

  const teamId = getContext('teamId');
  let searchQuery = '';

  let sortOptions = ['All', 'Galih', ' Galih', 'Pangestu'];
</script>

<div class="flex flex-col pb-20 bg-black min-h-screen pl-0 md:pl-16 pr-4 gap-2">
  <div
    class="border-b border-neutral-700 h-12 text-lg font-regular pt-2 z-40 fixed w-full bg-black pl-6"
  >
    Membership
  </div>
  <div class="flex justify-between gap-4 pl-4 pt-16">
    <div class="flex flex-col w-full gap-4">
      <h1 class="text-sm text-neutral-400">Data from last 7 days</h1>
      <div class="flex flex-col md:flex-row gap-2 w-full">
        <MembershipAnalyticCard {teamId} teams />
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-2 my-2">
    <div
      class="flex px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 py-3 border-b mb-2 z-20 sticky top-0 border-neutral-700 bg-black"
    >
      <h1 class="text-xl font-bold flex-grow w-1/2">Members</h1>

      <div class="flex gap-2 md:w-1/2 w-full items-center">
        <div
          class="bg-neutral-800 p-2 w-full md:w-32 text-xs flex justify-center items-center text-center rounded-md"
        >
          Most Recent
        </div>
        <MembershipSortDropdown {sortOptions} />
        <Input
          small
          bind:value={searchQuery}
          type="text"
          title=""
          placeholder="Search name"
          class="w-1/2 h-8"
          inputbg="bg-neutral-800"
          inputText="text-white"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2 pl-4">
      {#each Array(4) as member}
        <MembershipCard {member} />
      {/each}
    </div>
  </div>
</div>
