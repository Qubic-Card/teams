<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { user } from '@lib/stores/userStore';
  import '../app.css';
  import { onMount } from 'svelte';
  import useAuth from '@lib/useAuth.js';
  import supabase from '@lib/db';
  import { setMemberRights } from '@lib/stores/memberRightsStore';

  $: console.log('layout', $user);
  // onMount(() => useAuth($user));

  let roleMapping = [];

  const getTeamMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(*)')
      .eq('uid', $user.id);

    if (error) console.log(error);

    const { role_maps, role_name } = data[0].role;
    if (data) {
      return { role_maps, role_name };
    }
  };

  onMount(async () => {
    const { role_maps, role_name } = await getTeamMembers();
    roleMapping = role_maps;
    // [
  });

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
