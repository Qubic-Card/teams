<script>
  import { sevenDays } from '@lib/utils/getDates';
  import supabase from '@lib/db';
  import TeamAnalyticsCard from '@comp/cards/teamAnalyticsCard.svelte';
  import { tapCount } from '@lib/utils/count';
  import { socialIcons } from '@lib/constants';
  import TeamAnalyticsCardSkeleton from '@comp/skeleton/teamAnalyticsCardSkeleton.svelte';
  import { getContext } from 'svelte';
  import TeamActivityCard from '@comp/cards/teamActivityCard.svelte';
  import Input from '@comp/input.svelte';
  import { teams } from '@lib/stores/teamStore';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';
  import TeamAnalyticsLogsSkeleton from '@comp/skeleton/teamAnalyticsLogsSkeleton.svelte';

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
      analyticsData[1].data = count;
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

        analyticsData[0].data = count;

        socialsCount = tapCount(Object.keys(socialIcons), logs);

        currentTeamLogsCount = count;
        loading = false;
      }
    } catch (error) {
      console.log(error);
      loading = false;
    }
  };

  // onMount(async () => await renderChart());

  const sortTeamMember = (members) => {
    let emptyLogs = [];
    let nonEmptyLogs = [];

    members.map((member) => {
      if (member.team_logs.length > 0) {
        nonEmptyLogs.push(member);
      } else {
        emptyLogs.push(member);
      }
    });

    nonEmptyLogs.sort((a, b) => {
      return new Date(b.team_logs[0].created_at) -
        new Date(a.team_logs[0].created_at)
        ? 1
        : -1;
    });

    // console.log(nonEmptyLogs);

    return [...nonEmptyLogs, ...emptyLogs];
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
      // .limit(1, { foreignTable: 'team_logs' })
      .ilike('team_profile->>firstname', `%${searchQuery}%`);

    if (error) {
      loading = false;
      console.log(error);
    }
    if (data) {
      // order sort member data

      let res = sortTeamMember(data);

      // console.log(data);

      teamMembers = res;
      maxPage = Math.ceil(count / toItem);
      loading = false;
    }
  };
  $: page, searchQuery, getTeamMemberActivities();
  $: {
    getTeamWeeklyLogsActivity();
    getTeamConnections();
    getTeamConnectionsPreviousList();
    getTeamWeeklyLogsPreviousActivity();

    analyticsData[0].percentage = getPercentage(
      currentTeamLogsCount,
      previousTeamLogsCount
    );

    analyticsData[1].percentage = getPercentage(
      currentConnectionCount,
      previousConnectionCount
    );
  }

  $: {
    let totalSocialsCount = socialsCount
      .map((s) => s.value)
      .reduce((a, b) => a + b, 0);

    socialsCount = socialsCount?.map((s) =>
      Math.ceil((s.value * 100) / totalSocialsCount)
    );
    console.log(socialsCount);
    // console.log(totalSocialsCount);
    // console.log(socialsCount?.map((s) => Math.ceil((s.value / 13) * 100)));
    memberCountPercentage = Math.ceil(
      (teamMembers.length / $teams?.member_count) * 100
    );
  }

  // import Flatpickr from 'svelte-flatpickr';
  // import 'flatpickr/dist/themes/dark.css';

  // let date = new Date();
  // const options = {
  //   mode: 'range',
  //   onChange: function (dates) {
  //     if (dates.length == 2) {
  //       var start = dates[0];
  //       var end = dates[1];

  //       // interact with selected dates here
  //     }
  //   },
  // };
</script>

<div
  class="min-h-screen flex flex-col text-white gap-4 mb-8 pt-16 pl-16 md:pl-24 pr-4"
>
  <div class="flex justify-between gap-4">
    {#if loading}
      <TeamAnalyticsCardSkeleton />
    {:else}
      <!-- <Flatpickr
        {options}
        bind:value={date}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer"
      /> -->
      <div class="flex flex-col w-full gap-4">
        <h1>Data from last 7 days</h1>
        <div class="flex flex-row gap-2 w-full">
          <div class="flex flex-col gap-2 w-1/3 h-32">
            {#each analyticsData as item}
              <TeamAnalyticsCard {item} />
            {/each}
          </div>

          <div
            class="w-1/3 border border-neutral-700 bg-neutral-800 p-2 h-32 rounded-md flex flex-col justify-between"
          >
            <h1 class="text-lg">Members Efficiency</h1>

            <div
              class="bg-neutral-600 w-full h-8 flex items-center p-1 rounded-md"
            >
              <div
                class="bg-green-600 w-[{memberCountPercentage}%] h-6 rounded-md"
              />
            </div>
          </div>
          <div
            class="w-1/3 border border-neutral-700 bg-neutral-800 p-2 h-32 rounded-md flex flex-col justify-between"
          >
            <h1 class="text-lg">Most Interactions</h1>
            <div
              class="bg-neutral-600 w-full h-8 flex items-center p-1 rounded-md"
            >
              <!-- <div class="bg-green-600 w-[{socialsCount[0]}%] h-6 rounded-md" /> -->
              {#each socialsCount as item}
                <div class="bg-green-600 w-[{item}%] h-6 rounded-md" />
              {/each}
            </div>
          </div>
        </div>
        <!-- <AnalyticsDropdownButton on:select={selectDaysHandler} /> -->
      </div>
    {/if}
  </div>

  <div class="flex lg:hidden text-xs md:text-sm w-full justify-center mt-8">
    View more on desktop
  </div>

  <div class="hidden md:flex flex-col gap-2">
    <div class="flex justify-between mb-2">
      <h1 class="text-2xl font-bold">Team Activity</h1>
      <div class="flex gap-2 w-1/2 justify-end items-end">
        <div class="bg-neutral-800 p-2 w-1/3 h-11 mb-1 text-center rounded-md">
          Most Recent
        </div>
        <Input
          bind:value={searchQuery}
          type="text"
          title=""
          placeholder="Search"
          class="w-1/2"
          inputbg="bg-neutral-800"
          inputText="text-white"
        />
      </div>
    </div>
    {#if loading}
      <TeamAnalyticsLogsSkeleton />
    {:else}
      {#if teamMembers}
        {#if teamMembers.length > 0}
          {#each teamMembers as member}
            <TeamActivityCard {member} />
          {/each}
        {:else}
          <div class="flex justify-center items-center h-32">
            <h1 class="text-center">No data found</h1>
          </div>
        {/if}
        {#if teamMembers.length > toItem}
          <PaginationButton {setPage} {page} {maxPage} />
        {/if}
      {/if}

      <!-- <div class="flex flex-col w-2/3 gap-4">
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">Team Activity</h1>
        </div>

        <TeamAnalytics
          currentPageRows={teamLogs}
          {page}
          {setPage}
          {loading}
          {maxPage}
        />
      </div>
      {#if data.datasets[0].data.every((item) => item === 0)}
        <div
          in:fade|local
          class="w-1/3 h-[500px] flex justify-center items-center bg-neutral-800 p-4"
        >
          <h1 class="text-2xl font-bold text-center">No data to display</h1>
        </div>
      {/if} -->
    {/if}
    <!-- <div
      class={`${
        data.datasets[0].data.every((item) => item === 0) ? 'hidden' : 'flex'
      } flex-col justify-around w-1/3 h-[500px] px-8 py-16 lg:py-10 bg-neutral-800 rounded-lg`}
    >
      <canvas bind:this={chart} />
    </div> -->
  </div>
</div>
