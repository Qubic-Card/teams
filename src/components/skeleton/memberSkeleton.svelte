<script>
  export let searchSkeletonVisible;
</script>

<div class="animate-pulse">
  <div class="flex flex-col gap-6">
    {#if searchSkeletonVisible}
      <div class="bg-neutral-800 w-full h-24 rounded-md self-end" />
    {/if}
    <div
      class={`flex flex-col md:flex-row gap-4 ${
        searchSkeletonVisible ? ' ' : 'mt-4'
      }`}
    >
      <div class="bg-neutral-800 w-full md:w-1/3 h-56 md:h-72 rounded-md" />
      <div class="bg-neutral-800 w-full md:w-1/3 h-56 md:h-72 rounded-md" />
      <div class="bg-neutral-800 w-full md:w-1/3 h-56 md:h-72 rounded-md" />
    </div>
  </div>
</div>
