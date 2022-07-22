<script>
  import Input from '@comp/input.svelte';
  import Profile from '@pages/profile.svelte';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import { socials, links } from '@lib/stores/editorStore';
  import SelectBackgroundModal from '@comp/modals/selectBackgroundModal.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import ProfileEditorSkeleton from '@comp/skeleton/profileEditorSkeleton.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';

  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
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
    Transition,
  } from '@rgossiaux/svelte-headlessui';
  import { page } from '$app/stores';
  import toNewTab from '@lib/utils/newTab';
  import Cookies from 'js-cookie';
  import { profileData } from '@lib/stores/profileData';
  import CropModal from '@comp/modals/cropModal.svelte';

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
  let teamIdCookies = Cookies.get('qubicTeamId');

  let isOpen = false;
  let fileName = '';
  let image;
  export let permissions;

  const handleAddFile = async (file, output) => {
    const { data } = await supabase.storage
      .from('avatars')
      .upload(`${$user?.id}/${file.filename}`, output[1].file, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${file.filename}`);

    // isOpen = true;
    // fileName = file.filename;
    // image = publicURL;
    $profileData.avatar = publicURL;
    await handleSave();
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
  let showModal = false;
  let accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const getProfile = async () => {
    let { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid, team_id')
      .eq('uid', $page.params.slug);

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

  const modalHandler = () => (showModal = !showModal);
  const handlePick = async (item) => {
    $profileData.design.background = item.detail.urls.regular;
    modalHandler();
    await handleSave();
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
    // let teamId = await getTeamId($user?.id);
    $profileData.socials = $socials;
    $profileData.links = $links;
    const { error } = await supabase
      .from('team_members')
      .update({ team_profile: $profileData }, { returning: 'minimal' })
      .eq('uid', $page.params.slug);
    if (error) {
      toastFailed();
      console.log(error);
    } else {
      toastSuccess('Changes saved');
    }
  };

  const handleUpSocial = async (item, i) => {
    $socials.splice(i, 1);
    $socials.splice(i - 1, 0, item);
    socials.set($socials);
    await handleSave();
  };
  const handleUpLink = async (item, i) => {
    $links.splice(i, 1);
    $links.splice(i - 1, 0, item);
    links.set($links);
    await handleSave();
  };

  const handleDeleteSocial = async (item) => {
    let arr = $socials.filter((oldItem) => oldItem !== item);
    socials.set(arr);
    toastSuccess('Deleted successfully');
    await handleSave();
  };

  const handleDeleteLink = async (item) => {
    let arr = $links.filter((oldItem) => oldItem !== item);
    links.set(arr);
    toastSuccess('Deleted successfully');
    await handleSave();
  };
</script>

{#await getProfile()}
  <ProfileEditorSkeleton />
{:then}
  <div class="flex justify-center">
    <div class="w-full bg-black">
      <div class="gap-2 text-black">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
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
                <div class="border-neutral-700 border-2 mb-4">
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
                      allowProcess={false}
                      class="cursor-pointer"
                      acceptedFileTypes={['image/png', 'image/jpeg']}
                      instantUpload={false}
                      imageCropAspectRatio={1 / 1}
                      labelIdle="Add Profile Picture"
                      allowMultiple={false}
                      onpreparefile={handleAddFile}
                      imageTransformVariants={{
                        thumb_small_: (transforms) => {
                          transforms.resize = {
                            size: {
                              width: 312,
                              height: 312,
                            },
                          };
                          return transforms;
                        },
                      }}
                    />
                    <!-- <CropModal {handleSave} {isOpen} {fileName} {image} /> -->
                    <button
                      on:click={modalHandler}
                      class="w-full text-white bg-neutral-500 rounded-md p-5 mt-2"
                      >Select Background</button
                    >
                    <SelectBackgroundModal
                      {modalHandler}
                      on:pickImage={handlePick}
                      on:searchQuery={searchQuery}
                      {showModal}
                      {unsplashDatas}
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
                  {#each $socials as item, i}
                    <div class="p-3 flex items-end">
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
                          : item.type === 'facebook'
                          ? 'Username'
                          : item.type === 'line'
                          ? 'Line ID'
                          : item.type}
                        bind:value={$socials[i].data}
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
                        disabled={permissions.writeProfile
                          ? false
                          : permissions.writeMembers
                          ? false
                          : true}
                      />

                      <div
                        class={`items-center mb-3 ${
                          permissions.writeProfile || permissions.writeMembers
                            ? 'flex'
                            : 'hidden'
                        }`}
                      >
                        <Menu
                          as="div"
                          class="bg-neutral-100 inline-block relative h-8 mx-2 rounded-md"
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
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <MenuItems
                              class="top-10 z-40 absolute rounded-md flex flex-col bg-neutral-100 text-black shadow-md border border-neutral-700 p-2 w-40"
                            >
                              <MenuItem
                                class="flex hover:bg-neutral-300 px-2 py-1 rounded-md"
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
                                class="flex hover:bg-neutral-300 px-2 py-1 rounded-md"
                                on:click={() => handleDeleteSocial(item)}
                              >
                                <img
                                  class="cursor-pointer mr-2"
                                  draggable="false"
                                  width="20"
                                  height="20"
                                  src="https://img.icons8.com/material-outlined/96/000000/trash--v1.png"
                                  alt=""
                                />
                                <p>Delete</p>
                              </MenuItem>
                              {#if i != 0}
                                <MenuItem
                                  class="flex  hover:bg-neutral-300 px-2 py-1 rounded-md"
                                  on:click={() => handleUpSocial(item, i)}
                                >
                                  <svg
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
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  <p>Move up</p>
                                </MenuItem>
                              {/if}
                            </MenuItems>
                          </Transition>
                        </Menu>
                        <SwitchButton
                          bind:checked={item.isActive}
                          on:change={handleSave}
                        />
                      </div>
                    </div>
                  {/each}
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

                    <p>Show meta image for links (if available).</p>
                  </label>
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
                            on:click={() => handleDeleteLink(item)}
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
                            on:click={() => handleUpLink(item, i)}
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
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  </div>
{:catch}
  <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
    Some error occurred. Please reload the page and try again.
  </h1>
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
