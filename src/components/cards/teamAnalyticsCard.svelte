<script>
  import colorMapping from '@lib/utils/colorMapping';
  import supabase from '@lib/db';
  import { last14Days, last7Days } from '@lib/utils/getDates';
  import { tapCount } from '@lib/utils/count';
  import { socialIcons } from '@lib/constants';
  import getPercentage from '@lib/utils/getPercentage';

  export let teamId = '';
  export let id = 0;
  export let teams;

  const analyticsData = [
    {
      percentage: 0,
      data: 0,
      type: 'New Contacts',
    },
    {
      percentage: 0,
      data: 0,
      type: 'New Taps',
    },
  ];

  let socialsCount = [];
  let memberCountPercentage = 0;
  let active = 0;
  let memberCount = 0;

  const checkDataAvailability = (arr) => {
    let count = arr.map((item) => item.value);
    let isAvailable = !count.every((item) => item === 0);

    return isAvailable;
  };

  const getTeamConnections = async () => {
    // loading = true;
    let {
      data,
      error: team_error,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('profileData->socials, dateConnected', { count: 'estimated' })
      .eq(teams ? 'team_id' : 'by', teams ? teamId : id)
      .gte('dateConnected', new Date(new Date(last14Days[0])).toUTCString())
      // .rangeLt('dateConnected', [a, b])
      .order('dateConnected', { ascending: false });

    if (data) {
      let current = data.filter((item) => {
        return (
          new Date(item.dateConnected).getTime() >=
          new Date(last7Days[0]).getTime()
        );
      });

      let previous = data.filter((item) => {
        return (
          new Date(item.dateConnected).getTime() <
          new Date(last14Days[0]).getTime()
        );
      });

      analyticsData[0].data = count;
      analyticsData[0].percentage = getPercentage(
        current.length,
        previous.length === 0 ? 1 : previous.length
      );
    }

    if (team_error) console.log(team_error);
  };

  const getTeamWeeklyLogsActivity = async () => {
    // loading = true;
    try {
      let { data: logs, error } = await supabase
        .from('team_logs')
        .select(
          'created_at, data->card, data->message, data->link, type, team, card_holder'
        )
        .eq(teams ? 'team' : 'team_member', teams ? teamId : id)
        .gte('created_at', new Date(new Date(last14Days[0])).toUTCString())
        .order('created_at', { ascending: false });

      if (logs) {
        let current = logs.filter(
          (d) =>
            new Date(d.created_at).getTime() >= new Date(last7Days[0]).getTime()
        );

        let previous = logs.filter(
          (d) =>
            new Date(d.created_at).getTime() < new Date(last7Days[0]).getTime()
        );

        let filtered = current.filter(
          (log) => !log.message.includes('QRScan' || 'QRShare' || 'NFC')
        );

        socialsCount = tapCount(Object.keys(socialIcons), filtered);

        let totalSocialsCount = socialsCount
          .map((s) => s.value)
          .reduce((a, b) => a + b, 0);

        if (totalSocialsCount !== 0) {
          socialsCount = socialsCount?.map((s) => {
            return {
              name: s.name,
              value: Math.round((s.value * 100) / totalSocialsCount),
            };
          });
        }

        analyticsData[1].percentage = getPercentage(
          current.length,
          previous.length === 0 ? 1 : previous.length
        );
        analyticsData[1].data = current.length;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamMemberActivities = async () => {
    const { error: member_error, count } = await supabase
      .from('team_members')
      .select('id', { count: 'exact' })
      .eq(teams ? 'team_id' : 'id', teams ? teamId : id);

    const { data, error } = await supabase
      .from('team_logs')
      .select('team_member')
      .eq(teams ? 'team' : 'team_member', teams ? teamId : id)
      .gte('created_at', new Date(new Date(last7Days[0])).toUTCString());

    if (error || member_error) {
      console.log(error);
    }

    if (data && count) {
      let mid = data.map((item) => item.team_member);

      let unique = [...new Set(mid)].length;

      memberCountPercentage = Math.ceil((unique / count) * 100);
      memberCount = count;
      active = unique;
    }
  };
</script>

{#await (getTeamWeeklyLogsActivity(), getTeamConnections())}
  <div
    class="flex flex-col gap-2 w-full md:w-1/3 h-32 animate-pulse bg-neutral-800 rounded-md border border-neutral-700"
  />
{:then name}
  <div class="flex flex-col gap-2 w-full md:w-1/3 h-32">
    {#each analyticsData as item}
      <div
        class="flex justify-between w-full h-1/2 outline outline-1 outline-neutral-800 bg-neutral-900 rounded-lg p-3"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-sm md:text-md font-bold">
            {item.data}
            <span class="text-sm text-neutral-400">{item.type}</span>
          </h1>
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
          {#if item.percentage >= 0}
            <p class="text-green-400 flex gap-1">
              ▲
              {item.percentage}%
            </p>
          {:else}
            <p class="text-red-400 flex gap-1">
              ▼
              {item.percentage}%
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{:catch name}
  <h1>Error</h1>
{/await}

{#if teams}
  {#await getTeamMemberActivities()}
    <div
      class="flex flex-col gap-2 w-full md:w-1/3 h-32 animate-pulse outline outline-1 outline-neutral-800 bg-neutral-900 rounded-md"
    />
  {:then name}
    <div
      class="w-full md:w-1/3 outline outline-1 outline-neutral-800 bg-neutral-900 p-4 h-24 md:h-32 rounded-md flex flex-col justify-between "
    >
      <h1 class="text-md md:text-lg">Members Efficiency</h1>

      <div class="bg-neutral-600 w-full h-4 flex items-center rounded-sm">
        <div
          data-tooltip="{active} / {memberCount} members - {memberCountPercentage}%"
          style="--width: {memberCountPercentage}%;"
          class="{memberCountPercentage >= 50
            ? 'bg-green-400'
            : memberCountPercentage < 25
            ? 'bg-red-400'
            : 'bg-orange-400'} box h-full rounded-sm"
        />
      </div>
    </div>
  {:catch name}
    <h1>Error</h1>
  {/await}
{/if}

{#if socialsCount}
  <div
    class="w-full md:w-1/3 outline outline-1 outline-neutral-800 bg-neutral-900 p-4 h-24 md:h-32 rounded-md flex flex-col justify-between"
  >
    <h1 class="text-md md:text-lg">Social Media Effectiveness</h1>
    <div class="bg-neutral-600 w-full h-4 flex items-center  rounded-sm">
      {#if checkDataAvailability(socialsCount)}
        {#each socialsCount as item}
          {#if item.value !== 0}
            <div
              data-tooltip={item.name.charAt(0).toUpperCase() +
                item.name.slice(1) +
                ' - ' +
                item.value +
                '%'}
              style="--width: {item.value}%;"
              class="{colorMapping(
                item.name
              )} h-full box first:rounded-l-sm last:rounded-r-sm"
            />
          {/if}
        {/each}
      {:else}
        <p class="pl-1 text-xs">No data available</p>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="flex flex-col gap-2 w-full md:w-1/3 h-32 animate-pulse bg-neutral-800 rounded-md border border-neutral-700"
  />
{/if}

<!-- {:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await} -->
<style>
  .box {
    width: var(--width) !important;
  }
  [data-tooltip] {
    position: relative;
    z-index: 2;
    display: block;
  }

  [data-tooltip]:before,
  [data-tooltip]:after {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: 0.2s ease-out;
    transform: translate(-50%, 5px);
  }

  [data-tooltip]:before {
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-bottom: 5px;
    padding: 7px;
    width: 100%;
    min-width: 70px;
    max-width: 250px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #000;
    background-color: hsla(0, 0%, 20%, 0.9);
    color: #fff;
    content: attr(data-tooltip);
    text-align: center;
    font-size: 12px;
    line-height: 1.2;
    transition: 0.2s ease-out;
  }

  [data-tooltip]:after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    border-top: 5px solid #000;
    border-top: 5px solid hsla(0, 0%, 20%, 0.9);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    content: ' ';
    font-size: 0;
    line-height: 0;
  }

  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0);
  }
  [data-tooltip='false']:hover:before,
  [data-tooltip='false']:hover:after {
    visibility: hidden;
    opacity: 0;
  }
</style>
