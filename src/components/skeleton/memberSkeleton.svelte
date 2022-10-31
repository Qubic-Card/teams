<script>
  export let all, card;
  export let length = 5;
</script>

<div class="animate-pulse w-full flex flex-col h-auto gap-2 pl-4 pt-2">
  {#if all || card}
    <div class="flex md:flex-row flex-col w-full justify-between pr-4">
      <div class="bg-neutral-900 h-10 w-full md:w-1/6 rounded-md" />
      <div
        class="flex w-full md:w-1/2 items-end justify-end gap-2 md:mt-0 mt-2"
      >
        <div class="bg-neutral-900 h-8 w-full md:w-1/6 rounded-md" />
        <div class="bg-neutral-900 h-8 w-full md:w-1/6 rounded-md" />
        <div class="bg-neutral-900 h-8 w-full md:w-1/6 rounded-md" />
        <div
          class="bg-neutral-900 h-8 w-1/4 md:w-1/6 rounded-md md:block hidden"
        />
      </div>
    </div>
  {/if}
  <!-- {#if search} -->
  <!-- {/if} -->

  <div class="flex flex-col gap-2 pr-4">
    {#each Array(length) as item}
      <div class="bg-neutral-900 rounded-md h-32 w-full flex" />
    {/each}
  </div>
</div>
