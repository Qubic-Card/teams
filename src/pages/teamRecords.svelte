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
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getConnectionsRecords, getLogsRecords } from '@lib/query/getRecords';
  import getDates, { last30Days, today } from '@lib/utils/getDates';
  import Spinner from '@comp/loading/spinner.svelte';

  export let teamCsv;

  let teamId = Cookies.get('qubicTeamId');
  let fileName = '';
  let selectedType = 'Choose Type';
  let isCreateRecord = false;
  let fromDateValue = new Date();
  let toDateValue = new Date();
  let isLoading = false;

  const fromDateOptions = {
    onChange: (selectedDates, dateStr, instance) => {
      const dateLimiter = getDates(
        new Date(
          new Date(selectedDates[0]).setDate(
            new Date(selectedDates[0]).getDate() - 29
          )
        ),
        new Date(selectedDates[0])
      );

      toDateOptions.maxDate = selectedDates[0];
      toDateOptions.minDate = new Date(dateLimiter[0]);
    },
    enableTime: false,
    maxDate: new Date(fromDateValue),
  };

  let toDateOptions = {
    enableTime: false,
    maxDate: new Date(),
    minDate: new Date(last30Days[0]),
  };

  const createRecordHandler = async () => {
    isLoading = true;
    const connectionsCsv = await getConnectionsRecords(
      'team_id',
      teamId,
      fromDateValue,
      toDateValue
    );
    const logsCsv = await getLogsRecords(
      'team',
      teamId,
      fromDateValue,
      toDateValue
    );

    const { data, error } = await supabase.storage
      .from('records')
      .upload(
        `${teamId}/${$user?.id}/${fileName}-${
          selectedType === 'Activities' ? 'activities' : 'connections'
        }`,
        selectedType === 'Activities' ? logsCsv : connectionsCsv,
        {
          contentType: 'text/csv',
        }
      );

    if (error) {
      console.log(error);
      toastFailed(error.message);
    }

    if (data) {
      // console.log(data);
      toastSuccess(
        `${fileName}-${
          selectedType === 'Activities' ? 'activities' : 'connections'
        } created successfully`
      );
      isLoading = false;
    }

    isCreateRecord = true;
    fileName = '';
    selectedType = 'Choose Type';
    toDateValue = new Date(today);
    fromDateValue = new Date(today);
    toDateOptions.maxDate = new Date(today);
    isLoading = false;
  };

  const getTeamStorage = async () => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {
        sortBy: { column: 'created_at', order: 'asc' },
      });

    if (error) {
      console.log(error);
    } else {
      // console.log(data);
      teamCsv = data;
    }
  };

  const deleteFromTable = (id) =>
    (teamCsv = teamCsv.filter((item) => item.id !== id));

  const selectTypeHandler = (e) => (selectedType = e.detail);

  $: if (isCreateRecord) isCreateRecord, getTeamStorage();
</script>

<div
  class="w-1/4 flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
>
  <div class="pl-20 pt-4 pr-4 flex flex-col gap-4">
    <RecordTypeDropdownButton on:select={selectTypeHandler} {selectedType} />

    <div class="flex flex-col gap-2">
      <p>From</p>
      <Flatpickr
        options={fromDateOptions}
        bind:value={fromDateValue}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer"
      />
    </div>
    <div class="flex flex-col gap-2">
      <p>To</p>
      <Flatpickr
        options={toDateOptions}
        bind:value={toDateValue}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer disabled:cursor-default"
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
    class="flex justify-center items-center h-16 gap-4 bg-blue-600 pl-20 p-3 disabled:bg-blue-600/60 disabled:cursor-default"
    disabled={fileName.includes('.') ||
    fileName.length < 4 ||
    selectedType === ''
      ? true
      : false}
    on:click={async () => await createRecordHandler()}
  >
    {#if isLoading}
      <Spinner class="w-8 h-8" />
    {/if} <span>Create record -></span></button
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
      {#if teamCsv}
        {#if teamCsv.length > 0}
          {#each teamCsv as record, i}
            <RecordsTableBody {record} {teamId} {deleteFromTable} />
          {/each}
        {:else}
          <tr>
            <td class="text-center text-xl pt-4 text-neutral-400" colspan="4">
              No records found
            </td>
          </tr>
        {/if}
      {/if}
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
