<script>
  import { fade } from 'svelte/transition';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let roles, permissions, role, selectedRole;

  const dispatch = createEventDispatcher();

  const selectSuperAdmin = () => dispatch('selectSuperAdmin');
  const selectMember = () => dispatch('selectMember');
  const selectOthers = (item) => dispatch('selectOthers', item);

  let selected = selectedRole;
</script>

<div class="flex justify-end items-center gap-2 ">
  <Listbox value={selected} on:change={(e) => (selected = e.detail)} let:open>
    {#if open}
      <div
        transition:fade|local={{ duration: 200 }}
        class="fixed inset-0 bg-black/50 z-50"
        aria-hidden="true"
      />
    {/if}
    {#if permissions.writeRoles}
      {#if role?.role_name}
        <ListboxButton
          class="bg-neutral-800 border-2 border-neutral-700 text-xs text-white rounded-md p-2 w-40"
        >
          {#if selected === 'Superadmin'}
            Super Admin
          {:else}
            {selected}
          {/if}
        </ListboxButton>
      {/if}
    {:else}
      <p
        class="text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md w-60 text-sm"
      >
        {selected}
      </p>
    {/if}
    {#if open}
      <div transition:fade|local={{ duration: 100 }}>
        <ListboxOptions
          class="absolute bg-neutral-900 border border-neutral-700 p-2 w-40 mt-2 shadow-md z-50 rounded-md"
        >
          {#if roles}
            {#if selected !== '' ? selected !== 'Super Admin' : role?.role_name !== 'superadmin'}
              <ListboxOption
                class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                on:click={selectSuperAdmin}
                value="superadmin"
              >
                Super Admin
              </ListboxOption>
            {/if}

            {#if selected !== '' ? selected !== 'Member' : role?.role_name !== 'member'}
              <ListboxOption
                value="member"
                class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                on:click={selectMember}
              >
                Member
              </ListboxOption>
            {/if}

            {#each roles as item}
              {#if selected !== '' ? selected !== item.role_name : role?.role_name !== item.role_name}
                <ListboxOption
                  class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                  on:click={() => selectOthers(item)}
                  value={item.role_name}
                >
                  {#if item.role_name === 'superadmin'}
                    Super Admin
                  {:else}
                    {item.role_name.charAt(0).toUpperCase() +
                      item.role_name.slice(1)}
                  {/if}
                </ListboxOption>
              {/if}
            {/each}
          {/if}
        </ListboxOptions>
      </div>
    {/if}
  </Listbox>
</div>
