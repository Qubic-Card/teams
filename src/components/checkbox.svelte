<script>
  import { setNewRole } from '@lib/stores/roleStore';
  import { createEventDispatcher } from 'svelte';

  export let checkboxes, checked, isHasWriteRolePermission;
  export let bg = 'bg-neutral-900';
  let isSuperAdmin = false;
  const superAdminCheckbox = checkboxes.slice(0, 1);
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
    if (checked.includes('super_admin')) {
      isSuperAdmin = true;
      checked = [
        'super_admin',
        'allow_read_roles',
        'allow_read_team',
        'allow_read_members',
        'allow_read_records',
        'allow_read_analytics',
        'allow_read_connections',
        'allow_read_billing',
        'allow_write_profile',
        'allow_write_connections',
        'allow_write_billing',
        'allow_write_analytics',
        'allow_write_team',
        'allow_write_members',
        'allow_write_roles',
        'allow_write_records',
      ];
    }
  }
</script>

<div class="border border-neutral-600 mt-3 p-2 rounded">
  <h1 class="font-bold text-sm my-4 ml-2 self-start">Super Admin</h1>
  {#each superAdminCheckbox as checkbox}
    <div
      class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
    >
      <div class="block">
        <div class="mt-2">
          <label
            class={`flex ${isSuperAdmin ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <input
              type="checkbox"
              class="w-5 h-5 cursor-pointer disabled:cursor-default"
              bind:group={checked}
              value={checkbox.name}
              on:change={clicked}
              disabled={!isHasWriteRolePermission}
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

  <h1 class="font-bold text-sm my-4 ml-2 self-start">Read</h1>
  {#each readCheckbox as checkbox}
    <div
      class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
    >
      <div class="block">
        <div class="mt-2">
          <label
            class={`flex ${isSuperAdmin ? 'cursor-default' : 'cursor-pointer'}`}
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

  <h1 class="font-bold text-sm my-4 ml-2 self-start">Write</h1>
  {#each writeCheckbox as checkbox}
    <div
      class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
    >
      <div class="block">
        <div class="mt-2">
          <label
            on:click={clicked}
            class={`flex ${isSuperAdmin ? 'cursor-default' : 'cursor-pointer'}`}
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
</div>
