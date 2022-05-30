<script>
  import supabase from '@lib/db';
  import { page } from '$app/stores';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { onMount } from 'svelte';
  import { user } from '@lib/stores/userStore';
  import { memberRights } from '@lib/stores/memberRightsStore';
  import MemberSkeleton from '@comp/skeleton/memberSkeleton.svelte';

  let members = [];
  let ownProfile = [];
  let isHasPermission = false;
  let searchQuery = '';

  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const getTeamMembers = async () => {
    let teamId = await getTeamId();
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
    let teamId = await getTeamId();
    const search = searchQuery.toLowerCase();
    const { data, error } = await supabase
      .from('team_members')
      .select('team_profile')
      .eq('team_id', teamId)
      .match({ team_profile: 'galih' });
    // .textSearch('team_profile', 'galih', {
    //   // type: 'plain',
    //   config: 'english',
    // });
    if (error) console.log(error);
    if (data) {
      console.log(data);
      return data;
    }
  };

  const testFilterHandler = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('team_roles')
      .select('*')
      .eq('team_id', teamId)
      // .filter('role_name', 'in', 'admin');
      // .match({ role_name: searchQuery });
      .order('role_name', { ascending: false });
    if (error) console.log(error);
    if (data) {
      console.log(data);
      return data;
    }
  };

  onMount(async () => {
    members = await getTeamMembers();
    await searchMemberHandler();
    await testFilterHandler();
  });

  $: {
    $memberRights?.filter((item) => {
      if (item === 'allow_read_members') isHasPermission = true;
    });

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
    <div class="flex justify-end mt-6 gap-2">
      <input
        type="text"
        class="w-[400px] h-12 p-2 border-2 border-neutral-500 text-black bg-neutral-800"
        placeholder="Search name"
        bind:value={searchQuery}
      />
      <button
        class="p-2 bg-neutral-700 rounded-lg w-28"
        on:click={async () => await testFilterHandler()}>Search</button
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
