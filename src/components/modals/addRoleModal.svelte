<script>
  import ModalWrapperHeadless from '@comp/modals/modalWrapperHeadless.svelte';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import Cookies from 'js-cookie';
  import Checkboxes from '@comp/checkbox.svelte';
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
    if (roleName === '') {
      toastFailed('Role name cannot be empty');
    } else {
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
    }
  };
</script>

<button
  class="p-2 mt-2 md:mt-0 w-40 hover:bg-blue-600/60 bg-blue-600 text-white rounded-md"
  on:click={toggleModal}
>
  + Add new role
</button>
<ModalWrapperHeadless
  desktopWidth="md:w-1/2 lg:w-1/3"
  desktopRight="md:right-1/4"
  desktopTop="md:top-5"
  desktopHeight="h-screen"
  mobileHeight="h-screen"
  isOpen={showModal}
  on:modalHandler={(e) => {
    showModal = e.detail;
  }}
>
  <div class="p-2 pt-4 md:0 flex justify-between">
    <h1 class="font-bold">Add new role</h1>
    <button on:click={() => (showModal = false)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
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
      mode="add"
    />
    <button
      disabled={loading}
      class="flex gap-2 justify-center items-center p-4 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-600/60 disabled:bg-blue-600/60"
      on:click={async () => await addRoleHandler()}
    >
      {#if loading}
        <Spinner bg="#1f4496" />
      {/if}

      Add role
    </button>
  </div>
</ModalWrapperHeadless>
