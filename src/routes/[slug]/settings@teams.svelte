<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import roleMapping from '@lib/role';
  import supabase from '@lib/db';
  import { role, roleName, setRoleName } from '@lib/stores/roleStore';
  import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Switch,
  } from '@rgossiaux/svelte-headlessui';
  import AddRoleModal from '@comp/modals/addRoleModal.svelte';
  import RenameModal from '@comp/modals/renameModal.svelte';
  import Checkboxes from '@comp/checkbox.svelte';
  import SettingsSkeleton from '@comp/skeleton/settingsSkeleton.svelte';
  import { setUserData, user, userData } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { getRoleMapsByProfile } from '@lib/query/getRoleMaps';
  import Cookies from 'js-cookie';
  import Spinner from '@comp/loading/spinner.svelte';
  import Billing from '@pages/settings/billing.svelte';
  import Role from '@pages/settings/role.svelte';

  let roles = [];
  let roleMaps = [];
  let isClicked = true;
  let loading = false;
  let teamId = Cookies.get('qubicTeamId');
  let permissions = {
    readBilling: false,
    writeBilling: false,
    readRoles: false,
    writeRoles: false,
  };

  const getTeamsRoleMapping = async () => {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .select('*')
        .eq('team_id', teamId)
        .order('role_name', { ascending: true });

      if (error) throw error;

      if (data) {
        console.log(data);
        roles = data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // $: getMemberRole();

  const clicked = (e) => (isClicked = e.detail);

  $: $userData?.filter((item) => {
    if (item === 'allow_read_billing') permissions.readBilling = true;
    if (item === 'allow_write_billing') permissions.writeBilling = true;
    if (item === 'allow_read_roles') permissions.readRoles = true;
    if (item === 'allow_write_roles') permissions.writeRoles = true;
  });
</script>

{#await getTeamsRoleMapping()}
  <div class="ml-24 mr-4 mt-4">
    <SettingsSkeleton />
  </div>
{:then}
  <div class="flex justify-center pt-4 pl-24 pr-4">
    <div class="flex flex-col w-full gap-4">
      <Billing {permissions} />
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
