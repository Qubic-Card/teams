<script>
  import { goto } from '$app/navigation';

  import supabase from '@lib/db';
  import { isInViewTriggered } from '@lib/stores/intersectingStore';
  import { user } from '@lib/stores/userStore';

  export let editor = 'team';

  const handleLogout = async () => await supabase.auth.signOut();
</script>

<div
  class="z-50 absolute border shadow-xl text-sm right-4 flex flex-col md:right-2 w-2/3 md:w-[300px] sm:mx-2 md:mx-0 p-2 {editor ===
  'team'
    ? 'bg-neutral-900 text-white top-[76px]'
    : 'bg-white text-black'} h-auto gap-2 top-[50px]"
>
  {#if editor === 'team'}
    {#if $user}
      <h1>Logged-in as <strong>{$user?.email ?? ''}</strong></h1>
    {/if}
  {/if}

  {#if editor === 'basic'}
    <a class="p-2 border-b hover:font-bold" href="/pages/contactus"
      >Contact Support</a
    >
    <a class="p-2 hover:font-bold" href="/products#howitworks">Tutorial</a>
  {/if}

  <button
    class="{editor === 'team'
      ? 'text-black bg-gray-100'
      : 'border hover:bg-black hover:text-white border-black'} p-1 w-full flex h-8 justify-center items-center text-xs md:text-sm"
    on:click={() => {
      $isInViewTriggered = false;
      goto('/');
    }}
  >
    Change Editor
  </button>
  <button
    class="{editor === 'team'
      ? 'text-black bg-gray-100'
      : 'text-white bg-black'} text-xs md:text-sm text-black p-2 w-full h-9"
    on:click={handleLogout}>Log Out</button
  >
</div>
