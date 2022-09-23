<script>
  import { socialIcons } from '@lib/constants';
  import { socials, teamSocials } from '@lib/stores/editorStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { Dialog, DialogTitle } from '@rgossiaux/svelte-headlessui';
  import ModalOverlay from './modalOverlay.svelte';

  let showModal = false;
  export let isTeam = false;

  const toggleModal = () => (showModal = !showModal);

  const addSocial = (item) => {
    if (isTeam) {
      let socialType = $teamSocials
        .map((item) => item.type)
        .filter((type) => type === item);

      socialType.length >= 2
        ? toastFailed('You can only add two of each social media')
        : teamSocials.set([
            ...$teamSocials,
            { type: item, data: '', isActive: true },
          ]);
      if (socialType.length < 2) toastSuccess(`${item} successfully added`);
    } else {
      let socialType = $socials
        .map((item) => item.type)
        .filter((type) => type === item);

      socialType.length >= 2
        ? toastFailed('You can only add two of each social media')
        : socials.set([...$socials, { type: item, data: '', isActive: true }]);
      if (socialType.length < 2) toastSuccess(`${item} successfully added`);
    }
  };
</script>

<button type="button" on:click={toggleModal} class={$$props.class}>
  <img class="h-10 w-10" src="/add-icon.svg" alt="add" />
</button>

{#if showModal}
  <ModalOverlay isOpen={showModal} on:click={() => (showModal = false)} />
  <Dialog
    static
    open={showModal}
    on:close={() => (showModal = false)}
    class={`${
      showModal ? 'translate-x-0' : 'translate-x-[900px]'
    } transition-all duration-300 ease-in-out flex flex-col h-screen w-[320px] z-50 p-4 gap-4 bottom-0 right-0 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
  >
    <div
      class="flex w-full items-center justify-between border-b-2 border-neutral-700"
    >
      <DialogTitle class="text-lg pb-2 z-30">Add Social Media</DialogTitle>
      <button on:click={toggleModal} class="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg></button
      >
    </div>

    <div
      class="flex flex-col justify-center bg-neutral-800 items-center p- rounded-lg"
    >
      {#each Object.keys(socialIcons) as item}
        <div
          on:click={() => addSocial(item)}
          class="cursor-pointer flex rounded m-1 flex-row w-full border border-neutral-600"
        >
          <img
            width="48"
            height="48"
            class="p-2"
            src={socialIcons[item]}
            alt={item}
          />
          <p class="flex justify-center items-center">{item}</p>
        </div>
      {/each}
    </div>
  </Dialog>
{/if}
