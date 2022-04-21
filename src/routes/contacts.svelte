<script>
  // export let currentPageRows;
  // export let totalPages;
  // export let page;
  // export let active;
  // export let setPage;
  // export let loading;

  let innerWidth;
  let subscriptionType = 'basic';
  let asc = true;
  let sortedField = 'name';
  let searchQuery = '';

  const TABLE_HEADERS = [
    { name: 'Name', id: 'name' },
    { name: 'Job', id: 'job' },
    { name: 'Company', id: 'company' },
    {
      name: 'Connected At',
      id: 'date',
    },
  ];

  const TABLE_HEADERS_MOBILE = [
    { name: 'Name', id: 'name' },
    {
      name: 'Connected At',
      id: 'date',
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
  // $: searchQuery, searchHandler();
  // $: currentPageRows, useSortHandler(sortedField);
</script>

<svelte:window bind:innerWidth />
<div class="justify-end mt-6">
  <input
    type="text"
    class="w-[500px] h-12 p-2 border-2 border-grey-800 text-black"
    placeholder="Search name"
    bind:value={searchQuery}
  />
</div>
<div
  class="snap-container snap-x mx-auto snap-mandatory flex flex-row w-full overflow-x-auto mb-8"
>
  <table class="snap-center text-black w-full mt-6">
    <thead class="text-left text-neutral-400">
      <tr>
        {#if innerWidth > 640}
          {#each TABLE_HEADERS as item}
            <th class=" pl-4 p-2 w-1/4">
              <div class="flex justify-between">
                <p>{item.name}</p>
                <img
                  src="/sortIcon.svg"
                  alt=""
                  class="w-6 h-6 cursor-pointer hidden"
                  on:click={() => {
                    asc = !asc;
                    sortedField = item.id;
                    // useSortHandler(item.id);
                  }}
                />
              </div>
            </th>
          {/each}
        {:else}
          {#each TABLE_HEADERS_MOBILE as item}
            <th class=" pl-4 p-2 w-1/4">
              <div class="flex justify-between">
                <p>{item.name}</p>
                <img
                  src="/sortIcon.svg"
                  alt=""
                  class="w-6 h-6 cursor-pointer hidden"
                  on:click={() => {
                    asc = !asc;
                    sortedField = item.id;
                    // useSortHandler(item.id);
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
        {#each currentPageRows as connection, i}
          <tr
            class={`h-12 text-left py-6 px-4 mb-2 ${
              i % 2 == 0 ? 'bg-neutral-100' : 'bg-white'
            }`}
          >
            <td
              class="text-black font-bold text-ellipsis truncate pl-4 cursor-pointer flex-1"
            >
              edfdsf
            </td>

            {#if innerWidth > 640}
              <td class="flex-1 text-gray-500 truncate pl-4"
                >{'sfdasfas' ?? '-'}</td
              >
              <td class="flex-1 text-gray-500 truncate pl-4">
                {'fasf' ?? '-'}
              </td>
            {/if}

            <td class="flex-1 text-gray-500 truncate pl-4">
              {new Date().toDateString().slice(4) ?? '-'}
            </td>
          </tr>
        {/each}
      {:else if loading}
        <!-- <TableSkeleton colLength={4} /> -->
        <div>Loading...</div>
      {:else if currentPageRows.length === 0}
        <h1 class="text-lg">
          <span class="text-gray-600">{currentPageRows.length}</span> contact
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
