<script>
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import { page } from '$app/stores';
  import { getMembersId, getTeamId } from '@lib/query/getId';
  import { toastFailed } from '@lib/utils/toast';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import AnalyticsPageSkeleton from '@comp/skeleton/analyticsPageSkeleton.svelte';
  import getDates from '@lib/utils/getDates';

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;

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

  const topics = [
    'Cunsumer Behavior',
    'Team Performance',
    'Performa Penjualan',
    'Performa Lapangan',
    'Top Performer',
    'Coming Soon',
  ];
  let selectedTopic = null;
  let state = 'idle';
  let contactsCount = 0;

  $: $userData?.filter((item) => {
    if (item === 'allow_read_analytics') isHasPermission = true;
  });

  const selectTopic = (topic) => (selectedTopic = topic);
  const setState = (newState) => (state = newState);
  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );

  const getContacts = async () => {
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select(
        'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)'
      )
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

  const getActiveMember = async () => {
    const { data, error } = await supabase
      .from('team_logs')
      .select('*')
      .eq('team', teamId);
    // .eq('status', true);

    if (error) console.log(error);
    if (data) {
      console.log(data);
    }
  };

  // onMount(async () => {
  //   await getContacts();
  // });
</script>

<div class="flex flex-col w-full h-full pt-4 pl-24 pr-4">
  {#await (getContacts(), getTaps())}
    <AnalyticsPageSkeleton />
  {:then name}
    {#if isHasPermission}
      <div class="flex justify-between gap-4">
        {#each analyticsData as item}
          <div
            class="flex flex-col justify-between w-full h-72 bg-neutral-800 first:bg-gradient-to-bl from-blue-500 to-green-500 first:hover:bg-gradient-to-tr hover:from-blue-500 hover:to-green-500 transform transition duration-200 rounded-lg p-6"
          >
            <p class="text-4xl self-end text-green-600">^ {item.percentage}%</p>
            <div>
              <h1 class="text-4xl">{item.data} <span>{item.type}</span></h1>
              <h2 class="text-2xl">in 7 days</h2>
            </div>
          </div>
        {/each}
      </div>
      <div
        class="flex flex-col w-full h-full bg-neutral-800 my-4 rounded-lg p-8 justify-between"
      >
        {#if state === 'idle'}
          <h1 class="text-2xl">Select topics</h1>
          <div
            class="grid grid-cols-3 grid-rows-2 gap-4 mt-8 border-b-2 border-neutral-700 pb-32"
          >
            {#each topics as item}
              <button
                on:click={() => selectTopic(item)}
                class={`border-2 border-neutral-700 hover:bg-neutral-900 text-xl rounded-lg w-full p-4 ${
                  selectedTopic === item ? 'bg-neutral-700' : ''
                }`}>{item}</button
              >
            {/each}
          </div>
          <button
            class="self-end bg-white p-4 w-80 text-black mt-8 text-xl"
            on:click={() => {
              if (selectedTopic === null) {
                toastFailed('Please select a topic first');
              } else {
                setState('analyze');
              }
            }}
          >
            Power Analyze
          </button>
        {:else}
          <div
            class="flex justify-between h-24 border-b border-neutral-700 pb-8"
          >
            <button
              class="border-2 border-neutral-700 hover:bg-neutral-700 text-xl rounded-lg w-96 h-full p-4"
              >{selectedTopic}
            </button>
            <button
              class="self-end bg-white p-4 w-80 h-full text-black text-xl"
            >
              Power Analyze
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <p>you dont have access to this page, you cant see the analytics</p>
    {/if}
  {:catch}
    <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again.
    </h1>
  {/await}
</div>
