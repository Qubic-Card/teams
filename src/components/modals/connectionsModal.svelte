<script>
  import { createEventDispatcher } from 'svelte';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import go from '@lib/utils/go';
  import addToContactHandler from '@lib/utils/addToContact';

  export let showModal;
  export let connection;

  const dispatch = createEventDispatcher();
  const toggleModal = () => {
    dispatch('showModal');
  };
</script>

{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex text-white"
  >
    <div
      class="relative w-full md:w-3/4 lg:w-1/2 my-6 mx-auto p-6 md:p-0 md:h-auto md:pt-0 rounded-lg md:max-w-3xl max-w-md"
    >
      <!--content-->
      <div
        class="border-0 shadow-lg relative flex flex-col w-full rounded-lg bg-neutral-900 outline-none focus:outline-none"
      >
        <!--header-->
        <div
          class="border-b border-neutral-900 border-solid rounded-lg h-full md:h-auto"
        >
          <div class="flex w-full justify-between items-center">
            <div class="flex flex-col w-full">
              <p
                on:click={toggleModal}
                class="cursor-pointer text-3xl self-end pr-4"
              >
                x
              </p>
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
                <div
                  class="flex flex-col w-72 mt-4 lg:mt-0 text-center lg:text-left"
                >
                  <p class="font-bold">
                    {connection.profileData.firstname ?? ''}
                    {connection.profileData.lastname ?? ''}
                  </p>
                  <p
                    class={`${
                      connection.profileData.firstname ? '' : 'hidden'
                    }`}
                  >
                    {connection.profileData.job ?? ''}
                    at {connection.profileData.company ?? ''}
                  </p>
                  <p>
                    Connected at {new Date(connection.dateConnected)
                      .toDateString()
                      .slice(4)}
                  </p>
                  <div
                    class={`${
                      connection.profileData.firstname
                        ? ''
                        : 'flex flex-col flex-wrap'
                    }`}
                  >
                    <p>
                      {connection.link ?? ''}
                    </p>
                    <p>
                      {connection.message ?? ''}
                    </p>
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
                on:click={() => addToContactHandler(connection.profileData)}
                class="w-full bg-black rounded-md hover:font-bold text-white mx-auto p-4 mb-4"
              >
                Add to Contacts
              </button>
              <div
                class={`w-full p-4 mb-4 flex-wrap justify-center items-center gap-3 bg-neutral-800 rounded-md ${
                  connection.profileData.socials
                    ? 'grid grid-cols-3 grid-flow-row 12 md:20 lg:px-32'
                    : 'flex'
                }`}
              >
                {#if connection.profileData.socials}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
