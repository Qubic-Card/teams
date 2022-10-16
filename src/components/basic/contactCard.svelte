<script>
  import ModalWrapperHeadless from '@comp/modals/modalWrapperHeadless.svelte';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import { genvcard } from '@lib/vcard/vcardgen';
  import { fade } from 'svelte/transition';
  import Spinner from '@comp/loading/spinner.svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import toNewTab from '@lib/utils/newTab';

  export let profile, deleteConnectionHandler, isLoading, getConnectionsList;
  let img;
  let isOpen = false;
  let isDeleteModalOpen = false;

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

  const checkIsBusiness = () => {
    return (
      profile?.profileData?.socials?.filter((social) =>
        social.type.includes('business')
      )?.length > 0
    );
  };
</script>

<div class="flex items-center" transition:fade|local={{ duration: 200 }}>
  <div
    class="w-10 h-10 font-semibold  rounded justify-center items-center flex bg-black text-white"
  >
    {profile?.profileData?.firstname?.slice(0, 1) ?? 'Q'}
  </div>
  <div
    class="bg-white flex justify-between items-center gap-2 relative border p-2 w-full mx-2 rounded"
  >
    <div on:click={() => (isOpen = true)} class="cursor-pointer w-full">
      <p class="cursor-pointer" on:click={() => (isOpen = true)}>
        {profile?.profileData?.firstname ?? '-'}
      </p>
      <p class="text-sm text-neutral-600">
        {profile?.profileData?.company
          ? profile?.profileData?.company + ' | '
          : ''}
        {profile?.profileData?.job ?? '-'}
      </p>
    </div>
    <div
      class="border border-neutral-300 p-2 rounded-md cursor-pointer"
      on:click={() => (isDeleteModalOpen = true)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="red"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </div>
  </div>
</div>

{#if isDeleteModalOpen}
  <ModalWrapperHeadless
    desktopWidth="md:w-1/2 lg:w-1/3"
    desktopHeight="md:h-[25%]"
    mobileHeight="h-[30%]"
    bg="bg-white"
    text="text-black"
    desktopRight="md:right-1/4"
    isOpen={isDeleteModalOpen}
    on:modalHandler={(e) => (isDeleteModalOpen = e.detail)}
  >
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col pt-2">
        <img
          on:click={() => (isDeleteModalOpen = false)}
          class="self-end cursor-pointer h-4"
          bind:this={img}
          width="16"
          height="16"
          src="/icons/icons8-close-48.png"
          alt="close"
        />
        <p class="text-center mt-2">
          Are you sure you want to delete <span class="font-bold"
            >{profile?.profileData?.firstname}</span
          > from your connection?
        </p>
        <small class="font-bold text-center"
          >This action cannot be undone.</small
        >
      </div>
      <div class="flex gap-2">
        <button
          class="w-1/2 p-2 rounded-md bg-neutral-200 hover:bg-neutral-300"
          on:click={() => (isDeleteModalOpen = false)}>Cancel</button
        >
        <button
          class="flex gap-2 items-center justify-center w-1/2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          on:click={async () => {
            await deleteConnectionHandler(profile?.id);
            await getConnectionsList();
            isDeleteModalOpen = false;
          }}
        >
          {#if isLoading}
            <Spinner class="w-6 h-6" />
          {/if}
          Delete
        </button>
      </div>
    </div>
  </ModalWrapperHeadless>
{/if}

<ModalWrapperHeadless
  desktopWidth="md:w-1/2 lg:w-1/3"
  desktopRight="md:right-1/4"
  desktopTop="md:top-[5%]"
  bg="bg-white"
  text="text-black"
  {isOpen}
  on:modalHandler={(e) => (isOpen = e.detail)}
  initialFocus={img}
>
  <div class="border-b border-solid rounded-lg min-h-[67%]">
    <div class="flex w-full justify-between items-center">
      <div class="flex flex-col w-full">
        <div
          on:click={() => (isOpen = false)}
          class="cursor-pointer text-3xl self-end p-4"
        >
          <img
            bind:this={img}
            width="20"
            height="20"
            src="/icons/icons8-close-48.png"
            alt="close"
          />
        </div>
        <div class="flex flex-col items-center gap-2 md:gap-4 mx-4 pb-4">
          {#if profile?.profileData?.avatar === ''}
            <div
              class="flex rounded-2xl justify-center items-center w-24 h-24 aspect-square text-5xl text-white bg-black"
            >
              {profile?.profileData?.firstname?.charAt(0).toUpperCase()}
            </div>
          {:else if profile?.profileData?.avatar === undefined}
            <div
              class="flex rounded-2xl justify-center items-center w-24 h-24 aspect-square text-5xl text-white bg-black"
            >
              {profile?.profileData?.firstname?.charAt(0).toUpperCase()}
            </div>
          {:else}
            <AvatarCard
              background={profile?.profileData?.avatar}
              class="w-24 md:w-32 lg:w-36"
            />
          {/if}
          <div class="flex flex-col text-center">
            <p class="font-bold">
              {profile?.profileData?.firstname ??
                profile?.profileData?.firstName}
              {profile?.profileData?.lastname ?? profile?.profileData?.lastName}
            </p>
            <p class={`text-xs ${profile?.profileData?.job ? '' : 'hidden'}`}>
              {profile?.profileData?.job ?? '-'}
              at {profile?.profileData?.company ?? '-'}
            </p>
            <p class="text-xs">
              Connected at {convertToGMT7(profile?.dateConnected)
                .toDateString()
                .slice(4)}
            </p>

            <div
              class={`${
                profile?.link === '' || profile?.link === null
                  ? 'hidden'
                  : 'flex justify-center'
              }`}
            >
              <p
                class={`text-sm cursor-pointer underline hover:font-semibold ${
                  profile?.link === '' ? 'hidden' : ''
                }`}
                on:click={() => window.open(profile?.link, '_blank').focus()}
              >
                {profile?.link}
              </p>
            </div>
            <div>
              <div
                class={`${
                  profile?.message === null ? 'hidden' : 'flex justify-center'
                }`}
              >
                <img
                  class="mr-2 mt-4"
                  draggable="false"
                  width="20"
                  height="20"
                  alt=""
                  src="https://img.icons8.com/external-xnimrodx-lineal-xnimrodx/64/undefined/external-letter-job-amp-resume-xnimrodx-lineal-xnimrodx.png"
                />
                <p class="text-sm text-neutral-800 mt-4">
                  {profile?.message ?? ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-full h-full">
      <div
        class="flex flex-col items-center px-4 md:px-12 py-4 bg-gray-100 rounded-t-lg rounded-b-lg h-full mb-4"
      >
        <button
          on:click={async () =>
            download(
              await genvcard(
                profile?.profileData,
                undefined,
                convertToGMT7(profile?.dateConnected)
              ),
              'contact'
            )}
          class="w-full bg-blue-600 hover:font-bold text-white mx-auto p-3 rounded-md"
        >
          Save contact
        </button>
        <div
          class={`w-full ${
            profile?.profileData?.socials?.length < 1
              ? 'flex flex-wrap'
              : 'grid grid-cols-3 grid-flow-row'
          } my-2 justify-center items-center gap-2 rounded-md`}
        >
          {#if profile?.profileData?.socials}
            {#each profile?.profileData?.socials as item}
              {#if item.isActive}
                <BorderButton
                  class="rounded-md bg-white col-span-1 py-4 outline-neutral-200"
                  on:click={async () =>
                    await toNewTab(
                      checkIsBusiness() ? item.type.split('-')[0] : item.type,
                      item.data
                    )}
                  ><img
                    src={item.type.includes('github')
                      ? 'https://img.icons8.com/fluency/48/FA5252/github.png'
                      : socialIcons[
                          checkIsBusiness()
                            ? item.type.split('-')[0]
                            : item.type
                        ]}
                    class="w-10 h-10 mx-auto"
                    alt=""
                  /></BorderButton
                >
              {/if}
            {/each}
          {:else}
            <div class="flex flex-col items-center mb-4 rounded-md">
              <p class="text-center text-gray-600">
                No social media accounts connected
              </p>
            </div>
          {/if}
        </div>

        <div
          class="grid grid-cols-1 grid-flow-row justify-between w-full gap-1"
        >
          {#if checkIsBusiness()}
            {#if profile.profileData.links}
              {#each profile.profileData.links.filter((link) => link.isPersonal !== true) as item}
                {#if item.isActive}
                  <p
                    class="p-4 flex-grow flex justify-center bg-white rounded-md border border-neutral-200 items-center hover:font-semibold cursor-pointer"
                    on:click={() => window.open(item.link, '_blank').focus()}
                  >
                    {item.title ?? ''}
                  </p>
                {/if}
              {/each}
            {:else}
              <div class="flex flex-col w-full items-center p-4 rounded-md">
                <p class="text-center text-gray-600">No links added</p>
              </div>
            {/if}
          {:else if profile.profileData.links}
            {#if profile.profileData.links.filter((link) => link.isPersonal !== false).length > 0}
              {#each profile.profileData.links.filter((link) => link.isPersonal !== false) as item}
                {#if item.isActive}
                  <p
                    class="p-4 flex-grow flex justify-center bg-white rounded-md border border-neutral-200 items-center hover:font-semibold cursor-pointer"
                    on:click={() => window.open(item.link, '_blank').focus()}
                  >
                    {item.title ?? ''}
                  </p>
                {/if}
              {/each}
            {:else}
              <div class="flex flex-col w-full items-center p-4 rounded-md">
                <p class="text-center text-gray-600">No links added</p>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </div>
</ModalWrapperHeadless>
