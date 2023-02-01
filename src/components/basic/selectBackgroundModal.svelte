<script>
  import ModalWrapperHeadless from '@comp/modals/modalWrapperHeadless.svelte';
  import { createEventDispatcher } from 'svelte';
  import BasicCropModal from '@comp/basic/basicCropModal.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { basicProfile } from '@lib/stores/profileData';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';

  export let handleSave;

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
  );

  let pond;
  let name = 'filepond';

  let showModal = false;
  let searchQuery = '';
  let selectedImage;
  let downloadLocation = '';
  // INFO: state idle untuk memunculkan pilihan button upload from local atau unsplash
  let state = 'idle';
  let isBannerOpen = false;
  let isOpen = false;
  let query = '';
  let url;
  let accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY.toString();
  let image;
  let fileName;
  let unsplashDatas = [];

  const closeBannerModal = () => (isBannerOpen = false);
  const handleCrop = async (item) => {
    image = URL.createObjectURL(item.file);
    fileName = item.id;
    isBannerOpen = true;
    toggleModal();
    pond.removeFile();
  };

  const toAuthorProfile = (url) => window.open(url, '_blank');

  const getTrackDownloadLocation = async (id) => {
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

  const toggleModal = () => {
    showModal = !showModal;
    state = 'idle';
  };

  const handlePick = async (img) => {
    getTrackDownloadLocation(img.id);

    image = img.urls.regular;
    isBannerOpen = true;
    toggleModal();
  };

  const getUnsplash = async () => {
    try {
      url =
        `https://api.unsplash.com/search/photos?page=1&query=${
          query != '' ? query : 'background'
        }&client_id=` + accessKey;
      const res = await fetch(url);
      const data = await res.json();

      unsplashDatas = data.results;
    } catch (error) {
      console.log(error);
    }
  };

  $: query, getUnsplash();

  const updateData = (e) => {
    console.log(e.detail);
    if (e.detail.isBanner) {
      if ($basicProfile.isBusiness) {
        $basicProfile.design.backgroundBusiness = e.detail.url;
      } else {
        $basicProfile.design.background = e.detail.url;
      }

      query = '';
      fileName = '';
      image = '';
    } else {
      $basicProfile.avatar = e.detail.url;
    }
  };

  $: console.log($basicProfile.design);
</script>

<BasicCropModal
  isBanner
  aspect={3 / 1}
  isOpen={isBannerOpen}
  {handleSave}
  {image}
  {fileName}
  on:updatedData={(e) => {
    updateData(e);
    isBannerOpen = false;
  }}
  on:closeModal={closeBannerModal}
/>

<button
  on:click={toggleModal}
  class="w-full text-black bg-neutral-100 rounded-md p-5 mt-2 md:text-sm text-xs"
  >Select Background</button
>

<Dialog
  open={showModal}
  on:close={() => (showModal = false)}
  class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
>
  <DialogOverlay
    class="fixed inset-0 bg-black opacity-30 z-10"
    on:click={toggleModal}
  />
  <div
    class="flex flex-col bg-white text-black w-full z-40 rounded-md {state ===
    'idle'
      ? 'md:w-[400px] h-auto'
      : 'md:w-1/2 lg:w-1/3 h-full'}"
  >
    {#if state === 'idle'}
      <div class="flex flex-col justify-between p-2 w-full gap-2">
        <button class="text-black self-end"
          ><svg
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
        <button
          on:click={() => (state = 'unsplash')}
          class="w-full bg-blue-600 p-4 rounded-md text-white mb-2"
          >Unsplash</button
        >
        <FilePond
          bind:this={pond}
          {name}
          credits=""
          allowProcess={false}
          class="cursor-pointer"
          acceptedFileTypes={['image/png', 'image/jpeg']}
          instantUpload={false}
          imageCropAspectRatio={1 / 1}
          labelIdle="Add Background Image"
          allowMultiple={false}
          beforeAddFile={handleCrop}
        />
      </div>
    {:else if state === 'unsplash'}
      <div class="flex items-center justify-between p-4 text-black">
        <div class="flex justify-center items-center">
          <p class="text-center translate-y-1">Powered By</p>
          <img
            src="/unsplash.svg"
            alt=""
            class="w-32 ml-2 bg-white p-2 rounded-md"
          />
        </div>
        <button on:click={() => (showModal = false)}>
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
      <div
        class="px-4 md:px-6 mt-4 pb-4 w-full flex flex-row-reverse shadow-md"
      >
        <input
          on:keypress={getUnsplash}
          bind:value={query}
          type="text"
          placeholder="Search for more images..."
          class="p-2 bg-neutral-100 rounded-lg w-full border text-black border-neutral-300"
        />
      </div>
      <div
        class="grid grid-cols-2 grid-flow-row p-4 text-black h-full snap-container snap-y snap-mandatory overflow-y-auto"
      >
        {#if unsplashDatas}
          {#if unsplashDatas?.length === 0}
            <h1>No image to display</h1>
          {:else}
            {#each unsplashDatas as item}
              <div class="m-1 bg-black mt-2 flex flex-col">
                <button
                  on:click={() => handlePick(item)}
                  class={`flex flex-col justify-evenly items-center snap-center h-[250px] w-full object-cover bg-center bg-no-repeat p-2 cursor-pointer hover:opacity-50 text-transparent hover:text-white hover:font-semibold ${
                    item.urls.regular === selectedImage
                      ? 'border-4 border-black'
                      : ''
                  }`}
                  style={`background-image: url('${item.urls.regular}')`}
                >
                  <h1
                    class="uppercase text-center text-lg md:text-3xl breaks-all"
                  >
                    {item.alt_description === null ? '' : item.alt_description}
                  </h1>
                </button>
                <div
                  class="flex items-center justify-around md:justify-between bg-white pt-2 text-xs md:text-sm flex-grow"
                >
                  <button
                    on:click={() => toAuthorProfile(item.user.portfolio_url)}
                    class="underline cursor-pointer ml-2"
                  >
                    By {item.user.name}
                  </button>
                  <button
                    on:click={() => toAuthorProfile(item.user.portfolio_url)}
                  >
                    <img
                      src="https://img.icons8.com/material-outlined/48/000000/external-link.png"
                      alt="external link"
                      class="w-4 h-4 cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        {/if}
      </div>
    {/if}
  </div>
</Dialog>

<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
    width: 8px;
  }

  .snap-container::-webkit-scrollbar-thumb {
    background: rgb(170, 170, 170);
  }

  /* Handle on hover */
  .snap-container::-webkit-scrollbar-thumb:hover {
    background: rgb(163, 163, 163);
  }
</style>
