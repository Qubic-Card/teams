<script>
  import { fly, slide } from 'svelte/transition';
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
  import IntersectionObserver from '@comp/intersectionObserver.svelte';
  import { inView, isInViewTriggered } from '@lib/stores/intersectingStore';
  import { onMount } from 'svelte';

  export let data;

  const popup = () => toastFailed(`You can't connect to this profile`);

  const downloadHandler = () => {
    $teamData?.brochure?.url
      ? window.open($teamData?.brochure?.url, '_blank').focus()
      : toastFailed('No brochure uploaded yet');
  };

  function scrollIntoView({ target }) {
    const el = document.querySelector(target.getAttribute('href'));
    if (!el) return;
    el.scrollIntoView({
      behavior: 'smooth',
    });
  }

  // onMount(() => {
  //   $isInViewTriggered = false;
  // });

  let showSocialsPersonal = true;
  let showSocialsTeam = true;
  let showLinksPersonal = true;
  let showLinksTeam = true;
  let forScrollToSocialsSection;
  let profile;
</script>

<div
  bind:this={profile}
  class={`${$currentTheme.pageBackground} ${$$props.class} relative transition-colors duration-500 ease-in text-sm`}
  class:bg-image-profile={$currentTheme?.backgroundImage}
  style={`--bg-img-profile: url('${$currentTheme?.backgroundImage}')`}
>
  <!-- HEAD -->
  <div
    class="w-full p-2 sticky top-0 z-10 {$currentTheme?.pageBackground} rounded-3xl"
  >
    <div
      class="rounded-2xl h-32"
      style={`background: url(${data?.design?.background ?? ''});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;`}
    >
      <div class={$inView ? '' : 'gap-5 flex items-center justify-center'}>
        <AvatarCard
          theme={$currentTheme}
          class="antialiased z-50 relative appBar flex {$inView
            ? 'pt-6'
            : 'pb-2'}"
          height={$inView ? 135 : 100}
          width={$inView ? 135 : 100}
          background={data?.avatar == '' || null
            ? '/favicon.svg'
            : data?.avatar}
        />
        {#if !$inView}
          <div
            in:fly|local={{ x: -200, duration: 1000 }}
            class="flex z-40 flex-col gap-1 pt-2 w-full pr-4 {$currentTheme?.text}"
          >
            <!-- {currentTheme?.pageBackground} {currentTheme?.text} rounded-md p-1 -->
            <div class="{$currentTheme?.pageBackground} p-2 rounded-md">
              <h1
                class="text-xs font-bold"
                bind:this={forScrollToSocialsSection}
              >
                {data?.firstname ?? Dummy.firstname}
                {data?.lastname ?? ''}
              </h1>
              {#if data?.job}
                <h1 class="text-xs opacity-80">
                  {data?.job ?? ''}
                </h1>
              {/if}
              {#if data?.company}
                <h1 class="text-xs opacity-90">
                  {data?.company ?? ''}
                </h1>
              {/if}
            </div>
            <div class="grid grid-cols-3 justify-between gap-1">
              <button
                on:click={() =>
                  profile.scrollIntoView({
                    behavior: 'smooth',
                  })}
                class="p-1 text-xs rounded-md {$currentTheme.text} {$currentTheme.secondary}"
                >Bio</button
              >

              <button
                on:click={() =>
                  forScrollToSocialsSection.scrollIntoView({
                    behavior: 'smooth',
                  })}
                class="p-1 text-xs rounded-md {$currentTheme.text} {$currentTheme.secondary}"
                >Socials</button
              >

              <a
                on:click|preventDefault={scrollIntoView}
                href={`#links`}
                class="text-center p-1 text-xs rounded-md {$currentTheme.text} {$currentTheme.secondary}"
                >Links</a
              >
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <!-- BIO -->
  <IntersectionObserver id="bio" section="bio">
    <div
      class=" justify-center items-center flex flex-col pt-6 {$currentTheme.text}  {$inView
        ? $currentTheme?.text
        : 'text-transparent'}"
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
  </IntersectionObserver>

  <div class="flex flex-col gap-1 px-8 md:px-16 text-white my-4">
    <BorderButton
      class="w-full font-semibold h-12 {$currentTheme?.outline} {$currentTheme?.button} {$currentTheme?.buttonText} rounded-md"
      on:click={popup}
    >
      Connect with Me
    </BorderButton>
    <BorderButton
      class="w-full h-12 {$currentTheme?.outline} {$currentTheme?.secondary} {$currentTheme?.text} rounded-md"
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
        } p-2 w-1/2 ${$currentTheme.text} text-xs md:text-sm`}>Team</button
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
        } p-2 w-1/2 ${$currentTheme.text} text-xs md:text-sm`}>Personal</button
      >
    {/if}
  </div>

  {#if $selectedTab === 'personal'}
    <div class="px-8 md:px-16 mt-4 {$currentTheme.text}">
      <IntersectionObserver id="socials" section="socials">
        <div
          class="my-4 overflow-clip rounded-md outline-1 outline {$currentTheme?.outline}"
        >
          <div class="flex flex-row px-2 py-3 items-center justify-center">
            <p class="text-xs font-medium flex-grow">My Socials</p>
            <button
              on:click={() => (showSocialsPersonal = !showSocialsPersonal)}
              class="{$currentTheme?.button} {$currentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
              >{showSocialsPersonal ? '-' : '+'}</button
            >
          </div>
          {#if showSocialsPersonal}
            <div
              transition:slide|local
              class="flex justify-between flex-wrap items-start"
            >
              {#each $socials as item, i}
                {#if item.isActive}
                  <BorderButton
                    on:click={() => toNewTab(item.type, item.data)}
                    class="py-2 px-7 flex-grow flex justify-center rounded-md items-center {$currentTheme?.outline} {$currentTheme?.secondary}"
                    order={i}
                    ><img
                      src={socialIcons[item.type]}
                      class="w-[40px]"
                      alt=""
                    /></BorderButton
                  >
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      </IntersectionObserver>

      <IntersectionObserver id="links" section="links">
        <div
          class="my-4 overflow-clip rounded-md outline-1 outline {$currentTheme?.outline}"
        >
          <div class="flex flex-row px-2 py-3 items-center justify-center">
            <p class="text-xs font-medium flex-grow">My Links</p>
            <button
              on:click={() => (showLinksPersonal = !showLinksPersonal)}
              class="{$currentTheme?.button} {$currentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
              >{showLinksPersonal ? '-' : '+'}</button
            >
          </div>
          {#if showLinksPersonal}
            <div
              transition:slide|local
              class="flex flex-col justify-center items-center pb-5"
            >
              {#each $links as item, i}
                {#if item.isActive}
                  <BorderButton
                    order={i}
                    class="w-full {$currentTheme?.outline} {$currentTheme?.secondary} rounded-md"
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
          {/if}
        </div>
      </IntersectionObserver>
    </div>
  {:else if $selectedTab === 'team'}
    <div
      class="gap-2 flex flex-col text-white px-8 md:px-16 justify-center items-center mt-4"
    >
      <div
        class="flex {$currentTheme.text} flex-col gap-2 w-full outline outline-2 {$currentTheme?.outline} rounded-lg p-4 animation-profile"
      >
        <div class="flex items-center">
          <img
            src={$teamData.logo !== '' ? $teamData.logo : Dummy.avatar}
            alt=""
            class="rounded-lg w-16 h-16 mr-2"
          />
          <p class="break-all">{$teamData.company ?? ''}</p>
        </div>

        <p class="text-xs break-words">{$teamData.address ?? ''}</p>
        <p class="text-xs {$currentTheme.text} opacity-50 break-words">
          {$teamData.description ?? ''}
        </p>
      </div>
      {#if $teamData?.brochure}
        {#if $teamData?.brochure?.url}
          <div
            on:click={downloadHandler}
            class="w-full {$currentTheme.text} text-xs md:text-sm outline outline-2 {$currentTheme?.outline} rounded-lg p-4 cursor-pointer animation-profile"
          >
            <h1 class="break-all">
              {$teamData?.brochure?.title}
            </h1>
            <p class="text-xs text-neutral-400 break-all">
              Know more about {$teamData.company}
            </p>
          </div>
        {/if}
      {/if}
      <div class={`${$currentTheme.text} w-full`}>
        <IntersectionObserver id="socials" section="socials">
          <div
            class="my-4 overflow-clip rounded-md outline-1 outline {$currentTheme?.outline}"
          >
            <div class="flex flex-row px-2 py-3 items-center justify-center">
              <p class="text-xs font-medium flex-grow">My Socials</p>
              <button
                on:click={() => (showSocialsTeam = !showSocialsTeam)}
                class="{$currentTheme?.button} {$currentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
                >{showSocialsTeam ? '-' : '+'}</button
              >
            </div>
            {#if showSocialsTeam}
              <div
                transition:slide|local
                class="flex justify-between flex-wrap items-start"
              >
                {#each $teamSocials as item, i}
                  {#if item.isActive}
                    <BorderButton
                      on:click={() => toNewTab(item.type, item.data)}
                      order={i}
                      class="py-2 px-7 flex-grow flex justify-center rounded-md items-center {$currentTheme?.outline} {$currentTheme?.secondary}"
                      ><img
                        src={socialIcons[item.type]}
                        class="w-[40px]"
                        alt=""
                      /></BorderButton
                    >
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </IntersectionObserver>

        <IntersectionObserver id="links" section="links">
          <div
            class="my-4 overflow-clip rounded-md outline-1 outline {$currentTheme?.outline} mb-20"
          >
            <div class="flex flex-row px-2 py-3 items-center justify-center">
              <p class="text-xs font-medium flex-grow">My Links</p>
              <button
                on:click={() => (showLinksTeam = !showLinksTeam)}
                class="{$currentTheme?.button} {$currentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
                >{showLinksTeam ? '-' : '+'}</button
              >
            </div>
            {#if showLinksTeam}
              <div
                transition:slide|local
                class="gap-2 flex flex-col justify-center items-center pb-5"
              >
                {#each $teamLinks as item, i}
                  {#if item.isActive}
                    <BorderButton
                      order={i}
                      class="w-full {$currentTheme?.outline} {$currentTheme?.secondary} rounded-md"
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
            {/if}
          </div>
        </IntersectionObserver>
      </div>
    </div>
  {/if}
</div>

<style>
  .bg-image-profile {
    background: var(--bg-img-profile);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* background-clip: padding-box; */
  }

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
