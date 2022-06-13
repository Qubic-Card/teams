<script>
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import { getTeamId } from '@lib/query/getId';
  import { user } from '@lib/stores/userStore';
  import Input from '@comp/input.svelte';
  import Cookies from 'js-cookie';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';

  export let roles;

  let teamId = Cookies.get('qubicTeamId');
  let fname = '';
  let lname = '';
  let email = '';
  let showModal = false;
  let loading = false;
  let selectedRole = '';
  let selectedRoleId = 0;

  const selectRole = (role) => {
    console.log(role);
    selectedRole = role.role_name;
    selectedRoleId = role.id;
  };
  const toggleModal = () => (showModal = !showModal);

  const addMember = async () => {
    const { data, error } = await supabase.from('team_members').insert({
      team_id: teamId,
      uid: 'e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb',
      profile: 5,
      role: selectedRoleId,
      team_profile: {
        job: '',
        links: [],
        avatar: '',
        design: {},
        company: '',
        socials: [
          {
            data: email,
            type: 'email',
            isActive: true,
          },
        ],
        lastname: lname,
        firstname: fname,
      },
    });

    if (error) {
      toastFailed();
      return;
    } else {
      toastSuccess(`${name} has been added to this team`);
    }

    toggleModal();
  };
</script>

<button
  class="p-3 w-40 bg-blue-600 text-white rounded-lg"
  on:click={toggleModal}
>
  + Add member
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
            <h3 class="text-xl font-semibold">Add new member</h3>
            <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <div
          class="flex flex-col justify-center bg-neutral-900 items-center p-4 rounded-lg gap-3"
        >
          <div class="flex w-full gap-2">
            <Input
              placeholder="Firstname"
              title="Firstname"
              bind:value={fname}
              class="w-full"
              isEmptyChecking={true}
            />
            <Input
              placeholder="Lastname"
              title="Lastname"
              bind:value={lname}
              class="w-full"
              isEmptyChecking={true}
            />
          </div>
          <Input
            placeholder="Email"
            title="Email"
            bind:value={email}
            class="w-full"
            isEmptyChecking={true}
            isEmailInput={true}
          />
          <Menu class="flex w-full justify-start mb-2" let:open>
            <DropdownButton
              class="w-1/2"
              label={selectedRole !== ''
                ? selectedRole
                : 'Please select a role'}
            />
            {#if open}
              <div transition:slide|local>
                <MenuItems
                  class="top-[320px] left-5 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-1/2"
                >
                  {#each roles as item}
                    <MenuItem
                      class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                      on:click={async () => {
                        selectRole(item);
                      }}
                    >
                      {item.role_name}
                    </MenuItem>
                  {/each}
                </MenuItems>
              </div>
            {/if}
          </Menu>
          <button
            disabled={fname === '' ||
            lname === '' ||
            email === '' ||
            selectedRole === ''
              ? true
              : false}
            class="flex justify-center p-4 w-full bg-neutral-700 text-white rounded-lg disabled:bg-neutral-500"
          >
            {#if loading}
              <Spinner class="w-7 h-7" />
            {:else}
              Add new member
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
