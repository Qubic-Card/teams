<script>
  import { socialIcons } from '@lib/constants';
  import { socials, teamSocials } from '@lib/stores/editorStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

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
<ModalWrapper
  title="Add social media"
  on:showModal={toggleModal}
  {showModal}
  class="w-auto"
>
  <div
    class="grid grid-cols-4 justify-center bg-neutral-800 items-center p-4 rounded-lg"
  >
    {#each Object.keys(socialIcons) as item}
      <img
        width="64"
        height="64"
        class="m-1 p-2 border border-neutral-200 bg-neutral-800 cursor-pointer"
        on:click={() => addSocial(item)}
        src={socialIcons[item]}
        alt={item}
      />
    {/each}
  </div>
</ModalWrapper>
