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

<div
  class="flex flex-col pb-20 bg-black min-h-screen pl-10 md:pl-16 pr-4 gap-2"
>
  <div
    class="border-b border-neutral-700 h-12 text-lg font-semibold pt-2 z-40 fixed w-full bg-black pl-6"
  >
    Membership
  </div>
  <div class="flex justify-between gap-4 pl-6 pt-16">
    <div class="flex flex-col w-full gap-4">
      <h1>Data from last 7 days</h1>
      <div class="flex flex-col md:flex-row gap-2 w-full">
        <MembershipAnalyticCard {teamId} teams />
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-2 my-2 pl-6">
    <div class="flex md:flex-row flex-col justify-between md:items-center mb-4">
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-semibold">Members</h1>
        <div
          class="bg-neutral-800 p-2 w-1/2 md:w-1/3 h-11 md:text-sm text-xs flex md:hidden justify-center items-center text-center rounded-md"
        >
          Most Recent
        </div>
      </div>
      <div class="flex gap-2 w-full md:w-3/4 lg:w-1/2 items-center">
        <div
          class="bg-neutral-800 p-2 w-1/2 lg:w-1/3 h-11 md:text-sm text-xs hidden md:flex justify-center items-center text-center rounded-md"
        >
          Most Recent
        </div>
        <MembershipSortDropdown {sortOptions} />
        <Input
          bind:value={searchQuery}
          type="text"
          title=""
          placeholder="Search name"
          class="w-1/2"
          inputbg="bg-neutral-800"
          inputText="text-white"
        />
      </div>
    </div>
    {#each Array(4) as member}
      <MembershipCard {member} />
    {/each}
  </div>
</div>
