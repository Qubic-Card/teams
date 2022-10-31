<script>
  import supabase from '@lib/db.js';
  import AnalyticTable from '@comp/tables/analyticTable.svelte';
  import { memberData, userChangeTimestamp } from '@lib/stores/userStore.js';
  import {
    last3Days,
    last7Days,
    last14Days,
    last30Days,
  } from '@lib/utils/getDates';
  import { count } from '@lib/utils/count';
  import AnalyticsDropdownButton from '@comp/buttons/analyticsDropdownButton.svelte';
  import { onMount } from 'svelte';
  import ChartEl from '@comp/chart.svelte';
  import Chart from 'chart.js/auto/auto.js';
  import { analyticsChartConfig } from '@lib/constants';
  import PersonalAnalyticsCard from '@comp/cards/personalAnalyticsCard.svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';

  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let activity = [];
  let dateConnected = [];
  let userLogs = [];
  let loading = false;
  let isAlreadySeeMore = false;
  let connectionChartCtx;
  let logChartCtx;
  let logsChart;
  let connectionsChart;
  let selectedDays = '';
  let maxPage = 0;
  let page = 0;
  let toItem = 5;

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

  const setPage = (p) => (page = p);

  const selectDaysHandler = (e) => (selectedDays = e.detail);

  const getConnectionsList = async () => {
    loading = true;

    let minTime = new Date(
      selectedDays === '7 Days'
        ? last7Days[0]
        : selectedDays === '14 Days'
        ? last14Days[0]
        : selectedDays === '30 Days'
        ? last30Days[0]
        : last3Days[0]
    ).toUTCString();

    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq('by', $memberData?.id)
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

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getWeeklyLogsChartActivity = async () => {
    loading = true;

    let minTime = new Date(
      selectedDays === '7 Days'
        ? last7Days[0]
        : selectedDays === '14 Days'
        ? last14Days[0]
        : selectedDays === '30 Days'
        ? last30Days[0]
        : last3Days[0]
    ).toISOString();

    minTime = new Date(new Date(minTime).setHours(0, 0, 0, 0)).toISOString();

    let {
      data: logs,
      error,
      count,
    } = await supabase
      .from('team_logs')
      .select('created_at, uniqueId', {
        count: 'estimated',
      })
      .eq('team_member', $memberData?.id)
      .gte(
        'created_at',
        $userChangeTimestamp > minTime ? $userChangeTimestamp : minTime
      )
      .order('created_at', {
        ascending: false,
      });

    if (logs) {
      activity = logs.map((log) =>
        convertToGMT7(log.created_at).toDateString().slice(4)
      );

      let newArr = [];
      logs.map((log) => {
        if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
      });
      uniqueCount = newArr.length;
      activityCount = count;

      loading = false;
    }
    if (error) {
      console.log(error);
      loading = false;
    }
  };

  const getWeeklyLogsActivity = async () => {
    const { from, to } = getPagination(page, toItem);
    loading = true;

    let minTime = new Date(
      selectedDays === '7 Days'
        ? last7Days[0]
        : selectedDays === '14 Days'
        ? last14Days[0]
        : selectedDays === '30 Days'
        ? last30Days[0]
        : last3Days[0]
    ).toISOString();

    minTime = new Date(new Date(minTime).setHours(0, 0, 0, 0)).toISOString();

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
      .eq('team_member', $memberData?.id)
      .gte(
        'created_at',
        $userChangeTimestamp > minTime ? $userChangeTimestamp : minTime
      )
      .order('created_at', {
        ascending: false,
      })
      .range(from, to);

    if (logs) {
      userLogs = logs;
      maxPage = Math.ceil(count / 10);
      loading = false;
    }
    if (error) {
      console.log(error);
      loading = false;
    }
  };

  const activityHandler = async () => {
    await getWeeklyLogsActivity();
    await getWeeklyLogsChartActivity();

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
    isAlreadySeeMore = false;
    page = 0;
    toItem = 5;
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

    isAlreadySeeMore = false;
  };

  $: selectedDays, connection(), activityHandler();
  $: page, toItem, getWeeklyLogsActivity();

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
      class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[100px] my-2 gap-2 md:gap-0 space-x-0 md:space-x-2"
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
        on:click={() => {
          page = 0;
          toItem = 10;
          isAlreadySeeMore = true;
        }}
        {page}
        {maxPage}
        {loading}
        {isAlreadySeeMore}
        {setPage}
        currentPageRows={userLogs}
      />
    </div>
    <div class="flex text-xs md:text-sm lg:hidden w-full justify-center mt-8">
      View more on desktop
    </div>
  </div>
</div>
