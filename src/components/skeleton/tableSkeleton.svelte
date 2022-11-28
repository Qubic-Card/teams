<script>
  export let colLength = 0;
  export let bg = ['bg-neutral-900', 'bg-neutral-900', 'bg-neutral-900'];
  let width = ['w-72', 'w-full', 'w-72'];
</script>

<tr class="animate-pulse">
  {#each Array(colLength) as item, i}
    <td class={`h-11 border-b p-1 border-neutral-800 ${width[i]} ${bg[i]}`}>
      <div class={`animate h-8 rounded-md ${width[i]}`} />
    </td>
  {/each}
</tr>

<style>
  tr > td > .animate {
    background: linear-gradient(
      to right,
      #171717 20%,
      #1f1f1f 50%,
      #171717 80%
    );
    background-size: 500px 100px;
    background-color: red;
    animation-name: moving-gradient;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }
  @keyframes moving-gradient {
    0% {
      background-position: -250px 0;
    }
    100% {
      background-position: 250px 0;
    }
  }
</style>
