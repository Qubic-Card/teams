<script>
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import go from '@lib/utils/go';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';
  import download from '@lib/utils/download';
  import { genvcard } from '@lib/vcard/vcardgen';

  export let showModal;
  export let connection;
  export let modalHandler;
</script>

<ModalWrapper
  on:showModal={modalHandler}
  {showModal}
  class="w-1/2"
  title="Connection profile"
>
  <div class="flex w-full justify-between items-center text-white">
    <div class="flex flex-col w-full">
      <div class="flex flex-col lg:flex-row items-center lg:pl-24 pb-4">
        {#if connection.profileData.avatar === ''}
          <div
            class="flex justify-center items-center w-24 md:w-32 lg:w-36 h-24 md:h-32 lg:h-36 text-5xl rounded-lg text-black bg-neutral-600 mr-2 lg:mr-10"
          >
            {connection.profileData.firstname.charAt(0).toUpperCase()}
          </div>
        {:else}
          <AvatarCard
            background={connection.profileData.avatar}
            class="mr-2 lg:mr-10 w-24 md:w-32 lg:w-36"
          />
        {/if}
        <div class="flex flex-col w-72 mt-4 lg:mt-0 text-center lg:text-left">
          <p class="font-bold">
            {connection.profileData.firstname ?? ''}
            {connection.profileData.lastname ?? ''}
          </p>
          <p class={`${connection.profileData.firstname ? '' : 'hidden'}`}>
            {connection.profileData.job ?? ''}
            at {connection.profileData.company ?? ''}
          </p>
          <p>
            Connected at {new Date(connection.dateConnected)
              .toDateString()
              .slice(4)}
          </p>

          <div
            class={`my-2 ${
              connection.link === '' || connection.link === null
                ? 'hidden'
                : 'flex justify-center lg:justify-start'
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
                connection.message === null
                  ? 'hidden'
                  : 'flex justify-center lg:justify-start'
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
    <div
      class="flex flex-col items-center px-4 md:px-12 py-4 bg-neutral-900 rounded-b-lg"
    >
      <button
        on:click={async () =>
          download(await genvcard(connection.profileData), 'contact')}
        class="w-full bg-black rounded-md hover:font-bold text-white mx-auto p-4 mb-4"
      >
        Add to Contacts
      </button>
      <div
        class={`w-full p-4 mb-4 flex-wrap justify-center items-center gap-3 bg-neutral-800 rounded-md ${
          connection.profileData.socials > 0
            ? 'grid grid-cols-3 grid-flow-row 12 md:20 lg:px-32'
            : 'flex'
        }`}
      >
        {#if connection.profileData.socials}
          {#if connection.profileData.socials.length > 0}
            {#each connection.profileData.socials as item}
              {#if item.isActive}
                <BorderButton
                  on:click={async () => await go(item.type, item.data)}
                  ><img
                    src={socialIcons[item.type]}
                    class="w-10 md:12 lg:w-16 h-10 md:h-12 lg:h-16 mx-auto p-2"
                    alt=""
                  /></BorderButton
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
        class="grid grid-cols-1 grid-flow-row gap-3 bg-neutral-800 rounded-md p-4 w-full text-center text-white"
      >
        {#if connection.profileData.links}
          {#if connection.profileData.links.length > 0}
            {#each connection.profileData.links as item}
              {#if item.isActive}
                <p
                  class="cursor-pointer hover:font-bold"
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
</ModalWrapper>
