<script>
  export let colLength = 0;
  let totalCol = [];

  for (let i = 0; i < colLength; i++) {
    totalCol = [...totalCol, i];
  }
</script>

<tr class="animate-pulse my-1">
  {#each totalCol as item}
    <td class="bg-neutral-400 h-12 roun" />
  {/each}
</tr>
