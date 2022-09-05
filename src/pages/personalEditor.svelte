<script>
  import Spinner from '@comp/loading/spinner.svelte';
  import { fade } from 'svelte/transition';
  import Input from '@comp/input.svelte';
  import Profile from '@pages/profile.svelte';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import { socials, links } from '@lib/stores/editorStore';
  import SelectBackgroundModal from '@comp/modals/selectBackgroundModal.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import ProfileEditorSkeleton from '@comp/skeleton/profileEditorSkeleton.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';
  import Cropper from 'svelte-easy-crop';
  import getCroppedImg from '@lib/utils/canvas';

  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

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
  import { page } from '$app/stores';
  import toNewTab from '@lib/utils/newTab';
  import { profileData } from '@lib/stores/profileData';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import {
    handleDeleteLink,
    handleDeleteSocial,
    handleUpLink,
    handleUpSocial,
  } from '@lib/utils/editors';
  import getFileFromBase64 from '@lib/utils/getFileFromBase64';
  import { getContext } from 'svelte';

  export let permissions, isTeamInactive;

  // Register the plugins
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
  const teamID = getContext('teamId');
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
    image = URL.createObjectURL(item.file);
    fileName = item.id.trim();
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

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${fileName}`);

    pond.removeFile();
    croppedImage = '';
    isOpen = false;
    $profileData.avatar = publicURL;
    await handleSave();
    isLoading = false;
  };

  const addLink = () => {
    $links.length < 5
      ? links.set([
          ...$links,
          { title: 'My Website', link: 'https://qubic.id', isActive: true },
        ])
      : toastFailed('Only 5 link allowed for free members');
  };

  let profileId = null;
  let teamId = null;
  let query = 'background';
  let url;
  let unsplashDatas;
  let accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const getProfile = async () => {
    let { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid, team_id')
      .eq('uid', $page.params.slug)
      .eq('team_id', teamID);

    if (data) {
      const profile = data[0]['team_profile'];
      $profileData = { ...profile };
      $socials = profile['socials'];
      $links = profile['links'];
      profileId = data[0]['id'];
      teamId = data[0]['team_id'];
    }
    if (error) console.log(error);

    return data;
  };

  const searchQuery = (val) => (query = val.detail);
  const getUnsplash = async () => {
    try {
      url =
        `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=` +
        accessKey;
      const res = await fetch(url);
      const data = await res.json();

      unsplashDatas = data.results;
    } catch (error) {
      console.log(error);
    }
  };

  $: query, getUnsplash();

  const handleSave = async () => {
    $profileData.socials = $socials;
    $profileData.links = $links;
    const { error } = await supabase
      .from('team_members')
      .update({ team_profile: $profileData }, { returning: 'minimal' })
      .eq('uid', $page.params.slug)
      .eq('team_id', teamID);
    if (error) {
      toastFailed();
      console.log(error);
    } else {
      query = 'background';
      toastSuccess('Changes saved');
    }
  };
</script>

<ModalOverlay {isOpen} on:click={() => (isOpen = false)} />

<Dialog
  static
  class={`${
    isOpen ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all duration-300 justify-between ease-in-out flex flex-col h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
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
        class="bg-blue-600 p-2 w-1/2 text-white rounded-md h-12 shadow-md flex justify-center items-center gap-2"
        on:click={async () => await handleAddFile()}
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

{#await getProfile()}
  <ProfileEditorSkeleton />
{:then}
  <div class="flex justify-center" in:fade|local={{ duration: 200 }}>
    <div class="w-full bg-black">
      <div class="gap-2 text-black">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          <!-- <ProfileEditorSkeleton /> -->
          <TabGroup>
            <TabList
              class="w-full grid grid-cols-3 border-2 border-neutral-700 p-2"
            >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-700 text-white p-2'
                    : 'text-white p-2 rounded-l-md'}>Bio</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-700 text-white p-2'
                    : 'text-white p-2 rounded-l-md'}>Socials</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-neutral-700 text-white p-2'
                    : 'text-white p-2 rounded-l-md'}>Links</Tab
              >
            </TabList>
            <TabPanels class="mt-4">
              <TabPanel>
                <!-- BIO EDITOR -->
                <div class="border-neutral-700 border-2 mb-4 pb-2">
                  <div class="px-3 pt-3 grid grid-cols-2 space-x-5">
                    <Input
                      on:change={handleSave}
                      placeholder="Hello"
                      title="First Name"
                      bind:value={$profileData.firstname}
                      disabled={permissions.writeProfile
                        ? false
                        : permissions.writeMembers
                        ? false
                        : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="World"
                      title="Last Name"
                      bind:value={$profileData.lastname}
                      disabled={permissions.writeProfile
                        ? false
                        : permissions.writeMembers
                        ? false
                        : true}
                    />
                  </div>
                  <div class="px-3">
                    <Input
                      on:change={handleSave}
                      placeholder="example company"
                      title="Company"
                      bind:value={$profileData.company}
                      disabled={permissions.writeProfile
                        ? false
                        : permissions.writeMembers
                        ? false
                        : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Hiring Manager"
                      title="Job"
                      bind:value={$profileData.job}
                      disabled={permissions.writeProfile
                        ? false
                        : permissions.writeMembers
                        ? false
                        : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Address"
                      title="Address"
                      bind:value={$profileData.address}
                      disabled={permissions.writeProfile
                        ? false
                        : permissions.writeMembers
                        ? false
                        : true}
                    />
                  </div>
                  <div
                    class={`p-3 ${
                      permissions.writeProfile || permissions.writeMembers
                        ? ''
                        : 'hidden'
                    }`}
                  >
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
                    <SelectBackgroundModal
                      on:searchQuery={searchQuery}
                      {unsplashDatas}
                      {handleSave}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <!-- SOCIAL EDITOR -->
                <div class="border-2 border-neutral-700 mb-4 p-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg text-white">Socials</h1>
                    <AddSocialsModal
                      class={`${
                        permissions.writeProfile || permissions.writeMembers
                          ? 'flex'
                          : 'hidden'
                      }`}
                    />
                  </div>
                  {#if $socials.length > 0}
                    {#each $socials as item, i}
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
                            ? 'Username (with @)'
                            : item.type === 'whatsapp'
                            ? 'with country code. ex: 62...'
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
                            : item.type === 'facebook'
                            ? 'Username'
                            : item.type === 'line'
                            ? 'Line ID'
                            : item.type === 'github'
                            ? 'Username'
                            : item.type}
                          bind:value={$socials[i].data}
                          on:change={handleSave}
                          isSocialInput={true}
                          isTiktokInput={item.type === 'tiktok'}
                          isEmailInput={item.type === 'email'}
                          isWhatsappInput={item.type === 'whatsapp'}
                          isInstagramInput={item.type === 'instagram'}
                          isPhoneInput={item.type === 'phone'}
                          isEmptyChecking={true}
                          disabled={permissions.writeProfile
                            ? false
                            : permissions.writeMembers
                            ? false
                            : isTeamInactive === false
                            ? false
                            : true}
                        />
                        {#if permissions.writeProfile || permissions.writeMembers}
                          <div class="flex items-center h-[6.3rem]">
                            <Menu
                              class="bg-neutral-100 relative h-8 mx-2 rounded-md"
                            >
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
                                class="top-10 z-40 rounded-md absolute flex flex-col bg-white shadow-md border border-neutral-300 p-2 w-40"
                              >
                                <MenuItem
                                  class="flex hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
                                  on:click={async () =>
                                    await toNewTab(item.type, item.data)}
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
                                  class="flex hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
                                  on:click={async () => {
                                    handleDeleteSocial(item, $socials);
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
                                    class="flex  hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
                                    on:click={async () => {
                                      handleUpSocial(item, i, $socials);
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
                              on:change={handleSave}
                              bind:checked={item.isActive}
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

                <div class="border-2 border-neutral-700 p-4 mb-0 lg:mb-20">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg text-white">Links</h1>
                    <img
                      class={`h-10 w-10 cursor-pointer ${
                        permissions.writeProfile || permissions.writeMembers
                          ? ''
                          : 'hidden'
                      }`}
                      on:click={addLink}
                      src="/add-icon.svg"
                      alt="add"
                    />
                  </div>
                  <label
                    for="links"
                    class="flex items-center cursor-pointer gap-2 ml-2 text-neutral-100"
                  >
                    <input
                      bind:checked={$profileData.isShowMetaImage}
                      id="links"
                      type="checkbox"
                      class="w-5 h-5 cursor-pointer disabled:cursor-default"
                      value={$profileData?.isShowMetaImage}
                      on:change={handleSave}
                    />

                    <p>Show URL image if available.</p>
                  </label>
                  {#if $links.length > 0}
                    {#each $links as item, i}
                      <div class="p-3 flex">
                        <div class="flex flex-2 flex-col flex-grow">
                          <Input
                            on:change={handleSave}
                            title="Title"
                            placeholder="Title"
                            bind:value={item.title}
                            disabled={permissions.writeProfile
                              ? false
                              : permissions.writeMembers
                              ? false
                              : true}
                          />
                          <Input
                            title="Link"
                            on:change={handleSave}
                            bind:value={item.link}
                            isLinkInput={true}
                            placeholder="Link"
                            isEmptyChecking={true}
                            disabled={permissions.writeProfile
                              ? false
                              : permissions.writeMembers
                              ? false
                              : true}
                          />
                        </div>
                        <div
                          class={`mx-3 flex-1 gap-3 place-items-center ${
                            permissions.writeProfile || permissions.writeMembers
                              ? 'flex'
                              : 'hidden'
                          }`}
                        >
                          <SwitchButton bind:checked={item.isActive} />
                          {#if i != 0}
                            <svg
                              on:click={async () => {
                                handleDeleteLink(item, $links);
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
                                handleUpLink(item, i, $links);
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
  </div>
{:catch}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}

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
