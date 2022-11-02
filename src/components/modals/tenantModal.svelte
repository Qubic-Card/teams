<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import Cropper from 'svelte-easy-crop';
  import getCroppedImg from '@lib/utils/canvas';

  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
  );

  export let mode = 'add',
    data;

  let pond;
  let name = 'filepond';

  let showModal = false;
  let loading = false;

  let tenantName = '';
  let pointName = '';
  let desc = '';

  const handleCrop = () => {};

  const toggleModal = () => (showModal = !showModal);
</script>

{#if mode === 'add'}
  <button
    on:click={toggleModal}
    class="flex justify-center items-center bg-blue-600 rounded-md h-7 text-sm p-2"
    >Add new Tenant</button
  >
{:else}
  <img
    on:click={toggleModal}
    src="/edit-icon.svg"
    alt=""
    class="h-7 w-7 bg-blue-600 p-1 rounded-md cursor-pointer"
  />
{/if}

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-50 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col bg-neutral-900 text-white w-full md:w-[40%] h-[52%] z-40 rounded-md"
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
            bind:value={tenantName}
            isEmptyChecking={true}
            inputbg="bg-neutral-900"
          />
          <Input
            outline
            placeholder="Point Name"
            title="Point Name"
            class="w-full"
            bind:value={pointName}
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
          />
        </div>
        <div class="flex justify-end w-full gap-2">
          <button
            class="outline outline-1 outline-neutral-700 rounded-md p-2 md:text-md text-xs w-40"
            >Cancel</button
          >
          <button
            disabled={loading}
            on:click={async () => {}}
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
