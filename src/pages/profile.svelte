<script>
  import { profileData, teamData } from '@lib/stores/profileData';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import LinkPreview from '@comp/cards/linkPreview/linkPreview.svelte';
  import {
    socials,
    teamSocials,
    teamLinks,
    links,
  } from '@lib/stores/editorStore';
  import { theme } from '@lib/profileTheme';
  import Dummy from '@lib/dummy.json';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import { genvcard } from '@lib/vcard/vcardgen';
  import download from '@lib/utils/download';
  import { toastFailed } from '@lib/utils/toast';
  import toNewTab from '@lib/utils/newTab';

  export let data;
  export let isEditorMode = false;
  // 09fb5818-c8ce-4b12-bfbb-f939d7da7321 card
  // 402ef83e-5627-4273-8086-48d88000d200 team
  // 3c5c060b-3066-4da0-9e7b-fe557186b27a uid

  // 639ea8b6-9aef-4138-80c1-0c67ab0b25f7 izmi card
  let currentTheme = theme[$profileData?.design?.theme?.toString() ?? 'dark'];

  const popup = () => toastFailed(`You can't connect to your profile`);

  const downloadHandler = async () =>
    window.open($teamData.brosur, '_blank').focus();
</script>

<div class={`text-sm ${currentTheme.pageBackground} ${$$props.class}`}>
  <!-- HEAD -->
  <div class="w-full h-40 p-4">
    <img
      class="w-full h-32 rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover"
      src={data?.design?.background == ''
        ? Dummy?.design?.background
        : data?.design?.background}
      alt=""
    />
    <AvatarCard
      class="pt-8 relative -translate-y-32"
      height="125px"
      width="125px"
      background={data?.avatar == '' ? Dummy.avatar : data?.avatar}
    />
  </div>
  <!-- BIO -->
  <div
    class=" justify-center items-center flex flex-col pt-6 {currentTheme.text}"
  >
    <h1 class="text-lg font-bold">
      {data?.firstname == ''
        ? Dummy.firstname
        : data?.firstname + ' ' + data?.lastname}
    </h1>
    <h1 class="text-sm opacity-80">
      {data?.job == '' ? Dummy.job : data?.job}
    </h1>
    <h1 class="text-md opacity-90">
      {data?.company == '' ? Dummy.company : data?.company}
    </h1>
  </div>
  <div class="flex gap-2 px-20 text-white my-4">
    <BorderButton
      class="w-full h-12 {currentTheme.border} {currentTheme.secondary} rounded-md"
      on:click={popup}
    >
      Connect with Me
    </BorderButton>
    <BorderButton
      class="w-full h-12  {currentTheme.border} {currentTheme.secondary} rounded-md"
      on:click={async () =>
        download(await genvcard(data, $teamData), 'contact')}
    >
      Add to Contacts
    </BorderButton>
  </div>
  <TabGroup class="flex flex-col items-center w-full text-white mt-4">
    <TabList class="flex w-2/3 h-16 rounded-lg p-2">
      <Tab
        class={({ selected }) =>
          selected
            ? 'border-b-2 border-neutral-300 w-1/2'
            : 'border-b-2 border-neutral-700 w-1/2'}>Team</Tab
      >
      <Tab
        class={({ selected }) =>
          selected
            ? 'border-b-2 border-neutral-300 w-1/2'
            : 'border-b-2 border-neutral-700 w-1/2'}>My Contact</Tab
      >
    </TabList>
    <TabPanels class="w-full">
      <TabPanel>
        <div class="gap-2 flex flex-col px-20 justify-center items-center mt-4">
          <div
            class="flex flex-col gap-2 w-full border-2 border-neutral-700 rounded-lg p-4"
          >
            <div class="flex items-center">
              <img
                src={$teamData.logo !== '' ? $teamData.logo : Dummy.avatar}
                alt=""
                class="rounded-lg w-16 h-16 mr-2"
              />
              <h1>{$teamData.company ?? '-'}</h1>
            </div>
            <p>{$teamData.address ?? '-'}</p>
            <p class="text-xs text-neutral-400">
              {$teamData.description ?? '-'}
            </p>
          </div>
          <div
            on:click={downloadHandler}
            class="w-full border-2 border-neutral-700 rounded-lg p-4 cursor-pointer"
          >
            <h1>Know more about us</h1>
            <p class="text-xs text-neutral-400">
              Download brochure {$teamData.company}
            </p>
          </div>
          <div class={currentTheme.text}>
            <div class="flex justify-between flex-wrap items-start gap-1 my-1">
              {#each isEditorMode ? $teamSocials : data.socials as item}
                {#if item.isActive}
                  <BorderButton
                    on:click={() => {
                      toNewTab(item.type, item.data);
                    }}
                    class="p-5 flex-grow flex justify-center rounded-md items-center {currentTheme.border} {currentTheme.secondary}"
                    ><img
                      src={socialIcons[item.type]}
                      width="32"
                      height="32"
                      alt=""
                    /></BorderButton
                  >
                {/if}
              {/each}
            </div>

            <div class="gap-2 flex flex-col justify-center items-center pb-5">
              {#each isEditorMode ? $teamLinks : data.links as item}
                {#if item.isActive}
                  <BorderButton
                    class="w-full {currentTheme.border} {currentTheme.secondary} rounded-md"
                    ><div class="p-2">
                      <LinkPreview
                        isShowMetaImage={$teamData.isShowMetaImage}
                        title={item.title}
                        url={item.link}
                        className={currentTheme.secondary}
                      />
                    </div></BorderButton
                  >
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div class="sm:px-20 px-16 mt-4 {currentTheme.text}">
          <!-- UTILITIES -->
          <div class="flex justify-between flex-wrap items-start gap-1 my-1">
            {#each isEditorMode ? $socials : data.socials as item}
              {#if item.isActive}
                <BorderButton
                  on:click={() => {
                    toNewTab(item.type, item.data);
                  }}
                  class="p-5 flex-grow flex justify-center rounded-md items-center {currentTheme.border} {currentTheme.secondary}"
                  ><img
                    src={socialIcons[item.type]}
                    width="32"
                    height="32"
                    alt=""
                  /></BorderButton
                >
              {/if}
            {/each}
          </div>

          <!-- LINKS -->
          <div class="gap-2 flex flex-col justify-center items-center pb-5">
            {#each isEditorMode ? $links : data.links as item}
              {#if item.isActive}
                <BorderButton
                  class="w-full {currentTheme.border} {currentTheme.secondary} rounded-md"
                  ><div class="p-2">
                    <LinkPreview
                      isShowMetaImage={data.isShowMetaImage}
                      title={item.title}
                      url={item.link}
                      className={currentTheme.secondary}
                    />
                  </div></BorderButton
                >
              {/if}
            {/each}
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</div>
