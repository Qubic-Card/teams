<script>
  import Cookies from 'js-cookie';
  import Input from '@comp/input.svelte';
  import { recordsTable } from '@lib/constants';
  import RecordsTableBody from '@comp/tables/recordsTableBody.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import RecordTypeDropdownButton from '@comp/buttons/recordTypeDropdownButton.svelte';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import { last30Days } from '@lib/utils/getDates';

  let value;
  let formattedValue;

  const options = {
    element: '#my-picker',
    enableTime: false,
    onChange(selectedDates, dateStr) {
      console.log('flatpickr hook', selectedDates, dateStr);
    },
    // mode: 'range',
    // minDate: new Date(last30Days[0]),
    // maxDate: new Date(),
  };

  export let records;

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;

  let type = '';
  let fileName = '';
  let selectedType = '';

  const selectTypeHandler = (e) => {
    selectedType = e.detail;
  };

  const createRecordHandler = () => {
    console.log('createRecordHandler', fileName, selectedType);
  };
</script>

<div
  class="w-1/4 flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
>
  <div class="pl-20 pt-4 pr-4 flex flex-col gap-4">
    <h1>PERSONAL</h1>

    <RecordTypeDropdownButton on:select={selectTypeHandler} />
    <Flatpickr {options} bind:value element="#my-picker">
      <div id="my-picker">
        <input
          type="text"
          placeholder="Select Date..."
          data-input
          class="text-white placeholder:text-neutral-300 bg-neutral-700 p-2 mr-2 w-full rounded-md"
        />
      </div>
    </Flatpickr>
    <!-- <Flatpickr {options} bind:value element="#my-picker">
      <div class="flatpickr" id="my-picker">
        <input
          type="text"
          placeholder="Select Date..."
          data-input
          class="text-white placeholder:text-neutral-300 bg-neutral-700 p-2 mr-2 w-full rounded-md"
        />
      </div>
    </Flatpickr> -->
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
    disabled={fileName.includes('.') || fileName === '' ? true : false}
    on:click={createRecordHandler}
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
