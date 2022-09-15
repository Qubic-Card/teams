<script>
  export let item = null;
  export let selectedDays = '';
</script>

<div
  class="flex flex-col justify-between w-full h-32 bg-neutral-800 border border-neutral-700 rounded-lg p-6"
>
  <div class="flex justify-between items-center">
    <h1 class="text-md md:text-xl">{item.data} <span>{item.type}</span></h1>
    <div
      class="bg-blue-600 hidden justify-center aspect-square items-center p-1 h-full rounded-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
  <div class="flex justify-between items-center text-sm">
    <h2 class="text-neutral-400 text-xs md:text-sm">{selectedDays}</h2>
    {#if item.percentage >= 0}
      <p class="text-green-600 flex gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
        {item.percentage}%
      </p>
    {:else}
      <p class="text-red-600 flex gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {item.percentage}%
      </p>
    {/if}
  </div>
</div>
