<script>
  import { toastSuccess } from '@lib/utils/toast';
  import { createEventDispatcher } from 'svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

  export let showModal;
  export let unsplashDatas;
  export let modalHandler;

  let searchQuery = '';
  let selectedImage;
  let downloadLocation = '';

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
    dispatch('showModal');
  };

  const pickHandler = (image) => {
    selectedImage = image;

    getTrackDownloadLocation(image.id);
    dispatch('pickImage', image);
    toastSuccess('Background image changed successfully');
    toggleModal();
  };

  const searchHandler = () => {
    dispatch('searchQuery', searchQuery);
  };
</script>

<ModalWrapper
  title="Select background image"
  {showModal}
  on:showModal={modalHandler}
>
  <div class="flex flex-col">
    <div class="px-12 mt-4 pb-4 w-full flex flex-row-reverse shadow-md">
      <button
        on:click={searchHandler}
        class="bg-neutral-700 text-white w-32 mx-4 hover:font-bold hover:bg-neutral-800 transition-colors duration-400"
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
      {/if}
    </div>
  </div>
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
