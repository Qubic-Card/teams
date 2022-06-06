<script>
  import supabase from '@lib/db';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload();
  };
</script>

<div
  class="z-50 absolute border shadow-xl text-sm right-0 flex flex-col md:right-2 top-[85px] w-[98.5%] md:w-[263px] sm:mx-2 md:mx-0 p-4 md:p-2 bg-neutral-900 text-white h-auto"
>
  <button class=" text-black bg-gray-100 p-2 w-full" on:click={handleLogout}
    >Log Out</button
  >
</div>
