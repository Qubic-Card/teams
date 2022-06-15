<script>
  export let colLength = 0;
  let totalCol = [];

  for (let i = 0; i < colLength; i++) {
    totalCol = [...totalCol, i];
  }
</script>

<tr class="animate-pulse odd:bg-neutral-900 even:bg-neutral-700 my-2">
  {#each totalCol as item}
    <td class="h-10" />
  {/each}
</tr>
