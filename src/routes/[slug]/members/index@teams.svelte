<script lang="ts">
  import { page } from '$app/stores';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import { getTeamId } from '@lib/query/getId';
  import Cookies from 'js-cookie';
  import AddMember from '@comp/modals/addMember.svelte';
  import { onMount } from 'svelte';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';

  let teamId = Cookies.get('qubicTeamId');

  let members = [];
  let ownProfile = [];
  let isHasPermission = false;
  let searchQuery = '';
  let searchNotFoundMsg = '';
  let loading = false;

  let searchMenus = [
    { name: 'Name', col: 'team_profile->>firstname' },
    { name: 'Job', col: 'team_profile->>job' },
    { name: 'Company', col: 'team_profile->>company' },
  ];
  let selectedSearchMenu = null;
  let roles = [];

  const selectMenu = (menu) => (selectedSearchMenu = menu);

  const getTeamMembers = async () => {
    // let teamId = await getTeamId($user?.id);
    const { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid, id')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      members = data;
    }
  };

  const searchMemberHandler = async () => {
    // let teamId = await getTeamId($user?.id);
    loading = true;
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .ilike(
        selectedSearchMenu
          ? selectedSearchMenu.col
          : 'team_profile->>firstname',
        `%${searchQuery}%`
      );

    loading = false;
    if (error) console.log(error);
    if (data) {
      members = data;
      if (data.length === 0) {
        searchNotFoundMsg = '0 results found. Please try again.';
      }
      return data;
    }
  };

  $: {
    console.log(members);
    $userData?.filter((item) => {
      if (item === 'allow_read_members') isHasPermission = true;
    });

    members.map((member) => {
      if (member.uid === $user?.id) ownProfile = member;
    });
  }
  $: searchQuery, selectedSearchMenu, searchMemberHandler();

  onMount(async () => (roles = await getAllRoleByTeam(teamId)));
</script>

<div class="flex flex-col pb-20">
  {#await getTeamMembers()}
    <MemberSkeleton />
  {:then}
    <div
      class="flex justify-center items-center bg-neutral-800 w-full h-96 text-4xl font-bold brightness-50"
      style="background-image: url(https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)"
    >
      {$page.params.slug}
    </div>
    <div class="flex justify-between items-center pt-6">
      <AddMember {roles} />
      <div class="flex items-center gap-2">
        {#if loading}
          <Spinner class="w-10 h-10 mr-2" />
        {/if}
        <input
          type="text"
          class="w-full md:w-[400px] h-12 p-2 border-2 border-neutral-500 text-white bg-neutral-800"
          placeholder="Search name"
          bind:value={searchQuery}
        />
        <Menu as="div" class="mx-2" let:open>
          <MenuButton
            class="text-white border-2 border-neutral-700 flex justify-around items-center relative min-w-28 h-12 px-2 gap-2 rounded-md"
          >
            {selectedSearchMenu ? selectedSearchMenu.name : 'Name'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#737373"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </MenuButton>
          {#if open}
            <div transition:slide|local={{ duration: 500 }}>
              <MenuItems
                class="top-[480px] right-7 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40"
              >
                {#each searchMenus as item}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                    on:click={() => selectMenu(item)}
                  >
                    {item.name}
                  </MenuItem>
                {/each}
              </MenuItems>
            </div>
          {/if}
        </Menu>
      </div>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row my-8"
    >
      {#each members as member, i}
        {#if isHasPermission === false && member.uid === ownProfile.uid}
          <MemberCard
            member={ownProfile}
            {isHasPermission}
            id={member.id}
            index={i}
            {members}
            memberUid={member.uid}
            {roles}
          />
        {:else if isHasPermission === true}
          <!-- {#each members as member, i} -->
          <MemberCard
            {member}
            {isHasPermission}
            id={member.id}
            index={i}
            {members}
            memberUid={member.uid}
            {roles}
          />
          <!-- {/each} -->
        {/if}
      {/each}
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
