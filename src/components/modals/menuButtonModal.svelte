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
      ? 'h-48'
      : 'h-0 translate-y-10 md:opacity-0'} {editor == 'team'
      ? 'bg-neutral-900 text-white p-3 border border-neutral-700 gap-2 md:top-20 right-0 md:right-6'
      : 'bg-white text-black gap-2 p-3 md:top-16 right-0 md:right-4'} flex flex-col ml-0 lg:ml-12 w-full md:w-96 md:max-w-xs px-4 pb-4 bottom-0 fixed z-50 shadow-lg rounded-lg outline-none focus:outline-none overflow-y-auto snap-container"
  >
    {#if editor === 'team'}
      {#if $user}
        <p class="text-sm">
          Logged-in as <br />
        </p>
        <p class="text-white">{$user?.email ?? ''}</p>
      {/if}
    {/if}

    {#if editor === 'basic'}
      <a
        class="border-b hover:font-semibold md:text-sm text-xs"
        href="https://qubic.id/pages/contactus">Contact Support</a
      >
      <a
        class="hover:font-semibold md:text-sm text-xs"
        href="https://qubic.id/products#howitworks">Tutorial</a
      >
    {/if}

    <div class="border-b border-neutral-700 my-1" />

    <h2 class="font-semibold">Actions</h2>
    <button
      class="w-full flex items-center h-8 text-xs md:text-sm"
      on:click={() => {
        $isInViewTriggered = false;
        goto('/');
      }}
    >
      Change Editor
    </button>
    <button
      class="flex items-center text-xs md:text-sm w-full h-9"
      on:click={handleLogout}>Log Out</button
    >
  </Dialog>
{/if}
