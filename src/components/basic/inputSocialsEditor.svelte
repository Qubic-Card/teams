<script>
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import Input from '@comp/input.svelte';
  import { basicSocials } from '@lib/stores/editorStore';
  import toNewTab from '@lib/utils/newTab';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { fade } from 'svelte/transition';

  export let item, handleSave, i, handleDeleteSocial, handleUpSocial, socials;
  export let isBusiness = false;
</script>

<div class="p-3 flex">
  <Input
    inputbg="bg-neutral-100"
    inputText="text-black"
    class="flex-grow"
    title={item.type === 'tiktok'
      ? 'TikTok'
      : item.type === 'youtube'
      ? 'YouTube'
      : isBusiness
      ? item.type.split('-')[0].charAt(0).toUpperCase() +
        item.type.split('-')[0].slice(1) +
        ' Business'
      : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
    placeholder={item.type.includes('maps') ? 'Google location ID e.g. iHwo3PhgD7nsCGE2A' : item.type.includes('instagram') 
      ? 'Username (without @)'
      : item.type.includes('tiktok') || item.type.includes('threads')
      ? 'Username (with @)'
      : item.type.includes('whatsapp')
      ? 'with country code. ex: 62...'
      : item.type.includes('twitter')
      ? 'Username (without @)'
      : item.type.includes(' facebook')
      ? 'Username'
      : item.type.includes('youtube')
      ? 'channel/UC4kUcG-bHD1ARIPINkS_n8A'
      : item.type.includes('linkedin')
      ? 'in/username or company/qubic-id'
      : item.type.includes('email')
      ? 'support@qubic.id'
      : item.type.includes('phone')
      ? '+62 / 081'
      : item.type.includes('facebook')
      ? 'Username'
      : item.type.includes('line')
      ? 'Line ID'
      : item.type.includes('github') || item.type.includes('telegram')
      ? 'Username'
      : item.type.includes('discord')
      ? 'Discord Server ID ex: MQbxj94K'
      : item.type}
    bind:value={socials[i].data}
    on:change={handleSave}
    isSocialInput={true}
    isThreadsInput={item.type.includes('threads')}
    isTiktokInput={item.type.includes('tiktok')}
    isEmailInput={item.type.includes('email')}
    isWhatsappInput={item.type.includes('whatsapp')}
    isInstagramInput={item.type.includes('instagram')}
    isPhoneInput={item.type.includes('phone')}
    isEmptyChecking={true}
  />

  <div class="flex items-center h-[6.3rem]">
    <Menu
      as="div"
      class="bg-neutral-100 inline-block relative h-8 mx-2 rounded-md"
      let:open
    >
      {#if open}
        <div
          transition:fade|local={{ duration: 200 }}
          class="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
          on:click
        />
      {/if}
      <MenuButton class="w-8 h-auto flex justify-center items-center pt-1"
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
      <MenuItems
        class="top-10 z-40 absolute rounded-md flex flex-col bg-white shadow-md border border-neutral-300 p-2 w-40"
      >
        <MenuItem
          class="flex hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
          on:click={() =>
            toNewTab(
              isBusiness ? item.type.split('-')[0] : item.type,
              item.data
            )}
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
          class="flex hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
          on:click={async () => {
            handleDeleteSocial(item, $basicSocials);
            await handleSave();
          }}
        >
          <img
            class="cursor-pointer mr-2"
            draggable="false"
            width="20"
            height="20"
            src="/icons/trash.svg"
            alt=""
          />
          <p>Delete</p>
        </MenuItem>
        {#if i != 0}
          <MenuItem
            class="flex  hover:bg-neutral-300 px-2 py-1 rounded-md cursor-pointer"
            on:click={async () => {
              handleUpSocial(item, i, $basicSocials, isBusiness);
              await handleSave();
            }}
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
    </Menu>
    <SwitchButton on:change={handleSave} bind:checked={item.isActive} />
  </div>
</div>
