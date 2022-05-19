<script>
  import supabase from '@lib/db';
  import { page } from '$app/stores';
  import MemberCard from '@comp/cards/memberCard.svelte';
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';

  let teamId = parseInt(Cookies.get('teamId'));
  let memberss = [];

  const getTeamMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('profile(*)')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };

  const members = [
    { name: 'John Doe', position: 'CEO', isActive: true, uid: '1412' },
    {
      name: 'Jane Doe',
      position: 'CFO',
      isActive: false,
      uid: '2352323',
    },
    {
      name: 'John Smith',
      position: 'CTO',
      isActive: true,
      uid: '675636',
    },
    {
      name: 'Jane Smith',
      position: 'CMO',
      isActive: false,
      uid: '92830958',
    },
  ];
  let team = [];

  onMount(async () => {
    memberss = await getTeamMembers();
    memberss = memberss.map((member) => member.profile);
  });
  $: {
    console.log(memberss, teamId);
    // console.log(memberss.map((member) => member.profile));
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
    {#each memberss as member}
      <MemberCard {member} />
    {/each}
  </div>
</div>
