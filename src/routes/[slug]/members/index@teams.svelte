<script>
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import { getContext, onMount } from 'svelte';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import moveArrItemToFront from '@lib/utils/moveArrItemToFront';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';
  import TeamAnalyticsCard from '@comp/cards/teamAnalyticsCard.svelte';
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';

  import sortTeamMember from '@lib/utils/sortTeamMembers';
  import Input from '@comp/input.svelte';
  import getPagination from '@lib/utils/getPagination';

  let maxPage = 0;
  let page = 0;
  let toItem = 5;
  let teamMembers = [];
  let searchQuery = '';
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
  let isDeleteMember = false;
  let memberCountPercentage = 0;

  const teamId = getContext('teamId');

  const setPage = (p) => (page = p);

  const setState = (newState) => (state = newState);

  const getTeamCard = async () => {
    // const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('business_cards')
      .select(
        'id, type, color, team_cardcon : team_cardcon(status, card_id, NFCtap, QRScan,team_member_id (id,uid,team_profile, role(id, role_name), user_change, team_id))',
        { count: 'estimated' }
      )
      .eq('team_id', teamId)
      .eq('mode', 'team')
      .order('created_at', { ascending: true });
    // .range(from, to);

    if (error) console.log(error);
    if (data) {
      console.log(data);
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

  // bec89896-55b3-4e5a-b66f-01bd1aa4b5e9
  $: {
    $userData?.filter((item) => {
      if (item === 'allow_read_members') permissions.readMembers = true;
      if (item === 'allow_write_members') permissions.writeMembers = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
    });
  }

  const deleteMember = async (id) => {
    let deletedMember = activeMembers.filter(
      (m) => m.team_cardcon[0].team_member_id.id === id
    );

    deletedMember = deletedMember.map((m) => {
      return {
        id: m.id,
        color: m.color,
        team_cardcon: [],
        type: m.type,
      };
    });

    activeMembers = activeMembers.filter(
      (m) => m.team_cardcon[0].team_member_id.id !== id
    );

    inactiveCards = [...inactiveCards, ...deletedMember];

    isDeleteMember = true;
    setTimeout(() => {
      isDeleteMember = false;
    }, 500);

    activeMembers = moveArrItemToFront(activeMembers, $user?.id);
    allMember = [...activeMembers, ...inactiveCards];
  };

  const getAll = async () => {
    await getTeamCard();

    roles = await getAllRoleByTeam(teamId);
  };

  // $: page, searchQuery, getTeamMemberActivities();
</script>

<svelte:window bind:innerWidth />

<div
  class="flex flex-col pb-20 bg-black min-h-screen pl-10 md:pl-16 pr-4 gap-2"
>
  {#await getAll()}
    <TeamAnalyticsLogsSkeleton all />
  {:then}
    <div
      class="border-b border-neutral-700 h-12 text-lg font-semibold pt-2 z-40 fixed w-full bg-black pl-6"
    >
      Members
    </div>
    <div class="flex justify-between gap-4 pl-6 pt-16">
      <div class="flex flex-col w-full gap-4">
        <h1>Data from last 7 days</h1>
        <div class="flex flex-col md:flex-row gap-2 w-full">
          <TeamAnalyticsCard {teamId} teams />
        </div>
      </div>
    </div>
    <div class="flex flex-col my-2 pl-6">
      <div class="flex flex-col md:flex-row justify-between">
        <h1 class="text-xl font-bold">Team Activity</h1>
        <div class="flex gap-2 w-full md:w-1/2 md:justify-end items-center">
          <div
            class="bg-neutral-800 p-2 w-1/2 md:w-1/3 h-11 md:text-sm text-xs flex justify-center items-center text-center rounded-md"
          >
            Most Recent
          </div>
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
      <div
        class={`items-center w-full rounded-md gap-2 mt-2 mb-4 bg-neutral-900 p-3 ${
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
      {#if isDeleteMember}
        <TeamAnalyticsLogsSkeleton />
      {:else}
        <div class="flex flex-col gap-2">
          {#if state === 'all'}
            {#each allMember as member, i}
              <MemberCard
                {member}
                {roles}
                {permissions}
                {i}
                {updatedRole}
                {deleteMember}
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
