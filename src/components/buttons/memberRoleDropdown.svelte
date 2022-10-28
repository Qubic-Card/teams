<script>
  import { fade } from 'svelte/transition';
  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';
  import { user } from '@lib/stores/userStore';

  export let roles, permissions, role, selectedRole, memberUid;

  const dispatch = createEventDispatcher();

  const selectSuperAdmin = () => dispatch('selectSuperAdmin');
  const selectMember = () => dispatch('selectMember');
  const selectOthers = (item) => dispatch('selectOthers', item);

  let selected = selectedRole;
</script>

<div class="flex justify-end items-center gap-2">
  <Listbox value={selected} on:change={(e) => (selected = e.detail)} let:open>
    {#if open}
      <div
        transition:fade|local={{ duration: 200 }}
        class="fixed inset-0 bg-black/50 z-50"
        aria-hidden="true"
      />
    {/if}
    {#if permissions.writeRoles}
      <!-- {#if role?.role_name} -->
      <ListboxButton
        class="bg-neutral-800 outline outline-1 break-all outline-neutral-700 text-xs text-white rounded-md p-2 h-7 {$$props.class} flex justify-center items-center"
      >
        {#if $user?.id === memberUid}
          {#if role?.role_name === 'superadmin'}
            Super Admin
          {:else}
            {role?.role_name.charAt(0).toUpperCase() +
              role?.role_name?.slice(1)}
          {/if}
        {:else if selected === 'Superadmin' || selected === 'superadmin'}
          Super Admin
        {:else}
          {selected?.charAt(0).toUpperCase() + selected?.slice(1)}
        {/if}
      </ListboxButton>
      <!-- {/if} -->
    {:else}
      <p
        class="text-white outline outline-1 outline-neutral-700 flex justify-between items-center h-7 p-2 gap-2 rounded-md {$$props.class} text-sm"
      >
        {selected}
      </p>
    {/if}
    {#if open}
      <div transition:fade|local={{ duration: 100 }}>
        <ListboxOptions
          class="absolute bg-neutral-900 outline outline-1 outline-neutral-700 p-2 w-40 mt-2 shadow-md z-50 rounded-md"
        >
          {#if roles}
            <!-- {#if selected !== '' ? selected !== 'Super Admin' : role?.role_name !== 'superadmin'} -->
            <ListboxOption
              class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer text-xs md:text-sm"
              on:click={selectSuperAdmin}
              value="superadmin"
            >
              Super Admin
            </ListboxOption>
            <!-- {/if} -->

            <!-- {#if selected !== '' ? selected !== 'Member' : role?.role_name !== 'member'} -->
            <ListboxOption
              value="member"
              class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer text-xs md:text-sm"
              on:click={selectMember}
            >
              Member
            </ListboxOption>
            <!-- {/if} -->

            {#each roles as item}
              <!-- {#if selected !== '' ? selected !== item.role_name : role?.role_name !== item.role_name} -->
              <ListboxOption
                class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer text-xs md:text-sm"
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
              <!-- {/if} -->
            {/each}
          {/if}
        </ListboxOptions>
      </div>
    {/if}
  </Listbox>
</div>
