<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide, fly } from 'svelte/transition';
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
  import { createEventDispatcher } from 'svelte';

  export let permissions;
  export let roles = [];
  export let member = null;

  // export let deleteMemberHandler;

  let selectedRole = '';
  let memberRole = null;
  const dispatch = createEventDispatcher();

  const passDeletedMemberData = (member) =>
    dispatch('deletedMemberData', member);

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
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id }, { returning: 'minimal' })
      .eq('uid', member?.team_member_id?.uid)
      .eq('team_id', member?.team_member_id?.team_id);

    if (error) {
      console.log(error);
      toastFailed();
      return;
    } else {
      toastSuccess('Role has been updated');
    }
  };
  // eac9c236-da25-4d9c-a058-632bd92bc951
  // cf682da6-c300-4078-8088-f85993eda24d
  const deleteMemberHandler = async (id, memberData) => {
    // console.log(id, memberData);

    const { error } = await supabase
      .from('team_cardcon')
      .delete()
      .eq('team_member_id', id);

    const { error: error_member } = await supabase
      .from('team_members')
      .update({ uid: null }, { returning: 'minimal' })
      .eq('id', id);

    if (error) {
      console.log(error);
      toastFailed();
      return;
    } else if (error_member) {
      console.log(error_member);
      toastFailed();
      return;
    } else {
      // passDeletedMemberData(memberData.card_id);
      toastSuccess('Member has been deleted');
      location.reload();
    }
  };

  const getMembersRole = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(role_name, id)')
      .eq('uid', member?.team_member_id?.uid)
      .eq('team_id', member?.team_member_id?.team_id);

    if (error) console.log(error);

    if (data) {
      memberRole = data[0].role;
    }
  };

  $: if (member.team_member_id) getMembersRole();
</script>

{#if member.team_member_id}
  {#if !permissions.readMembers}
    {#if $user.id === member.team_member_id.uid}
      <div class="flex flex-col justify-between">
        <div
          class="flex flex-col justify-between w-full h-full bg-neutral-800 rounded-md"
        >
          <div
            class="flex cursor-pointer h-full gap-4 p-4"
            on:click={() => toProfileEditor(member?.team_member_id.uid)}
          >
            <div class="flex flex-row-reverse relative">
              {#if member?.team_member_id.team_profile.avatar === ''}
                <div
                  class={`flex justify-center items-center w-32 lg:w-36 h-32 lg:h-36 rounded-md bg-neutral-700 text-5xl ${
                    $user.id === member?.team_member_id?.uid
                      ? 'border-2 border-blue-600'
                      : ''
                  }`}
                >
                  Q
                </div>
              {:else}
                <img
                  src={member?.team_member_id.team_profile.avatar}
                  alt="Profile"
                  class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                    $user.id === member?.team_member_id?.uid
                      ? 'border-2 border-blue-600'
                      : ''
                  }`}
                />
              {/if}
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
                  {member?.team_member_id.team_profile.firstname === ''
                    ? 'No name'
                    : member?.team_member_id.team_profile.firstname}
                  {member?.team_member_id.team_profile.lastname === ''
                    ? ''
                    : ' ' + member?.team_member_id.team_profile.lastname}
                </h1>
                <h2 class="text-neutral-300">
                  {member?.team_member_id.team_profile.job}
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
                  {#if member?.type === 'pvc'}
                    PVC
                  {:else}
                    {member?.card_id?.type?.charAt(0).toUpperCase() +
                      member?.card_id?.type?.slice(1)}
                  {/if}
                  {member?.card_id?.color?.charAt(0).toUpperCase() +
                    member?.card_id?.color?.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div
            class="flex relative w-full justify-between items-center bg-neutral-900 rounded-b-md p-4"
          >
            <p
              class="text-white border-2 border-neutral-700 flex justify-between items-center h-8 text-sm p-2 gap-2 rounded-md relative"
            >
              {selectedRole !== ''
                ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
                : memberRole?.role_name
                ? memberRole.role_name.charAt(0).toUpperCase() +
                  memberRole.role_name.slice(1)
                : 'No role'}
            </p>

            <!-- <SwitchButton
              on:change={async () => await setStatus()}
              checked={member.status}
            /> -->
          </div>
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
            {#if member?.team_member_id.team_profile.avatar === ''}
              <div
                class={`flex justify-center items-center w-32 lg:w-36 h-32 lg:h-36 rounded-md bg-neutral-700 text-5xl ${
                  $user.id === member?.team_member_id?.uid
                    ? 'border-2 border-blue-600'
                    : ''
                }`}
              >
                Q
              </div>
            {:else}
              <img
                src={member?.team_member_id.team_profile.avatar}
                alt="Profile"
                class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                  $user.id === member?.team_member_id?.uid
                    ? 'border-2 border-blue-600'
                    : ''
                }`}
              />
            {/if}
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
                {member?.team_member_id.team_profile.firstname === ''
                  ? 'No name'
                  : member?.team_member_id.team_profile.firstname}
                {member?.team_member_id.team_profile.lastname === ''
                  ? ''
                  : ' ' + member?.team_member_id.team_profile.lastname}
              </h1>
              <h2 class="text-neutral-300">
                {member?.team_member_id.team_profile.job}
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
                {#if member?.type === 'pvc'}
                  PVC
                {:else}
                  {member?.card_id?.type?.charAt(0).toUpperCase() +
                    member?.card_id?.type?.slice(1)}
                {/if}
                {member?.card_id?.color?.charAt(0).toUpperCase() +
                  member?.card_id?.color?.slice(1)}
              </p>
            </div>
          </div>
        </div>

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
                  on:click={async () =>
                    await deleteMemberHandler(
                      member?.team_member_id?.id,
                      member
                    )}
                  class="flex hover:bg-neutral-800 text-red-600 px-2 py-2 rounded-md cursor-pointer"
                >
                  Remove user
                </MenuItem>
              </MenuItems>
            </div>
          {/if}
        </Menu>

        <div
          class="flex relative w-full justify-between items-center bg-neutral-900 rounded-b-md p-4"
        >
          <Menu let:open>
            {#if permissions.readRoles}
              {#if permissions.writeRoles}
                <DropdownButton
                  class="w-60 text-sm"
                  label={selectedRole !== ''
                    ? selectedRole.charAt(0).toUpperCase() +
                      selectedRole.slice(1)
                    : memberRole?.role_name
                    ? memberRole.role_name.charAt(0).toUpperCase() +
                      memberRole.role_name.slice(1)
                    : 'No role'}
                />
              {:else}
                <p
                  class="text-white border-2 border-neutral-700 flex justify-between items-center h-8 text-sm p-2 gap-2 rounded-md relative"
                >
                  {selectedRole !== ''
                    ? selectedRole.charAt(0).toUpperCase() +
                      selectedRole.slice(1)
                    : memberRole?.role_name
                    ? memberRole.role_name.charAt(0).toUpperCase() +
                      memberRole.role_name.slice(1)
                    : 'No role'}
                </p>
              {/if}
            {/if}

            {#if open}
              <div transition:slide|local>
                <MenuItems
                  class="top-20 z-40 absolute mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md text-sm border border-neutral-700 p-2 w-64"
                >
                  {#each roles as item}
                    <MenuItem
                      class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                      on:click={async () => {
                        await setMemberRole(item.id);
                        selectRole(item.role_name);
                      }}
                    >
                      {item.role_name.charAt(0).toUpperCase() +
                        item.role_name.slice(1)}
                    </MenuItem>
                  {/each}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                    on:click={async () => {
                      await setMemberRole(roleId[0].id);
                      selectRole(roleId[0].name);
                    }}
                  >
                    Super Admin
                  </MenuItem>
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
                    on:click={async () => {
                      await setMemberRole(roleId[1].id);
                      selectRole(roleId[1].name);
                    }}
                  >
                    Member
                  </MenuItem>
                </MenuItems>
              </div>
            {/if}
          </Menu>

          <SwitchButton
            on:change={async () => await setStatus()}
            checked={member.status}
          />
        </div>
      </div>
    </div>
  {/if}
{:else}
  <div class="flex flex-col justify-between">
    <div
      class="flex flex-col justify-between w-full h-full bg-neutral-800 rounded-md"
    >
      <div class="flex h-full gap-4 p-4">
        <div
          class="flex justify-center items-center w-32 lg:w-36 h-32 lg:h-36 rounded-md bg-neutral-700 text-5xl"
        >
          Q
        </div>
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
        class="flex relative w-full h-full justify-between items-center bg-neutral-900 rounded-b-md p-4"
      />
    </div>
  </div>
{/if}
