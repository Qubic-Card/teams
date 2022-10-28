<script>
  export let label = '';
  export let count = 0;
  export let loading = false;
</script>

<div
  class="rounded-lg bg-neutral-900 outline outline-1 outline-neutral-800 h-full p-4"
>
  {#if loading}
    <div class="animate-pulse flex flex-col gap-2">
      <div class="w-40 bg-neutral-900 rounded-md h-8" />
      <div class="w-12 bg-neutral-900 rounded-md h-8" />
    </div>
  {:else}
    <p class="text-neutral-300 text-xs md:text-sm">{label}</p>
    <p class="font-bold text-xl md:text-3xl">
      {count}
    </p>
  {/if}
</div>
