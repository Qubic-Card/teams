<script>
  import Spinner from '@comp/loading/spinner.svelte';
  import { fade } from 'svelte/transition';
  import Input from '@comp/input.svelte';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

  import {
    teamSocials,
    teamLinks,
    isDisplayPersonal,
  } from '@lib/stores/editorStore';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import {
    Menu,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    MenuButton,
    MenuItems,
    MenuItem,
    Dialog,
  } from '@rgossiaux/svelte-headlessui';
  import toNewTab from '@lib/utils/newTab';
  import { teamData } from '@lib/stores/profileData';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import {
    handleDeleteLink,
    handleDeleteSocial,
    handleUpLink,
    handleUpSocial,
  } from '@lib/utils/editors';
  import getFileFromBase64 from '@lib/utils/getFileFromBase64';
  import getCroppedImg from '@lib/utils/canvas';
  import Cropper from 'svelte-easy-crop';
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

  export let permissions, isTeamInactive, memberId;

  let pond;
  let brochurePond;
  let name = 'filepond';
  let isOpen = false;
  let croppedImage = '';
  let fileName = '';
  let pixelCrop;
  let image;
  let fileImage;
  let isLoading = false;
  let brochureFilename = '';
  let showDeleteBrochureModal = false;

  const toggleBrochureModal = () =>
    (showDeleteBrochureModal = !toggleBrochureModal);

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
    fileName = item.id;
    isOpen = true;
    return true;
  };

  const handleAddFile = async () => {
    isLoading = true;
    const { data } = await supabase.storage
      .from('avatars')
      .upload(`${$user?.id}/${fileName}`, fileImage, {
        contentType: 'image/jpeg',
      });

    const { data: avatar } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${fileName}`);

    pond.removeFile();
    croppedImage = '';
    isOpen = false;
    $teamData.logo = avatar.publicUrl;
    await handleSave();
    isLoading = false;
  };

  const handleAddBrochure = async (err, file) => {
    let timestamp = new Date().getTime();
    const { data } = await supabase.storage
      .from('brochure')
      .upload(`${$user?.id}/${timestamp}${file?.filename}`, file.file, {
        contentType: 'application/pdf',
      });

    const { data: brochure } = supabase.storage
      .from('brochure')
      .getPublicUrl(`${$user?.id}/${timestamp}${file?.filename}`);

    toastSuccess('Successfully uploaded the brochure');
    brochurePond.removeFile();
    brochureFilename = file.filename;
    $teamData.brochure = {
      url: brochure.publicUrl,
      title: file.filename,
      filename: file.filename,
    };
    await handleSave();
  };

  const addLink = () => {
    $teamLinks.length < 5
      ? teamLinks.set([
          { title: 'My Website', link: 'https://qubic.id', isActive: true },
          ...$teamLinks,
        ])
      : toastFailed('Only 5 link allowed for free members');
  };

  const handleSave = async () => {
    $teamData.socials = $teamSocials;
    $teamData.links = $teamLinks;
    const { error } = await supabase
      .from('teams')
      .update({ metadata: $teamData })
      .eq('id', $page.url.pathname.split('/')[1]);

    if (error) {
      toastFailed();
      console.log(error);
    } else {
      toastSuccess('Changes saved');
    }
  };

  const setDisplayPersonal = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ display_personal: $isDisplayPersonal })
      .eq('team_member_id', memberId)
      .eq('card_id', history.state.card);

    if (error) {
      toastFailed();
      console.log(error);
    } else {
      toastSuccess('Changes saved');
    }
  };
</script>

{#if showDeleteBrochureModal}
  <ConfirmationModal
    {isLoading}
    showModal={showDeleteBrochureModal}
    toggleModal={toggleBrochureModal}
    buttonLabel="Remove"
    on:action={async () => {
      showDeleteBrochureModal = false;
      $teamData.brochure.url = '';
      $teamData.brochure.title = '';
      await handleSave();
      toastSuccess('Brochure deleted successfully');
    }}
  >
    <slot slot="title">
      <h1 class="font-semibold">Remove brochure</h1>
    </slot>
    <slot slot="text">
      <p>Are you sure you want to remove brochure?</p>
    </slot>
  </ConfirmationModal>
{/if}

<ModalOverlay {isOpen} on:click={() => (isOpen = false)} />

<Dialog
  static
  class={`${
    isOpen ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all duration-300 ease-in-out flex flex-col h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
  open={isOpen}
  on:close={() => (isOpen = false)}
>
  <div class="h-full flex flex-col gap-2">
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
        class="bg-blue-600 p-2 w-1/2 text-white rounded-md h-12 disabled:bg-blue-600/60 shadow-md flex justify-center items-center gap-2"
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

<div class="flex justify-center">
  {#if $teamData}
    <div class="w-full" in:fade|local={{ duration: 200 }}>
      <div class="text-black">
        <div class="flex flex-col w-full">
          <TabGroup>
            <TabList
              class="w-full grid grid-cols-3 outline-1 outline outline-neutral-700 p-2"
            >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-800 text-white p-2 text-xs md:text-sm'
                    : 'text-white p-2 text-xs md:text-sm rounded-l-md'}
                >Team Profile</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-800 text-white p-2 text-xs md:text-sm'
                    : 'text-white p-2 text-xs md:text-sm'}>Socials</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-800 text-white p-2 text-xs md:text-sm'
                    : 'text-white p-2 rounded-r-md text-xs md:text-sm'}
                >Links</Tab
              >
            </TabList>
            <TabPanels class="mt-4">
              <TabPanel>
                <!-- BIO EDITOR -->
                <div
                  class="outline-1 outline outline-neutral-700 mb-4 pt-2 pb-2"
                >
                  <div class="px-3 grid grid-cols-1 space-x-5">
                    <Input
                      on:change={handleSave}
                      placeholder="Company Name"
                      title="Name"
                      bind:value={$teamData.company}
                      disabled={permissions.writeTeam ? false : true}
                    />
                  </div>
                  <div class="px-3">
                    <Input
                      on:change={handleSave}
                      placeholder="Address"
                      title="Address"
                      bind:value={$teamData.address}
                      disabled={permissions.writeTeam ? false : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Description"
                      title="Description"
                      bind:value={$teamData.description}
                      disabled={permissions.writeTeam ? false : true}
                    />
                    {#if $teamData.brochure}
                      <Input
                        on:change={handleSave}
                        placeholder="Brochure Title"
                        title="Brochure Title"
                        bind:value={$teamData.brochure.title}
                        disabled={permissions.writeTeam ? false : true}
                      />
                    {/if}
                  </div>

                  {#if permissions.writeTeam}
                    {#if $isDisplayPersonal !== null}
                      <div
                        class="flex justify-between text-xs md:text-sm items-center p-2 bg-neutral-500 mx-3 rounded-md my-2"
                      >
                        <h1 class="text-white">Show personal profile</h1>
                        <SwitchButton
                          bind:checked={$isDisplayPersonal}
                          on:change={setDisplayPersonal}
                        />
                      </div>
                    {/if}
                    <div class="grid grid-cols-2 gap-2 px-3 pt-3">
                      {#if !$teamData?.brochure?.url}
                        <FilePond
                          bind:this={brochurePond}
                          {name}
                          credits=""
                          allowProcess={false}
                          class="cursor-pointer"
                          acceptedFileTypes={['application/pdf']}
                          instantUpload={false}
                          labelIdle="Add Brochure"
                          allowMultiple={false}
                          onaddfile={handleAddBrochure}
                        />
                      {:else}
                        <div
                          class="bg-neutral-100 rounded-lg text-xs md:text-sm h-[76px] p-2 gap-2 flex items-center justify-between"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>

                          <p class="w-64 truncate text-neutral-700 text-md">
                            {$teamData?.brochure?.filename}
                          </p>
                          <button
                            class="p-2 h-full bg-red-600 rounded-md self-start"
                            on:click={() => (showDeleteBrochureModal = true)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      {/if}
                      <FilePond
                        bind:this={pond}
                        {name}
                        credits=""
                        allowProcess={false}
                        class="cursor-pointer"
                        acceptedFileTypes={['image/png', 'image/jpeg']}
                        instantUpload={false}
                        labelIdle="Add Team Logo"
                        allowMultiple={false}
                        onpreparefile={handleCrop}
                      />
                    </div>
                  {/if}
                </div>
              </TabPanel>
              <TabPanel>
                <!-- SOCIAL EDITOR -->
                <div class="outline-1 outline outline-neutral-700 mb-4 p-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-lg text-white">Socials</h1>
                    <AddSocialsModal
                      isTeam
                      class={`${permissions.writeTeam ? '' : 'hidden'}`}
                    />
                  </div>
                  {#if $teamSocials.length > 0}
                    {#each $teamSocials as item, i}
                      <div class="p-1 flex">
                        <Input
                          class="flex-grow"
                          title={item.type === 'tiktok'
                            ? 'TikTok'
                            : item.type === 'youtube'
                            ? 'YouTube'
                            : item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          placeholder={item.type === 'instagram'
                            ? 'Username (without @)'
                            : item.type === 'tiktok'
                            ? 'Tiktok (with @)'
                            : item.type === 'whatsapp'
                            ? 'Whatsapp (with country code. ex: 62...'
                            : item.type === 'twitter'
                            ? 'Username (without @)'
                            : item.type === ' facebook'
                            ? 'Username'
                            : item.type === 'youtube'
                            ? 'channel/UC4kUcG-bHD1ARIPINkS_n8A'
                            : item.type === 'linkedin'
                            ? 'in/username or company/qubic-id'
                            : item.type === 'email'
                            ? 'support@qubic.id'
                            : item.type === 'phone'
                            ? '+62 / 081'
                            : item.type === 'facebook' ||
                              item.type === 'telegram' ||
                              item.type === 'github'
                            ? 'Username'
                            : item.type === 'line'
                            ? 'Line ID'
                            : item.type === 'discord'
                            ? 'User ID'
                            : item.type}
                          bind:value={$teamSocials[i].data}
                          on:change={handleSave}
                          isSocialInput={true}
                          isTiktokInput={item.type === 'tiktok' ? true : false}
                          isEmailInput={item.type === 'email' ? true : false}
                          isWhatsappInput={item.type === 'whatsapp'
                            ? true
                            : false}
                          isInstagramInput={item.type === 'instagram'
                            ? true
                            : false}
                          isPhoneInput={item.type === 'phone' ? true : false}
                          isEmptyChecking={true}
                          disabled={permissions.writeTeam
                            ? false
                            : true || isTeamInactive}
                        />

                        {#if permissions.writeProfile || permissions.writeMembers}
                          <div class="flex items-center h-[6.3rem]">
                            <Menu
                              class="bg-neutral-100 h-8 mx-2 relative rounded-md"
                              let:open
                            >
                              {#if open}
                                <div
                                  transition:fade|local={{ duration: 200 }}
                                  class="fixed inset-0 bg-black/50 z-20"
                                  aria-hidden="true"
                                />
                              {/if}
                              <MenuButton
                                class="w-8 h-auto flex justify-center items-center pt-1"
                                ><svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  stroke-width="2"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg></MenuButton
                              >

                              <MenuItems
                                class="top-10 z-40 absolute rounded-md flex flex-col bg-neutral-100 text-black shadow-md border border-neutral-800 p-2 w-40"
                              >
                                <MenuItem
                                  class="flex cursor-pointer hover:bg-neutral-300 px-2 py-1 rounded-md"
                                  on:click={() =>
                                    // go(item.type, item.data, 'Preview')
                                    toNewTab(item.type, item.data)}
                                >
                                  <img
                                    class="cursor-pointer mr-2"
                                    draggable="false"
                                    width="20"
                                    height="20"
                                    src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/48/000000/external-link-essentials-tanah-basah-basic-outline-tanah-basah.png"
                                    alt=""
                                  />
                                  <p>Test</p>
                                </MenuItem>
                                <MenuItem
                                  class="flex cursor-pointer hover:bg-neutral-300 px-2 py-1 rounded-md"
                                  on:click={async () => {
                                    handleDeleteSocial(
                                      item,
                                      $teamSocials,
                                      true
                                    );
                                    await handleSave();
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  <p>Delete</p>
                                </MenuItem>
                                {#if i != 0}
                                  <MenuItem
                                    class="flex cursor-pointer hover:bg-neutral-300 px-2 py-1 rounded-md"
                                    on:click={async () => {
                                      handleUpSocial(
                                        item,
                                        i,
                                        $teamSocials,
                                        true
                                      );
                                      await handleSave();
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-6 w-6 mr-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      stroke-width="2"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                                      />
                                    </svg>
                                    <p>Move up</p>
                                  </MenuItem>
                                {/if}
                              </MenuItems>
                            </Menu>
                            <SwitchButton
                              bind:checked={item.isActive}
                              on:change={handleSave}
                            />
                          </div>
                        {/if}
                      </div>
                    {/each}
                  {:else}
                    <div class="flex flex-col mt-2 items-center justify-center">
                      <p class="text-lg text-neutral-500">
                        No social media yet
                      </p>
                    </div>
                  {/if}
                </div>
              </TabPanel>
              <TabPanel>
                <!-- Link Editor -->
                <div
                  class="outline-1 outline outline-neutral-700 p-4 mb-0 lg:mb-4"
                >
                  <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-lg text-white">Links</h1>
                    <img
                      class={`h-10 w-10 cursor-pointer ${
                        permissions.writeTeam ? '' : 'hidden'
                      }`}
                      on:click={addLink}
                      src="/add-icon.svg"
                      alt="add"
                    />
                  </div>
                  <label
                    for="links"
                    class="flex items-center cursor-pointer gap-2 ml-2 text-neutral-100 md:text-sm text-xs my-2"
                  >
                    <input
                      bind:checked={$teamData.isShowMetaImage}
                      id="links"
                      type="checkbox"
                      class="w-5 h-5 cursor-pointer disabled:cursor-default"
                      value={$teamData?.isShowMetaImage}
                      on:change={handleSave}
                    />

                    <p>Show URL image if available.</p>
                  </label>
                  {#if $teamLinks.length > 0}
                    {#each $teamLinks as item, i}
                      <div class="flex">
                        <div class="flex flex-2 flex-col flex-grow">
                          <Input
                            on:change={handleSave}
                            title="Title"
                            placeholder="Title"
                            bind:value={item.title}
                            disabled={permissions.writeTeam ? false : true}
                          />
                          <Input
                            title="Link"
                            on:change={handleSave}
                            bind:value={item.link}
                            isLinkInput={true}
                            placeholder="Link"
                            isEmptyChecking={true}
                            disabled={permissions.writeTeam ? false : true}
                          />
                        </div>
                        <div
                          class={`mx-3 flex-1 gap-3 place-items-center ${
                            permissions.writeTeam ? 'flex' : 'hidden'
                          }`}
                        >
                          <SwitchButton
                            bind:checked={item.isActive}
                            on:change={handleSave}
                          />
                          {#if i != 0}
                            <svg
                              on:click={async () => {
                                handleDeleteLink(item, $teamLinks, true);
                                await handleSave();
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <svg
                              on:click={async () => {
                                handleUpLink(item, i, $teamLinks, true);
                                await handleSave();
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-6 w-6 cursor-pointer"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M7 11l5-5m0 0l5 5m-5-5v12"
                              />
                            </svg>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  {:else}
                    <div class="flex flex-col items-center mt-2 justify-center">
                      <p class="text-lg text-neutral-500">No links yet</p>
                    </div>
                  {/if}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  {/if}
</div>

<style global>
  @import 'filepond/dist/filepond.css';
  @import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(218, 218, 218);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(163, 163, 163);
  }
</style>
