<script>
  import MemberMenuDropdown from '@comp/buttons/memberMenuDropdown.svelte';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import MemberAnalyticsModal from '@comp/modals/memberAnalyticsModal.svelte';
  import MemberRoleDropdown from '@comp/buttons/memberRoleDropdown.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { memberData, user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import roleId from '@lib/roleConfig';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import convertToGMT7 from '@lib/utils/convertToGMT7';
  import { teamProfileTemplate } from '@lib/constants';
  import { log } from '@lib/logger/logger';
  import Cookies from 'js-cookie';

  export let permissions, deleteMember;
  export let roles = [];
  export let member, i, updatedRole, active;

  const dispatch = createEventDispatcher();
  const teamId = getContext('teamId');
  let selectedRole = '';
  let showModal = false;
  let roleID = null;
  let roleName = null;
  let isLoading = false;
  let memberProfile = member?.team_profile;
  let role = { role_name: member?.role_name, index: member?.role_id };
  let memberEmail = '';
  let showDeleteMemberModal = false;
  let connectionsCount = 0;
  let logsCount = 0;

  const setRole = (role) => dispatch('setRole', { role_name: role, index: i });
  const toggleModal = () => (showModal = !showModal);
  const toggleDeleteMemberModal = () =>
    (showDeleteMemberModal = !showDeleteMemberModal);
  const toProfileEditor = () =>
    goto(`/${$page.params.slug}/members/${member?.uid}`, {
      state: { card: member?.id },
    });

  const selectRole = (role) => (selectedRole = role);

  const setStatus = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: !member?.card_status }, { returning: 'minimal' })
      .eq('card_id', member?.card_id);

    member.card_status = !member?.card_status;

    if (error) {
      toastFailed();
      return;
    }

    if (member?.card_status) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  const getUserEmail = async (uid) => {
    if (member?.uid !== undefined) {
      const { data, error } = await supabase.functions.invoke('getUserEmail', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid,
        }),
      });
      if (error) console.log(error);
      if (data) {
        if (member?.card_id !== undefined)
          Cookies.set(member?.card_id, data.user);
        memberEmail = data.user;
      }
    }
  };

  const setMemberRole = async (id) => {
    isLoading = true;
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id }, { returning: 'minimal' })
      .eq('uid', member.uid)
      .eq('team_id', teamId);

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

  // 3bc4953a-262d-49e0-acdb-c3a09357be65

  const deleteMemberHandler = async () => {
    let card_holder = memberProfile.firstname + ' ' + memberProfile.lastname;

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
      .eq('id', member.member_id);

    if (error_member) {
      console.log(error_member);
      toastFailed();
      isLoading = false;
      return;
    } else {
      log(
        `${card_holder} has been removed from team by ${$memberData.fullName}`,
        'DANGER',
        null,
        teamId,
        $memberData.fullName,
        '',
        $memberData.id
      );
      toastSuccess('Member has been deleted');
      isLoading = false;
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

  const getLogsCount = async () => {
    if (memberProfile) {
      const { data, error, count } = await supabase
        .from('team_logs')
        .select('type', { count: 'exact' })
        .eq('team_member', member?.member_id);

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        logsCount = count;
      }
    }
  };

  onMount(async () => {
    if (!Cookies.get(member?.card_id)) {
      await getUserEmail(member?.uid);
    } else {
      memberEmail = Cookies.get(member?.card_id);
    }

    await getConnectionsCount();
    await getLogsCount();
  });

  $: if (active) if (i === updatedRole.index) selectedRole = updatedRole.role;
</script>

<ConfirmationModal
  {isLoading}
  isDispatch
  heading="Are you sure you want to change your role?"
  buttonLabel="Yes"
  {showModal}
  {toggleModal}
  on:action={async () => {
    await setMemberRole(roleID);
    selectRole(roleName);
    role = { role_name: roleName, index: roleID };

    showModal = false;
  }}
/>

<ConfirmationModal
  {isLoading}
  isDelete
  isMember
  isDispatch
  heading="Are you sure you want to delete"
  text={`${memberProfile?.firstname} ${memberProfile?.lastname}?`}
  buttonLabel="Delete"
  showModal={showDeleteMemberModal}
  toggleModal={toggleDeleteMemberModal}
  on:action={async () => {
    await deleteMemberHandler();
    await deleteMember(member.member_id);
    showDeleteMemberModal = false;
  }}
/>

{#if active}
  {#if !permissions.readMembers}
    {#if $user?.id === member.uid}
      <div
        class="flex bg-neutral-900 outline outline-1 outline-neutral-800 p-3 rounded-md h-auto gap-8 items-center"
      >
        <img
          class="hidden md:block w-16 h-16 rounded-full {$user?.id ===
          member.uid
            ? 'outline-2 outline outline-blue-600'
            : ''}"
          src={memberProfile?.avatar}
          alt={memberProfile?.firstname + ' avatar'}
        />
        <div class="flex flex-col w-full gap-2">
          <div class="flex justify-between">
            <div class="flex gap-4 text-sm">
              <h1>Card ****{member?.card_id.slice(-6)}</h1>
              <h1>
                Joined since {convertToGMT7(memberProfile?.user_change)
                  .toDateString()
                  .slice(4)}
              </h1>
            </div>
            <div class="flex gap-2 items-center">
              <MemberAnalyticsModal member={memberProfile} />
            </div>
          </div>

          <div
            class="grid grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_150px_100px_minmax(200px,_1fr)] text-sm"
          >
            <div class="flex flex-col">
              <h1 class="font-bold text-white">
                {memberProfile?.firstname ?? ''}
                {memberProfile?.lastname ?? ''}
              </h1>
              <p>{memberProfile?.job}</p>
            </div>
            <div class="hidden md:flex flex-col">
              <h1 class=" text-neutral-400">Connections</h1>
              <p>{connectionsCount}</p>
            </div>
            <div class="hidden md:flex flex-col">
              <h1 class=" text-neutral-400">Activity</h1>
              <p>{logsCount}</p>
            </div>
            <div class="hidden md:flex flex-col">
              <h1 class="text-neutral-400">Most Recent Activity</h1>

              {#if member?.log_data}
                {#if member.log_type === 'DANGER' || member.log_type === 'SUCCESS' || member.log_type === 'WARN'}
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
    {/if}
  {:else}
    <div
      class="flex md:flex-row flex-col bg-neutral-900 border border-neutral-800 p-3 rounded-md h-auto gap-8 items-center"
    >
      <img
        class="hidden md:block w-16 h-16 rounded-full {$user?.id === member.uid
          ? 'outline-2 outline outline-blue-600'
          : ''}"
        src={memberProfile?.avatar}
        alt={memberProfile?.firstname + ' avatar'}
      />

      <div class="flex flex-col w-full gap-2">
        <div class="flex justify-between items-center">
          <div class="flex justify-between w-full gap-4 md:text-sm text-xs">
            <div class="flex gap-2">
              <h1 class="lg:text-sm text-xs">
                Card ****{member?.card_id.slice(-6)}
              </h1>
              <h1 class="lg:text-sm text-xs">
                Joined since {convertToGMT7(member?.user_change)
                  .toDateString()
                  .slice(4)}
              </h1>
            </div>
            {#if permissions.writeMembers}
              <MemberMenuDropdown
                class="block md:hidden"
                on:remove={() => toggleDeleteMemberModal()}
                on:go={toProfileEditor}
              />
            {/if}
          </div>
          <div class="hidden md:flex gap-2 items-center">
            <MemberAnalyticsModal {member} />
            <button
              class="bg-white text-black text-xs rounded-md p-1 w-20"
              on:click={toProfileEditor}>Editor</button
            >
            {#if permissions.readRoles}
              <MemberRoleDropdown
                class="w-40"
                {roles}
                {role}
                {permissions}
                memberUid={member?.uid}
                selectedRole={selectedRole !== ''
                  ? selectedRole?.charAt(0).toUpperCase() +
                    selectedRole?.slice(1)
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

            {#if permissions.writeMembers}
              <SwitchButton
                mode="member"
                on:change={async () => await setStatus()}
                checked={member?.card_status}
              />

              <MemberMenuDropdown
                on:remove={() => toggleDeleteMemberModal()}
                on:go={toProfileEditor}
              />
            {/if}
          </div>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_150px_100px_minmax(200px,_1fr)] text-sm"
        >
          <div class="flex flex-col">
            <h1 class="font-bold text-white md:text-sm text-xs">
              {memberProfile?.firstname ?? ''}
              {memberProfile?.lastname ?? ''}
            </h1>
            <p>{memberProfile?.job}</p>
            <p class="text-neutral-500 text-sm">{memberEmail}</p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class=" text-neutral-400">Connections</h1>
            <p>{connectionsCount}</p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class=" text-neutral-400">Activity</h1>
            <p>{logsCount}</p>
          </div>
          <div class="hidden md:flex flex-col">
            <h1 class="text-neutral-400">Most Recent Activity</h1>

            {#if member?.log_data}
              {#if member.log_type === 'DANGER' || member.log_type === 'SUCCESS' || member.log_type === 'WARN'}
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

      <div class="block md:hidden w-full">
        <div
          class="flex justify-between md:hidden gap-1 items-center w-full mb-2"
        >
          <MemberAnalyticsModal {member} />

          {#if permissions.writeMembers}
            <SwitchButton
              mode="member"
              on:change={async () => await setStatus()}
              checked={member?.card_status}
            />
          {/if}
        </div>
        <div class="flex justify-between md:hidden gap-1 items-center w-full">
          <button
            class="bg-white text-black text-xs rounded-md p-1 w-20"
            on:click={toProfileEditor}>Editor</button
          >
          {#if permissions.readRoles}
            <MemberRoleDropdown
              class="w-28"
              {roles}
              {role}
              {permissions}
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
    </div>
  {/if}
{:else if permissions.readMembers}
  <div
    class="flex flex-col justify-between w-full h-32 md:h-24 bg-neutral-900 rounded-md outline outline-1 outline-neutral-800"
  >
    <div class="flex h-64 gap-7 p-4 items-center">
      <img
        src="/favicon.svg"
        alt="Profile"
        class="w-16 h-16 rounded-full hidden md:block"
      />
      <div class="flex flex-col gap-8 justify-between">
        <h1 class="text-neutral-300 text-sm">
          Card ****{member?.id?.slice(-6)}
        </h1>
        <div class="flex flex-col flex-wrap">
          <h1 class="text-xs md:text-sm lg:text-md text-left w-56">
            This card is <br class="block md:hidden" /> inactive
          </h1>
        </div>
      </div>
    </div>
  </div>
{/if}
