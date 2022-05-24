<script>
  import roleMapping from '@lib/role';
  import RenameModal from '@comp/modals/renameModal.svelte';
  import supabase from '@lib/db';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import Checkboxes from '@comp/checkbox.svelte';
  import {
    role,
    roleName,
    setNewRole,
    setRoleName,
  } from '@lib/stores/roleStore';
  import { log } from '@lib/logger/logger';

  let newRoles = [];
  let roles = [];
  let isOpen = false;
  $: roles;
  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const getTeamsRoleMapping = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('teams')
      .select('role_mapping')
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      roles = data[0].role_mapping;
      // return data[0].role_mapping;
    }
  };

  const updateTeamsRoleMapping = async (isNewRole = false) => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('teams')
      .update(
        {
          role_mapping: Object.assign(roles, {
            [isNewRole ? 'member12' : $roleName]: isNewRole
              ? roleMapping
              : $role,
          }),
        },
        { returning: 'minimal' }
      )
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      return data;
    }
  };

  $: {
    console.log('role map', roleMapping);
    // console.log(newRoles);
    console.log('roles', roles);
    console.log('role', $role);
    // console.log('setting', roleName);
    // console.log(Object.keys(roles).map((key) => roles[key]));
    console.log(Object.entries(roles).map(([key, value]) => [key, value]));
  }

  $: getTeamsRoleMapping();
  // $: updateTeamsRoleMapping();
  const openModal = () => (isOpen = true);
  const closeModal = () => (isOpen = false);
</script>

<div class="min-h-screen flex gap-4">
  <div class="bg-zinc-700/70 w-2/3 rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-3xl">Role Settings</h1>
      <!-- <button
        class="p-4 w-56 bg-white text-black rounded-lg"
        on:click={openModal}>+ add new role</button
      > -->
      <button
        class="p-4 w-56 bg-white text-black rounded-lg"
        on:click={async () => await updateTeamsRoleMapping(true)}
        >+ Add new role</button
      >
      <!-- <AddNewRoleModal {isOpen} on:close={closeModal} {roles} /> --->
    </div>
    {#each Object.entries(roles) as [key, value]}
      <Disclosure let:open>
        <RenameModal {isOpen} on:close={closeModal} {roles} {key} />
        <div class="flex justify-between items-center">
          <DisclosureButton
            on:click={() => setRoleName(key)}
            class="text-2xl my-2 w-full text-left hover:bg-neutral-800 p-4 rounded-lg flex justify-between"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </DisclosureButton>
          <button
            class="bg-white text-black p-1 text-sm h-10"
            on:click={openModal}>edit</button
          >
        </div>
        {#if open}
          <div transition:slide={{ duration: 500 }}>
            <DisclosurePanel static>
              <Checkboxes
                checkboxes={roleMapping}
                bind:checked={value}
                {updateTeamsRoleMapping}
              />
            </DisclosurePanel>
          </div>
        {/if}
      </Disclosure>
    {/each}
  </div>
  <div class="flex flex-col w-1/3 rounded-lg gap-4">
    <div class="bg-zinc-700/70 h-1/2 p-4 rounded-lg text-2xl">
      <p class="mb-4">Role settings adalah tempat untuk setting role.</p>
      <p>Berikan permissions yang sesuai di setiao role.</p>
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
