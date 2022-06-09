<script>
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import Cookies from 'js-cookie';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { setUserData, user, userData } from '@lib/stores/userStore';
  import MenuButton from '@comp/buttons/menuButton.svelte';
  import { onMount } from 'svelte';
  import getRoleMaps from '@lib/query/getRoleMaps';

  $: console.log('team layout', $user);

  let isSidebarOpened = false;
  let isMenuOpened = false;

  let teamName = Cookies.get('qubicTeamName');
  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  const menuHandler = () => (isMenuOpened = !isMenuOpened);

  let roleMapping = [];

  onMount(async () => (roleMapping = await getRoleMaps($user.id)));

  $: setUserData(roleMapping);

  let sidebarItems = [
    {
      title: 'dashboard',
      routeId: '[slug]/dashboard@teams',
      urldefault:
        'https://img.icons8.com/fluency-systems-regular/96/ffffff/home.png',
      handler: () => {
        goto(`/${teamName}/dashboard`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'connections',
      routeId: '[slug]/connections@teams',
      urldefault:
        'https://img.icons8.com/external-icongeek26-outline-icongeek26/64/ffffff/external-connection-data-analytics-icongeek26-outline-icongeek26.png',
      handler: () => {
        goto(`/${teamName}/connections`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'team',
      routeId: '[slug]/team@teams',
      urldefault:
        'https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/ffffff/external-team-business-and-management-kiranshastry-lineal-kiranshastry-2.png',
      handler: () => {
        goto(`/${teamName}/team`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'analytics',
      routeId: '[slug]/analytics@teams',
      urldefault: 'https://img.icons8.com/windows/96/ffffff/area-chart.png',
      handler: () => {
        goto(`/${teamName}/analytics`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'members',
      routeId: '[slug]/members@teams',
      urldefault:
        'https://img.icons8.com/ios/100/ffffff/user-group-man-man.png',
      handler: () => {
        goto(`/${teamName}/members`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'settings',
      routeId: '[slug]/settings@teams',
      urldefault:
        'https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/96/ffffff/external-setting-essentials-tanah-basah-basic-outline-tanah-basah.png',
      handler: () => {
        goto(`/${teamName}/settings`);
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
        <h1 class="text-5xl font-bold ml-4">{$page.params.slug ?? ''}</h1>
      </div>
      <img
        on:click={menuHandler}
        src="https://placeimg.com/640/480/any"
        alt="avatar"
        class="rounded-full w-12 h-12 cursor-pointer"
      />
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
