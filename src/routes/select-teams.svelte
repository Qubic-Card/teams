<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Cookies from 'js-cookie';
  import { user } from '@lib/stores/userStore';

  let teams = [];

  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', '39ba7789-537c-4b0f-a8a7-c8a8345838f3');

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };

  onMount(async () => {
    teams = await getTeamsList();
  });
  $: console.log(teams);
  const addTeam = (item) => (teams = [...teams, item]);

  const chooseTeam = (team, id) => {
    Cookies.set('qubicTeamName', team.split('+').join(' '));
    Cookies.set('qubicTeamId', id);
    goto(`/${team}/dashboard`);
  };
</script>

<div
  class="h-screen flex flex-col gap-2 justify-center items-center bg-black/90 text-white"
>
  <h1 class="text-3xl font-bold">Select team</h1>
  {#each teams as item}
    <div
      on:click={() =>
        chooseTeam(item.team_id.name.split(' ').join('+'), item.team_id.id)}
      transition:slide|local={{ duration: 500 }}
      class="flex items-center border-2 border-neutral-500 p-4 rounded-md w-96 cursor-pointer hover:bg-neutral-900 transition-colors duration-200"
    >
      <img
        src={item.team_id.metadata.logo}
        alt={item.team_id.name + ' logo'}
        class="h-8 w-8 mr-2"
      />
      <p>{item.team_id.name}</p>
    </div>
  {/each}
  <p class="cursor-pointer p-2" on:click={() => addTeam('Teams')}>+ add team</p>
</div>
