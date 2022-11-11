<script>
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import ModalWrapperHeadless from '@comp/modals/modalWrapperHeadless.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
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
  import getFileFromBase64 from '@lib/utils/getFileFromBase64';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';

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
  let isLoading = false;

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
    fileName = img.id.trim();
    unsplashImageId = img.id;
    showModal = true;
    isOpen = false;
    searchQuery = '';

    dispatch('pick', 'background');
    toggleModal();
  };

  const searchHandler = () => dispatch('searchQuery', searchQuery);

  const setState = (newState) => (state = newState);

  const cropImage = async () => {
    croppedImage = await getCroppedImg(image, pixelCrop);
    fileImage = getFileFromBase64(croppedImage, fileName);

    pond.removeFile();
  };

  const previewCrop = (e) => {
    pixelCrop = e.detail.pixels;
    const { x, y, width } = e.detail.pixels;
    const scale = 200 / width;
  };

  const handleCrop = async (item) => {
    image = URL.createObjectURL(item.file);
    fileName = item.id.trim();
    isOpen = false;
    showModal = !showModal;
    return true;
  };

  const handleAddFile = async () => {
    isLoading = true;
    const { data } = await supabase.storage
      .from('banner')
      .upload(`${$user?.id}/${fileName}`, fileImage, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('banner')
      .getPublicUrl(`${$user?.id}/${fileName}`);

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
    isLoading = false;
    image = undefined;
  };

  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      searchHandler();
    }
  };
</script>

<ModalOverlay isOpen={showModal} on:click={() => (showModal = false)} />

{#if image !== undefined}
  <Dialog
    static
    class={`${
      showModal ? 'translate-x-0' : 'translate-x-[900px]'
    } transition-all duration-300 ease-in-out justify-between flex flex-col h-screen w-3/4 md:w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
    open={showModal}
    on:close={() => {
      showModal = false;
      setState('idle');
    }}
  >
    <div class="h-full flex flex-col gap-2">
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
          transition:fade|local={{ duration: 300 }}
          src={croppedImage}
          alt="Cropped profile"
          class="w-full h-40 rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-contain"
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
          disabled={isLoading}
          type="button"
          class="bg-blue-600 p-2 w-1/2 text-white rounded-md disabled:bg-blue-600/60 h-12 shadow-md flex justify-center items-center gap-2"
          on:click={async () => await handleAddFile()}
        >
          {#if isLoading}
            <Spinner bg="#1f4496" class="w-6 h-6" />
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
{/if}

<button
  on:click={() => (isOpen = true)}
  class="w-full text-neutral-700 bg-neutral-200 rounded-md p-5 text-xs md:text-sm h-16"
  >Select Background</button
>

<!-- {#if isOpen} -->
<ModalWrapperHeadless
  desktopWidth="md:w-1/2 lg:w-1/3"
  desktopRight="md:right-1/4"
  desktopTop={state === 'idle' ? 'md:top-[35%]' : 'md:top-0'}
  desktopHeight={state === 'idle' ? 'md:h-[29%]' : 'h-screen'}
  mobileHeight={state === 'idle' ? 'h-[40%]' : 'h-screen'}
  {isOpen}
  on:modalHandler={(e) => {
    isOpen = e.detail;
    setState('idle');
  }}
>
  {#if state === 'idle'}
    <div class="p-2 flex justify-between">
      <h1 class="font-semibold">Select background image</h1>
      <button
        on:click={() => {
          isOpen = false;
          setState('idle');
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
    </div>
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
    <div class="flex items-center justify-between p-2">
      <div class="flex">
        <p class="text-center translate-y-1">Powered By</p>
        <img
          src="/unsplash.svg"
          alt=""
          class="w-32 ml-2 bg-white p-2 rounded-md"
        />
      </div>
      <button
        on:click={() => {
          isOpen = false;
          setState('idle');
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
    </div>
    <div class="flex flex-col" in:fade|local>
      <div class="p-2 w-full flex flex-row-reverse shadow-md">
        <button
          on:click={searchHandler}
          class="bg-neutral-700 text-white w-32 mx-4 hover:font-semibold hover:bg-neutral-800 transition-colors duration-400 rounded-md"
          >Search</button
        >
        <input
          on:keypress={onKeyPress}
          bind:value={searchQuery}
          type="text"
          placeholder="Search for more images..."
          class="p-2 bg-neutral-700 text-white rounded-lg w-full"
        />
      </div>
      {#if unsplashDatas}
        <div
          class={`${
            unsplashDatas.length > 0 ? 'grid' : 'flex'
          } grid-cols-2 grid-flow-row p-2 text-black h-1/2 snap-container snap-y snap-mandatory overflow-y-auto`}
        >
          {#if unsplashDatas.length > 0}
            {#each unsplashDatas as item}
              <div class="m-1 bg-black mt-2 flex flex-col">
                <div
                  on:click={() => pickHandler(item)}
                  class={`flex flex-col justify-evenly items-center snap-center h-[250px] w-full object-cover bg-center bg-no-repeat p-2 cursor-pointer hover:opacity-50 text-transparent hover:text-white hover:font-semibold ${
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
                <div
                  class="flex items-center justify-around md:justify-between bg-neutral-800 pt-2 text-xs md:text-sm flex-grow"
                >
                  <p
                    on:click={() => toAuthorProfile(item.user.portfolio_url)}
                    class="underline cursor-pointer ml-2 text-white"
                  >
                    By {item.user.name}
                  </p>
                  <img
                    on:click={() => toAuthorProfile(item.user.portfolio_url)}
                    src="https://img.icons8.com/ios/100/FFFFFF/external-link-squared.png"
                    alt="external link"
                    class="w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            {/each}
          {:else}
            <h1 class="text-neutral-100 text-xl text-center w-full">
              No image to display
            </h1>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</ModalWrapperHeadless>

<!-- {/if} -->
<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
    width: 8px;
  }

  .snap-container::-webkit-scrollbar-track {
    background-color: #171717;
  }

  .snap-container::-webkit-scrollbar-thumb {
    background-color: #a8a8a8;
  }
</style>
