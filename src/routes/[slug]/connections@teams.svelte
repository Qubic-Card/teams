<script>
  import supabase from '@lib/db';
  import Spinner from '@comp/loading/spinner.svelte';
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import ConnectionTableBody from '@comp/connectionTableBody.svelte';
  import { user, userData } from '@lib/stores/userStore';
  import { getMemberId, getTeamId } from '@lib/query/getId';
  import { Menu, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import Cookies from 'js-cookie';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';
  import {
    connectionSearchMenu,
    connectionsTable,
    connectionsTableMobile,
  } from '@lib/constants';

  let teamId = Cookies.get('qubicTeamId');
  let innerWidth;
  let asc = true;
  let searchQuery = '';
  let searchNotFoundMsg = '';

  // let currentPageRows = [2, 2, 2, 2, 2];
  let loading = false;
  let teamConnections = [];
  let userConnections = [];
  let selectedSearchMenu = null;
  let isHasPermission = false;

  $: $userData?.filter((item) => {
    if (item === 'allow_read_connections') isHasPermission = true;
  });

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
    console.log(id);
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

  const sortHandler = async (col = 'profileData->>firstname') => {
    let id = isHasPermission ? teamId : await getMemberId($user?.id, teamId);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(isHasPermission ? 'team_id' : 'by', id)
      .order(col, { ascending: asc });
    console.log(id);
    if (error) console.log(error);
    if (data) {
      isHasPermission ? (teamConnections = data) : (userConnections = data);
    }
  };

  const searchProfileHandler = async () => {
    loading = true;
    let id = isHasPermission ? teamId : await getMemberId($user?.id, teamId);
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq(isHasPermission ? 'team_id' : 'by', id)
      .ilike(
        selectedSearchMenu ? selectedSearchMenu.col : 'profileData->>firstname',
        `%${searchQuery}%`
      );

    loading = false;
    if (error) console.log(error);
    if (data) {
      console.log(data);
      isHasPermission ? (teamConnections = data) : (userConnections = data);
      if (data.length === 0) {
        searchNotFoundMsg = '0 results found. Please try again.';
      } else {
        searchNotFoundMsg = '';
      }
      return data;
    }
  };

  $: searchQuery, selectedSearchMenu, searchProfileHandler();
  const selectMenu = (menu) => (selectedSearchMenu = menu);
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col">
  {#if isHasPermission === true}
    {#await getTeamConnectionsList()}
      <ConnectionsSkeletion />
    {:then}
      <div class="flex justify-end items-center mt-6 gap-2">
        {#if loading}
          <Spinner class="w-10 h-10 mr-2" />
        {/if}
        <input
          type="text"
          class="w-full md:w-[400px] h-12 p-2 border-2 border-neutral-500 text-white bg-neutral-800"
          placeholder="Search"
          bind:value={searchQuery}
        />
        <Menu as="div" class="mx-2" let:open>
          <DropdownButton
            class="w-28"
            label={selectedSearchMenu ? selectedSearchMenu.name : 'Name'}
          />
          {#if open}
            <div transition:slide|local={{ duration: 500 }}>
              <MenuItems
                class="top-24 right-7 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40"
              >
                {#each connectionSearchMenu as item}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                    on:click={() => selectMenu(item)}
                  >
                    {item.name}
                  </MenuItem>
                {/each}
              </MenuItems>
            </div>
          {/if}
        </Menu>
      </div>
      <div
        class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
      >
        <table class="snap-center text-black w-full mt-6">
          <thead class="text-left text-neutral-400">
            <tr>
              {#if innerWidth > 640}
                {#each connectionsTable as item}
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
                {#each connectionsTableMobile as item}
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
          {#if teamConnections.length > 0}
            <tbody>
              {#each teamConnections as connection, i}
                <ConnectionTableBody {innerWidth} {connection} {i} />
              {/each}
            </tbody>
          {/if}
        </table>
        {#if searchNotFoundMsg !== ''}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            {searchNotFoundMsg}
          </h1>
        {:else if teamConnections.length === 0}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            0 connection.
          </h1>
        {/if}
      </div>
    {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await}
  {:else if isHasPermission === false}
    {#await getUserConnectionsList()}
      <ConnectionsSkeletion />
    {:then}
      <div class="flex justify-end items-center mt-6 gap-2">
        {#if loading}
          <Spinner class="w-10 h-10 mr-2" />
        {/if}
        <input
          type="text"
          class="w-full md:w-[400px] h-12 p-2 border-2 border-neutral-500 text-white bg-neutral-800"
          placeholder="Search"
          bind:value={searchQuery}
        />
        <Menu as="div" class="mx-2" let:open>
          <DropdownButton
            class="w-28"
            label={selectedSearchMenu ? selectedSearchMenu.name : 'Name'}
          />
          {#if open}
            <div transition:slide|local={{ duration: 500 }}>
              <MenuItems
                class="top-24 right-7 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-40"
              >
                {#each connectionSearchMenu as item}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                    on:click={() => selectMenu(item)}
                  >
                    {item.name}
                  </MenuItem>
                {/each}
              </MenuItems>
            </div>
          {/if}
        </Menu>
      </div>
      <div
        class="snap-container snap-x mx-auto snap-mandatory flex flex-col w-full overflow-x-auto mb-8"
      >
        <table class="snap-center text-black w-full mt-6">
          <thead class="text-left text-neutral-400">
            <tr>
              {#if innerWidth > 640}
                {#each connectionsTable as item}
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
                {#each connectionsTableMobile as item}
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
            0 connection.
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
