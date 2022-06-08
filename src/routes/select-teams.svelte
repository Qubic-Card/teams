<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import Cookies from 'js-cookie';
  import { user, userData } from '@lib/stores/userStore';
  import SelectTeamsSkeleton from '@comp/skeleton/selectTeamsSkeleton.svelte';

  let teams = [];
  let isHasPermission = false;

  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', $user.id);

    if (error) console.log(error);

    if (data) {
      teams = data;
    }
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_write_team') isHasPermission = true;
  });

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
  {#await getTeamsList()}
    <SelectTeamsSkeleton />
  {:then}
    <h1 class="text-3xl font-bold mb-4">Select team</h1>
    {#each teams as item}
      <div
        on:click={() =>
          chooseTeam(item.team_id.name.split(' ').join('+'), item.team_id.id)}
        transition:slide|local={{ duration: 500 }}
        class="flex items-center border-2 border-neutral-500 p-4 rounded-md w-96 cursor-pointer hover:bg-neutral-900 transition-colors duration-200"
      >
        <img
          src="https://placeimg.com/640/480/any"
          alt={item.team_id.name + ' logo'}
          class="h-12 w-12 mr-2 rounded-full"
        />
        <p>{item.team_id.name}</p>
      </div>
    {/each}
    {#if isHasPermission}
      <p class="cursor-pointer p-2" on:click={() => addTeam('Teams')}>
        + add team
      </p>
    {/if}
  {:catch}
    <h1>Something went wrong. Please try again later.</h1>
  {/await}
</div>
