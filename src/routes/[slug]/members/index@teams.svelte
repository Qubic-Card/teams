<script lang="ts">
  import Pagination from '@comp/pagination.svelte';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';
  import { getMemberId } from '@lib/query/getId';
  import moveArrItemToFront from '@lib/utils/moveArrItemToFront';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';

  let teamId = Cookies.get('qubicTeamId');
  let permissions = {
    readMembers: false,
    writeRoles: false,
    readRoles: false,
  };
  let searchNotFoundMsg = '';
  let loading = false;
  let innerWidth = 0;
  let cards = [];
  let roles = [];
  let userCardId = null;
  let teamCardCon = [];
  let inactiveCards = [];
  let activeMembers = [];
  let state = 'all';
  let allMember = [];
  let itemsPerPage = 9;
  let page = 0;
  let totalPages = [];
  let active = 0;
  let currentPageRows = [];

  const paginate = (items) => {
    const pages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = Array.from({ length: pages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });
    totalPages = [...paginatedItems];
    currentPageRows = totalPages?.length > 0 ? totalPages[page] : [];
  };

  const setPage = (p) => {
    if (p >= 0 && p < totalPages?.length) {
      page = p;
      active = p;
    }

    console.log(page, active, p);
  };

  const setState = (newState) => (state = newState);

  const getUserCardId = async () => {
    let memberId = await getMemberId($user?.id, teamId);
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('card_id')
      .eq('team_member_id', memberId);

    if (error) console.log(error);

    if (data) {
      userCardId = data[0].card_id;
    }
  };

  const getTeamCard = async () => {
    const { data, error } = await supabase
      .from('business_cards')
      .select('id, type, color, team_id')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (error) console.log(error);
    if (data) {
      cards = data;
    }
  };

  const getTeamCardCon = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('card_id(id, type, color), status, team_member_id(*)');
    // .eq('card_id', cardId);

    if (error) console.log(error);
    if (data) {
      if (data.length > 0) {
        teamCardCon = data;
        // console.log(teamCardCon);
      }
    }
  };

  // eac9c236-da25-4d9c-a058-632bd92bc951
  // cf682da6-c300-4078-8088-f85993eda24d

  $: cards.map((item, i) => {
    if (teamCardCon[i] !== undefined) {
      activeMembers = [...activeMembers, teamCardCon[i]];
      inactiveCards = [];
    } else {
      inactiveCards = [...inactiveCards, cards[i]];
    }
  });

  $: {
    $userData?.filter((item) => {
      if (item === 'allow_read_members') permissions.readMembers = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
    });

    if (activeMembers) {
      getUserCardId();
      activeMembers = moveArrItemToFront(activeMembers, userCardId);
    }
  }
  $: currentPageRows = totalPages?.length > 0 ? totalPages[page] : [];
  $: allMember = [...activeMembers, ...inactiveCards];
  $: paginate(allMember);

  onMount(async () => (roles = await getAllRoleByTeam(teamId)));
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col pb-20 bg-black min-h-screen pt-4 pl-24 pr-4">
  {#await (getTeamCard(), getTeamCardCon())}
    <MemberSkeleton searchSkeletonVisible />
  {:then}
    <div
      class={`items-center w-full rounded-md gap-4 mt-4 bg-neutral-900 p-4 ${
        permissions.readMembers ? 'flex' : 'hidden'
      }`}
    >
      <button
        class={`p-3 w-28 rounded-md ${
          state === 'all' ? 'bg-neutral-200 text-black' : 'bg-black '
        }`}
        on:click={() => setState('all')}>All</button
      >
      <button
        class={`p-3 w-28 rounded-md ${
          state === 'active' ? 'bg-neutral-200 text-black' : 'bg-black '
        }`}
        on:click={() => setState('active')}>Active</button
      >
      <button
        class={`p-3 w-28 rounded-md ${
          state === 'inactive' ? 'bg-neutral-200 text-black' : 'bg-black '
        }`}
        on:click={() => setState('inactive')}>Inactive</button
      >
    </div>
    <div
      class={`grid grid-flow-row my-8 gap-4 ${
        innerWidth > 1257 ? 'grid-cols-3' : 'grid-cols-2'
      }`}
    >
      {#if state === 'all'}
        {#each currentPageRows as member, i}
          <MemberCard {member} {roles} {permissions} />
        {/each}
      {/if}
      {#if state === 'active'}
        {#each currentPageRows as member, i}
          {#if member.team_member_id}
            <MemberCard {member} {roles} {permissions} />
          {/if}
        {/each}
      {/if}
      {#if state === 'inactive'}
        {#each currentPageRows as member, i}
          {#if member.id}
            <MemberCard {member} {roles} {permissions} />
          {/if}
        {/each}
      {/if}
    </div>
    {#if searchNotFoundMsg !== ''}
      <div class="text-2xl font-bold text-white text-center w-full mt-8">
        {searchNotFoundMsg}
      </div>
    {/if}
    {#if permissions.readMembers && currentPageRows.length > 26}
      <Pagination {currentPageRows} {totalPages} {active} {setPage} {page} />
    {/if}
  {:catch}
    <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again.
    </h1>
  {/await}
</div>
