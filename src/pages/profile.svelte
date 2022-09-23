<script>
  import { teamData } from '@lib/stores/profileData';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import LinkPreview from '@comp/cards/linkPreview/linkPreview.svelte';
  import {
    socials,
    teamSocials,
    teamLinks,
    links,
    isDisplayPersonal,
    currentTheme,
    profileTheme,
  } from '@lib/stores/editorStore';
  import Dummy from '@lib/dummy.json';
  import { genvcard } from '@lib/vcard/vcardgen';
  import download from '@lib/utils/download';
  import { toastFailed } from '@lib/utils/toast';
  import toNewTab from '@lib/utils/newTab';
  import { selectedTab } from '@lib/stores/selectedTab';

  export let data;
  export let isEditorMode = false;

  const popup = () => toastFailed(`You can't connect to this profile`);

  const downloadHandler = () => {
    $teamData?.brochure?.url
      ? window.open($teamData?.brochure?.url, '_blank').focus()
      : toastFailed('No brochure uploaded yet');
  };
</script>

<div
  class={`text-sm ${$currentTheme.pageBackground} ${$$props.class} transition-colors duration-500 ease-in`}
>
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
    class=" justify-center items-center flex flex-col pt-6 {$currentTheme.text}"
  >
    <h1 class="text-sm md:text-lg font-bold">
      {data?.firstname ?? ''}
      {data?.lastname ?? ''}
    </h1>
    <h1 class="text-xs md:text-sm opacity-80">
      {data?.job ?? ''}
    </h1>
    <h1 class="text-sm md:text-md opacity-90">
      {data?.company ?? ''}
    </h1>
  </div>
  <div class="flex gap-2 px-8 md:px-16 text-white my-4">
    <BorderButton
      class="w-full text-xs md:text-sm h-12 {$currentTheme.text} {$currentTheme.border} {$currentTheme.secondary} animation rounded-md"
      on:click={popup}
    >
      Connect with Me
    </BorderButton>
    <BorderButton
      class="w-full text-xs md:text-sm h-12  {$currentTheme.text} {$currentTheme.border} {$currentTheme.secondary} animation rounded-md"
      on:click={async () =>
        download(
          await genvcard(
            data,
            Object.assign({}, $teamData, {
              display_personal: $isDisplayPersonal,
            })
          ),
          'contact'
        )}
    >
      Add to Contacts
    </BorderButton>
  </div>
  <div class="flex px-8 md:px-16">
    {#if $isDisplayPersonal}
      <button
        on:click={() => ($selectedTab = 'team')}
        class={`${
          $selectedTab === 'team'
            ? `border-b-4 ${
                $profileTheme === 'khaki' || $profileTheme === 'dark'
                  ? `${$currentTheme.border}`
                  : 'border-neutral-400'
              }`
            : `border-b-2 ${
                $profileTheme === 'khaki'
                  ? 'border-neutral-700'
                  : $profileTheme === 'dark'
                  ? 'border-neutral-900'
                  : 'border-neutral-300'
              }`
        } p-2 w-1/2 ${$currentTheme.text} text-xs md:text-sm text-white`}
        >Team</button
      >
      <button
        on:click={() => ($selectedTab = 'personal')}
        class={`${
          $selectedTab === 'personal'
            ? `border-b-4 ${
                $profileTheme === 'khaki' || $profileTheme === 'dark'
                  ? `${$currentTheme.border}`
                  : 'border-neutral-400'
              }`
            : `border-b-2 ${
                $profileTheme === 'khaki'
                  ? 'border-neutral-700'
                  : $profileTheme === 'dark'
                  ? 'border-neutral-900'
                  : 'border-neutral-300'
              }`
        } p-2 w-1/2 ${$currentTheme.text} text-xs md:text-sm text-white`}
        >Personal</button
      >
    {/if}
  </div>

  {#if $selectedTab === 'personal'}
    <div class="px-8 md:px-16 mt-4 {$currentTheme.text}">
      <!-- UTILITIES -->
      <div class="flex justify-between flex-wrap items-start gap-1 my-1">
        {#each isEditorMode ? $socials : data.socials as item, i}
          {#if item.isActive}
            <BorderButton
              on:click={() => {
                toNewTab(item.type, item.data);
              }}
              class="p-5 flex-grow flex justify-center rounded-md items-center {$currentTheme.border} {$currentTheme.secondary}"
              order={i}
              ><img
                src={socialIcons[item.type]}
                width="34"
                height="34"
                alt=""
              /></BorderButton
            >
          {/if}
        {/each}
      </div>

      <!-- LINKS -->
      <div class="gap-2 flex flex-col justify-center items-center pb-5">
        {#each isEditorMode ? $links : data.links as item, i}
          {#if item.isActive}
            <BorderButton
              order={i}
              class="w-full {$currentTheme.border} {$currentTheme.secondary} rounded-md"
            >
              <LinkPreview
                isShowMetaImage={data?.isShowMetaImage}
                title={item.title}
                url={item.link}
                className={$currentTheme.secondary}
              />
            </BorderButton>
          {/if}
        {/each}
      </div>
    </div>
  {:else if $selectedTab === 'team'}
    <div
      class="gap-2 flex flex-col text-white px-8 md:px-16 justify-center items-center mt-4"
    >
      <div
        class="flex {$currentTheme.text} flex-col gap-2 w-full border-2 {$currentTheme.border} rounded-lg p-4 animation-profile"
      >
        <div class="flex items-center">
          <img
            src={$teamData.logo !== '' ? $teamData.logo : Dummy.avatar}
            alt=""
            class="rounded-lg w-16 h-16 mr-2"
          />
          <h1>{$teamData.company ?? ''}</h1>
        </div>
        <p class="text-xs">{$teamData.address ?? ''}</p>
        <p class="text-xs {$currentTheme.text} opacity-50">
          {$teamData.description ?? ''}
        </p>
      </div>
      {#if $teamData?.brochure}
        {#if $teamData?.brochure?.url}
          <div
            on:click={downloadHandler}
            class="w-full {$currentTheme.text} border-2 text-xs md:text-sm {$currentTheme.border} rounded-lg p-4 cursor-pointer animation-profile"
          >
            <h1>{$teamData?.brochure?.title}</h1>
            <p class="text-xs text-neutral-400">
              Know more about {$teamData.company}
            </p>
          </div>
        {/if}
      {/if}
      <div class={`${$currentTheme.text} w-full`}>
        <div class="flex justify-between flex-wrap items-start gap-1 my-1">
          {#each isEditorMode ? $teamSocials : data.socials as item, i}
            {#if item.isActive}
              <BorderButton
                on:click={() => {
                  toNewTab(item.type, item.data);
                }}
                order={i}
                class="p-5  flex-grow flex justify-center rounded-md items-center {$currentTheme.border} {$currentTheme.secondary}"
                ><img
                  src={socialIcons[item.type]}
                  width="34"
                  height="34"
                  alt=""
                /></BorderButton
              >
            {/if}
          {/each}
        </div>

        <div class="gap-2 flex flex-col justify-center items-center pb-5">
          {#each isEditorMode ? $teamLinks : data.links as item, i}
            {#if item.isActive}
              <BorderButton
                order={i}
                class="w-full {$currentTheme.border} {$currentTheme.secondary} rounded-md"
              >
                <LinkPreview
                  isShowMetaImage={$teamData.isShowMetaImage}
                  title={item.title}
                  url={item.link}
                  className={$currentTheme.secondary}
                />
              </BorderButton>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .animation-profile {
    animation-name: animateIn;
    animation-duration: 350ms;
    animation-delay: calc(var(--animation-order) * 100ms);
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
  }

  @keyframes animateIn {
    0% {
      opacity: 0;
      transform: scale(0.6) translateY(-8px);
    }

    100% {
      opacity: 1;
    }
  }
</style>
