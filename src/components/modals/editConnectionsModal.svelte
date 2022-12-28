<script>
  import Input from '@comp/input.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { links, socials } from '@lib/stores/editorStore';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';
  import { Dialog, DialogTitle } from '@rgossiaux/svelte-headlessui';
  import { profileData } from '@lib/stores/profileData';
  import { createEventDispatcher } from 'svelte';
  import ModalOverlay from '@comp/modals/modalOverlay.svelte';

  export let data;
  let open = false;
  let loading = false;
  let activeSocialMedia = [];
  let activeLinks = [];
  const dispatch = createEventDispatcher();
  const sendUpdatedData = (data) => dispatch('sendUpdatedData', data);
  const toggleModal = () => {
    open = !open;
    $socials = activeSocialMedia;
    $links = activeLinks;
    if (open) $profileData = null;
  };

  $: activeSocialMedia = data?.profileData?.socials?.filter(
    (social) => social.isActive
  );
  $: activeLinks = data?.profileData?.links?.filter((link) => link.isActive);

  const updateConnectionsData = async () => {
    data.profileData.socials = $socials;
    data.profileData.links = $links;
    data.profileData = Object.assign(data.profileData, {
      edited: new Date(),
    });

    loading = true;
    const { error } = await supabase
      .from('team_connection_acc')
      .update({ profileData: data.profileData })
      .eq('id', data.id)
      .select();

    if (error) {
      toastFailed('Failed to update connection data');
      loading = false;
    } else {
      toastSuccess('Connection data updated successfully');
      sendUpdatedData(data);
      loading = false;
    }
    loading = false;
  };

  const addLink = () => {
    $links.length < 5
      ? links.set([
          ...$links,
          { title: 'My Website', link: 'https://qubic.id', isActive: true },
        ])
      : toastFailed('Only 5 link allowed for free members');
  };
</script>

<ModalOverlay isOpen={open} on:click={() => (open = false)} />

<img
  src="/edit-icon.svg"
  alt=""
  class="w-6 h-6 cursor-pointer"
  on:click={toggleModal}
/>
<Dialog
  static
  {open}
  on:close={() => (open = false)}
  class={`${
    open ? 'translate-x-0' : 'translate-x-[900px]'
  } transition-all duration-300 ease-in-out flex flex-col h-screen w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-neutral-800 border-l-2 border-neutral-700 text-white overflow-y-auto snap-y snap-mandatory`}
>
  <DialogTitle class="text-xl pb-2 border-b-2 border-neutral-700 z-30"
    >Edit Connection</DialogTitle
  >

  <div class="flex flex-col mb-2 z-30">
    <h1 class="font-semibold text-xl text-white mb-2">Identity</h1>
    <Input
      placeholder="Firstname"
      title="Firstname"
      bind:value={data.profileData.firstname}
      on:change={updateConnectionsData}
      inputbg="bg-neutral-900"
    />
    <Input
      placeholder="Lastname"
      title="Lastname"
      bind:value={data.profileData.lastname}
      on:change={updateConnectionsData}
      inputbg="bg-neutral-900"
    />
    <Input
      placeholder="Job"
      title="Job"
      bind:value={data.profileData.job}
      on:change={updateConnectionsData}
      inputbg="bg-neutral-900"
    />
    <Input
      placeholder="Company"
      title="Company"
      bind:value={data.profileData.company}
      on:change={updateConnectionsData}
      inputbg="bg-neutral-900"
    />
  </div>
  <div class="flex flex-col mb-2 z-30">
    <div class="flex justify-between">
      <h1 class="font-semibold text-xl text-white mb-2">Socials</h1>
      <AddSocialsModal />
    </div>
    {#each $socials as social}
      <Input
        class="flex-grow"
        title={social.type === 'tiktok'
          ? 'TikTok'
          : social.type === 'youtube'
          ? 'YouTube'
          : social.type.charAt(0).toUpperCase() + social.type.slice(1)}
        placeholder={social.type === 'instagram'
          ? 'Username (without @)'
          : social.type === 'tiktok'
          ? 'Tiktok (with @)'
          : social.type === 'whatsapp'
          ? 'Whatsapp (with country code. ex: 62...'
          : social.type === 'twitter'
          ? 'Username (without @)'
          : social.type === ' facebook'
          ? 'Username'
          : social.type === 'youtube'
          ? 'channel/UC4kUcG-bHD1ARIPINkS_n8A'
          : social.type === 'linkedin'
          ? 'in/username or company/qubic-id'
          : social.type === 'email'
          ? 'support@qubic.id'
          : social.type === 'phone'
          ? '+62 / 081'
          : social.type === 'facebook'
          ? 'Username'
          : social.type === 'line'
          ? 'Line ID'
          : social.type}
        bind:value={social.data}
        on:change={updateConnectionsData}
        inputbg="bg-neutral-900"
      />
    {/each}
  </div>

  <div class="flex flex-col mb-2 z-30">
    <div class="flex justify-between items-center">
      <h1 class="font-semibold text-xl text-white">Links</h1>
      <img
        class="h-10 w-10 cursor-pointer"
        on:click={addLink}
        src="/add-icon.svg"
        alt="add"
      />
    </div>
    {#if $links.length > 0}
      {#each $links as link}
        <Input
          class="flex-grow"
          title={link.title}
          placeholder="Website"
          bind:value={link.link}
          on:change={updateConnectionsData}
          inputbg="bg-neutral-900"
        />
      {/each}
    {:else}
      <h1>No link found</h1>
    {/if}
  </div>
</Dialog>
