<script>
  import { createEventDispatcher } from 'svelte';
  import CropModal from '@comp/modals/cropModal.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

  export let unsplashDatas, handleSave, updateData;

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

  let showModal;
  let searchQuery = '';
  let selectedImage;
  let downloadLocation = '';
  // INFO: state idle untuk memunculkan pilihan button upload from local atau unsplash
  let state = 'unsplash';
  let isBannerOpen = false;

  let image;
  let fileName;

  const closeBannerModal = () => (isBannerOpen = false);
  const handleCrop = async (item) => {
    image = URL.createObjectURL(item.file);
    fileName = item.id;
    isBannerOpen = true;
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
    state = 'unsplash';
    searchQuery = '';
  };

  const pickHandler = (img) => {
    selectedImage = img;

    getTrackDownloadLocation(img.id);
    dispatch('pickImage', img);
    toggleModal();
  };

  const searchHandler = () => dispatch('searchQuery', searchQuery);

  const onKeyPress = (e) => {
    if (e.charCode === 13) {
      searchHandler();
    }
  };
</script>

<CropModal
  isBanner
  aspect={3 / 1}
  isOpen={isBannerOpen}
  {handleSave}
  {image}
  {fileName}
  on:updatedData={updateData}
  on:closeModal={closeBannerModal}
/>

<button
  on:click={toggleModal}
  class="w-full text-black bg-neutral-100 rounded-md p-5 mt-2"
  >Select Background</button
>

{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div
      class="relative w-full h-full md:h-auto my-6 mx-auto md:max-w-3xl max-w-md"
    >
      <!--content-->
      <div
        class="border-0 shadow-lg relative flex flex-col w-full rounded-lg bg-white outline-none focus:outline-none"
      >
        <!--header-->
        <div class="border-b border-solid rounded-t">
          <div class="flex w-full h-16 px-4 justify-between items-center">
            <div class="flex">
              <p class="text-center translate-y-1">Powered By</p>
              <img src="/unsplash.png" alt="" class="w-32 ml-2" />
            </div>
            <p
              on:click={toggleModal}
              class="cursor-pointer text-3xl pr-4 text-black"
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
            </p>
          </div>
        </div>
        <div class="flex flex-col">
          {#if state === 'idle'}
            <div class="flexflex-col p-2 w-full gap-2">
              <button
                on:click={() => (state = 'unsplash')}
                class="w-full bg-blue-600 p-4 rounded-md text-white h-16 mb-2"
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
            <div class="px-12 mt-4 pb-4 w-full flex flex-row-reverse shadow-md">
              <button
                on:click={searchHandler}
                class="bg-neutral-100 w-32 mx-4 hover:bg-neutral-200 transition-colors duration-400 rounded-md"
                >Search</button
              >
              <input
                on:keypress={onKeyPress}
                bind:value={searchQuery}
                type="text"
                placeholder="Search for images..."
                class="p-4 bg-neutral-100 rounded-lg w-full"
              />
            </div>
            <div
              class="grid grid-cols-2 grid-flow-row p-8 text-black h-[700px] snap-container snap-y snap-mandatory overflow-y-auto"
            >
              {#if unsplashDatas === 0}
                <h1>No image to display</h1>
              {:else}
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
                        {item.alt_description === null
                          ? ''
                          : item.alt_description}
                      </h1>
                    </div>
                    <div class="flex items-center bg-white pt-2">
                      By
                      <p
                        on:click={() =>
                          toAuthorProfile(item.user.portfolio_url)}
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
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}

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
