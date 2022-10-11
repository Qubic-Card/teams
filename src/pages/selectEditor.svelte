<script>
  import { toastFailed } from '@lib/utils/toast';
  import { goto } from '$app/navigation';
  import { fly, slide } from 'svelte/transition';
  import { user } from '@lib/stores/userStore';
  import { cards } from '@lib/stores/cardsStore';
  import supabase from '@lib/db';

  let teams = [];

  const chooseTeam = (tid) => goto(`/${tid}/dashboard`);

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

      // if (teamsArr.length < 0) {
      //   $teams.isTeamMember = false;
      // } else $teams.isTeamMember = true;
    }
  };
</script>

{#await getTeamsList() then name}
  <section class="text-white overflow-hidden">
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
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1) ?? ''}
                </p>
                <!-- -> -->
              </div>
            {/each}
          {:else}
            <p>You don't have any teams yet.</p>
            <p class="text-sm">
              Contact us <span
                class="cursor-pointer font-bold underline"
                on:click={() =>
                  window.open('https://wa.me/628113087599', '_blank').focus()}
                >here</span
              > to get started.
            </p>
          {/if}
        {/if}
      </div>

      <div class="bg-black md:w-full" />
    </div>
  </section>
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}
