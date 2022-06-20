<script>
  import supabase from '@lib/db.js';
  import AnalyticTable from '@comp/analyticTable.svelte';
  import { user, userData } from '@lib/stores/userStore.js';
  import AnalyticsSkeleton from '@comp/skeleton/analyticsSkeleton.svelte';
  import { getMemberId } from '@lib/query/getId';
  import { last30Days, last7Days, last90Days } from '@lib/utils/getDates';
  import Cookies from 'js-cookie';
  import { count } from '@lib/utils/count';
  import CsvDropdownButton from '@comp/buttons/csvDropdownButton.svelte';
  import { onMount } from 'svelte';
  // import Chart from '@comp/chart.svelte';
  import Chart from 'chart.js/auto/auto.js';
  import getSocialMediaCsv from '@lib/utils/getSocialMediaCsv';
  import { analyticsChartConfig } from '@lib/constants';

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
  let isAlreadySeeMore = false;
  let selectedDays = null;
  const selectedDaysHandler = (e) => {
    console.log(e);
    selectedDays = e.target.value;
  };
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

  $: console.log(last30Days[0]);

  let connectionsCsv = {};
  let logsCsv = {};

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
      .select(
        'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)',
        { count: 'estimated' }
      )
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

      connectionsCsv = connection_profile.map((item) => {
        console.log(item.socials);

        return {
          Date: item.dateConnected,
          Firstname: item.firstname,
          Lastname: item.lastname,
          Company: item.company,
          Job: item.job,
          Twitter: getSocialMediaCsv(item.socials, 'twitter'),
          Linkedin: getSocialMediaCsv(item.socials, 'linkedin'),
          Whatsapp: getSocialMediaCsv(item.socials, 'whatsapp'),
          Email: getSocialMediaCsv(item.socials, 'email'),
          Phone: getSocialMediaCsv(item.socials, 'phone'),
          Line: getSocialMediaCsv(item.socials, 'line'),
          Tiktok: getSocialMediaCsv(item.socials, 'tiktok'),
          Instagram: getSocialMediaCsv(item.socials, 'instagram'),
          Facebook: getSocialMediaCsv(item.socials, 'facebook'),
          Youtube: getSocialMediaCsv(item.socials, 'youtube'),
          Links: item.links.map((link) => {
            return link.link;
          }),
          Message: item.message,
          Attached_link: item.link,
          By: item.by.firstname + ' ' + item.by.lastname,
        };
      });
      console.log(connectionsCsv);
    }
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
        .select(
          'created_at, data->card, data->message, type, team, team_member(*)',
          {
            count: 'estimated',
          }
        )
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
        // console.log(logs);
        logsCsv = logs.map((log) => {
          // console.log(log);
          return {
            Date: log.created_at,
            Card: log.card,
            Message: log.message,
            Type: log.type,
            Team: log.team,
            TeamMember:
              log.team_member.team_profile.firstname +
              ' ' +
              log.team_member.team_profile.lastname,
          };
        });
        userLogs = logs;
        // console.log(logsCsv);
        // paginate(userLogs);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const activityHandler = async () => {
    await getWeeklyLogsActivity();

    logsChartData.labels = last7Days;
    logsChartData.datasets[0].data = count(last7Days, activity);
  };

  const connection = async () => {
    await getConnectionsList();

    connectionsChartData.labels = last7Days;
    connectionsChartData.datasets[0].data = count(last7Days, dateConnected);
  };

  $: paginate(userLogs.slice(0, maxLimit));

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
    <!-- <CsvDropdownButton data={connectionsCsv} class="top-[385px]" /> -->
    <div class="flex flex-col lg:flex-row justify-between gap-2">
      <!-- <Chart element={connectionsChart} data={connectionsChartData} />
      <Chart element={logsChart} data={logsChartData} /> -->
      <div class="flex flex-col w-full pt-4 lg:pt-0">
        <CsvDropdownButton data={connectionsCsv} class="top-[385px]" />
        <div class="flex w-full justify-between">
          <h1 class="text-2xl font-semibold">Weekly New Connections</h1>
        </div>
        <div
          class="h-80 border-neutral-700 bg-neutral-800 p-4 border rounded-xl mt-4 outer"
        >
          <canvas bind:this={connectionsChart} />
        </div>
      </div>
      <div class="flex flex-col w-full pt-4 lg:pt-0">
        <CsvDropdownButton data={logsCsv} class="top-[385px]" />
        <div class="flex w-full justify-between">
          <h1 class="text-2xl font-semibold">Weekly Activities</h1>
        </div>
        <div
          class="h-80 border-neutral-700 bg-neutral-800 p-4 border rounded-xl mt-4 outer"
        >
          <canvas bind:this={logsChart} />
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
          {connectionCount}
        </p>
      </div>
      <div
        class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-8"
      >
        <p class="">Your activity this week</p>
        <p class="font-bold text-4xl">
          {activityCount}
        </p>
      </div>
      <div
        class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-8"
      >
        <p class="">Unique People this week</p>
        <p class="font-bold text-4xl">
          {uniqueCount}
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
