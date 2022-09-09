<script>
  import { createEventDispatcher } from 'svelte';

  export let title, showModal, isUnsplash;

  const dispatch = createEventDispatcher();

  const toggleModal = () => dispatch('showModal');
</script>

{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class={`relative my-6 mx-auto md:max-w-3xl max-w-md ${$$props.class}`}>
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col overflow-x-hidden w-full bg-neutral-900 outline-none focus:outline-none h-full overflow-y-auto snap-y snap-mandatory snap-container"
      >
        <!--header-->
        <div
          class="p-5 border-b-2 border-neutral-700 mb-4 border-solid rounded-t"
        >
          <div class="flex w-full text-white justify-between items-center">
            {#if isUnsplash}
              <div class="flex items-center">
                <p class="text-center translate-y-1">Powered By</p>
                <img
                  src="/unsplash.svg"
                  alt=""
                  class="w-32 ml-2 bg-white p-2 rounded-md"
                />
              </div>
            {:else}
              <h3 class="text-xl font-semibold">{title ?? ''}</h3>
            {/if}
            <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <slot />
      </div>
    </div>
  </div>
  <div class="fixed inset-0 z-40 bg-black/50" />
{/if}

<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
    width: 5px;
  }
  .snap-container::-webkit-scrollbar-track {
    background-color: #e4e4e4;
  }
  .snap-container::-webkit-scrollbar-thumb {
    background-color: #71717a;
  }
</style>
