<script>
  import Profile from '@pages/profile.svelte';
  import {
    socials,
    links,
    teamSocials,
    teamLinks,
    isDisplayPersonal,
  } from '@lib/stores/editorStore';
  import EditorSkeleton from '@comp/skeleton/editorSkeleton.svelte';
  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import { page } from '$app/stores';
  import TeamEditor from '@pages/teamEditor.svelte';
  import PersonalEditor from '@pages/personalEditor.svelte';
  import { profileData, teamData } from '@lib/stores/profileData';
  import { selectedTab } from '@lib/stores/selectedTab';
  import { getContext } from 'svelte';

  let permissions = {
    writeProfile: false,
    writeTeam: false,
    writeMembers: false,
    ReadTeam: false,
    will_expire: false,
  };
  const teamId = getContext('teamId');
  let isCheckRoleDone = false;
  let isTeamInactive = false;
  let memberId = null;
  let member = {
    email: null,
    isDone: false,
    isActivated: false,
  };
  let companyNickname;

  $: $userData?.filter((item) => {
    if ($page.params.slug === $user?.id) {
      if (item === 'allow_write_profile') {
        permissions.writeProfile = true;
      } else if (item === 'allow_write_team') {
        permissions.writeTeam = true;
      }
      isCheckRoleDone = true;
    } else if (item === 'allow_write_members') {
      permissions.writeMembers = true;
      isCheckRoleDone = true;
    } else if (item === 'allow_write_team') {
      permissions.writeTeam = true;
      isCheckRoleDone = true;
    }

    if (item === 'allow_read_team') {
      permissions.readTeam = true;
      isCheckRoleDone = true;
    }

    if (item === 'will_expired') permissions.will_expire = true;
  });

  const checkIsConfirmedEmail = async (uid) => {
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
      member.email = data.user;

      if (data.isActivated) {
        member.isActivated = true;
      } else {
        member.isActivated = false;
        member.isDone = true;
      }
    }
  };

  const getTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId);

    if (error) console.log(error);
    if (data) {
      const teamProfile = data[0]['metadata'];
      $teamData = { ...teamProfile };
      $teamSocials = teamProfile['socials'];
      $teamLinks = teamProfile['links'];
      companyNickname = data[0]['nickname'];

      $teamSocials.map((social) => {
        if (social.type === 'phone') $teamData.phone = social.data;
        if (social.type === 'email') $teamData.email = social.data;
      });
      return data;
    }
  };

  const getProfile = async () => {
    let { data, error } = await supabase
      .from('team_members')
      .select(
        'team_profile, uid, team_id, id, team_cardcon!inner(display_personal)'
      )
      .eq('uid', $page.params.slug)
      .eq('team_id', teamId);

    if (data) {
      const profile = data[0]['team_profile'];
      $profileData = { ...profile };
      $socials = profile['socials'];
      $links = profile['links'];
      member.uid = data[0]['uid'];
      await checkIsConfirmedEmail(data[0]['uid']);

      $isDisplayPersonal = data[0].team_cardcon[0].display_personal;
      if (!data[0].team_cardcon[0].display_personal) $selectedTab = 'team';
    }
    if (error) console.log(error);

    return data;
  };
</script>

{#await (getProfile(), getTeams())}
  <EditorSkeleton />
{:then}
  {#if permissions.will_expire === false}
    {#if isCheckRoleDone}
      {#if $page.params.slug === $user?.id}
        {#if !permissions.writeProfile && $selectedTab === 'personal'}
          <div
            class="flex justify-center bg-blue-600 text-white pl-20 text-sm p-2"
          >
            You don't have permission to edit your profile
          </div>
        {:else if !permissions.writeTeam && $selectedTab === 'team'}
          <div
            class="flex justify-center bg-blue-600 text-white pl-20 text-sm p-2"
          >
            You dont have permission to edit this team's profile
          </div>
        {/if}
      {:else if !permissions.writeMembers && $selectedTab === 'personal'}
        <div
          class="flex justify-center bg-blue-600 text-white pl-20 text-sm p-2"
        >
          You don't have permission to edit this member's profile
        </div>
      {:else if !permissions.writeTeam && $selectedTab === 'team'}
        <div
          class="flex justify-center bg-blue-600 text-white pl-20 text-sm p-2"
        >
          You dont have permission to edit this team's profile
        </div>
      {/if}
    {/if}
  {/if}

  <div class="min-h-screen flex justify-center pl-12">
    <div class="md:px-20 px-4 w-full bg-black">
      <div class="grid grid-cols-2 gap-2 text-black mt-8">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          {#if permissions.readTeam}
            {#if $isDisplayPersonal}
              <div class="flex mb-4">
                <button
                  on:click={() => ($selectedTab = 'personal')}
                  class={`${
                    $selectedTab === 'personal'
                      ? 'border-b-2 border-white'
                      : 'border-b-2 border-neutral-700'
                  } text-xs md:text-sm p-2 w-1/2 text-white`}>Personal</button
                >
                <button
                  on:click={() => ($selectedTab = 'team')}
                  class={`${
                    $selectedTab === 'team'
                      ? 'border-b-2 border-white'
                      : 'border-b-2 border-neutral-700'
                  } text-xs md:text-sm p-2 w-1/2 text-white`}>Team</button
                >
              </div>
              {#if member.isDone}
                {#if !member.isActivated && $selectedTab === 'personal'}
                  <div
                    class="flex justify-between bg-yellow-600/70 border border-yellow-400 text-white p-2 text-sm mb-2"
                  >
                    <p>
                      Warning! The member you are about to edit hasn't confirmed
                      his/her email. <strong>
                        {member.email}
                      </strong>
                    </p>
                  </div>
                {/if}
              {/if}
            {/if}

            {#if $selectedTab === 'personal'}
              <PersonalEditor {permissions} {isTeamInactive} />
            {:else}
              <TeamEditor {permissions} {isTeamInactive} {memberId} />
            {/if}
          {:else if !permissions.readTeam}
            <PersonalEditor {permissions} {isTeamInactive} />
          {/if}
        </div>
        <div
          class="md:col-span-1 col-span-2 max-w-md w-full mx-auto h-screen overflow-y-scroll mb-10"
        >
          <Profile
            {selectedTab}
            class="min-h-screen"
            isEditorMode={true}
            data={$profileData}
            {teamId}
            {companyNickname}
          />
        </div>
      </div>
    </div>
  </div>
{:catch}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}

<style global>
  @import 'filepond/dist/filepond.css';
  @import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(218, 218, 218);
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(163, 163, 163);
  }
</style>
