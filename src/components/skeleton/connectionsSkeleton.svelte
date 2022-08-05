<script>
  export let searchSkeletonVisible, items;
</script>

<div class="animate-pulse">
  <div class="flex flex-col gap-4">
    {#if searchSkeletonVisible}
      <div class="w-1/3 h-12 flex gap-2 self-end mr-2">
        <div class="bg-neutral-800 w-full h-full rounded-md" />
        <div class="bg-neutral-800 w-36 h-full rounded-md" />
      </div>
    {/if}
    <div class="flex flex-col">
      <div class="bg-black/70 w-full h-12" />
      {#if items > 0}
        {#each Array(items) as item}
          <div class="bg-neutral-800 w-full h-12" />
        {/each}
      {:else}
        <div class="bg-neutral-800 w-full h-12" />
        <div class="bg-neutral-800 w-full h-12" />
      {/if}
    </div>
  </div>
</div>
