<script>
  import { slide } from 'svelte/transition';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import {
    role,
    roleName,
    setNewRole,
    setRoleName,
  } from '@lib/stores/roleStore';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Switch,
  } from '@rgossiaux/svelte-headlessui';
  import AddRoleModal from '@comp/modals/addRoleModal.svelte';
  import RenameModal from '@comp/modals/renameModal.svelte';
  import Checkboxes from '@comp/checkbox.svelte';
  import { memberRights } from '@lib/stores/memberRightsStore';
  import RoleSettingsSkeleton from '@comp/skeleton/roleSettingsSkeleton.svelte';
  import { getTeamId } from '@lib/query/getId';
  import { user } from '@lib/stores/userStore';

  let newRoles = [];
  let roles = [];
  let isOpen = false;
  let isAutoRenew = false;
  let isHasPermission = false;
  // $: roles;

  const getTeamsRoleMapping = async () => {
    try {
      let teamId = await getTeamId($user.id);
      console.log(teamId);
      const { data, error } = await supabase
        .from('team_roles')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;

      if (data) roles = data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeamsRoleMapping = async (id) => {
    const { data, error } = await supabase
      .from('team_roles')
      .update(
        {
          role_maps: $role,
        },
        { returning: 'minimal' }
      )
      .eq('id', id);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      return data;
    }
  };

  $: {
    // console.log(loading);
    // console.log('role map', roleMapping);
    // console.log(newRoles);
    // console.log('roles', roles);
    // console.log('role', $role);
    // console.log('setting', roleName);
    console.log($memberRights);
  }

  $: {
    // getTeamsRoleMapping();

    $memberRights?.filter((item) => {
      if (item === 'allow_read_team') isHasPermission = true;
    });
  }
</script>

<div class="min-h-screen flex gap-4">
  <div class="bg-zinc-700/70 w-2/3 rounded-lg p-4">
    <div class="flex flex-col my-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="font-bold text-3xl">Billing</h1>
        <button
          class="p-4 w-56 bg-white text-black rounded-lg"
          on:click={async () => await console.log('billing')}
          >Tambah saldo</button
        >
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
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-3xl">Role Settings</h1>
      <AddRoleModal />
    </div>
    {#await getTeamsRoleMapping()}
      <RoleSettingsSkeleton />
    {:then}
      {#each roles as role}
        <Disclosure let:open>
          <div class="flex justify-between items-center">
            <DisclosureButton
              on:click={() => setRoleName(role.role_name)}
              class="text-2xl my-2 w-full text-left hover:bg-neutral-800 p-4 rounded-lg flex justify-between"
            >
              <!-- {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1)} -->
              {role.role_name}
            </DisclosureButton>
            <RenameModal roleName={role.role_name} id={role.id} />
          </div>
          {#if open}
            <div transition:slide={{ duration: 500 }}>
              <DisclosurePanel static>
                <Checkboxes
                  checkboxes={roleMapping}
                  bind:checked={role.role_maps}
                  {roles}
                  id={role.id}
                />
                <button
                  class="w-full p-3 bg-white text-black rounded-lg"
                  on:click={async () => await updateTeamsRoleMapping(role.id)}
                  >Save changes</button
                >
              </DisclosurePanel>
            </div>
          {/if}
        </Disclosure>
      {/each}
    {:catch error}
      <h1>Some error occurred. Please reload the page and try again.</h1>
    {/await}
  </div>
  <div class="flex flex-col w-1/3 rounded-lg gap-4">
    <div class="bg-zinc-700/70 h-1/2 p-4 rounded-lg text-2xl">
      <p class="mb-4">Atur subscription dalam billing</p>
    </div>
    <div class="bg-zinc-700/70 h-1/2 p-4 rounded-lg text-2xl">
      <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
      <p>Berikan permissions yang sesuai di setiao role.</p>
    </div>
  </div>
</div>

<!-- <style>
  /* Customize the label (the container) */
  .container {
    display: block;
    position: relative;
    /* padding-left: 35px; */
    /* margin-bottom: 12px; */
    cursor: pointer;
    /* font-size: 22px; */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    /* top: 0; */
    bottom: -15px;
    left: 0;
    height: 35px;
    width: 35px;
    background-color: #404040;
    border: solid 1px #0c0c0d;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #ccc;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
    left: 20px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style> -->
