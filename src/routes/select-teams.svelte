<script>
  import Cookies from 'js-cookie';
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { slide } from 'svelte/transition';
  import { user, userData } from '@lib/stores/userStore';
  import SelectTeamsSkeleton from '@comp/skeleton/selectTeamsSkeleton.svelte';
  import AddTeamModal from '@comp/modals/addTeamModal.svelte';

  let teams = [];

  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', $user?.id);

    if (error) console.log(error);

    if (data) {
      teams = data;
    }
  };

  const chooseTeam = (teamId) => {
    Cookies.set('qubicTeamId', teamId);
    goto(`/${teamId}/dashboard`);
  };
</script>

<div
  class="h-screen flex flex-col gap-2 justify-center items-center bg-black/90 text-white"
>
  {#await getTeamsList()}
    <SelectTeamsSkeleton />
  {:then}
    <h1 class="text-3xl font-bold mb-4">Select team</h1>
    {#if teams}
      {#if teams.length > 0}
        {#each teams as item}
          <div
            on:click={() => chooseTeam(item.team_id.id)}
            transition:slide|local={{ duration: 500 }}
            class="flex items-center border-2 border-neutral-500 p-4 rounded-md w-96 cursor-pointer hover:bg-neutral-900 transition-colors duration-200"
          >
            {#if item.team_id.metadata.logo === ''}
              <div
                class="bg-neutral-700 w-12 h-12 rounded-md flex justify-center items-center mr-2"
              >
                {item.team_id.name.charAt(0).toUpperCase()}
              </div>
            {:else}
              <img
                src={item.team_id.metadata.logo}
                alt={item.team_id.name + ' logo'}
                class="h-12 w-12 mr-2 rounded-md"
              />
            {/if}
            <p>
              {item.team_id.name.charAt(0).toUpperCase() +
                item.team_id.name.slice(1) ?? 'No team name'}
            </p>
          </div>
        {/each}
      {:else}
        <div class="text-center">
          <p class="text-lg">You don't have any team yet</p>
        </div>
      {/if}
    {/if}
    <AddTeamModal />
  {:catch}
    <h1>Something went wrong. Please try again later.</h1>
  {/await}
</div>
