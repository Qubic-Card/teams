<script>
  import { socialIcons } from '@lib/constants';
  import { basicSocials } from '@lib/stores/editorStore';
  import { toastFailed } from '@lib/utils/toast';

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
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-auto my-6 mx-auto md:max-w-3xl max-w-md">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
      >
        <!--header-->
        <div class="p-5 border-b border-solid rounded-t">
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
        <!--body-->
        <div
          class="grid grid-cols-4 justify-center bg-gray-50 items-center p-4 rounded-lg cursor-pointer"
        >
          {#each Object.keys(socialIcons) as item}
            <img
              width="64"
              height="64"
              class="m-1 p-2 border rounded bg-white"
              on:click={() => addSocial(item)}
              src={item.includes('github')
                ? 'https://img.icons8.com/fluency/48/FA5252/github.png'
                : socialIcons[item]}
              alt={item}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
