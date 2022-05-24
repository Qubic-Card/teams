<script>
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import Cookies from 'js-cookie';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { user } from '@lib/stores/userStore';
  import MenuButton from '@comp/buttons/menuButton.svelte';
  import supabase from '@lib/db';

  $: console.log($page);
  $: console.log('team layout', $user);

  let isSidebarOpened = false;
  let isMenuOpened = false;
  let userImg = '';

  let teamName = Cookies.get('qubicTeamName');
  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  const menuHandler = () => (isMenuOpened = !isMenuOpened);
  // const getProfile = async () => {
  //   let { data, error } = await supabase
  //     .from('profile')
  //     .select('*')
  //     .eq('uid', $user.id);

  //   if (data) userImg = data[0].metadata.avatar;
  //   if (error) console.log(error);

  //   return data;
  // };
  // $: getProfile();
  $: console.log(userImg);
  let sidebarItems = [
    {
      title: 'dashboard',
      routeId: '[slug]/dashboard@teams',
      urldefault: '/home-white.svg',
      handler: () => {
        goto(`/${teamName}/dashboard`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'team',
      routeId: '[slug]/team@teams',
      urldefault: '/company-white.svg',
      handler: () => {
        goto(`/${teamName}/team`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'members',
      routeId: '[slug]/members@teams',
      urldefault: '/users-white.svg',
      handler: () => {
        goto(`/${teamName}/members`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'settings',
      routeId: '[slug]/settings@teams',
      urldefault: '/settings-white.svg',
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
      class="fixed left-0 right-0 h-20 flex justify-between items-center pr-2 py-4 z-30 border-r-2 border-b-2 border-neutral-700 text-gray-100"
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
      {#if $user}
        <p>logged in</p>
      {:else}
        <p>not logged in</p>
      {/if}
      <img
        on:click={menuHandler}
        src={userImg ?? ''}
        alt="avatar"
        class="rounded-full cursor-pointer"
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
            } ${$page.routeId === item.routeId ? 'w-full bg-black' : ''}`}
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
