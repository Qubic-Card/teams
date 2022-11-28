<script>
  import { count } from '@lib/utils/count';
  import supabase from '@lib/db.js';
  import AnalyticTable from '@comp/basic/analyticTable.svelte';
  import { user } from '@lib/stores/userStore.js';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import { last7Days } from '@lib/utils/getDates';
  import { onMount } from 'svelte';
  import { analyticsChartConfig } from '@lib/constants';
  import ChartEl from '@comp/chart.svelte';
  import Chart from 'chart.js/auto/auto.js';

  let page = 0;
  let toItem = 20;
  let maxPage = 0;
  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let connectionChartCtx;
  let logChartCtx;
  let logsChart;
  let connectionsChart;
  let dateConnected = [];
  let logsArr = [];
  let activity = [];

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

  let loading = false;

  const setPage = (p) => (page = p);

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getConnectionsList = async () => {
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq('uid', $user.id)
      .gte('dateConnected', new Date(last7Days[0]).toISOString())
      .order('dateConnected', { ascending: false });

    if (connection_profile) connectionCount = count;
    if (error_profile) console.log(error_profile);

    dateConnected = connection_profile.map((item) =>
      new Date(item.dateConnected).toDateString().slice(4)
    );
  };

  const getWeeklyLogsChartActivity = async () => {
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('logs')
        .select('*', { count: 'estimated' })
        .eq('uid', $user.id)
        .gte('timestamp', new Date(last7Days[0]).toISOString())
        .order('timestamp', { ascending: false });

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });
        uniqueCount = newArr.length;
        activityCount = count;
        activity = logs.map((log) =>
          convertToGMT7(log.timestamp).toDateString().slice(4)
        );

        setTimeout(() => {
          loading = false;
        }, 200);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const getWeeklyLogsActivity = async () => {
    const { from, to } = getPagination(page, toItem);
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('logs')
        .select('*', { count: 'estimated' })
        .eq('uid', $user.id)
        .gte('timestamp', new Date(last7Days[0]).toISOString())
        .order('timestamp', { ascending: false })
        .range(from, to);

      if (logs) {
        maxPage = Math.ceil(count / toItem);

        setTimeout(() => {
          loading = false;
        }, 200);

        logsArr = logs;
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const logsHandler = async () => {
    await getWeeklyLogsChartActivity();
    logsChartData.labels = last7Days;
    logsChartData.datasets[0].data = count(last7Days, activity);

    if (logChartCtx) logChartCtx.update();
  };

  const connectionsHandler = async () => {
    await getConnectionsList();

    connectionsChartData.labels = last7Days;
    connectionsChartData.datasets[0].data = count(last7Days, dateConnected);

    if (connectionChartCtx) connectionChartCtx.update();
  };

  $: page, toItem, getWeeklyLogsActivity();

  onMount(async () => {
    await connectionsHandler();
    await logsHandler();

    const connectionsCtx = connectionsChart.getContext('2d');
    connectionChartCtx = new Chart(connectionsCtx, connectionsConfig);

    const logsCtx = logsChart.getContext('2d');
    logChartCtx = new Chart(logsCtx, logsConfig);
  });
</script>

<!-- <div class="flex flex-col lg:flex-row justify-between gap-2" /> -->
<div class="min-h-screen bg-gray-100 flex justify-center pb-20 text-black">
  <div class="lg:mx-20 mx-8 my-8 w-full">
    <div class="flex flex-col lg:flex-row justify-between gap-2">
      <ChartEl label="New Connections" editor="basic">
        <canvas bind:this={connectionsChart} />
      </ChartEl>
      <ChartEl label="New Activities" editor="basic">
        <canvas bind:this={logsChart} />
      </ChartEl>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[150px] my-4 space-x-0 md:space-x-2"
    >
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">New connections this week</p>
        <p class="font-semibold text-xl md:text-4xl">{connectionCount}</p>
      </div>
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">Your activity this week</p>
        <p class="font-semibold text-xl md:text-4xl">{activityCount}</p>
      </div>
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">Unique People this week</p>
        <p class="font-semibold text-xl md:text-4xl">{uniqueCount}</p>
      </div>
    </div>
    <div class="hidden lg:flex lg:flex-col">
      <AnalyticTable logs={logsArr} {setPage} {page} {maxPage} {loading} />
    </div>
    <div class="flex lg:hidden w-full justify-center mt-8 md:text-md text-sm">
      View more on desktop
    </div>
  </div>
</div>
