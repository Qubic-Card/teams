<script>
  export let label = '';
  export let count = 0;
  export let loading = false;
</script>

<div class="rounded-lg bg-neutral-800 border border-neutral-700 h-full p-4">
  {#if loading}
    <div class="animate-pulse flex flex-col gap-2">
      <div class="w-40 bg-neutral-700 rounded-md h-8" />
      <div class="w-12 bg-neutral-700 rounded-md h-8" />
    </div>
  {:else}
    <p class="text-sm text-neutral-300">{label}</p>
    <p class="font-bold text-4xl">
      {count}
    </p>
  {/if}
</div>
