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
  export let member, i, updatedRole;

  const dispatch = createEventDispatcher();
  const teamId = getContext('teamId');
  let selectedRole = '';
  let showModal = false;
  let roleID = null;
  let roleName = null;
  let isLoading = false;
  let memberProfile = member?.team_cardcon[0]?.team_member_id;
  let role = member?.team_cardcon[0]?.team_member_id.role;
  let teamCardCon = member?.team_cardcon[0];
  let memberEmail = '';
  let showDeleteMemberModal = false;

  const setRole = (role) => dispatch('setRole', { role: role, index: i });
  const toggleModal = () => (showModal = !showModal);
  const toggleDeleteMemberModal = () =>
    (showDeleteMemberModal = !showDeleteMemberModal);
  const toProfileEditor = () =>
    goto(`/${$page.params.slug}/members/${teamCardCon?.team_member_id?.uid}`, {
      state: { card: member?.id },
    });

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

  const getUserEmail = async (uid) => {
    if (memberProfile?.uid !== undefined) {
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
        if (teamCardCon?.card_id !== undefined)
          Cookies.set(teamCardCon?.card_id, data.user);
        memberEmail = data.user;
      }
    }
  };

  const setMemberRole = async (id) => {
    isLoading = true;
    const { data, error } = await supabase
      .from('team_members')
      .update({ role: id }, { returning: 'minimal' })
      .eq('uid', memberProfile.uid)
      .eq('team_id', memberProfile.team_id);

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
    let card_holder =
      member.team_cardcon[0].team_member_id.team_profile.firstname +
      ' ' +
      member.team_cardcon[0].team_member_id.team_profile.lastname;

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
      .eq('id', member.team_cardcon[0].team_member_id.id);

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
        member.team_cardcon[0].team_member_id.team_id,
        $memberData.fullName,
        '',
        $memberData.id
      );
      toastSuccess('Member has been deleted');
      isLoading = false;
    }
  };

  const setRoleHandlers = async (idx) => {
    if ($user?.id === memberProfile.uid) {
      roleID = roleId[idx].id;
      roleName = roleId[idx].name;
      toggleModal();
    } else {
      await setMemberRole(roleId[idx].id);
      selectRole(roleId[idx].name);
    }
  };

  let connectionsCount = 0;
  let logsCount = 0;
  let recentLog = [];

  const getConnectionsCount = async () => {
    if (memberProfile) {
      const { data, error, count } = await supabase
        .from('team_connection_acc')
        .select('id', { count: 'exact' })
        .eq('by', memberProfile.id);

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
        .eq('team_member', memberProfile?.id);

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        logsCount = count;
      }
    }
  };

  const getRecentLog = async () => {
    if (memberProfile) {
      const { data, error } = await supabase
        .from('team_logs')
        .select('data, type, created_at, card_holder')
        .limit(1)
        .eq('team_member', memberProfile?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        recentLog = data;
      }
    }
  };

  onMount(async () => {
    if (!Cookies.get(teamCardCon?.card_id)) {
      await getUserEmail(memberProfile?.uid);
    } else {
      memberEmail = Cookies.get(teamCardCon?.card_id);
    }

    await getConnectionsCount();
    await getLogsCount();
    await getRecentLog();
  });

  $: if (i === updatedRole.index) selectedRole = updatedRole.role;
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
    showModal = false;
  }}
/>

<ConfirmationModal
  {isLoading}
  isDelete
  isMember
  isDispatch
  heading="Are you sure you want to delete"
  text={`${memberProfile?.team_profile?.firstname} ${memberProfile?.team_profile?.lastname}?`}
  buttonLabel="Delete"
  showModal={showDeleteMemberModal}
  toggleModal={toggleDeleteMemberModal}
  on:action={async () => {
    await deleteMemberHandler();
    await deleteMember(memberProfile.id);
    showDeleteMemberModal = false;
  }}
/>

{#if memberProfile?.uid}
  {#if !permissions.readMembers}
    {#if $user?.id === memberProfile.uid}
      <div
        class="flex bg-neutral-900 border border-neutral-800 p-3 rounded-md h-auto gap-8 items-center"
      >
        <img
          class="w-16 h-16 rounded-full"
          src={memberProfile?.team_profile?.avatar}
          alt={memberProfile?.team_profile?.firstname + ' avatar'}
        />
        <div class="flex flex-col w-full gap-2">
          <div class="flex justify-between">
            <div class="flex gap-4 text-sm">
              <h1>Card ****{member?.id.slice(-6)}</h1>
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
                {memberProfile?.team_profile?.firstname ?? ''}
                {memberProfile?.team_profile?.lastname ?? ''}
              </h1>
              <p>{memberProfile?.team_profile?.job}</p>
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-neutral-400">Connections</h1>
              <!-- <p>{member.connections.length}</p> -->
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-neutral-400">Activity</h1>
              <!-- <p>{member.team_logs.length}</p> -->
            </div>
            <div class="flex flex-col">
              <h1 class="font-semibold text-neutral-400">
                Most Recent Activity
              </h1>
              <!-- {#if member.team_logs.length > 0}
        {#if member.team_logs[0].type === 'DANGER' || member.team_logs[0].type === 'SUCCESS' || member.team_logs[0].type === 'WARN'}
          <p
            class={`${
              member.team_logs[0].type === 'DANGER'
                ? 'text-red-600'
                : member.team_logs[0].type === 'SUCCESS'
                ? 'text-green-600'
                : member.team_logs[0].type === 'WARN'
                ? 'text-yellow-600'
                : 'text-neutral-100'
            }`}
          >
            {member.team_logs[0].data.message}
          </p>
        {:else}
          <p class="text-neutral-100">
            {`${member.team_logs[0]?.card_holder ?? 'Member'}'s` +
              member.team_logs[0]?.data?.message?.slice(4)}
          </p>
        {/if}
      {:else}
        <p class="text-neutral-100">No activity yet</p>
      {/if} -->
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="flex flex-col justify-between text-sm">
        <div
          class="flex flex-col justify-between w-full h-64 bg-neutral-800 rounded-md"
        >
          <div
            class="flex cursor-pointer h-full gap-4 p-4"
            on:click={() => toProfileEditor(memberProfile.uid)}
          >
            <div class="hidden md:flex flex-row-reverse relative">
              <img
                src={memberProfile.team_profile?.avatar ?? '/favicon.svg'}
                alt="Profile"
                class={`w-32 lg:w-36 h-32 lg:h-36 rounded-md ${
                  $user.id === memberProfile.uid
                    ? 'border-2 border-blue-600'
                    : ''
                }`}
              />
              {#if $user.id === memberProfile.uid}
                <h1
                  class="absolute translate-y-24 lg:translate-y-28 w-12 font-bold bg-blue-600/60 p-1 rounded-br-md rounded-tl-md text-center"
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
                  {memberProfile.team_profile?.firstname ?? ''}
                  {memberProfile.team_profile?.lastname ?? ''
                    ? ''
                    : ' ' + memberProfile.team_profile?.lastname}
                </h1>
                <h2 class="text-neutral-300">
                  {memberProfile.team_profile?.job}
                </h2>
                <h2 class="text-neutral-300 text-xs">
                  Joined since {convertToGMT7(memberProfile.user_change)
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
      </div> -->
    {/if}
  {:else}
    <div
      class="flex bg-neutral-900 border border-neutral-800 p-3 rounded-md h-auto gap-8 items-center"
    >
      <img
        class="w-16 h-16 rounded-full {$user?.id === memberProfile.uid
          ? 'border-2 border-blue-600'
          : ''}"
        src={memberProfile?.team_profile?.avatar}
        alt={memberProfile?.team_profile?.firstname + ' avatar'}
      />
      <!-- {#if $user.id === memberProfile.uid}
        <h1
          class="absolute translate-y-24 lg:translate-y-28 w-12 font-bold bg-blue-600/60 p-1 rounded-br-md rounded-tl-md text-center"
        >
          You
        </h1>
      {/if} -->
      <div class="flex flex-col w-full gap-2">
        <div class="flex justify-between items-center">
          <div class="flex gap-4 md:text-sm text-xs">
            <h1>Card ****{member?.id.slice(-6)}</h1>
            <h1>
              Joined since {convertToGMT7(memberProfile?.user_change)
                .toDateString()
                .slice(4)}
            </h1>
          </div>
          <div class="hidden md:flex gap-2 items-center">
            <MemberAnalyticsModal member={memberProfile} />
            {#if permissions.readRoles}
              <MemberRoleDropdown
                {roles}
                {role}
                {permissions}
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
                  if ($user?.id === memberProfile.uid) {
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
                on:change={async () => await setStatus()}
                checked={teamCardCon?.status}
              />
            {/if}

            {#if permissions.writeMembers}
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
              {memberProfile?.team_profile?.firstname ?? ''}
              {memberProfile?.team_profile?.lastname ?? ''}
            </h1>
            <p>{memberProfile?.team_profile?.job}</p>
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
            {#if recentLog.length > 0}
              {#if recentLog[0].type === 'DANGER' || recentLog[0].type === 'SUCCESS' || recentLog[0].type === 'WARN'}
                <p
                  class={`${
                    recentLog[0].type === 'DANGER'
                      ? 'text-red-600'
                      : recentLog[0].type === 'SUCCESS'
                      ? 'text-green-600'
                      : recentLog[0].type === 'WARN'
                      ? 'text-yellow-600'
                      : 'text-neutral-100'
                  }`}
                >
                  {recentLog[0].data.message}
                </p>
              {:else}
                <p class="text-neutral-100">
                  {`${recentLog[0]?.card_holder ?? 'Member'}'s` +
                    recentLog[0]?.data?.message?.slice(4)}
                </p>
              {/if}
            {:else}
              <p class="text-neutral-100">No activity yet</p>
            {/if}
          </div>
        </div>
      </div>

      <div class="flex md:hidden gap-2 items-center">
        <MemberAnalyticsModal member={memberProfile} />
        {#if permissions.readRoles}
          <MemberRoleDropdown
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
              if ($user?.id === memberProfile.uid) {
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
            on:change={async () => await setStatus()}
            checked={teamCardCon?.status}
          />
        {/if}

        {#if permissions.writeMembers}
          <MemberMenuDropdown
            on:remove={() => toggleDeleteMemberModal()}
            on:go={toProfileEditor}
          />
        {/if}
      </div>
    </div>
  {/if}
{:else if permissions.readMembers}
  <div class="flex flex-col justify-between text-sm">
    <div
      class="flex flex-col justify-between w-full h-44 bg-neutral-800 rounded-md"
    >
      <div class="flex h-64 gap-4 p-4">
        <img
          src="/favicon.svg"
          alt="Profile"
          class="w-32 h-32 rounded-full hidden md:block"
        />
        <div class="flex flex-col justify-between">
          <h1 class="text-neutral-300 text-sm">
            Card ****{member?.id.slice(-6)}
          </h1>
          <div class="flex flex-col flex-wrap">
            <h1 class="md:text-md lg:text-lg text-left w-56">
              This card is <br class="block md:hidden" /> inactive
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
