<script>
  import Connections from '@pages/basic/connections.svelte';
  import ProfileEditor from '@pages/basic/profileEditor.svelte';
  import Analytics from '@pages/basic/analytics.svelte';
  import CardOwnershipWrapper from '@comp/auth/cardOwnershipWrapper.svelte';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';

  let tabSelection = 0;
  let tabs = ['Profile', 'Cards', 'Analytics'];
  let icons = [
    '/icons/account-circle-outline.svg',
    '/icons/credit-card-chip-outline.svg',
    '/icons/chart-box-outline.svg',
  ];

  const handleSelectTab = (index) => (tabSelection = index);
</script>

<CardOwnershipWrapper let:isMounted>
  <div class=" text-black bg-white">
    {#if isMounted}
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
    {/if}
  </div>
</CardOwnershipWrapper>
