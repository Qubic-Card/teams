<script>
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

  export let showModal;
  export let modalHandler;
</script>

<ModalWrapper {showModal} on:showModal={modalHandler} class="w-1/2">
  <div
    class="flex flex-col justify-center bg-neutral-900 items-center p-4 py-10 gap-4 rounded-lg"
  >
    <div class="bg-white rounded-xl p-4">
      <img
        src="https://img.icons8.com/ios/100/000000/behavior-blocker.png"
        alt="blocked"
      />
    </div>
    <h1 class="text-2xl text-center font-bold">
      You do not have access to this page
    </h1>
  </div>
</ModalWrapper>
