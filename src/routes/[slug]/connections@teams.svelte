<script>
  import supabase from '@lib/db';
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import ConnectionTableBody from '@comp/connectionTableBody.svelte';
  import { memberRights } from '@lib/stores/memberRightsStore';
  import { user } from '@lib/stores/userStore';
  import { onMount } from 'svelte';
  import { getProfileId, getTeamId } from '@lib/query/getId';

  let innerWidth;
  let asc = true;
  let searchQuery = '';

  const TABLE_HEADERS = [
    { name: 'Name', id: 'profileData->>firstname' },
    { name: 'Job', id: 'profileData->>job' },
    { name: 'Company', id: 'profileData->>company' },
    {
      name: 'Connected At',
      id: 'dateConnected',
    },
    {
      name: 'By',
      id: 'by',
    },
  ];

  const TABLE_HEADERS_MOBILE = [
    { name: 'Name', id: 'profileData->>firstname' },
    {
      name: 'Connected At',
      id: 'dateConnected',
    },
  ];

  // let currentPageRows = [2, 2, 2, 2, 2];
  let loading = false;
  let teamConnections = [];

  let isHasPermission = false;
  $: {
    $memberRights?.filter((item) => {
      if (item === 'allow_read_connections') isHasPermission = true;
    });

    console.log(isHasPermission);
  }

  const getTeamConnectionsList = async () => {
    let id = isHasPermission
      ? await getTeamId($user.id)
      : await getProfileId($user.id);
    console.log(id);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(isHasPermission ? 'team_id' : 'by', id)
      .order('dateConnected', { ascending: true });

    if (error) console.log(error);
    if (data) {
      teamConnections = data;
    }
  };

  const sortHandler = async (col = 'profileData->>firstname') => {
    let id = isHasPermission
      ? await getTeamId($user.id)
      : await getProfileId($user.id);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq('team_id', id)
      .order(col, { ascending: asc });

    if (error) console.log(error);
    if (data) {
      teamConnections = data;
      return data;
    }
  };

  const searchProfileHandler = async () => {
    loading = true;
    let id = isHasPermission
      ? await getTeamId($user.id)
      : await getProfileId($user.id);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(isHasPermission ? 'team_id' : 'by', id)
      // .textSearch('profileData->>firstname', `%${searchQuery}%`, {
      //   type: 'websearch',
      //   config: 'english',
      // });
      .ilike('profileData->>firstname', `%${searchQuery}%`);

    loading = false;
    if (error) console.log(error);
    if (data) {
      console.log(data);
      teamConnections = data;
      return data;
    }
  };
  // $: searchProfileHandler();
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col">
  {#await getTeamConnectionsList()}
    <ConnectionsSkeletion />
  {:then}
    <div class="flex justify-end items-center mt-6 gap-2">
      {#if loading}
        <Spinner class="w-10 h-10 mr-2" />
      {/if}
      <input
        type="text"
        class="w-[400px] h-12 p-2 border-2 border-neutral-500 text-white bg-neutral-800"
        placeholder="Search name"
        bind:value={searchQuery}
      />
      <button
        class="p-2 bg-neutral-700 rounded-lg w-28"
        on:click={async () => await searchProfileHandler()}>Search</button
      >
    </div>
    <div
      class="snap-container snap-x mx-auto snap-mandatory flex flex-row w-full overflow-x-auto mb-8"
    >
      <table class="snap-center text-black w-full mt-6">
        <thead class="text-left text-neutral-400">
          <tr>
            {#if innerWidth > 640}
              {#each TABLE_HEADERS as item}
                <th class=" pl-4 p-4 w-1/4 bg-neutral-900">
                  <div class="flex items-center">
                    <p>{item.name}</p>
                    <img
                      src="https://img.icons8.com/android/96/ffffff/sort.png"
                      alt=""
                      class="w-4 h-4 ml-2 cursor-pointer"
                      on:click={async () => {
                        asc = !asc;
                        await sortHandler(item.id);
                      }}
                    />
                  </div>
                </th>
              {/each}
            {:else}
              {#each TABLE_HEADERS_MOBILE as item}
                <th class=" pl-4 p-2 w-1/2">
                  <div class="flex justify-between">
                    <p>{item.name}</p>
                    <img
                      src="/sortIcon.svg"
                      alt=""
                      class="w-6 h-6 cursor-pointer hidden"
                      on:click={() => {
                        // asc = !asc;
                        // sortedField = item.id;
                        // useSortHandler(item.id);
                        console.log('clicked' + item.id);
                      }}
                    />
                  </div>
                </th>
              {/each}
            {/if}
          </tr>
        </thead>
        {#each teamConnections as connection, i}
          <ConnectionTableBody
            {innerWidth}
            {teamConnections}
            {connection}
            {i}
          />
        {/each}
      </table>
    </div>

    <!-- <div
  class="w-full flex justify-center items-center mt-4 p-4 font-bold bg-neutral-300 text-black"
>
  <h1>Upgrade Your Subscription</h1>
</div> -->

    <!-- <Pagination
  {subscriptionType}
  {currentPageRows}
  {totalPages}
  {active}
  {setPage}
  {page}
/> -->
  {:catch}
    <h1>Some error occurred. Please reload the page and try again.</h1>
  {/await}
</div>
