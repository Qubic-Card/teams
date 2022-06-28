<script>
  import { setNewRole } from '@lib/stores/roleStore';
  import { createEventDispatcher } from 'svelte';

  export let checkboxes, checked;
  const dispatch = createEventDispatcher();

  $: setNewRole(checked);
  $: if (checked.includes('allow_write_members', 0)) {
    checked = [...checked, 'allow_write_profile'];
  }

  const readCheckbox = checkboxes.slice(0, 4);
  const writeCheckbox = checkboxes.slice(4);
</script>

<h1 class="font-bold text-xl my-4 ml-2">Read</h1>
{#each readCheckbox as checkbox}
  <div
    class="flex w-full justify-between items-center bg-neutral-800 p-4 rounded-lg mb-2 first:mt-2"
  >
    <div class="block">
      <div class="mt-2">
        <label
          class="flex cursor-pointer"
          on:click={() => dispatch('clicked', false)}
        >
          <input
            type="checkbox"
            class="w-7 h-7 cursor-pointer disabled:cursor-default"
            bind:group={checked}
            value={checkbox.name}
            on:change={() => dispatch('change', checked)}
            disabled={checkbox.name === 'allow_write_profile' &&
            checked.includes('allow_write_members', 0)
              ? true
              : false}
          />
          <p class="ml-4 w-72">
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

<h1 class="font-bold text-xl my-4 ml-2">Write</h1>
{#each writeCheckbox as checkbox}
  <div
    class="flex w-full justify-between items-center bg-neutral-800 p-4 rounded-lg mb-2 first:mt-2"
  >
    <div class="block">
      <div class="mt-2">
        <label
          class="flex cursor-pointer"
          on:click={() => dispatch('clicked', false)}
        >
          <input
            type="checkbox"
            class="w-7 h-7 cursor-pointer disabled:cursor-default"
            bind:group={checked}
            value={checkbox.name}
            on:change={() => dispatch('change', checked)}
            disabled={checkbox.name === 'allow_write_profile' &&
            checked.includes('allow_write_members', 0)
              ? true
              : false}
          />
          <p class="ml-4 w-72">
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
