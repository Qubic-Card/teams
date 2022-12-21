<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { goto } from '$app/navigation';
  import { user } from '@lib/stores/userStore.js';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';
  import MenuButtonModal from '@comp/modals/menuButtonModal.svelte';

  let showMenu = false;

  let isMounted = false;
  onMount(() => (isMounted = true));
</script>

<svelte:head>
  <title>Qubic Editor</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>
<AuthWrapper>
  {#if isMounted}
    <div
      class="flex text-white bg-white border-b border-zinc-500 justify-between items-center pl-4 py-1"
    >
      <button
        class="border-r border-zinc-500 h-full text-black w-24 text-2xl"
        on:click={async () => await goto('/')}
      >
        ←
      </button>
      {#if $user != null}
        <MenuButtonModal editor="basic" />
      {/if}
    </div>
  {/if}
  <SvelteToast />

  <slot />
</AuthWrapper>
