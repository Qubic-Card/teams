<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide, fly } from 'svelte/transition';
  import '../app.css';

  let isSidebarOpened = false;

  const sidebarHandler = () => (isSidebarOpened = !isSidebarOpened);

  const sidebarItem = [
    {
      title: 'dashboard',
      urldefault:
        'https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/48/000000/external-home-essentials-tanah-basah-basic-outline-tanah-basah-2.png',
      url: 'home-white.svg',
      handler: () => {
        goto('/dashboard');
        // isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'company',
      urldefault: 'https://img.icons8.com/windows/32/000000/company.png',
      url: 'company-white.svg',
      handler: () => {
        goto('/company');
        // isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'employee',
      urldefault:
        'https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-user-user-flatart-icons-outline-flatarticons-2.png',
      url: 'users-white.svg',
      handler: () => {
        goto('/employee');
        // isSidebarOpened && sidebarHandler();
      },
    },
    {
      title: 'settings',
      urldefault: 'https://img.icons8.com/ios/50/000000/settings--v1.png',
      url: 'settings-white.svg',
      handler: () => {
        goto('/settings');
        // isSidebarOpened && sidebarHandler();
      },
    },
  ];
</script>

<div class="relative min-h-screen">
  <div
    class="fixed left-0 right-0 h-20 bg-white text-gray-800 flex justify-between items-center border-r border-b border-black pr-2 py-4 z-30"
  >
    <div class="flex justify-center items-center h-auto">
      {#if isSidebarOpened}
        <img
          src="https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
          alt="close"
          class="cursor-pointer px-6 w-20 py-6 border-r border-black"
          on:click={sidebarHandler}
        />
      {:else}
        <img
          src="https://img.icons8.com/material-outlined/48/000000/menu--v1.png"
          alt="humberger-menu"
          class="cursor-pointer px-6 w-20 py-6 border-r border-black"
          on:click={sidebarHandler}
        />
      {/if}
      <h1 class="text-5xl font-bold ml-4">Tahesta</h1>
    </div>
    <img
      src="https://via.placeholder.com/60"
      alt="avatar"
      class="rounded-full"
    />
  </div>

  <div
    class={`overflow-y-auto bg-white w-20 fixed top-20 bottom-0 left-0 z-10 flex flex-col items-center transition-all duration-300 ease-in-out ${
      isSidebarOpened ? 'w-full md:w-72' : ''
    }`}
  >
    <nav class="space-y-1 w-full flex flex-col items-center">
      {#each sidebarItem as item}
        <div
          class={`flex cursor-pointer items-center justify-between h-16 w-full ${
            isSidebarOpened && 'px-12 w-full'
          } ${
            $page.routeId === item.title ? 'w-full bg-black text-white' : ''
          }`}
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
    class="absolute top-20 bottom-0 pt-4 pl-24 pr-4 bg-neutral-200 overflow-y-auto w-full"
  >
    <slot />
  </div>
</div>
