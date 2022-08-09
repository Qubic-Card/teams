<script>
  export let permissions;
</script>

<div class="animate-pulse my-1 gap-4 flex flex-col">
  {#if permissions.readBilling}
    <div class="flex gap-4">
      <div class="bg-neutral-800 h-56 w-full rounded-lg" />
      <div class="bg-neutral-800 h-56 w-1/3 rounded-lg" />
    </div>
  {/if}
  {#if permissions.readRoles}
    <div class="flex gap-4">
      <div class="bg-neutral-800 h-56 w-full rounded-lg" />
      <div class="bg-neutral-800 h-56 w-1/3 rounded-lg" />
    </div>
  {/if}
  <div class="bg-neutral-800 h-32 w-full rounded-lg" />
</div>
