<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide, fly } from 'svelte/transition';
  import '../app.css';
</script>

<div class="relative min-h-screen">
  <slot />
</div>
