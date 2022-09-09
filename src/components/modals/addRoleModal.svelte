<script>
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import Cookies from 'js-cookie';
  import Checkboxes from '@comp/checkbox.svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';
  import { teamRoles } from '@lib/stores/roleStore';
  import { getContext } from 'svelte';

  export let permissions;

  const teamId = getContext('teamId');
  let roleName = '';
  let showModal = false;
  let loading = false;
  let checkedRole = [];

  const toggleModal = () => {
    checkedRole = ['allow_read_profile'];
    if ($teamRoles.length < 5) {
      showModal = !showModal;
    } else {
      toastFailed('You can only add 5 roles');
    }
  };

  const addRoleHandler = async () => {
    loading = true;
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .insert({
          role_maps: checkedRole,
          role_name: roleName,
          team_id: teamId,
        })
        .eq('id', teamId);

      if (error) {
        loading = false;
        throw new Error(error.message);
      } else {
        loading = false;
        toastSuccess('Role added successfully');
        toggleModal();
        $teamRoles = [
          ...$teamRoles,
          {
            role_name: data[0].role_name,
            role_maps: data[0].role_maps,
            id: data[0].id,
          },
        ];
        roleName = '';
        checkedRole = [];
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };
</script>

<button
  class="p-2 mt-2 md:mt-0 w-40 bg-blue-600 text-white rounded-md"
  on:click={toggleModal}
>
  + Add new role
</button>
<ModalWrapper
  title="Add role"
  {showModal}
  on:showModal={toggleModal}
  class="w-[90%] md:w-1/2 h-[80%]"
>
  <div
    class="flex flex-col h-82 justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
  >
    <Input
      placeholder="Role Name"
      title="Role Name"
      bind:value={roleName}
      class="w-full"
      isEmptyChecking={true}
    />
    <Checkboxes
      checkboxes={roleMapping}
      bind:checked={checkedRole}
      {permissions}
      bg="bg-neutral-800"
    />
    <button
      disabled={roleName === '' || loading}
      class="flex gap-2 justify-center items-center p-4 w-full bg-blue-600 text-white rounded-lg disabled:bg-blue-600/60"
      on:click={async () => await addRoleHandler()}
    >
      {#if loading}
        <Spinner class="w-7 h-7" />
      {/if}

      Add role
    </button>
  </div>
</ModalWrapper>
