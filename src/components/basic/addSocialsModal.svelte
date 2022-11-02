<script>
  import { socialIcons } from '@lib/constants';
  import { basicSocials } from '@lib/stores/editorStore';
  import { toastFailed } from '@lib/utils/toast';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';

  export let profileData;

  let showModal = false;

  const toggleModal = () => (showModal = !showModal);

  const addSocial = (item) => {
    let socialType = $basicSocials.map((item) => item.type);
    socialType.includes(!profileData.isBusiness ? item : item + '-business')
      ? toastFailed('You can only add one of each social media')
      : basicSocials.set([
          {
            type: !profileData.isBusiness ? item : item + '-business',
            data: '',
            isActive: true,
          },
          ...$basicSocials,
        ]);

    showModal = !showModal;
  };
</script>

<button type="button" on:click={toggleModal}>
  <img
    class="h-10 w-10"
    src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/48/000000/external-add-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"
    alt="add"
  />
</button>
{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-50 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col bg-white text-black w-full md:w-96 h-auto z-40 rounded-md"
    >
      <div class="p-4 border-b border-solid rounded-t">
        <div class="flex w-full justify-between items-center">
          <h3 class="text-xl font-regular">Add Socials</h3>
          <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
            <img
              width="20"
              height="20"
              src="/icons/icons8-close-48.png"
              alt="close"
            />
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-4 justify-center place-items-center bg-gray-50 items-center p-4 rounded-lg cursor-pointer"
      >
        {#each Object.keys(socialIcons) as item}
          <img
            width="64"
            height="64"
            class="m-1 p-2 border rounded bg-white"
            on:click={() => addSocial(item)}
            src={socialIcons[item]}
            alt={item}
          />
        {/each}
      </div>
    </div>
  </Dialog>
{/if}
