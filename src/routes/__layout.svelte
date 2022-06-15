<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import { setUserData, user } from '@lib/stores/userStore';
  import '../app.css';

  let roleMapping = [];
  let teamId = Cookies.get('qubicTeamId');

  onMount(
    async () => (roleMapping = await getRoleMapsByProfile($user?.id, teamId))
  );
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
