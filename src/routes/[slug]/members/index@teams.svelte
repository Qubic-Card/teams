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
  class="flex flex-col pb-20 bg-black min-h-screen pl-10 md:pl-16  gap-2"
>
  {#await getAll()}
    <TeamAnalyticsLogsSkeleton all />
  {:then}
    <div
      class="border-b border-neutral-700 h-12 text-lg font-semibold pt-2 top-0 sticky w-full bg-black pl-6"
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
    <div class="flex flex-col my-2">
      <div class="flex px-6 flex-row items-center gap-2 py-3 border-b mb-2 z-10 sticky top-0 border-neutral-700 bg-black">
        <h1 class="text-xl font-bold flex-grow">Team Members</h1>
        <div
        class={`items-center  rounded-md gap-2 ${
          permissions.readMembers ? 'flex' : 'hidden'
        }`}
      >
        <button
          class={`p-2 w-20 rounded-md text-xs ${
            state === 'all'
              ? 'bg-neutral-200 text-black'
              : 'outline outline-neutral-600 outline-1 text-neutral-400'
          }`}
          on:click={() => setState('all')}>All</button
        >
        <button
          class={`p-2 w-20 rounded-md text-xs ${
            state === 'active'
              ? 'bg-neutral-200 text-black'
              : 'outline outline-neutral-600 outline-1 text-neutral-400'
          }`}
          on:click={() => setState('active')}>Active</button
        >
        <button
          class={`p-2 w-20 rounded-md text-xs ${
            state === 'inactive'
              ? 'bg-neutral-200 text-black'
              : 'outline outline-neutral-600 outline-1 text-neutral-400'
          }`}
          on:click={() => setState('inactive')}>Inactive</button
        >
      </div>
        <div class="flex gap-2  items-center">
          <div
            class="bg-neutral-800 p-2 w-32 text-xs flex justify-center items-center text-center rounded-md"
          >
            Most Recent
          </div>
          
        </div>
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
        <div class="flex flex-col gap-2 px-4">
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
