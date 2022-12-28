<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import '../app.css';
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <SvelteToast />
    <slot />
  </div>
</AuthWrapper>
