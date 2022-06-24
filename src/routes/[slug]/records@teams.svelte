<script>
  import Cookies from 'js-cookie';
  import { user, userData } from '@lib/stores/userStore';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import TeamRecords from '@pages/teamRecords.svelte';
  import PersonalRecords from '@pages/personalRecords.svelte';

  // import { Datepicker } from 'svelte-calendar';

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;

  $: $userData?.filter((item) => {
    if (item === 'allow_write_records') isHasPermission = true;
  });

  let records = [
    { filename: 'test', created_at: new Date(), type: 'aa', id: 1 },
    { filename: 'test', created_at: new Date(), type: 'aa', id: 2 },
    { filename: 'test', created_at: new Date(), type: 'aa', id: 3 },
  ];
</script>

<div
  class={`flex flex-col w-full pl-216 ${
    isHasPermission ? 'h-[95%] pt-4' : 'h-full pt-0'
  }`}
>
  {#if isHasPermission}
    <TabGroup class="h-full">
      <TabList
        class="w-full flex justify-between pl-20 border-b-2 border-neutral-700 pr-4 text-lg"
      >
        <div class="flex gap-8">
          <Tab
            on:click={() => {
              isTeamTab = false;
            }}
            class={({ selected }) =>
              selected
                ? 'text-white font-bold border-b-2 border-white pb-2'
                : 'text-white pb-2'}>Personal</Tab
          >
          <Tab
            on:click={() => {
              isTeamTab = true;
            }}
            class={({ selected }) =>
              selected
                ? 'text-white font-bold border-b-2 border-white pb-2'
                : 'text-white pb-2'}>Team</Tab
          >
        </div>
        <h1>0/5GB</h1>
      </TabList>
      <TabPanels class="h-full">
        <TabPanel class="flex h-full">
          <PersonalRecords {records} />
        </TabPanel>
        <TabPanel class="flex h-full">
          <TeamRecords {records} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  {:else}
    <div class="flex h-full">
      <PersonalRecords {records} />
    </div>
  {/if}
</div>
