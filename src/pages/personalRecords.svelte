<script>
  import Cookies from 'js-cookie';
  import Input from '@comp/input.svelte';
  import { recordsTable } from '@lib/constants';
  import RecordsTableBody from '@comp/tables/recordsTableBody.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import RecordTypeDropdownButton from '@comp/buttons/recordTypeDropdownButton.svelte';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { getMemberId } from '@lib/query/getId';
  import { onMount } from 'svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getConnectionsRecords, getLogsRecords } from '@lib/query/getRecords';
  import getDates from '@lib/utils/getDates';

  export let personalConnectionsCsv;

  let fromDatevalue = new Date();
  let toDatevalue = new Date();
  let last60Days;

  $: last60Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 59)),
    fromDatevalue
  );

  let isDenied = false;
  const options = {
    // element: '#my-picker',
    enableTime: false,
    onChange() {
      let formattedDate = new Date(fromDatevalue[0]).toDateString().slice(4);

      // console.log('selectedDates', formattedDate);
      // console.log('last60Days', last60Days[0]);
      if (formattedDate === last60Days[0]) {
        isDenied = true;
      }
    },
    // mode: 'range',
    // minDate: new Date(last30Days[0]),
    maxDate: new Date(),
  };

  // $: console.log(toDatevalue);
  $: console.log(isDenied);
  $: console.log(fromDatevalue);
  $: console.log(last60Days[0]);

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;

  let type = '';
  let fileName = '';
  let selectedType = '';
  let fromDate = '';
  let toDate = '';
  // let personalConnectionsCsv = [];
  let isCreateRecord = false;

  const createRecordHandler = async () => {
    let id = await getMemberId($user?.id, teamId);
    const connectionsCsv = await getConnectionsRecords('by', id);
    const logsCsv = await getLogsRecords('team_member', id);

    const { data } = await supabase.storage
      .from('records')
      .upload(
        `${teamId}/${$user?.id}/${fileName}-${
          selectedType === 'Logs' ? 'logs' : 'connections'
        }`,
        selectedType === 'Logs' ? logsCsv : connectionsCsv,
        {
          contentType: 'text/csv',
        }
      );

    isCreateRecord = true;
    fileName = '';
    selectedType = '';
    // toDatevalue = new Date();
    // fromDatevalue = new Date();
  };

  const getPersonalStorage = async () => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {});

    if (error) {
      console.log(error);
    } else {
      personalConnectionsCsv = data;
    }
  };

  const deleteFromTable = (id) =>
    (personalConnectionsCsv = personalConnectionsCsv.filter(
      (item) => item.id !== id
    ));

  const selectTypeHandler = (e) => (selectedType = e.detail);
  // onMount(async () => {
  //   let id = await getMemberId($user?.id, teamId);
  //   const connectionsCsv = await getConnectionsRecords('by', id);
  //   console.log(connectionsCsv);
  // });
  $: if (isCreateRecord) isCreateRecord, getPersonalStorage();
</script>

<div
  class="w-1/4 flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
>
  <div class="pl-20 pt-4 pr-4 flex flex-col gap-4">
    <RecordTypeDropdownButton on:select={selectTypeHandler} />

    <div class="flex flex-col gap-2">
      <p>From</p>
      <Flatpickr
        {options}
        bind:value={fromDatevalue}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2"
      />
    </div>
    <div class="flex flex-col gap-2">
      <p>To</p>
      <Flatpickr
        {options}
        bind:value={toDatevalue}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2"
      />
    </div>
    <Input
      placeholder="Filename"
      title="Filename"
      bind:value={fileName}
      isFilenameInput={true}
      isEmptyChecking={true}
    />
  </div>
  <button
    class="bg-blue-600 pl-20 p-3 disabled:bg-blue-600/60 disabled:cursor-default"
    disabled={fileName.includes('.') ||
    fileName.length < 4 ||
    selectedType === ''
      ? true
      : false}
    on:click={async () => await createRecordHandler()}
  >
    Create record -></button
  >
</div>
<div
  class="w-3/4 snap-container snap-x mx-auto snap-mandatory flex flex-col overflow-x-auto mb-8"
>
  <table class="snap-center text-black w-full">
    <thead class="text-left text-neutral-400 bg-black/70">
      <tr>
        <TableHead
          class="w-1/4"
          data={recordsTable}
          on:sort={async (e) => {
            // asc = !asc;
            // await sortHandler(
            //   e.detail ?? 'profileData->>firstname'
            // );
          }}
        />
      </tr>
    </thead>
    <tbody>
      {#each personalConnectionsCsv as record, i}
        <RecordsTableBody {record} {teamId} {deleteFromTable} />
      {/each}
    </tbody>
  </table>
  <!-- {#if searchNotFoundMsg !== ''}
              <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
                {searchNotFoundMsg}
              </h1>
            {:else if userConnections.length === 0}
              <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
                No connection found.
              </h1>
            {/if} -->
</div>
