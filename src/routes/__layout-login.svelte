<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { user } from '@lib/stores/userStore';
  import '../app.css';

  $: console.log('login layout', $user);
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<div class="relative min-h-screen">
  <slot />
</div>
