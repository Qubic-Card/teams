<script>
  import supabase from '@lib/db';
  import { page } from '$app/stores';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { onMount } from 'svelte';
  import { user } from '@lib/stores/userStore';
  import { memberRights } from '@lib/stores/memberRightsStore';
  $: console.log($memberRights);

  let allData = [];
  let members = [];

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
      .select('role, profile(*), team_id(*)')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };

  onMount(async () => {
    allData = await getTeamMembers();
    members = allData.map((member) => member.profile);
  });
  $: {
    // console.log(allData, members, memberRole, roleMapping, memberRight[0]);
    console.log(members);
  }
</script>

<div class="flex flex-col">
  <div
    class="flex justify-center items-center bg-neutral-800 w-full h-96 text-4xl font-bold brightness-50"
    style="background-image: url(https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)"
  >
    {$page.params.slug}
  </div>
  {#each $memberRights as item, i}
    {#if item[i] === 'allow_read_members'}
      <p>allowed read members</p>
    {:else}
      <p>denies read members</p>
    {/if}
  {/each}
  <div class="grid grid-cols-3 grid-flow-row gap-6 my-8">
    {#each $memberRights as item, i}
      {#each members as member}
        {#if member.uid === $user.id}
          <MemberCard {member} />
        {:else if item[i] === 'allow_read_members'}
          <MemberCard {member} />
        {:else}
          <div class="bg-neutral-800 w-full h-full">
            You are not allowed to read members
          </div>
        {/if}
      {/each}
    {/each}
  </div>
</div>
