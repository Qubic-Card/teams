<script>
  import { fade } from 'svelte/transition';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';

  export let record, teamId, isTeam, deleteHandler, isLoading, innerWidth;
  export let isTeamInactive = false;
  let showDeleteModal = false;

  const deleteModalHandler = () => (showDeleteModal = !showDeleteModal);

  const downloadCsv = async (filename) => {
    const { data } = await supabase.storage
      .from('records')
      .createSignedUrl(
        record.storage_url
          ? record.storage_url
          : `${teamId}/${$user?.id}/${filename}`,
        60
      );

    if (data.signedUrl) {
      fetch(data.signedUrl)
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
    } else {
      toastFailed();
    }
  };
</script>

<tr
  out:fade|local={{ duration: 150 }}
  class="h-12 text-xs md:text-sm text-left py-6 px-4 mb-2  text-neutral-300 border-b border-neutral-800"
>
  <td class="font-semibold text-ellipsis pl-4">
    <p class="w-56 lg:w-80 truncate">
      {#if record.storage_url}
        {record?.filename?.split('-').slice(0, 2).join('-') ?? '-'}
      {:else}
        {record?.name?.split('-').slice(0, 2).join('-') ?? '-'}
      {/if}
    </p>
  </td>

  {#if innerWidth > 640}
    <td class="pl-4">
      {#if innerWidth > 950}
        {new Date(record.created_at).toDateString().slice(4) ?? '-'}
      {:else}
        {new Date(record.created_at).toLocaleDateString() ?? '-'}
      {/if}
    </td>
    <td class="pl-4 pr-4">
      {#if record.storage_url}
        {#if record.type.includes('Activities')}
          {record.storage_url.includes('team')
            ? 'Team Activities'
            : 'Personal Activities'}
        {:else}
          {record.storage_url.includes('team')
            ? 'Team Connections'
            : 'Personal Connections'}
        {/if}
      {:else}
        {record.name.includes('activities')
          ? 'Personal Activities'
          : 'Personal Connections'}
      {/if}
    </td>
    {#if isTeam}
      <td class="pl-4 pr-4">
        <p class="w-40 lg:w-60 truncate">
          {record.by}
        </p>
      </td>
    {/if}
  {/if}

  <td
    class="h-12 md:pl-2 lg:pl-4 md:pr-2 lg:pr-4 flex gap-1 md:gap-4 items-center w-16 md:w-24 lg:w-auto"
  >
    {#if isTeamInactive === false}
      <ConfirmationModal
        showModal={showDeleteModal}
        toggleModal={deleteModalHandler}
        buttonLabel="Remove"
        isIconVisible
        {isLoading}
        on:action={async () => {
          await deleteHandler(record);
          deleteModalHandler();
        }}
      >
        <slot slot="title">
          <h1 class="font-semibold">Remove record</h1>
        </slot>
        <slot slot="text">
          <div class="flex flex-col gap-4">
            <p>
              Are you sure you want to remove <br />
              {#if record.storage_url}
                {record?.filename?.split('-').slice(0, 2).join('-') ?? '-'}
              {:else}
                {record?.name?.split('-').slice(0, 2).join('-') ?? '-'}
              {/if}
            </p>
          </div>
        </slot>
      </ConfirmationModal>

      <img
        src="/download-icon.svg"
        alt=""
        class="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
        on:click={async () => await downloadCsv(record.name)}
      />
    {/if}
  </td>
</tr>
