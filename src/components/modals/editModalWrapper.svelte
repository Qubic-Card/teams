<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let title, showModal;

  const dispatch = createEventDispatcher();

  const toggleModal = () => dispatch('showModal');
  const handler = () => dispatch('save');
</script>

{#if showModal}
  <div
    transition:fly|local={{ duration: 500, x: 400 }}
    class={`flex flex-col h-screen w-1/3 p-4 pt-20 bottom-0 z-30 absolute bg-neutral-800 border-l-2 border-neutral-700 transition-all duration-300 ease-in-out overflow-y-auto snap-y snap-mandatory  ${
      showModal ? 'right-0' : '-right-40'
    }`}
  >
    <div
      class="flex justify-between border-b-2 border-neutral-700 mb-4 pb-2 text-white"
    >
      <p>{title ?? ''}</p>
      <p class="text-lg cursor-pointer" on:click={toggleModal}>x</p>
    </div>

    <slot />

    <div class="self-end bottom flex gap-4">
      <button
        class="p-2 border-2 border-neutral-700 w-24"
        on:click={toggleModal}>Cancel</button
      >
      <button class="p-2 bg-blue-600 w-24" on:click={handler}>Save</button>
    </div>
  </div>
{/if}
