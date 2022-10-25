<script>
  import { sevenDays } from '@lib/utils/getDates';
  import supabase from '@lib/db';
  import TeamAnalyticsCard from '@comp/cards/teamAnalyticsCard.svelte';
  import { tapCount } from '@lib/utils/count';
  import { socialIcons } from '@lib/constants';
  import { getContext } from 'svelte';
  import { teams } from '@lib/stores/teamStore';
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';
  import TeamActivity from '@pages/teamActivity.svelte';
  import sortTeamMember from '@lib/utils/sortTeamMembers';

  const teamId = getContext('teamId');
  let loading = true;

  const analyticsData = [
    {
      percentage: 0,
      data: 0,
      type: 'Contacts',
    },
    {
      percentage: 0,
      data: 0,
      type: 'Taps',
    },
  ];

  let previousConnectionCount = 0;
  let currentConnectionCount = 0;
  let previousTeamLogsCount = 0;
  let currentTeamLogsCount = 0;
  let maxPage = 0;
  let page = 0;
  let toItem = 5;
  let teamMembers = [];
  let searchQuery = '';
  let socialsCount = [];
  let memberCountPercentage = 0;

  const getPercentage = (current, previous) => {
    const calc = current - previous;
    if (calc !== 0) {
      return Math.floor((calc / previous) * 100);
    } else {
      return 0;
    }
  };

  const setPage = (p) => (page = p);

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getTeamConnectionsPreviousList = async () => {
    // loading = true;
    let {
      data,
      error: team_error,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte('dateConnected', new Date(new Date(sevenDays[0])).toUTCString())
      .order('dateConnected', { ascending: false });

    if (data) previousConnectionCount = count;

    if (team_error) console.log(team_error);
    loading = false;
  };

  const getTeamWeeklyLogsPreviousActivity = async () => {
    // loading = true;
    try {
      let { error, count } = await supabase
        .from('team_logs')
        .select('created_at', { count: 'estimated' })
        .eq('team', teamId)
        .gte('created_at', new Date(new Date(sevenDays[0])).toUTCString())
        .order('created_at', { ascending: false });
      if (count) previousTeamLogsCount = count;
      loading = false;
    } catch (error) {
      console.log(error);
      loading = false;
    }
  };

  const getTeamConnections = async () => {
    // loading = true;
    let {
      data,
      error: team_error,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte('dateConnected', new Date(new Date(sevenDays[0])).toUTCString())
      // .rangeLt('dateConnected', [a, b])
      .order('dateConnected', { ascending: false });

    if (data) {
      analyticsData[0].data = count;
      currentConnectionCount = count;
    }
    if (team_error) console.log(team_error);

    loading = false;
  };

  const getTeamWeeklyLogsActivity = async () => {
    // loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('team_logs')
        .select(
          'created_at, data->card, data->message, data->link, type, team, card_holder',
          { count: 'estimated' }
        )
        .eq('team', teamId)
        .gte('created_at', new Date(new Date(sevenDays[0])).toISOString())
        .order('created_at', { ascending: false });

      if (logs) {
        let newArr = [];

        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });

        logs = logs.filter(
          (log) => !log.message.includes('QRScan' || 'QRShare' || 'NFC')
        );

        analyticsData[1].data = count;

        socialsCount = tapCount(Object.keys(socialIcons), logs);
        // console.log(socialsCount);
        let totalSocialsCount = socialsCount
          .map((s) => s.value)
          .reduce((a, b) => a + b, 0);

        socialsCount = socialsCount?.map((s) => {
          return {
            name: s.name,
            value: Math.round((s.value * 100) / totalSocialsCount),
          };
        });
        // console.log(socialsCount);

        currentTeamLogsCount = count;
        loading = false;
      }
    } catch (error) {
      console.log(error);
      loading = false;
    }
  };

  const getTeamMembersCount = async () => {
    const { data, error, count } = await supabase
      .from('team_members')
      .select('id', { count: 'exact' })
      .eq('team_id', teamId);

    if (error) console.log(error);

    if (data) {
      memberCountPercentage = Math.ceil((count / $teams?.member_count) * 100);
    }
  };

  const getTeamMemberActivities = async () => {
    loading = true;
    const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('team_members')
      .select(
        'id, team_profile->firstname, team_profile->lastname, team_profile->job, team_profile->avatar, team_logs: team_logs(data, type, created_at, card_holder), connections: team_connection_acc(*)',
        { count: 'estimated' }
      )
      .eq('team_id', teamId)
      .order('member_from', { ascending: false })
      .range(from, to)
      .order('created_at', { foreignTable: 'team_logs', ascending: false })
      // .limit(1, { foreignTable: 'team_logs' })
      .ilike('team_profile->>firstname', `%${searchQuery}%`);

    if (error) {
      loading = false;
      console.log(error);
    }
    if (data) {
      let res = sortTeamMember(data);

      teamMembers = res;
      maxPage = Math.ceil(count / toItem);
      loading = false;
      console.log(error);
    }
    if (data) {
      // order sort member data

  const getAll = async () => {
    await getTeamWeeklyLogsActivity();
    await getTeamConnections();
    await getTeamConnectionsPreviousList();
    await getTeamWeeklyLogsPreviousActivity();
    await getTeamMembersCount();

    analyticsData[0].percentage = getPercentage(
      currentTeamLogsCount,
      previousTeamLogsCount
    );

    analyticsData[1].percentage = getPercentage(
      currentConnectionCount,
      previousConnectionCount
    );
  };

  $: page, searchQuery, getTeamMemberActivities();
</script>

<div
  class="min-h-screen flex flex-col text-white gap-4 mb-8 pt-16 pl-16 md:pl-24 pr-4"
>
  {#await getAll()}
    <TeamAnalyticsLogsSkeleton all search />
  {:then name}
    <div class="flex justify-between gap-4">
      <div class="flex flex-col w-full gap-4">
        <h1>Data from last 7 days</h1>
        <div class="flex flex-col md:flex-row gap-2 w-full">
          <TeamAnalyticsCard
            arr={analyticsData}
            teamMembersLength={teamMembers.length}
            {memberCountPercentage}
            {socialsCount}
          />
        </div>
        <!-- <AnalyticsDropdownButton on:select={selectDaysHandler} /> -->
      </div>
    </div>

    <div class="flex lg:hidden text-xs md:text-sm w-full justify-center mt-8">
      View more on desktop
    </div>

    <TeamActivity
      {loading}
      {teamMembers}
      {toItem}
      {page}
      {setPage}
      {maxPage}
      bind:value={searchQuery}
    />
  {:catch name}
    <h1>Error</h1>
  {/await}
</div>
