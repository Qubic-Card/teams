<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { role, roleName, setRoleName } from '@lib/stores/roleStore';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Switch,
  } from '@rgossiaux/svelte-headlessui';
  import AddRoleModal from '@comp/modals/addRoleModal.svelte';
  import RenameModal from '@comp/modals/renameModal.svelte';
  import Checkboxes from '@comp/checkbox.svelte';
  import RoleSettingsSkeleton from '@comp/skeleton/roleSettingsSkeleton.svelte';
  import { setUserData, user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import Cookies from 'js-cookie';

  let roles = [];
  let roleMaps = [];
  let isAutoRenew = false;
  let isClicked = true;
  let loading = false;
  let teamId = Cookies.get('qubicTeamId');

  const getTeamsRoleMapping = async () => {
    // let teamId = await getTeamId($user?.id);
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*')
        .eq('team_id', teamId)
        .order('role_name', { ascending: true });

      if (error) throw error;

      if (data) {
        roles = data;
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  $: console.log(roles);
  const clicked = (e) => (isClicked = e.detail);
</script>

<div class="flex justify-center pt-4 pl-24 pr-4">
  <div class="flex flex-col w-full gap-4">
    <div class="flex gap-4">
      <div class="bg-zinc-700/70 rounded-lg p-4 w-3/4">
        <div class="flex flex-col my-4">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4"
          >
            <h1 class="font-bold text-xl md:text-3xl">Billing</h1>
            <div>
              <button
                class="p-4 w-auto bg-blue-600 text-white rounded-lg"
                on:click={async () => await console.log('billing')}
                >Change subscription</button
              >
              <button
                class="p-4 w-auto bg-blue-600 text-white rounded-lg"
                on:click={async () => await console.log('billing')}
                >Tambah saldo</button
              >
            </div>
          </div>
          <p>Subscription valid hingga: 12 Feb 2023</p>
          <p>Saldo tersisa: 0</p>
          <div
            class="flex justify-between items-center p-3 rounded-full mt-4 bg-neutral-800"
          >
            <p>Aktifkan auto renew</p>
            <Switch
              checked={isAutoRenew}
              on:change={(e) => (isAutoRenew = e.detail)}
              class={`flex justify-center items-center self-end rounded-full w-12 h-8 ${
                isAutoRenew ? 'bg-green-600' : 'bg-neutral-600'
              }`}
            >
              <span
                class={`inline-block w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                  isAutoRenew ? 'translate-x-2' : '-translate-x-2'
                }`}
                class:toggle-on={isAutoRenew}
                class:toggle-off={!isAutoRenew}
              />
            </Switch>
          </div>
        </div>
      </div>
      <div class="bg-zinc-700/70 p-4 w-1/4 rounded-lg text-xl">
        <p class="mb-4">Atur subscription dalam billing</p>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="bg-zinc-700/70 rounded-lg w-3/4 p-4">
        <div
          class="flex flex-col md:flex-row  justify-between items-start md:items-center mb-4"
        >
          <h1 class="font-bold text-xl md:text-3xl">Role Settings</h1>
          <AddRoleModal {roles} />
        </div>
        {#await getTeamsRoleMapping()}
          <RoleSettingsSkeleton />
        {:then}
          {#if roles.length > 0}
            {#each roles as role}
              <Disclosure let:open>
                <div class="flex justify-between items-center">
                  <DisclosureButton
                    class="text-xl w-full text-left hover:bg-neutral-800 p-4 rounded-lg flex justify-between mr-2"
                  >
                    {role.role_name.charAt(0).toUpperCase() +
                      role.role_name.slice(1)}
                  </DisclosureButton>
                  <RenameModal roleName={role.role_name} id={role.id} />
                  {#if open}
                    <button
                      transition:fade|local={{ duration: 200 }}
                      class="w-20 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 ml-2"
                      on:click={async () => {
                        await updateTeamsRoleMapping(role.id);
                        roleMaps = await getRoleMapsByProfile(
                          $user?.id,
                          teamId
                        );
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
                </div>
                {#if open}
                  <div transition:slide|local={{ duration: 500 }} class="mb-4">
                    <DisclosurePanel static>
                      <Checkboxes
                        checkboxes={roleMapping}
                        bind:checked={role.role_maps}
                        on:clicked={clicked}
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
        {:catch error}
          <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
            Some error occurred. Please reload the page and try again.
          </h1>
        {/await}
      </div>
      <div class="bg-zinc-700/70 w-1/4 p-4 rounded-lg text-xl">
        <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
        <p>Berikan permissions yang sesuai di setiap role.</p>
      </div>
    </div>
    <div class="flex flex-col bg-zinc-700/70 p-4 rounded-lg">
      <h1 class="text-xl font-bold">Contact us</h1>
      <a href="mailto:support@qubic.id">Email: support@qubic.id</a>
      <a href="https://wa.me/628113087599">Whatsapp: +62 811 3087599</a>
    </div>
  </div>

  <!-- <div class="flex flex-col w-1/3 rounded-lg gap-4">
    <div class="bg-zinc-700/70 h-1/2 p-4 rounded-lg text-xl lg:text-2xl">
      <p class="mb-4">Atur subscription dalam billing</p>
    </div>
    <div class="bg-zinc-700/70 h-1/2 p-4 rounded-lg text-xl lg:text-2xl">
      <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
      <p>Berikan permissions yang sesuai di setiap role.</p>
    </div>
  </div> -->
</div>
