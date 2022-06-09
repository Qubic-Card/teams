<script>
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import Cookies from 'js-cookie';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { setUserData, user } from '@lib/stores/userStore';
  import MenuButton from '@comp/buttons/menuButton.svelte';
  import { onMount } from 'svelte';
  import getRoleMaps from '@lib/query/getRoleMaps';
  import { getTeamId } from '@lib/query/getId';
  import supabase from '@lib/db';
  import getTeamData from '@lib/query/getTeamData';

  let isSidebarOpened = false;
  let isMenuOpened = false;

  let roleMapping = [];
  let team = [];

  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  const menuHandler = () => (isMenuOpened = !isMenuOpened);

  onMount(async () => {
    roleMapping = await getRoleMaps($user?.id);
    team = await getTeamData($user?.id);
  });

  $: setUserData(roleMapping);

  let sidebarItems = [
    {
      title: 'dashboard',
      routeId: '[slug]/dashboard@teams',
      urldefault:
        'https://img.icons8.com/fluency-systems-regular/96/ffffff/home.png',
      handler: () => {
        goto(`/${$page.params.slug}/dashboard`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'connections',
      routeId: '[slug]/connections@teams',
      urldefault:
        'https://img.icons8.com/external-icongeek26-outline-icongeek26/64/ffffff/external-connection-data-analytics-icongeek26-outline-icongeek26.png',
      handler: () => {
        goto(`/${$page.params.slug}/connections`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'team',
      routeId: '[slug]/team@teams',
      urldefault:
        'https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/ffffff/external-team-business-and-management-kiranshastry-lineal-kiranshastry-2.png',
      handler: () => {
        goto(`/${$page.params.slug}/team`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'analytics',
      routeId: '[slug]/analytics@teams',
      urldefault: 'https://img.icons8.com/windows/96/ffffff/area-chart.png',
      handler: () => {
        goto(`/${$page.params.slug}/analytics`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'members',
      routeId: '[slug]/members@teams',
      urldefault:
        'https://img.icons8.com/ios/100/ffffff/user-group-man-man.png',
      handler: () => {
        goto(`/${$page.params.slug}/members`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'settings',
      routeId: '[slug]/settings@teams',
      urldefault:
        'https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/96/ffffff/external-setting-essentials-tanah-basah-basic-outline-tanah-basah.png',
      handler: () => {
        goto(`/${$page.params.slug}/settings`);
        isSidebarOpened && sidebarHandler();
      },
    },
  ];
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <div
      class={`fixed left-0 right-0 h-20 flex justify-between items-center pr-2 py-4 z-30 border-r-2 border-b-2 border-neutral-700 text-gray-100 ${
        isSidebarOpened ? 'bg-black' : 'bg-zinc-900/50'
      }`}
    >
      <div class="flex justify-center items-center h-auto">
        {#if isSidebarOpened}
          <img
            src="/close-white.svg"
            alt="close"
            class="cursor-pointer px-6 w-20 py-6 border-r-2 border-neutral-700"
            on:click={sidebarHandler}
          />
        {:else}
          <img
            src="/menu-white.svg"
            alt="humberger-menu"
            class="cursor-pointer px-6 w-20 py-6 border-r-2 border-neutral-700"
            on:click={sidebarHandler}
          />
        {/if}
        {#if team.name}
          <p class="text-5xl font-bold ml-4">{team.name}</p>
        {:else}
          <div class="animate-pulse p-4">
            <p
              class="text-5xl w-full h-12 text-neutral-700 bg-neutral-700 rounded-lg"
            >
              {team.name}
            </p>
          </div>
        {/if}
      </div>
      {#if team.logo}
        <img
          on:click={menuHandler}
          src={team.logo}
          alt="avatar"
          class="rounded-full w-12 h-12 cursor-pointer"
        />
      {:else}
        <div class="animate-pulse p-4">
          <p
            class="text-5xl w-12 h-12 text-neutral-700 bg-neutral-700 rounded-full"
          >
            1
          </p>
        </div>
      {/if}
      {#if isMenuOpened}
        <MenuButton />
      {/if}
    </div>

    <div
      class={`overflow-y-auto border-r-2 border-neutral-700 w-20 fixed top-20 bottom-0 left-0 z-10 pt-4 flex flex-col items-center shadow-md transition-all duration-300 ease-in-out ${
        isSidebarOpened ? 'w-full md:w-72 bg-black' : 'bg-zinc-900/50'
      }`}
    >
      <nav class="space-y-2 w-full flex flex-col items-center">
        {#each sidebarItems as item}
          {#if team.name}
            <!-- skeleton -->
            <div
              class={`flex cursor-pointer items-center justify-between h-16 w-full text-gray-100 ${
                isSidebarOpened && 'px-12 w-full'
              } ${$page.routeId === item.routeId ? 'w-full bg-black' : ''} ${
                isSidebarOpened && $page.routeId === item.routeId
                  ? 'bg-neutral-900'
                  : ''
              }`}
              on:click={item.handler}
            >
              {#if isSidebarOpened}
                <p>
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </p>
              {/if}
              <img src={item.urldefault} alt={item.title} class="w-9 ml-5" />
            </div>
          {:else}
            <div class="animate-pulse gap-5">
              <p
                class="text-5xl w-full h-16 text-neutral-700 bg-neutral-700 rounded-lg"
              >
                qb
              </p>
            </div>
          {/if}
        {/each}
      </nav>
    </div>
    <div
      class="absolute top-20 bottom-0 pt-4 pl-24 pr-4 bg-black text-white overflow-y-auto w-full"
    >
      <SvelteToast />
      <slot />
    </div>
  </div>
</AuthWrapper>
