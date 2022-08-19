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
  import { createEventDispatcher } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';

  export let permissions;
  export let roles = [];
  export let member, i, updatedRole;

  const dispatch = createEventDispatcher();
  let selectedRole = '';
  let showModal = false;
  let roleID = null;
  let roleName = null;
  let teamProfile = member?.team_member_id?.team_profile;
  let card = member?.card_id;
  let role = member?.team_member_id?.role;
  let isLoading = false;

  const setRole = (role) => dispatch('setRole', { role: role, index: i });
  const toggleModal = () => (showModal = !showModal);

  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);

  const selectRole = (role) => (selectedRole = role);

  const setStatus = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: !member.status }, { returning: 'minimal' })
      .eq('card_id', member.card_id.id);

    member.status = !member.status;

    if (error) {
      toastFailed();
      return;
    }

    if (member.status) {
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
      .eq('uid', member?.team_member_id?.uid)
      .eq('team_id', member?.team_member_id?.team_id);

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

  const deleteMemberHandler = async (id, memberData) => {
    isLoading = true;

    const { error: error_member } = await supabase
      .from('team_members')
      .update({ uid: null }, { returning: 'minimal' })
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
  text={`${teamProfile?.firstname} ${teamProfile?.lastname} from this team?`}
  buttonLabel="Delete"
  showModal={showDeleteMemberModal}
  toggleModal={toggleDeleteMemberModal}
  on:action={async () => {
    await deleteMemberHandler(member?.team_member_id?.id, member);
    showDeleteMemberModal = false;
  }}
/>

{#if member.team_member_id}
  {#if !permissions.readMembers}
    {#if $user?.id === member.team_member_id.uid}
      <div class="flex flex-col justify-between">
        <div
          class="flex flex-col justify-between w-full h-full bg-neutral-800 rounded-md"
        >
          <div
            class="flex cursor-pointer h-full gap-4 p-4"
            on:click={() => toProfileEditor(member?.team_member_id.uid)}
          >
            <div class="flex flex-row-reverse relative">
              <img
                src={teamProfile.avatar === ''
                  ? '/favicon.svg'
                  : teamProfile.avatar}
                alt="Profile"
                class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                  $user.id === member?.team_member_id?.uid
                    ? 'border-2 border-blue-600'
                    : ''
                }`}
              />
              {#if $user.id === member?.team_member_id?.uid}
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
                  {teamProfile.firstname === ''
                    ? 'No name'
                    : teamProfile.firstname}
                  {teamProfile.lastname === ''
                    ? ''
                    : ' ' + teamProfile.lastname}
                </h1>
                <h2 class="text-neutral-300">
                  {teamProfile.job}
                </h2>
                <h2 class="text-neutral-300 text-xs">
                  Joined since {new Date(member?.team_member_id.member_from)
                    .toDateString()
                    .slice(4)}
                </h2>
              </div>
              <div>
                <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
                <p class="text-neutral-300 text-sm">
                  {#if card?.type === 'pvc'}
                    PVC
                  {:else}
                    {card?.type?.charAt(0).toUpperCase() + card?.type?.slice(1)}
                  {/if}
                  {card?.color?.charAt(0).toUpperCase() + card?.color?.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex relative h-20 w-full justify-between items-center bg-neutral-900 rounded-b-md p-4"
          />
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex flex-col justify-between">
      <div
        class="flex flex-col justify-between w-full h-full bg-neutral-800 rounded-md"
      >
        <div
          class="flex cursor-pointer h-full gap-4 p-4"
          on:click={() => toProfileEditor(member?.team_member_id.uid)}
        >
          <div class="flex flex-row-reverse relative">
            <img
              src={teamProfile.avatar === ''
                ? '/favicon.svg'
                : teamProfile.avatar}
              alt="Profile"
              class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                $user.id === member?.team_member_id?.uid
                  ? 'border-2 border-blue-600'
                  : ''
              }`}
            />
            {#if $user.id === member?.team_member_id?.uid}
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
                {teamProfile.firstname === ''
                  ? 'No name'
                  : teamProfile.firstname}
                {teamProfile.lastname === '' ? '' : ' ' + teamProfile.lastname}
              </h1>
              <h2 class="text-neutral-300">
                {teamProfile.job}
              </h2>
              <h2 class="text-neutral-300 text-xs">
                Joined since {convertToGMT7(member?.team_member_id.member_from)
                  .toDateString()
                  .slice(4)}
              </h2>
            </div>
            <div>
              <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
              <p class="text-neutral-300 text-sm">
                {#if card?.type === 'pvc'}
                  PVC
                {:else}
                  {card?.type?.charAt(0).toUpperCase() + card?.type?.slice(1)}
                {/if}
                {card?.color?.charAt(0).toUpperCase() + card?.color?.slice(1)}
              </p>
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
                    class="w-60 text-sm"
                    label={selectedRole !== ''
                      ? selectedRole.charAt(0).toUpperCase() +
                        selectedRole.slice(1)
                      : role?.role_name
                      ? role?.role_name.charAt(0).toUpperCase() +
                        role?.role_name.slice(1)
                      : 'No role'}
                  />
                {/if}
              {:else}
                <p
                  class="text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md w-60 text-sm"
                >
                  {selectedRole !== ''
                    ? selectedRole.charAt(0).toUpperCase() +
                      selectedRole.slice(1)
                    : role?.role_name
                    ? role.role_name.charAt(0).toUpperCase() +
                      role.role_name.slice(1)
                    : 'No role'}
                </p>
              {/if}
            {/if}

            {#if open}
              <MenuItems
                class="top-16 z-50 absolute mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md text-sm border border-neutral-700 p-2 w-64"
              >
                <MenuItem
                  class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                  on:click={async () => {
                    if ($user?.id === member.team_member_id.uid) {
                      roleID = roleId[0].id;
                      roleName = roleId[0].name;
                      toggleModal();
                    } else {
                      await setMemberRole(roleId[0].id);
                      selectRole(roleId[0].name);
                    }
                  }}
                >
                  Super Admin
                </MenuItem>
                <MenuItem
                  class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                  on:click={async () => {
                    if ($user?.id === member.team_member_id.uid) {
                      roleID = roleId[1].id;
                      roleName = roleId[1].name;
                      toggleModal();
                    } else {
                      await setMemberRole(roleId[1].id);
                      selectRole(roleId[1].name);
                    }
                  }}
                >
                  Member
                </MenuItem>
                {#each roles as item}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                    on:click={async () => {
                      if ($user?.id === member.team_member_id.uid) {
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
                {/each}
              </MenuItems>
            {/if}
          </Menu>

          {#if permissions.writeMembers}
            <SwitchButton
              on:change={async () => await setStatus()}
              checked={member.status}
            />
          {/if}
        </div>
      </div>
    </div>
  {/if}
{:else if permissions.readMembers}
  <div class="flex flex-col justify-between">
    <div
      class="flex flex-col justify-between w-full h-full bg-neutral-800 rounded-md"
    >
      <div class="flex h-full gap-4 p-4">
        <img
          src="/favicon.svg"
          alt="Profile"
          class="w-32 lg:w-36 h-32 lg:h-36 rounded-md"
        />
        <div class="flex flex-col justify-between">
          <div class="flex flex-col flex-wrap">
            <h1 class="md:text-md lg:text-lg text-left w-56">
              This card is inactive
            </h1>
          </div>
          <div>
            <h2 class="text-neutral-300 text-xs mt-3">Card:</h2>
            <p class="text-neutral-300 text-sm">
              {#if !member.status}
                {#if member?.type === 'pvc'}
                  PVC
                {:else}
                  {member?.type?.charAt(0).toUpperCase() +
                    member?.type?.slice(1)}
                {/if}
                {member?.color?.charAt(0).toUpperCase() +
                  member?.color?.slice(1)}
              {:else}
                <span>No card found</span>
              {/if}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex relative w-full h-20 justify-between items-center bg-neutral-900 rounded-b-md p-4"
      />
    </div>
  </div>
{/if}
