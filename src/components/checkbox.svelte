<script>
  import { setNewRole } from '@lib/stores/roleStore';
  import { createEventDispatcher } from 'svelte';
  export let checkboxes, checked;
  const dispatch = createEventDispatcher();
  const isArrayHaveChanged = () => {
    console.log('isArrayHaveChanged');
  };

  $: setNewRole(checked);
</script>

{#each checkboxes as checkbox}
  <div
    class="flex w-full justify-between items-center bg-neutral-800 p-4 rounded-lg mb-2"
  >
    <div class="block">
      <div class="mt-2">
        <label
          class="flex cursor-pointer"
          on:click={() => dispatch('clicked', false)}
        >
          <input
            type="checkbox"
            class="w-7 h-7 cursor-pointer"
            bind:group={checked}
            value={checkbox.name}
            on:change={() => dispatch('change', checked)}
          />
          <p class="ml-4">
            {checkbox.name.charAt(0).toUpperCase() + checkbox.name.slice(1)}
          </p>
        </label>
      </div>
    </div>
    <p class="w-1/2">
      {checkbox.desc}
    </p>
  </div>
{/each}
