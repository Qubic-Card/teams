<script>
  import Cookies from 'js-cookie';
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { fade, fly, slide } from 'svelte/transition';
  import { user } from '@lib/stores/userStore';
  import SelectTeamsSkeleton from '@comp/skeleton/selectTeamsSkeleton.svelte';
  import { teamId } from '@lib/stores/profileData';
  // import AddTeamModal from '@comp/modals/addTeamModal.svelte';

  let teams = [];

  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', $user?.id)
      .order('id', { ascending: true });

    if (error) console.log(error);

    if (data) {
      teams = data;
    }
  };

  const chooseTeam = (tid) => {
    $teamId = tid;
    // Cookies.set('qubicTeamId', teamId);
    // Cookies.set('qubicTeamStartDate', startDate)
    goto(`/${tid}/dashboard`);
  };
</script>

<section class="text-white">
  <div class="border-b border-neutral-700 absolute w-screen top-16" />
  <div class="border-t border-neutral-700 absolute w-screen bottom-16" />
  <div class="border-r border-neutral-700 absolute h-screen right-16" />
  <div class="border-l border-neutral-700 h-screen absolute left-16" />
  {#await getTeamsList()}
    <SelectTeamsSkeleton />
  {:then}
    <div class="flex justify-around items-center h-screen p-24">
      <div
        class="flex flex-col h-full w-[50%] pr-32 py-16 gap-2"
        in:fly|local={{ y: 5000, duration: 1000 }}
      >
        <h1 class="text-xl mb-4">Choose team</h1>
        {#if teams}
          {#if teams.length > 0}
            {#each teams as item}
              <div
                on:click={() => chooseTeam(item.team_id.id)}
                transition:slide|local={{ duration: 500 }}
                class="flex items-center justify-between p-4 rounded-md w-96 cursor-pointer hover:bg-white/80 bg-white text-black transition-colors duration-200"
              >
                <p>
                  {item.team_id.name.charAt(0).toUpperCase() +
                    item.team_id.name.slice(1) ?? 'No team name'}
                </p>
                ->
              </div>
            {/each}
          {:else}
            <div class="text-center">
              <p class="text-lg">You don't have any team yet</p>
            </div>
          {/if}
        {/if}
        <!-- <AddTeamModal /> -->
      </div>

      <div
        in:fade|local
        class="w-[40%] h-full rounded-md bg-cover"
        style={`background-image:url(${'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'})`}
      />
    </div>
  {:catch}
    <h1>Something went wrong. Please try again later.</h1>
  {/await}
</section>
