<script>
  import { fade, slide } from 'svelte/transition';
  import '../../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { userData } from '@lib/stores/userStore';
  import { onMount, setContext } from 'svelte';
  import { sidebarItems } from '@lib/constants';
  import getTeamData from '@lib/query/getTeamData';
  import { memberData, user, userChangeTimestamp } from '@lib/stores/userStore';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import { getUserChangeTs } from '@lib/query/getUserChangeTimestamp';
  import supabase from '@lib/db';
  import SubscriptionEnd from '@pages/subscriptionEnd.svelte';
  import { teams } from '@lib/stores/teamStore';
  import { teamData } from '@lib/stores/teamStore';
  import MenuButtonModal from '@comp/modals/menuButtonModal.svelte';
  import GracePeriod from '@pages/gracePeriod.svelte';

  let isSidebarOpened = false;
  let member;
  let subscription;
  // let loading = true;
  let permissions = {
    readAnalytics: false,
  };
  let isTeamInactive = false;
  let sevenDaysAfterEndDate;
  let teamId = '';

  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  const handler = (id, title) => {
    goto(`/${id}/${title}`);
    isSidebarOpened && sidebarHandler();
  };

  const getSubscriptionsData = async () => {
    const req = await fetch('/api/globaldate', {method:'POST', body: JSON.stringify({
      'teamId': teamId
    })});
    const resp = await req.json();
    if (resp) subscription = resp;
  };

  onMount(async () => {
    const { data } = await supabase.auth.getUser();

    await getSubscriptionsData();
    member = await getRoleMapsByProfile(data.user.id, teamId);
    userChangeTimestamp.set(await getUserChangeTs(data.user.id, teamId));
    $teamData = await getTeamData(teamId);

    if (member != undefined) {
      $userData = member?.role?.role_maps;
      $teams = {
        subscription_end_date: member.team_id.subscription_end_date,
        member_count: member.team_id.member_count,
      };
    }
    // console.log('onmount', member);
    sevenDaysAfterEndDate = new Date(
      new Date(subscription?.subs_end_date).setDate(
        new Date(subscription?.subs_end_date).getDate() + 7
      )
    );
  });

  $: {
    if ($page.route.id === '/(team)/[slug]/members/[slug]') {
      teamId = $page.url.pathname.split('/')[1];
      setContext('teamId', teamId);
    } else {
      teamId = $page.params.slug;
      setContext('teamId', teamId);
    }

    // $userData = member?.role?.role_maps;
    $memberData.id = member?.id;
    $memberData.roleName = member?.role?.role_name;
    $memberData.fullName =
      member?.team_profile?.firstname + ' ' + member?.team_profile?.lastname;
  }

  $: {
    if ($userData)
      $userData.filter((item) => {
        if (item === 'allow_read_analytics') permissions.readAnalytics = true;
        if (item === 'inactive') isTeamInactive = true;
      });

    if (subscription) {
      if (subscription?.isActive) {
        // console.log('active');
      } else if (
        subscription?.isActive === false &&
        subscription?.isAfter7Days
      ) {
        if (member?.role?.role_name !== 'superadmin') {
          $userData = ['inactive'];
        } else {
          $userData = [
            'allow_read_roles',
            'allow_read_team',
            'allow_read_members',
            'allow_read_analytics',
            'allow_read_connections',
            'allow_read_billing',
            'inactive',
          ];
        }
      } else if (!subscription?.isActive && !subscription?.isAfter7Days) {
        // if hari ini lebih besar daripada 7 hari setelah end date
        if (member?.role?.role_name !== 'superadmin') {
          $userData = ['will_expired'];
        } else {
          $userData = [
            'allow_read_roles',
            'allow_read_team',
            'allow_read_members',
            'allow_read_analytics',
            'allow_read_connections',
            'allow_read_billing',
            'allow_write_records',
            'will_expired',
          ];
        }
      }
    }
  }

  let isBannerOpen = true; // Banner view on desktop
  let backupTeamData = false;
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  {#if !subscription}
    <div
      transition:fade|local
      class=" w-full flex flex-col h-screen justify-center items-center rounded-md px-4 md:px-0"
    >
      <small class="text-left w-full md:w-1/2 mb-2 text-white">
        Secondary security authenticating user access ...
      </small>
      <div class="h-6 w-full md:w-1/2 rounded-md shim-red bg-neutral-700" />
    </div>
  {/if}

  <div class="relative min-h-screen">
    {#if sevenDaysAfterEndDate}
      {#if !subscription?.isActive && !subscription?.isAfter7Days}
        <div
          class="bg-red-600 text-white text-center p-2 text-xs md:text-sm sticky"
        >
          Your access to Qubic Teams will be terminated completely on {new Date(
            sevenDaysAfterEndDate
          ).toLocaleDateString()}. Please
          <a href="https://wa.me/628113087599" class="underline">renew</a> your subscription
          to continue.
        </div>
      {/if}
    {/if}

    {#if isBannerOpen}
      <div
        out:slide|local
        class="flex justify-start items-center sticky md:hidden bg-blue-600 text-neutral-100 text-center p-2 text-xs"
      >
        <h1 class="flex justify-center w-full">
          View on desktop for better experience
        </h1>
        <button on:click={() => (isBannerOpen = false)} class="self-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    {/if}

    <div
      class="fixed left-0 right-0 h-16 flex justify-between items-center pr-2 py-4 z-30 border-b border-neutral-800 text-gray-100 bg-opacity-10 backdrop-blur-md bg-neutral-600"
    >
      <div class="flex justify-center items-center h-auto">
        {#if subscription?.isActive || backupTeamData}
          {#if $teamData.name}
            {#if isSidebarOpened}
              <img
                src="/close-white.svg"
                alt="close"
                class="cursor-pointer px-4 w-16 py-4 border-r border-neutral-800"
                on:click={sidebarHandler}
              />
            {:else}
              <img
                src="/menu-white.svg"
                alt="humberger-menu"
                class="cursor-pointer px-4 w-16 py-4 border-r border-neutral-800 hidden md:block"
                on:click={sidebarHandler}
              />
            {/if}
          {:else}
            <div
              class="w-16 h-16 border-r-2 border-neutral-800 bg-opacity-10 flex justify-center items-center animate-pulse"
            >
              <div class="bg-neutral-800 w-10 h-10" />
            </div>
          {/if}
        {/if}
        {#if $teamData.name}
          <p class="text-xl font-semibold ml-4">
            {$teamData.name}
          </p>
        {:else}
          <div class="animate-pulse p-4">
            <div class="text-xl w-60 h-10 bg-neutral-800 rounded-lg" />
          </div>
        {/if}
      </div>
      
      <MenuButtonModal logo={$teamData.logo} />
    </div>

    {#if subscription?.isActive || backupTeamData}
      <div
        class={`border-r border-neutral-800 bg-opacity-10 bg-neutral-600 backdrop-blur-md w-12 md:w-16 hidden md:block fixed ${
          sevenDaysAfterEndDate
            ? !subscription?.isActive && !subscription?.isAfter7Days
              ? 'top-36 md:top-[6.3rem]'
              : 'top-[100px] md:top-16'
            : 'top-16'
        } bottom-0 left-0 z-50 flex flex-col items-center shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpened ? 'w-full md:w-72' : ''
        }`}
      >
        <nav class="w-full flex flex-col justify-center items-center">
          {#each sidebarItems as item}
            {#if $teamData.name}
              <button
                class={`flex cursor-pointer items-center h-16 w-full text-gray-100 ${
                  isSidebarOpened ? 'justify-between' : 'justify-center'
                } ${isSidebarOpened && 'px-12 w-full'} ${
                  $page.route.id === '[slug]/dashboard/team@teams'
                    ? 'first:bg-neutral-900'
                    : ''
                } ${
                  isSidebarOpened && $page.route.id === item.routeId
                    ? 'bg-neutral-900'
                    : ''
                }`}
                on:click={() => handler($teamData?.id, item.title)}
              >
                {#if isSidebarOpened}
                  <p class="text-sm">
                    {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                  </p>
                {/if}
                <div
                  class="rounded-lg p-3 {$page.route.id === item.routeId
                    ? 'bg-neutral-800'
                    : 'outline outline-1 outline-neutral-800'}"
                >
                  <img
                    src={item.urldefault}
                    alt={item.title}
                    class="w-4 md:w-5 "
                  />
                </div>
              </button>
            {:else}
              <div class="animate-pulse gap-5">
                <p
                  class="text-5xl h-12 md:h-16 w-12 md:w-16 text-neutral-800 bg-neutral-800"
                />
              </div>
            {/if}
          {/each}
        </nav>
      </div>

      <div
        class="w-full h-16 z-50 md:hidden fixed bottom-0 bg-black outline outline-1 outline-neutral-800"
      >
        <nav class="w-full flex justify-center items-center overflow-x-auto">
          {#each sidebarItems as item}
            {#if $teamData.name}
              <button
                class={`flex cursor-pointer justify-center items-center w-16 h-16 ${
                  $page.route.id === '[slug]/dashboard/team@teams'
                    ? 'first:bg-neutral-900'
                    : ''
                } ${
                  isSidebarOpened && $page.route.id === item.routeId
                    ? 'bg-neutral-900'
                    : ''
                }`}
                on:click={() => handler($teamData?.id, item.title)}
              >
                <div
                  class="rounded-lg {$page.route.id === item.routeId
                    ? 'bg-neutral-800'
                    : 'outline outline-1 outline-neutral-800'} p-3"
                >
                  <img
                    src={item.urldefault}
                    alt={item.title}
                    class="w-4 md:w-5 "
                  />
                </div>
              </button>
            {:else}
              <div
                class="animate-pulse flex justify-between items-center bg-neutral-800 w-full h-16"
              />
            {/if}
          {/each}
        </nav>
      </div>
    {/if}

    <div
      class={`absolute ${
        sevenDaysAfterEndDate
          ? !subscription?.isActive && !subscription?.isAfter7Days
            ? 'top-36 md:top-24'
            : `${isBannerOpen ? 'top-[100px]' : 'top-[60px]'} md:top-16`
          : 'top-16'
      } bottom-0 text-white overflow-y-auto w-full overflow-x-hidden`}
    >
      <SvelteToast />

      {#if subscription?.isActive || backupTeamData}
        <slot />
      {:else if !subscription?.isActive && subscription?.isAfter7Days}
        <SubscriptionEnd {teamId} />
      {:else if sevenDaysAfterEndDate && !subscription?.isActive && !subscription?.isAfter7Days && !backupTeamData}
        <GracePeriod
          {sevenDaysAfterEndDate}
          {subscription}
          {member}
          {teamId}
          on:click={() => (backupTeamData = true)}
        />
      {/if}
    </div>
  </div>
</AuthWrapper>

<style>
  .shim-red {
    position: relative;
    overflow: hidden;
  }
  .shim-red::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, #2563eb 0%, #2563eb 100%);
    animation: shimmer 3s ease-out infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(0%);
    }
  }
</style>
