<script>
  import '../app.css';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SvelteToast } from '@zerodevx/svelte-toast';

  let isSidebarOpened = false;
  let teamName = $page.params.slug.split('+').join(' ');
  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);
  let sidebarItems = [
    {
      title: 'dashboard',
      routeId: '[slug]/dashboard@teams',
      urldefault:
        'https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/48/000000/external-home-essentials-tanah-basah-basic-outline-tanah-basah-2.png',
      url: 'home-white.svg',
      handler: () => {
        goto(`/${teamName}/dashboard`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'team',
      routeId: '[slug]/team@teams',
      urldefault: 'https://img.icons8.com/windows/32/000000/company.png',
      url: 'company-white.svg',
      handler: () => {
        goto(`/${teamName}/team`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'members',
      routeId: '[slug]/members@teams',
      urldefault:
        'https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-user-user-flatart-icons-outline-flatarticons-2.png',
      url: 'users-white.svg',
      handler: () => {
        goto(`/${teamName}/members`);
        isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'settings',
      routeId: '[slug]/settings@teams',
      urldefault: 'https://img.icons8.com/ios/50/000000/settings--v1.png',
      url: 'settings-white.svg',
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

<div class="relative min-h-screen">
  <div
    class="fixed left-0 right-0 h-20 bg-black/95 text-gray-100 flex justify-between items-center border-r-2 border-b-2 border-neutral-700 pr-2 py-4 z-30"
  >
    <div class="flex justify-center items-center h-auto">
      {#if isSidebarOpened}
        <img
          src="https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
          alt="close"
          class="cursor-pointer px-6 w-20 py-6 border-r-2 border-neutral-700"
          on:click={sidebarHandler}
        />
      {:else}
        <img
          src="https://img.icons8.com/material-outlined/48/000000/menu--v1.png"
          alt="humberger-menu"
          class="cursor-pointer px-6 w-20 py-6 border-r-2 border-neutral-700"
          on:click={sidebarHandler}
        />
      {/if}
      <h1 class="text-5xl font-bold ml-4">{teamName}</h1>
    </div>
    <img
      src="https://via.placeholder.com/60"
      alt="avatar"
      class="rounded-full"
    />
  </div>

  <div
    class={`overflow-y-auto bg-zinc-900/50 border-r-2 border-neutral-700 w-20 fixed top-20 bottom-0 left-0 z-10 flex flex-col items-center shadow-md transition-all duration-300 ease-in-out ${
      isSidebarOpened ? 'w-full md:w-72' : ''
    }`}
  >
    <nav class="space-y-1 w-full flex flex-col items-center">
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
          <img
            src={$page.routeId === item.title ? item.url : item.urldefault}
            alt={item.title}
            class="w-9 ml-5"
          />
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
