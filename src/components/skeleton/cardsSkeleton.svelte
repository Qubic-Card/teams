<script>
  export let cardsLength = 5;
</script>

<div class="p-4">
  <div
    class="animate-pulse gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  >
    {#each Array(cardsLength ?? 5) as item}
      <div
        class="h-40 rounded-md bg-neutral-900 outline outline-1 outline-neutral-800"
      />
    {/each}
  </div>
</div>
