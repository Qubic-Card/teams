<script>
  import { setNewRole } from '@lib/stores/roleStore';
  import { userData } from '@lib/stores/userStore';
  import { createEventDispatcher } from 'svelte';
  export let checkboxes, checked, isHasWriteRolePermission;
  export let bg = 'bg-neutral-900';
  let isSuperAdmin = false;
  let selectAll = false;

  const readCheckbox = checkboxes.slice(1, 7);
  const writeCheckbox = checkboxes.slice(7);
  const dispatch = createEventDispatcher();
  const clicked = () => dispatch('clicked', false);

  $: {
    setNewRole(checked);
    if (checked.includes('allow_write_members')) {
      if (!checked.includes('allow_write_profile'))
        checked.push('allow_write_profile');
    }

    if (checked.includes('allow_write_roles')) {
      if (!checked.includes('allow_read_roles'))
        checked.push('allow_read_roles');
    }
    if (selectAll) {
      // isSuperAdmin = true;
      checked = [
        'allow_read_roles',
        'allow_read_team',
        'allow_read_members',
        'allow_read_analytics',
        'allow_read_connections',
        'allow_read_billing',
        'allow_write_profile',
        'allow_write_billing',
        'allow_write_team',
        'allow_write_members',
        'allow_write_roles',
        'allow_write_records',
      ];

      selectAll = false;
    }
  }
</script>

<div class="border border-neutral-600 mt-3 p-2 rounded">
  <!-- <h1 class="font-bold text-sm my-4 ml-2 self-start">Select all</h1> -->
  <button
    disabled={$userData.includes('inactive') ||
      $userData.includes('will_expired')}
    on:click={() => {
      clicked();
      selectAll = true;
    }}
    class="flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 bg-neutral-700 hover:bg-neutral-900 disabled:bg-neutral-700 transition-colors duration-300"
  >
    Select all
  </button>

  <h1 class="font-bold text-sm my-4 ml-2 self-start">Read</h1>
  {#each readCheckbox as checkbox}
    <div
      class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
    >
      <div class="flex justify-center items-center h-7">
        <label
          class={`flex ${
            isSuperAdmin ||
            $userData.includes('inactive') ||
            $userData.includes('will_expired')
              ? 'cursor-default'
              : 'cursor-pointer'
          }`}
        >
          <input
            type="checkbox"
            class="w-5 h-5 cursor-pointer disabled:cursor-default"
            bind:group={checked}
            value={checkbox.name}
            on:change={clicked}
            disabled={!isHasWriteRolePermission || isSuperAdmin}
          />

          <p class="ml-4 w-72">
            {checkbox.name.split('_')[0].charAt(0).toUpperCase() +
              checkbox.name.split('_')[0].slice(1)}
            {checkbox.name.split('_')[1]}
            {checkbox.name.split('_')[2]}
          </p>
        </label>
      </div>
      <p class="w-1/2">
        {checkbox.desc}
      </p>
    </div>
  {/each}

  <h1 class="font-bold text-sm my-4 ml-2 self-start">Write</h1>
  {#each writeCheckbox as checkbox}
    <div
      class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
    >
      <div class="flex justify-center items-center h-7">
        <label
          on:click={clicked}
          class={`flex ${
            isSuperAdmin ||
            $userData.includes('inactive') ||
            $userData.includes('will_expired')
              ? 'cursor-default'
              : 'cursor-pointer'
          }`}
        >
          <input
            type="checkbox"
            class="w-5 h-5 cursor-pointer disabled:cursor-default"
            bind:group={checked}
            value={checkbox.name}
            on:change={clicked}
            disabled={!isHasWriteRolePermission || isSuperAdmin}
          />

          <p class="ml-4 w-72">
            {checkbox.name.split('_')[0].charAt(0).toUpperCase() +
              checkbox.name.split('_')[0].slice(1)}
            {checkbox.name.split('_')[1]}
            {checkbox.name.split('_')[2]}
          </p>
        </label>
      </div>

      <p class="w-1/2">
        {checkbox.desc}
      </p>
    </div>
  {/each}
</div>
