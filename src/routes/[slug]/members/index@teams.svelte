<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { memberRights } from '@lib/stores/memberRightsStore';
  import { getTeamId } from '@lib/query/getId';

  let members = [];
  let ownProfile = [];
  let isHasPermission = false;
  let searchQuery = '';
  let loading = false;

  const getTeamMembers = async () => {
    let teamId = await getTeamId($user.id);
    const { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };

  const searchMemberHandler = async () => {
    loading = true;
    let teamId = await getTeamId($user.id);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .ilike('team_profile->>firstname', `%${searchQuery}%`);

    loading = false;
    if (error) console.log(error);
    if (data) {
      console.log(data);
      members = data;
      return data;
    }
  };

  onMount(async () => (members = await getTeamMembers()));

  $: {
    $memberRights?.filter((item) => {
      if (item === 'allow_read_members') isHasPermission = true;
    });

    members;

    members.map((member) => {
      if (member.uid === $user.id) ownProfile = member;
    });
  }
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
      <button
        class="p-2 bg-neutral-700 rounded-lg w-28"
        on:click={async () => await searchMemberHandler()}>Search</button
      >
    </div>
    <div class="grid grid-cols-3 grid-flow-row gap-6 my-8">
      {#each members as member}
        {#if isHasPermission === false && member.uid === ownProfile.uid}
          <MemberCard member={ownProfile} />
        {:else if isHasPermission === true}
          <MemberCard {member} />
        {/if}
      {/each}
    </div>
  {:catch}
    <h1>Some error occurred. Please reload the page and try again.</h1>
  {/await}
</div>
