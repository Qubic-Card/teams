<script>
  import { MenuButton } from '@rgossiaux/svelte-headlessui';
  export let label = 'Dropdown Button';
</script>

<MenuButton
  class={`text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md relative ${$$props.class}`}
>
  {label}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="white"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</MenuButton>
