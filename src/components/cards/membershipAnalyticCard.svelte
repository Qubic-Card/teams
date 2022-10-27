<script>
  import colorMapping from '@lib/utils/colorMapping';
  import supabase from '@lib/db';
  import { last14Days, last7Days } from '@lib/utils/getDates';
  import { tapCount } from '@lib/utils/count';
  import { socialIcons } from '@lib/constants';
  import getPercentage from '@lib/utils/getPercentage';

  export let teamId = '';
  export let id = 0;

  const analyticsData = [
    {
      percentage: 10,
      data: 10,
      type: 'New Members',
    },
    {
      percentage: 10,
      data: 10,
      type: 'Members Total',
    },
  ];

  let socialsCount = [];
  let memberCountPercentage = 30;
  let active = 0;
  let memberCount = 0;

  const checkDataAvailability = (arr) => {
    let count = arr.map((item) => item.value);
    let isAvailable = !count.every((item) => item === 0);

    return isAvailable;
  };

  const getTeamConnections = async () => {
    try {
      // console.log('here');
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamWeeklyLogsActivity = async () => {
    try {
      // console.log('here');
    } catch (error) {
      console.log(error);
    }
  };

  const getTeamMemberActivities = async () => {
    try {
      // console.log('here');
    } catch (error) {
      console.log(error);
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
        class="flex justify-between w-full h-1/2 bg-neutral-800 border border-neutral-700 rounded-md p-3"
      >
        <div class="flex justify-between items-center">
          <h1 class="text-sm md:text-md">
            {item.data} <span>{item.type}</span>
          </h1>
          <div
            class="bg-blue-600 hidden justify-center aspect-square items-center p-1 h-full rounded-md"
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
  </div>
{:catch name}
  <h1>Error</h1>
{/await}

{#await getTeamMemberActivities()}
  <div
    class="flex flex-col gap-2 w-full md:w-1/3 h-32 animate-pulse bg-neutral-800 rounded-md border border-neutral-700"
  />
{:then name}
  <div
    class="w-full md:w-1/3 border border-neutral-700 bg-neutral-800 p-2 h-24 md:h-32 rounded-md flex flex-col justify-between "
  >
    <h1 class="text-lg">Active Members</h1>

    <div class="bg-neutral-600 w-full h-8 flex items-center p-1 rounded-md">
      <div
        data-tooltip="{active} / {memberCount} members"
        style="--width: {memberCountPercentage}%;"
        class="bg-yellow-300 box h-6 rounded-md"
      />
    </div>
  </div>
{:catch name}
  <h1>Error</h1>
{/await}

{#await getTeamMemberActivities()}
  <div
    class="flex flex-col gap-2 w-full md:w-1/3 h-32 animate-pulse bg-neutral-800 rounded-md border border-neutral-700"
  />
{:then name}
  <div
    class="w-full md:w-1/3 border border-neutral-700 bg-neutral-800 p-2 h-24 md:h-32 rounded-md flex flex-col justify-between "
  >
    <h1 class="text-lg">Circulating Point</h1>

    <div class="bg-neutral-600 w-full h-8 flex items-center p-1 rounded-md">
      <div
        data-tooltip="{active} / {memberCount} points"
        style="--width: {memberCountPercentage}%;"
        class="bg-green-300 box h-6 rounded-md"
      />
    </div>
  </div>
{:catch name}
  <h1>Error</h1>
{/await}

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
