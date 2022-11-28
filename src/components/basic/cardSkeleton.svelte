<div class="flex gap-2">
  <div
    class="snap-center animate-pulse aspect-[8/5] md:h-[280px] rounded-lg h-[200px] mr-4 flex-shrink-0 flex flex-col justify-between bg-neutral-300 border-2 border-neutral-200"
  >
    <div class="flex flex-col justify-between gap-2 h-full w-full p-8">
      <div class="flex flex-col gap-2">
        <div class="bg-neutral-200 h-12 w-1/2" />
        <div class="bg-neutral-200 h-10 w-1/3" />
      </div>
      <div class="flex gap-2 justify-between">
        <div class="bg-neutral-200 h-12 w-20" />
        <div class="bg-neutral-200 h-12 w-20" />
      </div>
    </div>
    <div class="bg-neutral-200 h-20 w-full" />
  </div>
</div>

<div class="flex justify-end gap-2 animate-pulse mt-4">
  <div class="bg-neutral-200 h-12 rounded-md w-80" />
  <div class="bg-neutral-300 h-12 rounded-md w-20" />
</div>

<div class="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-2 my-4">
  {#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as item}
    <div class="flex gap-2 justify-center items-center">
      <div class="bg-neutral-300 h-12 w-12 rounded-md" />
      <div class="bg-neutral-200 h-16 rounded-md w-full" />
    </div>
  {/each}
</div>
