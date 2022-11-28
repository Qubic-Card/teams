<script>
  import '../app.css';
  import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<svelte:head>
  <title>Qubic Card | Editor</title>
</svelte:head>

<div class="relative min-h-screen">
  <SvelteToast />
  <slot />
</div>
