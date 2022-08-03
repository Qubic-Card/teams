<script>
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';

  export let record, teamId, deleteFromTable;

  let showDeleteModal = false;

  const deleteModalHandler = () => (showDeleteModal = !showDeleteModal);

  const deleteCsv = async () => {
    const { error } = await supabase.storage
      .from('records')
      .remove([`${teamId}/${$user?.id}/${record.name}`]);

    if (error) {
      toastFailed('Failed to delete record');
    } else {
      toastSuccess(`${record.name} deleted successfully`);
    }
  };

  const downloadCsv = async (filename) => {
    const { signedURL, error } = await supabase.storage
      .from('records')
      .createSignedUrl(`${teamId}/${$user?.id}/${filename}`, 60);

    if (error) {
      console.log(error);
      toastFailed();
    } else {
      fetch(signedURL)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;

          a.download = `${filename}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toastSuccess(`${filename} has been downloaded`);
        })
        .catch((err) => toastFailed());
    }
  };
</script>

<tr
  class="h-12 text-left py-6 px-4 mb-2 bg-neutral-800 text-neutral-300 border-b border-neutral-700"
>
  <td class="font-bold text-ellipsis pl-4">
    <p class="w-96 truncate">
      {record.name ?? '-'}
    </p>
  </td>

  <td class="pl-4">
    {new Date(record.created_at).toDateString().slice(4) ?? '-'}
  </td>

  <td class="pl-4 pr-4">
    {record.name.includes('activities') ? 'Activities' : 'Connections'}
  </td>
  <td class="h-12 pl-4 pr-4 flex gap-4 items-center">
    <ConfirmationModal
      isDelete
      isIconVisible
      isDispatch
      heading="Are you sure you want to delete"
      text={`${record.profileData?.firstname ?? record?.name}
      ${record.profileData?.lastname ?? ''} ?`}
      buttonLabel="Delete"
      showModal={showDeleteModal}
      toggleModal={deleteModalHandler}
      on:action={async () => {
        await deleteCsv();
        deleteFromTable(record.id);
        deleteModalHandler();
      }}
    />
    <!-- 76900f13-9d11-424a-b111-71b1f2cd6def -->
    <img
      src="/download-icon.svg"
      alt=""
      class="w-6 h-6 cursor-pointer"
      on:click={async () => await downloadCsv(record.name)}
    />
  </td>
</tr>
