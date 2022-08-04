<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import ModalWrapper from '@comp/modals/modalWrapper.svelte';

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
  class="p-3 bg-white rounded-lg disabled:bg-white/60"
>
  <img
    class="h-4 w-4"
    src="https://img.icons8.com/external-becris-lineal-becris/64/undefined/external-edit-mintab-for-ios-becris-lineal-becris.png"
    alt="edit"
  />
  <!-- Rename -->
</button>

<ModalWrapper
  title="Rename role"
  {showModal}
  on:showModal={toggleModal}
  class="w-1/2"
>
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
      class="flex justify-center items-center p-3 w-full bg-blue-600 hover:bg-blue-600/90 rounded-md"
    >
      {#if loading}
        <Spinner class="w-7 h-7" />
      {:else}
        Apply changes
      {/if}
    </button>
  </div>
</ModalWrapper>
