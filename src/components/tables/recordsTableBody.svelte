<script>
  import { fade } from 'svelte/transition';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { personal, team } from '@lib/stores/recordsStore';

  export let record, teamId, deleteFromTable, isTeam;
  export let isTeamInactive = false;
  let showDeleteModal = false;
  let isLoading = false;

  const deleteModalHandler = () => (showDeleteModal = !showDeleteModal);

  const deleteCsv = async () => {
    isLoading = true;
    let noErr = false;

    const { error } = await supabase.storage
      .from('records')
      .remove(
        record.storage_url
          ? [`${teamId}/${record.name ? record.name : record.filename}`]
          : [
              `${teamId}/${$user?.id}/${
                record.name ? record.name : record.filename
              }`,
            ]
      );

    const { data, error: err } = await supabase
      .from('team_storage')
      .delete()
      .eq('filename', record.storage_url ? record.filename : record.name);
    if (err) {
      toastFailed(err.message);
    } else {
      noErr = true;
    }

    if (error) {
      toastFailed('Failed to delete record');
      isLoading = false;
    }

    if (record.storage_url ? noErr && !error : !error) {
      toastSuccess(`${record.name} deleted successfully`);
      $personal = $personal.filter((item) => item.id !== record.id);
      $team = $team.filter((item) => item.id !== record.id);
      isLoading = false;
    }
  };

  const downloadCsv = async (filename) => {
    const { signedURL, error } = await supabase.storage
      .from('records')
      .createSignedUrl(
        record.storage_url
          ? record.storage_url.slice(8)
          : `${teamId}/${$user?.id}/${filename}`,
        60
      );

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

          a.download = `${record.storage_url ? record.filename : filename}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toastSuccess(
            `${
              record.storage_url ? record.filename : filename
            } has been downloaded`
          );
        })
        .catch((err) => toastFailed());
    }
  };
  // $: console.log(
  //   record.storage_url
  //     ? console.log('qq', record.filename)
  //     : record.profileData?.firstname ?? record?.name
  // );
  $: console.log(record.filename);
  // DELETE HANDLER DARI TEAM RECORDS ATAU PERSONAL RECORDS JANGAN DARI TABLE INI
  // $: console.log(record.profileData?.firstname ?? record?.name);
</script>

<tr
  out:fade|local={{ duration: 150 }}
  class="h-12 text-left py-6 px-4 mb-2 bg-neutral-800 text-neutral-300 border-b border-neutral-700"
>
  <td class="font-bold text-ellipsis pl-4">
    <p class="w-80 truncate">
      {#if record.storage_url}
        {record.filename ?? '-'}
      {:else}
        {record.name ?? '-'}
      {/if}
    </p>
  </td>

  <td class="pl-4">
    {new Date(record.created_at).toDateString().slice(4) ?? '-'}
  </td>

  <td class="pl-4 pr-4">
    {#if record.storage_url}
      {record.type}
    {:else}
      {record.name.includes('activities') ? 'Activities' : 'Connections'}
    {/if}
  </td>
  {#if isTeam}
    <td class="pl-4 pr-4">
      <p class="w-60 truncate">
        {record.by}
      </p>
    </td>
  {/if}
  <td class="h-12 pl-4 pr-4 flex gap-4 items-center">
    {#if isTeamInactive === false}
      <ConfirmationModal
        {isLoading}
        isDelete
        isIconVisible
        isDispatch
        heading="Are you sure you want to delete"
        text={`${
          record.storage_url
            ? record.filename
            : record.profileData?.firstname ?? record?.name
        }
      ${!record.storage_url ? '' : record.profileData?.lastname ?? ''} ?`}
        buttonLabel="Delete"
        showModal={showDeleteModal}
        toggleModal={deleteModalHandler}
        on:action={async () => {
          await deleteCsv();
          deleteFromTable(record.id);
          deleteModalHandler();
        }}
      />
      <img
        src="/download-icon.svg"
        alt=""
        class="w-6 h-6 cursor-pointer"
        on:click={async () => await downloadCsv(record.name)}
      />
    {/if}
  </td>
</tr>
