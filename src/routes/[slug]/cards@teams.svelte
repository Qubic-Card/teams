<!-- <script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';

  let portfolio;
  const data = {
    labels: ['Expenses', 'Savings', 'Investments'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: ['#7000e1', '#fc8800', '#00b0e8'],
        // hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      borderRadius: '30',
      responsive: true,
      cutout: '95%',
      spacing: 2,
      plugins: {
        legend: {
          position: 'bottom',
          display: true,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: 'My Personal Portfolio',
        },
      },
    },
  };
  onMount(() => {
    const ctx = portfolio.getContext('2d');
    // Initialize chart using default config set
    var myChart = new Chart(ctx, config);
  });
</script>

<canvas bind:this={portfolio} width={400} height={400} /> -->
<script>
  import supabase from '@lib/db.js';
  import { onMount } from 'svelte';
  // import { Chart, registerables } from 'chart.js';
  import { user, userData } from '@lib/stores/userStore.js';
  import { getMemberId } from '@lib/query/getId';
  import getDates from '@lib/utils/getDates';
  import Cookies from 'js-cookie';
  import count from '@lib/utils/count';
  import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
  } from 'chart.js';

  Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
  );
  let connectionData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  let activityData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  const chartEls = [
    { label: 'Weekly New Connections', count: 0 },
    { label: 'Weekly Activities', count: 0 },
  ];

  let teamId = Cookies.get('qubicTeamId');
  let labels = [];
  let data = [];

  let uniqueCount = 0;
  let activityCount = 0;
  let connectionCount = 0;
  let activity = [];
  let dateConnected = [];
  let userLogs = [];
  let loading = false;
  let chartActivityData = {
    labels: [],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
      },
    ],
  };
  let chartLogsData = {
    labels: [],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [],
      },
    ],
  };
  console.log(chartActivityData);
  const today = new Date().setDate(new Date().getDate());
  const last7Days = getDates(
    new Date(new Date().setDate(new Date().getDate() - 6)),
    today
  );

  const getConnectionsList = async () => {
    let id = await getMemberId($user?.id, teamId);

    let {
      data: connection_profile,
      error: error_profile,
      count,
    } = await supabase
      .from('team_connection_acc')
      .select('dateConnected', { count: 'estimated' })
      .eq('by', id)
      .gte('dateConnected', new Date(last7Days[0]).toUTCString())
      .order('dateConnected', { ascending: false });

    if (error_profile) console.log(error_profile);
    if (connection_profile) {
      connectionCount = count;
      dateConnected = connection_profile.map((item) =>
        new Date(item.dateConnected).toDateString().slice(4)
      );
    }
  };

  const getWeeklyLogsActivity = async () => {
    let id = await getMemberId($user?.id, teamId);
    loading = true;
    try {
      let {
        data: logs,
        error,
        count,
      } = await supabase
        .from('team_logs')
        .select('*', { count: 'estimated' })
        .eq('team_member', id)
        .gte('created_at', new Date(last7Days[0]).toISOString())
        .order('created_at', {
          ascending: false,
        });
      // .limit(maxLimit ?? 5);

      if (logs) {
        let newArr = [];
        logs.map((log) => {
          if (!newArr.includes(log.uniqueId)) newArr.push(log.uniqueId);
        });
        uniqueCount = newArr.length;
        activityCount = count;
        activity = logs.map((log) =>
          new Date(log.created_at).toDateString().slice(4)
        );

        setTimeout(() => {
          loading = false;
        }, 1000);

        userLogs = logs;
        // paginate(userLogs);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };

  const activityHandler = async () => {
    await getWeeklyLogsActivity();

    chartActivityData.labels = last7Days;
    chartActivityData.datasets[0].data = count(last7Days, activity);
  };

  const connection = async () => {
    await getConnectionsList();

    chartLogsData.labels = last7Days;
    chartLogsData.datasets[0].data = count(last7Days, dateConnected);
  };

  // Chart.register(...registerables);
  let activityChart;
  let logsChart;

  const renderChart = () => {
    var ctx = activityChart.getContext('2d');
    var chart = new Chart(ctx, {
      type: 'line',
      data: chartActivityData,
      options: {},
    });

    var context = logsChart.getContext('2d');
    var chart1 = new Chart(context, {
      type: 'line',
      data: chartLogsData,
      options: {},
    });
  };
  onMount(async () => {
    await activityHandler();
    await connection();
    renderChart();
  });
</script>

<div class="pl-24 pr-4 flex w-1/2">
  <canvas bind:this={activityChart} />
  <canvas bind:this={logsChart} />
</div>
