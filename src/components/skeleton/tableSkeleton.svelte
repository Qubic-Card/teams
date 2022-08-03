<script>
  export let colLength = 0;
  export let bg = [
    'bg-neutral-800/90',
    'bg-neutral-800/90',
    'bg-neutral-800/90',
  ];
  let totalCol = [];

  for (let i = 0; i < colLength; i++) {
    totalCol = [...totalCol, i];
  }
</script>

<tr class="animate-pulse first:bg-black bg-neutral-700 my-2">
  {#each totalCol as item, i}
    <td class={`h-12 border-b border-neutral-700 ${bg[i]}`} />
  {/each}
</tr>
