<script>
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { createEventDispatcher } from 'svelte';
  
  export let showModal

  const dispatch = createEventDispatcher();

  const toggleModal = () => dispatch('showModal');
</script>

{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-1/2 my-6 mx-auto md:max-w-3xl max-w-md">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-900 outline-none focus:outline-none"
      >
        <!--header-->
        <div class="p-3 border-b border-solid rounded-t">
          <div class="flex w-full justify-end items-center">
            <p on:click={toggleModal} class="cursor-pointer font-bold text-2xl">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <div
          class="flex flex-col justify-center bg-neutral-900 items-center p-4 py-10 gap-4 rounded-lg"
        >
          <div class="bg-white rounded-xl p-4"> 
            <img src="https://img.icons8.com/ios/100/000000/behavior-blocker.png"/>
          </div>
          <h1 class="text-2xl text-center font-bold">
            You do not have access to this page
          </h1>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
