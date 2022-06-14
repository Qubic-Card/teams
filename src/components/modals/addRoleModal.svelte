<script>
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import { getTeamId } from '@lib/query/getId';
  import { user } from '@lib/stores/userStore';
  import Input from '@comp/input.svelte';
  import Cookies from 'js-cookie';

  let teamId = Cookies.get('qubicTeamId');
  let roleName = '';
  let showModal = false;
  let loading = false;

  const toggleModal = () => (showModal = !showModal);

  const addRoleHandler = async () => {
    loading = true;
    try {
      // let teamId = await getTeamId($user?.id);
      const { data, error } = await supabase
        .from('team_roles')
        .insert({
          role_maps: roleMapping,
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
  class="p-4 w-56 bg-blue-600 text-white rounded-lg"
  on:click={toggleModal}
>
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
          <Input
            placeholder="Role Name"
            title="Role Name"
            bind:value={roleName}
            class="w-full"
            isEmptyChecking={true}
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
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
