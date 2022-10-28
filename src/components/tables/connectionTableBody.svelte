<script>
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import ConnectionsModal from '@comp/modals/connectionsModal.svelte';
  import EditConnectionsModal from '@comp/modals/editConnectionsModal.svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import download from '@lib/utils/download';
  import { genvcard } from '@lib/vcard/vcardgen';

  export let innerWidth, connection, tab, deleteHandler, isLoading, permissions;

  let loading = false;
  let showDeleteModal = false;
  let showModal = false;

  const modalHandler = () => (showModal = !showModal);
  const deletModalHandler = () => (showDeleteModal = !showDeleteModal);
</script>

<tr
  class="h-12 text-sm text-left py-6 px-4 mb-2 bg-neutral-900 text-neutral-300 border-b border-neutral-800"
>
  <td
    on:click={modalHandler}
    class="font-bold truncate pl-4 cursor-pointer flex-1"
  >
    <p class="flex items-center gap-1">
      {connection?.profileData?.firstname ?? ''}
      <span class="hidden md:flex">
        {connection?.profileData?.lastname ?? ''}
      </span>
    </p>
  </td>

  {#if innerWidth > 640}
    <td class="flex-1 truncate pl-4">{connection?.profileData?.job ?? ''}</td>
    <td class="flex-1 truncate pl-4">
      {connection?.profileData?.company ?? ''}
    </td>

    <td class="flex-1 truncate pl-4">
      {convertToGMT7(connection?.dateConnected).toDateString().slice(4) ?? ''}
    </td>

    <td class="flex-1 truncate pl-4 pr-4">
      {connection?.by?.firstname ?? ''}
      {connection?.by?.lastname ?? ''}
    </td>

    <td class="flex-1 h-12 truncate pl-4 pr-4 flex gap-4 items-center">
      {#if permissions.will_expire === false}
        {#if permissions.writeConnection}
          {#if permissions.isTeamInactive === false}
            <EditConnectionsModal
              data={connection}
              on:sendUpdatedData={(e) => (connection = e.detail)}
            />
            <ConfirmationModal
              {isLoading}
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
              class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
              on:click={async () => {
                download(
                  await genvcard(
                    connection?.profileData,
                    {
                      display_personal: true,
                    },
                    connection.dateConnected
                  ),
                  'contact'
                );
              }}
            />
            <small>{connection?.profileData.edited ? 'Edited' : ''}</small>
          {/if}
        {/if}
      {:else}
        <img
          src="/download-icon.svg"
          alt=""
          class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
          on:click={async () => {
            download(
              await genvcard(connection?.profileData, {
                display_personal: true,
              }),
              'contact'
            );
          }}
        />
      {/if}
    </td>
  {/if}
</tr>
<ConnectionsModal {modalHandler} {showModal} {connection} />
