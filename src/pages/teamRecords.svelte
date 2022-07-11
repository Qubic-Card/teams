<script>
  import Cookies from 'js-cookie';
  import Input from '@comp/input.svelte';
  import { recordsTable } from '@lib/constants';
  import RecordsTableBody from '@comp/tables/recordsTableBody.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import RecordTypeDropdownButton from '@comp/buttons/recordTypeDropdownButton.svelte';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import { last30Days, last60Days } from '@lib/utils/getDates';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { getMemberId } from '@lib/query/getId';
  import { onMount } from 'svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getConnectionsRecords, getLogsRecords } from '@lib/query/getRecords';

  let fromDatevalue = new Date();
  let toDatevalue = new Date();

  const options = {
    // element: '#my-picker',
    enableTime: false,
    // onChange(selectedDates, dateStr) {
    //   console.log('flatpickr hook', selectedDates, dateStr);
    // },
    // mode: 'range',
    // minDate: new Date(last30Days[0]),
    maxDate: new Date(),
  };

  export let records;

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;

  let type = '';
  let fileName = '';
  let selectedType = '';
  let fromDate = '';
  let toDate = '';
  let personalConnectionsCsv = [];
  let isCreateRecord = false;

  const createRecordHandler = async () => {
    const connectionsCsv = await getConnectionsRecords('team_id', teamId);
    const logsCsv = await getLogsRecords('team', teamId);

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
    // toDatevalue = new Date();
    // fromDatevalue = new Date();
  };

  const getPersonalStorage = async () => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {
        // limit: 100,
        // offset: 0,
        // sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.log(error);
    } else {
      personalConnectionsCsv = data;
      // console.log(data);
    }
  };

  const deleteFromTable = (id) =>
    (personalConnectionsCsv = personalConnectionsCsv.filter(
      (item) => item.id !== id
    ));

  const selectTypeHandler = (e) => (selectedType = e.detail);

  // const createRecordHandler = () => {
  //   console.log('createRecordHandler', fileName);
  //   console.log(selectedType);
  //   console.log(fromDatevalue);
  //   console.log(toDatevalue);
  // };
  // $: console.log(toDatevalue);
  // onMount(async () => {
  //   await getPersonalStorage();
  // });
  $: isCreateRecord, getPersonalStorage();
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
