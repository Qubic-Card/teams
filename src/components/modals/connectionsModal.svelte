<script>
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import { socialIcons } from '@lib/constants';
  import go from '@lib/utils/go';
  import download from '@lib/utils/download';
  import { genvcard } from '@lib/vcard/vcardgen';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import toNewTab from '@lib/utils/newTab';

  export let connection;
  export let showModal;
  export let modalHandler;
</script>

<ModalOverlay isOpen={showModal} on:click={modalHandler} />

<Dialog
  static
  open={showModal}
  on:close={modalHandler}
  class={`${
    showModal ? 'translate-x-0' : 'translate-x-96'
  } transition-all duration-300 ease-in-out min-w-[360px] flex flex-col h-screen p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto`}
>
  <div class="flex w-full justify-between items-center text-white">
    <div class="flex flex-col w-full">
      <div class="flex flex-col items-center mb-2">
        {#if connection.profileData.avatar}
          {#if connection.profileData.avatar === ''}
            <div
              class="flex justify-center items-center w-24 md:w-32 lg:w-36 h-24 md:h-32 lg:h-36 text-5xl rounded-lg text-black bg-neutral-600"
            >
              {connection.profileData.firstname.charAt(0).toUpperCase()}
            </div>
          {:else}
            <AvatarCard
              background={connection.profileData.avatar}
              class="w-24 md:w-32 lg:w-36"
            />
          {/if}
        {:else}
          <div
            class="flex justify-center items-center w-24 md:w-32 lg:w-36 h-24 md:h-32 lg:h-36 text-5xl rounded-lg text-black bg-neutral-600 "
          >
            Q
          </div>
        {/if}
        <div class="flex flex-col  mt-3 text-center ">
          <p class="font-bold">
            {connection.profileData.firstname ?? ''}
            {connection.profileData.lastname ?? ''}
          </p>
          <p
            class={`${
              connection.profileData.firstname
                ? 'text-neutral-300 text-sm text-center'
                : 'hidden'
            }`}
          >
            {connection.profileData.job
              ? connection.profileData.job + 'at'
              : ''}
            {connection.profileData.company ?? ''}
          </p>
          <p class="text-xs text-neutral-300">
            Connected at {new Date(connection.dateConnected)
              .toDateString()
              .slice(4)}
          </p>

          <div
            class={`my-2 ${
              connection.link === '' || connection.link === null
                ? 'hidden'
                : 'flex justify-center'
            }`}
          >
            <img
              class="mr-2 bg-neutral-300 rounded-md h-7 w-7 p-1"
              draggable="false"
              width="20"
              height="20"
              src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/48/000000/external-link-essentials-tanah-basah-basic-outline-tanah-basah.png"
              alt=""
            />
            <p
              class={`cursor-pointer underline hover:font-semibold ${
                connection.link === '' ? 'hidden' : ''
              }`}
              on:click={() => window.open(connection.link, '_blank').focus()}
            >
              {connection.link}
            </p>
          </div>
          <div>
            <div
              class={`${
                connection.message === null ? 'hidden' : 'flex justify-center'
              }`}
            >
              <img
                class="mr-2 bg-neutral-300 rounded-md h-7 w-7 p-1"
                draggable="false"
                width="20"
                height="20"
                alt=""
                src="https://img.icons8.com/external-xnimrodx-lineal-xnimrodx/64/undefined/external-letter-job-amp-resume-xnimrodx-lineal-xnimrodx.png"
              />
              <p>
                {connection.message ?? ''}
              </p>
            </div>
            <!-- {/if} -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col w-full">
    <div class="flex flex-col items-center">
      <button
        on:click={async () =>
          download(await genvcard(connection.profileData), 'contact')}
        class="w-full bg-blue-600 rounded-md hover:font-bold text-white mx-auto p-3 mb-4"
      >
        Save to Contacts
      </button>
      <div
        class={`w-full mb-4 flex-wrap justify-center items-center gap-2 bg-neutral-800 rounded-md ${
          connection.profileData.socials.length > 0
            ? 'grid grid-cols-3'
            : 'flex'
        }`}
      >
        {#if connection.profileData.socials}
          {#if connection.profileData.socials.length > 0}
            {#each connection.profileData.socials as item}
              {#if item.isActive}
                <button
                  class="col-span-1  rounded"
                  on:click={async () => await toNewTab(item.type, item.data)}
                  ><img
                    src={socialIcons[item.type]}
                    class="w-14 h-14 rounded  mx-auto p-3"
                    alt=""
                  /></button
                >
              {/if}
            {/each}
          {:else}
            <div class="flex flex-col items-center">
              <p class="text-center text-white">
                No social media accounts connected
              </p>
            </div>
          {/if}
        {/if}
      </div>
      <div
        class="grid grid-cols-1 grid-flow-row gap-2 rounded-md w-full text-center text-white"
      >
        {#if connection.profileData.links}
          {#if connection.profileData.links.length > 0}
            {#each connection.profileData.links as item}
              {#if item.isActive}
                <p
                  class="cursor-pointer border border-neutral-600 rounded p-3 hover:font-bold"
                  on:click={() => window.open(item.link, '_blank').focus()}
                >
                  {item.title}
                </p>
              {/if}
            {/each}
          {:else}
            <div class="flex flex-col items-center">
              <p class="text-center text-white">No link added</p>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</Dialog>
