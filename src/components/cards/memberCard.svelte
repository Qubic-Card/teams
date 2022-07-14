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
  import { cardImage } from '@lib/constants';

  export let member,
    permissions,
    id,
    index,
    members,
    cards,
    memberUid,
    roles,
    deleteMemberFromUI;
  export let card;
  $: console.log(card);
  let statusMember = false;
  let cardId = null;
  // let card = null;
  let selectedRole = '';
  let memberRole = null;
  let teamId = Cookies.get('qubicTeamId');
  let roleName;
  let isActivated = false;
  let memberData;
  const checkIsCardHasBeenActivated = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('card_id, status, team_member_id(*)')
      .eq('card_id', card.id);

    if (error) console.log(error);
    if (data) {
      if (data.length > 0) {
        // console.log('true');
        isActivated = true;
        memberData = data[0].team_member_id;
        statusMember = data[0].status;
      } else {
        isActivated = false;
      }
      console.log(data);
    }
  };

  const getMemberRoleName = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(role_name)')
      .eq('uid', $user?.id)
      .eq('team_id', memberData?.team_id);

    if (error) console.log(error);
    if (data) {
      roleName = data[0].role.role_name;
    }
  };

  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);

  const selectRole = (role) => (selectedRole = role);

  const setStatus = async (id, stat, index) => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: stat }, { returning: 'minimal' })
      .eq('card_id', id);

    cards[index].status = !cards[index].status;

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
      .eq('uid', memberData?.uid)
      .eq('team_id', memberData?.team_id);

    if (error) {
      console.log(error);
      toastFailed();
      return;
    } else {
      toastSuccess('Role has been updated');
    }
  };
  // c8580595-2a92-487a-8756-2ab437c29759
  const deleteMemberHandler = async () => {
    const { error } = await supabase
      .from('team_cardcon')
      .delete()
      .eq('team_member_id', id);

    const { error: error_member } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      toastFailed();
      return;
    } else if (error_member) {
      toastFailed();
      return;
    } else {
      deleteMemberFromUI(id);
      toastSuccess('Member has been deleted');
    }
  };
  const getMembersRole = async (uid, teamId) => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(role_name, id)')
      .eq('uid', memberData?.uid)
      .eq('team_id', memberData?.team_id);

    if (error) console.log(error);

    if (data) {
      memberRole = data[0].role;
    }
  };

  $: statusMember, checkIsCardHasBeenActivated();
  $: if (isActivated) {
    getMemberRoleName(), getMembersRole();
  }
</script>

{#if isActivated}
  <div class="flex flex-col justify-between">
    <div
      class="flex flex-col justify-between w-full h-56 md:h-80 bg-neutral-800 rounded-md"
    >
      <div
        class="flex cursor-pointer h-full gap-4 p-4"
        on:click={() => toProfileEditor(memberData?.uid)}
      >
        {#if memberData?.team_profile?.avatar === ''}
          <div
            class="flex justify-center items-center w-32 lg:w-36 h-32 lg:h-36 rounded-md bg-neutral-700 text-5xl"
          >
            Q
          </div>
        {:else}
          <img
            src={memberData?.team_profile?.avatar}
            alt="Profile"
            class="w-32 lg:w-36 h-32 lg:h-36 rounded-md"
          />
        {/if}
        <div class="flex flex-col justify-between">
          <div class="flex flex-col flex-wrap">
            <h1 class="md:text-lg lg:text-xl text-left w-56">
              {memberData?.team_profile?.firstname === ''
                ? 'No name'
                : memberData?.team_profile?.firstname}
              {memberData?.team_profile?.lastname === ''
                ? ''
                : ' ' + memberData?.team_profile?.lastname}
            </h1>
            <h2 class="text-neutral-300 text-md">
              {memberData?.team_profile?.job}
            </h2>
            <h2 class="text-neutral-300 text-md">
              Joined since {new Date(memberData?.member_from)
                .toDateString()
                .slice(4)}
            </h2>
          </div>
          <div>
            <h2 class="text-neutral-300 mt-3">Card:</h2>
            <p class="text-neutral-300">
              {#if card}
                {card?.type?.charAt(0).toUpperCase() + card?.type?.slice(1)}
                {card?.color?.charAt(0).toUpperCase() + card?.color?.slice(1)}
              {:else}
                <span>No card found</span>
              {/if}
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
                class="flex hover:bg-neutral-800 text-red-600 px-2 py-2 rounded-md cursor-pointer"
                on:click={deleteMemberHandler}
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
                class="w-auto"
                label={selectedRole !== ''
                  ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
                  : memberRole?.role_name
                  ? memberRole.role_name.charAt(0).toUpperCase() +
                    memberRole.role_name.slice(1)
                  : 'No role'}
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
                  : 'No role'}
              </p>
            {/if}
          {/if}

          {#if open}
            <div transition:slide|local>
              <MenuItems
                class="top-20 z-40 absolute mb-20 rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-64"
              >
                {#each roles as item}
                  <MenuItem
                    class="flex hover:bg-neutral-700 px-2 py-2 rounded-md cursor-pointer"
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
            await setStatus(card.id, e.detail, index);
            statusMember = e.detail;
          }}
          class={`justify-center items-center relative rounded-lg w-16 h-10 z-50 ${
            statusMember ? 'bg-green-300' : 'bg-neutral-600'
          } flex`}
        >
          <span
            class={`inline-block w-7 h-7 bg-white rounded-full transition-transform duration-300 ease-in-out ${
              statusMember ? 'translate-x-3' : '-translate-x-3'
            }`}
            class:toggle-on={statusMember}
            class:toggle-off={!statusMember}
          />
        </Switch>
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col justify-between">
    <div
      class="flex flex-col justify-between w-full h-56 md:h-80 bg-neutral-800 rounded-md"
    >
      <div
        class="flex cursor-pointer h-full gap-4 p-4"
        on:click={() => toProfileEditor(memberData?.uid)}
      >
        <div
          class="flex justify-center items-center w-32 lg:w-36 h-32 lg:h-36 rounded-md bg-neutral-700 text-5xl"
        >
          Q
        </div>
        <div class="flex flex-col justify-between">
          <div class="flex flex-col flex-wrap">
            <h1 class="md:text-lg lg:text-xl text-left w-56">
              This card not activated yet
            </h1>
          </div>
          <div>
            <h2 class="text-neutral-300 mt-3">Card:</h2>
            <p class="text-neutral-300">
              {#if card}
                {card?.type?.charAt(0).toUpperCase() + card?.type?.slice(1)}
                {card?.color?.charAt(0).toUpperCase() + card?.color?.slice(1)}
              {:else}
                <span>No card found</span>
              {/if}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex relative w-full h-24 justify-between items-center bg-neutral-900 rounded-b-md p-4"
      />
    </div>
  </div>
{/if}
