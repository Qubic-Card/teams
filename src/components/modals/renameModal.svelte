<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';

  export let roleName, id;

  let showModal = false;
  let loading = false;

  const toggleModal = () => (showModal = !showModal);

  const updateRoleName = async () => {
    if (roleName === '') {
      toastFailed('Empty field');
    } else {
      try {
        loading = true;
        const { error } = await supabase
          .from('team_roles')
          .update({
            role_name: roleName,
          })
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(error.message);
        } else {
          loading = false;
          toastSuccess('Role name updated');
          setTimeout(() => {
            location.reload();
          }, 500);
        }

        toggleModal();
      } catch (error) {
        loading = false;
        toastFailed("Couldn't update role name");
      }
    }
  };
</script>

<button
  type="button"
  on:click={toggleModal}
  class="p-3 bg-white rounded-lg disabled:bg-white/60 h-10 w-10 mt-2"
>
  <img
    class="h-4 w-4"
    src="https://img.icons8.com/external-becris-lineal-becris/64/undefined/external-edit-mintab-for-ios-becris-lineal-becris.png"
    alt="edit"
  />
  <!-- Rename -->
</button>

{#if showModal}
  <Dialog
    open={showModal}
    on:close={() => (showModal = false)}
    class="fixed inset-0 z-50 overflow-y-auto flex justify-center items-end md:items-center overflow-x-hidden"
  >
    <DialogOverlay
      class="fixed inset-0 bg-black opacity-30 z-10"
      on:click={toggleModal}
    />
    <div
      class="flex flex-col justify-between bg-neutral-800 text-white w-full md:w-[40%] h-44 p-2 z-40 rounded-md"
    >
      <div
        class="text-md md:text-lg border-b font-semibold border-neutral-700 flex justify-between"
      >
        Change Role Name
        <button on:click={toggleModal} class="self-start">
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
      <Input
        placeholder="Role Name"
        title="Role Name"
        bind:value={roleName}
        class="w-full"
        isEmptyChecking={true}
        inputbg="bg-neutral-900"
      />
      <button
        disabled={loading}
        on:click={async () => await updateRoleName()}
        class="flex justify-center items-center gap-2 p-3 w-full bg-blue-600 hover:bg-blue-600/60 disabled:bg-blue-600/60 rounded-md md:text-md text-xs"
      >
        {#if loading}
          <Spinner bg="#1f4496" size={16} class="w-6 h-6" />
        {/if}
        Apply changes
      </button>
    </div>
  </Dialog>
{/if}
