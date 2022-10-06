<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { goto } from '$app/navigation';
  import { user } from '@lib/stores/userStore.js';
  import MenuButton from '@comp/buttons/menuButton.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { onMount } from 'svelte';

  let showMenu = false;

  const handleClick = () => {
    showMenu = !showMenu;
  };
  let isMounted = false;
  onMount(() => (isMounted = true));

  let back = '<-';
</script>

<svelte:head>
  <title>Qubic Editor</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>
<AuthWrapper>
  {#if isMounted}
    <div
      class="flex text-white bg-white border-b border-zinc-500 justify-between items-center pl-4"
    >
      <button
        class="border-r border-zinc-500 h-full text-black w-28 text-xl"
        on:click={async () => await goto('/')}
      >
        {back}
      </button>
      {#if $user != null}
        <button
          on:click|preventDefault={handleClick}
          class="p-3 bg-black rounded-full h-10 flex items-center justify-center mx-2 w-10"
        >
          {$user.email.charAt(0).toUpperCase()}
        </button>

        {#if showMenu}
          <MenuButton editor="basic" />
        {/if}
      {/if}
    </div>
  {/if}
  <SvelteToast />

  <slot />
</AuthWrapper>
