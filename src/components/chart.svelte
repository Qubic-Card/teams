<script>
  export let label = 'Qubic Chart';
  export let editor = 'team';
</script>

<div class="flex flex-col lg:w-1/2 w-full">
  <div class="flex w-full justify-between">
    <h1 class="text-lg font-regular">{label}</h1>
  </div>
  <div
    class="h-80 {editor === 'team'
      ? 'outline outline-1 outline-neutral-800 bg-neutral-900'
      : 'bg-white outline outline-1 outline-neutral-200'} p-4 rounded-xl mt-2 outer"
  >
    <slot />
  </div>
</div>
