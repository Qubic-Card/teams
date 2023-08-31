<script>
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import MemberAnalyticsModal from '@comp/modals/memberAnalyticsModal.svelte';
  import MemberRoleDropdown from '@comp/buttons/memberRoleDropdown.svelte';
  import setHours4Digit from '@lib/utils/setHour4Digit';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { memberData, user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import roleId from '@lib/roleConfig';
  import { createEventDispatcher, onMount } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import { log } from '@lib/logger/logger';
  import { teamData } from '@lib/stores/teamStore';

  export let permissions, deleteMember;
  export let roles = [];
  export let member, i, updatedRole, active;

  const dispatch = createEventDispatcher();

  let selectedRole = '';
  let showModal = false;
  let roleID = null;
  let roleName = null;
  let isLoading = false;
  let memberProfile = member?.team_profile;
  let role = { role_name: member?.role_name, index: member?.role_id };
  let showDeleteMemberModal = false;
  let connectionsCount = 0;

  const setRole = (role) => dispatch('setRole', { role_name: role, index: i });
  const toggleModal = () => (showModal = !showModal);

  const toggleDeleteMemberModal = () =>
    (showDeleteMemberModal = !showDeleteMemberModal);
  const toProfileEditor = () =>
    goto(`/${$page.params.slug}/members/${member?.uid}`, {
      state: { card: member?.card_id },
    });

  const selectRole = (role) => (selectedRole = role);

  const setMemberRole = async (id) => {
    isLoading = true;
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id })
      .eq('uid', member.uid)
      .eq('team_id', $page.params.slug)
      .select();

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

  const checkTeamCardCon = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('id')
      .eq('team_member_id', member.member_id);

    if (error) {
      return false;
    }
    if (data) {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const deleteMemberHandler = async () => {
    isLoading = true;
    const { error: error_member } = await supabase
      .from('team_members')
      .delete()
      .eq('id', member.member_id);
    if (error_member) {
      console.log(error_member);
      toastFailed();
      isLoading = false;
      return;
    } else {
      await log(
        `${member.email} has been removed from team by ${$memberData.fullName}`,
        'DANGER',
        null,
        $page.params.slug,
        $memberData.fullName,
        '',
        $memberData.id
      );
      toastSuccess('Member has been deleted');
      isLoading = false;
      return;
    }
  };

  const setRoleHandlers = async (idx) => {
    if ($user?.id === member.uid) {
      roleID = roleId[idx].id;
      roleName = roleId[idx].name;
      toggleModal();
    } else {
      await setMemberRole(roleId[idx].id);
      selectRole(roleId[idx].name);
    }
  };

  const getConnectionsCount = async () => {
    if (memberProfile) {
      const { data, error, count } = await supabase
        .from('team_connection_acc')
        .select('id', { count: 'exact' })
        .eq('by', member?.member_id);

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        connectionsCount = count;
      }
    }
  };

  onMount(async () => {
    await getConnectionsCount();
  });

  $: if (active) if (i === updatedRole.index) selectedRole = updatedRole.role;
</script>

<ConfirmationModal
  {isLoading}
  {showModal}
  {toggleModal}
  buttonLabel="Yes"
  on:action={async () => {
    await setMemberRole(roleID);
    selectRole(roleName);
    role = { role_name: roleName, index: roleID };

    showModal = false;
  }}
>
  <slot slot="title">
    <h1 class="font-semibold">Change role</h1>
  </slot>
  <slot slot="text">
    <p>
      Are you sure you want to change <br />
      {memberProfile?.firstname}'s role?
    </p>
  </slot>
</ConfirmationModal>

<ConfirmationModal
  showModal={showDeleteMemberModal}
  toggleModal={toggleDeleteMemberModal}
  buttonLabel="Remove"
  {isLoading}
  on:action={async () => {
    if (await checkTeamCardCon()) {
      toastFailed('Member has a card connection, please disconnect first');
    } else {
      await deleteMemberHandler();
      await deleteMember(member.member_id);
    }
    showDeleteMemberModal = false;
  }}
>
  <slot slot="title">
    <h1 class="font-semibold">Remove user</h1>
  </slot>
  <slot slot="text">
    <div class="flex flex-col gap-4">
      <p>
        Are you sure you want to remove <br />
        <span class="font-semibold">
          {memberProfile?.firstname}
          {memberProfile?.lastname}
        </span>
        from
        <span class="font-semibold">
          {$teamData.name}
        </span> team?
      </p>
      <p>
        <span class="font-semibold">WARNING!</span> All data from this user will
        be deleted. <br /> Please consider backing up the data before removing.
      </p>
    </div>
  </slot>
</ConfirmationModal>

{#if !permissions.readMembers}
  {#if $user?.id === member.uid}
    <div
      class="flex bg-neutral-900 outline outline-1 outline-neutral-800 p-3 rounded-md h-auto gap-8 items-center rounded-custom {$user?.id ===
      member.uid
        ? 'outline-blue-600'
        : 'outline-neutral-800'}"
    >
      {#if memberProfile?.avatar === ''}
        <img
          class="hidden md:block w-16 h-16 bg-black rounded-full"
          src="/favicon.svg"
          alt={memberProfile?.firstname + ' avatar'}
        />
      {:else}
        <img
          class="hidden md:block w-16 h-16 rounded-full"
          src={memberProfile?.avatar}
          alt={memberProfile?.firstname + ' avatar'}
        />
      {/if}

      <div class="flex flex-col w-full gap-2">
        <div class="flex justify-between">
          <div class="flex gap-4 text-sm">
            <h1 class="font-semibold text-white">
              {memberProfile?.firstname ?? ''}
              {memberProfile?.lastname ?? ''}
            </h1>
          </div>
          <div class="flex gap-2 items-center">
            <MemberAnalyticsModal {member} isRounded />
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_100px_150px_minmax(200px,_1fr)] gap-2 text-sm"
        >
          <div class="flex flex-col">
            <p>{memberProfile?.job}</p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class=" text-neutral-400">Connections</h1>
            <p>{connectionsCount}</p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class=" text-neutral-400">Last Activity</h1>
            <p class="break-all">
              {convertToGMT7(member.logged_at)
                .toDateString()
                .slice(4)
                .split(' ')
                .splice(0, 2)
                .reverse()
                .join(' ')}
              {convertToGMT7(member.logged_at).getFullYear()} -
              {setHours4Digit(
                convertToGMT7(member.logged_at).getHours(),
                convertToGMT7(member.logged_at).getMinutes()
              )}
            </p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class="text-neutral-400">Most Recent Activity</h1>

            {#if member?.log_data}
              {#if member.log_type === 'SUCCESS' || member.log_type === 'WARN'}
                <p
                  class="break-all {member.log_type === 'DANGER'
                    ? 'text-red-600'
                    : member.log_type === 'SUCCESS'
                    ? 'text-green-600'
                    : member.log_type === 'WARN'
                    ? 'text-yellow-600'
                    : 'text-neutral-100'}"
                >
                  {member.log_data.message}
                </p>
              {:else if member.log_type === 'DANGER'}
                {#if member?.log_data?.message.includes(member.email) && member?.uid === $user?.id}
                  <p class="break-all text-red-600">
                    You {member?.log_data?.message
                      .split(' ')
                      .slice(1)
                      .join(' ')}
                  </p>
                {:else}
                  <p class="break-all text-red-600">
                    {member.log_data.message}
                  </p>
                {/if}
              {:else}
                <p class="text-neutral-100 break-all">
                  {`${member?.card_holder ?? 'Member'}'s` +
                    member?.log_data?.message?.slice(4)}
                </p>
              {/if}
            {:else}
              <p class="text-neutral-100">No activity</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
    {#if $user?.id === member.uid}
      <h1
        class="hidden md:block absolute rounded-br-md rounded-tl-md text-xs font-semibold bg-blue-600 p-[3px]"
      >
        You
      </h1>
    {/if}
  {/if}
{:else}
  <div
    class="flex md:flex-row flex-col bg-neutral-900 outline outline-1 {$user?.id ===
    member.uid
      ? 'outline-blue-600'
      : 'outline-neutral-800'} p-3 rounded-md h-auto gap-8 items-center rounded-custom"
  >
    {#if memberProfile?.avatar === ''}
      <img
        class="hidden md:block bg-black w-16 h-16 rounded-full"
        src="/favicon.svg"
        alt={memberProfile?.firstname + ' avatar'}
      />
    {:else}
      <img
        class="hidden md:block w-16 h-16 rounded-full"
        src={memberProfile?.avatar}
        alt={memberProfile?.firstname + ' avatar'}
      />
    {/if}

    <div class="flex flex-col w-full gap-2">
      <div class="flex justify-between items-center">
        <div class="flex justify-between w-full gap-4 md:text-sm text-xs">
          <div class="flex gap-2">
            <h1 class="font-semibold text-white md:text-sm text-xs">
              {memberProfile?.firstname ?? ''}
              {memberProfile?.lastname ?? ''}
            </h1>
          </div>
        </div>
        <div
          class="hidden md:flex items-center divide-x-2 divide-neutral-700 outline outline-1 outline-neutral-700 rounded-l-md rounded-r-md"
        >
          <button
            class="bg-blue-600 text-white text-xs p-1 w-20 rounded-l-md"
            on:click={toProfileEditor}>Editor</button
          >
          <MemberAnalyticsModal {member} />
          {#if permissions.readRoles}
            <MemberRoleDropdown
              class="w-40"
              {roles}
              {role}
              {permissions}
              memberUid={member?.uid}
              selectedRole={selectedRole !== ''
                ? selectedRole?.charAt(0).toUpperCase() + selectedRole?.slice(1)
                : role?.role_name
                ? role?.role_name?.charAt(0).toUpperCase() +
                  role?.role_name?.slice(1)
                : 'No role'}
              on:selectSuperAdmin={async () => await setRoleHandlers(0)}
              on:selectMember={async () => await setRoleHandlers(1)}
              on:selectOthers={async (e) => {
                if ($user?.id === member.uid) {
                  roleID = e.detail.id;
                  roleName = e.detail.role_name;
                  toggleModal();
                } else {
                  await setMemberRole(e.detail.id);
                  // selectRole(e.detail.role_name);
                  setRole(e.detail.role_name);
                }
              }}
            />
          {/if}
        </div>
        {#if permissions.writeMembers}
          {#if member.uid !== $user?.id}
            <button
              class="outline outline-1 outline-neutral-700 p-1 rounded-md ml-2 cursor-pointer"
              on:click={toggleDeleteMemberModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ef4444"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          {/if}
        {/if}
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_100px_150px_minmax(200px,_1fr)] gap-2 text-sm"
      >
        <div class="flex flex-col">
          <p>{memberProfile?.job}</p>
          <p class="break-all text-neutral-400">
            Joined since {convertToGMT7(member.user_change)
              .toDateString()
              .slice(4)}
          </p>
          <p class="break-all text-neutral-400">
            {member.email}
          </p>
        </div>
        <div class="hidden md:flex flex-col">
          <h1 class=" text-neutral-400">Connections</h1>
          <p class="break-all">{connectionsCount}</p>
        </div>
        <div class="hidden md:flex flex-col">
          <h1 class=" text-neutral-400">Last Activity</h1>

          <p class="break-all">
            {convertToGMT7(member.logged_at)
              .toDateString()
              .slice(4)
              .split(' ')
              .splice(0, 2)
              .reverse()
              .join(' ')}
            {convertToGMT7(member.logged_at).getFullYear()}
            - {setHours4Digit(
              convertToGMT7(member.logged_at).getHours(),
              convertToGMT7(member.logged_at).getMinutes()
            )}
          </p>
        </div>
        <div class="hidden md:flex flex-col">
          <h1 class="text-neutral-400">Most Recent Activity</h1>

          {#if member?.log_data}
            {#if member.log_type === 'SUCCESS' || member.log_type === 'WARN'}
              <p
                class="break-all {member.log_type === 'DANGER'
                  ? 'text-red-600'
                  : member.log_type === 'SUCCESS'
                  ? 'text-green-600'
                  : member.log_type === 'WARN'
                  ? 'text-yellow-600'
                  : 'text-neutral-100'}"
              >
                {member.log_data.message}
              </p>
            {:else if member.log_type === 'DANGER'}
              {#if member?.log_data?.message.includes(member.email) && member?.uid === $user?.id}
                <p class="break-all text-red-600">
                  You {member?.log_data?.message.split(' ').slice(1).join(' ')}
                </p>
              {:else}
                <p class="break-all text-red-600">
                  {member.log_data.message}
                </p>
              {/if}
            {:else}
              <p class="text-neutral-100 break-all">
                {`${member?.card_holder ?? 'Member'}'s` +
                  member?.log_data?.message?.slice(4)}
              </p>
            {/if}
          {:else}
            <p class="text-neutral-100">No activity</p>
          {/if}
        </div>
      </div>
    </div>

    <div
      class="flex md:hidden items-center w-auto divide-x-2 divide-neutral-700 outline outline-1 outline-neutral-700 rounded-l-md rounded-r-md"
    >
      <button
        class="bg-blue-600 text-white text-xs p-1 w-20 rounded-l-md"
        on:click={toProfileEditor}>Editor</button
      >
      <MemberAnalyticsModal {member} />
      {#if permissions.readRoles}
        <MemberRoleDropdown
          class="w-28"
          {roles}
          {role}
          {permissions}
          memberUid={member?.uid}
          selectedRole={selectedRole !== ''
            ? selectedRole?.charAt(0).toUpperCase() + selectedRole?.slice(1)
            : role?.role_name
            ? role?.role_name?.charAt(0).toUpperCase() +
              role?.role_name?.slice(1)
            : 'No role'}
          on:selectSuperAdmin={async () => await setRoleHandlers(0)}
          on:selectMember={async () => await setRoleHandlers(1)}
          on:selectOthers={async (e) => {
            if ($user?.id === member.uid) {
              roleID = e.detail.id;
              roleName = e.detail.role_name;
              toggleModal();
            } else {
              await setMemberRole(e.detail.id);
              // selectRole(e.detail.role_name);
              setRole(e.detail.role_name);
            }
          }}
        />
      {/if}
    </div>
  </div>
  {#if $user?.id === member.uid}
    <h1
      class="hidden md:block absolute rounded-br-md rounded-tl-md text-xs font-semibold bg-blue-600 p-[3px]"
    >
      You
    </h1>
  {/if}
{/if}

<style>
  .rounded-custom {
    border-radius: 0.375rem !important;
    -webkit-border-radius: 0.375rem !important;
    -moz-border-radius: 0.375rem !important;
  }
</style>
