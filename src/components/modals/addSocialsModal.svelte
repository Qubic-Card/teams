<script>
  import { socialIcons } from '@lib/constants';
  import { socials, teamSocials } from '@lib/stores/editorStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { Dialog, DialogTitle } from '@rgossiaux/svelte-headlessui';
  import ModalOverlay from './modalOverlay.svelte';

  let showModal = false;
  export let isTeam = false;

  const toggleModal = () => {
    showModal = !showModal;
  };
  const addSocial = (item) => {
    if (isTeam) {
      let socialType = $teamSocials.map((item) => item.type);
      socialType.includes(item)
        ? toastFailed('You can only add one of each social media')
        : teamSocials.set([
            ...$teamSocials,
            { type: item, data: '', isActive: true },
          ]);
    } else {
      let socialType = $socials.map((item) => item.type);
      socialType.includes(item)
        ? toastFailed('You can only add one of each social media')
        : socials.set([...$socials, { type: item, data: '', isActive: true }]);
    }

    showModal = !showModal;
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
    <DialogTitle class="text-xl pb-2 border-b-2 border-neutral-700 z-30"
      >Add Social Media</DialogTitle
    >
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
