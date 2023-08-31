<script>
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
  import { page } from '$app/stores';

  let permissions = {
    readMembers: false,
    writeMembers: false,
    writeRoles: false,
    readRoles: false,
    analytics: false,
  };
  let innerWidth = 0;
  let roles = [];
  let inactiveCards = [];
  let state = 'all';
  let updatedRole = '';
  let isDeleteMember = false;
  let members = [];
  let menu = ['Team Members', 'Cards'];
  let selectedMenu = 0;
  let cards = [];
  let loading = false;
  let selectedIndex = 0;
  let resetSort = false;

  const resetSortHandler = () => {
    resetSort = true;
    selectedIndex = 0;
    setTimeout(() => {
      resetSort = false;
    }, 200);
  };

  const selectMenu = (index) => (selectedMenu = index);
  const setState = (newState) => (state = newState);

  $: {
    $userData?.filter((item) => {
      if (item === 'allow_read_members') permissions.readMembers = true;
      if (item === 'allow_write_members') permissions.writeMembers = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
      if (item === 'allow_read_analytics') permissions.analytics = true;
    });
  }

  const deleteMember = async (id) => {
    isDeleteMember = true;
    members = members.filter((m) => m.member_id !== id);
    members = sortMember(members, $user?.id, 'asc');
    await getMembers();
    isDeleteMember = false;
  };

  const getMembers = async () => {
    const { data, error } = await supabase.rpc('getmembers', {
      tid: $page.params.slug,
    });

    if (error) console.log(error);

    if (data) {
      members = sortMember(data, $user?.id, 'asc');

      members = members.filter(
        (member, index, self) =>
          index === self.findIndex((m) => m.member_id === member.member_id)
      );
    }
  };

  const sortMemberHandler = (sort) => {
    loading = true;
    members = sortMember(members, $user?.id, sort);
    setTimeout(() => {
      loading = false;
    }, 500);
  };

  const sortCardHandler = (sort) => {
    loading = true;
    cards = sortCard(cards, $user?.id, sort);
    setTimeout(() => {
      loading = false;
    }, 500);
  };

  const getAll = async () => {
    await getMembers();
    roles = await getAllRoleByTeam($page.params.slug);
  };

  const getInactiveCards = async () => {
    loading = true;
    const { data, error } = await supabase
      .from('business_cards')
      .select('id, color, type, tcc: team_cardcon(card_id)')
      .eq('team_id', $page.params.slug)
      .eq('mode', 'team');

    if (error) console.log(error);

    if (data) {
      inactiveCards = data.filter((c) => c.tcc.length === 0);

      inactiveCards = inactiveCards.map((c) => {
        return {
          NFCtap: null,
          QRScan: null,
          team_profile: null,
          color: c.color,
          datecreated: null,
          email: null,
          id: c.id,
          status: null,
          type: c.type,
        };
      });
    }

    loading = false;
  };

  const getAllCards = async () => {
    loading = true;
    const { data, error } = await supabase.rpc('getcards', {
      tid: $page.params.slug,
    });
    // .ilike('email', '%test%');

    if (error) console.log(error);

    if (data) {
      inactiveCards = data.filter((c) => c.team_profile === null);
      cards = data.filter((c) => c.team_profile !== null);
      cards = sortCard(cards, $user?.id, 'asc');
    }

    loading = false;
  };

  const getActiveCards = async () => {
    loading = true;
    const { data, error } = await supabase.rpc('getactivecards', {
      tid: $page.params.slug,
    });

    if (error) console.log(error);

    if (data) {
      cards = sortCard(data, $user?.id, 'asc');
    }

    loading = false;
  };
</script>

<svelte:window bind:innerWidth />

<div class="flex flex-col pb-20  min-h-screen pl-0 md:pl-16  gap-2">
  {#if permissions.analytics}
    <div
      class="border-b bg-neutral-900 border-neutral-800 h-12 text-lg font-semibold pt-2 top-0 sticky w-full  pl-6 z-10"
    >
      Team Performance
    </div>
    <div class="flex justify-between gap-4 px-4">
      <div class="flex flex-col w-full gap-4">
        <h1 class="text-sm text-neutral-400">Data from last 7 days</h1>

        <div class="flex flex-col md:flex-row gap-2 w-full">
          <TeamAnalyticsCard teamId={$page.params.slug} teams />
        </div>
      </div>
    </div>
  {/if}

  <div class="flex flex-col my-2">
    <div
      class="flex bg-neutral-900 px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 border-b pt-3 mb-2 z-20 sticky top-0 border-neutral-800 "
    >
      <div class="flex gap-6 w-full lg:w-1/2">
        {#each menu as item, i}
          <button
            on:click={() => {
              selectMenu(i);
              resetSortHandler();
            }}
            class="cursor-pointer w-full md:w-auto text-center {selectedMenu ===
            i
              ? 'border-b-2 border-neutral-400 font-semibold text-md md:text-lg pb-3'
              : 'font-regular text-neutral-400 text-sm md:text-md my-auto'}"
          >
            {item}
          </button>
        {/each}
      </div>
      {#if selectedMenu === 1}
        <div
          class={`items-center justify-end rounded-md gap-2 pb-3 w-full ${
            permissions.readMembers ? 'flex' : 'hidden'
          }`}
        >
          {#each ['all', 'active', 'inactive'] as item, i}
            <button
              class={`p-2 md:w-20 w-full rounded-md text-xs ${
                state === item
                  ? 'bg-neutral-200 text-black'
                  : 'outline outline-neutral-600 outline-1 text-neutral-400'
              }`}
              on:click={async () => {
                setState(item);
                if (i === 0) await getAllCards();
                if (i === 1) await getActiveCards();
                if (i === 2) await getInactiveCards();
                resetSortHandler();
              }}>{item.charAt(0).toUpperCase() + item.slice(1)}</button
            >
          {/each}
        </div>
      {/if}
      <div
        class="flex gap-2 md:w-72 w-full items-center pb-3 {resetSort
          ? 'animate-pulse'
          : ''}"
      >
        {#if resetSort}
          <div class="bg-neutral-800 h-8 w-full rounded-md" />
        {:else}
          <MemberSortDropdown
            {selectedIndex}
            on:asc={() =>
              selectedMenu === 0
                ? sortMemberHandler('asc')
                : sortCardHandler('asc')}
            on:dsc={() =>
              selectedMenu === 0
                ? sortMemberHandler('dsc')
                : sortCardHandler('dsc')}
          />
        {/if}
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
              <!-- {#if member.email !== null} -->
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
              <!-- {/if} -->
            {/each}
          </div>
        {/if}
      {:catch name}
        <div>
          <h1 class="text-xl text-white text-center w-full mt-8">
            Some error occurred. Please reload the page and try again <br /> or
            <a href="https://wa.me/628113087599" class="font-semibold">
              contact us!
            </a>
          </h1>
        </div>
      {/await}
    {:else}
      {#await getAllCards()}
        <CardsSkeleton cardsLength={cards.length} />
      {:then name}
        {#if loading}
          <CardsSkeleton cardsLength={cards.length} />
        {:else}
          {#if cards.length > 0}
            {#if state === 'all' || state === 'active'}
              <div class="flex flex-col mt-4">
                {#if permissions.readMembers || cards
                    .map((c) => c.uid)
                    .includes($user?.id)}
                  <h1 class="text-lg font-semibold pl-4">Active</h1>
                {:else}
                  <h1 class="text-lg font-semibold pl-4">No cards</h1>
                {/if}
                <div
                  class="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {#each cards as card}
                    <CardsCard
                      {card}
                      {permissions}
                      {getAllCards}
                      {getActiveCards}
                      {state}
                    />
                  {/each}
                </div>
              </div>
            {/if}
          {:else}
            <h1 class="text-xl text-white text-center w-full mt-8">
              No cards found
            </h1>
          {/if}
          {#if inactiveCards.length > 0}
            {#if state === 'all' || state === 'inactive'}
              <div class="flex flex-col {state === 'all' ? 'mt-8' : 'mt-4'}">
                {#if permissions.readMembers}
                  <h1 class="text-lg font-semibold pl-4">Inactive</h1>
                {/if}

                <div
                  class="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {#each inactiveCards as card}
                    <CardsCard
                      {card}
                      {permissions}
                      {getAllCards}
                      {getActiveCards}
                      {state}
                    />
                  {/each}
                </div>
              </div>
            {/if}
          {/if}
        {/if}
      {:catch name}
        <div>
          <h1 class="text-xl text-white text-center w-full mt-8">
            Some error occurred. Please reload the page and try again <br />
            or
            <a href="https://wa.me/628113087599" class="font-semibold">
              contact us!
            </a>
          </h1>
        </div>
      {/await}
    {/if}
  </div>
</div>
