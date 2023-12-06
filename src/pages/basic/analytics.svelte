<script>
  import { count } from "@lib/utils/count";
  import supabase from "@lib/db.js";
  import AnalyticTable from "@comp/basic/analyticTable.svelte";
  import { user } from "@lib/stores/userStore.js";
  import convertToGMT7 from "@lib/utils/convertToGMT7";
  import { last7Days } from "@lib/utils/getDates";
  import { onMount } from "svelte";
  import { analyticsChartConfig } from "@lib/constants";
  import ChartEl from "@comp/chart.svelte";
  import Chart from "chart.js/auto/auto.js";
  import {
    Popover,
    PopoverButton,
    PopoverPanel,
  } from "@rgossiaux/svelte-headlessui";

  let page = 0;
  let toItem = 20;
  let maxPage = 0;
  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let connectionChartCtx;
  let logChartCtx;
  let logsChart;
  let connectionsChart;
  let dateConnected = [];
  let logsArr = [];
  let activity = [];

  let logsChartData = {
    labels: [],
    datasets: [
      {
        label: "Weekly Activities",
        data: [],
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
      },
    ],
  };

  let connectionsChartData = {
    labels: [],
    datasets: [
      {
        label: "Connection Activities",
        data: [],
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
      },
    ],
  };

  const connectionsConfig = {
    type: "line",
    data: connectionsChartData,
    options: analyticsChartConfig,
  };

  const logsConfig = {
    type: "line",
    data: logsChartData,
    options: analyticsChartConfig,
  };

  let loading = false;

  const setPage = (p) => (page = p);

  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const from = page ? page * limit : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
  };

  const getConnectionsList = async () => {
    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from("connection_acc")
      .select("dateConnected", { count: "estimated" })
      .eq("uid", $user.id)
      .gte("dateConnected", new Date(last7Days[0]).toISOString())
      .order("dateConnected", { ascending: false });

    if (connection_profile) connectionCount = count;
    if (error_profile) console.log(error_profile);

    dateConnected = connection_profile.map((item) =>
      new Date(item.dateConnected).toDateString().slice(4)
    );
  };

  const getWeeklyLogsChartActivity = async () => {
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from("logs")
        .select("*", { count: "estimated" })
        .eq("uid", $user.id)
        .gte("timestamp", new Date(last7Days[0]).toISOString())
        .order("timestamp", { ascending: false });

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });
        uniqueCount = newArr.length;
        activityCount = count;
        activity = logs.map((log) =>
          convertToGMT7(log.timestamp).toDateString().slice(4)
        );

        setTimeout(() => {
          loading = false;
        }, 200);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const getWeeklyLogsActivity = async () => {
    const { from, to } = getPagination(page, toItem);
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from("logs")
        .select("*", { count: "estimated" })
        .eq("uid", $user.id)
        .gte("timestamp", new Date(last7Days[0]).toISOString())
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (logs) {
        maxPage = Math.ceil(count / toItem);

        setTimeout(() => {
          loading = false;
        }, 200);

        logsArr = logs;
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const logsHandler = async () => {
    await getWeeklyLogsChartActivity();
    logsChartData.labels = last7Days;
    logsChartData.datasets[0].data = count(last7Days, activity);

    if (logChartCtx) logChartCtx.update();
  };

  const connectionsHandler = async () => {
    await getConnectionsList();

    connectionsChartData.labels = last7Days;
    connectionsChartData.datasets[0].data = count(last7Days, dateConnected);

    if (connectionChartCtx) connectionChartCtx.update();
  };

  $: page, toItem, getWeeklyLogsActivity();

  onMount(async () => {
    await connectionsHandler();
    await logsHandler();

    const connectionsCtx = connectionsChart.getContext("2d");
    connectionChartCtx = new Chart(connectionsCtx, connectionsConfig);

    const logsCtx = logsChart.getContext("2d");
    logChartCtx = new Chart(logsCtx, logsConfig);
  });
</script>

<!-- PRO Footer
<div
  class="fixed bottom-0 border-t border-neutral-200 bg-white h-16 w-full flex justify-between"
>
  <Popover class=" flex justify-center items-center pl-4">
    <PopoverButton class=" border-neutral-300 border rounded-md py-2 px-3"
      >A week ago</PopoverButton
    >

    <PopoverPanel
      class="bottom-14 border border-neutral-300 ml-6 bg-white rounded-md shadow-sm"
      style="position: absolute; z-index: 10;"
    >
      <div class="px-3 py-2 flex flex-col text-neutral-500 space-y-2">
        <button
          class="w-full whitespace-nowrap text-start hover:text-black border-b pb-2"
          >3 Days ago</button
        >
        <button
          class="w-full whitespace-nowrap text-start hover:text-black border-b pb-2"
          >A week ago</button
        >
        <button class="w-full whitespace-nowrap text-start hover:text-black"
          >A month ago</button
        >
      </div>
    </PopoverPanel>
  </Popover>
  <button
    class="border-l border-neutral-200 pr-20 flex justify-center items-center w-[200px]"
    ><svg
    class="h-10 w-10 px-2"
      clip-rule="evenodd"
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        d="m6.864 3.424c.502-.301 1.136.063 1.136.642 0 .264-.138.509-.365.644-2.476 1.486-4.135 4.197-4.135 7.292 0 4.691 3.808 8.498 8.498 8.498s8.497-3.807 8.497-8.498c0-3.093-1.656-5.803-4.131-7.289-.225-.136-.364-.38-.364-.644 0-.582.635-.943 1.137-.642 2.91 1.748 4.858 4.936 4.858 8.575 0 5.519-4.479 9.998-9.997 9.998s-9.998-4.479-9.998-9.998c0-3.641 1.951-6.83 4.864-8.578zm.831 8.582s2.025 2.021 3.779 3.774c.147.147.339.22.53.22.192 0 .384-.073.531-.22 1.753-1.752 3.779-3.775 3.779-3.775.145-.145.217-.336.217-.526 0-.192-.074-.384-.221-.531-.292-.293-.766-.294-1.056-.004l-2.5 2.499v-10.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v10.693l-2.498-2.498c-.289-.289-.762-.286-1.054.006-.147.147-.221.339-.222.531 0 .19.071.38.215.524z"
        fill-rule="nonzero"
      /></svg
    > Download</button
  >
</div> -->

<!-- <div class="flex flex-col lg:flex-row justify-between gap-2" /> -->
<div class="min-h-screen bg-gray-100 flex justify-center pb-20 text-black">
  <div class="lg:mx-20 mx-8 my-8 w-full">
    <div class="flex flex-col lg:flex-row justify-between gap-2">
      <ChartEl label="New Connections" editor="basic">
        <canvas bind:this={connectionsChart} />
      </ChartEl>
      <ChartEl label="New Activities" editor="basic">
        <canvas bind:this={logsChart} />
      </ChartEl>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-3 h-auto md:h-[150px] my-4 space-x-0 md:space-x-2"
    >
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">New connections this week</p>
        <p class="font-semibold text-xl md:text-4xl">{connectionCount}</p>
      </div>
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">Your activity this week</p>
        <p class="font-semibold text-xl md:text-4xl">{activityCount}</p>
      </div>
      <div class="rounded-lg bg-white border h-full p-8">
        <p class="">Unique People this week</p>
        <p class="font-semibold text-xl md:text-4xl">{uniqueCount}</p>
      </div>
    </div>
    <div class="hidden lg:flex lg:flex-col">
      <AnalyticTable logs={logsArr} {setPage} {page} {maxPage} {loading} />
    </div>
    <div class="flex lg:hidden w-full justify-center mt-8 md:text-md text-sm">
      View more on desktop
    </div>
  </div>
</div>
