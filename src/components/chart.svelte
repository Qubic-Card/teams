<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';

  export let label = 'Qubic Chart';
  export let element = null;
  export let data = null;
  $: data;
  const config = {
    type: 'line',
    data: data,
    options: {
      animations: {
        tension: {
          duration: 300,
          easing: 'linear',
          from: 1,
          to: 0,
        },
      },
      responsive: true,
      cutout: '95%',
      spacing: 2,
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  onMount(async () => {
    const ctx = element.getContext('2d');
    // Initialize chart using default config set
    new Chart(ctx, config);
  });
</script>

<div class="flex flex-col w-full lg:w-[49.5%] pt-4 lg:pt-0">
  <div class="flex w-full justify-between">
    <h1 class="text-2xl font-semibold">{label}</h1>
  </div>
  <div class="h-80 border-neutral-700 bg-neutral-800 border rounded-xl mt-4">
    <canvas bind:this={element} />
  </div>
</div>
