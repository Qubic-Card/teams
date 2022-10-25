<script>
  import { fade } from 'svelte/transition';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import supabase from '@lib/db';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import { last7Days } from '@lib/utils/getDates';

  export let isOpen = false;
  export let member;

  let maxPage = 0;
  let page = 0;
  let toItem = 15;
  let memberLogs = [];
  let loading = false;
  let fromDateValue = new Date(new Date(last7Days[0]));
  let toDateValue = new Date();

  const options = {
    // clickOpens: false,
    maxDate: 'today',
    static: true,
    mode: 'range',
    onChange(selectedDates, dateStr) {
      fromDateValue = new Date(selectedDates[0]);
      toDateValue =
        selectedDates.length > 1
          ? new Date(selectedDates[1])
          : new Date(selectedDates[0]);

      if (selectedDates.length === 1) {
        page = 0;
      }
    },
  };

  const dispatch = createEventDispatcher();

  const closeModal = () => {
    isOpen = false;
    dispatch('close');
    page = 0;
    fromDateValue = new Date(new Date(last7Days[0]));
    toDateValue = new Date();
  };

  const setPage = (type) => {
    if (type === 'next') {
      page++;
    } else {
      page--;
    }
  };

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const setHours4Digit = (hours, minute) => {
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minute < 10) {
      minute = '0' + minute;
    }
    return hours + ':' + minute;
  };

  const getMemberLogs = async () => {
    let fromDate = new Date(
      new Date(fromDateValue).setHours(0, 0, 0, 0)
    ).toUTCString();
    let toDate = new Date(
      new Date(toDateValue).setHours(23, 59, 59, 999)
    ).toUTCString();

    loading = true;
    const { from, to } = getPagination(page, toItem);
    const { data, error, count } = await supabase
      .from('team_logs')
      .select('data, type, created_at, card_holder', { count: 'estimated' })
      .eq('team_member', member.id)
      .range(from, to)
      .gte('created_at', new Date(fromDate).toISOString())
      .lte('created_at', new Date(toDate).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      loading = false;
    }

    if (data) {
      let groupedLogs = [];

      groupedLogs = data.filter(
        (log) => !log.data.message.includes('QRScan' || 'QRShare' || 'NFC')
      );

      // Grouping by date
      groupedLogs = groupedLogs.reduce((acc, log) => {
        const date = new Date(log.created_at).toDateString().slice(4);

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(log);

        return acc;
      }, {});

      groupedLogs = Object.keys(groupedLogs).map((date) => {
        return {
          date,
          logs: groupedLogs[date],
        };
      });

      // console.log(groupedLogs);
      // console.log(data);

      memberLogs = data;
      maxPage = Math.ceil(count / toItem);
      loading = false;
    }
  };

  $: if (isOpen) toDateValue, page, getMemberLogs();
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click={closeModal}
  />
{/if}

{#if isOpen}
  <Dialog
    open={isOpen}
    on:close={closeModal}
    class="transition-all md:transition-none duration-300 ease-in-out {isOpen
      ? 'h-[70%]'
      : 'h-0 translate-y-10 md:opacity-0'} text-xs md:text-sm bg-neutral-900 text-white border-2 border-neutral-700 gap-2 top-28 md:top-[15%] right-0 md:right-9 flex flex-col ml-0 lg:ml-12 w-full md:w-[95%] pb-2 bottom-0 fixed z-50 shadow-lg rounded-lg outline-none focus:outline-none"
  >
    <div
      on:click={() => (isOpen = true)}
      class="px-3 pt-3 h-24 rounded-md flex justify-between gap-2"
    >
      <div class="flex gap-2">
        <img
          class="w-12 h-12 rounded-full"
          src={member.avatar}
          alt={member.firstname + ' avatar'}
        />
        <div class="flex flex-col">
          <h1 class="font-bold text-white">
            {member.firstname ?? ''}
            {member.lastname ?? ''}
          </h1>
          <p>{member.job}</p>
        </div>
      </div>
      <div class="flex justify-end gap-2 w-1/2">
        <div class="flex bg-neutral-800 h-10 p-2 rounded-md w-1/2">
          Most Recent
        </div>
        <div
          class="flex bg-neutral-800 h-10 pl-2 py-2 rounded-md w-1/2 items-center justify-between"
        >
          Period:

          <Flatpickr
            placeholder={new Date(fromDateValue).toDateString().slice(4) +
              ' to ' +
              new Date(toDateValue).toDateString().slice(4)}
            {options}
            name="date"
            class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer"
          />
        </div>
        <button on:click={closeModal} class="self-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="p-2 bg-neutral-800 rounded-lg h-full">
      {#if loading}
        <!-- {#each Array(memberLogs.length ?? 15) as item}
          <div class="bg-neutral-900 w-full h-8 rounded-md mb-1" />
        {/each} -->
      {:else if memberLogs.length > 0}
        {#each memberLogs as log}
          <div
            class={`text-sm flex mb-1 rounded-md justify-between p-1 hover:p-1 ${
              log.type === 'DANGER'
                ? 'bg-red-600/30 border-2 border-red-400/30 hover:bg-red-800'
                : log.type === 'SUCCESS'
                ? 'bg-green-600/30 border-2 border-green-400/30 hover:bg-green-800'
                : log.type === 'WARN'
                ? 'bg-yellow-600/30 border-2 border-yellow-400/30 hover:bg-yellow-800'
                : 'bg-transparent hover:bg-neutral-700'
            }`}
          >
            {#if log.type === 'DANGER' || log.type === 'SUCCESS' || log.type === 'WARN'}
              <h1
                class={`${
                  log.type === 'DANGER'
                    ? 'text-red-200'
                    : log.type === 'SUCCESS'
                    ? 'text-green-200'
                    : log.type === 'WARN'
                    ? 'text-yellow-200'
                    : 'text-neutral-100'
                }`}
              >
                {log?.data?.message}
              </h1>
            {:else}
              <h1 class="text-white">
                {`${log?.card_holder ?? 'Member'}'s` +
                  log?.data?.message?.slice(4)}
              </h1>
            {/if}
            <p
              class={`${
                log.type === 'DANGER'
                  ? 'text-red-200'
                  : log.type === 'SUCCESS'
                  ? 'text-green-200'
                  : log.type === 'WARN'
                  ? 'text-yellow-200'
                  : 'text-neutral-500'
              }`}
            >
              {setHours4Digit(
                convertToGMT7(log.created_at).getHours(),
                convertToGMT7(log.created_at).getMinutes()
              )}
            </p>
          </div>
        {/each}
        <!-- {#each memberLogs as item}
          <h1>{item.date}</h1>
          {#each item.logs as log}
            <div
              class={`text-sm flex mb-1 rounded-md justify-between p-1 hover:p-1 ${
                log.type === 'DANGER'
                  ? 'bg-red-600/30 border-2 border-red-400/30 hover:bg-red-800'
                  : log.type === 'SUCCESS'
                  ? 'bg-green-600/30 border-2 border-green-400/30 hover:bg-green-800'
                  : log.type === 'WARN'
                  ? 'bg-yellow-600/30 border-2 border-yellow-400/30 hover:bg-yellow-800'
                  : 'bg-transparent hover:bg-neutral-700'
              }`}
            >
              {#if log.type === 'DANGER' || log.type === 'SUCCESS' || log.type === 'WARN'}
                <h1
                  class={`${
                    log.type === 'DANGER'
                      ? 'text-red-200'
                      : log.type === 'SUCCESS'
                      ? 'text-green-200'
                      : log.type === 'WARN'
                      ? 'text-yellow-200'
                      : 'text-neutral-100'
                  }`}
                >
                  {log?.data?.message}
                </h1>
              {:else}
                <h1 class="text-white">
                  {`${log?.card_holder ?? 'Member'}'s` +
                    log?.data?.message?.slice(4)}
                </h1>
              {/if}
              <p
                class={`${
                  log.type === 'DANGER'
                    ? 'text-red-200'
                    : log.type === 'SUCCESS'
                    ? 'text-green-200'
                    : log.type === 'WARN'
                    ? 'text-yellow-200'
                    : 'text-neutral-500'
                }`}
              >
                {setHours4Digit(
                  convertToGMT7(log.created_at).getHours(),
                  convertToGMT7(log.created_at).getMinutes()
                )}
              </p>
            </div>
          {/each}
        {/each} -->
      {:else}
        <div class="flex justify-center items-center">
          <h1 class="text-center">No log found</h1>
        </div>
      {/if}
    </div>
    <div class="bg-neutral-900 flex justify-center items-center">
      <p class="w-1/2 flex justify-end">
        {maxPage > 0 ? page + 1 : 0}/{maxPage}
      </p>
      <div class="flex justify-end w-1/2 pr-4 gap-2">
        <button
          disabled={page === 0}
          on:click={() => setPage('prev')}
          class="bg-neutral-800 border border-neutral-700 p-2 rounded-md w-1/6 disabled:opacity-50"
          >Previous</button
        >
        <button
          disabled={page === maxPage - 1 || maxPage < 1}
          class="bg-blue-600 w-1/6 p-2 rounded-md disabled:opacity-50"
          on:click={() => setPage('next')}>Next</button
        >
      </div>
    </div>
  </Dialog>
{/if}
