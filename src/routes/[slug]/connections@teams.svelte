<script>
  import supabase from '@lib/db';
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import ConnectionTableBody from '@comp/tables/connectionTableBody.svelte';
  import { memberData, userData } from '@lib/stores/userStore';
  import {
    connectionsTable,
    connectionsTableMobile,
    connectionSearchMenu,
  } from '@lib/constants';
  import Search from '@comp/search.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getContext } from 'svelte';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';

  const teamId = getContext('teamId');
  let innerWidth;
  let asc = false;
  let searchQuery = '';
  let searchNotFoundMsg = '';
  let loading = false;
  let permissions = {
    readConnection: false,
    writeConnection: false,
    isTeamInactive: false,
    will_expire: false,
  };
  let teamConnections = [];
  let userConnections = [];
  let selectedSearchMenu = { name: 'Name', col: 'profileData->>firstname' };
  let isLoading = false;
  let tabs = 'user';
  let maxPage = 0;
  let page = 0;
  let toItem = 15;
  let totalTeamData = 0;
  let totalUserData = 0;

  $: $userData?.filter((item) => {
    if (item === 'allow_read_connections') permissions.readConnection = true;
    if (item === 'allow_write_connections') permissions.writeConnection = true;
    if (item === 'inactive') permissions.isTeamInactive = true;
    if (item === 'will_expired') permissions.will_expire = true;
  });

  const setPage = (p) => (page = p);
  const selectMenu = (menu) => (selectedSearchMenu = menu.detail);
  const setTabs = (tab) => (tabs = tab);

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getTeamConnectionsList = async () => {
    loading = true;
    const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('team_connection_acc')
      .select(
        '*, by(team_profile->firstname, team_profile->lastname), team_id(*)',
        { count: 'estimated' }
      )
      .eq('team_id', teamId)
      .order('dateConnected', { ascending: false })
      .range(from, to)
      .ilike(selectedSearchMenu?.col, `%${searchQuery}%`)
      .order('dateConnected', { ascending: false });

    if (error) {
      loading = false;
      console.log(error);
    }
    if (data) {
      totalTeamData = count;
      teamConnections = data;
      maxPage = Math.ceil(count / toItem);
      loading = false;
    }
  };

  const getUserConnectionsList = async () => {
    loading = true;
    const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('team_connection_acc')
      .select('*, by(team_profile->firstname, team_profile->lastname)', {
        count: 'estimated',
      })
      .eq('by', $memberData?.id)
      .order('dateConnected', { ascending: false })
      .range(from, to)
      .ilike(selectedSearchMenu?.col, `%${searchQuery}%`)
      .order('dateConnected', { ascending: false });

    if (error) {
      loading = false;
      console.log(error);
    }
    if (data) {
      userConnections = data;
      totalUserData = count;
      maxPage = Math.ceil(count / toItem);
      loading = false;
    }
  };

  const sortHandler = async (col) => {
    // col = 'profileData->>firstname';
    let id;
    let column;

    tabs === 'all'
      ? (id = permissions.readConnection ? teamId : $memberData?.id)
      : (id = $memberData?.id);

    tabs === 'all'
      ? (column = permissions.readConnection ? 'team_id' : 'by')
      : (column = 'by');

    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(team_profile->firstname, team_profile->lastname)')
      .eq(column, id)
      .order(col, { ascending: asc });

    if (error) console.log(error);
    if (data) {
      tabs === 'all'
        ? permissions.readConnection
          ? (teamConnections = data)
          : (userConnections = data)
        : (userConnections = data);
    }
  };

  const deleteConnectionHandler = async (id, tab) => {
    isLoading = true;
    const { error } = await supabase
      .from('team_connection_acc')
      .delete()
      .match({ id: id });
    if (error) {
      toastFailed('Failed to delete connection');
      isLoading = false;
    } else {
      toastSuccess('Connection deleted');
      isLoading = false;
    }

    if (tab === 'team') {
      teamConnections = teamConnections.filter((item) => item.id !== id);
      isLoading = false;
    } else {
      userConnections = userConnections.filter((item) => item.id !== id);
      isLoading = false;
    }
  };

  $: if (searchQuery !== '') {
    page = 0;
    if (permissions.readConnection && tabs === 'all') {
      searchQuery, selectedSearchMenu, getTeamConnectionsList();
    } else if (permissions.readConnection && tabs === 'user') {
      searchQuery, selectedSearchMenu, getUserConnectionsList();
    } else {
      searchQuery, selectedSearchMenu, getUserConnectionsList();
    }
  } else {
    if (permissions.readConnection && tabs === 'all') {
      getTeamConnectionsList();
    } else if (permissions.readConnection && tabs === 'user') {
      getUserConnectionsList();
    } else {
      getUserConnectionsList();
    }
  }

  $: if (tabs === 'user') {
    toItem, page, getUserConnectionsList();
  } else toItem, page, getTeamConnectionsList();
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col md:pt-4 pl-12 md:pl-16">
  {#if permissions.readConnection === true}
    {#await getUserConnectionsList()}
      <ConnectionsSkeletion searchSkeletonVisible />
    {:then}
      <div
        class="flex md:flex-row flex-col justify-between items-center gap-4 border-b-2 border-neutral-700"
      >
        <div class="flex w-full md:w-48 text-white gap-1">
          <button
            class={`${
              tabs !== 'all' ? 'font-bold border-b-2 border-white' : ''
            } w-full md:w-1/2 h-16 text-xs md:text-sm`}
            on:click={async () => {
              setTabs('user');
              searchQuery = '';
              await getUserConnectionsList();
            }}
          >
            Personal
          </button>
          <button
            class={`${
              tabs === 'all' ? 'font-bold border-b-2 border-white' : ''
            } w-full md:w-1/2 h-16 text-xs md:text-sm`}
            on:click={async () => {
              setTabs('all');
              searchQuery = '';
              await getTeamConnectionsList();
            }}
          >
            Team
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
      {#if loading}
        <ConnectionsSkeletion
          items={tabs === 'all'
            ? teamConnections.length
            : userConnections.length}
        />
      {:else}
        <div
          class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
        >
          <table class="snap-center text-black w-full">
            <thead class="text-left text-neutral-400 bg-black/60">
              <tr>
                {#if innerWidth > 640}
                  <TableHead
                    class="w-1/6"
                    data={connectionsTable}
                    on:sort={async (e) => {
                      if (
                        teamConnections.length > 1 ||
                        userConnections.length > 1
                      ) {
                        asc = !asc;
                        await sortHandler(e.detail);
                      }
                    }}
                  />
                {:else}
                  <TableHead
                    class="w-1/4"
                    data={connectionsTableMobile}
                    on:sort={async (e) => {
                      if (
                        teamConnections.length > 1 ||
                        userConnections.length > 1
                      ) {
                        asc = !asc;
                        await sortHandler(e.detail);
                      }
                    }}
                  />
                {/if}
              </tr>
            </thead>
            {#if teamConnections.length > 0 || userConnections.length > 0}
              <tbody>
                {#if tabs === 'all'}
                  {#each teamConnections as connection, i}
                    <ConnectionTableBody
                      {permissions}
                      {innerWidth}
                      {connection}
                      tab="team"
                      deleteHandler={deleteConnectionHandler}
                    />
                  {/each}
                {:else}
                  {#each userConnections as connection, i}
                    <ConnectionTableBody
                      {permissions}
                      {innerWidth}
                      {connection}
                      tab="user"
                      deleteHandler={deleteConnectionHandler}
                    />
                  {/each}
                {/if}
              </tbody>
            {/if}
          </table>

          {#if searchNotFoundMsg !== ''}
            <h1
              class="text-sm md:text-xl font-bold text-white text-center w-full mt-8"
            >
              {searchNotFoundMsg}
            </h1>
          {:else if tabs === 'all' && teamConnections.length === 0}
            <h1
              class="text-sm md:text-xl font-bold text-white text-center w-full mt-8"
            >
              No connection found.
            </h1>
          {:else if tabs !== 'all' && userConnections.length === 0}
            <h1
              class="text-sm md:text-xl font-bold text-white text-center w-full mt-8"
            >
              No connection found.
            </h1>
          {/if}
          {#if tabs === 'all'}
            {#if totalTeamData > toItem}
              <PaginationButton {setPage} {page} {maxPage} />
            {/if}
          {:else if tabs === 'user' && totalUserData > toItem}
            <PaginationButton {setPage} {page} {maxPage} />
          {/if}
        </div>
      {/if}
    {:catch}
      <div>
        <h1 class="text-xl text-white text-center w-full mt-8">
          Some error occurred. Please reload the page and try again <br /> or
          <a href="https://wa.me/628113087599" class="font-bold">
            contact us!
          </a>
        </h1>
      </div>
    {/await}
  {:else}
    {#await getUserConnectionsList()}
      <ConnectionsSkeletion searchSkeletonVisible />
    {:then}
      <div class="flex justify-end items-center mt-1 gap-2">
        <Search
          searchMenu={connectionSearchMenu}
          {loading}
          class="top-40 md:top-24 right-7"
          bind:value={searchQuery}
          on:select={selectMenu}
          label={selectedSearchMenu?.name}
        />
      </div>
      {#if loading}
        <ConnectionsSkeletion items={userConnections.length} />
      {:else}
        <div
          class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
        >
          <table class="snap-center text-black w-full">
            <thead class="text-left text-neutral-400 bg-black/70">
              <tr>
                {#if innerWidth > 640}
                  <TableHead
                    class="w-1/6"
                    data={connectionsTable}
                    on:sort={async (e) => {
                      if (userConnections.length > 1) {
                        asc = !asc;
                        await sortHandler(e.detail);
                      }
                    }}
                  />
                {:else}
                  <TableHead
                    class="w-1/4"
                    data={connectionsTable}
                    on:sort={async (e) => {
                      if (userConnections.length > 1) {
                        asc = !asc;
                        await sortHandler(e.detail);
                      }
                    }}
                  />
                {/if}
              </tr>
            </thead>
            <tbody>
              {#each userConnections as connection, i}
                <ConnectionTableBody
                  {permissions}
                  {innerWidth}
                  {connection}
                  tab="user"
                  deleteHandler={deleteConnectionHandler}
                />
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

          {#if totalUserData > toItem}
            <PaginationButton {setPage} {page} {maxPage} />
          {/if}
        </div>
      {/if}
    {:catch}
      <div>
        <h1 class="text-xl text-white text-center w-full mt-8">
          Some error occurred. Please reload the page and try again <br /> or
          <a href="https://wa.me/628113087599" class="font-bold">
            contact us!
          </a>
        </h1>
      </div>
    {/await}
  {/if}
</div>
