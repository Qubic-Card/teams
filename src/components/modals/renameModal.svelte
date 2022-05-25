<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';

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

<button
  type="button"
  on:click={toggleModal}
  class="p-5 bg-neutral-800 rounded-lg"
>
  <img
    class="h-6 w-6"
    src="https://img.icons8.com/material-outlined/24/ffffff/edit--v1.png"
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
