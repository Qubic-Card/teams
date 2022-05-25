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
  let allData = [];
  let memberRole = [];
  let roleMapping = [];
  let memberRight = [];

  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const getTeamMembers = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id(*), role')
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      return data;
    }
  };

  onMount(async () => {
    allData = await getTeamMembers();
    memberRole = allData.map((member) => member.role);
    roleMapping = allData.map((member) => member.team_id.role_mapping);
    memberRight = Object.entries(roleMapping[0] ?? []).map(([key, value]) =>
      [key].map((item) => {
        if (item === memberRole[0]) {
          return value;
        }
      })
    );
    memberRight = memberRight.filter((item) => item[0] !== undefined);
    memberRight = memberRight.map((item) => item[0]);
  });

  $: setMemberRights(memberRight);
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
