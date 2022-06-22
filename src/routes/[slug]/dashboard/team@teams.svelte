<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { user, userData } from '@lib/stores/userStore';
  import {
    last30Days,
    last7Days,
    last3Days,
    last14Days,
  } from '@lib/utils/getDates';
  import supabase from '@lib/db';
  import AnalyticsDropdownButton from '@comp/buttons/analyticsDropdownButton.svelte';
  import { tapCount } from '@lib/utils/count';
  import { doughnutChartBgColor, socialIcons } from '@lib/constants';

  let teamUniqueCount = 0;
  let teamActivityCount = 0;
  let teamConnectionCount = 0;
  let teamActivity = [];
  let teamDateConnected = [];
  let teamLogs = [];
  let teamLogsChart = [];
  let loading = false;

  const analyticsData = [
    { percentage: '20', data: 0, type: 'Active' },
    {
      percentage: '30',
      data: 0,
      type: 'Contacts',
    },
    {
      percentage: '40',
      data: 0,
      type: 'Taps',
    },
  ];

  let chart;
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

  let teamId = Cookies.get('qubicTeamId');
  let teamLogsCsv = {};
  let selectedDays = '3 Days';

  const selectDaysHandler = (e) => (selectedDays = e.detail);

  const getTeamConnectionsList = async () => {
    console.log('getting connections');
    loading = true;
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      // .select(
      //   'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)',
      //   { count: 'estimated' }
      // )
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
      .order('dateConnected', { ascending: false });

    loading = false;
    if (connection_profile) {
      teamConnectionCount = count;
      teamDateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
      analyticsData[1].data = connection_profile.length;
      // console.log(connection_profile);
    }
    if (error_profile) console.log(error_profile);
  };

  const getTeamWeeklyLogsActivity = async () => {
    console.log('getting logs');
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
        teamUniqueCount = newArr.length;
        teamActivityCount = count;
        teamActivity = logs.map((log) =>
          new Date(log.created_at).toDateString().slice(4)
        );

        // console.log('logs', logs);
        analyticsData[0].data = count;
        analyticsData[2].data = logs.length;

        teamLogsChart = logs;
        teamLogs = logs;

        // data.datasets[0].data = tapCount(Object.keys(socialIcons), teamLogs);

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

        console.log(teamLogsCsv);
        console.log(teamLogs);
        // paginate(teamLogs);
        data.datasets[0].data = tapCount(Object.keys(socialIcons), teamLogs);
        if (chartctx) chartctx.update();
        loading = false;
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  $: selectedDays, getTeamWeeklyLogsActivity(), getTeamConnectionsList();

  let chartctx;
  onMount(async () => {
    await getTeamWeeklyLogsActivity();
    await getTeamConnectionsList();

    // console.log(data.datasets[0].data.every((item) => item === 0));
    // console.log(data.datasets[0].data.map((item) => item === 0));
    console.log(data.datasets[0].data);
    console.log(teamLogsChart);
    const ctx = chart.getContext('2d');
    chartctx = new Chart(ctx, config);
  });
</script>

<div class="min-h-screen flex flex-col text-white gap-4 mb-8 pt-4 pl-24 pr-4">
  <div class="flex justify-between gap-4">
    {#each analyticsData as item}
      <div
        class="flex flex-col justify-between w-full h-32 bg-neutral-800 border border-neutral-700 rounded-lg p-6"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-xl">{item.data} <span>{item.type}</span></h1>
          <div
            class="bg-blue-600 flex justify-center aspect-square items-center p-1 h-full rounded-lg"
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
          <h2 class="text-neutral-400">in 7 days</h2>
          <p class="text-green-600">^ {item.percentage}%</p>
        </div>
      </div>
    {/each}
  </div>
  <div
    class="flex justify-between items-center border border-neutral-700 bg-neutral-800 pr-5 rounded-lg"
  >
    <Menu>
      <MenuButton class="bg-neutral-100 text-black p-3 text-sm rounded-l-lg"
        >Most active member <span class="pl-12">&#x25BC;</span></MenuButton
      >
      <MenuItems
        class="mt-4 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-3 w-80"
      >
        <MenuItem class="p-2">Choose one</MenuItem>
      </MenuItems>
    </Menu>

    <h1>dsafasd</h1>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col w-2/3 gap-4">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">Team Activity</h1>
        <!-- <button class="bg-blue-600 p-2 rounded-lg w-48">Download CSV</button> -->
        <AnalyticsDropdownButton on:select={selectDaysHandler} />
      </div>
      {#each teamLogs as log}
        <div class="pl-5 mb-1">
          <h1 class="text-sm font-bold text-neutral-500">
            {log.date}
          </h1>
          <div class="flex flex-col pl-7">
            {#each log.logs as item}
              <div class="text-sm flex justify-between">
                <h1 class="text-white">
                  {`${item.team_member.firstname}'s` + item.message.slice(4)}
                </h1>
                <p class="text-neutral-500">
                  {new Date(item.created_at).getHours() +
                    ':' +
                    new Date(item.created_at).getMinutes()}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col justify-around w-1/3 h-[500px] px-8 py-16 lg:py-10 bg-neutral-800 rounded-lg"
    >
      <canvas bind:this={chart} />
      <!-- <AnalyticsDropdownButton data={teamLogsCsv} class="top-[385px]" /> -->

      <!-- <button class="bg-blue-600 p-2 rounded-lg min-w-1/3 self-end mt-2 text-md"
        >Download CSV</button
      > -->
    </div>
  </div>
</div>
