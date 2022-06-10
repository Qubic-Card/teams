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

  export let roles;

  let teamId = Cookies.get('qubicTeamId');
  let name = '';
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
        lastname: '',
        firstname: name,
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
          <Input
            placeholder="Name"
            title="Name"
            bind:value={name}
            class="w-full"
            isEmptyChecking={true}
          />
          <Input
            placeholder="Email"
            title="Email"
            bind:value={email}
            class="w-full"
            isEmptyChecking={true}
          />
          <Menu class="flex w-full justify-start" let:open>
            <MenuButton
              class="bg-blue-600 text-white flex justify-around items-center w-auto h-10 px-2 gap-2 rounded-md relative "
            >
              {selectedRole !== '' ? selectedRole : 'Please select a role'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </MenuButton>
            {#if open}
              <div>
                <MenuItems
                  class="top-[320px] left-5 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-[45%]"
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
            disabled={name === '' || email === '' ? true : false}
            class="flex justify-center p-4 w-full bg-neutral-700 text-white rounded-lg disabled:bg-neutral-500 disabled:cursor-not-allowed"
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
