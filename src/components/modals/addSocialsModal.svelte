<script>
  import { socialIcons } from '@lib/constants';
  import { socials } from '@lib/stores/editorStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';

  let showModal = false;

  const toggleModal = () => {
    showModal = !showModal;
  };
  const addSocial = (item) => {
    let socialType = $socials.map((item) => item.type);
    socialType.includes(item)
      ? toastFailed('You can only add one of each social media')
      : socials.set([...$socials, { type: item, data: '', isActive: true }]);

    showModal = !showModal;
  };
</script>

<button type="button" on:click={toggleModal} class={$$props.class}>
  <img class="h-10 w-10" src="/add-icon.svg" alt="add" />
</button>
{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-auto my-6 mx-auto md:max-w-3xl max-w-md">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-800 outline-none focus:outline-none"
      >
        <!--header-->
        <div class="p-5 border-b border-solid rounded-t">
          <div class="flex w-full justify-between items-center text-gray-100">
            <h3 class="text-2xl font-semibold">Add Socials</h3>
            <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <div
          class="grid grid-cols-4 justify-center bg-neutral-800 items-center p-4 rounded-lg"
        >
          {#each Object.keys(socialIcons) as item}
            <img
              width="64"
              height="64"
              class="m-1 p-2 border border-neutral-200 bg-neutral-800"
              on:click={() => addSocial(item)}
              src={socialIcons[item]}
              alt={item}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
