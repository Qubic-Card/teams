<script>
  export let searchSkeletonVisible, items, personalOnly;
</script>

<div class="animate-pulse mt-4 mx-2 md:mx-0">
  <div class="flex flex-col gap-4">
    {#if searchSkeletonVisible}
      <div class="w-full h-12 flex md:hidden mt-2 gap-2 self-end mr-2">
        <div class="bg-neutral-900 w-full h-full rounded-md" />
        <div class="bg-neutral-900 w-full h-full rounded-md" />
      </div>
      <div class="w-full md:w-1/3 h-12 flex gap-2 self-end mr-2">
        <div class="bg-neutral-900 w-full h-full rounded-md" />
        <div class="bg-neutral-900 w-36 h-full rounded-md" />
      </div>
    {/if}
    <div
      class="flex flex-col {!personalOnly &&
        !searchSkeletonVisible &&
        'mt-36 md:mt-20'}"
    >
      <div class="bg-black/70 w-full h-12" />
      {#if items > 0}
        {#each Array(items) as item}
          <div class="bg-neutral-900 w-full h-12" />
        {/each}
      {:else}
        <div class="bg-neutral-900 w-full h-12" />
        <div class="bg-neutral-900 w-full h-12" />
      {/if}
    </div>
  </div>
</div>
