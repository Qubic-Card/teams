<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { setUserData, user } from '@lib/stores/userStore';
  import '../app.css';
  import { onMount } from 'svelte';
  import getRoleMaps from '@lib/query/getRoleMaps';

  $: console.log('layout', $user);

  let roleMapping = [];

  onMount(async () => (roleMapping = await getRoleMaps($user.id)));
  $: setUserData(roleMapping);
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
