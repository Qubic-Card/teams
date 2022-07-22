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
  import { page } from '$app/stores';
  import { go } from '@lib/utils/forwarder';
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

  export let data;
  export let isEditorMode = false;
  export let profileUid;
  export let cardId;

  // INFO: buka social media masih di tab browser yang sama
  let currentTheme = theme[$profileData?.design?.theme?.toString() ?? 'dark'];

  const popup = () => toastFailed(`You can't connect to your profile`);
  const downloadHandler = () => console.log('Brosur has been downloaded');
</script>

<div class={`${currentTheme.pageBackground} ${$$props.class}`}>
  <!-- HEAD -->
  <div class="w-full p-4">
    <div
      class="rounded-2xl h-32 relative bg-center object-cover"
      style={`background: url(${
        data?.design?.background == ''
          ? Dummy?.design?.background
          : data?.design?.background
      });`}
    >
      <AvatarCard
        class="pt-8"
        height="125px"
        width="125px"
        background={data?.avatar == '' ? Dummy.avatar : data?.avatar}
      />
    </div>
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
    <TabList
      class="flex w-2/3 bg-black border-2 border-neutral-700 rounded-lg p-2"
    >
      <Tab
        class={({ selected }) =>
          selected
            ? 'bg-white text-black p-2 rounded-l-lg w-1/2'
            : 'bg-neutral-800 text-white p-2 rounded-l-lg w-1/2'}>Team</Tab
      >
      <Tab
        class={({ selected }) =>
          selected
            ? 'bg-white text-black p-2 rounded-r-lg w-1/2'
            : 'bg-neutral-800 text-white p-2 rounded-r-lg w-1/2'}
        >My Contact</Tab
      >
    </TabList>
    <TabPanels class="w-full">
      <TabPanel>
        <div class="gap-2 flex flex-col px-20 justify-center items-center mt-4">
          <div
            class="flex flex-col gap-2 w-full border-2 border-neutral-700 rounded-lg p-4"
          >
            <div class="flex">
              <img
                src={$teamData.logo !== '' ? $teamData.logo : Dummy.avatar}
                alt=""
                class="rounded-lg w-16 h-16 mr-2"
              />
              <div>
                <h1>{$teamData.company ?? '-'}</h1>
                <p>{$teamData.address ?? '-'}</p>
              </div>
            </div>
            <p class="text-neutral-400">
              {$teamData.description ?? '-'}
            </p>
          </div>
          <div
            on:click={downloadHandler}
            class="w-full border-2 border-neutral-700 rounded-lg p-4 cursor-pointer"
          >
            <h1>Know more about us</h1>
            <p class="text-neutral-400">Download brosur starbucks</p>
          </div>
          <div class="flex justify-between flex-wrap items-start gap-1 my-1">
            {#each isEditorMode ? $teamSocials : data.socials as item}
              {#if item.isActive}
                <BorderButton
                  on:click={() => {
                    go(
                      item.type,
                      item.data,
                      $page.url.searchParams.get('type'),
                      cardId,
                      profileUid
                    );
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
                      title={item.title}
                      url={item.link}
                      className={currentTheme.secondary}
                      {profileUid}
                      {cardId}
                    />
                  </div></BorderButton
                >
              {/if}
            {/each}
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
                    go(
                      item.type,
                      item.data,
                      $page.url.searchParams.get('type'),
                      cardId,
                      profileUid
                    );
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
                      title={item.title}
                      url={item.link}
                      className={currentTheme.secondary}
                      {profileUid}
                      {cardId}
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
