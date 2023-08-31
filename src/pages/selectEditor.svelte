<script>
  import { toastFailed } from '@lib/utils/toast';
  import { goto } from '$app/navigation';
  import { fly, slide } from 'svelte/transition';
  import { user } from '@lib/stores/userStore';
  import supabase from '@lib/db';
  import { checkIsActiveMember } from '@lib/query/checkIsActiveMember';
  import { onMount } from 'svelte';

  let teams = [];
  let isHasBasic = false;
  let isTeamMember = true;

  const chooseTeam = (tid) => goto(`/${tid}/dashboard`);

  const getBusinessCards = async (uid) => {
    try {
      let { data, error } = await supabase
        .from('card_connection')
        .select('card_id(mode)')
        .eq('uid', uid);

      if (error) throw error;

      if (data?.length > 0) {
        let basicCards = data.filter((card) => card.card_id.mode === 'basic');
        if (basicCards.length !== 0) {
          isHasBasic = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamsList = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*)')
      .eq('uid', $user?.id)
      .order('id', { ascending: true });

    if (error) console.log(error);

    if (data) {
      if (data.length > 0) {
        let newData = [];

        let uniqueTeamId = [...new Set(data.map((t) => t.team_id.id))];

        data.filter((t) => {
          if (uniqueTeamId.includes(t.team_id.id)) {
            newData.push(t.team_id);
            uniqueTeamId = uniqueTeamId.filter((m) => m !== t.team_id.id);
          }
        });

        teams = newData;
        if (!isHasBasic && teams.length === 0) {
          $user = null;
        }
      } else {
        isTeamMember = false;
      }
      // if (teamsArr.length < 0) {
      //   $teams.isTeamMember = fals
      // } else $teams.isTeamMember =
    }
  };

  onMount(async () => {
    if ($user) {
      await getBusinessCards($user?.id);
      await getTeamsList();
    }
  });
</script>


  
    <div
      class="flex flex-col h-full w-full p-4  py-6 gap-2 bg-white rounded-md md:rounded-xl"
      in:fly|local={{ y: 5000, duration: 1000 }}
    >
      <h1 class="text-xl text-black md:text-2xl font-semibold mb-2 md:mb-4">
        Select Editor
      </h1>
      {#if !isHasBasic && !isTeamMember}
        <div class="flex text-black flex-col justify-between h-full">
          <div>
            <h1>Inactive account</h1>
            <h1 class="text-sm text-neutral-700">Please activate your account using Qubic product.</h1>
            <p>
              Need help? <button
                class="font-bold"
                on:click={() =>
                  window.open('https://wa.me/628113087599', '_blank').focus()}
              >
                Contact us!
              </button>
            </p>
          </div>
          <button
            class="w-40 border border-neutral-600 rounded-md p-3"
            on:click={async () => {
              await supabase.auth.signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      {/if}
      {#if isHasBasic}
        <button
          on:click={() => {
            if ($user?.confirmed_at) goto('/basic');
            else toastFailed('Please confirm your email first');
          }}
          transition:slide|local={{ duration: 500 }}
          class="flex items-center justify-between p-3 md:p-4 mb-3 border border-neutral-300 rounded-md w-full cursor-pointer bg-blue-600 text-white transition-colors duration-200"
        >
          <p>Basic Editor</p>
        </button>
      {/if}

      {#if isTeamMember}
        <h2 class="font-medium text-black">Teams</h2>
        {#if teams}
          {#if teams.length > 0}
            {#each teams as item}
              <button
                on:click={() => chooseTeam(item.id)}
                transition:slide|local={{ duration: 500 }}
                class="flex items-center p-3 md:p-4 bg-neutral-100  gap-2 hover:border-neutral-400 rounded-md w-full cursor-pointer hover:bg-white/80  text-black transition-colors duration-200"
              >
                <img
                  src={item.metadata.logo != null && item.metadata.logo.toString().length > 0 ? item.metadata.logo : '/favicon.svg'}
                  alt=""
                  class="w-10 h-10 rounded-md bg-black"
                />

                <p>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1) ?? ''}
                </p>
              </button>
            {/each}
          {:else}
            <p class="text-neutral-600">You don't have any teams yet.</p>
            <p class="text-sm">
              Contact us <button
                class="cursor-pointer font-semibold underline"
                on:click={() =>
                  window.open('https://wa.me/628113087599', '_blank').focus()}
                >here</button
              > to get started.
            </p>
          {/if}
        {/if}
      {/if}
      <div class="h-full"></div>
      <button on:click={async ()=> {
        await supabase.auth.signOut();
      }} class=" border border-red-500 text-red-500 py-3 rounded-md">
        Logout
      </button>
    </div>

   
<!-- {:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-semibold">
        contact us!
      </a>
    </h1>
  </div>
{/await} -->
