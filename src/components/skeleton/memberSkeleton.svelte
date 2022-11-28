<script>
  export let length = 5;
</script>

<div class="animate-pulse w-full flex flex-col h-auto gap-2 pl-4 pt-2">
  <div class="flex flex-col gap-2 pr-4">
    {#each Array(length) as item}
      <div class="bg-neutral-900 rounded-md h-32 w-full flex" />
    {/each}
  </div>
</div>
