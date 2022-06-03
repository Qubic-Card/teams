<script lang="ts">
  import { page } from '$app/stores';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { memberRights } from '@lib/stores/memberRightsStore';
  import { getTeamId } from '@lib/query/getId';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Transition,
  } from '@rgossiaux/svelte-headlessui';

  let members = [];
  let ownProfile = [];
  let isHasPermission = false;
  let searchQuery = '';
  let searchNotFoundMsg = '';
  let loading = false;

  const getTeamMembers = async () => {
    let teamId = await getTeamId($user.id);
    const { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      members = data;
    }
  };

  const searchMemberHandler = async () => {
    loading = true;
    let teamId = await getTeamId($user.id);
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
    $memberRights?.filter((item) => {
      if (item === 'allow_read_members') isHasPermission = true;
    });

    members.map((member) => {
      if (member.uid === $user.id) ownProfile = member;
    });
  }

  $: searchQuery, searchMemberHandler();

  let searchMenus = [
    { name: 'Name', col: 'team_profile->>firstname' },
    { name: 'Job', col: 'team_profile->>job' },
    { name: 'Company', col: 'team_profile->>company' },
  ];
  let selectedSearchMenu = null;
  const selectMenu = (menu) => (selectedSearchMenu = menu);
  $: console.log(selectedSearchMenu);
</script>

<div class="flex flex-col">
  {#await getTeamMembers()}
    <MemberSkeleton />
  {:then}
    <div
      class="flex justify-center items-center bg-neutral-800 w-full h-96 text-4xl font-bold brightness-50"
      style="background-image: url(https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)"
    >
      {$page.params.slug}
    </div>
    <div class="flex justify-end items-center mt-6 gap-2">
      {#if loading}
        <Spinner class="w-10 h-10 mr-2" />
      {/if}
      <input
        type="text"
        class="w-[400px] h-12 p-2 border-2 border-neutral-500 text-white bg-neutral-800"
        placeholder="Search name"
        bind:value={searchQuery}
      />
      <Menu as="div" class="mx-2">
        <MenuButton
          class="bg-neutral-700 inline-block relative w-24 h-12 rounded-md"
          >{selectedSearchMenu ? selectedSearchMenu.name : 'Name'}</MenuButton
        >
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <MenuItems
            class="top-24 right-7 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40"
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
        </Transition>
      </Menu>
    </div>
    <div class="grid grid-cols-3 grid-flow-row my-8">
      {#each members as member}
        {#if isHasPermission === false && member.uid === ownProfile.uid}
          <MemberCard member={ownProfile} />
        {:else if isHasPermission === true}
          <MemberCard {member} />
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
