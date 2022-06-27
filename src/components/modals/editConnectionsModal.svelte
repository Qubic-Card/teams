<script>
  import { fly } from 'svelte/transition';
  import Input from '@comp/input.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import EditModalWrapper from '@comp/modals/editModalWrapper.svelte';
  import { socials } from '@lib/stores/editorStore';
  import { socialIcons } from '@lib/constants';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';

  export let data;
  let showModal = false;
  // $: console.log(data.profileData.firstname, $socials);
  const modalHandler = () => (showModal = !showModal);
  // $: $socials = data.profileData.socials;
  const updateConnectionsData = async () => {
    // data.profileData.socials = $socials;
    const { error } = await supabase
      .from('team_connection_acc')
      .update({ profileData: data.profileData }, { returning: 'minimal' })
      .eq('id', data.id);

    if (error) {
      toastFailed('Failed to update connection data');
    } else {
      toastSuccess('Connection data updated successfully');
      modalHandler();
      location.reload();
    }
  };
</script>

<!-- <img
  src="/edit-icon.svg"
  alt=""
  class="w-6 h-6 cursor-pointer"
  on:click={modalHandler}
/> -->

<EditModalWrapper
  title="Edit connection"
  {showModal}
  on:showModal={modalHandler}
  on:save={async () => await updateConnectionsData()}
>
  <div class="flex flex-col mb-2">
    <h1 class="font-bold text-xl text-white mb-2">Identity</h1>
    <Input
      placeholder="Firstname"
      title="Firstname"
      bind:value={data.profileData.firstname}
    />
    <Input
      placeholder="Lastname"
      title="Lastname"
      bind:value={data.profileData.lastname}
    />
    <Input placeholder="Job" title="Job" bind:value={data.profileData.job} />
    <Input
      placeholder="Company"
      title="Company"
      bind:value={data.profileData.company}
    />
  </div>
  <div class="flex flex-col mb-2">
    <div class="flex justify-between">
      <h1 class="font-bold text-xl text-white mb-2">Socials</h1>
      <AddSocialsModal />
    </div>
    {#each data.profileData.socials as social}
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
      />
    {/each}
  </div>

  <div class="flex flex-col mb-2">
    <h1 class="font-bold text-xl text-white mb-2">link</h1>
    {#each data.profileData.links as link}
      <Input
        class="flex-grow"
        title={link.title}
        placeholder="Website"
        bind:value={link.link}
      />
    {/each}
  </div>
</EditModalWrapper>
