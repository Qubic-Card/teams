<script>
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import { getTeamId } from '@lib/query/getId';
  import { user } from '@lib/stores/userStore';
  import Input from '@comp/input.svelte';
  import Cookies from 'js-cookie';
  import Checkboxes from '@comp/checkbox.svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

  export let roles, isHasWriteRolePermission;

  let teamId = Cookies.get('qubicTeamId');
  let roleName = '';
  let showModal = false;
  let loading = false;
  let checkedRole = [];

  const toggleModal = () => {
    if (roles.length < 5) {
      showModal = !showModal;
    } else {
      toastFailed('You can only add 5 roles');
    }
  };

  const addRoleHandler = async () => {
    loading = true;
    try {
      // let teamId = await getTeamId($user?.id);
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
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };
</script>

<button
  class="p-4 w-auto bg-blue-600 text-white rounded-lg"
  on:click={toggleModal}
>
  + Add new role
</button>
<ModalWrapper
  title="Add role"
  {showModal}
  on:showModal={toggleModal}
  class="w-1/2 h-1/2"
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
      {isHasWriteRolePermission}
    />
    <button
      disabled={roleName === '' ? true : false}
      class="flex justify-center p-4 w-full bg-neutral-700 text-white rounded-lg disabled:bg-neutral-500"
      on:click={async () => await addRoleHandler()}
    >
      {#if loading}
        <Spinner class="w-7 h-7" />
      {:else}
        Add role
      {/if}
    </button>
  </div>
</ModalWrapper>
