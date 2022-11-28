<script>
  import { fade } from 'svelte/transition';

  export let isOpen = false;
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click
  />
{/if}
