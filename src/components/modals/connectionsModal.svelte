<script>
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import { socialIcons } from '@lib/constants';
  import download from '@lib/utils/download';
  import { genvcard } from '@lib/vcard/vcardgen';
  import { Dialog } from '@rgossiaux/svelte-headlessui';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';
  import toNewTab from '@lib/utils/newTab';

  export let connection;
  export let showModal;
  export let modalHandler;

  let isBusiness =
    connection.profileData.socials.filter((s) => s.type.includes('business'))
      .length > 0;
</script>

<ModalOverlay isOpen={showModal} on:click={modalHandler} />

<Dialog
  static
  open={showModal}
  on:close={modalHandler}
  class={`${
    showModal ? 'translate-x-0' : 'translate-x-[1000px]'
  } transition-all duration-300 ease-in-out min-w-full md:min-w-[360px] flex flex-col h-full md:h-screen p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto`}
>
  <button
    class="self-end text-lg cursor-pointer block md:hidden mt-12 md:mt-3"
    on:click={modalHandler}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>

  <div class="flex w-full justify-between items-center text-white md:mt-4">
    <div class="flex flex-col w-full">
      <div class="flex flex-col mb-2">
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
              editor="team"
              isProfile={false}
            />
          {/if}
        {:else}
          <div
            class="flex justify-center items-center w-24 md:w-32 lg:w-36 h-24 md:h-32 lg:h-36 text-5xl rounded-lg text-neutral-900 bg-neutral-200 "
          >
            Q
          </div>
        {/if}
        <div class="flex flex-col  mt-3">
          <p class="font-semibold text-lg">
            {connection.profileData.firstname ?? ''}
            {connection.profileData.lastname ?? ''}
          </p>
          <p
            class={`${
              connection.profileData.firstname
                ? 'text-neutral-300 text-sm'
                : 'hidden'
            }`}
          >
            {connection.profileData.job
              ? connection.profileData.job + ' at'
              : ''}
            {connection.profileData.company ?? ''}
          </p>
          <p class="text-xs mt-2 text-neutral-300">
            Connected at {new Date(connection.dateConnected)
              .toDateString()
              .slice(4)}
          </p>
          {#if connection.geodata}
          <div class="max-w-md text-xs bg-neutral-900 rounded-md px-2 py-2 mt-2">
            <span class="flex flex-row items-center bg-blue-200 text-blue-800 rounded-full w-fit px-2 py-1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> <p class="ml-2 font-semibold ">Smart Note</p></span>
            <p class="text-neutral-300 mt-2">You met {connection.profileData.firstname} on {connection.geodata.formatted_address}</p>
          <a target="_blank" rel="noreferrer" class="flex flex-row mt-2" href="https://google.com/maps/search/?api=1&place_id={connection.geodata.place_id}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> <p class="border-b ml-2 text-blue-300">Find location on Google Maps</p></a>
          </div>
          {/if}
          
          
          <div
            class={`my-2 ${
              connection.link === '' || connection.link === null
                ? 'hidden'
                : 'flex'
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
              class={`cursor-pointer underline hover:font-regular ${
                connection.link === '' ? 'hidden' : ''
              }`}
              on:click={() => window.open(connection.link, '_blank').focus()}
            >
              {connection.link}
            </p>
          </div>
          <div>
            <div class={`${connection.message === null ? 'hidden' : 'flex'}`}>
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
          download(
            await genvcard(
              connection.profileData,
              { display_personal: true },
              connection.dateConnected
            ),
            'contact'
          )}
        class="w-full bg-blue-600 rounded-md hover:font-semibold text-white text-xs md:text-sm mx-auto p-3 mb-4"
      >
        Save to Contacts
      </button>
      <div
        class={`w-full mb-4 flex-wrap justify-center items-center gap-2 bg-neutral-800 rounded-md ${
          connection?.profileData?.socials?.length > 0
            ? 'grid grid-cols-3'
            : 'flex'
        }`}
      >
        {#if connection?.profileData?.socials}
          {#if connection?.profileData?.socials?.length > 0}
            {#each connection?.profileData?.socials as item}
              {#if item.isActive}
                <button
                  class="col-span-1  rounded"
                  on:click={async () =>
                    await toNewTab(
                      isBusiness ? item.type.split('-')[0] : item.type,
                      item.data
                    )}
                  ><img
                    src={socialIcons[
                      isBusiness ? item.type.split('-')[0] : item.type
                    ]}
                    class="w-14 h-14 rounded  mx-auto p-3"
                    alt=""
                  /></button
                >
              {/if}
            {/each}
          {/if}
        {/if}
      </div>
      <div
        class="grid grid-cols-1 grid-flow-row gap-2 rounded-md w-full text-white"
      >
        {#if connection?.profileData?.links}
          {#if connection?.profileData?.links.length > 0}
            {#each connection?.profileData?.links as item}
              {#if item.isActive}
                <div
                  class="flex-grow flex p-4 cursor-pointer rounded-md border border-neutral-600 items-center hover:font-regular"
                >
                  <p
                    class="break-all"
                    on:click={() => window.open(item.link, '_blank').focus()}
                  >
                    {item.title ?? ''}
                  </p>
                </div>
              {/if}
            {/each}
          {/if}
        {/if}
      </div>
    </div>
  </div>
</Dialog>
