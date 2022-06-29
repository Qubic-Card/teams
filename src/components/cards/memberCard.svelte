<script>
  import Cookies from 'js-cookie';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { slide, fly } from 'svelte/transition';
  import supabase from '@lib/db';
  import {
    getAllRoleByTeam,
    getMemberRole,
    getRoleMapsByProfile,
  } from '@lib/query/getRoleMaps';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import {
    Switch,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';

  export let member, isHasPermission, id, index, members, memberUid, roles;

  let statusMember = false;
  let cardId = null;
  let card = null;
  let selectedRole = '';
  let memberRole = null;
  let teamId = Cookies.get('qubicTeamId');
  let roleName;

  const getMemberRoleName = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(role_name)')
      .eq('uid', $user?.id)
      .eq('team_id', teamId);

    if (error) console.log(error);
    if (data) {
      roleName = data[0].role.role_name;
    }
  };
  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);

  const selectRole = (role) => (selectedRole = role);

  const getMembersStatusCard = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('status, id, card_id(*)')
      .eq('team_member_id', id);

    if (error) console.log(error);

    if (data) {
      card = data[0].card_id;
      statusMember = data[0].status;
      cardId = data[0].id;
    }
  };

  const setStatus = async (id, stat, index) => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: stat }, { returning: 'minimal' })
      .eq('id', id);

    members[index].status = !members[index].status;

    if (error) {
      toastFailed();
      return;
    }

    if (stat) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  const setMemberRole = async (id) => {
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id }, { returning: 'minimal' })
      .eq('uid', memberUid)
      .eq('team_id', teamId);

    if (error) {
      toastFailed();
      return;
    } else {
      toastSuccess('Role has been updated');
    }
  };

  const deleteMemberHandler = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      toastFailed();
      return;
    } else {
      toastSuccess('Member has been deleted');
      goto(`/${$page.params.slug}/members`);
    }
  };

  onMount(async () => {
    memberRole = await getMemberRole(memberUid, teamId);
  });

  $: getMembersStatusCard(), getMemberRoleName();
</script>

<div class="flex flex-col justify-between">
  <div
    class="flex flex-col justify-between w-full h-56 md:h-80 bg-neutral-800 p-4 rounded-md"
  >
    <div
      class="flex cursor-pointer h-full gap-4"
      on:click={() => toProfileEditor(member.uid)}
    >
      {#if member.team_profile.avatar === ''}
        <div
          class="flex justify-center items-center w-24 h-24 rounded-full bg-neutral-700 text-2xl"
        >
          Q
        </div>
      {:else}
        <img
          src="https://placeimg.com/640/480/any"
          alt="Profile"
          class="w-40 h-40 rounded-md"
        />
      {/if}
      <div>
        <h1 class="text-xl flex-grow text-left md:text-2xl lg:text-3xl">
          {member.team_profile.firstname === ''
            ? 'No name'
            : member.team_profile.firstname}
        </h1>
        <h1 class="text-xl flex-grow text-left md:text-2xl lg:text-3xl">
          {member.team_profile.lastname}
        </h1>
        <h2 class="text-neutral-300 mt-2">
          {member.team_profile.job}
        </h2>
        <h2 class="text-neutral-300">
          Joined since {new Date(member.member_from).toDateString().slice(4)}
        </h2>
        <h2 class="text-neutral-300 mt-3">Card:</h2>
        <p class="text-neutral-300">
          {card?.type.charAt(0).toUpperCase() + card?.type.slice(1)}
          {card?.color.charAt(0).toUpperCase() + card?.color.slice(1) ?? '-'}
        </p>
      </div>
    </div>

    <Menu class="absolute hidden flex-row-reverse self-end" let:open>
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
            class="top-0 left-72 z-50 relative mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-64"
          >
            <MenuItem
              class="flex hover:bg-neutral-800 text-red-600 px-2 py-2 rounded-md"
              on:click={deleteMemberHandler}
            >
              Remove user
            </MenuItem>
          </MenuItems>
        </div>
      {/if}
    </Menu>

    <Switch
      checked={statusMember}
      on:change={async (e) => {
        await setStatus(cardId, e.detail, index);
        statusMember = e.detail;
      }}
      class={`justify-center items-center self-end relative rounded-lg w-16 h-10 z-50 ${
        statusMember ? 'bg-green-300' : 'bg-neutral-600'
      } ${isHasPermission && roleName === 'admin' ? 'flex' : 'hidden'}`}
    >
      <span
        class={`inline-block w-7 h-7 bg-white rounded-full transition-transform duration-300 ease-in-out ${
          statusMember ? 'translate-x-3' : '-translate-x-3 '
        }`}
        class:toggle-on={statusMember}
        class:toggle-off={!statusMember}
      />
    </Switch>

    <Menu
      class="absolute translate-y-[140px] md:translate-y-[233px] mt-3 block"
      let:open
    >
      {#if roleName === 'admin'}
        <DropdownButton
          class="w-auto"
          label={selectedRole !== ''
            ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
            : memberRole?.role_name
            ? memberRole.role_name.charAt(0).toUpperCase() +
              memberRole.role_name.slice(1)
            : 'Loading...'}
        />
      {:else}
        <p
          class="text-white border-2 border-neutral-700 flex justify-between items-center h-12 p-2 gap-2 rounded-md relative"
        >
          {selectedRole !== ''
            ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
            : memberRole?.role_name
            ? memberRole.role_name.charAt(0).toUpperCase() +
              memberRole.role_name.slice(1)
            : 'Loading...'}
        </p>
      {/if}

      {#if roleName === 'admin'}
        {#if open}
          <div transition:slide|local>
            <MenuItems
              class="top-2 z-40 relative mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-64"
            >
              {#each roles as item}
                <MenuItem
                  class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                  on:click={async () => {
                    await setMemberRole(item.id);
                    selectRole(item.role_name);
                  }}
                >
                  {item.role_name}
                </MenuItem>
              {/each}
            </MenuItems>
          </div>
        {/if}
      {/if}
    </Menu>
  </div>
</div>
