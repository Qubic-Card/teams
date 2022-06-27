<script>
  import DeleteModal from '@comp/modals/deleteModal.svelte';
  import ConnectionsModal from '@comp/modals/connectionsModal.svelte';
  import { createEventDispatcher } from 'svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';
  import EditConnectionsModal from '@comp/modals/editConnectionsModal.svelte';
  import { socials } from '@lib/stores/editorStore';

  export let innerWidth;
  export let connection;
  export let i;
  let showDeleteModal = false;
  let showModal = false;
  let showEditModal = false;

  const editModalHandler = () => (showEditModal = !showEditModal);
  const modalHandler = () => (showModal = !showModal);
  const modalHandlerr = () => (showDeleteModal = !showDeleteModal);
  $: $socials = connection.profileData.socials;
</script>

<tr
  class="h-12 text-left py-6 px-4 mb-2 bg-neutral-800 text-neutral-300 border-b border-neutral-700"
>
  <td
    on:click={modalHandler}
    class="font-bold text-ellipsis truncate pl-4 cursor-pointer flex-1"
  >
    {connection.profileData.firstname ?? '-'}
    {connection.profileData.lastname ?? '-'}
  </td>

  {#if innerWidth > 640}
    <td class="flex-1 truncate pl-4">{connection.profileData.job ?? '-'}</td>
    <td class="flex-1 truncate pl-4">
      {connection.profileData.company ?? '-'}
    </td>
  {/if}

  <td class="flex-1 truncate pl-4">
    {new Date(connection.dateConnected).toDateString().slice(4) ?? '-'}
  </td>

  <td class="flex-1 truncate pl-4 pr-4">
    {connection.by.team_profile.firstname ?? '-'}
    {connection.by.team_profile.lastname ?? '-'}
  </td>
  <td class="flex-1 h-12 truncate pl-4 pr-4 flex gap-4 items-center">
    <!-- <img src="/edit-icon.svg" alt="" class="w-6 h-6 cursor-pointer" /> -->
    <!-- <img
      src="/edit-icon.svg"
      alt=""
      class="w-6 h-6 cursor-pointer"
      on:click={editModalHandler}
    /> -->
    <EditConnectionsModal data={connection} />
    <DeleteModal data={connection} />
    <img
      src="/download-icon.svg"
      alt=""
      class="w-6 h-6 cursor-pointer"
      on:click={modalHandlerr}
    />
  </td>
</tr>
<ConnectionsModal {modalHandler} {showModal} {connection} />
