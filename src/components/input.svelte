<script>
  import {
    withAtValidator,
    socialValidator,
    linkValidator,
    emailValidator,
    isSocialValid,
    isEmailValid,
    isInstagramInvalid,
    isLinkInvalid,
    isTiktokValid,
    isTwitterValid,
    isPhoneValid,
    isNumber,
    numberRegex,
    filenameValidator,
    isFilenameValid,
  } from '../lib/validation.js';
  import { fade } from 'svelte/transition';

  export let title;
  export let value;
  export let isLinkInput = false;
  export let isSocialInput = false;
  export let isEmailInput = false;
  export let isWhatsappInput = false;
  export let isInstagramInput = false;
  export let isTiktokInput = false;
  export let isPhoneInput = false;
  export let isEmptyChecking = false;
  export let isTwitterInput = false;
  export let isFilenameInput = false;

  let isWhatsappInvalid = false;

  const whatsappValidator = () => {
    let whatsapp = value.trim();

    if (whatsapp.charAt(0) === '0') {
      value = value.slice(1, 2);
      value = value.replace(value, '62' + value);
    }

    if (whatsapp.charAt(0) !== '+' && !numberRegex(value)) {
      isWhatsappInvalid = true;
    } else {
      isWhatsappInvalid = false;
    }
  };

  $: value && isLinkInput && linkValidator(value);
  $: value && isSocialInput && socialValidator(value);
  $: value && isEmailInput && emailValidator(value);
  $: value && isWhatsappInput && whatsappValidator();
  $: value && isInstagramInput && withAtValidator(value, 'ig');
  $: value && isTiktokInput && withAtValidator(value, 'tiktok');
  $: value && isTwitterInput && withAtValidator(value, 'twitter');
  $: value && isFilenameInput && filenameValidator(value);
  $: value && isPhoneInput;
</script>

<div class={`flex flex-col ${$$props.class}`}>
  <h1
    transition:fade|local={{ duration: 200 }}
    class={`text-gray-100 after:content-['*'] after:ml-0.5 ${
      value === '' && isEmptyChecking ? 'after:text-red-500' : 'after:hidden'
    }`}
  >
    {title}
  </h1>
  <div class={'relative'}>
    <input
      transition:fade|local={{ duration: 200 }}
      on:change
      placeholder={`${$$props.placeholder}`}
      bind:value
      maxlength={$$props.maxlength}
      class="w-full text-gray-100 bg-neutral-700 rounded-md my-2 h-10 px-2"
      disabled={$$props.disabled}
    />
  </div>
  {#if isLinkInput && isLinkInvalid}
    <p class="text-red-500">Invalid link input</p>
  {/if}
  {#if isSocialInput && isSocialValid}
    <p class="text-red-500">Invalid social input</p>
  {/if}
  {#if isEmailInput && isEmailValid}
    <p class="text-red-500">Invalid email input</p>
  {/if}
  {#if isWhatsappInput && isWhatsappInvalid}
    <p class="text-red-500">Please use a valid country code and phone number</p>
  {/if}
  {#if isInstagramInput && isInstagramInvalid}
    <p class="text-red-500">Instagram doesn't require "@"</p>
  {/if}
  {#if isTiktokInput && isTiktokValid}
    <p class="text-red-500">TikTok require "@"</p>
  {/if}
  {#if isTwitterInput && isTwitterValid}
    <p class="text-red-500">Twitter doesn't require "@"</p>
  {/if}
  {#if isPhoneInput && isPhoneValid}
    <p class="text-red-500">Invalid phone number</p>
  {/if}
  {#if isNumber}
    <p class="text-red-500">Invalid input. Please enter a number.</p>
  {/if}
  {#if isFilenameInput && !isFilenameValid}
    <p class="text-red-500">Invalid filename input</p>
  {/if}
</div>
