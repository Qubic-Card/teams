<script>
  import Cookies from 'js-cookie';
  import {
    memberData,
    user,
    userChangeTimestamp,
    userData,
  } from '@lib/stores/userStore';
  import { onMount } from 'svelte';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import { getUserChangeTs } from '@lib/query/getUserChangeTimestamp';

  let member = { id: 0, role: { role_maps: [], role_name: '' } };
  let teamId = Cookies.get('qubicTeamId');

  let loading = true;

  $: {
    $userData = member.role.role_maps;
    $memberData.id = member.id;
  }

  onMount(async () => {
    member = await getRoleMapsByProfile($user?.id, teamId);
    userChangeTimestamp.set(await getUserChangeTs($user?.id, teamId));

    if (member || userChangeTimestamp) loading = false;
  });
</script>

<slot {loading} />
