<script>
  import { fly, slide } from 'svelte/transition';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import LinkPreview from '@comp/cards/linkPreview/linkPreview.svelte';
  import {
    basicSocials,
    basicLinks,
    basicCurrentTheme,
  } from '@lib/stores/editorStore';
  import Dummy from '@lib/dummy.json';
  import { genvcard } from '@lib/vcard/vcardgen';
  import { toastFailed } from '@lib/utils/toast';
  import IntersectionObserver from '@comp/intersectionObserver.svelte';
  import { inView } from '@lib/stores/intersectingStore';
  import toNewTab from '@lib/utils/newTab';
  import {
    basicProfile,
    basicBusinessVcard,
    basicPersonalVcard,
  } from '@lib/stores/profileData';

  let showSocials = true;
  let showLinks = true;
  let profile;
  let forScrollToSocialsSection;

  const download = (vCardString, fileName) => {
    const fileURL = URL.createObjectURL(
      new Blob([vCardString], { type: 'text/vcard;charset=utf-8' })
    );
    let fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.download = `${fileName}.vcf`;
    document.body.appendChild(fileLink);
    fileLink.click();
  };

  function scrollIntoView({ target }) {
    const el = document.querySelector(target.getAttribute('href'));
    if (!el) return;
    el.scrollIntoView({
      behavior: 'smooth',
    });
  }
</script>

<div
  bind:this={profile}
  class={`${$basicCurrentTheme?.pageBackground} ${$$props.class} relative transition-colors duration-500 ease-in text-sm`}
  class:bg-image-profile={$basicCurrentTheme?.backgroundImage}
  style={`--bg-img-profile: url('${$basicCurrentTheme?.backgroundImage}')`}
>
  <div
    class="w-full p-2 sticky top-0 z-30 rounded-3xl {$basicCurrentTheme?.pageBackground}"
  >
    <div
      class="rounded-2xl h-32"
      style={`background: url(${
        $basicProfile?.isBusiness
          ? $basicProfile?.design?.backgroundBusiness ?? ''
          : $basicProfile?.design?.background ?? ''
      });
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;`}
    >
      <div class={$inView ? '' : 'gap-5 flex'}>
        <AvatarCard
          class="antialiased z-50 relative appBar flex {$inView
            ? 'pt-5'
            : 'pb-2'}"
          theme={$basicCurrentTheme}
          height={`${$inView ? 145 : 100}`}
          width={`${$inView ? 145 : 100}`}
          background={$basicProfile?.avatar == '' || null
            ? '/favicon.svg'
            : $basicProfile?.avatar}
        />
        {#if !$inView}
          <div
            in:fly|local={{ x: -200, duration: 1000 }}
            class="flex z-40 flex-col gap-1 pt-2 {$basicCurrentTheme?.text}"
          >
            <!-- {$basicCurrentTheme?.pageBackground} {$basicCurrentTheme?.text} rounded-md p-1 -->
            <div class="{$basicCurrentTheme?.pageBackground} p-2 rounded-md">
              <h1 class="text-sm font-bold">
                {#if !$basicProfile?.isBusiness}
                  {$basicProfile?.firstname ?? Dummy.firstname}
                  {$basicProfile?.lastname ?? ''}
                {:else}
                  {$basicProfile?.firstnameBusiness ?? Dummy.firstname}
                  {$basicProfile?.lastnameBusiness ?? ''}
                {/if}
              </h1>
              {#if $basicProfile?.job || $basicProfile?.jobBusiness}
                <h1 class="text-xs opacity-80">
                  {#if !$basicProfile?.isBusiness}
                    {$basicProfile?.job ?? ''}
                  {:else}
                    {$basicProfile?.jobBusiness ?? ''}
                  {/if}
                </h1>
              {/if}
              {#if $basicProfile?.company || $basicProfile?.companyBusiness}
                <h1 class="text-xs opacity-90">
                  {#if !$basicProfile?.isBusiness}
                    {$basicProfile?.company ?? ''}
                  {:else}
                    {!$basicProfile?.companyBusiness ||
                    $basicProfile?.companyBusiness === ''
                      ? ''
                      : $basicProfile?.companyBusiness}
                  {/if}
                </h1>
              {/if}
            </div>
            <div class="flex gap-2">
              <button
                on:click={() =>
                  profile.scrollIntoView({
                    behavior: 'smooth',
                  })}
                class="w-16 p-1 text-xs rounded-md {$basicCurrentTheme?.text} {$basicCurrentTheme?.secondary}"
                >Bio</button
              >
              <button
                on:click={() =>
                  forScrollToSocialsSection.scrollIntoView({
                    behavior: 'smooth',
                  })}
                class="w-16 p-1 text-xs rounded-md {$basicCurrentTheme?.text} {$basicCurrentTheme?.secondary}"
                >Socials</button
              >

              <a
                on:click|preventDefault={scrollIntoView}
                href={`#links`}
                class="text-center transition-colors duration-300 w-16 p-1 text-xs rounded-md {$basicCurrentTheme?.text} {$basicCurrentTheme?.secondary}"
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
      class=" justify-center items-center flex flex-col pt-8 {$inView
        ? $basicCurrentTheme?.text
        : 'text-transparent'}"
    >
      <h1
        class="text-lg font-bold text-center"
        bind:this={forScrollToSocialsSection}
      >
        {#if !$basicProfile.isBusiness}
          {$basicProfile.firstname ?? Dummy.firstname}
          {$basicProfile.lastname ?? ''}
        {:else}
          {$basicProfile.firstnameBusiness ?? Dummy.firstname}
          {$basicProfile.lastnameBusiness ?? ''}
        {/if}
      </h1>
      {#if $basicProfile.job || $basicProfile.jobBusiness}
        <h1 class="text-sm opacity-80">
          {#if !$basicProfile.isBusiness}
            {$basicProfile.job ?? ''}
          {:else}
            {$basicProfile.jobBusiness ?? ''}
          {/if}
        </h1>
      {/if}
      {#if $basicProfile.company || $basicProfile.companyBusiness}
        <h1 class="text-md opacity-90">
          {#if !$basicProfile.isBusiness}
            {$basicProfile.company ?? ''}
          {:else}
            {!$basicProfile.companyBusiness ||
            $basicProfile.companyBusiness === ''
              ? ''
              : $basicProfile.companyBusiness}
          {/if}
        </h1>
      {/if}
    </div>
  </IntersectionObserver>

  <div class="px-10 mt-4 {$basicCurrentTheme?.text}">
    <!-- UTILITIES -->
    <div class="grid grid-cols-1 gap-1 mb-1">
      <BorderButton
        order={1}
        class="w-full font-semibold h-12 {$basicCurrentTheme?.outline} {$basicCurrentTheme?.button} {$basicCurrentTheme?.buttonText} rounded-md"
        on:click={() => toastFailed("You are can't connect to yourself.")}
      >
        Connect With Me
      </BorderButton>
      <BorderButton
        order={1}
        class="w-full font-semibold h-12 {$basicCurrentTheme?.outline} {$basicCurrentTheme?.secondary} rounded-md"
        on:click={async () =>
          download(
            await genvcard(
              $basicProfile.isBusiness
                ? $basicBusinessVcard
                : $basicPersonalVcard
            ),
            'contact'
          )}
      >
        Add to Contacts
      </BorderButton>
    </div>

    <!-- BASIC SOCIALS -->

    <IntersectionObserver id="socials" section="socials">
      <div
        class="my-4 overflow-clip rounded-md outline-1 outline {$basicCurrentTheme?.outline}"
      >
        <div class="flex flex-row px-2 py-3 items-center justify-center">
          <p class="text-xs font-medium flex-grow">My Socials</p>
          <button
            on:click={() => (showSocials = !showSocials)}
            class="{$basicCurrentTheme?.button} {$basicCurrentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
            >{showSocials ? '-' : '+'}</button
          >
        </div>
        {#if showSocials}
          <div
            transition:slide|local
            class="flex flex-wrap justify-between w-full items-start"
          >
            {#if $basicSocials.filter.length > 0}
              {#each $basicSocials as item, i}
                {#if item.isActive}
                  {#if $basicProfile.isBusiness}
                    {#if item.type.includes('business')}
                      <BorderButton
                        order={i}
                        on:click={() => toNewTab(item.type, item.data)}
                        class="py-2 px-8 flex-grow flex justify-center rounded-md items-center {$basicCurrentTheme?.outline} {$basicCurrentTheme?.secondary}"
                        ><img
                          src={item.type.includes('github')
                            ? 'https://img.icons8.com/sf-regular-filled/96/FFFFFF/github.png'
                            : socialIcons[item.type.split('-')[0]]}
                          class="w-[42px]"
                          alt={item.type}
                        />
                      </BorderButton>
                    {/if}
                  {:else if !item.type.includes('business')}
                    <BorderButton
                      order={i}
                      on:click={() => toNewTab(item.type, item.data)}
                      class="py-2 px-8 flex-grow flex justify-center items-center {$basicCurrentTheme?.outline} {$basicCurrentTheme?.secondary}"
                      ><img
                        src={item.type.includes('github') &&
                        $basicProfile?.design?.theme?.toString() !== 'light'
                          ? 'https://img.icons8.com/sf-regular-filled/96/FFFFFF/github.png'
                          : socialIcons[item.type]}
                        class="w-[42px]"
                        alt={item.type}
                      /></BorderButton
                    >
                  {/if}
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </IntersectionObserver>

    <!-- BASIC LINKS -->
    <IntersectionObserver id="links" section="links">
      <div
        class="my-4 overflow-clip rounded-md outline-1 outline {$basicCurrentTheme?.outline} mb-20"
      >
        <div class="flex flex-row px-2 py-3 items-center justify-center">
          <p class="text-xs font-medium flex-grow">My Links</p>
          <button
            on:click={() => (showLinks = !showLinks)}
            class="{$basicCurrentTheme?.button} {$basicCurrentTheme?.buttonText} rounded-full w-4 h-4 p-0 text-center items-center m-0 justify-center flex"
            >{showLinks ? '-' : '+'}</button
          >
        </div>
        {#if showLinks}
          <div
            transition:slide|local
            class="flex flex-col justify-center items-center"
          >
            {#if $basicLinks?.length > 0}
              {#each $basicLinks as item, i}
                {#if item.isActive}
                  {#if $basicProfile.isBusiness}
                    {#if item.isPersonal === false}
                      <BorderButton
                        order={i}
                        class="w-full {$basicCurrentTheme?.outline} {$basicCurrentTheme?.secondary}"
                      >
                        <LinkPreview
                          isShowMetaImage={$basicProfile?.isShowMetaImage}
                          title={item.title}
                          url={item.link}
                          className={$basicCurrentTheme?.secondary}
                        />
                      </BorderButton>
                    {/if}
                  {:else if item.isPersonal !== false}
                    <BorderButton
                      order={i}
                      class="w-full {$basicCurrentTheme?.outline} {$basicCurrentTheme?.secondary}"
                    >
                      <LinkPreview
                        isShowMetaImage={$basicProfile?.isShowMetaImage}
                        title={item.title}
                        url={item.link}
                        className={$basicCurrentTheme?.secondary}
                      />
                    </BorderButton>
                  {/if}
                {/if}
              {/each}
            {/if}
          </div>
        {/if}
      </div>
    </IntersectionObserver>
  </div>
</div>

<style>
  .bg-image-profile {
    background: var(--bg-img-profile);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    /* background-clip: padding-box; */
  }

  .team-component {
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

  .appBar {
    animation-iteration-count: infinite;
    animation-name: animateAppBar;
    animation-duration: 4s;
  }

  @keyframes animateAppBar {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    100% {
      -webkit-transform: translateX(-100px);
      transform: translateX(-100px);
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
    }
  }
</style>
