<script lang="ts">
  import TeamName from './../../pages/settings/teamName.svelte';
  import supabase from '@lib/db';
  import { teamRoles } from '@lib/stores/roleStore';
  import SettingsSkeleton from '@comp/skeleton/settingsSkeleton.svelte';
  import { memberData, userData } from '@lib/stores/userStore';
  import Billing from '@pages/settings/billing.svelte';
  import Role from '@pages/settings/role.svelte';
  import { getContext } from 'svelte';
  import Activation from '@pages/settings/activation.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import encryptActivationCode from '@lib/utils/encryptActivationCode';
  import { teamData } from '@lib/stores/teamStore';
  import { log } from '@lib/logger/logger';
  import { team } from '@lib/stores/recordsStore';

  const teamId = getContext('teamId');
  let roles = [];
  let isClicked = true;
  let permissions = {
    readBilling: false,
    writeBilling: false,
    readRoles: false,
    writeRoles: false,
    isTeamInactive: false,
    isTeamWillExpire: false,
  };
  let isLoading = false;
  let loading = false;
  let activationCode = 'QUBICPASS';

  const getTeamsRoleMapping = async () => {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*, team_id(subscription_end_date, member_count, team_token)')
        .eq('team_id', teamId)
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
    loading = true;
    const { error } = await supabase
      .from('teams')
      .update({ name: $teamData.name }, { returning: 'minimal' })
      .eq('id', teamId);

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
        teamId,
        $memberData.fullName,
        '',
        $memberData.id
      );

      toastSuccess('Changes saved');
    }
  };

  const addActivationCode = async (newToken) => {
    isLoading = true;
    let hash = encryptActivationCode(newToken);
    const { data, error } = await supabase
      .from('teams')
      .update(
        {
          team_token: hash,
        },
        { returning: 'minimal' }
      )
      .eq('id', teamId);

    if (error) {
      toastFailed('Failed to change activation code');
      console.log(error);
      isLoading = false;
    } else {
      toastSuccess('Activation code changed');
      activationCode = 'QUBICPASS';
      isLoading = false;
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
      if (item === 'allow_read_billing') permissions.readBilling = true;
      if (item === 'allow_write_billing') permissions.writeBilling = true;
      if (item === 'allow_read_roles') permissions.readRoles = true;
      if (item === 'allow_write_roles') permissions.writeRoles = true;
      if (item === 'inactive') permissions.isTeamInactive = true;
      if (item === 'will_expired') permissions.isTeamWillExpire = true;
    });
</script>

{#await getTeamsRoleMapping()}
  <div class="ml-20 md:ml-24 mr-4 mt-4">
    <SettingsSkeleton
      {permissions}
      isSuperAdmin={$memberData?.roleName === 'superadmin'}
    />
  </div>
{:then}
  <div class="flex justify-center pt-4 pl-20 md:pl-24 pr-4">
    <div class="flex flex-col w-full gap-3 text-sm pb-10">
      <Billing {permissions} />
      {#if $memberData?.roleName === 'superadmin'}
        {#if !permissions.isTeamInactive && !permissions.isTeamWillExpire}
          <TeamName
            {loading}
            on:keypress={onTeamNameKeyPress}
            bind:value={$teamData.name}
            on:click={updateTeamName}
          />
          <Activation
            {isLoading}
            bind:value={activationCode}
            on:keypress={onKeyPress}
            on:click={async () => addActivationCode(activationCode)}
          />
        {/if}
      {/if}
      <Role {permissions} {roles} />
      <div class="flex flex-col p-4 bg-neutral-800 rounded-lg">
        <h1 class="text-xl font-bold">Contact us</h1>
        <a href="mailto:support@qubic.id">Email: support@qubic.id</a>
        <a href="https://wa.me/628113087599">Whatsapp: +62 811 3087599</a>
      </div>
    </div>
  </div>
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}
