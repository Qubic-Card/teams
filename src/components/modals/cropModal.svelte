<script>
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import supabase from '@lib/db';
  import { profileData } from '@lib/stores/profileData';
  import { user } from '@lib/stores/userStore';
  import getCroppedImg from '@lib/utils/canvas';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import Cropper from 'svelte-easy-crop';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let handleSave,
    isOpen = false,
    fileName,
    image,
    aspect = 1 / 1,
    isBanner = false;

  let pixelCrop;
  let croppedImage = '';
  let fileImage;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  const closeModal = () => {
    dispatch('closeModal', false);
    croppedImage = '';
  };

  const previewCrop = (e) => {
    pixelCrop = e.detail.pixels;
    const { x, y, width } = e.detail.pixels;
    const scale = 200 / width;
  };

  const getFileFromBase64 = (string64, fileName) => {
    const trimmedString = string64?.replace('data:image/jpeg;base64,', '');
    const imageContent = atob(trimmedString);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    const type = 'image/jpeg';
    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, {
      lastModified: new Date().getTime(),
      type,
    });
  };

  const cropImage = async () => {
    croppedImage = await getCroppedImg(image, pixelCrop);
    fileImage = getFileFromBase64(croppedImage, fileName);
  };

  const handleSaveCroppedImage = async () => {
    const { data, error: err } = await supabase.storage
      .from('avatars')
      .update(`${$user?.id}/${fileName}`, fileImage, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${fileName}`);

    $profileData.avatar = publicURL;
    await handleSave();
    isOpen = false;
  };
</script>

<!-- <ModalOverlay {isOpen} on:click={() => (isOpen = false)} /> -->

<Dialog
  static
  class={`${
    isOpen ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all flex flex-col justify-between duration-300 ease-in-out h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
  open={isOpen}
  on:close={() => (isOpen = false)}
>
  <button
    class="self-end mt-8"
    on:click={() => {
      isOpen = false;
      closeModal();
    }}
  >
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
    </svg>
  </button>

  <div class="h-full flex flex-col gap-4">
    <h1>Crop image</h1>
    <div class="relative h-1/2">
      <Cropper
        {image}
        {aspect}
        zoom="1"
        crop={{ x: 0, y: 0 }}
        on:cropcomplete={previewCrop}
      />
    </div>
    {#if croppedImage}
      <h1>Preview</h1>
      <img
        src={croppedImage}
        alt="Cropped profile"
        class="{isBanner
          ? 'w-full h-48'
          : 'w-64 h-64'} rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover"
      /><br />
    {/if}
  </div>
  <div class="flex w-full gap-2">
    {#if croppedImage}
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-black p-2 w-1/2 text-white rounded-md h-12 shadow-md"
        on:click={() => {
          croppedImage = null;
        }}>Reset</button
      >
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-blue-600 p-2 w-1/2 text-white rounded-md h-12 shadow-md flex justify-center items-center gap-2"
        on:click={async () => {}}
      >
        {#if isLoading}
          <Spinner class="w-6 h-6" />
        {/if}
        Save
      </button>
    {:else}
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-blue-600 p-2 w-full text-white rounded-md h-12 shadow-md"
        on:click={async () => await cropImage()}>Crop</button
      >
    {/if}
  </div>
</Dialog>
