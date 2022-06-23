<script>
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import { page } from '$app/stores';
  import { getMembersId, getTeamId } from '@lib/query/getId';
  import { toastFailed } from '@lib/utils/toast';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import AnalyticsPageSkeleton from '@comp/skeleton/analyticsPageSkeleton.svelte';
  import getDates from '@lib/utils/getDates';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import Input from '@comp/input.svelte';

  let teamId = Cookies.get('qubicTeamId');
  let isHasPermission = false;
  let isTeamTab = false;

  let type = '';
  let from = '';
  let to = '';
  let fileName = '';

  let selectedTopic = null;
  let state = 'idle';
  let contactsCount = 0;

  $: $userData?.filter((item) => {
    if (item === 'allow_read_analytics') isHasPermission = true;
  });

  const selectTopic = (topic) => (selectedTopic = topic);
  const setState = (newState) => (state = newState);
  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );

  // onMount(async () => {
  //   await getContacts();
  // });
</script>

<div class="flex flex-col w-full h-full pt-4 pl-216">
  <TabGroup class="h-full">
    <TabList
      class="w-full flex justify-between pl-20 border-b-2 border-neutral-700 pr-4 text-lg"
    >
      <div class="flex gap-8">
        <Tab
          on:click={() => {
            isTeamTab = false;
          }}
          class={({ selected }) =>
            selected
              ? 'text-white font-bold border-b-2 border-white pb-2'
              : 'text-white pb-2'}>Personal</Tab
        >
        <Tab
          on:click={() => {
            isTeamTab = true;
          }}
          class={({ selected }) =>
            selected
              ? 'text-white font-bold border-b-2 border-white pb-2'
              : 'text-white pb-2'}>Team</Tab
        >
      </div>
      <h1>0/5GB</h1>
    </TabList>
    <TabPanels class="h-full">
      <TabPanel class="flex h-full">
        <div
          class="w-1/4 flex flex-col justify-between gap-4 border-r-2 border-neutral-700 h-full"
        >
          <div class="pl-20 pt-4 pr-4">
            <Input placeholder="Type" title="Type" bind:value={type} />
            <Input placeholder="From" title="From" bind:value={type} />
            <Input placeholder="To" title="To" bind:value={type} />
            <Input placeholder="Filename" title="Filename" bind:value={type} />
          </div>
          <button class="bg-blue-600 pl-20 p-3"> Create record -></button>
        </div>
        <div class="w-3/4 pt-4">afasfa</div>
      </TabPanel>
      <TabPanel>afasasvas</TabPanel>
    </TabPanels>
  </TabGroup>
</div>

<!-- <div class="flex flex-col w-full h-full pt-4 pl-24 pr-4">
  {#await (getContacts(), getTaps())}
    <AnalyticsPageSkeleton />
  {:then name}
    {#if isHasPermission}
      <div class="flex justify-between gap-4">
        {#each analyticsData as item}
          <div
            class="flex flex-col justify-between w-full h-72 bg-neutral-800 first:bg-gradient-to-bl from-blue-500 to-green-500 first:hover:bg-gradient-to-tr hover:from-blue-500 hover:to-green-500 transform transition duration-200 rounded-lg p-6"
          >
            <p class="text-4xl self-end text-green-600">^ {item.percentage}%</p>
            <div>
              <h1 class="text-4xl">{item.data} <span>{item.type}</span></h1>
              <h2 class="text-2xl">in 7 days</h2>
            </div>
          </div>
        {/each}
      </div>
      <div
        class="flex flex-col w-full h-full bg-neutral-800 my-4 rounded-lg p-8 justify-between"
      >
        {#if state === 'idle'}
          <h1 class="text-2xl">Select topics</h1>
          <div
            class="grid grid-cols-3 grid-rows-2 gap-4 mt-8 border-b-2 border-neutral-700 pb-32"
          >
            {#each topics as item}
              <button
                on:click={() => selectTopic(item)}
                class={`border-2 border-neutral-700 hover:bg-neutral-900 text-xl rounded-lg w-full p-4 ${
                  selectedTopic === item ? 'bg-neutral-700' : ''
                }`}>{item}</button
              >
            {/each}
          </div>
          <button
            class="self-end bg-white p-4 w-80 text-black mt-8 text-xl"
            on:click={() => {
              if (selectedTopic === null) {
                toastFailed('Please select a topic first');
              } else {
                setState('analyze');
              }
            }}
          >
            Power Analyze
          </button>
        {:else}
          <div
            class="flex justify-between h-24 border-b border-neutral-700 pb-8"
          >
            <button
              class="border-2 border-neutral-700 hover:bg-neutral-700 text-xl rounded-lg w-96 h-full p-4"
              >{selectedTopic}
            </button>
            <button
              class="self-end bg-white p-4 w-80 h-full text-black text-xl"
            >
              Power Analyze
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <p>you dont have access to this page, you cant see the analytics</p>
    {/if}
  {:catch}
    <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again.
    </h1>
  {/await}
</div> -->
