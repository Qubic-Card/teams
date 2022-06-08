<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';

  export let roleName, id;

  let showModal = false;
  let loading = false;

  const toggleModal = () => (showModal = !showModal);

  const updateRoleName = async () => {
    try {
      loading = true;
      const { error } = await supabase
        .from('team_roles')
        .update(
          {
            role_name: roleName,
          },
          { returning: 'minimal' }
        )
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      } else {
        loading = false;
        toastSuccess('Role name updated');
      }

      toggleModal();
    } catch (error) {
      loading = false;
      toastFailed("Couldn't update role name");
    }
  };
</script>

<button type="button" on:click={toggleModal} class="p-3 bg-white rounded-lg">
  <img
    class="h-4 w-4"
    src="https://img.icons8.com/external-becris-lineal-becris/64/undefined/external-edit-mintab-for-ios-becris-lineal-becris.png"
    alt="edit"
  />
  <!-- Rename -->
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
            <h3 class="text-xl font-semibold">Rename role name</h3>
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
            on:click={async () => await updateRoleName()}
            class="flex justify-center items-center p-3 w-full bg-neutral-700 hover:bg-neutral-800 hover:border hover:border-neutral-500"
          >
            {#if loading}
              <Spinner class="w-7 h-7" />
            {:else}
              Apply changes
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
