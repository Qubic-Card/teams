<script>
  import supabase from '@lib/db';
  import roleMapping from '@lib/role';
  import { role, roleName } from '@lib/stores/roleStore';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let isOpen, roles, key;
  let name;
  // $: console.log($roleName);
  $: console.log(roles);
  let dispatch = createEventDispatcher();
  const closeDialog = () => dispatch('close', { isOpen: false });

  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const updateTeamsRoleMapping = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('teams')
      .update({ role_mapping: roles }, { returning: 'minimal' })
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      return data;
    }
  };
</script>

<Dialog
  open={isOpen}
  on:close={closeDialog}
  class="overflow-x-hidden overflow-y-auto fixed top-72 left-32 md:left-60 lg:left-96 inset-0 z-20 outline-none focus:outline-none flex flex-col bg-neutral-900 text-white p-4 h-[280px] w-1/2 rounded-lg"
>
  <DialogOverlay />

  <DialogTitle class="w-full font-bold text-3xl mb-4">Rename</DialogTitle>
  <input
    type="text"
    bind:value={key}
    class="text-black py-4 px-2"
    placeholder="Role name"
  />
  <button
    class="bg-white hover:bg-neutral-200 p-4 text-black mt-2"
    on:click={async () => await updateTeamsRoleMapping()}>Rename</button
  >
  <button
    class="bg-red-900 hover:bg-red-900/80 p-4 mt-2 text-white"
    on:click={closeDialog}>Cancel</button
  >
</Dialog>

<!-- ------------------------ 
add new role modal 
------------------------>

<!-- <script>
  import supabase from '@lib/db';
  import roleMapping from '@lib/role';

  import { roleName } from '@lib/stores/roleStore';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  export let isOpen, roles;
  let name;
  $: console.log($roleName);
  let dispatch = createEventDispatcher();
  const closeDialog = () => dispatch('close', { isOpen: false });

  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const updateTeamsRoleMapping = async () => {
    let teamId = await getTeamId();
    const { data, error } = await supabase
      .from('teams')
      .update(
        { role_mapping: Object.assign(roles, { [name]: roleMapping }) },
        { returning: 'minimal' }
      )
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      return data;
    }
  };
</script>

<Dialog
  open={isOpen}
  on:close={closeDialog}
  class="overflow-x-hidden overflow-y-auto fixed top-72 left-32 md:left-60 lg:left-96 inset-0 z-20 outline-none focus:outline-none flex flex-col bg-neutral-900 text-white p-4 h-1/2 w-1/2 rounded-lg"
>
  <DialogOverlay />

  <DialogTitle class="w-full font-bold text-2xl">Add new role</DialogTitle>
  <input
    type="text"
    bind:value={name}
    class="text-black p-2"
    placeholder="Role name"
  />
  <button
    class="bg-white p-4 w-20 text-black mt-2"
    on:click={updateTeamsRoleMapping}>Add</button
  >
  <button on:click={closeDialog}>Deactivate</button>
  <button on:click={closeDialog}>Cancel</button>
</Dialog> -->
