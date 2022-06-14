<script>
  import supabase from '@lib/db.js';
  import Chart from 'svelte-frappe-charts';
  import AnalyticTable from '@comp/analyticTable.svelte';
  import { user, userData } from '@lib/stores/userStore.js';
  import AnalyticsSkeleton from '@comp/skeleton/analyticsSkeleton.svelte';
  import { getMemberId } from '@lib/query/getId';
  import getDates from '@lib/utils/getDates';
  import Cookies from 'js-cookie';
  import count from '@lib/utils/count';

  let connectionData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  let activityData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  let teamConnectionData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  let teamActivityData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  const chartEls = [
    { label: 'Weekly New Connections', count: 0 },
    { label: 'Weekly Activities', count: 0 },
  ];

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

    if (error_profile) console.log(error_profile);
    if (connection_profile) {
      connectionCount = count;
      dateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
    }
  };

  const getTeamConnectionsList = async () => {
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

    activityData.labels = last7Days;
    activityData.datasets[0].values = count(last7Days, activity);
  };

  const TeamActivityHandler = async () => {
    await getTeamWeeklyLogsActivity();

    teamActivityData.labels = last7Days;
    teamActivityData.datasets[0].values = count(last7Days, teamActivity);
  };

  const connection = async () => {
    await getConnectionsList();

    connectionData.labels = last7Days;
    connectionData.datasets[0].values = count(last7Days, dateConnected);
  };

  const teamConnection = async () => {
    await getTeamConnectionsList();

    teamConnectionData.labels = last7Days;
    teamConnectionData.datasets[0].values = count(last7Days, teamDateConnected);
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_read_analytics') isHasPermission = true;
  });

  $: isHasPermission
    ? paginate(teamLogs.slice(0, maxLimit))
    : paginate(userLogs.slice(0, maxLimit));
</script>

<div class="h-auto flex justify-center mt-8">
  <div class="w-full">
    {#await (connection(), activityHandler(), teamConnection(), TeamActivityHandler())}
      <AnalyticsSkeleton />
    {:then}
      <div class="flex flex-col lg:flex-row justify-between">
        {#each chartEls as item}
          <div class="flex flex-col w-full lg:w-[49.5%] pt-4 lg:pt-0">
            <div class="flex w-full justify-between">
              <h1 class="text-2xl font-semibold">{item.label}</h1>
            </div>
            <div
              class="h-80 border-neutral-700 bg-neutral-800 border rounded-xl mt-4"
            >
              {#if isHasPermission}
                <Chart
                  data={item.label === 'Weekly New Connections'
                    ? teamConnectionData
                    : teamActivityData}
                  type="line"
                  colors={['green']}
                  axisOptions={{
                    xIsSeries: true,
                    xAxisMode: 'tick',
                    yAxisMode: 'tick',
                  }}
                  lineOptions={{
                    hideDots: 1,
                    heatline: 0,
                    areaFill: 1,
                    regionFill: 1,
                  }}
                />
              {:else}
                <Chart
                  data={item.label === 'Weekly New Connections'
                    ? connectionData
                    : activityData}
                  type="line"
                  colors={['green']}
                  axisOptions={{
                    xIsSeries: true,
                    xAxisMode: 'tick',
                    yAxisMode: 'tick',
                  }}
                  lineOptions={{
                    hideDots: 1,
                    heatline: 0,
                    areaFill: 1,
                    regionFill: 1,
                  }}
                />
              {/if}
            </div>
          </div>
        {/each}
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
    {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await}
  </div>
</div>
<!-- {"card":"b9069595-2a92-487a-8756-2ab437c29758","message":"Your profile was opened through QRScan"} -->
<!-- INFO -->
<!-- 76900f13-9d11-424a-b111-71b1f2cd6def -->
