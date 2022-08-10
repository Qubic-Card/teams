<script>
  export let permissions;
</script>

<div class="animate-pulse gap-2 flex flex-col h-full pl-20 mt-4 pr-4">
  {#if permissions.writeRecords}
    <div class="h-16 w-full bg-neutral-800 rounded-md" />
  {/if}
  <div class="flex h-full gap-2">
    <div class="h-full w-[400px] bg-neutral-800 rounded-md" />
    <div class="h-full w-full bg-neutral-800 rounded-md" />
  </div>
</div>
