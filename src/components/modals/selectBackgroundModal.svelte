<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import Cropper from 'svelte-easy-crop';
  import getCroppedImg from '@lib/utils/canvas';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { profileData } from '@lib/stores/profileData';
  import CropModal from '@comp/modals/cropModal.svelte';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import getFileFromBase64 from '@lib/utils/getFileFromBase64';
  import supabase from '@lib/db';
  import { links, socials } from '@lib/stores/editorStore';
  import { user } from '@lib/stores/userStore';
  import { page } from '$app/stores';

  // Register the plugins
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
  );

  export let unsplashDatas, handleSave;

  let pond;
  let name = 'filepond';
  let searchQuery = '';
  let selectedImage;
  let state = 'idle';
  let isOpen = false;
  let croppedImage = '';
  let fileName = '';
  let pixelCrop;
  let image;
  let fileImage;
  let unsplashImageId = null;
  let showModal = false;

  const toAuthorProfile = (url) => window.open(url, '_blank');

  const getTrackDownloadLocation = async (id) => {
    let downloadLocation = '';
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/${id}/download?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY.toString()}`
      );

      if (!res.ok) {
        throw Error(res.statusText);
      }

      downloadLocation = await res.url;
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = createEventDispatcher();

  const toggleModal = () => dispatch('showModal');

  const pickHandler = (img) => {
    selectedImage = img;
    image = img.urls.regular;
    fileName = img.user.first_name + img.id;
    unsplashImageId = img.id;
    isOpen = true;
    showModal = false;
    searchQuery = '';

    toggleModal();
  };

  const searchHandler = () => dispatch('searchQuery', searchQuery);

  const setState = (newState) => (state = newState);

  const cropImage = async () => {
    croppedImage = await getCroppedImg(image, pixelCrop);
    fileImage = getFileFromBase64(croppedImage, fileName);
  };

  const previewCrop = (e) => {
    pixelCrop = e.detail.pixels;
    const { x, y, width } = e.detail.pixels;
    const scale = 200 / width;
  };

  const handleCrop = async (item) => {
    image = URL.createObjectURL(item.file);
    fileName = item.filename;
    isOpen = true;
    showModal = !showModal;
    return true;
  };

  const handleAddFile = async () => {
    let timestamp = new Date().getTime();

    const { data } = await supabase.storage
      .from('banner')
      .upload(`${$user?.id}/${timestamp}${fileName}`, fileImage, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('banner')
      .getPublicUrl(`${$user?.id}/${timestamp}${fileName}`);

    croppedImage = '';
    isOpen = false;
    $profileData.design.background = publicURL;
    showModal = false;
    setState('idle');

    if (state === 'unsplash') {
      getTrackDownloadLocation(unsplashImageId);
      toastSuccess('Background image changed successfully');
      setState('idle');
      showModal = false;
    }

    await handleSave();
  };
</script>

<ModalOverlay
  {isOpen}
  on:click={() => {
    isOpen = false;
    setState('idle');
  }}
/>

{#if image !== undefined}
  <Dialog
    static
    class={`${
      isOpen ? 'translate-x-0' : 'translate-x-[900px]'
    } transition-all duration-300 ease-in-out flex flex-col h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
    open={isOpen}
    on:close={() => {
      isOpen = false;
      setState('idle');
    }}
  >
    <div class="flex w-full gap-2">
      <button
        type="button"
        class="bg-neutral-600 p-2 w-1/2"
        on:click={() => (croppedImage = null)}>Reset</button
      >
      {#if croppedImage}
        <button
          type="button"
          class="bg-blue-600 p-2 w-1/2"
          on:click={async () => await handleAddFile()}>Save</button
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
        aspect={3 / 1}
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
        class="w-full h-32 rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover"
      /><br />
    {/if}
  </Dialog>
{/if}

<button
  on:click={() => (showModal = true)}
  class="w-full text-white bg-neutral-500 rounded-md p-5 mt-2"
  >Select Background</button
>

<ModalWrapper
  isUnsplash={state === 'unsplash'}
  title="Select background image"
  class="w-1/2"
  {showModal}
  on:showModal={() => {
    showModal = !showModal;
    isOpen = false;
    setState('idle');
  }}
>
  {#if state === 'idle'}
    <button
      on:click={() => setState('unsplash')}
      class="bg-blue-600 text-white mx-8 h-20 rounded-md mb-2"
      >Upload from Unsplash</button
    >
    <div class="mx-8 h-24" in:fade|local>
      <FilePond
        bind:this={pond}
        {name}
        credits=""
        allowProcess={true}
        class="cursor-pointer"
        acceptedFileTypes={['image/png', 'image/jpeg']}
        instantUpload={false}
        labelIdle="Add background image"
        beforeAddFile={handleCrop}
        allowMultiple={false}
      />
    </div>
  {:else if state === 'unsplash'}
    <div class="flex flex-col" in:fade|local>
      <div class="p-2 w-full flex flex-row-reverse shadow-md">
        <button
          on:click={searchHandler}
          class="bg-neutral-700 text-white w-32 mx-4 hover:font-bold hover:bg-neutral-800 transition-colors duration-400 rounded-md"
          >Search</button
        >
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Search for images..."
          class="p-4 bg-neutral-700 text-white rounded-lg w-full"
        />
      </div>
      <div
        class={`${
          unsplashDatas.length > 0 ? 'grid' : 'flex'
        } grid-cols-2 grid-flow-row p-2 text-black h-[700px] snap-container snap-y snap-mandatory overflow-y-auto`}
      >
        {#if unsplashDatas}
          {#if unsplashDatas.length > 0}
            {#each unsplashDatas as item}
              <div class="m-1 bg-black mt-2">
                <div
                  on:click={() => pickHandler(item)}
                  class={`flex flex-col justify-evenly items-center snap-center h-[250px] w-full object-cover bg-center bg-no-repeat p-2 cursor-pointer hover:opacity-50 text-transparent hover:text-white hover:font-bold ${
                    item.urls.regular === selectedImage
                      ? 'border-4 border-black'
                      : ''
                  }`}
                  style={`background-image: url('${item.urls.regular}')`}
                >
                  <h1 class="uppercase text-center text-3xl">
                    {item.alt_description === null ? '' : item.alt_description}
                  </h1>
                </div>
                <div class="flex items-center bg-white pt-2">
                  By
                  <p
                    on:click={() => toAuthorProfile(item.user.portfolio_url)}
                    class="underline cursor-pointer ml-2"
                  >
                    {item.user.name}
                  </p>
                  <img
                    src="https://img.icons8.com/material-outlined/48/000000/external-link.png"
                    alt="external link"
                    class="w-4 h-4"
                  />
                </div>
              </div>
            {/each}
          {:else}
            <h1 class="text-neutral-100 text-xl text-center w-full">
              No image to display
            </h1>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</ModalWrapper>

<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
  }

  .snap-container::-webkit-scrollbar-track {
    background-color: #d6d6d6;
  }

  .snap-container::-webkit-scrollbar-thumb {
    background-color: #a8a8a8;
  }
</style>
