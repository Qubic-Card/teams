<script>
  import supabase from '@lib/db';
  import { page } from '$app/stores';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { onMount } from 'svelte';

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
      .select('profile(*)')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };

  let team = [];

  onMount(async () => {
    members = await getTeamMembers();
    members = members.map((member) => member.profile);
  });
  $: {
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
  <div class="grid grid-cols-3 grid-flow-row gap-6 my-8">
    {#each members as member}
      <MemberCard {member} />
    {/each}
  </div>
</div>
