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
  import { endDate } from '@lib/stores/endDateStore';
  import supabase from '@lib/db';

  let member = { id: 0, role: { role_maps: [], role_name: '' } };
  let teamId = Cookies.get('qubicTeamId');
  let today;
  let sevenDaysAfterEndDate = new Date(
    new Date($endDate).setDate(new Date($endDate).getDate() + 7)
  );
  let loading = true;
  let permissions = {
    readAnalytics: false,
  };

  const getToday = async () => {
    const { data, error } = await supabase.functions.invoke('globaldate');
    if (error) console.log(error);
    if (data) today = new Date(data.date).getTime();
  };

  onMount(async () => {
    await getToday();
    member = await getRoleMapsByProfile($user?.id, teamId);
    userChangeTimestamp.set(await getUserChangeTs($user?.id, teamId));

    if (member || userChangeTimestamp) loading = false;
  });

  $: {
    $userData = member.role.role_maps;
    $memberData.id = member.id;
  }
  $: $userData?.filter((item) => {
    if (item === 'allow_read_analytics') permissions.readAnalytics = true;
  });

  $: if (today > sevenDaysAfterEndDate?.getTime()) {
    if (member.role.role_name !== 'superadmin') {
      $userData = ['inactive'];
    } else {
      $userData = [
        'allow_read_roles',
        'allow_read_team',
        'allow_read_members',
        'allow_read_analytics',
        'allow_read_connections',
        'allow_read_billing',
        'inactive',
      ];
    }
  } else if (
    today > $endDate?.getTime() &&
    today < sevenDaysAfterEndDate?.getTime()
  ) {
    // if hari ini lebih besar daripada 7 hari setelah end date
    if (member.role.role_name !== 'superadmin') {
      $userData = ['will_expired'];
    } else {
      $userData = [
        'allow_read_roles',
        'allow_read_team',
        'allow_read_members',
        'allow_read_analytics',
        'allow_read_connections',
        'allow_read_billing',
        'will_expired',
      ];
    }
  } else {
    console.log('active');
  }

  $: {
    // console.log(today);
    // console.log(sevenDaysAfterEndDate);
    // console.log(member);
    // console.log($userData);
    // console.log($endDate);
  }
</script>

<slot {loading} {permissions} />
