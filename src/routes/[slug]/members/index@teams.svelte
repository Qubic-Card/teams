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
  let innerWidth = 0;

  let selectedSearchMenu = null;
  let roles = [];

  const selectMenu = (menu) => (selectedSearchMenu = menu.detail);

  const getTeamMembers = async () => {
    // let teamId = await getTeamId($user?.id);
    const { data, error } = await supabase
      .from('team_members')
      .select('member_from, team_profile, uid, id')
      .eq('team_id', teamId)
      .order('member_from', { ascending: true });

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

<svelte:window bind:innerWidth />
<div class="flex flex-col pb-20 bg-black min-h-screen pt-4 pl-24 pr-4">
  {#await getTeamMembers()}
    <MemberSkeleton searchSkeletonVisible />
  {:then}
    <div
      class={`items-center w-full rounded-md justify-end gap-2 mt-4 bg-neutral-900 p-4 ${
        isHasPermission ? 'flex' : 'hidden'
      }`}
    >
      <Search
        class="top-24 mt-2 right-10"
        searchMenu={memberSearchMenu}
        bind:value={searchQuery}
        on:select={selectMenu}
        label={selectedSearchMenu?.name}
      />
    </div>
    {#if loading}
      <MemberSkeleton />
    {:else}
      <div
        class={`grid grid-flow-row my-8 gap-4 ${
          innerWidth > 1257 ? 'grid-cols-3' : 'grid-cols-2'
        }`}
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
    {/if}
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
