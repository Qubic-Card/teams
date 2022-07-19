<script lang="ts">
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

  const seperatingMembers = (arr1, arr2) => {
    let active = arr2.filter((item) => !arr1.includes(item));

    // inactiveCards = [];
    for (let index in cards) {
      inactiveCards = [];
      if (active[index]?.card_id?.id !== cards[index]?.id) {
        inactiveCards = [...inactiveCards, cards[index]];
      }

      if (teamCardCon[index]?.card_id?.id === active[index]?.card_id?.id) {
        activeMembers = [...activeMembers, teamCardCon[index]];
        activeMembers = activeMembers.filter((member) => member !== undefined);
      }
    }
  };

  const recieveDeletedMemberData = (e) => {
    inactiveCards = [...inactiveCards, e.detail];
    activeMembers = activeMembers.filter(
      (member) => member?.card_id?.id !== e.detail?.card_id?.id
    );
  };

  $: if (cards && teamCardCon) seperatingMembers(cards, teamCardCon);

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
        {#each activeMembers as member, i}
          <MemberCard
            {member}
            {roles}
            {permissions}
            active
            on:deletedMemberData={recieveDeletedMemberData}
          />
        {/each}
        {#each inactiveCards as card, i}
          <MemberCard {card} {permissions} />
        {/each}
      {:else if state === 'active'}
        {#each activeMembers as member, i}
          <MemberCard
            {member}
            {roles}
            {permissions}
            active
            on:deletedMemberData={recieveDeletedMemberData}
          />
        {/each}
      {:else if state === 'inactive'}
        {#each inactiveCards as card, i}
          <MemberCard {card} {permissions} />
        {/each}
      {/if}
    </div>
    {#if searchNotFoundMsg !== ''}
      <div class="text-2xl font-bold text-white text-center w-full mt-8">
        {searchNotFoundMsg}
      </div>
    {/if}
  {:catch}
    <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again.
    </h1>
  {/await}
</div>
