<script>
  import Cookies from 'js-cookie';
  import Input from '@comp/input.svelte';
  import { recordsTable } from '@lib/constants';
  import RecordsTableBody from '@comp/tables/recordsTableBody.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import RecordTypeDropdownButton from '@comp/buttons/recordTypeDropdownButton.svelte';
  import { last30Days } from '@lib/utils/getDates';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';

  export let records;
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

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;

  let type = '';
  let fileName = '';
  let selectedType = '';
  let fromDate = '';
  let toDate = '';

  const selectTypeHandler = (e) => {
    selectedType = e.detail;
  };

  const createRecordHandler = () => {
    console.log('createRecordHandler', fileName);
    console.log(selectedType);
    console.log(fromDatevalue);
    console.log(toDatevalue);
  };
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
  <button class="bg-blue-600 pl-20 p-3"> Create record -></button>
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
      {#each records as record, i}
        <RecordsTableBody {record} />
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
