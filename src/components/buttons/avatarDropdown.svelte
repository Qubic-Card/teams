<script>
  import { log } from '@lib/logger/logger';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import supabase from '@lib/db';
  import { teamData } from '@lib/stores/teamStore';
  import { memberData, user } from '@lib/stores/userStore';
  import { toastSuccess } from '@lib/utils/toast';
  import { Listbox } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher, getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  export let sortOptions = [],
    avatar = '',
    cardId,
    email,
    uid;

  const teamId = getContext('teamId');
  let selected = sortOptions[0];
  let isOpen = false;
  let isLoading = false;
  let showModal = false;

  const toggleModal = () => {
    showModal = !showModal;
    isOpen = false;
  };

  const dispatch = createEventDispatcher();
  const action = () => dispatch('action');

  const disconnectHandler = async () => {
    isLoading = true;
    const { data, error } = await supabase
      .from('team_cardcon')
      .delete()
      .eq('card_id', cardId);

    if (error) {
      console.log(error);
      return;
    } else {
      log(
        `${email} has been disconnected from ******${cardId.slice(-6)}`,
        'DANGER',
        null,
        teamId,
        $memberData.fullName,
        '',
        $memberData.id
      );
      toastSuccess('Card has been disconnected');
    }

    isOpen = false;
    isLoading = false;
  };
</script>

<ConfirmationModal
  {showModal}
  {toggleModal}
  buttonLabel="Disconnect"
  {isLoading}
  on:action={async () => {
    await disconnectHandler();
    action();
    showModal = false;
  }}
>
  <slot slot="title">
    <h1 class="font-semibold">Disconnect card</h1>
  </slot>
  <slot slot="text">
    <p>
      Are you sure you want to disconnect <br />
      ******{cardId.slice(-6)} from {$teamData.name} team?
    </p>
  </slot>
</ConfirmationModal>

<Listbox
  class="w-full absolute flex flex-col"
  value={selected}
  on:change={(e) => (selected = e.detail)}
>
  {#if isOpen}
    <div
      on:click={() => (isOpen = false)}
      transition:fade|local={{ duration: 200 }}
      class="fixed inset-0 bg-black/50 z-50"
      aria-hidden="true"
    />
  {/if}

  {#if avatar === ''}
    <img
      on:click={() => (isOpen = true)}
      src="/favicon.svg"
      alt=""
      class="rounded-full rounded-custom w-20 h-20 bg-black absolute right-0 -bottom-12 cursor-pointer {uid ===
      $user?.id
        ? 'outline outline-2 outline-blue-600'
        : ''}"
    />
  {:else}
    <img
      on:click={() => (isOpen = true)}
      src={avatar}
      alt=""
      class="rounded-full rounded-custom w-20 h-20 absolute right-0 -bottom-12 cursor-pointer {uid ===
      $user?.id
        ? 'outline outline-2 outline-blue-600'
        : ''}"
    />
  {/if}

  {#if isOpen}
    <div
      class="absolute bg-neutral-800 text-white border border-neutral-700 p-2 w-52 mt-2 shadow-md z-50 flex flex-col gap-2 rounded-md self-end"
    >
      <h1 class="text-xs md:text-sm break-all">
        Connected to <span class="font-semibold">{email}</span>
      </h1>
      <button
        on:click={toggleModal}
        class="bg-red-600/30 outline outline-1 outline-red-500 rounded-md w-full p-2 text-xs md:text-md hover:outline-red-700"
        >Disconnect</button
      >
    </div>
  {/if}
</Listbox>

<!-- -translate-x-32 md:-translate-x-16 lg:-translate-x-12 translate-y-12 -->
<style>
  .rounded-custom {
    border-radius: 9999px !important;
    -webkit-border-radius: 9999px !important;
    -moz-border-radius: 9999px !important;
  }
</style>
