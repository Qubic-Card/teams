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
  } from '@lib/validation.js';
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
  export let inputbg = 'bg-neutral-700';
  export let inputText = 'text-gray-100';
  let isWhatsappInvalid = false;
  let focus = false;

  const whatsappValidator = () => {
    let whatsapp = value.trim();

    if (whatsapp.charAt(0) === '0' || whatsapp.charAt(0) === '+') {
      value = value.slice(1);
      value = value.replace(value, '62' + value);
    }

    if (!numberRegex(value)) {
      isWhatsappInvalid = true;
    } else {
      isWhatsappInvalid = false;
    }
  };

  $: focus && value && isLinkInput && linkValidator(value);
  $: focus && value && isSocialInput && socialValidator(value);
  $: value && isEmailInput && emailValidator(value);
  $: value && isWhatsappInput && whatsappValidator();
  $: value && isInstagramInput && withAtValidator(value, 'ig');
  $: value && isTiktokInput && withAtValidator(value, 'tiktok');
  $: value && isTwitterInput && withAtValidator(value, 'twitter');
  $: value && isPhoneInput;
</script>

<div class={`flex flex-col md:text-base text-xs md:text-sm ${$$props.class}`}>
  <h1
    in:fade|local={{ duration: 500 }}
    class={`text-gray-400 after:content-['*'] after:ml-0.5 ${
      value === '' && isEmptyChecking ? 'after:text-red-500' : 'after:hidden'
    }`}
  >
    {title}
  </h1>
  <div>
    <input
      in:fade|local={{ duration: 300 }}
      on:change
      on:focus={() => (focus = true)}
      on:blur={() => (focus = false)}
      placeholder={`${$$props.placeholder}`}
      bind:value
      maxlength={$$props.maxlength}
      class={`w-full rounded-md my-2 h-10 px-2 ${inputbg} ${inputText}`}
      disabled={$$props.disabled}
    />
  </div>
  {#if focus && isLinkInput && isLinkInvalid}
    <small class="text-red-500">
      Link require "https://" or "http://" or "www"
    </small>
  {/if}
  {#if focus && isSocialInput && isSocialValid}
    <small class="text-red-500">Invalid social input</small>
  {/if}
  {#if isEmailInput && isEmailValid}
    <small class="text-red-500">Invalid email input</small>
  {/if}
  {#if isWhatsappInput && isWhatsappInvalid}
    <small class="text-red-500"
      >Please use a valid country code and phone number</small
    >
  {/if}

  {#if isInstagramInput && isInstagramInvalid}
    <small class="text-red-500">Instagram doesn't require "@"</small>
  {/if}
  {#if isTiktokInput && isTiktokValid}
    <small class="text-red-500">TikTok require "@"</small>
  {/if}
  {#if isTwitterInput && isTwitterValid}
    <small class="text-red-500">Twitter doesn't require "@"</small>
  {/if}
  {#if isPhoneInput && isPhoneValid}
    <small class="text-red-500">Invalid phone number</small>
  {/if}
  {#if isNumber}
    <small class="text-red-500">Invalid input. Please enter a number.</small>
  {/if}
</div>
