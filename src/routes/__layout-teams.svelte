<script>
  import { fade } from 'svelte/transition';
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { userData } from '@lib/stores/userStore';
  import MenuButton from '@comp/buttons/menuButton.svelte';
  import { onMount } from 'svelte';
  import { sidebarItems } from '@lib/constants';
  import getTeamData from '@lib/query/getTeamData';
  import Cookies from 'js-cookie';
  import { memberData, user, userChangeTimestamp } from '@lib/stores/userStore';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import { getUserChangeTs } from '@lib/query/getUserChangeTimestamp';
  import supabase from '@lib/db';
  import SubscriptionEnd from '@pages/subscriptionEnd.svelte';

  let isSidebarOpened = false;
  let isMenuOpened = false;
  let team = null;
  let member = [];
  let teamId = Cookies.get('qubicTeamId');
  let subscription = {};
  let loading = true;
  let permissions = {
    readAnalytics: false,
  };
  let isTeamInactive = false;
  let sevenDaysAfterEndDate;

  const getSubscriptionsData = async () => {
    const { data, error } = await supabase.functions.invoke('globaldate', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId: teamId,
      }),
    });
    if (error) console.log(error);
    if (data) subscription = data;
  };

  onMount(async () => {
    await getSubscriptionsData();
    member = await getRoleMapsByProfile($user?.id, teamId);
    userChangeTimestamp.set(await getUserChangeTs($user?.id, teamId));
    team = await getTeamData(teamId);

    sevenDaysAfterEndDate = new Date(
      new Date(subscription?.subs_end_date).setDate(
        new Date(subscription?.subs_end_date).getDate() + 7
      )
    );
    if (member || userChangeTimestamp || $userData) loading = false;
  });

  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  const menuHandler = () => (isMenuOpened = !isMenuOpened);
  const handler = (id, title) => {
    goto(`/${id}/${title}`);
    isSidebarOpened && sidebarHandler();
  };

  $: {
    $userData = member?.role?.role_maps;
    $memberData.id = member?.id;
  }
  $: {
    if ($userData)
      $userData.filter((item) => {
        if (item === 'allow_read_analytics') permissions.readAnalytics = true;
        if (item === 'inactive') isTeamInactive = true;
      });

    if (subscription) {
      if (subscription.isActive) {
        // console.log('active');
      } else if (subscription.isActive === false && subscription.isAfter7Days) {
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
      } else if (!subscription.isActive && !subscription.isAfter7Days) {
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
            'will_expired',
          ];
        }
      }
    }
  }
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    {#if sevenDaysAfterEndDate}
      {#if !subscription.isActive && !subscription.isAfter7Days}
        <div class="bg-red-600 text-white text-center p-2 text-sm sticky">
          Your access to Qubic Team will be terminated completely on {new Date(
            sevenDaysAfterEndDate
          ).toLocaleDateString()}. Please renew your subscription to continue.
        </div>
      {/if}
    {/if}

    <div
      class="fixed left-0 right-0 h-16 flex justify-between items-center pr-2 py-4 z-30 border-b border-neutral-700 text-gray-100 bg-black"
    >
      <div class="flex justify-center items-center h-auto">
        {#if subscription.isActive || (!subscription.isActive && !subscription.isAfter7Days)}
          {#if team?.name}
            {#if isSidebarOpened}
              <img
                src="/close-white.svg"
                alt="close"
                class="cursor-pointer px-6 w-16 py-6 border-r border-neutral-700"
                on:click={sidebarHandler}
              />
            {:else}
              <img
                src="/menu-white.svg"
                alt="humberger-menu"
                class="cursor-pointer px-6 w-16 py-6 border-r border-neutral-700"
                on:click={sidebarHandler}
              />
            {/if}
          {:else}
            <div
              class="w-16 h-16 border-r-2 border-neutral-800 flex justify-center items-center animate-pulse"
            >
              <div class="bg-neutral-800 w-10 h-10" />
            </div>
          {/if}
        {/if}
        {#if team?.name}
          <p class="text-xl font-bold ml-4">
            {team?.name}
          </p>
        {:else}
          <div class="animate-pulse p-4">
            <div class="text-xl w-60 h-10 bg-neutral-800 rounded-lg" />
          </div>
        {/if}
      </div>
      {#if team?.logo}
        <img
          on:click={menuHandler}
          src={team?.logo}
          alt="avatar"
          class="rounded-full w-10 h-10 cursor-pointer"
        />
      {:else if team?.logo === ''}
        <div
          on:click={menuHandler}
          class="bg-neutral-800 p-4 rounded-full w-12 h-12 cursor-pointer flex items-center justify-center"
        />
      {:else}
        <div class="animate-pulse p-4">
          <div class="text-5xl w-12 h-12 bg-neutral-800 rounded-full" />
        </div>
      {/if}
      {#if isMenuOpened}
        <MenuButton />
      {/if}
    </div>

    {#if subscription.isActive === false && subscription.isAfter7Days}
      <SubscriptionEnd {subscription} {member} />
    {:else}
      <div
        class={`overflow-y-auto border-r border-neutral-700 bg-black w-16 fixed ${
          subscription.isActive ? 'top-16' : 'top-[100px]'
        } bottom-0 left-0 z-30 pt-4 flex flex-col items-center shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpened ? 'w-full md:w-72' : ''
        }`}
      >
        <nav class="space-y-2 w-full flex flex-col justify-center items-center">
          {#each sidebarItems as item}
            {#if team?.name}
              <div
                class={`flex cursor-pointer items-center h-16 w-full text-gray-100 ${
                  isSidebarOpened ? 'justify-between' : 'justify-center'
                } ${isSidebarOpened && 'px-12 w-full'} ${
                  $page.routeId === '[slug]/dashboard/team@teams'
                    ? 'first:bg-neutral-900'
                    : ''
                }  ${
                  $page.routeId === item.routeId ? 'w-full bg-neutral-900' : ''
                } ${
                  isSidebarOpened && $page.routeId === item.routeId
                    ? 'bg-neutral-900'
                    : ''
                }`}
                on:click={() => handler(team?.id, item.title)}
              >
                {#if isSidebarOpened}
                  <p class="text-sm">
                    {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                  </p>
                {/if}
                <img src={item.urldefault} alt={item.title} class="w-5" />
              </div>
            {:else}
              <div class="animate-pulse gap-5">
                <p class="text-5xl h-16 w-16 text-neutral-800 bg-neutral-800" />
              </div>
            {/if}
          {/each}
        </nav>
      </div>

      <div
        class={`absolute ${
          subscription.isActive ? 'top-16' : 'top-24'
        } bottom-0 bg-neutral-900 text-white overflow-y-auto w-full`}
      >
        <SvelteToast />

        {#if loading}
          <div
            transition:fade|local
            class=" w-full flex flex-col h-screen justify-center items-center rounded-md pb-40"
          >
            <small class="text-left w-1/2 mb-2">
              Secondary security authenticating user access ...
            </small>
            <div class="h-6 w-1/2 rounded-md shim-red bg-neutral-700" />
          </div>
        {:else}
          {#if permissions.readAnalytics}
            {#if $page.routeId === '[slug]/dashboard@teams' || $page.routeId === '[slug]/dashboard/team@teams'}
              <div class="border-b-2 border-neutral-700 pl-24 mt-4 gap-4 flex">
                <button
                  on:click={() => goto(`/${team?.id}/dashboard`)}
                  class={`pb-2 w-1/5 text-md ${
                    $page.routeId === '[slug]/dashboard@teams'
                      ? 'border-b-2 border-neutral-200 font-bold'
                      : 'text-neutral-300'
                  }`}>Personal</button
                >
                <button
                  on:click={() => goto(`/${team?.id}/dashboard/team`)}
                  class={`pb-2 w-1/5 text-md ${
                    $page.routeId === '[slug]/dashboard/team@teams'
                      ? 'border-b-2 border-neutral-200 font-bold'
                      : 'text-neutral-300'
                  }`}>Team</button
                >
              </div>
            {/if}
          {/if}
          <slot />
        {/if}
      </div>
    {/if}
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
