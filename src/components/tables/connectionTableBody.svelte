<script>
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import ConnectionsModal from '@comp/modals/connectionsModal.svelte';
  import EditConnectionsModal from '@comp/modals/editConnectionsModal.svelte';
  import download from '@lib/utils/download';
  import { genvcard } from '@lib/vcard/vcardgen';

  export let innerWidth;
  export let connection;
  export let tab;
  export let deleteHandler;

  let loading = false;
  let showDeleteModal = false;
  let showModal = false;

  const modalHandler = () => (showModal = !showModal);
  const deletModalHandler = () => (showDeleteModal = !showDeleteModal);
</script>

<tr
  class="h-12 text-left py-6 px-4 mb-2 bg-neutral-800 text-neutral-300 border-b border-neutral-700"
>
  <td
    on:click={modalHandler}
    class="font-bold text-ellipsis truncate pl-4 cursor-pointer flex-1"
  >
    {connection?.profileData?.firstname ?? '-'}
    {connection?.profileData?.lastname ?? '-'}
  </td>

  {#if innerWidth > 640}
    <td class="flex-1 truncate pl-4">{connection?.profileData?.job ?? '-'}</td>
    <td class="flex-1 truncate pl-4">
      {connection?.profileData?.company ?? '-'}
    </td>
  {/if}

  <td class="flex-1 truncate pl-4">
    {new Date(connection.dateConnected).toDateString().slice(4) ?? '-'}
  </td>

  <td class="flex-1 truncate pl-4 pr-4">
    {connection?.by?.team_profile?.firstname ?? '-'}
    {connection?.by?.team_profile?.lastname ?? '-'}
  </td>
  <td class="flex-1 h-12 truncate pl-4 pr-4 flex gap-4 items-center">
    <EditConnectionsModal
      data={connection}
      on:sendUpdatedData={(e) => (connection = e.detail)}
    />
    <ConfirmationModal
      isDelete
      isIconVisible
      isDispatch
      heading="Are you sure you want to delete"
      text={`${connection.profileData?.firstname ?? connection?.name}
      ${connection.profileData?.lastname ?? ''} ?`}
      on:action={() => {
        deleteHandler(connection.id, tab);
        deletModalHandler();
      }}
      buttonLabel="Delete"
      showModal={showDeleteModal}
      toggleModal={deletModalHandler}
    />
    <img
      src="/download-icon.svg"
      alt=""
      class="w-6 h-6 cursor-pointer"
      on:click={async () => {
        download(await genvcard(connection?.profileData), 'contact');
      }}
    />
    <small>{connection?.profileData.edited ? 'Edited' : ''}</small>
  </td>
</tr>
<ConnectionsModal {modalHandler} {showModal} {connection} />
