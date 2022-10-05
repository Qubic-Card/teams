<script>
  export let label = 'Qubic Chart';
  export let editor = 'team';
</script>

<div class="flex flex-col lg:w-1/2 w-full">
  <div class="flex w-full justify-between">
    <h1 class="text-lg font-semibold">{label}</h1>
  </div>
  <div
    class="h-80 {editor === 'team'
      ? 'border-neutral-700 bg-neutral-800'
      : 'bg-white border-neutral-200'} p-4 border rounded-xl mt-2 outer"
  >
    <slot />
  </div>
</div>
