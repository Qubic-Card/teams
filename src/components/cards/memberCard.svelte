<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { fly } from 'svelte/transition';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import roleId from '@lib/roleConfig';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import { createEventDispatcher, getContext } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import { teamProfileTemplate } from '@lib/constants';

  export let permissions;
  export let roles = [];
  export let member, i, updatedRole;

  const dispatch = createEventDispatcher();
  const teamId = getContext('teamId');
  let selectedRole = '';
  let showModal = false;
  let roleID = null;
  let roleName = null;
  let card = member?.card_id;
  let isLoading = false;
  let memberData = member?.team_cardcon[0]?.team_member_id;
  let role = member?.team_cardcon[0]?.team_member_id.role;
  let teamCardCon = member?.team_cardcon[0];

  const setRole = (role) => dispatch('setRole', { role: role, index: i });
  const toggleModal = () => (showModal = !showModal);

  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`, { state: card });

  const selectRole = (role) => (selectedRole = role);

  const setStatus = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: !teamCardCon.status }, { returning: 'minimal' })
      .eq('card_id', teamCardCon.card_id);

    teamCardCon.status = !teamCardCon.status;

    if (error) {
      toastFailed();
      return;
    }

    if (teamCardCon.status) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  const setMemberRole = async (id) => {
    isLoading = true;
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id }, { returning: 'minimal' })
      .eq('uid', memberData.uid)
      .eq('team_id', memberData.team_id);

    if (error) {
      console.log(error);
      toastFailed();
      isLoading = false;
      return;
    } else {
      toastSuccess('Role has been updated');
      isLoading = false;
    }
  };

  const deleteMemberHandler = async (id) => {
    isLoading = true;

    const { error: error_member } = await supabase
      .from('team_members')
      .update(
        {
          uid: null,
          team_profile: teamProfileTemplate,
        },
        { returning: 'minimal' }
      )
      .eq('id', id);

    if (error_member) {
      console.log(error_member);
      toastFailed();
      isLoading = false;
      return;
    } else {
      toastSuccess('Member has been deleted');
      isLoading = false;
      location.reload();
    }
  };

  const setRoleHandlers = async (idx) => {
    if ($user?.id === memberData.uid) {
      roleID = roleId[idx].id;
      roleName = roleId[idx].name;
      toggleModal();
    } else {
      await setMemberRole(roleId[idx].id);
      selectRole(roleId[idx].name);
    }
  };

  let showDeleteMemberModal = false;
  const toggleDeleteMemberModal = () =>
    (showDeleteMemberModal = !showDeleteMemberModal);

  $: if (i === updatedRole.index) selectedRole = updatedRole.role;
</script>

<ConfirmationModal
  {isLoading}
  isDispatch
  heading="Are you sure to change your role?"
  buttonLabel="Yes, i am sure."
  {showModal}
  {toggleModal}
  on:action={async () => {
    await setMemberRole(roleID);
    selectRole(roleName);
    showModal = false;
  }}
/>

<ConfirmationModal
  {isLoading}
  isDelete
  isDispatch
  heading="Are you sure you want to delete"
  text={`${memberData?.team_profile?.firstname} ${memberData?.team_profile?.lastname}?`}
  buttonLabel="Delete"
  showModal={showDeleteMemberModal}
  toggleModal={toggleDeleteMemberModal}
  on:action={async () => {
    await deleteMemberHandler(memberData.id);
    showDeleteMemberModal = false;
  }}
/>

{#if memberData?.uid}
  {#if !permissions.readMembers}
    {#if $user?.id === memberData.uid}
      <div class="flex flex-col justify-between">
        <div
          class="flex flex-col justify-between w-full h-64 bg-neutral-800 rounded-md"
        >
          <div
            class="flex cursor-pointer h-full gap-4 p-4"
            on:click={() => toProfileEditor(memberData.uid)}
          >
            <div class="hidden md:flex flex-row-reverse relative">
              <img
                src={memberData.team_profile?.avatar ?? '/favicon.svg'}
                alt="Profile"
                class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                  $user.id === memberData.uid ? 'border-2 border-blue-600' : ''
                }`}
              />
              {#if $user.id === memberData.uid}
                <h1
                  class="absolute translate-y-28 w-12 font-bold bg-blue-600/60 p-1 rounded-br-md rounded-tl-md text-center"
                >
                  You
                </h1>
              {/if}
            </div>
            <div class="flex flex-col justify-between">
              <div class="flex flex-col flex-wrap">
                <h1
                  class="md:text-lg lg:text-xl text-left w-56 overflow-clip text-ellipsis"
                >
                  {memberData.team_profile?.firstname ?? ''}
                  {memberData.team_profile?.lastname ?? ''
                    ? ''
                    : ' ' + memberData.team_profile?.lastname}
                </h1>
                <h2 class="text-neutral-300">
                  {memberData.team_profile?.job}
                </h2>
                <h2 class="text-neutral-300 text-xs">
                  Joined since {convertToGMT7(memberData.user_change)
                    .toDateString()
                    .slice(4)}
                </h2>
              </div>
              <div>
                <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
                <div class="flex justify-between gap-2">
                  <p class="text-neutral-300 text-sm">
                    {#if member?.type === 'pvc'}
                      PVC
                    {:else}
                      {member?.type?.charAt(0).toUpperCase() +
                        member?.type?.slice(1)}
                    {/if}
                    {member?.color?.charAt(0).toUpperCase() +
                      member?.color?.slice(1)}
                  </p>
                  <p class="text-neutral-300 text-sm">
                    ****{member?.id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex relative w-full h-16 justify-between items-center bg-neutral-900 rounded-b-md p-4"
          />
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex flex-col justify-between">
      <div
        class="flex flex-col justify-between w-full h-64 bg-neutral-800 rounded-md"
      >
        <div
          class="flex cursor-pointer h-full gap-4 p-4"
          on:click={() => toProfileEditor(memberData?.uid)}
        >
          <div class="hidden md:flex flex-row-reverse relative">
            <img
              src={memberData?.team_profile?.avatar ?? '/favicon.svg'}
              alt="Profile"
              class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                $user.id === memberData?.uid ? 'border-2 border-blue-600' : ''
              }`}
            />
            {#if $user.id === memberData?.uid}
              <h1
                class="absolute translate-y-28 w-12 font-bold bg-blue-600/60 p-1 rounded-br-md rounded-tl-md text-center"
              >
                You
              </h1>
            {/if}
          </div>
          <div class="flex flex-col justify-between">
            <div class="flex flex-col flex-wrap">
              <h1
                class="md:text-lg lg:text-xl text-left w-56 overflow-clip text-ellipsis"
              >
                {memberData?.team_profile?.firstname ?? ''}
                {memberData?.team_profile?.lastname ?? ''
                  ? ''
                  : ' ' + memberData?.team_profile?.lastname}
              </h1>
              <h2 class="text-neutral-300">
                {memberData?.team_profile?.job}
              </h2>
              <h2 class="text-neutral-300 text-xs">
                Joined since {convertToGMT7(memberData?.user_change)
                  .toDateString()
                  .slice(4)}
              </h2>
            </div>
            <div>
              <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
              <div class="flex justify-between gap-2">
                <p class="text-neutral-300 text-sm">
                  {#if member?.type === 'pvc'}
                    PVC
                  {:else}
                    {member?.type?.charAt(0).toUpperCase() +
                      member?.type?.slice(1)}
                  {/if}
                  {member?.color?.charAt(0).toUpperCase() +
                    member?.color?.slice(1)}
                </p>
                <p class="text-neutral-300 text-sm">
                  ****{member?.id.slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {#if permissions.writeMembers}
          <Menu class="absolute flex flex-row-reverse self-end" let:open>
            <MenuButton
              class={`text-white flex justify-between items-center h-12 p-2 gap-2 rounded-md relative ${$$props.class}`}
            >
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </MenuButton>

            {#if open}
              <div transition:fly|local={{ x: -20 }}>
                <MenuItems
                  class="top-0 right-0 z-50 relative mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-64"
                >
                  <MenuItem
                    on:click={async () => {
                      toggleDeleteMemberModal();
                    }}
                    class="flex hover:bg-neutral-800 text-red-600 px-2 py-2 rounded-md cursor-pointer"
                  >
                    Remove user
                  </MenuItem>
                </MenuItems>
              </div>
            {/if}
          </Menu>
        {/if}

        <div
          class="flex relative w-full h-16 justify-between items-center bg-neutral-900 rounded-b-md p-4"
        >
          <Menu class="" let:open>
            {#if permissions.readRoles}
              {#if permissions.writeRoles}
                {#if role?.role_name}
                  <DropdownButton
                    class="w-full md:w-60 text-sm"
                    label={selectedRole !== ''
                      ? selectedRole?.charAt(0).toUpperCase() +
                        selectedRole?.slice(1)
                      : role?.role_name
                      ? role?.role_name?.charAt(0).toUpperCase() +
                        role?.role_name?.slice(1)
                      : 'No role'}
                  />
                {/if}
              {:else}
                <p
                  class="text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md w-60 text-sm"
                >
                  {selectedRole !== ''
                    ? selectedRole?.charAt(0).toUpperCase() +
                      selectedRole?.slice(1)
                    : role?.role_name
                    ? role.role_name?.charAt(0).toUpperCase() +
                      role.role_name?.slice(1)
                    : 'No role'}
                </p>
              {/if}
            {/if}

            {#if open}
              <MenuItems
                class="top-16 z-50 absolute mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md text-sm border border-neutral-700 p-2 w-64"
              >
                {#if roles}
                  {#if selectedRole !== '' ? selectedRole !== 'Super Admin' : role?.role_name !== 'superadmin'}
                    <MenuItem
                      class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                      on:click={async () => await setRoleHandlers(0)}
                    >
                      Super Admin
                    </MenuItem>
                  {/if}

                  {#if selectedRole !== '' ? selectedRole !== 'Member' : role?.role_name !== 'member'}
                    <MenuItem
                      class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                      on:click={async () => await setRoleHandlers(1)}
                    >
                      Member
                    </MenuItem>
                  {/if}

                  {#each roles as item}
                    {#if selectedRole !== '' ? selectedRole !== item.role_name : role?.role_name !== item.role_name}
                      <MenuItem
                        class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                        on:click={async () => {
                          if ($user?.id === memberData.uid) {
                            roleID = item.id;
                            roleName = item.role_name;
                            toggleModal();
                          } else {
                            await setMemberRole(item.id);
                            // selectRole(item.role_name);
                            setRole(item.role_name);
                          }
                        }}
                      >
                        {item.role_name.charAt(0).toUpperCase() +
                          item.role_name.slice(1)}
                      </MenuItem>
                    {/if}
                  {/each}
                {/if}
              </MenuItems>
            {/if}
          </Menu>

          {#if permissions.writeMembers}
            <SwitchButton
              on:change={async () => await setStatus()}
              checked={teamCardCon?.status}
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}
{:else if permissions.readMembers}
  <div class="flex flex-col justify-between">
    <div
      class="flex flex-col justify-between w-full h-64 bg-neutral-800 rounded-md"
    >
      <div class="flex h-64 gap-4 p-4">
        <img
          src="/favicon.svg"
          alt="Profile"
          class="w-32 lg:w-36 h-32 lg:h-36 rounded-md"
        />
        <div class="flex flex-col justify-between">
          <div class="flex flex-col flex-wrap">
            <h1 class="md:text-md lg:text-lg text-left w-56">
              This card is <br class="block md:hidden" /> inactive
            </h1>
          </div>
          <div>
            <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
            <div class="flex justify-between gap-2">
              <p class="text-neutral-300 text-sm">
                {#if member?.type === 'pvc'}
                  PVC
                {:else}
                  {member?.type?.charAt(0).toUpperCase() +
                    member?.type?.slice(1)}
                {/if}
                {member?.color?.charAt(0).toUpperCase() +
                  member?.color?.slice(1)}
              </p>
              <p class="text-neutral-300 text-sm">
                ****{member?.id.slice(-6)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex relative w-full h-20 justify-between items-center bg-neutral-900 rounded-b-md p-4"
      />
    </div>
  </div>
{/if}
