<script>
  import Input from "@comp/input.svelte";
  import Profile from "@comp/basic/profile.svelte";
  import AddSocialsModal from "@comp/basic/addSocialsModal.svelte";
  import {
    basicSocials,
    basicLinks,
    basicProfileTheme,
    basicProfileThemeBusiness,
    basicCurrentTheme,
  } from "@lib/stores/editorStore";
  import SelectBackgroundModal from "@comp/basic/selectBackgroundModal.svelte";
  import ProfileEditorSkeleton from "@comp/basic/profileEditorSkeleton.svelte";
  import FilePond, { registerPlugin } from "svelte-filepond";

  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
  import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginImageCrop from "filepond-plugin-image-crop";
  import FilePondPluginImageTransform from "filepond-plugin-image-transform";

  import supabase from "@lib/db";
  import { user } from "@lib/stores/userStore";
  import { toastFailed, toastSuccess } from "@lib/utils/toast";
  import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from "@rgossiaux/svelte-headlessui";
  import BasicCropModal from "@comp/basic/basicCropModal.svelte";
  import InputSocialsEditor from "@comp/basic/inputSocialsEditor.svelte";
  import InputLinksEditor from "@comp/basic/inputLinksEditor.svelte";
  import SelectTheme from "@comp/modals/selectTheme.svelte";
  import {
    addLink,
    handleUpSocial,
    handleUpLink,
    handleDeleteSocial,
    handleDeleteLink,
  } from "@lib/basic/editor";
  import { theme } from "@lib/profileTheme";
  import {
    basicBusinessVcard,
    basicPersonalVcard,
    basicProfile,
  } from "@lib/stores/profileData";
    import Proprofile from "./proprofile.svelte";

  // Register the plugins
  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImageTransform,
    FilePondPluginImageCrop,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
  );

  let pond;
  let name = "filepond";

  let profileOptions = ["Default"];
  let selectedProfileOption = "Default";
  let activeProfileID;

  let isOpen = false;
  let isBannerOpen = false;
  let fileName;
  let image;

  let profileId = null;

  const addNewProfile = async () => {
    const { data, error } = await supabase
      .from("pro_profile")
      .insert([{ name: "new profile " + (profileOptions.length + 1), uid: $user.id}])
      .select();

    console.log(data)
    if (data) {
      activeProfileID = data[0].id;
      profileOptions.push(data[0].name);
      selectedProfileOption = data[0].name;
      const profile = data[0]["metadata"];
      $basicProfile = { ...profile };
      $basicSocials = profile["socials"];
      $basicLinks = profile["links"];
      $basicProfileTheme = profile["design"]["theme"];
      $basicCurrentTheme = theme[profile["design"]["theme"]];
      profileId = data[0]["id"];
    }
  };

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

  const updateData = (e) => {
    if (e.detail.isBanner) {
      if ($basicProfile.isBusiness) {
        $basicProfile.design.backgroundBusiness = e.detail.url;
      } else {
        $basicProfile.design.background = e.detail.url;
      }

      fileName = "";
      image = "";
    } else {
      $basicProfile.avatar = e.detail.url;
    }

    isOpen = false;
    isBannerOpen = false;
    pond.removeFile();
  };

  const getProfile = async (id) => {
    let { data, error } = await supabase
      .from("pro_profile")
      .select("*")
      .eq("uid", $user.id);

    if (data) {
      activeProfileID = data[0].id;
      let Opts = [];
      data.forEach((e) => Opts.push(e.name));
      profileOptions = Opts;
      selectedProfileOption = Opts[0];
      const profile = data[0]["metadata"];
      $basicProfile = { ...profile };
      $basicSocials = profile["socials"];
      $basicLinks = profile["links"];
      $basicProfileTheme = profile["design"]["theme"];
      $basicCurrentTheme = theme[profile["design"]["theme"]];
      profileId = data[0]["id"];
    }
    if (error) console.log(error);
    setTimeout(() => {}, 200);
    return data;
  };

  const handleSave = async (isNeedToast = true) => {
    if (activeProfileID) {
      $basicProfile.socials = $basicSocials;
      $basicProfile.links = $basicLinks;
      $basicProfile.design.theme = $basicProfileTheme;
      $basicProfile.design.themeBusiness = $basicProfileThemeBusiness;
      
      const { error } = await supabase
        .from("pro_profile")
        .update({ metadata: $basicProfile })
        .eq("id", activeProfileID)
        .select();
      if (error) {
        toastFailed();
        console.log(error);
      } else {
        if (isNeedToast) toastSuccess("Changes saved");
      }
    }
  };

  const switchProfile = async (isPersonal = true) => {
    let filteredSocialsBusiness = $basicSocials.filter((social) =>
      social.type.includes("business"),
    );
    let filteredSocialsPersonal = $basicSocials.filter(
      (social) => !social.type.includes("business"),
    );
    let filteredLinksBusiness = $basicLinks.filter(
      (link) => link.isPersonal === false,
    );
    let filteredLinksPersonal = $basicLinks.filter(
      (link) => link.isPersonal !== false,
    );

    if (isPersonal) {
      $basicCurrentTheme = theme[$basicProfileTheme];
      $basicProfile.isBusiness = false;
    } else {
      $basicCurrentTheme = theme[$basicProfileThemeBusiness];
      $basicProfile.isBusiness = true;

      if (!$basicProfile.firstnameBusiness)
        $basicProfile.firstnameBusiness = $basicProfile.firstname;

      if (!$basicProfile.lastnameBusiness)
        $basicProfile.lastnameBusiness = $basicProfile.lastname;

      if (filteredLinksBusiness.length === 0) {
        filteredLinksBusiness = [
          {
            title: "My Website",
            link: "https://qubic.id",
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
        $basicProfile.isBusiness ? "Business Mode" : "Personal Mode"
      }`,
    );
    await handleSave(false);
  };
</script>

<div class="min-h-screen bg-gray-100 flex justify-center">
  <!-- {#if isLoading}
      <ProfileEditorSkeleton />
    {:else} -->
  {#await getProfile()}
    <ProfileEditorSkeleton />
  {:then}
    <div class="md:mx-20 mx-4 w-full mb-20">
      <div class="grid grid-cols-2 gap-2 text-black mt-8">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          <div class="flex flex-row w-full justify-between items-center">
            <Listbox bind:value={selectedProfileOption}>
              <ListboxButton class="bg-white rounded-lg py-2 px-4 border"
                >{selectedProfileOption}</ListboxButton
              >
              <ListboxOptions
                class="bg-white mt-2 rounded-lg py-2 px-4 border absolute shadow-md"
              >
                {#each profileOptions as pro}
                  <ListboxOption
                    class={pro == selectedProfileOption
                      ? "font-semibold"
                      : "text-neutral-600 hover:text-neutral-900 hover:font-semibold cursor-pointer"}
                    value={pro}
                  >
                    {pro}
                  </ListboxOption>
                {/each}
              </ListboxOptions>
            </Listbox>
            <button
              on:click={addNewProfile}
              class="text-sm border p-2 text-neutral-600 rounded-lg"
            >
              <p>+ Add new profile</p>
            </button>
          </div>

          <TabGroup class="mt-2" defaultIndex={0}>
            <TabList
              class="w-full bg-white  grid grid-cols-3 border rounded-lg p-2"
            >
              <Tab
                class={({ selected }) =>
                  selected
                    ? "bg-black text-white text-sm p-2 rounded-md"
                    : "bg-white text-sm p-2 rounded-l-md"}>Bio</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? "bg-black text-white text-sm p-2 rounded-md"
                    : "bg-white text-sm p-2"}>Socials</Tab
              >
              <Tab
                class={({ selected }) =>
                  selected
                    ? "bg-black text-white text-sm p-2 rounded-md"
                    : "bg-white text-sm p-2 rounded-r-md"}>Links</Tab
              >
            </TabList>
            <TabPanels class="mt-4 bg-white rounded-lg">
              <TabPanel>
                <div class="border-b-zinc-300 border rounded-lg p-4 mb-4">
                  <div class="px-3 bg-white grid grid-cols-2 space-x-5">
                    <Input
                      on:change={handleSave}
                      placeholder="Hello"
                      title="First Name"
                      bind:value={$basicProfile.firstname}
                      inputbg="bg-neutral-100"
                      inputText="text-black"
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="World"
                      title="Last Name"
                      bind:value={$basicProfile.lastname}
                      inputbg="bg-neutral-100"
                      inputText="text-black"
                    />
                  </div>

                  <div class="px-3 bg-white">
                    <Input
                      on:change={handleSave}
                      placeholder="example company"
                      title="Company"
                      bind:value={$basicProfile.company}
                      inputbg="bg-neutral-100"
                      inputText="text-black"
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Hiring Manager"
                      title="Job"
                      bind:value={$basicProfile.job}
                      inputbg="bg-neutral-100"
                      inputText="text-black"
                    />
                    <Input
                      on:change={handleSave}
                      placeholder="Address"
                      title="Address"
                      bind:value={$basicProfile.address}
                      inputbg="bg-neutral-100"
                      inputText="text-black"
                    />
                    <p class="text-sm text-gray-400">Introduction</p>
                    <textarea
                      maxlength="160"
                      on:change={handleSave}
                      placeholder="Tell us about what you do"
                      title="Introduction"
                      bind:value={$basicProfile.intro}
                      class="w-full bg-neutral-100 rounded-md px-2 py-2 mt-2 resize-none"
                    />
                  </div>

                  <div class="p-3 bg-white">
                    <FilePond
                      bind:this={pond}
                      {name}
                      credits=""
                      allowProcess={false}
                      class="cursor-pointer"
                      acceptedFileTypes={["image/png", "image/jpeg"]}
                      instantUpload={false}
                      imageCropAspectRatio={1 / 1}
                      labelIdle="Add Profile Picture"
                      allowMultiple={false}
                      beforeAddFile={handleCrop}
                    />

                    <BasicCropModal
                      isBanner={false}
                      {isOpen}
                      {handleSave}
                      {image}
                      {fileName}
                      on:updatedData={updateData}
                      on:closeModal={closeModal}
                    />

                    <SelectBackgroundModal {handleSave} />
                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div class="border mb-4 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-lg">Socials</h1>
                    <AddSocialsModal profileData={$basicProfile} />
                  </div>
                  
                    {#if $basicSocials.length > 0}
                      {#each $basicSocials as item, i}
                        <InputSocialsEditor                          
                          socials={$basicSocials}
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
                  
                  
                </div>
              </TabPanel>
              <TabPanel>
                <div class="border p-4 rounded-lg mb-0 lg:mb-4">
                  <div class="flex justify-between items-center">
                    <h1 class="font-semibold text-lg">Links</h1>
                    <img
                      class="h-10 w-10 cursor-pointer"
                      on:click={() =>
                        addLink(false, $basicLinks)}
                      src="https://img.icons8.com/external-royyan-wijaya-detailed-outline-royyan-wijaya/48/000000/external-add-interface-royyan-wijaya-detailed-outline-royyan-wijaya.png"
                      alt="add"
                    />
                  </div>
                  <label
                    for="links"
                    class="flex items-center cursor-pointer gap-2 ml-2"
                  >
                    <input
                      bind:checked={$basicProfile.isShowMetaImage}
                      id="links"
                      type="checkbox"
                      class="w-5 h-5 cursor-pointer disabled:cursor-default"
                      value={$basicProfile?.isShowMetaImage}
                      on:change={handleSave}
                    />

                    <p class="md:text-sm text-xs">
                      Show URL image if available.
                    </p>
                  </label>
                  {#if $basicProfile.isBusiness}
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

          <SelectTheme
            {handleSave}
            editor="basic"
            isBusiness={false}
          />
        </div>
        <div
          class="md:col-span-1 col-span-2 max-w-md w-full mx-auto h-[87.5vh] overflow-y-scroll snap-container mb-10 rounded-3xl relative border-8 border-black bg-black"
        >
          <Proprofile isEditorMode={true} bind:data={$basicProfile} class="" />
        </div>
      </div>
    </div>
  {:catch err}
    <div>
      <h1 class="text-xl text-black text-center w-full mt-8">
        Some error occurred. Please reload the page and try again <br /> or
        <a href="https://wa.me/628113087599" class="font-semibold">
          contact us!
        </a>
      </h1>
    </div>
  {/await}

  <!-- {/if} -->
</div>

<style global>
</style>
