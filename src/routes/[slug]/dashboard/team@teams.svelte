<script>
  import { fade } from 'svelte/transition';
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
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
  import TeamAnalyticsCard from '@comp/cards/teamAnalyticsCard.svelte';
  import AnalyticsDropdownButton from '@comp/buttons/analyticsDropdownButton.svelte';
  import { tapCount } from '@lib/utils/count';
  import { doughnutChartBgColor, socialIcons } from '@lib/constants';
  import TeamAnalytics from '@pages/teamAnalytics.svelte';
  import TeamAnalyticsCardSkeleton from '@comp/skeleton/teamAnalyticsCardSkeleton.svelte';
  import Cache from 'timed-cache';
  // const cache = new Cache({ defaultTtl: 3600 * 1000 });
  let teamLogs = [];
  let loading = true;

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
      hoverBackgroundColor: '#171717',
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

  const getPercentage = (current, previous) => {
    const calc = current - previous;
    if (calc !== 0) {
      return Math.floor((calc / previous) * 100);
    } else {
      return 0;
    }
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

  const renderChart = async () => {
    const ctx = chart.getContext('2d');
    if (chart !== null) chartctx = new Chart(ctx, config);
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
      .gte(
        'dateConnected',
        new Date(
          new Date(
            selectedDays === '7 Days'
              ? sevenDays[0]
              : selectedDays === '14 Days'
              ? fourteenDays[0]
              : selectedDays === '30 Days'
              ? thirtyDays[0]
              : threeDays[0]
          )
        ).toUTCString()
      )
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
        .gte(
          'created_at',
          new Date(
            new Date(
              selectedDays === '7 Days'
                ? sevenDays[0]
                : selectedDays === '14 Days'
                ? fourteenDays[0]
                : selectedDays === '30 Days'
                ? thirtyDays[0]
                : threeDays[0]
            )
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
    // loading = true;
    let {
      data,
      error: team_error,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials', { count: 'estimated' })
      .eq('team_id', teamId)
      .gte(
        'dateConnected',
        new Date(
          new Date(
            selectedDays === '7 Days'
              ? last7Days[0]
              : selectedDays === '14 Days'
              ? last14Days[0]
              : selectedDays === '30 Days'
              ? last30Days[0]
              : last3Days[0]
          )
        ).toUTCString()
      )
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
          'created_at, data->card, data->message, data->link, type, team, team_member(team_profile->firstname, team_profile->lastname)',
          { count: 'estimated' }
        )
        .eq('team', teamId)
        .gte(
          'created_at',
          new Date(
            new Date(
              selectedDays === '7 Days'
                ? last7Days[0]
                : selectedDays === '14 Days'
                ? last14Days[0]
                : selectedDays === '30 Days'
                ? last30Days[0]
                : last3Days[0]
            )
          ).toISOString()
        )
        .order('created_at', { ascending: false });

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

  onMount(async () => await renderChart());

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
      <div class="flex flex-col w-full gap-4">
        <AnalyticsDropdownButton on:select={selectDaysHandler} />
        <div class="flex gap-4">
          {#each analyticsData as item}
            <TeamAnalyticsCard {item} {selectedDays} />
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="flex gap-4">
    {#if currentPageRows}
      <div class="flex flex-col w-2/3 gap-4">
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">Team Activity</h1>
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
    </div>
  </div>
</div>
