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
  import supabase from '@lib/db';
  import RecordsSkeleton from '@comp/skeleton/recordsSkeleton.svelte';

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;
  let personalConnectionsCsv;

  const getPersonalStorage = async () => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {});

    if (error) {
      console.log(error);
    } else {
      personalConnectionsCsv = data;
      // console.log(data);
    }
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_write_records') isHasPermission = true;
  });
</script>

{#await getPersonalStorage()}
  <RecordsSkeleton />
{:then name}
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
            <PersonalRecords {personalConnectionsCsv} {getPersonalStorage} />
          </TabPanel>
          <TabPanel class="flex h-full">
            <TeamRecords />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    {:else}
      <div class="flex h-full">
        <PersonalRecords />
      </div>
    {/if}
  </div>
{:catch name}
  <h1>Error</h1>
{/await}
