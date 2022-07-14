<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { role } from '@lib/stores/roleStore';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@rgossiaux/svelte-headlessui';
  import AddRoleModal from '@comp/modals/addRoleModal.svelte';
  import RenameModal from '@comp/modals/renameModal.svelte';
  import Checkboxes from '@comp/checkbox.svelte';
  import { setUserData, user, userData } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import Cookies from 'js-cookie';

  export let permissions, roles;
  let roleMaps = [];
  let isClicked = true;
  let loading = false;
  let teamId = Cookies.get('qubicTeamId');

  let roleName;

  const updateTeamsRoleMapping = async (id) => {
    loading = true;
    const { data, error } = await supabase
      .from('team_roles')
      .update(
        {
          role_maps: $role,
        },
        { returning: 'minimal' }
      )
      .eq('id', id);

    loading = false;
    if (error) {
      toastFailed('Failed to update role');
      console.log(error);
    }

    isClicked = true;
    toastSuccess('Role updated');
    // if (data) {
    //   return data;
    // }
  };
  // $: getMemberRole();

  const clicked = (e) => (isClicked = e.detail);
</script>

<div class={`${permissions.readRoles ? 'flex' : 'hidden'} gap-4`}>
  <div class="bg-neutral-800 rounded-lg w-3/4 p-4">
    <div
      class="flex flex-col md:flex-row  justify-between items-start md:items-center mb-4"
    >
      <h1 class="font-bold text-xl md:text-3xl">Role Settings</h1>
      {#if permissions.writeRoles}
        <AddRoleModal
          {roles}
          isHasWriteRolePermission={permissions.writeRoles}
        />
      {/if}
    </div>
    {#if roles.length > 0}
      {#each roles as role}
        <Disclosure let:open>
          <div class="flex justify-between items-center">
            <DisclosureButton
              on:click={() => (isClicked = true)}
              class="text-xl w-full text-left hover:bg-neutral-900 p-4 rounded-lg flex justify-between mr-2"
            >
              {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1)}
            </DisclosureButton>
            {#if permissions.writeRoles}
              <RenameModal id={role.id} />
              {#if open}
                <button
                  transition:fade|local={{ duration: 200 }}
                  class="w-20 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 ml-2"
                  on:click={async () => {
                    await updateTeamsRoleMapping(role.id);
                    roleMaps = await getRoleMapsByProfile($user?.id, teamId);
                    setUserData(roleMaps);
                  }}
                  disabled={isClicked}
                >
                  {#if loading}
                    Saving...
                  {:else}
                    Save
                  {/if}
                </button>
              {/if}
            {/if}
          </div>
          {#if open}
            <div transition:slide|local={{ duration: 500 }} class="mb-4">
              <DisclosurePanel static>
                <Checkboxes
                  checkboxes={roleMapping}
                  bind:checked={role.role_maps}
                  on:clicked={clicked}
                  isHasWriteRolePermission={permissions.writeRoles}
                />
              </DisclosurePanel>
            </div>
          {/if}
        </Disclosure>
      {/each}
    {:else}
      <div class="flex justify-center items-center">
        <p class="text-xl text-center">No roles found</p>
      </div>
    {/if}
  </div>
  <div class="bg-neutral-800 w-1/4 h-80 p-4 rounded-lg text-xl">
    <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
    <p>Berikan permissions yang sesuai di setiap role.</p>
  </div>
</div>
