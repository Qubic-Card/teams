<script>
  import ConnectionsSkeletion from '@comp/skeleton/connectionsSkeleton.svelte';
  import Input from '@comp/input.svelte';
  import { recordsTableTeam, recordsTableTeamMobile } from '@lib/constants';
  import RecordsTableBody from '@comp/tables/recordsTableBody.svelte';
  import TableHead from '@comp/tables/tableHead.svelte';
  import RecordTypeDropdownButton from '@comp/buttons/recordTypeDropdownButton.svelte';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getConnectionsRecords, getLogsRecords } from '@lib/query/getRecords';
  import { formatDate, last30Days, today } from '@lib/utils/getDates';
  import Spinner from '@comp/loading/spinner.svelte';
  import sortBy from '@lib/utils/sortBy';
  import { personal, team } from '@lib/stores/recordsStore';
  import { getContext } from 'svelte';
  import PaginationButton from '@comp/buttons/paginationButton.svelte';

  export let holder,
    getAllStorage,
    maxPage,
    setPage,
    page,
    totalTeamRecords,
    toItem,
    loading;

  const teamId = getContext('teamId');
  let fileName = `${formatDate(new Date())}-${formatDate(new Date())}`;
  let selectedType = 'Activities';
  let fromDateValue = new Date();
  let toDateValue = new Date();
  let isLoading = false;
  let asc = false;
  let innerWidth;

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

  const createTeamStorage = async (url) => {
    const { data, error } = await supabase.from('team_storage').insert(
      {
        tid: teamId,
        by: holder,
        type: selectedType,
        storage_url: url,
        filename: `${fileName}-${
          selectedType === 'Activities' ? 'activities' : 'connections'
        }`,
      },
      { returning: 'minimal' }
    );

    if (error) console.log(error);
  };

  const createRecordHandler = async () => {
    let logsCsv = [];
    let connectionsCsv = [];

    if (selectedType === 'Activities') {
      logsCsv = await getLogsRecords(
        'team',
        teamId,
        fromDateValue,
        toDateValue
      );
    } else {
      connectionsCsv = await getConnectionsRecords(
        'team_id',
        teamId,
        fromDateValue,
        toDateValue
      );
    }

    if (logsCsv.length !== 0 || connectionsCsv.length !== 0) {
      isLoading = true;
      const { data, error } = await supabase.storage
        .from('records')
        .upload(
          `${teamId}/${fileName}-${
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
        await createTeamStorage(data.Key);
        await getAllStorage();
        isLoading = false;
      }

      fileName = `${formatDate(new Date())}-${formatDate(new Date())}`;
      selectedType = 'Activities';
      toDateValue = new Date(today);
      fromDateValue = new Date(today);
      toDateOptions.maxDate = new Date(today);
      isLoading = false;
    } else {
      console.log('No records found');
    }
  };

  const deleteHandler = async (record) => {
    isLoading = true;
    let noErr = false;

    //delete from team records storage
    const { error } = await supabase.storage
      .from('records')
      .remove([`${teamId}/${record.filename}`]);

    //delete from personal records storage, if exists
    const { error: personalRecordsError } = await supabase.storage
      .from('records')
      .remove([`${teamId}/${$user?.id}/${record.filename}`]);

    //delete from team storage database
    const { data, error: err } = await supabase
      .from('team_storage')
      .delete()
      .eq('filename', record.filename);

    if (err) {
      toastFailed(err.message);
      isLoading = false;
    } else {
      noErr = true;
      isLoading = false;
    }

    if (error) {
      toastFailed('Failed to delete record');
      isLoading = false;
    }

    if (noErr && !error) {
      toastSuccess(`${record.filename} deleted successfully`);
      await getAllStorage();
      $personal = $personal.filter((item) => item.id !== record.id);
      $team = $team.filter((item) => item.id !== record.id);
      isLoading = false;
    }
  };

  const sortHandler = async (col) => {
    if (col === 'name') col = 'filename';
    $team = $team.sort(
      sortBy(col, asc, function (a) {
        return a.toUpperCase();
      })
    );
  };

  const selectTypeHandler = (e) => (selectedType = e.detail);
</script>

<svelte:window bind:innerWidth />
<div
  class="w-1/4 hidden md:flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
>
  <div class="pl-20 pt-4 pr-4 flex flex-col gap-4">
    <RecordTypeDropdownButton on:select={selectTypeHandler} {selectedType} />

    <div class="flex flex-col gap-2">
      <p class="text-gray-400">From</p>
      <Flatpickr
        options={fromDateOptions}
        bind:value={fromDateValue}
        name="date"
        class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer"
      />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-gray-400">To</p>
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
      : false || isLoading}
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
  class="w-full md:w-3/4 ml-12 md:ml-0 snap-container snap-x mx-auto h-full snap-mandatory flex flex-col overflow-x-auto mb-8"
>
  {#if loading}
    <ConnectionsSkeletion items={$team} />
  {:else}
    <table class="snap-center text-black w-full">
      <thead class="text-left text-neutral-400 bg-black/70">
        <tr>
          {#if innerWidth > 640}
            <TableHead
              class="w-1/7"
              data={recordsTableTeam}
              on:sort={async (e) => {
                asc = !asc;
                await sortHandler(e.detail ?? 'name');
              }}
            />
          {:else}
            <TableHead
              class="w-1/6"
              data={recordsTableTeamMobile}
              on:sort={async (e) => {
                asc = !asc;
                await sortHandler(e.detail ?? 'name');
              }}
            />
          {/if}
        </tr>
      </thead>
      <tbody>
        {#if $team}
          {#if $team.length > 0}
            {#each $team as record, i}
              <RecordsTableBody
                {innerWidth}
                {record}
                {teamId}
                {deleteHandler}
                {isLoading}
                isTeam
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
  {/if}

  {#if totalTeamRecords > toItem}
    <PaginationButton {setPage} {page} {maxPage} />
  {/if}
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
