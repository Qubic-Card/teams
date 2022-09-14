<script>
  import { goto } from '$app/navigation';

  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
</script>

<div
  class="z-50 absolute border shadow-xl text-sm right-4 flex flex-col md:right-2 top-[70px] w-2/3 md:w-[200px] sm:mx-2 md:mx-0 p-2 bg-neutral-900 text-white h-auto gap-2"
>
  <button
    class="text-black bg-gray-100 p-1 w-full flex justify-center text-xs md:text-sm"
    on:click={() => goto('/select-teams')}
  >
    Change team
  </button>
  <button
    class="text-xs md:text-sm text-black bg-gray-100 p-1 w-full"
    on:click={handleLogout}>Log Out</button
  >
</div>
