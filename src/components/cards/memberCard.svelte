<script>
  import Cookies from 'js-cookie';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
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
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  export let member, isHasPermission, id, index, members, memberUid, roles;

  let statusMember = false;
  let cardId = null;
  let selectedRole = '';
  let memberRole = null;
  let teamId = Cookies.get('qubicTeamId');

  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);

  const selectRole = (role) => (selectedRole = role);

  const getMembersStatusCard = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('status, id')
      .eq('team_member_id', id);

    if (error) console.log(error);

    if (data) {
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

    console.log(stat);
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
      .eq('uid', memberUid);

    if (error) {
      toastFailed();
      return;
    } else {
      toastSuccess('Role has been updated');
    }
  };

  onMount(async () => {
    memberRole = await getMemberRole(memberUid, teamId);
  });

  $: getMembersStatusCard();
</script>

<div class="flex flex-col justify-between mx-4 z-10">
  <div
    class="flex flex-col justify-between w-full h-56 md:h-72 bg-neutral-800 p-4 z-10 rounded-md"
  >
    <div
      class="flex justify-between cursor-pointer h-full"
      on:click={() => toProfileEditor(member.uid)}
    >
      <div>
        <h1 class="text-2xl md:text-3xl lg:text-4xl">
          {member.team_profile.firstname === ''
            ? 'No name'
            : member.team_profile.firstname}
          {member.team_profile.lastname}
        </h1>
        <h2 class="text-xl md:text-2xl lg:text-3xl">
          {member.team_profile.job}
        </h2>
      </div>
      {#if member.team_profile.avatar === ''}
        <div
          class="flex justify-center items-center w-16 h-16 rounded-full bg-neutral-700 text-2xl"
        >
          Q
        </div>
      {:else}
        <img
          src="https://placeimg.com/640/480/any"
          alt="Profile"
          class="w-16 h-16 rounded-md"
        />
      {/if}
    </div>
    <!-- <div class="flex justify-between">
      <Menu let:open>
        <MenuButton
          class="text-white border-2 border-neutral-700 flex justify-around items-center w-auto h-10 px-2 py-4 gap-2 rounded-md relative "
        >
          {selectedRole !== ''
            ? selectedRole
            : memberRole?.role_name
            ? memberRole.role_name.charAt(0).toUpperCase() +
              memberRole.role_name.slice(1)
            : 'Loading...'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-5"
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
              class="bottom-12 left-2 z-40 relative rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 min-w-40"
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
      </Menu>

      <Switch
        checked={statusMember}
        on:change={async (e) => {
          await setStatus(cardId, e.detail, index);
          statusMember = e.detail;
        }}
        class={`justify-center items-center self-end relative rounded-full w-16 h-10 z-50 ${
          statusMember ? 'bg-green-600' : 'bg-neutral-600'
        } ${isHasPermission ? 'flex' : 'hidden'}`}
      >
        <span
          class={`inline-block w-8 h-8 bg-white rounded-full transition-transform duration-300 ease-in-out ${
            statusMember ? 'translate-x-3' : '-translate-x-3 '
          }`}
          class:toggle-on={statusMember}
          class:toggle-off={!statusMember}
        />
      </Switch>
    </div> -->
    <Switch
      checked={statusMember}
      on:change={async (e) => {
        await setStatus(cardId, e.detail, index);
        statusMember = e.detail;
      }}
      class={`justify-center items-center self-end relative rounded-full w-16 h-10 z-50 ${
        statusMember ? 'bg-green-600' : 'bg-neutral-600'
      } ${isHasPermission ? 'flex' : 'hidden'}`}
    >
      <span
        class={`inline-block w-8 h-8 bg-white rounded-full transition-transform duration-300 ease-in-out ${
          statusMember ? 'translate-x-3' : '-translate-x-3 '
        }`}
        class:toggle-on={statusMember}
        class:toggle-off={!statusMember}
      />
    </Switch>

    <Menu let:open>
      <MenuButton
        class="text-white border-2 border-neutral-700 flex justify-around items-center w-auto h-10 px-2 py-4 gap-2 rounded-md absolute"
      >
        {selectedRole !== ''
          ? selectedRole
          : memberRole?.role_name
          ? memberRole.role_name.charAt(0).toUpperCase() +
            memberRole.role_name.slice(1)
          : 'Loading...'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-5"
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
            class="bottom-12 left-2 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 min-w-40"
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
    </Menu>
  </div>
</div>
