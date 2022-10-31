<script>
  import { MenuButton } from '@rgossiaux/svelte-headlessui';
  export let label = 'Dropdown Button';

  $: if (label === 'Superadmin') label = 'Super Admin';
</script>

<MenuButton
  class={`text-white border-2 border-neutral-700 flex justify-between text-sm items-center h-12 p-2 gap-2 rounded-md relative ${$$props.class}`}
>
  {label}
  <span>▼</span>
</MenuButton>
