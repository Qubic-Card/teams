<script>
  import { toastFailed } from '@lib/utils/toast';
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { fade, fly, slide } from 'svelte/transition';
  import { user } from '@lib/stores/userStore';
  import SelectEditorSkeleton from '@comp/skeleton/selectEditorSkeleton.svelte';
  import { cards } from '@lib/stores/cardsStore';

  let teams = [];
  // 1a8bfef4-9e7e-4a8e-98a8-8d69f2fde038
  // 59
  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', $user?.id)
      .order('id', { ascending: true });

    if (error) console.log(error);

    if (data) {
      let newData = [];

      let uniqueTeamId = [...new Set(data.map((t) => t.team_id.id))];

      data.filter((t) => {
        if (uniqueTeamId.includes(t.team_id.id)) {
          newData.push(t.team_id);
          uniqueTeamId = uniqueTeamId.filter((m) => m !== t.team_id.id);
        }
      });

      teams = newData;
    }
  };

  const chooseTeam = (tid) => goto(`/${tid}/dashboard`);
</script>

<section class="text-white overflow-hidden">
  {#await getTeamsList()}
    <!-- <SelectEditorSkeleton /> -->
  {:then}
    <div
      class="flex justify-around items-center h-screen p-10 md:p-24 text-black"
    >
      <div
        class="flex flex-col h-full w-full p-4 lg:w-1/2 py-12 md:py-16  gap-2 bg-white rounded-2xl"
        in:fly|local={{ y: 5000, duration: 1000 }}
      >
        <h1 class="text-xl md:text-2xl font-bold mb-4">Select Editor</h1>
        {#if $cards}
          <div
            on:click={() => {
              if ($user?.confirmed_at) goto('/basic');
              else toastFailed('Please confirm your email first');
            }}
            transition:slide|local={{ duration: 500 }}
            class="flex items-center justify-between p-3 md:p-4 mb-3 border border-neutral-300 rounded-md w-full cursor-pointer bg-black text-white transition-colors duration-200"
          >
            <p>Basic Editor</p>
          </div>
        {/if}

        <h2>Teams</h2>
        {#if teams}
          {#if teams.length > 0}
            {#each teams as item}
              <div
                on:click={() => chooseTeam(item.id)}
                transition:slide|local={{ duration: 500 }}
                class="flex items-center justify-between p-3 md:p-4 border border-neutral-300 hover:border-neutral-400 rounded-md w-full cursor-pointer hover:bg-white/80 bg-white text-black transition-colors duration-200"
              >
                <p>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1) ??
                    'No team name'}
                </p>
                <!-- -> -->
              </div>
            {/each}
          {:else}
            <div class="text-center">
              <p class="text-lg">You don't have any team yet</p>
            </div>
          {/if}
        {/if}
      </div>

      <div class="bg-black md:w-full" />
    </div>
  {:catch}
    <div>
      <h1 class="text-xl text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again <br /> or
        <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
      </h1>
    </div>
  {/await}
</section>
