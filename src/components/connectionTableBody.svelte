<script>
  import ConnectionsModal from '@comp/modals/connectionsModal.svelte';

  export let innerWidth;
  export let connection;
  export let i;
  let showModal = false;

  const modalHandler = () => (showModal = !showModal);
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
</tr>
<ConnectionsModal on:showModal={modalHandler} {showModal} {connection} />
