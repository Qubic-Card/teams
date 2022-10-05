<script>
  import Input from '@comp/input.svelte';
  import Profile from '@comp/basic/profile.svelte';
  import AddSocialsModal from '@comp/basic/addSocialsModal.svelte';
  import {
    basicSocials,
    basicLinks,
    basicProfileTheme,
    basicCurrentTheme,
  } from '@lib/stores/editorStore';
  import SelectBackgroundModal from '@comp/basic/selectBackgroundModal.svelte';
  import ProfileEditorSkeleton from '@comp/basic/profileEditorSkeleton.svelte';
  import FilePond, { registerPlugin } from 'svelte-filepond';

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
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import CropModal from '@comp/basic/cropModal.svelte';
  import InputSocialsEditor from '@comp/basic/inputSocialsEditor.svelte';
  import InputLinksEditor from '@comp/basic/inputLinksEditor.svelte';
  import SelectTheme from '@comp/modals/selectTheme.svelte';
  import {
    addLink,
    handleUpSocial,
    handleUpLink,
    handleDeleteSocial,
    handleDeleteLink,
  } from '@lib/basic/editor';
  import { theme } from '@lib/profileTheme';

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

  let isOpen = false;
  let isBannerOpen = false;
  let fileName;
  let image;
  let profileData = {
    firstname: '',
    lastname: '',
    firstnameBusiness: '',
    lastnameBusiness: '',
    job: '',
    jobBusiness: '',
    company: '',
    companyBusiness: '',
    avatar: '',
    address: '',
    addressBusiness: '',
    socials: $basicSocials,
    links: $basicLinks,
    isShowMetaImage: null,
    isBusiness: false,
    design: {
      theme: 'dark',
      background: '',
      backgroundBusiness: '',
    },
  };
  let profileId = null;
  let query = 'background';
  let url;
  let unsplashDatas;
  let accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY.toString();

  const handleCrop = async (item) => {
    image = URL.createObjectURL(item.file);
    fileName = item.id.trim();
    isOpen = true;
    return true;
  };

  const closeModal = (e) => {
    isOpen = e.detail;
    pond.removeFile();
  };

  const closeBannerModal = (e) => (isBannerOpen = e.detail);

  const updateData = (e) => {
    if (e.detail.isBanner) {
      if (profileData.isBusiness) {
        profileData.design.backgroundBusiness = e.detail.url;
      } else {
        profileData.design.background = e.detail.url;
      }
      query = 'background';
      fileName = '';
      image = '';
    } else {
      profileData.avatar = e.detail.url;
    }

    isOpen = false;
    isBannerOpen = false;
    pond.removeFile();
  };

  const handlePick = async (item) => {
    let timestamp = new Date().getTime();
    fileName = item.detail.id.trim() + '-' + timestamp;
    image = item.detail.urls.regular;
    isBannerOpen = true;
    return true;
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
      .from('profile')
      .select('*')
      .eq('uid', $user.id);

    if (data) {
      const profile = data[0]['metadata'];
      profileData = { ...profile };
      $basicSocials = profile['socials'];
      $basicLinks = profile['links'];
      $basicProfileTheme = profile['design']['theme'];
      $basicCurrentTheme = theme[profile['design']['theme']];
      profileId = data[0]['id'];
    }
    if (error) console.log(error);
    setTimeout(() => {}, 200);
    return data;
  };

  const handleSave = async (isNeedToast = true) => {
    profileData.socials = $basicSocials;
    profileData.links = $basicLinks;
    profileData.design.theme = $basicProfileTheme;

    const { error } = await supabase
      .from('profile')
      .update({ metadata: profileData }, { returning: 'minimal' })
      .eq('uid', $user.id);
    if (error) {
      toastFailed();
      console.log(error);
    } else {
      if (isNeedToast) toastSuccess('Changes saved');
    }
  };

  const switchProfile = async (isPersonal = true) => {
    let filteredSocialsBusiness = $basicSocials.filter((social) =>
      social.type.includes('business')
    );
    let filteredSocialsPersonal = $basicSocials.filter(
      (social) => !social.type.includes('business')
    );
    let filteredLinksBusiness = $basicLinks.filter(
      (link) => link.isPersonal === false
    );
    let filteredLinksPersonal = $basicLinks.filter(
      (link) => link.isPersonal !== false
    );

    if (isPersonal) {
      profileData.isBusiness = false;
    } else {
      profileData.isBusiness = true;

      if (!profileData.firstnameBusiness)
        profileData.firstnameBusiness = profileData.firstname;

      if (!profileData.lastnameBusiness)
        profileData.lastnameBusiness = profileData.lastname;

      if (filteredLinksBusiness.length === 0) {
        filteredLinksBusiness = [
          {
            title: 'My Website',
            link: 'https://qubic.id',
            isActive: true,
            isPersonal: false,
          },
        ];
      }
    }

    $basicSocials = [...filteredSocialsBusiness, ...filteredSocialsPersonal];
    $basicLinks = [...filteredLinksBusiness, ...filteredLinksPersonal];
    toastSuccess(
      `Switched to ${
        profileData.isBusiness ? 'Business Mode' : 'Personal Mode'
      }`
    );
    await handleSave(false);
  };

  // $: getProfile();
</script>

<div class="min-h-screen bg-gray-100 flex justify-center">
  <!-- {#if isLoading}
    <ProfileEditorSkeleton />
  {:else} -->
  {#await getProfile()}
    <ProfileEditorSkeleton />
  {:then}
    <div class="md:mx-20 mx-4 w-full mb-20 ">
      <div class="grid grid-cols-2 gap-2 text-black mt-8">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          <div class="flex mb-2 border-b-2 border-neutral-300">
            <button
              disabled={!profileData.isBusiness}
              on:click={async () => await switchProfile()}
              class={`${
                !profileData.isBusiness ? 'border-neutral-700 border-b-2' : ''
              } w-1/2 p-2`}>Personal Mode</button
            >
            <button
              disabled={profileData.isBusiness}
              class={`${
                profileData.isBusiness ? 'border-neutral-700 border-b-2' : ''
              } w-1/2 p-2`}
              on:click={async () => await switchProfile(false)}
              >Business Mode</button
            >
          </div>
          <TabGroup defaultIndex={0}>
            <TabList
              class="w-full bg-white grid grid-cols-3 border rounded-lg p-2"
            >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-black text-white p-2 rounded-md'
                    : 'bg-white p-2 rounded-l-md'}>Bio</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-black text-white p-2 rounded-md'
                    : 'bg-white p-2'}>Socials</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? 'bg-black text-white p-2 rounded-md'
                    : 'bg-white p-2 rounded-r-md'}>Links</Tab
              >
            </TabList>
            <TabPanels class="mt-4 bg-white rounded-lg">
              <TabPanel>
                <div class="border-b-zinc-300 border rounded-lg p-4 mb-4">
                  {#if profileData.isBusiness}
                    <div class="px-3 bg-white grid grid-cols-2 space-x-5">
                      <Input
                        on:change={handleSave}
                        placeholder="Hello"
                        title="First Name"
                        bind:value={profileData.firstnameBusiness}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="World"
                        title="Last Name"
                        bind:value={profileData.lastnameBusiness}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                    </div>

                    <div class="px-3 bg-white ">
                      <Input
                        on:change={handleSave}
                        placeholder="example company"
                        title="Company"
                        bind:value={profileData.companyBusiness}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Hiring Manager"
                        title="Job"
                        bind:value={profileData.jobBusiness}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Address"
                        title="Address"
                        bind:value={profileData.addressBusiness}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                    </div>
                  {:else}
                    <div class="px-3 bg-white grid grid-cols-2 space-x-5">
                      <Input
                        on:change={handleSave}
                        placeholder="Hello"
                        title="First Name"
                        bind:value={profileData.firstname}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="World"
                        title="Last Name"
                        bind:value={profileData.lastname}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                    </div>

                    <div class="px-3 bg-white ">
                      <Input
                        on:change={handleSave}
                        placeholder="example company"
                        title="Company"
                        bind:value={profileData.company}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Hiring Manager"
                        title="Job"
                        bind:value={profileData.job}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                      <Input
                        on:change={handleSave}
                        placeholder="Address"
                        title="Address"
                        bind:value={profileData.address}
                        inputbg="bg-neutral-100"
                        inputText="text-black"
                      />
                    </div>
                  {/if}

                  <div class="p-3 bg-white ">
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
                      beforeAddFile={handleCrop}
                    />

                    <CropModal
                      {isOpen}
                      {handleSave}
                      {image}
                      {fileName}
                      on:updatedData={updateData}
                      on:closeModal={closeModal}
                    />

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

                    <SelectBackgroundModal
                      {handleSave}
                      {updateData}
                      on:pickImage={handlePick}
                      on:searchQuery={searchQuery}
                      {unsplashDatas}
                    />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div class="border mb-4 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg">Socials</h1>
                    <AddSocialsModal {profileData} />
                  </div>
                  {#if profileData.isBusiness}
                    {#if $basicSocials.filter( (social) => social.type.includes('business') ).length > 0}
                      {#each $basicSocials.filter( (social) => social.type.includes('business') ) as item, i}
                        <InputSocialsEditor
                          isBusiness
                          socials={$basicSocials.filter((social) =>
                            social.type.includes('business')
                          )}
                          {item}
                          {i}
                          {handleSave}
                          {handleDeleteSocial}
                          {handleUpSocial}
                        />
                      {/each}
                    {:else}
                      <div class="text-center text-gray-600">
                        No socials added yet
                      </div>
                    {/if}
                  {:else if !profileData.isBusiness}
                    {#if $basicSocials.filter((social) => !social.type.includes('business')).length > 0}
                      {#each $basicSocials.filter((social) => !social.type.includes('business')) as item, i}
                        <InputSocialsEditor
                          socials={$basicSocials.filter(
                            (social) => !social.type.includes('business')
                          )}
                          {item}
                          {i}
                          {handleSave}
                          {handleDeleteSocial}
                          {handleUpSocial}
                        />
                      {/each}
                    {:else}
                      <div class="text-center text-gray-600">
                        No socials added yet
                      </div>
                    {/if}
                  {/if}
                </div>
              </TabPanel>
              <TabPanel>
                <div class="border p-4 rounded-lg mb-0 lg:mb-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-bold text-lg">Links</h1>
                    <img
                      class="h-10 w-10 cursor-pointer"
                      on:click={() =>
                        addLink(profileData.isBusiness, $basicLinks)}
                      src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/48/000000/external-add-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"
                      alt="add"
                    />
                  </div>
                  <label
                    for="links"
                    class="flex items-center cursor-pointer gap-2 ml-2"
                  >
                    <input
                      bind:checked={profileData.isShowMetaImage}
                      id="links"
                      type="checkbox"
                      class="w-5 h-5 cursor-pointer disabled:cursor-default"
                      value={profileData?.isShowMetaImage}
                      on:change={handleSave}
                    />

                    <p>Show URL image if available.</p>
                  </label>
                  {#if profileData.isBusiness}
                    {#each $basicLinks.filter((link) => link.isPersonal === false) as item, i}
                      <InputLinksEditor
                        {item}
                        {i}
                        {handleSave}
                        {handleDeleteLink}
                        {handleUpLink}
                      />
                    {/each}
                  {:else}
                    {#each $basicLinks.filter((link) => link.isPersonal !== false) as item, i}
                      <InputLinksEditor
                        {item}
                        {i}
                        {handleSave}
                        {handleDeleteLink}
                        {handleUpLink}
                      />
                    {/each}
                  {/if}
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>

          <SelectTheme {handleSave} editor="basic" />
        </div>
        <div
          class="md:col-span-1 col-span-2 max-w-md w-full mx-auto h-screen overflow-y-scroll mb-10"
        >
          <Profile
            isShowMetaImage={profileData.isShowMetaImage}
            class="min-h-screen rounded-3xl border-8 border-black"
            data={profileData}
            id={profileId}
          />
        </div>
      </div>
    </div>
  {:catch err}
    <div>
      <h1 class="text-xl text-black text-center w-full mt-8">
        Some error occurred. Please reload the page and try again <br /> or
        <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
      </h1>
    </div>
  {/await}

  <!-- {/if} -->
</div>

<style global>
  @import 'filepond/dist/filepond.css';
  @import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

  /* width */
  ::-webkit-scrollbar {
    display: none;
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
