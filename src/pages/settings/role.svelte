<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { role, teamRoles } from '@lib/stores/roleStore';
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
  import { defaultRole } from '@lib/constants';
  import { getContext } from 'svelte';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';

  const teamId = getContext('teamId');
  export let permissions;
  let roleMaps = [];
  let isClicked = true;
  let loading = false;
  let roleId = null;
  let roleName = '';
  let isLoading = false;

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
    }

    isClicked = true;
    toastSuccess('Role updated');
    // location.reload();
  };

  const clicked = (e) => (isClicked = e.detail);

  let showDeleteModal = false;
  const toggleDelete = () => (showDeleteModal = !showDeleteModal);
  const checkIsRoleUsed = async (id) => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role')
      .eq('role', id);

    if (error) {
      toastFailed('Failed to check role');
    }

    if (data) {
      if (data?.length > 0) {
        toastFailed('Cannot delete role, it is used');
        return true;
      } else {
        return false;
      }
    }
  };

  const deleteRoleHandler = async (id) => {
    if ((await checkIsRoleUsed(id)) === false) {
      isLoading = true;
      const { data, error } = await supabase
        .from('team_roles')
        .delete()
        .eq('id', id);

      if (!error) toastSuccess('Role deleted');

      $teamRoles = $teamRoles.filter((role) => role.id !== id);
      isLoading = false;
    }

    showDeleteModal = false;
  };
</script>

<ConfirmationModal
  {isLoading}
  showModal={showDeleteModal}
  toggleModal={toggleDelete}
  buttonLabel="Remove"
  on:action={async () => await deleteRoleHandler(roleId)}
>
  <slot slot="title">
    <h1 class="font-semibold">Remove role</h1>
  </slot>
  <slot slot="text">
    <p>
      Are you sure you want to delete <br />
      {roleName.charAt(0).toUpperCase() + roleName.slice(1)}?
    </p>
  </slot>
</ConfirmationModal>

<div class="flex gap-3">
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 rounded-lg w-full md:w-3/4 p-4"
  >
    <div
      class="flex flex-col md:flex-row  justify-between items-start md:items-center mb-4"
    >
      <h1 class="font-semibold text-sm md:text-xl">Role Settings</h1>
      {#if permissions.writeRoles}
        <AddRoleModal {permissions} />
      {/if}
    </div>
    {#each defaultRole as role, i}
      <Disclosure let:open>
        <div class="flex justify-between items-center">
          <DisclosureButton
            on:click={() => (isClicked = true)}
            class="text-xs md:text-sm w-full text-left hover:bg-neutral-800 mb-1 p-4 rounded-lg flex justify-between mr-2 transition-colors duration-300"
          >
            {#if i === 0}
              Super Admin
            {:else}
              {role?.name?.charAt(0).toUpperCase() + role?.name?.slice(1)}
            {/if}
          </DisclosureButton>
        </div>
        {#if open}
          <div transition:slide|local={{ duration: 500 }} class="mb-4">
            <DisclosurePanel static>
              <Checkboxes
                isDefault
                checkboxes={roleMapping}
                bind:checked={role.role_maps}
                {permissions}
              />
            </DisclosurePanel>
          </div>
        {/if}
      </Disclosure>
    {/each}

    {#if $teamRoles}
      {#if $teamRoles.length > 0}
        {#each $teamRoles as role}
          <div class="flex w-full gap-2">
            <Disclosure class="w-full" let:open>
              <div class="flex justify-between items-center">
                <DisclosureButton
                  on:click={() => (isClicked = true)}
                  class="text-xs md:text-sm w-full text-left hover:bg-neutral-700 bg-neutral-800 mb-1 p-4 rounded-lg flex justify-between mr-2 transition-colors duration-300"
                >
                  {role?.role_name?.charAt(0).toUpperCase() +
                    role?.role_name?.slice(1)}
                </DisclosureButton>
                {#if permissions.writeRoles}
                  <div class="bg-red-500 p-2 mr-2 rounded-md">
                    <img
                      src="/delete-icon.svg"
                      alt=""
                      class="w-6 h-6 cursor-pointer"
                      on:click={() => {
                        toggleDelete();
                        roleId = role?.id;
                        roleName = role?.role_name;
                      }}
                    />
                  </div>

                  {#if open}
                    <button
                      transition:fade|local={{ duration: 200 }}
                      class="w-20 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                      on:click={async () => {
                        await updateTeamsRoleMapping(role.id);
                        roleMaps = await getRoleMapsByProfile(
                          $user?.id,
                          teamId
                        );
                        setUserData(roleMaps?.role?.role_maps);
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
                      {permissions}
                    />
                  </DisclosurePanel>
                </div>
              {/if}
            </Disclosure>
            {#if permissions.writeRoles}
              <RenameModal id={role.id} roleName={role?.role_name} />
            {/if}
          </div>
        {/each}
      {/if}
    {/if}
  </div>
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 w-1/4 h-80 p-4 rounded-lg text-md lg:text-lg hidden md:flex flex-col"
  >
    <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
    <p>Berikan permissions yang sesuai di setiap role.</p>
  </div>
</div>
