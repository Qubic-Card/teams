<script lang="ts">
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import { getContext, onMount } from 'svelte';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import moveArrItemToFront from '@lib/utils/moveArrItemToFront';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';

  let permissions = {
    readMembers: false,
    writeMembers: false,
    writeRoles: false,
    readRoles: false,
  };
  let loading = false;
  let innerWidth = 0;
  let roles = [];
  let inactiveCards = [];
  let activeMembers = [];
  let state = 'all';
  let allMember = [];
  let updatedRole = '';
  let maxPage = 0;
  let page = 0;
  let toItem = 1;
  const teamId = getContext('teamId');

  const setPage = (p) => (page = p);

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const setState = (newState) => (state = newState);

  const getTeamCard = async () => {
    // const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('business_cards')
      .select(
        'id, type, color,team_cardcon : team_cardcon(status, card_id, NFCtap, QRScan,team_member_id (id,uid,team_profile, role(id, role_name), user_change, team_id))',
        { count: 'estimated' }
      )
      .eq('team_id', teamId)
      .eq('mode', 'team')
      .order('created_at', { ascending: true });
    // .range(from, to);

    if (error) console.log(error);
    if (data) {
      activeMembers = data.filter(
        (c) => c.team_cardcon[0]?.team_member_id?.uid
      );
      inactiveCards = data.filter(
        (c) =>
          c.team_cardcon.length === 0 || !c.team_cardcon[0]?.team_member_id?.uid
      );

      activeMembers = moveArrItemToFront(activeMembers, $user?.id);
      allMember = [...activeMembers, ...inactiveCards];

      // maxPage = Math.ceil(count / toItem);
    }
  };

  $: {
    $userData?.filter((item) => {
      if (item === 'allow_read_members') permissions.readMembers = true;
      if (item === 'allow_write_members') permissions.writeMembers = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
    });
  }

  onMount(async () => (roles = await getAllRoleByTeam(teamId)));
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-col pb-20 bg-black min-h-screen pt-2 pl-20 md:pl-24 pr-4">
  {#await getTeamCard()}
    <MemberSkeleton {allMember} {innerWidth} {permissions} />
  {:then}
    <div
      class={`items-center w-full rounded-md gap-2 mt-2 bg-neutral-900 p-3 ${
        permissions.readMembers ? 'flex' : 'hidden'
      }`}
    >
      <button
        class={`p-2 w-20 rounded-md ${
          state === 'all'
            ? 'bg-neutral-200 text-black'
            : 'border border-neutral-600 text-neutral-400 text-sm'
        }`}
        on:click={() => setState('all')}>All</button
      >
      <button
        class={`p-2 w-20 rounded-md ${
          state === 'active'
            ? 'bg-neutral-200 text-black'
            : 'border border-neutral-600 text-neutral-400 text-sm'
        }`}
        on:click={() => setState('active')}>Active</button
      >
      <button
        class={`p-2 w-20 rounded-md ${
          state === 'inactive'
            ? 'bg-neutral-200 text-black'
            : 'border border-neutral-600 text-neutral-400 text-sm'
        }`}
        on:click={() => setState('inactive')}>Inactive</button
      >
    </div>
    {#if state === 'inactive'}
      {#if inactiveCards.length === 0}
        <div>
          <h1 class="text-xl text-neutral-400 text-center mt-4">
            No inactive cards
          </h1>
        </div>
      {/if}
    {/if}
    <div
      class={`grid grid-flow-row my-4 h-64 gap-2 ${
        innerWidth > 1370 ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {#if state === 'all'}
        {#each allMember as member, i}
          <MemberCard
            {member}
            {roles}
            {permissions}
            {i}
            {updatedRole}
            on:setRole={(e) => (updatedRole = e.detail)}
          />
        {/each}
      {/if}
      {#if state === 'active'}
        {#each activeMembers as member, i}
          <MemberCard
            {member}
            {roles}
            {permissions}
            {i}
            {updatedRole}
            on:setRole={(e) => (updatedRole = e.detail)}
          />
        {/each}
      {/if}
      {#if state === 'inactive'}
        {#if inactiveCards.length !== 0}
          {#each inactiveCards as member, i}
            <MemberCard {member} {roles} {permissions} {updatedRole} />
          {/each}
        {/if}
      {/if}
    </div>

    <!-- <PaginationButton {setPage} {page} {maxPage} /> -->
  {:catch}
    <div>
      <h1 class="text-xl text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again <br /> or
        <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
      </h1>
    </div>
  {/await}
</div>
