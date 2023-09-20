<script>
  import MemberSortDropdown from '@comp/buttons/memberSortDropdown.svelte';
  import { fade, fly } from 'svelte/transition';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import supabase from '@lib/db';
  import Flatpickr from 'svelte-flatpickr';
  import 'flatpickr/dist/themes/dark.css';
  import { last7Days } from '@lib/utils/getDates';
  import TeamAnalyticsCard from '../cards/teamAnalyticsCard.svelte';
  import getPagination from '@lib/utils/getPagination';
  import setHours4Digit from '@lib/utils/setHour4Digit';
  import { user, userChangeTimestamp } from '@lib/stores/userStore';

  export let member,
    isRounded = false;

  let isOpen = false;
  let maxPage = 0;
  let page = 0;
  let toItem = 15;
  let memberLogs = [];
  let loading = false;
  let fromDateValue = new Date(new Date(last7Days[0]));
  let toDateValue = new Date();
  let dsc = false;

  const options = {
    // position: 'above center',
    maxDate: 'today',
    minDate: new Date(last7Days[0]),
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

  const getMemberLogs = async () => {
    if (member) {
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
        .eq('team_member', member?.member_id)
        .range(from, to)
        .gte(
          'created_at',
          $userChangeTimestamp > fromDate ? $userChangeTimestamp : fromDate
        )
        .lte(
          'created_at',
          $userChangeTimestamp > toDate ? $userChangeTimestamp : toDate
        )
        .order('created_at', { ascending: dsc });

      if (error) {
        console.log(error);
        loading = false;
      }

      if (data) {
        let groupedLogs = [];

        groupedLogs = data.reduce((acc, log) => {
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

        memberLogs = groupedLogs;
        maxPage = Math.ceil(count / toItem);
        loading = false;
      }
    }
  };

  $: if (isOpen) toDateValue, page, dsc, getMemberLogs();
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click={closeModal}
  />
{/if}

<button
  class="bg-neutral-800 text-xs p-1 w-20 {isRounded ? 'rounded-md' : ''}"
  on:click={() => (isOpen = true)}>Analytics</button
>

{#if isOpen}
  <Dialog
    open={isOpen}
    on:close={closeModal}
    class="transition-all md:transition-none duration-300 ease-in-out {isOpen
      ? 'h-full md:h-[80%]'
      : 'h-0 translate-y-10 md:opacity-0'} text-xs md:text-sm bg-neutral-900 text-white border border-neutral-700 gap-2 top-0 md:top-[10%] right-0 md:right-9 flex flex-col ml-0 lg:ml-12 w-full md:w-[95%] pb-2 bottom-20 fixed z-50 shadow-lg rounded-lg outline-none focus:outline-none"
  >
    <div
      on:click={() => (isOpen = true)}
      class="px-3 pt-3 h-96 md:h-72 rounded-md flex flex-col gap-2"
    >
      <div class="flex md:flex-row flex-col gap-2">
        <div
          class="flex p-2 gap-2 flex-1 bg-neutral-900 outline outline-1 outline-neutral-800 rounded-md"
        >
          {#if member?.team_profile?.avatar}
            <img
              class="w-16 md:w-24 h-16 md:h-24 rounded-full"
              src={member?.team_profile?.avatar}
              alt={member?.team_profile?.firstname + ' avatar'}
            />
          {:else}
            <img
              class="w-16 md:w-24 h-16 md:h-24 rounded-full bg-black"
              src="/favicon.svg"
              alt={member?.team_profile?.firstname + ' avatar'}
            />
          {/if}
          <div class="flex flex-col w-full">
            <h1 class="font-semibold text-white text-md md:text-lg">
              {member?.team_profile?.firstname ?? ''}
              {member?.team_profile?.lastname ?? ''}
            </h1>
            <p>{member?.team_profile?.job}</p>
            <p class="text-neutral-500">{member.email}</p>
          </div>
          <button on:click={closeModal} class="md:hidden block self-start">
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

        <TeamAnalyticsCard id={member?.member_id} close on:click={closeModal} />
      </div>

      <div class="hidden md:flex self-end gap-2 w-full md:w-1/3">
        <div
          class="flex bg-neutral-800 gap-3 h-10 pl-2 py-2 rounded-md w-full items-center justify-between text-xs md:text-sm"
        >
          Period:
          <input
            type="text"
            placeholder="Select Date.."
            data-input
            class="w-0"
          />
          <Flatpickr
            placeholder={new Date(fromDateValue).toDateString().slice(4) +
              ' to ' +
              new Date(toDateValue).toDateString().slice(4)}
            {options}
            name="date"
            class="w-full bg-neutral-700 rounded-md p-2 cursor-pointer"
          />
        </div>

        <MemberSortDropdown
          mode="analytics"
          on:asc={() => (dsc = false)}
          on:dsc={() => (dsc = true)}
        />
      </div>
    </div>
    <div class="p-2 bg-neutral-800 rounded-lg h-full overflow-y-auto">
      {#if loading}
        <!-- {#each Array(memberLogs.length ?? 15) as item}
          <div class="bg-neutral-900 w-full h-8 rounded-md mb-1" />
        {/each} -->
      {:else if memberLogs.length > 0}
        {#each memberLogs as item}
          <h1 class="font-regular text-xs md:text-sm">{item.date}</h1>
          {#each item.logs as log}
            <div
              class={`text-xs md:text-sm pl-2 flex mb-1 rounded-md justify-between p-1 ${
                log.type === 'DANGER'
                  ? 'bg-red-600/30 border-2 border-red-400/30 hover:bg-red-800'
                  : log.type === 'SUCCESS'
                  ? 'bg-green-600/30 border-2 border-green-400/30 hover:bg-green-800'
                  : log.type === 'WARN'
                  ? 'bg-yellow-600/30 border-2 border-yellow-400/30 hover:bg-yellow-800'
                  : 'bg-transparent hover:bg-neutral-700'
              }`}
            >
              {#if log.type === 'SUCCESS' || log.type === 'WARN'}
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
              {:else if log.type === 'DANGER'}
                {#if log.data?.message.includes(member.email) && member?.uid === $user?.id}
                  <p class="break-all text-red-200">
                    You {log.data?.message.split(' ').slice(1).join(' ')}
                  </p>
                {:else}
                  <p class="break-all text-red-200">
                    {log.data.message}
                  </p>
                {/if}
              {:else}
                <h1 class="text-white text-xs md:text-sm">
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
        {/each}
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
          class="bg-neutral-800 border border-neutral-700 p-2 rounded-md w-1/3 md:w-1/6 disabled:opacity-50"
          >Previous</button
        >
        <button
          disabled={page === maxPage - 1 || maxPage < 1}
          class="bg-blue-600 w-1/3 md:w-1/6 p-2 rounded-md disabled:opacity-50"
          on:click={() => setPage('next')}>Next</button
        >
      </div>
    </div>
  </Dialog>
{/if}
