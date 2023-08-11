<script>
  import { fade } from 'svelte/transition';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const modalHandler = () => dispatch('modalHandler', false);

  export let isOpen = false;
  export let initialFocus = null;
  export let bg = 'bg-neutral-800';
  export let text = 'text-white';
  export let mobileHeight = 'h-[80%]';
  export let desktopHeight = 'md:h-[90%]';
  export let desktopWidth = 'md:w-1/3';
  export let desktopRight = 'md:right-64';
  export let desktopTop = 'md:top-[35%]';
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click={modalHandler}
  />
{/if}

<Dialog
  static
  {initialFocus}
  open={isOpen}
  on:close={modalHandler}
  class={`transition-all border 0 md:transition-none duration-300 ease-in-out ${
    isOpen
      ? `${mobileHeight} ${desktopHeight}`
      : 'h-0 translate-y-10 md:opacity-0'
  } flex 0 flex-col ml-0 lg:ml-12 w-full ${text} ${desktopWidth} md:max-w-md px-4 pb-4 gap-4 bottom-0 fixed ${desktopTop} ${desktopRight} lg:left-1/3 z-50  border-0 shadow-lg rounded-lg ${bg} outline-none focus:outline-none overflow-y-auto snap-container`}
>
  <slot />
</Dialog>

<!-- <style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }
</style> -->
