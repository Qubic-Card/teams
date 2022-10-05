<script>
  import { user } from '@lib/stores/userStore.js';
  import Connections from '@pages/basic/connections.svelte';
  import ProfileEditor from '@pages/basic/profileEditor.svelte';
  import Analytics from '@pages/basic/analytics.svelte';
  import { cards } from '@lib/stores/cardsStore';

  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import { goto } from '$app/navigation';

  let tabSelection = 0;
  let tabs = ['Profile', 'Cards', 'Analytics'];
  let icons = [
    '/icons/account-circle-outline.svg',
    '/icons/credit-card-chip-outline.svg',
    '/icons/chart-box-outline.svg',
  ];

  const handleSelectTab = (index) => {
    tabSelection = index;
  };
</script>

<div class=" text-black bg-white">
  <!-- {#if $cards} -->
  <!-- {#if !$user?.confirmed_at}
    <div
      class="w-full h-screen flex items-center justify-center text-white bg-red-500"
    >
      Please confirm your email first
    </div>
  {:else} -->
  <!-- TABS -->
  <TabGroup>
    <TabList
      class="w-full lg:w-[800px] mx-auto items-center h-20 left-0 right-0 lg:bottom-6 rounded-none lg:rounded-lg lg:border grid grid-cols-3 fixed bottom-0 bg-white bg-opacity-80 backdrop-filter backdrop-blur-md z-50 shadow border-t border-neutral-200"
    >
      {#each tabs as tab, i}
        <Tab
          on:click={() => handleSelectTab(i)}
          class="{tabSelection == i
            ? 'bg-black text-white'
            : ''} grid-span-1 cursor-pointer w-4/5 rounded-lg text-sm flex flex-row justify-center items-center text-center py-3 mx-3"
        >
          <img
            class={tabSelection == i ? 'hidden' : 'block'}
            src={icons[i]}
            alt="icons"
          />
          <p class="mx-1">{tab}</p>
        </Tab>
      {/each}
    </TabList>
    <TabPanels>
      <TabPanel>
        <ProfileEditor />
      </TabPanel>
      <TabPanel>
        <Connections />
      </TabPanel>
      <TabPanel>
        <Analytics />
      </TabPanel>
    </TabPanels>
  </TabGroup>
  <!-- {/if} -->
  <!-- {:else}
    <div
      class="flex max-w-lg px-10 flex-col mx-auto justify-center items-center w-full h-[80vh]"
    >
      <img
        width="84px"
        height="84px"
        class="p-4 border rounded-lg"
        src="https://img.icons8.com/fluency-systems-regular/96/000000/lock-2.png"
        alt="denied"
      />
      <h1 class="text-lg pt-2 font-bold">
        Access <span class="text-red-500 underline">Denied</span>
      </h1>
      <p class="text-neutral-600 text-center">This is basic card editor</p>
      <p class="text-neutral-600 text-center">You don't have any basic card</p>
      <div class="mt-4 w-full flex flex-col gap-2">
        <button
          on:click={() => goto('https://teams.qubic.id')}
          class="text-white border rounded bg-blue-600 px-4 py-2"
          >Qubic Teams Editor -></button
        >
        <button
          on:click={() => goto('/pages/contactus')}
          class="text-white border rounded bg-blue-600 px-4 py-2"
          >I'm having trouble -></button
        >
      </div>
    </div>
  {/if} -->
</div>
