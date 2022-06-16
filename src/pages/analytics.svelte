<script>
  import supabase from '@lib/db.js';
  // import Chart from 'svelte-frappe-charts';
  import AnalyticTable from '@comp/analyticTable.svelte';
  import { user, userData } from '@lib/stores/userStore.js';
  import AnalyticsSkeleton from '@comp/skeleton/analyticsSkeleton.svelte';
  import { getMemberId } from '@lib/query/getId';
  import getDates from '@lib/utils/getDates';
  import Cookies from 'js-cookie';
  import count from '@lib/utils/count';

  import { onMount } from 'svelte';
  // import Chart from '@comp/chart.svelte';
  import Chart from 'chart.js/auto/auto.js';

  let teamId = Cookies.get('qubicTeamId');

  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let activity = [];
  let dateConnected = [];
  let userLogs = [];

  let teamUniqueCount = 0;
  let teamActivityCount = 0;
  let teamConnectionCount = 0;
  let teamActivity = [];
  let teamDateConnected = [];
  let teamLogs = [];

  let loading = false;
  let isHasPermission = false;

  let itemsPerPage = 10;
  let totalPages = [];
  let maxLimit = 5;
  let isAlreadySeeMore = false;

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
    options: {
      responsive: true,
      cutout: '95%',
      spacing: 2,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const logsConfig = {
    type: 'line',
    data: logsChartData,
    options: {
      responsive: true,
      cutout: '95%',
      spacing: 2,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  let logsChart;
  let connectionsChart;

  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );

  const setLimit = (value) => {
    maxLimit = value;
    isAlreadySeeMore = true;
  };

  const paginate = (items) => {
    const pages = Math.ceil(items.length / itemsPerPage);
    const paginatedItems = Array.from({ length: pages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });
    totalPages = [...paginatedItems];
  };

  const getConnectionsList = async () => {
    let id = await getMemberId($user?.id, teamId);
    loading = true;
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq('by', id)
      .gte('dateConnected', new Date(last7Days[0]).toUTCString())
      .order('dateConnected', { ascending: false });

    loading = false;
    if (error_profile) console.log(error_profile);
    if (connection_profile) {
      connectionCount = count;
      dateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
    }
  };

  const getTeamConnectionsList = async () => {
    loading = true;
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte('dateConnected', new Date(last7Days[0]).toUTCString())
      .order('dateConnected', { ascending: false });

    loading = false;
    if (connection_profile) {
      teamConnectionCount = count;
      teamDateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
    }
    if (error_profile) console.log(error_profile);
  };

  const getWeeklyLogsActivity = async () => {
    let id = await getMemberId($user?.id, teamId);
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('team_logs')
        .select('*', { count: 'estimated' })
        .eq('team_member', id)
        .gte('created_at', new Date(last7Days[0]).toISOString())
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

        setTimeout(() => {
          loading = false;
        }, 1000);

        userLogs = logs;
        // paginate(userLogs);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const getTeamWeeklyLogsActivity = async () => {
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('team_logs')
        .select('*', { count: 'estimated' })
        .eq('team', teamId)
        .gte('created_at', new Date(last7Days[0]).toISOString())
        .order('created_at', { ascending: false });
      // .limit(maxLimit ?? 100);

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });
        teamUniqueCount = newArr.length;
        teamActivityCount = count;
        teamActivity = logs.map((log) =>
          new Date(log.created_at).toDateString().slice(4)
        );

        setTimeout(() => {
          loading = false;
        }, 1000);
        // console.log('logs', logs);
        teamLogs = logs;

        // paginate(teamLogs);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const activityHandler = async () => {
    await getWeeklyLogsActivity();
    await getTeamWeeklyLogsActivity();

    logsChartData.labels = last7Days;
    logsChartData.datasets[0].data = count(
      last7Days,
      isHasPermission ? teamActivity : activity
    );
  };

  const connection = async () => {
    await getConnectionsList();
    await getTeamConnectionsList();

    connectionsChartData.labels = last7Days;
    connectionsChartData.datasets[0].data = count(
      last7Days,
      isHasPermission ? teamDateConnected : dateConnected
    );
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_read_analytics') isHasPermission = true;
  });

  $: isHasPermission
    ? paginate(teamLogs.slice(0, maxLimit))
    : paginate(userLogs.slice(0, maxLimit));

  onMount(async () => {
    await connection();
    await activityHandler();

    const connectionsCtx = connectionsChart.getContext('2d');
    new Chart(connectionsCtx, connectionsConfig);

    const logsCtx = logsChart.getContext('2d');
    new Chart(logsCtx, logsConfig);
  });
</script>

<div class="h-auto flex justify-center mt-8">
  <div class="w-full">
    <!-- {#await }
      <AnalyticsSkeleton />
    {:then} -->
    <div class="flex flex-col lg:flex-row justify-between">
      <!-- <Chart element={connectionsChart} data={connectionsChartData} />
      <Chart element={logsChart} data={logsChartData} /> -->
      <div class="flex flex-col w-full lg:w-[49.5%] pt-4 lg:pt-0">
        <div class="flex w-full justify-between">
          <h1 class="text-2xl font-semibold">Weekly New Connections</h1>
        </div>
        <div
          class="h-80 border-neutral-700 bg-neutral-800 px-2 pt-4 border rounded-xl mt-4"
        >
          <canvas height="140" bind:this={connectionsChart} />
        </div>
      </div>
      <div class="flex flex-col w-full lg:w-[49.5%] pt-4 lg:pt-0">
        <div class="flex w-full justify-between">
          <h1 class="text-2xl font-semibold">Weekly Activities</h1>
        </div>
        <div
          class="h-80 border-neutral-700 bg-neutral-800 px-2 pt-4 border rounded-xl mt-4"
        >
          <canvas height="140" bind:this={logsChart} />
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[150px] my-4 space-x-0 md:space-x-2"
    >
      <div
        class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-8"
      >
        <p class="">New connections this week</p>
        <p class="font-bold text-4xl">
          {isHasPermission ? teamConnectionCount : connectionCount}
        </p>
      </div>
      <div
        class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-8"
      >
        <p class="">Your activity this week</p>
        <p class="font-bold text-4xl">
          {isHasPermission ? teamActivityCount : activityCount}
        </p>
      </div>
      <div
        class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-8"
      >
        <p class="">Unique People this week</p>
        <p class="font-bold text-4xl">
          {isHasPermission ? teamUniqueCount : uniqueCount}
        </p>
      </div>
    </div>
    <div class="hidden lg:flex lg:flex-col">
      <AnalyticTable
        {loading}
        {totalPages}
        on:click={() => setLimit(500)}
        {isAlreadySeeMore}
      />
    </div>
    <div class="flex lg:hidden w-full justify-center mt-8">
      View more on desktop
    </div>
    <!-- {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await} -->
  </div>
</div>
<!-- {"card":"b9069595-2a92-487a-8756-2ab437c29758","message":"Your profile was opened through QRScan"} -->
