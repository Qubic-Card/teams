<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import Cropper from 'svelte-easy-crop';
  import getCroppedImg from '@lib/utils/canvas';
  import CropModal from '@comp/modals/cropModal.svelte';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import { createEventDispatcher } from 'svelte';
  import getFileFromBase64 from '@lib/utils/getFileFromBase64';
  import { fade } from 'svelte/transition';

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
  );

  export let mode = 'add',
    data,
    input;

  let pond;
  let name = 'filepond';

  let showModal = false;
  let loading = false;

  let isOpen = false;
  let croppedImage = '';
  let fileName = '';
  let pixelCrop;
  let image;
  let fileImage;
  let isLoading = false;

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
    showModal = false;
    pond.removeFile();
    image = URL.createObjectURL(item.file);
    fileName = item.id.trim();
    isOpen = true;
    return true;
  };

  const handleAddFile = async () => {
    isLoading = true;
    // const { data } = await supabase.storage
    //   .from('avatars')
    //   .upload(`${$user?.id}/${fileName}`, fileImage, {
    //     contentType: 'image/jpeg',
    //   });

    // const { publicURL, error } = supabase.storage
    //   .from('avatars')
    //   .getPublicUrl(`${$user?.id}/${fileName}`);

    pond.removeFile();
    croppedImage = '';
    isOpen = false;

    isLoading = false;
  };

  const toggleModal = () => (showModal = !showModal);

  const dispatch = createEventDispatcher();

  const action = () => {
    dispatch('action', input);
    showModal = false;
    input = {
      Name: '',
      PointName: '',
      Metadata: {
        Desc: '',
        Logo: 'https://placeimg.com/640/480/any',
      },
    };
  };
</script>

<Dialog
  static
  class={`${
    isOpen ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all duration-300 justify-between ease-in-out flex flex-col h-screen w-3/4 md:w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
  open={isOpen}
  on:close={() => {
    isOpen = false;
    showModal = true;
    croppedImage = '';
    pond.removeFile();
  }}
>
  <div class="h-full flex flex-col gap-2">
    <h2>Crop image</h2>
    {#if image}
      <div class="relative h-1/2">
        <Cropper
          {image}
          aspect={1}
          zoom="1"
          crop={{ x: 0, y: 0 }}
          on:cropcomplete={previewCrop}
        />
      </div>
    {/if}
    {#if croppedImage}
      <h2>Cropped Image</h2>
      <img
        transition:fade|local={{ duration: 300 }}
        src={croppedImage}
        alt="Cropped profile"
        class="w-64 h-64 rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover"
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
        class="bg-blue-600 p-2 w-1/2 text-white disabled:bg-blue-600/60 rounded-md h-12 shadow-md flex justify-center items-center gap-2"
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

{#if mode === 'add'}
  <button
    on:click={toggleModal}
    class="flex justify-center items-center bg-blue-600 rounded-md h-7 text-xs md:text-sm p-2"
    >Add new Tenant</button
  >
{:else}
  <img
    on:click={toggleModal}
    src="/edit-icon.svg"
    alt=""
    class="h-6 md:h-7 w-6 md:w-7 bg-blue-600 p-1 rounded-md cursor-pointer"
  />
{/if}

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 {isOpen
      ? 'z-20'
      : 'z-50'} overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-50 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col bg-neutral-900 text-white w-full md:w-[40%] h-[85%] md:h-[52%] z-50 rounded-md"
    >
      <div
        class="text-md md:text-lg border-b border-neutral-700 flex justify-between p-4"
      >
        {mode === 'add' ? 'Add' : 'Edit'} New Tenant
        <button on:click={toggleModal} class="self-start">
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
      <div class="flex flex-col p-4 gap-2 justify-between h-full">
        <div class="flex gap-2">
          <img
            src="https://placeimg.com/640/480/any"
            alt=""
            class="w-28 h-28 rounded-md"
          />
          <div class="flex flex-col gap-2 w-full">
            <FilePond
              bind:this={pond}
              {name}
              credits=""
              allowProcess={true}
              class="cursor-pointer"
              acceptedFileTypes={['image/png', 'image/jpeg']}
              instantUpload={false}
              labelIdle="Add Profile Picture"
              allowMultiple={false}
              beforeAddFile={handleCrop}
            />
            <label
              for="links"
              class="flex items-center cursor-pointer gap-2 ml-2 text-neutral-100 md:text-sm text-xs my-2 self-end"
            >
              <input
                bind:checked={showModal}
                type="checkbox"
                class="w-5 h-5 cursor-pointer disabled:cursor-default"
                value={true}
                on:change={() => {}}
              />

              <p>Use team logo</p>
            </label>
          </div>
        </div>
        <div class="flex gap-2">
          <Input
            outline
            placeholder="Tenant Name"
            title="Tenant Name"
            class="w-full"
            bind:value={input.Name}
            isEmptyChecking={true}
            inputbg="bg-neutral-900"
          />
          <Input
            outline
            placeholder="Point Name"
            title="Point Name"
            class="w-full"
            bind:value={input.PointName}
            isEmptyChecking={true}
            inputbg="bg-neutral-900"
          />
        </div>
        <div class="flex flex-col gap-2 md:text-sm text-xs">
          <h1 class="text-gray-400">Short Description</h1>
          <textarea
            name="desc"
            id="desc"
            cols="30"
            rows="10"
            class="h-24 rounded-md resize-none bg-neutral-900 outline outline-1 outline-neutral-600 p-2"
            bind:value={input.Metadata.Desc}
          />
        </div>
        <div class="flex justify-end w-full gap-2">
          <button
            class="outline outline-1 outline-neutral-700 rounded-md p-2 md:text-md text-xs w-40"
            >Cancel</button
          >
          <button
            disabled={loading}
            on:click={action}
            class="flex justify-center items-center gap-2 p-2 w-40 bg-blue-600 hover:bg-blue-600/60 disabled:bg-blue-600/60 rounded-md md:text-md text-xs"
          >
            {#if loading}
              <Spinner bg="#1f4496" size={16} class="w-6 h-6" />
            {/if}
            Save
          </button>
        </div>
      </div>
    </div>
  </Dialog>
{/if}

<style global>
  @import 'filepond/dist/filepond.css';
  @import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
</style>
