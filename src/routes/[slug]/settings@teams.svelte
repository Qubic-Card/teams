<script>
  import roleMapping from '@lib/role';
  import AddNewRoleModal from '@comp/modals/addNewRoleModal.svelte';
  import supabase from '@lib/db';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import Checkboxes from '@comp/checkbox.svelte';
  import { role, setNewRole } from '@lib/stores/roleStore';

  // let teamId = parseInt(Cookies.get('teamId'));
  let newRoles = [];
  let roles = [];
  let isOpen = false;
  let roleName = 'Member1';

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
      return data[0].role_mapping;
    }
  };

  const updateTeamsRoleMapping = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('teams')
      .update(
        { role_mapping: Object.assign(roles, { [roleName]: $role }) },
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
    console.log(roleMapping);
    console.log(newRoles);
    console.log(roles);
    // console.log('setting', roleName);
    // console.log(Object.keys(roles).map((key) => roles[key]));
    // console.log(Object.entries(roles).map(([key, value]) => [value]));
  }

  $: getTeamsRoleMapping();
  const openModal = () => (isOpen = true);
  const closeModal = () => (isOpen = false);

  const addNewRole = (e) => {
    roleName = e.detail.roleName;
    newRoles = { ...roles, [roleName]: roleMapping };
  };
</script>

<div class="min-h-screen flex gap-4">
  <div class="bg-zinc-700/70 w-2/3 rounded-lg p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="font-bold text-3xl">Role Settings</h1>
      <button
        class="p-4 w-56 bg-white text-black rounded-lg"
        on:click={openModal}>+ add new role</button
      >
      <button on:click={updateTeamsRoleMapping}>TEST UPDATE</button>
      <AddNewRoleModal
        {isOpen}
        on:close={closeModal}
        {roleName}
        on:setName={addNewRole}
      />
    </div>
    {#each Object.entries(roles) as [key, value]}
      <Disclosure let:open>
        <DisclosureButton
          class="text-2xl my-2 w-full text-left hover:bg-neutral-800 p-4 rounded-lg"
          >{key}</DisclosureButton
        >
        {#if open}
          <div transition:slide={{ duration: 500 }}>
            <DisclosurePanel static>
              <Checkboxes checkboxes={roleMapping} bind:checked={value} />
            </DisclosurePanel>
          </div>
        {/if}
        <!-- {#each roleMapping as role}
            <div transition:slide={{ duration: 500 }}>
              <DisclosurePanel static>
                <div
                  class="flex w-full justify-between items-center bg-neutral-800 p-4 rounded-lg mb-2"
                >
                  <div class="block">
                    <div class="mt-2">
                      {#if isEditable}
                        <label
                          class="inline-flex items-center cursor-pointer container"
                        >
                          <input
                            type="checkbox"
                            bind:group={newRoles}
                            value={role.name}
                            class="cursor-pointer border-2 border-neutral-700 bg-red-500 w-7 h-7 checked:bg-red-600 shadow checked:shadow-xl rounded-lg after:bg-red-500 before:bg-red-200"
                          />
                          <span class="ml-2 checkmark">{role.name}</span>
                        </label>
                      {:else}
                        <label
                          class="inline-flex items-center cursor-pointer container"
                        >
                          <input
                            type="checkbox"
                            bind:group={value}
                            value={role.name}
                            class="cursor-pointer border-2 border-neutral-700 bg-red-500 w-7 h-7 checked:bg-red-600 shadow checked:shadow-xl rounded-lg after:bg-red-500 before:bg-red-200"
                          />
                          <span class="ml-2 checkmark">{role.name}</span>
                        </label>
                      {/if}
                    </div>
                  </div>
                  <p class="w-1/2">
                    {role.desc}
                  </p>
                </div>
              </DisclosurePanel>
            </div>
          {/each}
        {/if} -->
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
