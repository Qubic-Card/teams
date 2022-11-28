<script>
  export let permissions;
</script>

<div class="animate-pulse gap-2 flex flex-col h-full pl-4 md:pl-20 mt-4 pr-4">
  {#if permissions.writeRecords}
    <div class="h-16 w-full bg-neutral-900 rounded-md" />
  {/if}
  <div class="flex h-full gap-2">
    <div class="h-full w-[400px] bg-neutral-900 rounded-md hidden md:block" />
    <div class="h-full w-full bg-neutral-900 rounded-md" />
  </div>
</div>
