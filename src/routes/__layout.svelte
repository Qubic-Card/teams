<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import {
    setUserData,
    user,
    userChangeTimestamp,
  } from '@lib/stores/userStore';
  import '../app.css';
  import { teamId } from '@lib/stores/profileData';

  onMount(async () => {
    setUserData(await getRoleMapsByProfile($user?.id, $teamId));
  });
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
