<script>
  import { memberRights } from '@lib/stores/memberRightsStore';
  import supabase from '@lib/db.js';
  import Chart from 'svelte-frappe-charts';
  import AnalyticTable from '@comp/analyticTable.svelte';
  import { user } from '@lib/stores/userStore.js';
  import { selected } from '@lib/stores/dropdownStore.js';
  import AnalyticsSkeleton from '@comp/skeleton/analyticsSkeleton.svelte';
  import { getTeamId } from '@lib/query/getId';

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

  const chartEls = [
    { label: 'Weekly New Connections', count: 0 },
    { label: 'Weekly Activities', count: 0 },
  ];

  let connections = [];
  let page = 0;
  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let totalPages = [];
  let currentPageRows = [];
  let activity = [];
  let logs = [];
  let itemsPerPage = 20;
  let active = 0;

  let teamConnections = [];
  let teamLogs = [];
  let teamActivity = [];

  let loading = false;
  let isHasPermission = false;

  $: currentPageRows = totalPages.length > 0 ? totalPages[page] : [];

  const paginate = (items = []) => {
    const pages = Math.ceil(items.length / itemsPerPage);

    const paginatedItems = Array.from({ length: pages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });

    totalPages = [...paginatedItems];
  };

  const setPage = (p) => {
    if (p >= 0 && p < totalPages.length) {
      page = p;
      active = p;
    }
  };

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const getDates = (startDate, stopDate) => {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate).toDateString().slice(4));
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };

  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );
  const last30Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 30)),
    today
  );
  const last90Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 90)),
    today
  );

  const count = (days, data) => {
    let result = [];
    for (let i = 0; i < days.length; i++) {
      let count = 0;
      for (let j = 0; j < data.length; j++) {
        if (days[i] === data[j]) {
          count++;
        }
      }

      result.push(count);
    }
    return result;
  };

  const getConnectionsList = async () => {
    let teamId = await getTeamId($user.id);
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from(isHasPermission ? 'team_connection_acc' : 'connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq(
        isHasPermission ? 'team_id' : 'uid',
        isHasPermission ? teamId : $user.id
      )
      .gte('dateConnected', new Date(last7Days[0]).toUTCString())
      .order('dateConnected', { ascending: false });

    if (connection_profile) connectionCount = count;
    if (error_profile) console.log(error_profile);

    const dateConnected =
      connection_profile ??
      [].map((item) => new Date(item.dateConnected).toDateString().slice(4));
    console.log('date', dateConnected);
    console.log('profile', connection_profile);
    return { connection_profile, dateConnected };
  };

  const getWeeklyLogsActivity = async () => {
    let teamId = await getTeamId($user.id);
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from(isHasPermission ? 'team_logs' : 'logs')
        .select('*', { count: 'estimated' })
        .eq(
          isHasPermission ? 'team' : 'uid',
          isHasPermission ? teamId : $user.id
        )
        .gte('timestamp', new Date(last7Days[0]).toISOString())
        .order('timestamp', { ascending: false })
        .limit(5);

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });
        uniqueCount = newArr.length;
        activityCount = count;
        activity = logs.map((log) =>
          new Date(log.timestamp).toDateString().slice(4)
        );

        setTimeout(() => {
          loading = false;
        }, 1000);
        console.log('logs', logs);
        return logs;
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const activityHandler = async () => {
    logs = await getWeeklyLogsActivity();

    activityData.labels =
      $selected === '7 Days'
        ? last7Days
        : $selected === '30 Days'
        ? last30Days
        : last90Days;
    activityData.datasets[0].values = count(
      $selected === '7 Days'
        ? last7Days
        : $selected === '30 Days'
        ? last30Days
        : last90Days,
      activity
    );
    paginate(logs);
  };

  const connection = async () => {
    const { connection_profile, dateConnected } = await getConnectionsList();

    connections = connection_profile;

    connectionData.labels =
      $selected === '7 Days'
        ? last7Days
        : $selected === '30 Days'
        ? last30Days
        : last90Days;
    connectionData.datasets[0].values = count(
      $selected === '7 Days'
        ? last7Days
        : $selected === '30 Days'
        ? last30Days
        : last90Days,
      dateConnected
    );
  };

  $: $memberRights?.filter((item) => {
    if (item === 'allow_read_analytics') isHasPermission = true;
  });

  $: {
    $selected, connection();
    // if(isHasPermission) {
    //   $selected, teamConnection();
    //   console.log('teamConnection');
    // } else {
    //   $selected, connection();
    //   console.log('connection');
    // }
  }
  $: {
    $selected, activityHandler();
    // if (isHasPermission) {
    //   $selected, teamActivityHandler();
    //   console.log('teamActivityHandler');
    // } else {
    //   $selected, activityHandler();
    //   console.log('activityHandler');
    // }
  }
</script>

<div class="h-auto flex justify-center mt-8">
  <div class="w-full">
    {#await (connection(), activityHandler())}
      <AnalyticsSkeleton />
    {:then}
      <div class="flex flex-col lg:flex-row justify-between">
        {#each chartEls as item}
          <div class="flex flex-col w-full lg:w-[49.5%] pt-4 lg:pt-0">
            <div class="flex w-full justify-between">
              <h1 class="text-2xl font-semibold">{item.label}</h1>
              <!-- <DropdownButton /> -->
            </div>
            <div
              class="h-80 border-neutral-500 bg-neutral-800 border rounded-xl mt-4"
            >
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
            </div>
          </div>
        {/each}
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[150px] my-4 space-x-0 md:space-x-2"
      >
        <div
          class="rounded-lg bg-neutral-800 border border-neutral-500 h-full p-8"
        >
          <p class="">New connections this week</p>
          <p class="font-bold text-4xl">{connectionCount}</p>
        </div>
        <div
          class="rounded-lg bg-neutral-800 border border-neutral-500 h-full p-8"
        >
          <p class="">Your activity this week</p>
          <p class="font-bold text-4xl">{activityCount}</p>
        </div>
        <div
          class="rounded-lg bg-neutral-800 border border-neutral-500 h-full p-8"
        >
          <p class="">Unique People this week</p>
          <p class="font-bold text-4xl">{uniqueCount}</p>
        </div>
      </div>
      <div class="hidden lg:flex lg:flex-col">
        <AnalyticTable
          {currentPageRows}
          {setPage}
          {page}
          {totalPages}
          {active}
          {loading}
        />
      </div>
      <div class="flex lg:hidden w-full justify-center mt-8">
        View more on desktop
      </div>
    {:catch}
      <h1>Some error occurred. Please reload the page and try again.</h1>
    {/await}
  </div>
</div>
