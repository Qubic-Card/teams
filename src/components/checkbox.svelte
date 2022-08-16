<script>
  import { setNewRole } from '@lib/stores/roleStore';
  import { userData } from '@lib/stores/userStore';
  import { createEventDispatcher, onMount } from 'svelte';
  export let checkboxes, checked, permissions, isDefault;
  export let bg = 'bg-neutral-900';
  let isSuperAdmin = false;
  let selectAll = false;

  const dispatch = createEventDispatcher();
  const clicked = () => dispatch('clicked', false);

  $: {
    setNewRole(checked);
    if (checked.includes('allow_write_members')) {
      if (!checked.includes('allow_read_members'))
        checked.push('allow_read_members');
    }

    if (checked.includes('allow_write_roles')) {
      if (!checked.includes('allow_read_roles'))
        checked.push('allow_read_roles');
    }

    if (checked.includes('allow_write_team')) {
      if (!checked.includes('allow_read_team')) checked.push('allow_read_team');
    }

    if (checked.includes('allow_write_billing')) {
      if (!checked.includes('allow_read_billing'))
        checked.push('allow_read_billing');
    }

    if (checked.includes('allow_write_connections')) {
      if (!checked.includes('allow_read_connections'))
        checked.push('allow_read_connections');
    }

    if (checked.includes('allow_write_records')) {
      if (!checked.includes('allow_read_analytics'))
        checked.push('allow_read_analytics');
    }

    if (selectAll) {
      checked = [
        'allow_read_profile',
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
        'allow_write_connections',
      ];

      selectAll = false;
    }
  }

  let roles = checkboxes.slice(1);
  let memberRole = [roles[0], roles[6]];
  let companyRole = [roles[1], roles[7]];
  let analyticsRecords = [roles[2], roles[9]];
  let role = [roles[4], roles[10]];
  let billing = [roles[5], roles[11]];
  let profile = [roles[8], roles[13]];
  let connections = [roles[3], roles[12]];

  let rolesArr = [
    {
      role: { title: 'Team', roles: [companyRole[0], companyRole[1]] },
    },
    {
      role: { title: 'Member', roles: [memberRole[0], memberRole[1]] },
    },
    {
      role: { title: 'Profile', roles: [profile[0], profile[1]] },
    },
    {
      role: {
        title: 'Analytics & Records',
        roles: [analyticsRecords[0], analyticsRecords[1]],
      },
    },
    {
      role: { title: 'Role', roles: [role[0], role[1]] },
    },
    {
      role: { title: 'Billing', roles: [billing[0], billing[1]] },
    },
    {
      role: { title: 'Connection', roles: [connections[0], connections[1]] },
    },
  ];
</script>

<div class="border border-neutral-600 mt-3 p-2 rounded">
  {#if !isDefault}
    <button
      disabled={permissions.isTeamInactive ||
        permissions.isTeamWillExpire ||
        isDefault}
      on:click={() => {
        clicked();
        selectAll = true;
      }}
      class="flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 bg-neutral-700 hover:bg-neutral-900 disabled:bg-neutral-700 transition-colors duration-300"
    >
      Select all
    </button>
  {/if}

  {#each rolesArr.map((item) => item.role) as items, i}
    <h1 class="font-bold text-sm my-4 ml-2 self-start">{items.title}</h1>

    {#each items.roles as role}
      <div
        class={`flex w-full justify-between items-center p-4 rounded-lg mb-2 first:mt-2 ${bg}`}
      >
        <div class="flex justify-center items-center h-7">
          <label
            class={`flex ${
              isDefault ||
              isSuperAdmin ||
              permissions.isTeamInactive ||
              permissions.isTeamWillExpire ||
              role.name === 'allow_read_profile'
                ? 'cursor-default'
                : 'cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              class="w-5 h-5 cursor-pointer disabled:cursor-default a"
              bind:group={checked}
              value={role.value}
              on:change={clicked}
              disabled={!permissions.writeRoles ||
                isSuperAdmin ||
                role.name === 'allow_read_profile' ||
                isDefault}
            />

            <p class="ml-4 w-72">
              {role.name.split('_')[0].charAt(0).toUpperCase() +
                role.name.split('_')[0].slice(1)}
              {role.name.split('_')[1]}
              {role.name.split('_')[2]}
            </p>
          </label>
        </div>
        <p class="w-1/2">
          {role.desc}
        </p>
      </div>
    {/each}
  {/each}
</div>
