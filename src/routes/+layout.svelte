<script>
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import '../app.css';
</script>

<svelte:head>
  <title>Qubic Card | Teams</title>
</svelte:head>

<AuthWrapper>
  <div class="relative min-h-screen">
    <slot />
  </div>
</AuthWrapper>
