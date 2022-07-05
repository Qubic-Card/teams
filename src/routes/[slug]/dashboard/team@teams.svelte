<script>
  import { fade } from 'svelte/transition';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import {
    last30Days,
    last7Days,
    last3Days,
    last14Days,
    sevenDays,
    threeDays,
    fourteenDays,
    thirtyDays,
  } from '@lib/utils/getDates';
  import supabase from '@lib/db';
  import AnalyticsDropdownButton from '@comp/buttons/analyticsDropdownButton.svelte';
  import { tapCount } from '@lib/utils/count';
  import { doughnutChartBgColor, socialIcons } from '@lib/constants';
  import TeamAnalytics from '@pages/teamAnalytics.svelte';
  import TeamAnalyticsCardSkeleton from '@comp/skeleton/teamAnalyticsCardSkeleton.svelte';
  import Cache from 'timed-cache';
  // const cache = new Cache({ defaultTtl: 3600 * 1000 });
  let teamLogs = [];
  let loading = false;

  const analyticsData = [
    { percentage: 0, data: 0, type: 'Active' },
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

  let chart;
  let chartctx;

  const data = {
    labels: Object.keys(socialIcons).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: doughnutChartBgColor,
        borderWidth: 0,
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      aspectRatio: 1,
      maintainAspectRatio: false,
      cutout: '40%',
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
          labels: {
            usePointStyle: true,
            padding: 10,
            font: {
              size: 14,
            },
          },
        },
      },
    },
  };

  let previousConnectionCount = 0;
  let currentConnectionCount = 0;
  let previousTeamLogsCount = 0;
  let currentTeamLogsCount = 0;
  let teamId = Cookies.get('qubicTeamId');
  let selectedDays = '3 Days';
  let itemsPerPage = 20;
  let totalPages = [];
  let page = 0;
  let active = 0;
  let paginatedLogs = [];
  let currentPageRows = [];

  const selectDaysHandler = (e) => {
    selectedDays = e.detail;
    page = 0;
    active = 0;
  };

  const getPercentage = (current, previous) =>
    Math.floor(((current - previous) / previous) * 100);

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

  const renderChart = async () => {
    const ctx = chart.getContext('2d');
    if (chart !== null) chartctx = new Chart(ctx, config);
  };

  const getTeamConnectionsPreviousList = async () => {
    loading = true;
    let { error: team_error, count } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte(
        'dateConnected',
        new Date(
          selectedDays === '7 Days'
            ? sevenDays[0]
            : selectedDays === '14 Days'
            ? fourteenDays[0]
            : selectedDays === '30 Days'
            ? thirtyDays[0]
            : threeDays[0]
        ).toUTCString()
      )
      .order('dateConnected', { ascending: false });

    if (count) previousConnectionCount = count;

    if (team_error) console.log(team_error);
    loading = false;
  };

  const getTeamWeeklyLogsPreviousActivity = async () => {
    loading = true;
    try {
      let { error, count } = await supabase
        .from('team_logs')
        .select('created_at', { count: 'estimated' })
        .eq('team', teamId)
        .gte(
          'created_at',
          new Date(
            selectedDays === '7 Days'
              ? sevenDays[0]
              : selectedDays === '14 Days'
              ? fourteenDays[0]
              : selectedDays === '30 Days'
              ? thirtyDays[0]
              : threeDays[0]
          ).toUTCString()
        )
        .order('created_at', { ascending: false });
      if (count) previousTeamLogsCount = count;
      loading = false;
    } catch (error) {
      console.log(error);
      loading = false;
    }
  };

  const getTeamConnectionsList = async () => {
    loading = true;
    let { error: team_error, count } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte(
        'dateConnected',
        new Date(
          selectedDays === '7 Days'
            ? last7Days[0]
            : selectedDays === '14 Days'
            ? last14Days[0]
            : selectedDays === '30 Days'
            ? last30Days[0]
            : last3Days[0]
        ).toUTCString()
      )
      // .rangeLt('dateConnected', [a, b])
      .order('dateConnected', { ascending: false });

    if (count) {
      analyticsData[1].data = count;
      currentConnectionCount = count;
    }
    if (team_error) console.log(team_error);

    loading = false;
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
        .select(
          'created_at, data->card, data->message, data->link, type, team, team_member(team_profile->firstname, team_profile->lastname)',
          { count: 'estimated' }
        )
        .eq('team', teamId)
        .gte(
          'created_at',
          new Date(
            selectedDays === '7 Days'
              ? last7Days[0]
              : selectedDays === '14 Days'
              ? last14Days[0]
              : selectedDays === '30 Days'
              ? last30Days[0]
              : last3Days[0]
          ).toISOString()
        )
        .order('created_at', { ascending: false });
      // .limit(maxLimit ?? 100);

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });

        // console.log('logs', logs);
        analyticsData[0].data = count;
        analyticsData[2].data = logs.length;

        teamLogs = logs;
        paginatedLogs = logs;
        // Grouping by date
        teamLogs = teamLogs.reduce((acc, log) => {
          const date = new Date(log.created_at).toDateString().slice(4);
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(log);
          return acc;
        }, {});

        teamLogs = Object.keys(teamLogs).map((date) => {
          return {
            date,
            logs: teamLogs[date],
          };
        });

        data.datasets[0].data = tapCount(Object.keys(socialIcons), teamLogs);
        if (chartctx) chartctx.update();

        currentTeamLogsCount = count;
        loading = false;
      }
    } catch (error) {
      console.log(error);
      loading = false;
    }
  };

  onMount(async () => {
    await renderChart();
  });
  // var in30Minutes = 1 / 48;
  // $: Cookies.set(
  //   `${selectedDays}`,
  //   JSON.stringify({
  //     timestamp: new Date(),
  //     logs: analyticsData[0].percentage,
  //     connection: analyticsData[1].percentage,
  //     currentPageRows: currentPageRows,
  //     paginatedLogs: paginatedLogs,
  //   }),
  //   {
  //     expires: in30Minutes,
  //   }
  // );
  // let cookie;
  // $: {
  //   cookie = Cookies.get(`${selectedDays}`);
  //   cookie = JSON.parse(cookie);
  //   if (cookie) console.log(`${selectedDays}`, cookie.timestamp);
  // }

  $: {
    selectedDays,
      getTeamWeeklyLogsActivity(),
      getTeamConnectionsList(),
      getTeamConnectionsPreviousList(),
      getTeamWeeklyLogsPreviousActivity();

    analyticsData[0].percentage = getPercentage(
      currentTeamLogsCount,
      previousTeamLogsCount
    );
    analyticsData[1].percentage = getPercentage(
      currentConnectionCount,
      previousConnectionCount
    );
    analyticsData[2].percentage = getPercentage(
      currentTeamLogsCount,
      previousTeamLogsCount
    );
  }

  $: {
    paginate(paginatedLogs);
    currentPageRows = totalPages.length > 0 ? totalPages[page] : [];
    currentPageRows = currentPageRows.reduce((acc, log) => {
      const date = new Date(log.created_at).toDateString().slice(4);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {});
    currentPageRows = Object.keys(currentPageRows).map((date) => {
      return {
        date,
        logs: currentPageRows[date],
      };
    });
  }
</script>

<div class="min-h-screen flex flex-col text-white gap-4 mb-8 pt-4 pl-24 pr-4">
  <div class="flex justify-between gap-4">
    {#if loading}
      <TeamAnalyticsCardSkeleton />
    {:else}
      {#each analyticsData as item}
        <div
          class="flex flex-col justify-between w-full h-32 bg-neutral-800 border border-neutral-700 rounded-lg p-6"
        >
          <div class="flex justify-between items-center">
            <h1 class="text-xl">{item.data} <span>{item.type}</span></h1>
            <div
              class="bg-blue-600 hidden justify-center aspect-square items-center p-1 h-full rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm">
            <h2 class="text-neutral-400">{selectedDays}</h2>
            {#if item.percentage >= 0}
              <p class="text-green-600 flex gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                {item.percentage}%
              </p>
            {:else}
              <p class="text-red-600 flex gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {item.percentage}%
              </p>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
  <div
    class="flex justify-between items-center border border-neutral-700 bg-neutral-800 pr-5 rounded-lg h-12"
  >
    <Menu>
      <MenuButton
        class="bg-neutral-100 text-black p-3 text-sm rounded-l-lg hidden"
        >Most active member <span class="pl-12">&#x25BC;</span></MenuButton
      >
      <MenuItems
        class="mt-4 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-3 w-80"
      >
        <MenuItem class="p-2">Choose one</MenuItem>
      </MenuItems>
    </Menu>

    <h1 class="hidden">dsafasd</h1>
  </div>

  <div class="flex gap-4">
    {#if currentPageRows}
      <div class="flex flex-col w-2/3 gap-4">
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">Team Activity</h1>
          <!-- <button class="bg-blue-600 p-2 rounded-lg w-48">Download CSV</button> -->
          <AnalyticsDropdownButton on:select={selectDaysHandler} />
        </div>

        <TeamAnalytics
          {currentPageRows}
          {totalPages}
          {page}
          {active}
          {setPage}
          {loading}
        />
      </div>
      {#if data.datasets[0].data.every((item) => item === 0)}
        <div
          in:fade|local
          class="w-1/3 h-[500px] flex justify-center items-center bg-neutral-800 p-4"
        >
          <h1 class="text-2xl font-bold text-center">No data to display</h1>
        </div>
      {/if}
    {/if}
    <div
      class={`${
        data.datasets[0].data.every((item) => item === 0) ? 'hidden' : 'flex'
      } flex-col justify-around w-1/3 h-[500px] px-8 py-16 lg:py-10 bg-neutral-800 rounded-lg`}
    >
      <canvas bind:this={chart} />
      <!-- <AnalyticsDropdownButton data={teamLogsCsv} class="top-[385px]" /> -->

      <!-- <button class="bg-blue-600 p-2 rounded-lg min-w-1/3 self-end mt-2 text-md"
            >Download CSV</button
          > -->
    </div>
  </div>
</div>
