<script>
  export let label = 'Qubic Chart';
</script>

<div class="flex flex-col w-full">
  <div class="flex w-full justify-between">
    <h1 class="text-lg font-semibold">{label}</h1>
  </div>
  <div
    class="h-80 border-neutral-700 bg-neutral-800 p-4 border rounded-xl mt-2 outer"
  >
    <slot />
  </div>
</div>
