<script>
  import Profile from '@pages/profile.svelte';
  import { socials, links } from '@lib/stores/editorStore';
  import { go } from '@lib/utils/forwarder';
  import ProfileEditorSkeleton from '@comp/skeleton/profileEditorSkeleton.svelte';

  import supabase from '@lib/db';
  import { user, userData } from '@lib/stores/userStore';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import { page } from '$app/stores';
  import Cookies from 'js-cookie';
  import TeamEditor from '@pages/teamEditor.svelte';
  import PersonalEditor from '@pages/personalEditor.svelte';

  let teamIdCookies = Cookies.get('qubicTeamId');
  let isHasWriteProfilePermission = false;
  let isHasWriteMembersPermission = false;
  let isHasReadTeamPermission = false;
  let isHasWriteTeamPermission = false;

  let profileData = {
    firstname: '',
    lastname: '',
    job: '',
    company: '',
    avatar: '',
    socials: $socials,
    links: $links,
    design: {
      theme: 'dark',
      background: '',
    },
  };
  let profileId = null;
  let teamId = null;
  let message = '';
  let isTeamTab = false;

  const getProfile = async () => {
    let { data, error } = await supabase
      .from('team_members')
      .select('team_profile, uid, team_id')
      .eq('uid', $page.params.slug);

    if (data) {
      const profile = data[0]['team_profile'];
      profileData = { ...profile };
      $socials = profile['socials'];
      $links = profile['links'];
      profileId = data[0]['id'];
      teamId = data[0]['team_id'];
    }
    if (error) console.log(error);

    return data;
  };

  $: {
    $userData?.filter((item) => {
      if ($page.params.slug === $user?.id) {
        if (item === 'allow_write_profile') {
          isHasWriteProfilePermission = true;
        } else if (item === 'allow_write_team') {
          isHasWriteTeamPermission = true;
        }
      } else if (item === 'allow_write_members') {
        isHasWriteMembersPermission = true;
      } else if (item === 'allow_write_team') {
        isHasWriteTeamPermission = true;
      }

      if (item === 'allow_read_team') isHasReadTeamPermission = true;
    });

    if ($page.params.slug === $user?.id) {
      if (!isHasWriteProfilePermission && !isTeamTab) {
        message = "You don't have permission to edit your profile";
      } else if (!isHasWriteTeamPermission && isTeamTab) {
        message = "You dont have permission to edit this team's profile";
      }
    } else if (!isHasWriteMembersPermission && !isTeamTab) {
      message = "You don't have permission to edit this member's profile";
    } else if (!isHasWriteTeamPermission && isTeamTab) {
      message = "You dont have permission to edit this team's profile";
    }
    // console.log(message);
  }
</script>

{#await getProfile()}
  <ProfileEditorSkeleton />
{:then}
  <div
    class={`flex justify-center bg-blue-600 text-white p-2 rounded-lg ${
      message === '' ? 'hidden' : ''
    }`}
  >
    {message}
  </div>
  <div class="min-h-screen flex justify-center pl-16">
    <div class="md:px-20 px-4 w-full bg-black">
      <div class="grid grid-cols-2 gap-2 text-black mt-8">
        <div class="flex flex-col w-full md:col-span-1 col-span-2 mb-10">
          {#if isHasReadTeamPermission}
            <TabGroup>
              <TabList
                class="w-full grid grid-cols-2 border-b-2 border-neutral-700 mb-4"
              >
                <Tab
                  on:click={() => {
                    isTeamTab = false;
                    message = '';
                  }}
                  class={({ selected }) =>
                    selected
                      ? 'text-white font-bold border-b-2 border-white pb-2'
                      : 'text-white pb-2'}>Personal</Tab
                >
                <Tab
                  on:click={() => {
                    isTeamTab = true;
                    message = '';
                  }}
                  class={({ selected }) =>
                    selected
                      ? 'text-white font-bold border-b-2 border-white pb-2'
                      : 'text-white pb-2'}>Team</Tab
                >
              </TabList>
              <TabPanels>
                <TabPanel>
                  <PersonalEditor
                    {profileData}
                    {isHasWriteMembersPermission}
                    {isHasWriteProfilePermission}
                  />
                </TabPanel>
                <TabPanel>
                  <TeamEditor {isHasWriteTeamPermission} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          {:else if !isHasReadTeamPermission}
            <PersonalEditor
              {profileData}
              {isHasWriteMembersPermission}
              {isHasWriteProfilePermission}
            />
          {/if}
        </div>
        <div
          class="md:col-span-1 col-span-2 max-w-md w-full mx-auto h-screen overflow-y-scroll mb-10"
        >
          <Profile
            class="min-h-screen"
            isEditorMode={true}
            data={profileData}
            id={profileId}
            {teamId}
          />
        </div>
      </div>
    </div>
  </div>
{:catch}
  <h1 class="text-2xl font-bold text-white text-center w-full mt-8">
    Some error occurred. Please reload the page and try again.
  </h1>
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
