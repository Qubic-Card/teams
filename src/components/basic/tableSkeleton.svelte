<script>
  export let colLength = 0;
  export let index;
  let totalCol = [];

  for (let i = 0; i < colLength; i++) {
    totalCol = [...totalCol, i];
  }
</script>

<tr class="animate-pulse">
  {#each totalCol as item}
    <td class="{index % 2 === 0 ? 'bg-neutral-200' : 'bg-neutral-300'} h-10" />
  {/each}
</tr>
