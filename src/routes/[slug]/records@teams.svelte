<script>
  import Cookies from 'js-cookie';
  import { memberData, user, userData } from '@lib/stores/userStore';
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
  import { personal, team } from '@lib/stores/recordsStore';
  import { getContext } from 'svelte';

  let permissions = {
    writeRecords: false,
  };
  let isTeamInactive = false;
  let holder = '';

  const teamId = getContext('teamId');

  let maxPage = 0;
  let page = 0;
  let toItem = 15;
  let totalTeamRecords = 0;
  let isLoading = false;
  const setPage = (p) => (page = p);
  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getPersonalStorage = async () => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.log(error);
    } else {
      $personal = data;
    }
  };

  const getTeamStorage = async () => {
    isLoading = true;
    const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('team_storage')
      .select('*', { count: 'estimated' })
      .eq('tid', teamId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.log(error);
      isLoading = false;
    } else {
      totalTeamRecords = count;
      $team = data;
      maxPage = Math.ceil(count / toItem);
      isLoading = false;
    }
  };

  const getMemberData = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_profile->>firstname, team_profile->>lastname')
      .eq('id', $memberData.id);

    if (error) {
      console.log(error);
    } else {
      holder = data[0]?.firstname + ' ' + data[0]?.lastname;
    }
  };

  const getAllStorage = async () => {
    await getPersonalStorage();
    await getTeamStorage();
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_write_records') permissions.writeRecords = true;
    if (item === 'inactive') isTeamInactive = true;
  });

  $: toItem, page, getTeamStorage();
</script>

{#await (getAllStorage(), getMemberData())}
  <RecordsSkeleton {permissions} />
{:then name}
  <div
    class={`flex flex-col w-full mb-20 md:mb-0 ${
      permissions.writeRecords ? 'h-[96%] pt-4' : 'h-full pt-0'
    }`}
  >
    {#if permissions.writeRecords}
      <TabGroup class="h-full">
        <TabList
          class="w-full flex justify-between pl-0 md:pl-20 border-b-2 border-neutral-700 pr-4 text-lg"
        >
          <div class="flex gap-8 w-full md:w-1/5">
            <Tab
              class={({ selected }) =>
                selected
                  ? 'text-white text-sm md:text-md font-semibold border-b-2 border-white pb-2 w-full md:w-1/4 h-full'
                  : 'text-white text-xs pb-2 w-full md:w-1/5 h-full'}
              >Personal</Tab
            >
            <Tab
              class={({ selected }) =>
                selected
                  ? 'text-white text-sm md:text-md font-semibold border-b-2 border-white pb-2 w-full md:w-1/4 h-full'
                  : 'text-white text-xs pb-2 w-full md:w-1/5 h-full'}>Team</Tab
            >
          </div>
        </TabList>
        <TabPanels class="h-full">
          <TabPanel class="flex h-full">
            <PersonalRecords {isTeamInactive} {holder} {getAllStorage} />
          </TabPanel>
          <TabPanel class="flex h-full">
            <TeamRecords
              {isTeamInactive}
              {holder}
              {getAllStorage}
              {maxPage}
              {page}
              {totalTeamRecords}
              {setPage}
              {toItem}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    {:else}
      <div class="flex h-full">
        <PersonalRecords {getAllStorage} {isTeamInactive} {holder} />
      </div>
    {/if}
  </div>
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-semibold">
        contact us!
      </a>
    </h1>
  </div>
{/await}
