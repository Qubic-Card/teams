<script>
  export let isHasPermission = false;
</script>

<div class="animate-pulse">
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="flex w-1/3 h-72 bg-neutral-700 rounded-lg" />
      <div class="flex w-1/3 h-72 bg-neutral-700 rounded-lg" />
      <div class="flex w-1/3 h-72 bg-neutral-700 rounded-lg" />
    </div>
    {#if isHasPermission}
      <div class="rounded-lg bg-neutral-700 h-[550px] w-full" />
    {/if}
  </div>
</div>
