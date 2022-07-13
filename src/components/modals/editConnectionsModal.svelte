<script>
  import Input from '@comp/input.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import EditModalWrapper from '@comp/modals/editModalWrapper.svelte';
  import { links, socials } from '@lib/stores/editorStore';
  import AddSocialsModal from '@comp/modals/addSocialsModal.svelte';

  export let data;
  let showModal = false;
  let activeSocialMedia = [];
  let activeLinks = [];

  const modalHandler = () => {
    showModal = !showModal;
    $socials = activeSocialMedia;
    $links = activeLinks;
  };

  $: activeSocialMedia = data.profileData.socials.filter(
    (social) => social.isActive
  );
  $: activeLinks = data.profileData.links.filter((link) => link.isActive);
  // $: console.log(data.profileData.links);
  // $: console.log(data.profileData.socials.map((social) => social.isActive));
  const updateConnectionsData = async () => {
    data.profileData.socials = $socials;
    data.profileData.links = $links;
    data.profileData = Object.assign(data.profileData, {
      edited: new Date(),
    });
    const { error } = await supabase
      .from('team_connection_acc')
      .update({ profileData: data.profileData }, { returning: 'minimal' })
      .eq('id', data.id);

    if (error) {
      toastFailed('Failed to update connection data');
    } else {
      toastSuccess('Connection data updated successfully');
      modalHandler();
    }
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
      />
    {/each}
  </div>

  <div class="flex flex-col mb-2">
    <div class="flex justify-between items-center">
      <h1 class="font-bold text-xl text-white">Links</h1>
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
        />
      {/each}
    {:else}
      <h1>No link found</h1>
    {/if}
  </div>
</EditModalWrapper>
