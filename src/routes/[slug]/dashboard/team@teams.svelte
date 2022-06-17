<script>
  import Cookies from 'js-cookie';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Chart from 'chart.js/auto/auto.js';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { user, userData } from '@lib/stores/userStore';
  import getDates from '@lib/utils/getDates';
  import supabase from '@lib/db';

  let isHasPermissionToMemberPage = false;
  let isHasPermissionToAnalyticsPage = false;
  let isHasPermissionToEditProfilePage = false;
  let showModal = false;

  $: $userData?.filter((item) => {
    if (item === 'allow_write_members') {
      isHasPermissionToMemberPage = true;
    }
    if (item === 'allow_read_analytics') {
      isHasPermissionToAnalyticsPage = true;
    }
    if (item === 'allow_write_profile') {
      isHasPermissionToEditProfilePage = true;
    }
  });

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

  let dummy = [
    {
      date: new Date(),
      data: [
        { msg: 'Hello', date: new Date() },
        { msg: 'Hello', date: new Date() },
        { msg: 'Hello', date: new Date() },
      ],
    },
    { date: new Date(), data: [{ msg: 'Hello', date: new Date() }] },
    { date: new Date(), data: [{ msg: 'Hello', date: new Date() }] },
  ];

  let portfolio;
  const data = {
    labels: ['Expenses', 'Savings', 'Investments'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: ['#7000e1', '#fc8800', '#00b0e8'],
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
      cutout: '80%',
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
  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );

  const modalHandler = () => (showModal = !showModal);

  const getContacts = async () => {
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('id')
      .eq('team_id', teamId)
      .gte('dateConnected', new Date(last7Days[0]).toUTCString());

    if (error) console.log(error);
    if (data) {
      analyticsData[1].data = data.length;
    }
  };

  const getTaps = async () => {
    const { data, error, count } = await supabase
      .from('team_logs')
      .select('*', { count: 'estimated' })
      .eq('team', teamId)
      .gte('created_at', new Date(last7Days[0]).toUTCString());

    if (error) console.log(error);
    if (data) {
      analyticsData[0].data = count;
      analyticsData[2].data = data.length;
    }
  };
  onMount(async () => {
    await getContacts();
    await getTaps();
    const ctx = portfolio.getContext('2d');
    // Initialize chart using default config set
    new Chart(ctx, config);
  });
</script>

<div class="min-h-screen flex flex-col text-white gap-4 mb-8 pt-4 pl-24 pr-4">
  <div class="flex justify-between gap-4">
    {#each analyticsData as item}
      <div
        class="flex flex-col justify-between w-full h-40 bg-neutral-800 rounded-lg p-6"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-3xl">{item.data} <span>{item.type}</span></h1>
          <div
            class="bg-blue-600 flex justify-center items-center w-12 h-full rounded-lg"
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
        <div class="flex justify-between items-center text-2xl">
          <h2 class="text-neutral-400">in 7 days</h2>
          <p class="text-green-600">^ {item.percentage}%</p>
        </div>
      </div>
    {/each}
  </div>
  <div class="flex justify-between items-center bg-neutral-800 pr-5 rounded-lg">
    <Menu>
      <MenuButton class="bg-neutral-100 text-black p-5 rounded-l-lg"
        >Most active member <span class="pl-12">&#x25BC;</span></MenuButton
      >
      <MenuItems
        class="mt-4 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-80"
      >
        <MenuItem class="p-2">Account settings</MenuItem>
      </MenuItems>
    </Menu>

    <h1>dsafasd</h1>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col w-2/3 gap-4">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">Team performance</h1>
        <button class="bg-blue-600 p-2 rounded-lg w-48">Download CSV</button>
      </div>
      {#each dummy as item}
        <div class="pl-5">
          <h1 class="text-xl">{new Date(item.date).toDateString().slice(4)}</h1>
          <div class="flex flex-col pl-7">
            {#each item.data as item}
              <div class="text-lg flex justify-between">
                <h1 class="text-neutral-100">{item.msg}</h1>
                <p class="text-neutral-400">
                  {new Date(item.date).toDateString().slice(4)}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
    <div
      class="flex flex-col justify-around w-1/3 h-[500px] px-4 py-16 lg:py-10 bg-neutral-800 rounded-lg"
    >
      <canvas bind:this={portfolio} />
      <button class="bg-blue-600 p-2 rounded-lg w-1/3 self-end mt-2 text-md"
        >Download CSV</button
      >
    </div>
  </div>
</div>
