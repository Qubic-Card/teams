<script lang="ts">
  import RegistrationLink from '../../../../pages/settings/registrationLink.svelte';
  import TeamName from '../../../../pages/settings/teamName.svelte';
  import supabase from '@lib/db';
  import { teamRoles } from '@lib/stores/roleStore';
  import SettingsSkeleton from '@comp/skeleton/settingsSkeleton.svelte';
  import { memberData, userData } from '@lib/stores/userStore';
  import Billing from '@pages/settings/billing.svelte';
  import Role from '@pages/settings/role.svelte';
  import Activation from '@pages/settings/activation.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import encryptActivationCode from '@lib/utils/encryptActivationCode';
  import { teamData } from '@lib/stores/teamStore';
  import { log } from '@lib/logger/logger';
  import { page } from '$app/stores';

  let roles = [];
  let isClicked = true;
  let permissions = {
    readRoles: false,
    writeRoles: false,
    isTeamInactive: false,
    isTeamWillExpire: false,
  };
  let isLoading = false;
  let loading = false;
  let activationCode = 'QUBICPASS';
  let isTeamNameChanged = false;
  let isActivationCodeChanged = false;

  const getTeamsRoleMapping = async () => {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*, team_id(subscription_end_date, member_count, team_token)')
        .eq('team_id', $page.params.slug)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        // activationCode = data[0].team_id.team_token;
        // team = data[0]?.team_id;
        roles = data;
        $teamRoles = data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTeamName = async () => {
    if (!isTeamNameChanged) {
      toastFailed('Team name is not changed');
      return;
    } else {
      loading = true;
      const { error } = await supabase
        .from('teams')
        .update({ name: $teamData.name })
        .eq('id', $page.params.slug)
        .select();

      if (error) {
        loading = false;
        toastFailed();
        console.log(error);
      } else {
        loading = false;

        log(
          `Team Name has been changed to ${$teamData.name} by ${$memberData.fullName}`,
          'WARN',
          null,
          $page.params.slug,
          $memberData.fullName,
          '',
          $memberData.id
        );

        toastSuccess('Changes saved');
      }
    }
  };

  const addActivationCode = async (newToken) => {
    if (!isActivationCodeChanged) {
      toastFailed('Activation code is not changed');
      return;
    } else {
      isLoading = true;
      let hash = await encryptActivationCode(newToken);

      const { data, error } = await supabase
        .from('teams')
        .update({
          team_token: hash,
        })
        .eq('id', $page.params.slug);

      if (error) {
        toastFailed('Failed to change activation code');
        console.log(error);
        isLoading = false;
      } else {
        toastSuccess('Activation code changed');
        activationCode = 'QUBICPASS';
        isLoading = false;
      }
    }
  };

  const onKeyPress = async (e) => {
    if (e.charCode === 13) {
      await addActivationCode(activationCode);
    }
  };

  const onTeamNameKeyPress = async (e) => {
    if (e.charCode === 13) {
      await updateTeamName();
    }
  };

  const clicked = (e) => (isClicked = e.detail);

  $: if ($userData)
    $userData?.filter((item) => {
      if (item === 'allow_read_roles') permissions.readRoles = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'inactive') permissions.isTeamInactive = true;
      if (item === 'will_expired') permissions.isTeamWillExpire = true;
    });
</script>

{#await getTeamsRoleMapping()}
  <div class="ml-4 md:ml-24 mr-4 mt-4">
    <SettingsSkeleton
      {permissions}
      isSuperAdmin={$memberData?.roleName === 'superadmin'}
    />
  </div>
{:then}
  <div class="flex justify-center h-full pt-4 pl-4 md:pl-20 pr-4 mb-20">
    <div
      class="flex flex-col {permissions.isTeamInactive ||
      permissions.isTeamWillExpire
        ? 'justify-center items-center'
        : $memberData?.roleName === 'superadmin' || permissions.readRoles
        ? ''
        : 'justify-center items-center'} h-full w-full gap-3 text-sm pb-10"
    >
      {#if $memberData?.roleName === 'superadmin'}
        {#if !permissions.isTeamInactive && !permissions.isTeamWillExpire}
          <Billing {permissions} />
          <TeamName
            {loading}
            on:input={() => (isTeamNameChanged = true)}
            on:keypress={onTeamNameKeyPress}
            bind:value={$teamData.name}
            on:click={updateTeamName}
          />
          <Activation
            {isLoading}
            on:input={() => (isActivationCodeChanged = true)}
            bind:value={activationCode}
            on:keypress={onKeyPress}
            on:click={async () => addActivationCode(activationCode)}
          />
          <RegistrationLink />
        {:else}
          <div class="h-72 bg-no-repeat flex justify-center items-center bg-">
            <h1 class="z-30 absolute text-xs md:text-sm lg:text-lg">
              You don't have access to this section
            </h1>
            <img src="/bg-donthaveaccess.png" alt="" class="w-[600px]" />
          </div>
        {/if}
      {:else}
        <div class="h-72 bg-no-repeat flex justify-center items-center bg-">
          <h1 class="z-30 absolute text-xs md:text-sm lg:text-lg">
            You don't have access to this section
          </h1>
          <img src="/bg-donthaveaccess.png" alt="" class="w-[600px]" />
        </div>
      {/if}

      {#if permissions.readRoles}
        {#if !permissions.isTeamInactive && !permissions.isTeamWillExpire}
          <Role {permissions} {roles} />
          <div
            class="flex flex-col p-4 bg-neutral-900 outline outline-1 outline-neutral-800 rounded-lg"
          >
            <h1 class="text-sm md:text-xl font-semibold">Contact us</h1>
            <a href="mailto:support@qubic.id text-xs md:text-sm"
              >Email: support@qubic.id</a
            >
            <a href="https://wa.me/628113087599 text-xs md:text-sm"
              >Whatsapp: +62 811 3087599</a
            >
          </div>
        {:else}
          <div class="h-72 bg-no-repeat flex justify-center items-center bg-">
            <h1 class="z-30 absolute text-xs md:text-sm lg:text-lg">
              You don't have access to this section
            </h1>
            <img src="/bg-donthaveaccess.png" alt="" class="w-[600px]" />
          </div>
        {/if}
      {:else}
        <div class="h-72 bg-no-repeat flex justify-center items-center bg-">
          <h1 class="z-30 absolute text-xs md:text-sm lg:text-lg">
            You don't have access to this section
          </h1>
          <img src="/bg-donthaveaccess.png" alt="" class="w-[600px]" />
        </div>
      {/if}
    </div>
  </div>
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-semibold">
        contact us!
      </a>
    </h1>
  </div>
{/await}
