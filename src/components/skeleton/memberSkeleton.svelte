<script>
  import { fade } from 'svelte/transition';
  export let cards, innerWidth, permissions;
</script>

<div class="animate-pulse mt-4">
  {#if permissions.readMembers}
    <div class="bg-neutral-800 w-full h-16 rounded-md self-end" />
    <div class="flex flex-col gap-6">
      <div
        class={`grid ${
          innerWidth > 1370 ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        } grid-flow-row gap-2 mt-4`}
      >
        {#if cards}
          {#each cards as item}
            <div class="bg-neutral-800 w-full h-56 rounded-md" in:fade|local />
          {/each}
        {:else}
          <div class="bg-neutral-800 w-full h-56 rounded-md" />
          <div class="bg-neutral-800 w-full h-56 rounded-md" />
          <div class="bg-neutral-800 w-full h-56 rounded-md" />
        {/if}
      </div>
    </div>
  {:else}
    <div
      class={`grid  ${
        innerWidth > 1370 ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
      } grid-flow-row`}
    >
      <div class="bg-neutral-800 w-full h-56 rounded-md" />
    </div>
  {/if}
</div>
