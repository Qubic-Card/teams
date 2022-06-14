<script lang="ts">
  import { page } from '$app/stores';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import supabase from '@lib/db';
  import { memberSearchMenu } from '@lib/constants.js';
  import { user, userData } from '@lib/stores/userStore';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import { getAllRoleByTeam } from '@lib/query/getRoleMaps';
  import Search from '@comp/search.svelte';

  let teamId = Cookies.get('qubicTeamId');

  let members = [];
  let ownProfile = [];
  let isHasPermission = false;
  let searchQuery = '';
  let searchNotFoundMsg = '';
  let loading = false;

  let selectedSearchMenu = null;
  let roles = [];

  const selectMenu = (menu) => {
    selectedSearchMenu = menu.detail;
    console.log(menu);
  };

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

      data.length === 0
        ? (searchNotFoundMsg = 'No member found.')
        : (searchNotFoundMsg = '');

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
      class="flex justify-center items-center bg-no-repeat bg-cover bg-neutral-800 w-full h-96 text-4xl font-bold brightness-50"
      style="background-image: url(https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)"
    >
      {$page.params.slug}
    </div>

    <div
      class={`items-center w-full justify-end gap-2 mt-4 ${
        isHasPermission ? 'flex' : 'hidden'
      }`}
    >
      <Search
        class="top-[480px] right-7"
        searchMenu={memberSearchMenu}
        {loading}
        bind:value={searchQuery}
        on:select={selectMenu}
        label={selectedSearchMenu?.name}
      />
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row my-8 gap-4"
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
          <MemberCard
            {member}
            {isHasPermission}
            id={member.id}
            index={i}
            {members}
            memberUid={member.uid}
            {roles}
          />
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
