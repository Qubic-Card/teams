<script>
  import supabase from '@lib/db';
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import ConnectionTableBody from '@comp/connectionTableBody.svelte';
  import { user, userData } from '@lib/stores/userStore';
  import { getMemberId } from '@lib/query/getId';
  import Cookies from 'js-cookie';
  import {
    connectionsTable,
    connectionsTableMobile,
    connectionSearchMenu,
  } from '@lib/constants';
  import Search from '@comp/search.svelte';
  import ConnectionTableHead from '@comp/connectionTableHead.svelte';

  let teamId = Cookies.get('qubicTeamId');
  let innerWidth;
  let asc = true;
  let searchQuery = '';
  let searchNotFoundMsg = '';

  // let currentPageRows = [2, 2, 2, 2, 2];
  let loading = false;
  let isHasPermission = false;
  let teamConnections = [];
  let userConnections = [];
  let selectedSearchMenu = null;

  let tabs = 'all';

  $: $userData?.filter((item) => {
    if (item === 'allow_read_connections') isHasPermission = true;
  });

  const setTabs = (tab) => (tabs = tab);

  const getTeamConnectionsList = async () => {
    // let id = isHasPermission ? teamId : await getMemberId($user?.id, teamId);
    let id = teamId;

    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq('team_id', id)
      .order('dateConnected', { ascending: true });

    if (error) console.log(error);
    if (data) {
      // isHasPermission ? (teamConnections = data) : (userConnections = data);
      teamConnections = data;
    }
  };

  const getUserConnectionsList = async () => {
    let id = await getMemberId($user?.id, teamId);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq('by', id)
      .order('dateConnected', { ascending: true });

    if (error) console.log(error);
    if (data) {
      userConnections = data;
    }
  };

  const sortHandler = async (col) => {
    // col = 'profileData->>firstname';
    let id;
    let column;

    tabs === 'all'
      ? (id = isHasPermission ? teamId : await getMemberId($user?.id, teamId))
      : (id = await getMemberId($user?.id, teamId));

    tabs === 'all'
      ? (column = isHasPermission ? 'team_id' : 'by')
      : (column = 'by');

    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(column, id)
      .order(col, { ascending: asc });
    console.log(id);
    if (error) console.log(error);
    if (data) {
      tabs === 'all'
        ? isHasPermission
          ? (teamConnections = data)
          : (userConnections = data)
        : (userConnections = data);
    }
  };

  const searchProfileHandler = async () => {
    loading = true;

    let id;
    let col;

    tabs === 'all'
      ? (id = isHasPermission ? teamId : await getMemberId($user?.id, teamId))
      : (id = await getMemberId($user?.id, teamId));

    tabs === 'all' ? (col = isHasPermission ? 'team_id' : 'by') : (col = 'by');

    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(col, id)
      .ilike(
        selectedSearchMenu ? selectedSearchMenu.col : 'profileData->>firstname',
        `%${searchQuery}%`
      );

    loading = false;
    if (error) console.log(error);
    if (data) {
      tabs === 'all'
        ? isHasPermission
          ? (teamConnections = data)
          : (userConnections = data)
        : (userConnections = data);

      data.length === 0
        ? (searchNotFoundMsg = 'No connection found.')
        : (searchNotFoundMsg = '');

      return data;
    }
  };

  $: searchQuery !== ''
    ? (searchQuery, selectedSearchMenu, searchProfileHandler())
    : (searchQuery, searchProfileHandler());

  const selectMenu = (menu) => (selectedSearchMenu = menu.detail);
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col">
  {#if isHasPermission === true}
    {#await getTeamConnectionsList()}
      <ConnectionsSkeletion />
    {:then}
      <div
        class="flex md:flex-row flex-col justify-between items-center mt-2 gap-4"
      >
        <div
          class="flex justify-between border-2 border-neutral-700 p-2 w-full md:w-64 text-white gap-1"
        >
          <button
            class={`${
              tabs === 'all' ? 'bg-white text-black' : ''
            } p-2 w-full md:w-1/3`}
            on:click={async () => {
              await getTeamConnectionsList();
              setTabs('all');
              searchQuery = '';
            }}
          >
            All
          </button>
          <button
            class={`${tabs !== 'all' ? 'bg-white text-black' : ''} p-2 w-full`}
            on:click={async () => {
              await getUserConnectionsList();
              setTabs('user');
              searchQuery = '';
            }}
          >
            My connections
          </button>
        </div>
        <Search
          searchMenu={connectionSearchMenu}
          {loading}
          class="top-40 md:top-24 right-7"
          bind:value={searchQuery}
          on:select={selectMenu}
          label={selectedSearchMenu?.name}
        />
      </div>
      <div
        class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
      >
        <table class="snap-center text-black w-full mt-6">
          <thead class="text-left text-neutral-400">
            <tr>
              {#if innerWidth > 640}
                <ConnectionTableHead
                  class="w-1/5"
                  data={connectionsTable}
                  on:sort={async (e) => {
                    asc = !asc;
                    await sortHandler(e.detail ?? 'profileData->>firstname');
                  }}
                />
              {:else}
                <ConnectionTableHead
                  class="w-1/4"
                  data={connectionsTableMobile}
                  on:sort={async (e) => {
                    asc = !asc;
                    await sortHandler(e.detail ?? 'profileData->>firstname');
                  }}
                />
              {/if}
            </tr>
          </thead>
          {#if teamConnections.length > 0}
            <tbody>
              {#if tabs === 'all'}
                {#each teamConnections as connection, i}
                  <ConnectionTableBody {innerWidth} {connection} {i} />
                {/each}
              {:else}
                {#each userConnections as connection, i}
                  <ConnectionTableBody {innerWidth} {connection} {i} />
                {/each}
              {/if}
            </tbody>
          {/if}
        </table>
        {#if searchNotFoundMsg !== ''}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            {searchNotFoundMsg}
          </h1>
        {:else if teamConnections.length === 0}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            No connection found.
          </h1>
        {/if}
      </div>
    {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await}
  {:else}
    {#await getUserConnectionsList()}
      <ConnectionsSkeletion />
    {:then}
      <div class="flex justify-end items-center mt-6 gap-2">
        <Search
          searchMenu={connectionSearchMenu}
          {loading}
          class="top-40 md:top-24 right-7"
          bind:value={searchQuery}
          on:select={selectMenu}
          label={selectedSearchMenu?.name}
        />
      </div>
      <div
        class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
      >
        <table class="snap-center text-black w-full mt-6">
          <thead class="text-left text-neutral-400">
            <tr>
              {#if innerWidth > 640}
                <ConnectionTableHead
                  class="w-1/5"
                  data={connectionsTable}
                  on:sort={async (e) => {
                    asc = !asc;
                    await sortHandler(e.detail ?? 'profileData->>firstname');
                  }}
                />
              {:else}
                <ConnectionTableHead
                  class="w-1/4"
                  data={connectionsTable}
                  on:sort={async (e) => {
                    asc = !asc;
                    await sortHandler(e.detail ?? 'profileData->>firstname');
                  }}
                />
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each userConnections as connection, i}
              <ConnectionTableBody {innerWidth} {connection} {i} />
            {/each}
          </tbody>
        </table>
        {#if searchNotFoundMsg !== ''}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            {searchNotFoundMsg}
          </h1>
        {:else if userConnections.length === 0}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            No connection found.
          </h1>
        {/if}
      </div>
    {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await}
  {/if}
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
