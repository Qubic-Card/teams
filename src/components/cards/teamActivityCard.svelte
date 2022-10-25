<script>
  import TeamActivityModal from '@comp/modals/teamActivityModal.svelte';

  export let member;

  let isOpen = false;
</script>

{#if member}
  <TeamActivityModal {isOpen} {member} on:close={() => (isOpen = false)} />
  <div
    on:click={() => (isOpen = true)}
    class="bg-neutral-800 border border-neutral-700 hover:border-neutral-500 p-3 rounded-md h-auto grid grid-cols-[100px_300px_150px_100px_minmax(200px,_1fr)] gap-2 cursor-pointer"
  >
    <img
      class="w-12 h-12 rounded-full"
      src={member.avatar}
      alt={member.firstname + ' avatar'}
    />
    <div class="flex flex-col">
      <h1 class="font-bold text-white">
        {member.firstname ?? ''}
        {member.lastname ?? ''}
      </h1>
      <p>{member.job}</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-semibold text-neutral-400">Connections</h1>
      <p>{member.connections.length}</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-semibold text-neutral-400">Activity</h1>
      <p>{member.team_logs.length}</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-semibold text-neutral-400">Most Recent Activity</h1>
      {#if member.team_logs.length > 0}
        {#if member.team_logs[0].type === 'DANGER' || member.team_logs[0].type === 'SUCCESS' || member.team_logs[0].type === 'WARN'}
          <p
            class={`${
              member.team_logs[0].type === 'DANGER'
                ? 'text-red-600'
                : member.team_logs[0].type === 'SUCCESS'
                ? 'text-green-600'
                : member.team_logs[0].type === 'WARN'
                ? 'text-yellow-600'
                : 'text-neutral-100'
            }`}
          >
            {member.team_logs[0].data.message}
          </p>
        {:else}
          <p class="text-neutral-100">
            {`${member.team_logs[0]?.card_holder ?? 'Member'}'s` +
              member.team_logs[0]?.data?.message?.slice(4)}
          </p>
        {/if}
      {:else}
        <p class="text-neutral-100">No activity yet</p>
      {/if}
    </div>
  </div>
{/if}
