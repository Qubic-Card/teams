<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { user } from '@lib/stores/userStore';
  import '../app.css';
  import { onMount } from 'svelte';
  import useAuth from '@lib/useAuth.js';

  $: console.log('layout', $user);
  // onMount(() => useAuth($user));
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
