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
  import { memberData, user, userData } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getConnectionsRecords, getLogsRecords } from '@lib/query/getRecords';
  import { last30Days, today } from '@lib/utils/getDates';
  import Spinner from '@comp/loading/spinner.svelte';
  import { createEventDispatcher } from 'svelte';

  export let personalCsv, getPersonalStorage, isTeamInactive;

  const formatDate = (dateArg) => {
    const date = new Date(dateArg).getDate();
    const month = new Date(dateArg).getMonth() + 1;
    const year = new Date(dateArg).getFullYear();
    const formattedDate = `${date}${month < 10 ? '0' + month : month}${year}`;
    return formattedDate;
  };

  let teamId = Cookies.get('qubicTeamId');
  let fileName = formatDate(new Date());
  let selectedType = 'Activities';
  let fromDateValue = new Date();
  let toDateValue = new Date();
  let isLoading = false;
  let asc = false;

  const dispatch = createEventDispatcher();

  const fromDateOptions = {
    onChange: (selectedDates, dateStr, instance) => {
      const dateLimiter = new Date(
        new Date(selectedDates[0]).setDate(selectedDates[0].getDate() + 29)
      );

      toDateOptions.minDate = new Date(selectedDates[0]);
      toDateOptions.maxDate = new Date(dateLimiter);
      toDateValue = new Date(dateLimiter);
      fileName = `${formatDate(selectedDates[0])}-${formatDate(toDateValue)}`;
    },
    enableTime: false,
    // minDate: new Date(last30Days[0]),
    maxDate: new Date(fromDateValue),
  };

  let toDateOptions = {
    onChange: (selectedDates, dateStr, instance) => {
      fileName = `${formatDate(fromDateValue)}-${formatDate(selectedDates[0])}`;
    },
    enableTime: false,
    maxDate: new Date(),
    minDate: new Date(last30Days[0]),
  };

  const createRecordHandler = async () => {
    let logsCsv = [];
    let connectionsCsv = [];
    console.log(fileName);
    if (selectedType === 'Activities') {
      logsCsv = await getLogsRecords(
        'team_member',
        $memberData?.id,
        fromDateValue,
        toDateValue
      );
    } else {
      connectionsCsv = await getConnectionsRecords(
        'by',
        $memberData?.id,
        fromDateValue,
        toDateValue
      );
    }

    if (logsCsv.length !== 0 || connectionsCsv.length !== 0) {
      isLoading = true;
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
        if (
          (error.message =
            'duplicate key value violates unique constraint "bucketid_objname')
        ) {
          toastFailed(
            'File already exists. Please rename the file and try again.'
          );
        } else {
          toastFailed(error.message);
        }
        isLoading = false;
      }

      if (data) {
        toastSuccess(
          `${fileName}-${
            selectedType === 'Activities' ? 'activities' : 'connections'
          } created successfully`
        );
        await getPersonalStorage();
        isLoading = false;
      }

      fileName = formatDate(new Date());
      selectedType = 'Activities';
      toDateValue = new Date(today);
      fromDateValue = new Date(today);
      toDateOptions.maxDate = new Date(today);
      isLoading = false;
    } else {
      console.log('No records found');
    }
  };

  const sortHandler = async (col) => {
    const { data, error } = await supabase.storage
      .from('records')
      .list(`${teamId}/${$user?.id}`, {
        sortBy: { column: col, order: asc ? 'asc' : 'desc' },
      });

    if (error) {
      console.log(error);
    } else {
      personalCsv = data;
    }
  };

  const deleteFromTable = async (id) => {
    personalCsv = personalCsv.filter((item) => item.id !== id);
    dispatch('updated', personalCsv);
    await getPersonalStorage();
  };

  const selectTypeHandler = (e) => (selectedType = e.detail);
</script>

<div
  class="w-1/4 flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
>
  <div class="pl-20 pt-4 pr-4 flex flex-col gap-4">
    {#if $userData.includes('inactive')}
      <Input
        disabled={true}
        placeholder="Type"
        title="Type"
        bind:value={selectedType}
        isFilenameInput={true}
        isEmptyChecking={true}
      />
      <Input
        disabled={true}
        placeholder="From"
        title="From"
        bind:value={fileName}
        isFilenameInput={true}
        isEmptyChecking={true}
      />
      <Input
        disabled={true}
        placeholder="To"
        title="To"
        bind:value={fileName}
        isFilenameInput={true}
        isEmptyChecking={true}
      />
    {:else}
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
    {/if}
    <Input
      disabled={$userData.includes('inactive')}
      placeholder="Filename"
      title="Filename"
      bind:value={fileName}
      isFilenameInput={true}
      isEmptyChecking={true}
    />
    {#if fileName.length < 4}
      <small class="text-red-500">
        You must enter a filename with at least 4 characters.
      </small>
    {/if}
  </div>

  <button
    class="flex justify-center items-center h-16 gap-4 bg-blue-600 pl-20 p-3 disabled:bg-blue-600/60 disabled:cursor-default"
    disabled={fileName.includes('.') || fileName.length < 4
      ? true
      : false || $userData.includes('inactive')}
    on:click={async () => {
      if (selectedType === 'Choose Type') {
        toastFailed('Please select a type');
      } else {
        await createRecordHandler();
      }
    }}
  >
    {#if isLoading}
      <Spinner class="w-8 h-8" />
    {/if} <span>Create record -></span></button
  >
</div>
<div
  class="w-3/4 snap-container snap-x mx-auto h-full snap-mandatory flex flex-col overflow-x-auto mb-8"
>
  <table class="snap-center text-black w-full">
    <thead class="text-left text-neutral-400 bg-black/70">
      <tr>
        <TableHead
          class="w-1/6"
          data={recordsTable}
          on:sort={async (e) => {
            asc = !asc;
            await sortHandler(e.detail ?? 'name');
          }}
        />
      </tr>
    </thead>
    <tbody>
      {#if personalCsv}
        {#if personalCsv.length > 0}
          {#each personalCsv as record, i}
            <RecordsTableBody
              {record}
              {teamId}
              {deleteFromTable}
              {isTeamInactive}
            />
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
</div>

<style>
  .snap-container::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  .snap-container::-webkit-scrollbar-track {
    background-color: #e4e4e4;
  }
  .snap-container::-webkit-scrollbar-thumb {
    background-color: #71717a;
  }
</style>
