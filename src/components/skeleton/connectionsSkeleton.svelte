<script>
  export let searchSkeletonVisible;
</script>

<div class="animate-pulse">
  <div class="flex flex-col gap-4">
    {#if searchSkeletonVisible}
      <div class="bg-neutral-800 w-1/3 h-20 rounded-lg self-end" />
    {/if}
    <div class="flex flex-col">
      <div class="bg-black/70 w-full h-12" />
      <div class="bg-neutral-800 w-full h-12" />
      <div class="bg-neutral-800 w-full h-12" />
      <div class="bg-neutral-800 w-full h-12" />
      <div class="bg-neutral-800 w-full h-12" />
      <div class="bg-neutral-800 w-full h-12" />
    </div>
  </div>
</div>
