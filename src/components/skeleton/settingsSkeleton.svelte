<script>
  export let permissions, isSuperAdmin;
</script>

<div class="animate-pulse my-1 gap-3 flex flex-col">
  {#if permissions.readBilling}
    <div class="flex gap-3">
      <div class="bg-neutral-900 h-56 w-full rounded-lg" />
      <div class="bg-neutral-900 h-56 w-1/3 rounded-lg hidden md:block" />
    </div>
  {/if}
  {#if isSuperAdmin}
    <div class="flex gap-3">
      <div class="bg-neutral-900 h-40 w-full rounded-lg" />
      <div class="bg-neutral-900 h-40 w-1/3 rounded-lg hidden md:block" />
    </div>
    <div class="flex gap-3">
      <div class="bg-neutral-900 h-40 w-full rounded-lg" />
      <div class="bg-neutral-900 h-40 w-1/3 rounded-lg hidden md:block" />
    </div>
  {/if}
  {#if permissions.readRoles}
    <div class="flex gap-3">
      <div class="bg-neutral-900 h-56 w-full rounded-lg" />
      <div class="bg-neutral-900 h-56 w-1/3 rounded-lg hidden md:block" />
    </div>
  {/if}
  <div class="bg-neutral-900 h-32 w-full rounded-lg" />
</div>
