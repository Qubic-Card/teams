<script lang="ts">
  import supabase from '@lib/db';
  import { teamRoles } from '@lib/stores/roleStore';
  import SettingsSkeleton from '@comp/skeleton/settingsSkeleton.svelte';
  import { memberData, userData } from '@lib/stores/userStore';
  import Billing from '@pages/settings/billing.svelte';
  import Role from '@pages/settings/role.svelte';
  import { getContext } from 'svelte';
  import Activation from '@pages/settings/activation.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import sha256 from 'crypto-js/sha256';

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

  const addActivationCode = async (newToken) => {
    isLoading = true;
    let hash = sha256(newToken).toString();
    const { data, error } = await supabase
      .from('teams')
      .update({
        team_token: hash,
      })
      .eq('id', teamId);

    if (error) {
      toastFailed('Failed to change activation code');
      console.log(error);
      isLoading = false;
    }
    if (data) {
      toastSuccess('Activation code changed');
      activationCode = 'QUBICPASS';
      isLoading = false;
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
  <div class="ml-24 mr-4 mt-4">
    <SettingsSkeleton
      {permissions}
      isSuperAdmin={$memberData?.roleName === 'superadmin'}
    />
  </div>
{:then}
  <div class="flex justify-center pt-4 pl-24 pr-4">
    <div class="flex flex-col w-full gap-3 text-sm pb-10">
      <Billing {permissions} />
      {#if $memberData?.roleName === 'superadmin'}
        <Activation
          {isLoading}
          bind:value={activationCode}
          on:click={async () => addActivationCode(activationCode)}
        />
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
  <h1>Error</h1>
{/await}
