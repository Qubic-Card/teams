<script>
  import supabase from '@lib/db.js';
  import AnalyticTable from '@comp/tables/analyticTable.svelte';
  import { user, userChangeTimestamp } from '@lib/stores/userStore.js';
  import { getMemberId } from '@lib/query/getId';
  import {
    last3Days,
    last7Days,
    last14Days,
    last30Days,
  } from '@lib/utils/getDates';
  import Cookies from 'js-cookie';
  import { count } from '@lib/utils/count';
  import AnalyticsDropdownButton from '@comp/buttons/analyticsDropdownButton.svelte';
  import { onMount } from 'svelte';
  import ChartEl from '@comp/chart.svelte';
  import Chart from 'chart.js/auto/auto.js';
  import { analyticsChartConfig } from '@lib/constants';
  import PersonalAnalyticsCard from '@comp/cards/personalAnalyticsCard.svelte';

  let teamId = Cookies.get('qubicTeamId');

  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let activity = [];
  let dateConnected = [];
  let userLogs = [];
  let loading = false;

  let itemsPerPage = 10;
  let totalPages = [];
  let maxLimit = 5;
  let page = 0;
  let currentPageRows = [];
  let active = 0;
  let isAlreadySeeMore = false;

  let connectionChartCtx;
  let logChartCtx;

  let logsChartData = {
    labels: [],
    datasets: [
      {
        label: 'Weekly Activities',
        data: [],
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
      },
    ],
  };

  let connectionsChartData = {
    labels: [],
    datasets: [
      {
        label: 'Connection Activities',
        data: [],
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
      },
    ],
  };

  const connectionsConfig = {
    type: 'line',
    data: connectionsChartData,
    options: analyticsChartConfig,
  };

  const logsConfig = {
    type: 'line',
    data: logsChartData,
    options: analyticsChartConfig,
  };

  let logsChart;
  let connectionsChart;

  let connectionsCsv = {};
  let logsCsv = {};
  let selectedDays = '';
  let isSelectedDaysHasChanged = false;

  const setLimit = (value) => {
    maxLimit = value;
    isAlreadySeeMore = !isAlreadySeeMore;
  };

  const paginate = (items) => {
    const pages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = Array.from({ length: pages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });
    totalPages = [...paginatedItems];
  };

  const setPage = (p) => {
    if (p >= 0 && p < totalPages?.length) {
      page = p;
      active = p;
    }
  };

  const selectDaysHandler = (e) => {
    selectedDays = e.detail;
    isSelectedDaysHasChanged = true;
  };

  const getConnectionsList = async () => {
    let id = await getMemberId($user?.id, teamId);

    loading = true;
    let minTime = new Date(
      new Date(
        selectedDays === '7 Days'
          ? last7Days[0]
          : selectedDays === '14 Days'
          ? last14Days[0]
          : selectedDays === '30 Days'
          ? last30Days[0]
          : last3Days[0]
      )
    ).toUTCString();

    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select(
        'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)',
        { count: 'estimated' }
      )
      .eq('by', id)
      .gte(
        'dateConnected',
        $userChangeTimestamp > minTime ? $userChangeTimestamp : minTime
      )
      .order('dateConnected', { ascending: false });

    if (error_profile) console.log(error_profile);
    if (connection_profile) {
      connectionCount = count;
      dateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
    }
    loading = false;
  };

  const getWeeklyLogsActivity = async () => {
    let id = await getMemberId($user?.id, teamId);
    loading = true;

    let minTime = new Date(
      new Date(
        selectedDays === '7 Days'
          ? last7Days[0]
          : selectedDays === '14 Days'
          ? last14Days[0]
          : selectedDays === '30 Days'
          ? last30Days[0]
          : last3Days[0]
      )
    ).toUTCString();

    let {
      data: logs,
      error,
      count,
    } = await supabase
      .from('team_logs')
      .select(
        'created_at, data->card, data->message, type, team, team_member(*), platform',
        {
          count: 'estimated',
        }
      )
      .eq('team_member', id)
      .gte(
        'created_at',
        $userChangeTimestamp > minTime ? $userChangeTimestamp : minTime
      )
      .order('created_at', {
        ascending: false,
      });
    // .limit(maxLimit ?? 5);

    if (logs) {
      let newArr = [];
      logs.map((log) => {
        if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
      });
      uniqueCount = newArr.length;
      activityCount = count;
      activity = logs.map((log) =>
        new Date(log.created_at).toDateString().slice(4)
      );

      userLogs = logs;
      loading = false;
    }
    if (error) {
      console.log(error);
      loading = false;
    }
  };

  const activityHandler = async () => {
    await getWeeklyLogsActivity();

    logsChartData.labels =
      selectedDays === '7 Days'
        ? last7Days
        : selectedDays === '14 Days'
        ? last14Days
        : selectedDays === '30 Days'
        ? last30Days
        : last3Days;
    logsChartData.datasets[0].data = count(
      selectedDays === '7 Days'
        ? last7Days
        : selectedDays === '14 Days'
        ? last14Days
        : selectedDays === '30 Days'
        ? last30Days
        : last3Days,
      activity
    );

    if (logChartCtx) logChartCtx.update();
    isSelectedDaysHasChanged = false;
    isAlreadySeeMore = false;
  };

  const connection = async () => {
    await getConnectionsList();

    connectionsChartData.labels =
      selectedDays === '7 Days'
        ? last7Days
        : selectedDays === '14 Days'
        ? last14Days
        : selectedDays === '30 Days'
        ? last30Days
        : last3Days;
    connectionsChartData.datasets[0].data = count(
      selectedDays === '7 Days'
        ? last7Days
        : selectedDays === '14 Days'
        ? last14Days
        : selectedDays === '30 Days'
        ? last30Days
        : last3Days,
      dateConnected
    );

    if (connectionChartCtx) connectionChartCtx.update();
    isSelectedDaysHasChanged = false;
    isAlreadySeeMore = false;
  };

  $: selectedDays, paginate(userLogs.slice(0, maxLimit));
  $: selectedDays, connection(), activityHandler();
  $: if (isSelectedDaysHasChanged && maxLimit > 5) setLimit(5);
  $: currentPageRows = totalPages?.length > 0 ? totalPages[page] : [];
  $: if (selectedDays !== '') {
    page = 0;
    active = 0;
  }

  onMount(async () => {
    const connectionsCtx = connectionsChart.getContext('2d');
    connectionChartCtx = new Chart(connectionsCtx, connectionsConfig);

    const logsCtx = logsChart.getContext('2d');
    logChartCtx = new Chart(logsCtx, logsConfig);
  });
</script>

<div class="h-auto flex justify-center mt-2">
  <div class="w-full">
    <AnalyticsDropdownButton on:select={selectDaysHandler} />
    <div class="flex flex-col lg:flex-row justify-between gap-2">
      <ChartEl label="New Connections">
        <canvas bind:this={connectionsChart} />
      </ChartEl>
      <ChartEl label="New Activities">
        <canvas bind:this={logsChart} />
      </ChartEl>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[100px] my-2 space-x-0 md:space-x-2"
    >
      <PersonalAnalyticsCard
        {loading}
        label="New connections"
        count={connectionCount}
      />
      <PersonalAnalyticsCard
        {loading}
        label="Your activity"
        count={activityCount}
      />
      <PersonalAnalyticsCard
        {loading}
        label="Unique People"
        count={uniqueCount}
      />
    </div>
    <div class="hidden lg:flex lg:flex-col">
      <AnalyticTable
        {loading}
        {totalPages}
        on:click={() => setLimit(5000)}
        on:hide={() => setLimit(5)}
        {isAlreadySeeMore}
        {setPage}
        {page}
        {currentPageRows}
        {active}
      />
    </div>
    <div class="flex lg:hidden w-full justify-center mt-8">
      View more on desktop
    </div>
  </div>
</div>
