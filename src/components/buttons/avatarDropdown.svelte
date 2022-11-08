<script>
  import Confirmation from '@comp/modals/confirmation.svelte';
  import supabase from '@lib/db';
  import { toastSuccess } from '@lib/utils/toast';
  import { Listbox } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let sortOptions = [],
    avatar = '',
    uid,
    cardId;

  let selected = sortOptions[0];
  let isOpen = false;
  let email = '';
  let isLoading = false;
  let showModal = false;

  const toggleModal = () => {
    showModal = !showModal;
    isOpen = false;
  };

  const dispatch = createEventDispatcher();
  const action = () => dispatch('action');

  const getUserEmail = async () => {
    if (uid !== undefined) {
      const { data, error } = await supabase.functions.invoke('getUserEmail', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
        }),
      });
      if (error) console.log(error);
      if (data) {
        email = data.user;
      }
    }
  };

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
      toastSuccess('Card has been disconnected');
    }

    isOpen = false;
    isLoading = false;
  };

  // 613572e9-f471-4f0d-90d2-d8511d1ac462
</script>

<Confirmation
  {isLoading}
  isDispatch
  isDisconnect
  heading="Are you sure ?"
  text="This action will reset the card."
  buttonLabel="Disconnect"
  {showModal}
  {toggleModal}
  on:action={async () => {
    await disconnectHandler();
    action();
    showModal = false;
  }}
/>

<Listbox
  class="w-1/2"
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

  <img
    on:click={() => (isOpen = true)}
    src={avatar}
    alt=""
    class="rounded-full w-20 h-20 absolute right-0 -bottom-6 cursor-pointer"
  />

  {#if isOpen}
    <div
      class="absolute bg-neutral-800 text-white outline outline-1 outline-neutral-700 p-2 w-52 mt-2 shadow-md z-50 flex flex-col gap-2 rounded-md -translate-x-12 translate-y-12"
    >
      {#await getUserEmail()}
        <div class="animate-pulse flex flex-col gap-2">
          <div class="bg-neutral-900 w-full h-8 rounded-md" />
          <div class="bg-neutral-900 w-full h-8 rounded-md" />
        </div>
      {:then name}
        <h1 class="text-xs md:text-sm break-all">
          Connected to <span class="font-bold">{email}</span>
        </h1>
        <button
          on:click={toggleModal}
          class="bg-red-600/30 outline outline-1 outline-red-500 rounded-md w-full p-2 text-xs md:text-md hover:outline-red-700"
          >Disconnect</button
        >
      {:catch name}
        <h1 class="text-md">Error</h1>
        <button
          on:click={() =>
            window.open('https://wa.me/628113087599', '_blank').focus()}
          class="outline outline-1 outline-neutral-700 p-2 text-xs md:text-md hover:outline-neutral-500 rounded-md"
        >
          Contact Us!
        </button>
      {/await}
    </div>
  {/if}
</Listbox>
