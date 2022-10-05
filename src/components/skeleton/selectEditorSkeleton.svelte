<script>
  import { cards } from '@lib/stores/cardsStore';
</script>

<div
  class="animate-pulse w-full flex gap-2 h-screen justify-start items-center p-24"
>
  <div
    class="flex flex-col self-start rounded-3xl gap-2 w-full md:w-1/3 bg-neutral-100 h-full pt-16 pl-10"
  >
    <div class="flex p-4 bg-neutral-800 h-10 rounded-md w-48 mb-8" />
    {#if $cards}
      <div
        class="flex justify-center items-center bg-neutral-600 h-12 rounded-md gap-4 w-60 md:w-96"
      />
    {/if}
    <div class="flex p-4 bg-neutral-800 h-10 rounded-md w-40" />
    <div
      class="flex justify-center items-center bg-neutral-600 h-12 rounded-md gap-4 w-60 md:w-96"
    />
  </div>
  <!-- <div class="bg-neutral-800 rounded-md md:block hidden h-full w-[40%]" /> -->
</div>
