<script>
  import Input from '@comp/input.svelte';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import TeamEditorSkeleton from '@comp/skeleton/teamEditorSkeleton.svelte';

  import FilePond, { registerPlugin } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

  import { socials, links } from '@lib/stores/editorStore';
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
  import { getTeamId } from '@lib/query/getId';
  import toNewTab from '@lib/utils/newTab';
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';

  // Register the plugins
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType
  );

  let teamId = Cookies.get('qubicTeamId');
  let pond;
  let name = 'filepond';
  let teamNickname = null;
  let teamData = {
    company: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    avatar: '',
    socials: $socials,
    links: $links,
    design: {
      theme: 'dark',
      background: '',
    },
  };
  let isHasPermissionToWriteTeam = false;
  let isHasPermissionToReadTeam = false;

  // handle filepond events
  function handleInit() {
    console.log('FilePond has initialised');
  }

  const handleAddFile = async (file, output) => {
    const { data } = await supabase.storage
      .from('avatars')
      .upload(`${$user?.id}/${file.filename}`, output[1].file, {
        contentType: 'image/jpeg',
      });

    const { publicURL, error } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${$user?.id}/${file.filename}`);

    teamData.avatar = publicURL;
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

  const handleSave = async () => {
    // let teamId = await getTeamId($user?.id);
    teamData.socials = $socials;
    teamData.links = $links;
    const { error } = await supabase
      .from('teams')
      .update(
        { metadata: teamData, nickname: teamNickname },
        { returning: 'minimal' }
      )
      .eq('id', teamId);

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

  const getTeamsDetail = async () => {
    // let teamId = await getTeamId($user?.id);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      const team = data[0].metadata;
      teamData = { ...team };
      teamNickname = data[0].nickname;
      $socials = team['socials'];
      $links = team['links'];
      // teamId = team['id'];
      $socials.map((social) => {
        if (social.type === 'phone') teamData.phone = social.data;
        if (social.type === 'email') teamData.email = social.data;
      });
    }
    return data;
  };

  $: {
    $userData?.filter((item) => {
      if (item === 'allow_write_team') isHasPermissionToWriteTeam = true;
      if (item === 'allow_read_team') isHasPermissionToReadTeam = true;
    });

    console.log($userData);
    console.log(isHasPermissionToReadTeam, isHasPermissionToWriteTeam);
  }
</script>

<div class="flex justify-center">
  {#if isHasPermissionToReadTeam}
    {#await getTeamsDetail()}
      <TeamEditorSkeleton />
    {:then}
      <div class="w-full">
        <div class="text-black">
          <div class="flex flex-col w-full">
            <TabGroup>
              <TabList class="w-full grid grid-cols-3 border rounded-md p-2">
                <Tab
                  class={({ selected }) =>
                    selected
                      ? 'bg-white text-black p-2 rounded-md'
                      : 'bg-neutral-800 text-white p-2 rounded-l-md'}
                  >Team Profile</Tab
                >
                <Tab
                  class={({ selected }) =>
                    selected
                      ? 'bg-white text-black p-2 rounded-md'
                      : 'bg-neutral-800 text-white p-2'}>Socials</Tab
                >
                <Tab
                  class={({ selected }) =>
                    selected
                      ? 'bg-white text-black p-2 rounded-md'
                      : 'bg-neutral-800 text-white p-2 rounded-r-md'}>Links</Tab
                >
              </TabList>
              <TabPanels class="mt-4">
                <TabPanel>
                  <!-- BIO EDITOR -->
                  <div class="border-b-zinc-300 border mb-4">
                    <div
                      class="px-3 bg-neutral-800 grid grid-cols-2 space-x-5 mt-2"
                    >
                      <Input
                        on:change={handleSave}
                        placeholder="Company Name"
                        title="Name"
                        bind:value={teamData.company}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Nickname"
                        title="Nickname"
                        bind:value={teamNickname}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                    </div>
                    <div class="px-3 bg-neutral-800">
                      <Input
                        on:change={handleSave}
                        placeholder="Address"
                        title="Address"
                        bind:value={teamData.address}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Description"
                        title="Description"
                        bind:value={teamData.description}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                    </div>
                    <div class="px-3 bg-neutral-800 grid grid-cols-2 space-x-5">
                      <Input
                        on:change={handleSave}
                        placeholder="Email"
                        title="Email"
                        bind:value={teamData.email}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Phone Number"
                        title="Phone Number"
                        bind:value={teamData.phone}
                        disabled={isHasPermissionToWriteTeam ? false : true}
                      />
                    </div>
                    <div
                      class={`p-3 bg-neutral-800 ${
                        isHasPermissionToWriteTeam ? '' : 'hidden'
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
                        labelIdle="Add Team Logo"
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
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <!-- SOCIAL EDITOR -->
                  <div class="border mb-4 p-4 bg-neutral-800">
                    <div class="flex justify-between items-center">
                      <h1 class="font-bold text-lg text-white">Socials</h1>
                      <AddSocialsModal
                        class={`${isHasPermissionToWriteTeam ? '' : 'hidden'}`}
                      />
                    </div>
                    {#if $socials.length > 0}
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
                            isTiktokInput={item.type === 'tiktok'
                              ? true
                              : false}
                            isEmailInput={item.type === 'email' ? true : false}
                            isWhatsappInput={item.type === 'whatsapp'
                              ? true
                              : false}
                            isInstagramInput={item.type === 'instagram'
                              ? true
                              : false}
                            isPhoneInput={item.type === 'phone' ? true : false}
                            isEmptyChecking={true}
                            disabled={isHasPermissionToWriteTeam ? false : true}
                          />

                          <div
                            class={`flex items-center mb-3 ${
                              isHasPermissionToWriteTeam ? 'flex' : 'hidden'
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
                                  class="top-10 z-40 absolute rounded-md flex flex-col bg-neutral-100 text-black shadow-md border border-neutral-800 p-2 w-40"
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
                            <SwitchButton
                              bind:checked={item.isActive}
                              on:change={handleSave}
                            />
                          </div>
                        </div>
                      {/each}
                    {:else}
                      <div class="flex flex-col items-center justify-center">
                        <p class="text-lg text-neutral-500">
                          No social media yet
                        </p>
                      </div>
                    {/if}
                  </div>
                </TabPanel>
                <TabPanel>
                  <!-- Link Editor -->
                  <div class="border p-4 mb-0 lg:mb-20 bg-neutral-800">
                    <div class="flex justify-between items-center">
                      <h1 class="font-bold text-lg text-white">Links</h1>
                      <img
                        class={`h-10 w-10 cursor-pointer ${
                          isHasPermissionToWriteTeam ? '' : 'hidden'
                        }`}
                        on:click={addLink}
                        src="/add-icon.svg"
                        alt="add"
                      />
                    </div>

                    {#if $links.length > 0}
                      {#each $links as item, i}
                        <div class="p-3 flex">
                          <div class="flex flex-col flex-grow">
                            <Input
                              on:change={handleSave}
                              title="Title"
                              placeholder="Title"
                              bind:value={item.title}
                            />
                            <Input
                              title="Link"
                              on:change={handleSave}
                              bind:value={item.link}
                              isLinkInput={true}
                              placeholder="Link"
                              isEmptyChecking={true}
                            />
                          </div>
                          <div
                            class={`mx-3 grid-cols-3 gap-3 place-items-center ${
                              isHasPermissionToWriteTeam ? 'grid' : 'hidden'
                            }`}
                          >
                            <SwitchButton
                              bind:checked={item.isActive}
                              on:change={handleSave}
                            />
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
                    {:else}
                      <div class="flex flex-col items-center justify-center">
                        <p class="text-lg text-neutral-500">
                          No social media yet
                        </p>
                      </div>
                    {/if}
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    {:catch}
      <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
        Some error occurred. Please reload the page and try again.
      </h1>
    {/await}
  {:else}
    <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
      You are not allowed to access this page. Please contact your administrator
    </h1>
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
