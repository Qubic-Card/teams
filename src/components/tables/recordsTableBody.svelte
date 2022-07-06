<script>
  import DeleteModal from '@comp/modals/deleteModal.svelte';

  export let record;

  let showDeleteModal = false;

  const deleteModalHandler = () => (showDeleteModal = !showDeleteModal);
</script>

<tr
  class="h-12 text-left py-6 px-4 mb-2 bg-neutral-800 text-neutral-300 border-b border-neutral-700"
>
  <td class="font-bold text-ellipsis truncate pl-4 flex-1">
    {record.filename ?? '-'}
  </td>

  <td class="flex-1 truncate pl-4">
    {new Date(record.created_at).toDateString().slice(4) ?? '-'}
  </td>

  <td class="flex-1 truncate pl-4 pr-4">
    {record.type ?? '-'}
  </td>
  <td class="flex-1 h-12 truncate pl-4 pr-4 flex gap-4 items-center">
    <DeleteModal data={record} />
    <img src="/download-icon.svg" alt="" class="w-6 h-6 cursor-pointer" />
  </td>
</tr>
