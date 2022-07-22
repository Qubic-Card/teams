<script>
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import supabase from '@lib/db';
  import { profileData } from '@lib/stores/profileData';
  import { user } from '@lib/stores/userStore';
  import getCroppedImg from '@lib/utils/canvas';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import Cropper from 'svelte-easy-crop';
  import { fade } from 'svelte/transition';
  // $: console.log($profileData.avatar);
  export let handleSave;
  export let isOpen = false;
  export let fileName;
  export let image;
  $: console.log(image, fileName);
  let pixelCrop;
  let croppedImage = '';
  let fileImage;

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
    // const { data: remove_data, error: remove_err } = await supabase.storage
    //   .from('avatars')
    //   .remove([`${$user?.id}/${fileName}`]);

    const { data, error: err } = await supabase.storage
      .from('avatars')
      .update(`${$user?.id}/${fileName}`, fileImage, {
        contentType: 'image/jpeg',
      });

    // console.log(data, remove_data, err, remove_err);

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${fileName}`);

    $profileData.avatar = publicURL;
    // console.log($profileData.avatar);
    await handleSave();
    isOpen = false;
  };
</script>

<ModalOverlay {isOpen} on:click={() => (isOpen = false)} />

<Dialog
  static
  class={`${
    isOpen ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all duration-300 ease-in-out flex flex-col h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
  open={isOpen}
  on:close={() => (isOpen = false)}
>
  <div class="flex w-full gap-2">
    <button
      type="button"
      class="bg-neutral-600 p-2 w-1/2"
      on:click={() => {
        image = $profileData.avatar;
        croppedImage = null;
      }}>Reset</button
    >
    {#if croppedImage}
      <button
        type="button"
        class="bg-blue-600 p-2 w-1/2"
        on:click={async () => await handleSaveCroppedImage()}>Save</button
      >
    {:else}
      <button
        type="button"
        class="bg-blue-600 p-2 w-1/2"
        on:click={async () => await cropImage()}>Crop</button
      >
    {/if}
  </div>
  <h2>Crop image</h2>
  <div class="relative h-1/2">
    <Cropper
      {image}
      aspect={1}
      zoom="1"
      crop={{ x: 0, y: 0 }}
      on:cropcomplete={previewCrop}
    />
  </div>
  {#if croppedImage}
    <h2>Cropped Image</h2>
    <img
      src={croppedImage}
      alt="Cropped profile"
      class="w-64 h-64 rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover"
    /><br />
  {/if}
</Dialog>
