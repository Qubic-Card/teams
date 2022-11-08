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
  import CardsCard from '@comp/cards/cardsCard.svelte';
  import sortCard from '@lib/utils/sortCard';
  import CardsSkeleton from '@comp/skeleton/cardsSkeleton.svelte';

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
  let menu = ['Team Members', 'Cards'];
  let selectedMenu = 1;
  let cards = [];
  const teamId = getContext('teamId');

  const selectMenu = (index) => (selectedMenu = index);
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

  const sortCardHandler = (sort) => {
    let userCardId = cards.filter(
      (c) => c.card[0].team_member_id.uid === $user?.id
    )[0].id;

    loading = true;
    cards = sortCard(cards, userCardId, sort);
    setTimeout(() => {
      loading = false;
    }, 500);
  };

  const getAll = async () => {
    await getMembers();
    roles = await getAllRoleByTeam(teamId);
  };

  const getCardEmail = async (uid) => {
    const { data, error } = await supabase
      .from('profile')
      .select('email')
      .eq('uid', uid);

    if (error) console.log(error);

    if (data) {
      return data[0];
    }
  };

  const getCards = async () => {
    const { data, error } = await supabase
      .from('business_cards')
      .select(
        'id, type, color, card: team_cardcon(status, datecreated, QRScan, NFCtap, team_member_id(uid, team_profile->>avatar))'
      )
      .eq('team_id', teamId)
      .eq('mode', 'team')
      .order('created_at', { ascending: false });

    if (error) console.log(error);
    if (data) {
      cards = data.filter((c) => c.card.length > 0);

      let userCardId = cards.filter(
        (c) => c.card[0].team_member_id.uid === $user?.id
      )[0].id;

      // cards = cards.map(async (c) => {
      //   const email = await getCardEmail(c.card[0].team_member_id.uid);

      //   return {
      //     ...c,
      //     email,
      //   };
      // });

      // console.log(cards);

      cards = sortCard(cards, userCardId, 'asc');
      inactiveCards = data.filter((c) => c.card.length < 1);
    }
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

  <div class="flex flex-col my-2">
    <div
      class="flex px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 border-b pt-3 mb-2 z-20 sticky top-0 border-neutral-700 bg-black"
    >
      <div class="flex gap-2 w-full lg:w-1/2">
        {#each menu as item, i}
          <div
            on:click={() => selectMenu(i)}
            class="text-md md:text-lg font-bold cursor-pointer w-full md:w-auto text-center pb-3 {selectedMenu ===
            i
              ? 'border-b-2 border-neutral-400'
              : ''}"
          >
            {item}
          </div>
        {/each}
      </div>
      {#if selectedMenu === 1}
        <div
          class={`items-center justify-end rounded-md gap-2 pb-3 w-full ${
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
      {/if}
      <div class="flex gap-2 md:w-72 w-full items-center pb-3">
        <MemberSortDropdown
          on:asc={() =>
            selectedMenu === 0
              ? sortMemberHandler('asc')
              : sortCardHandler('asc')}
          on:dsc={() =>
            selectedMenu === 0
              ? sortMemberHandler('dsc')
              : sortCardHandler('dsc')}
        />
      </div>
    </div>

    {#if selectedMenu === 0}
      {#await getAll()}
        <MemberSkeleton />
      {:then name}
        {#if loading}
          <MemberSkeleton />
        {:else if isDeleteMember}
          <MemberSkeleton />
        {:else}
          <div class="flex flex-col gap-2 px-4">
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
          </div>
        {/if}
      {:catch name}
        <div>
          <h1 class="text-xl text-white text-center w-full mt-8">
            Some error occurred. Please reload the page and try again <br /> or
            <a href="https://wa.me/628113087599" class="font-bold">
              contact us!
            </a>
          </h1>
        </div>
      {/await}
    {:else}
      {#await getCards()}
        <CardsSkeleton cardsLength={cards.length + inactiveCards.length} />
      {:then name}
        {#if loading}
          <CardsSkeleton cardsLength={cards.length + inactiveCards.length} />
        {:else}
          <div
            class="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          >
            {#if state === 'all'}
              {#each cards as card}
                <CardsCard {card} {permissions} {getCards} />
              {/each}
              {#each inactiveCards as card}
                <CardsCard {card} {permissions} />
              {/each}
            {/if}
            {#if state === 'active'}
              {#each cards as card}
                {#if card.card.length > 0}
                  <CardsCard {card} {permissions} {getCards} />
                {/if}
              {/each}
            {/if}
            {#if state === 'inactive'}
              {#each inactiveCards as card}
                <CardsCard {card} {permissions} />
              {/each}
            {/if}
          </div>
        {/if}
      {:catch name}
        <div>
          <h1 class="text-xl text-white text-center w-full mt-8">
            Some error occurred. Please reload the page and try again <br />
            or
            <a href="https://wa.me/628113087599" class="font-bold">
              contact us!
            </a>
          </h1>
        </div>
      {/await}
    {/if}
  </div>
</div>
