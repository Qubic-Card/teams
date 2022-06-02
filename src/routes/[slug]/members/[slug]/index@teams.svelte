<script>
  import Input from '@comp/input.svelte';
  import Profile from '@pages/profile.svelte';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import { socials, links } from '@lib/stores/editorStore';
  import { go } from '@lib/utils/forwarder';
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
  import { memberRights } from '@lib/stores/memberRightsStore';
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
    Transition,
  } from '@rgossiaux/svelte-headlessui';
  import { page } from '$app/stores';
  import toNewTab from '@lib/utils/newTab';

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

  // handle filepond events
  function handleInit() {
    console.log('FilePond has initialised');
  }

  const handleAddFile = async (file, output) => {
    const { data } = await supabase.storage
      .from('avatars')
      .upload(`${$user.id}/${file.filename}`, output[1].file, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user.id}/${file.filename}`);

    profileData.avatar = publicURL;
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

  let profileData = {
    firstname: '',
    lastname: '',
    job: '',
    company: '',
    avatar: '',
    socials: $socials,
    links: $links,
    design: {
      theme: 'dark',
      background: '',
    },
  };
  let profileId = null;
  let teamId = null;
  let query = 'background';
  let url;
  let unsplashDatas;
  let showModal = false;
  let accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const modalHandler = () => (showModal = !showModal);
  const handlePick = async (item) => {
    profileData.design.background = item.detail.urls.regular;
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

  const getProfile = async () => {
    let { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid, team_id')
      .eq('uid', $page.params.slug);

    if (data) {
      const profile = data[0]['team_profile'];
      profileData = { ...profile };
      $socials = profile['socials'];
      $links = profile['links'];
      profileId = data[0]['id'];
      teamId = data[0]['team_id'];
    }
    if (error) console.log(error);

    return data;
  };

  const handleSave = async () => {
    profileData.socials = $socials;
    profileData.links = $links;
    const { error } = await supabase
      .from('team_members')
      .update({ team_profile: profileData }, { returning: 'minimal' })
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
  let isHasWriteProfilePermission = false;
  let isHasWriteMembersPermission = false;

  $: {
    $memberRights?.filter((item) => {
      if ($page.params.slug === $user.id) {
        if (item === 'allow_write_profile') {
          isHasWriteProfilePermission = true;
        }
      }
      if (item === 'allow_write_members') {
        isHasWriteMembersPermission = true;
      }
    });

    console.log(isHasWriteProfilePermission, isHasWriteMembersPermission);
  }

  $: console.log($memberRights);
</script>

{#if $page.params.slug === $user.id}
  {#if isHasWriteProfilePermission === false}
    <div
      class={`flex justify-center bg-neutral-200 text-black p-2 rounded-lg ${
        isHasWriteProfilePermission ? 'hidden' : ''
      }`}
    >
      You dont have permission to edit your profile
    </div>
  {/if}
{:else if isHasWriteMembersPermission === false}
  <div
    class={`flex justify-center bg-neutral-200 text-black p-2 rounded-lg ${
      isHasWriteMembersPermission ? 'hidden' : ''
    }`}
  >
    You dont have permission to edit this member's profile
  </div>
{/if}
<div class="min-h-screen flex justify-center">
  {#await getProfile()}
    <ProfileEditorSkeleton />
  {:then name}
    <div class="md:px-20 px-4 w-full bg-black">
      <div class="grid grid-cols-2 gap-2 text-black mt-8">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          <TabGroup>
            <TabList
              class="w-full grid grid-cols-3 border-2 border-neutral-700 rounded-md p-2"
            >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-white text-black p-2 rounded-md'
                    : 'bg-neutral-900 text-white p-2 rounded-l-md'}>Bio</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-white text-black p-2 rounded-md'
                    : 'bg-neutral-900 text-white p-2'}>Socials</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-white text-black p-2 rounded-md'
                    : 'bg-neutral-900 text-white p-2 rounded-r-md'}>Links</Tab
              >
            </TabList>
            <TabPanels class="mt-4">
              <TabPanel>
                <!-- BIO EDITOR -->
                <div class="border-neutral-700 border-2 mb-4">
                  <div
                    class="px-3 pt-3 bg-neutral-900 grid grid-cols-2 space-x-5"
                  >
                    <Input
                      on:change={handleSave}
                      placeholder="Hello"
                      title="First Name"
                      bind:value={profileData.firstname}
                      disabled={isHasWriteProfilePermission
                        ? false
                        : isHasWriteMembersPermission
                        ? false
                        : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="World"
                      title="Last Name"
                      bind:value={profileData.lastname}
                      disabled={isHasWriteProfilePermission
                        ? false
                        : isHasWriteMembersPermission
                        ? false
                        : true}
                    />
                  </div>
                  <div class="px-3 bg-neutral-900">
                    <Input
                      on:change={handleSave}
                      placeholder="example company"
                      title="Company"
                      bind:value={profileData.company}
                      disabled={isHasWriteProfilePermission
                        ? false
                        : isHasWriteMembersPermission
                        ? false
                        : true}
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Hiring Manager"
                      title="Job"
                      bind:value={profileData.job}
                      disabled={isHasWriteProfilePermission
                        ? false
                        : isHasWriteMembersPermission
                        ? false
                        : true}
                    />
                  </div>
                  <div
                    class={`p-3 bg-neutral-900 ${
                      isHasWriteProfilePermission || isHasWriteMembersPermission
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
                      oninit={handleInit}
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
                    <button
                      on:click={modalHandler}
                      class="w-full text-white bg-neutral-500 rounded-md p-5 mt-2"
                      >Select Background</button
                    >
                    <SelectBackgroundModal
                      on:showModal={modalHandler}
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
                <div class="border mb-4 p-4 bg-neutral-900">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg text-white">Socials</h1>
                    <AddSocialsModal
                      class={`${
                        isHasWriteProfilePermission ? 'flex' : 'hidden'
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
                        disabled={isHasWriteProfilePermission
                          ? false
                          : isHasWriteMembersPermission
                          ? false
                          : true}
                      />

                      <div
                        class={`items-center mb-3 ${
                          isHasWriteProfilePermission ||
                          isHasWriteMembersPermission
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
                                  <img
                                    draggable="false"
                                    class="cursor-pointer mr-2"
                                    width="20"
                                    height="20"
                                    src="/icons/arrow_up.png"
                                    alt=""
                                  />
                                  <p>Move up</p>
                                </MenuItem>
                              {/if}
                            </MenuItems>
                          </Transition>
                        </Menu>
                        <SwitchButton bind:checked={item.isActive} />
                      </div>
                    </div>
                  {/each}
                </div>
              </TabPanel>
              <TabPanel>
                <!-- Link Editor -->
                <div class="border p-4 mb-0 lg:mb-20 bg-neutral-900">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg text-white">Links</h1>
                    <img
                      class={`h-10 w-10 cursor-pointer ${
                        isHasWriteProfilePermission ||
                        isHasWriteMembersPermission
                          ? ''
                          : 'hidden'
                      }`}
                      on:click={addLink}
                      src="/add-icon.svg"
                      alt="add"
                    />
                  </div>

                  {#each $links as item, i}
                    <div class="p-3 flex">
                      <div class="flex flex-col flex-grow">
                        <Input
                          on:change={handleSave}
                          title="Title"
                          placeholder="Title"
                          bind:value={item.title}
                          disabled={isHasWriteProfilePermission
                            ? false
                            : isHasWriteMembersPermission
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
                          disabled={isHasWriteProfilePermission
                            ? false
                            : isHasWriteMembersPermission
                            ? false
                            : true}
                        />
                      </div>
                      <div
                        class={`mx-3 grid-cols-3 gap-3 place-items-center ${
                          isHasWriteProfilePermission ||
                          isHasWriteMembersPermission
                            ? 'grid'
                            : 'hidden'
                        }`}
                      >
                        <SwitchButton bind:checked={item.isActive} />
                        {#if i != 0}
                          <img
                            on:click={() => handleDeleteLink(item)}
                            draggable="false"
                            class="cursor-pointer"
                            width="24"
                            height="24"
                            src="/icons/trash.svg"
                            alt=""
                          />
                          <img
                            on:click={() => handleUpLink(item, i)}
                            draggable="false"
                            class="cursor-pointer"
                            width="24"
                            height="24"
                            src="/icons/arrow_up.png"
                            alt=""
                          />
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
        <div
          class="md:col-span-1 col-span-2 max-w-md w-full mx-auto h-screen overflow-y-scroll mb-10"
        >
          <Profile
            class="min-h-screen"
            isEditorMode={true}
            data={profileData}
            id={profileId}
            {teamId}
          />
        </div>
      </div>
    </div>
  {:catch}
    <h1>Some error occurred. Please reload the page and try again.</h1>
  {/await}
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
