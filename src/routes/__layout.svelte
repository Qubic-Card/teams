<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { user } from '@lib/stores/userStore';
  import '../app.css';
  import { onMount } from 'svelte';
  import useAuth from '@lib/useAuth.js';
  import supabase from '@lib/db';
  import { setMemberRights } from '@lib/stores/memberRightsStore';
  import getRoleMaps from '@lib/query/getRoleMaps';

  $: console.log('layout', $user);
  // onMount(() => useAuth($user));

  let roleMapping = [];

  onMount(async () => (roleMapping = await getRoleMaps($user.id)));
  $: setMemberRights(roleMapping);
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
