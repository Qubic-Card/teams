<script>
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';

  let roleName = ''
  let showModal = false;
  let loading = false;

  const getTeamId = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('team_id');

    if (error) console.log(error);
    if (data) {
      return data[0].team_id;
    }
  };

  const toggleModal = () => (showModal = !showModal);

  const addRoleHandler = async () => {
    loading = true;
    try {
      let teamId = await getTeamId();
      const { data, error } = await supabase
        .from('team_roles')
        .insert({
          role_maps: roleMapping.map((role) => role.name),
          role_name: roleName,
          team_id: teamId,
        })
        .eq('id', teamId);
      if (error) {
        loading = false;
        throw new Error(error)
      } else {
        loading = false;
        toastSuccess('Role added successfully');
        toggleModal();
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };
</script>

<button
  class="p-4 w-56 bg-white text-black rounded-lg"
  on:click={toggleModal}>
  + Add new role
</button>
{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-1/2 my-6 mx-auto md:max-w-3xl max-w-md">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-900 outline-none focus:outline-none"
      >
        <!--header-->
        <div class="p-5 border-b border-solid rounded-t">
          <div class="flex w-full justify-between items-center">
            <h3 class="text-xl font-semibold">Add new role</h3>
            <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <div
          class="flex flex-col justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
        >
          {#if loading}
            <h1>Loading</h1>
          {/if}
          <input
            type="text"
            bind:value={roleName}
            placeholder="Role name"
            class="p-3 w-full text-black"
          />
          <button
            class="flex justify-center p-4 w-full bg-neutral-600 text-black rounded-lg"
            on:click={async () => await addRoleHandler()}>
            {#if loading}
              <Spinner class="w-7 h-7" />
            {:else}
              Add role
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
