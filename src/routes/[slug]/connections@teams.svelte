<script>
  import TableSkeleton from '@comp/skeleton/tableSkeleton.svelte';
  import supabase from '@lib/db';
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import { onMount } from 'svelte';

  let innerWidth;
  let asc = true;
  let sortedField = 'name';
  let searchQuery = '';

  const TABLE_HEADERS = [
    { name: 'Name', id: 'name' },
    { name: 'Job', id: 'job' },
    { name: 'Company', id: 'company' },
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
    { name: 'Name', id: 'name' },
    {
      name: 'Connected At',
      id: 'dateConnected',
    },
  ];

  // const useSortHandler = (col) => {
  //   asc = !asc;
  //   if (sortedField === col) {
  //     asc = !asc;
  //   } else {
  //     sortedField = col;
  //     asc = true;
  //   }
  // e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb
  //   const newArr = currentPageRows.sort((a, b) => {
  //     const nameA = a['metadata']['firstname'].toLowerCase();
  //     const nameB = b['metadata']['firstname'].toLowerCase();
  //     const jobA = a['metadata']['job'].toLowerCase();
  //     const jobB = b['metadata']['job'].toLowerCase();
  //     const companyA = a['metadata']['company'].toLowerCase();
  //     const companyB = b['metadata']['company'].toLowerCase();
  //     const dateA = a['dateConnected'].toLowerCase();
  //     const dateB = b['dateConnected'].toLowerCase();

  //     if (col === 'name')
  //       return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);

  //     if (col === 'job')
  //       return asc ? jobA.localeCompare(jobB) : jobB.localeCompare(jobA);

  //     if (col === 'company')
  //       return asc
  //         ? companyA.localeCompare(companyB)
  //         : companyB.localeCompare(companyA);

  //     if (col === 'date')
  //       return asc ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
  //   });

  //   currentPageRows = newArr;
  // };

  // const searchHandler = () => {
  //   const search = searchQuery.toLowerCase();
  //   const newArr = currentPageRows.filter((row) => {
  //     const name =
  //       row['connectedProfile']['metadata']['firstname'].toLowerCase();

  //     return name.includes(search);
  //   });

  //   search && newArr ? (currentPageRows = newArr) : currentPageRows;
  // };
  let currentPageRows = [2, 2, 2, 2, 2];
  let loading = false;
  let teamConnections = [];
  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const getTeamConnectionsList = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*, by(*)')
      .eq('team_id', teamId);

    if (error) console.log(error);
    if (data) {
      return data;
    }
  };

  const sortHandler = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('team_connection_acc')
      .select('*')
      .eq('team_id', teamId)
      // .filter('role_name', 'in', 'admin');
      // .match({ role_name: searchQuery });
      .order('dateConnected', { ascending: true });
    if (error) console.log(error);
    if (data) {
      console.log(data);
      return data;
    }
  };

  onMount(async () => {
    teamConnections = await getTeamConnectionsList();
    console.log(teamConnections);
    // await sortHandler();
  });
  // $: asc, sortHandler();
  // $: searchQuery, searchHandler();
  // $: currentPageRows, useSortHandler(sortedField);
</script>

<svelte:window bind:innerWidth />
<div class="flex flex-col">
  {#await getTeamConnectionsList()}
    <ConnectionsSkeletion />
  {:then}
    <div class="flex justify-end mt-6 gap-2">
      <input
        type="text"
        class="w-[400px] h-12 p-2 border-2 border-neutral-500 text-black bg-neutral-800"
        placeholder="Search name"
        bind:value={searchQuery}
      />
      <button class="p-2 bg-neutral-700 rounded-lg w-28">Search</button>
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
                        // asc = !asc;
                        // sortedField = item.id;
                        // useSortHandler(item.id);
                        console.log('clicked' + item.id);
                        await sortHandler();
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
        <tbody>
          {#if currentPageRows.length > 0}
            {#each teamConnections as connection, i}
              <tr
                class={`h-12 text-left py-6 px-4 mb-2 ${
                  i % 2 == 0 ? 'bg-neutral-400' : 'bg-neutral-700'
                }`}
              >
                <td
                  class="text-black font-bold text-ellipsis truncate pl-4 cursor-pointer flex-1"
                >
                  {connection.profileData.firstname ?? '-'}
                  {connection.profileData.lastname ?? '-'}
                </td>

                {#if innerWidth > 640}
                  <td class="flex-1 text-black truncate pl-4"
                    >{connection.profileData.job ?? '-'}</td
                  >
                  <td class="flex-1 text-black truncate pl-4">
                    {connection.profileData.company ?? '-'}
                  </td>
                {/if}

                <td class="flex-1 text-black truncate pl-4">
                  {new Date(connection.dateConnected).toDateString().slice(4) ??
                    '-'}
                </td>

                <td class="flex-1 text-black truncate pl-4 pr-4">
                  {connection.by.team_profile.firstname ?? '-'}
                  {connection.by.team_profile.lastname ?? '-'}
                </td>
              </tr>
            {/each}
          {:else if currentPageRows.length === 0}
            <h1 class="text-lg">
              <span class="text-black">0</span> contact
            </h1>
          {/if}
        </tbody>
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
