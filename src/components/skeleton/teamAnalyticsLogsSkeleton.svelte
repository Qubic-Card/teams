<script>
  export let all, search, card;
  export let length = 5;
</script>

<div class="animate-pulse w-full flex flex-col gap-2">
  {#if all || card}
    <div class="w-40 bg-neutral-800 rounded-md h-8" />
    <div class="flex md:flex-row flex-col w-full gap-2 mb-4">
      <div class="flex flex-col h-32 w-full md:w-1/3 gap-2">
        <div
          class="h-1/2 p-4 flex flex-col justify-between w-full bg-neutral-800 border border-neutral-700 rounded-md"
        >
          <div class="flex justify-between">
            <div class="w-40 rounded-lg h-8 bg-neutral-700" />
            <div class="w-20 rounded-lg h-8 bg-neutral-700" />
          </div>
        </div>
        <div
          class="h-1/2 p-4 flex flex-col justify-between w-full bg-neutral-800 border border-neutral-700 rounded-md"
        >
          <div class="flex justify-between">
            <div class="w-40 rounded-lg h-8 bg-neutral-700" />
            <div class="w-20 rounded-lg h-8 bg-neutral-700" />
          </div>
        </div>
      </div>
      <div
        class="h-32 p-4 flex flex-col justify-between w-full md:w-1/3 bg-neutral-800 border border-neutral-700 rounded-md mt-2 md:mt-0"
      >
        <div class="w-48 rounded-lg h-8 bg-neutral-700" />
        <div class="w-full rounded-lg h-6 bg-neutral-700" />
      </div>
      <div
        class="h-32 p-4 flex flex-col justify-between w-full md:w-1/3 bg-neutral-800 border border-neutral-700 rounded-md"
      >
        <div class="w-48 rounded-lg h-8 bg-neutral-700" />
        <div class="w-full rounded-lg h-6 bg-neutral-700" />
      </div>
    </div>
  {/if}
  {#if search}
    <div class="hidden md:flex w-full justify-between mb-3">
      <div class="bg-neutral-800 h-12 w-1/4 rounded-md" />
      <div class="flex w-1/2 justify-end gap-2">
        <div class="bg-neutral-800 h-12 w-1/3 rounded-md" />
        <div class="bg-neutral-800 h-12 w-1/2 rounded-md" />
      </div>
    </div>
  {/if}

  {#each Array(length) as item}
    <div class="bg-neutral-800 rounded-md h-24 w-full md:flex hidden" />
  {/each}
</div>
