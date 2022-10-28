<script>
  import { fade } from 'svelte/transition';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { teamData } from '@lib/stores/profileData';
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { isInViewTriggered } from '@lib/stores/intersectingStore';
  import { user } from '@lib/stores/userStore';

  export let editor = 'team';
  export let logo = '';

  let isOpen = false;

  const handleLogout = async () => await supabase.auth.signOut();
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click={() => (isOpen = false)}
  />
{/if}

{#if editor === 'team'}
  {#if logo}
    <img
      on:click={() => (isOpen = true)}
      src={logo}
      alt="avatar"
      class="rounded-full w-10 h-10 cursor-pointer"
    />
  {:else if logo === ''}
    <div
      on:click={() => (isOpen = true)}
      class="bg-neutral-800 p-4 rounded-full w-12 h-12 cursor-pointer flex items-center justify-center"
    />
  {:else}
    <div class="animate-pulse p-4">
      <div class="text-5xl w-12 h-12 bg-neutral-800 rounded-full" />
    </div>
  {/if}
{:else}
  <button
    on:click|preventDefault={() => (isOpen = true)}
    class="p-3 bg-black rounded-full h-10 flex items-center justify-center mx-2 w-10"
  >
    {$user.email.charAt(0).toUpperCase()}
  </button>
{/if}

{#if isOpen}
  <Dialog
    open={isOpen}
    on:close={() => (isOpen = false)}
    class="transition-all md:transition-none duration-300 ease-in-out {isOpen
      ? `${editor === 'team' ? 'h-44' : 'h-40'}`
      : 'h-0 translate-y-10 md:opacity-0'} {editor == 'team'
      ? 'bg-neutral-900 text-white p-3 outline outline-1 outline-neutral-800 gap-4 top-28 md:top-20 right-0 md:right-6'
      : 'bg-white text-black gap-2 p-3 top-16 right-0 md:right-4'} flex flex-col ml-0 lg:ml-12 w-full md:w-96 md:max-w-md px-4 pb-4 bottom-0 fixed z-50 shadow-lg rounded-lg outline-none focus:outline-none overflow-y-auto snap-container"
  >
    {#if editor === 'team'}
      {#if $user}
        <h1 class="md:text-sm text-xs">
          Logged-in as <br /><strong>{$user?.email ?? ''}</strong>
        </h1>
      {/if}
    {/if}

    {#if editor === 'basic'}
      <a
        class="border-b hover:font-bold md:text-sm text-xs"
        href="/pages/contactus">Contact Support</a
      >
      <a class="hover:font-bold md:text-sm text-xs" href="/products#howitworks"
        >Tutorial</a
      >
    {/if}

    <button
      class="{editor === 'team'
        ? 'text-white bg-neutral-700'
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
        ? 'text-white bg-neutral-700'
        : 'text-white bg-black'} text-xs md:text-sm text-black p-2 w-full h-9"
      on:click={handleLogout}>Log Out</button
    >
  </Dialog>
{/if}
