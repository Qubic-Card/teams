<script>
  import { goto } from '$app/navigation';

  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';

  let teamCount = 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  const getTeamCount = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('uid', $user?.id);

    if (error) console.log(error);

    if (data) {
      teamCount = data.length;
    }
  };
  $: getTeamCount();
</script>

<div
  class="z-50 absolute border shadow-xl text-sm right-0 flex flex-col md:right-2 top-[70px] w-[98.5%] md:w-[200px] sm:mx-2 md:mx-0 p-4 md:p-2 bg-neutral-900 text-white h-auto gap-2"
>
  <button
    class={`text-black bg-gray-100 p-1 w-full ${
      teamCount > 1 ? 'flex justify-center' : 'hidden'
    }`}
    on:click={() => goto('/select-teams')}
  >
    Change team
  </button>
  <button class=" text-black bg-gray-100 p-1 w-full" on:click={handleLogout}
    >Log Out</button
  >
</div>
