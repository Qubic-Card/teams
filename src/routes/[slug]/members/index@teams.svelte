<script>
  import { getContext } from 'svelte';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import sortMember from '@lib/utils/sortMember';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';
  import TeamAnalyticsCard from '@comp/cards/teamAnalyticsCard.svelte';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberSortDropdown from '@comp/buttons/memberSortDropdown.svelte';

  let permissions = {
    readMembers: false,
    writeMembers: false,
    writeRoles: false,
    readRoles: false,
  };
  let innerWidth = 0;
  let roles = [];
  let inactiveCards = [];
  let state = 'all';
  let updatedRole = '';
  let isDeleteMember = false;
  let members = [];
  let activeCardsId = [];
  const teamId = getContext('teamId');

  const setState = (newState) => (state = newState);

  $: {
    $userData?.filter((item) => {
      if (item === 'allow_read_members') permissions.readMembers = true;
      if (item === 'allow_write_members') permissions.writeMembers = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
    });
  }
  // e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb
  const deleteMember = async (id) => {
    let deletedMember = members.filter((m) => m.member_id === id);

    deletedMember = deletedMember.map((m) => {
      return {
        id: m.card_id,
      };
    });

    members = members.filter((m) => m.member_id !== id);

    inactiveCards = [...inactiveCards, ...deletedMember];

    isDeleteMember = true;
    setTimeout(() => {
      isDeleteMember = false;
    }, 500);

    members = sortMember(members, $user?.id);
  };

  const getMembers = async () => {
    const { data, error } = await supabase.rpc('getmembers', {
      tid: teamId,
    });

    if (error) console.log(error);

    if (data) {
      let active = data.filter((m) => m.uid !== null);

      members = sortMember(active, $user?.id, 'asc');
      activeCardsId = members.map((m) => m.card_id);
    }
  };

  let loading = false;

  const sortMemberHandler = (sort) => {
    loading = true;
    members = sortMember(members, $user?.id, sort);
    setTimeout(() => {
      loading = false;
    }, 500);
  };

  const getInactiveCards = async () => {
    if (activeCardsId.length > 0) {
      const { data, error } = await supabase
        .from('business_cards')
        .select('id')
        .eq('team_id', teamId)
        .eq('mode', 'team');

      if (error) console.log(error);

      if (data) {
        inactiveCards = data.filter((d) => !activeCardsId.includes(d.id));
      }
    }
  };

  const getAll = async () => {
    await getMembers();
    await getInactiveCards();
    roles = await getAllRoleByTeam(teamId);
  };
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-col pb-20 bg-black min-h-screen pl-0 md:pl-16  gap-2">
  <div
    class="border-b border-neutral-700 h-12 text-lg font-regular pt-2 top-0 sticky w-full bg-black pl-6 z-10"
  >
    Team Performance
  </div>
  <div class="flex justify-between gap-4 px-4">
    <div class="flex flex-col w-full gap-4">
      <h1 class="text-sm text-neutral-400">Data from last 7 days</h1>

      <div class="flex flex-col md:flex-row gap-2 w-full">
        <TeamAnalyticsCard {teamId} teams />
      </div>
    </div>
  </div>
  {#await getAll()}
    <MemberSkeleton all />
  {:then}
    <div class="flex flex-col my-2">
      <div
        class="flex px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 py-3 border-b mb-2 z-20 sticky top-0 border-neutral-700 bg-black"
      >
        <h1 class="text-xl font-bold flex-grow w-full">Team Members</h1>
        <div
          class={`items-center justify-end rounded-md gap-2 w-full ${
            permissions.readMembers ? 'flex' : 'hidden'
          }`}
        >
          <button
            class={`p-2 md:w-20 w-full rounded-md text-xs ${
              state === 'all'
                ? 'bg-neutral-200 text-black'
                : 'outline outline-neutral-600 outline-1 text-neutral-400'
            }`}
            on:click={() => setState('all')}>All</button
          >
          <button
            class={`p-2 md:w-20 w-full rounded-md text-xs ${
              state === 'active'
                ? 'bg-neutral-200 text-black'
                : 'outline outline-neutral-600 outline-1 text-neutral-400'
            }`}
            on:click={() => setState('active')}>Active</button
          >
          <button
            class={`p-2 md:w-20 w-full rounded-md text-xs ${
              state === 'inactive'
                ? 'bg-neutral-200 text-black'
                : 'outline outline-neutral-600 outline-1 text-neutral-400'
            }`}
            on:click={() => setState('inactive')}>Inactive</button
          >
        </div>
        <div class="flex gap-2 md:w-72 w-full items-center">
          <MemberSortDropdown
            on:asc={() => sortMemberHandler('asc')}
            on:dsc={() => sortMemberHandler('dsc')}
          />
        </div>
      </div>
      {#if loading}
        <MemberSkeleton />
      {:else}
        {#if state === 'inactive'}
          {#if inactiveCards.length === 0}
            <div>
              <h1 class="text-sm md:text-lg text-neutral-400 text-center mt-4">
                No inactive cards
              </h1>
            </div>
          {/if}
        {/if}
        {#if isDeleteMember}
          <MemberSkeleton />
        {:else}
          <div class="flex flex-col gap-2 px-4">
            {#if state === 'all'}
              {#each members as member, i}
                <MemberCard
                  {member}
                  {roles}
                  {permissions}
                  {i}
                  {updatedRole}
                  {deleteMember}
                  active
                  on:setRole={(e) => (updatedRole = e.detail)}
                />
              {/each}
              {#if inactiveCards.length !== 0}
                {#each inactiveCards as member, i}
                  <MemberCard {member} {permissions} />
                {/each}
              {/if}
            {/if}
            {#if state === 'active'}
              {#each members as member, i}
                <MemberCard
                  {member}
                  {roles}
                  {permissions}
                  {i}
                  {updatedRole}
                  active
                  on:setRole={(e) => (updatedRole = e.detail)}
                />
              {/each}
            {/if}
            {#if state === 'inactive'}
              {#if inactiveCards.length !== 0}
                {#each inactiveCards as member, i}
                  <MemberCard {member} {permissions} />
                {/each}
              {/if}
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  {:catch}
    <div>
      <h1 class="text-xl text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again <br /> or
        <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
      </h1>
    </div>
  {/await}
</div>
