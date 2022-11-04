<script>
  import Input from '@comp/input.svelte';
  import MembershipCard from '@comp/cards/membershipCard.svelte';
  import MembershipSortDropdown from '@comp/buttons/membershipSortDropdown.svelte';
  import MembershipAnalyticCard from '@comp/cards/membershipAnalyticCard.svelte';
  import MemberSortDropdown from '@comp/buttons/memberSortDropdown.svelte';
  import TenantInfoCard from '@comp/cards/tenantInfoCard.svelte';
  import { getContext } from 'svelte';
  import { membership } from '@lib/membership';
  import ddbDocClient from '@lib/dynamodb';
  import TenantModal from '@comp/modals/tenantModal.svelte';
  import { DDB_DOC } from '@lib/constants';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { ExecuteStatementCommand } from '@aws-sdk/client-dynamodb';
  import { user } from '@lib/stores/userStore';

  const teamId = getContext('teamId');
  let searchQuery = '';
  let members = [];
  let tenants = [];
  let tenantData = {};
  let sortOptions = ['all'];
  let selectedTenant = 0;
  let input = {
    Name: '',
    PointName: '',
    Metadata: {
      Desc: '',
      Logo: 'https://placeimg.com/640/480/any',
    },
  };
  let totalMembers = 0;
  let isLoading = false;

  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  const selectTenantHandler = async (i, tenant) => {
    selectedTenant = i;
    tenantData = tenant;
    await getMembers();
  };

  const sortHandler = (mode) => {
    isLoading = true;
    if (mode === 'asc') {
      members = members.sort((a, b) => {
        return new Date(b.JoinedAt).getTime() - new Date(a.JoinedAt).getTime();
      });
    } else {
      members = members.sort((a, b) => {
        return new Date(a.JoinedAt).getTime() - new Date(b.JoinedAt).getTime();
      });
    }

    setTimeout(() => (isLoading = false), 500);
  };

  const filterHandler = (selected) => {
    try {
      setTimeout(async () => {
        // wait for the tenantData
        const getparams = {
          TableName: DDB_DOC.M,
          IndexName: 'TID-JoinedAt-index',
          KeyConditionExpression: 'TID = :tid AND AddedBy = :addedBy',
          ExpressionAttributeValues: {
            ':tid': tenantData.TID,
            ':addedBy': selected,
          },
        };

        const data = await ddbDocClient.query(getparams);

        members = data.Items;

        members = members.sort((a, b) => {
          return (
            new Date(b.JoinedAt).getTime() - new Date(a.JoinedAt).getTime()
          );
        });
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  const push = async () => {
    try {
      let t1 = '1a8bfef4-9e7e-4a8e-98a8-8d69f2fde038-1667545411079';
      let t2 = '1a8bfef4-9e7e-4a8e-98a8-8d69f2fde038-1667545418952';
      const params = {
        TableName: DDB_DOC.M,
        // ConditionExpression: 'attribute_exists(UID)',
        Item: {
          UID: new Date().getTime().toString(),
          Metadata: {
            Avatar: 'https://i.pravatar.cc/150?img=1',
            Socials: [],
            Links: [],
          },
          TID: t1,
          Points: 100,
          Email: 'galihhhp@gmail.com',
          Phone: '081234567890',
          AddedBy: 'Pangestu',
          Firstname: 'John Doe',
          Lastname: 'John Doe',
          Company: 'PT. ABC',
          Job: 'FE Developer',
          JoinedAt: randomDate(new Date(2022, 10, 1), new Date()).toISOString(),
        },
      };

      const data = await ddbDocClient.put(params);
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addNewTenantHandler = async (input) => {
    try {
      const item = {
        TeamID: teamId,
        TID: teamId + '-' + new Date().getTime(),
        Name: input.Name,
        PointName: input.PointName,
        Metadata: {
          Logo: input.Metadata.Logo,
          Color: '#000000',
          Desc: input.Metadata.Desc,
        },
        CirculatingPoints: 0,
      };

      const tenantParams = {
        TableName: DDB_DOC.TE,
        Item: item,
      };

      const data = await ddbDocClient.put(tenantParams);
      // console.log(data);
      toastSuccess('Tenant added successfully');
      tenants = [...tenants, item];
    } catch (error) {
      toastFailed('Failed to add tenant');
      console.log(error);
    }
  };

  const getMembers = async () => {
    try {
      setTimeout(async () => {
        // wait for the tenantData
        const getparams = {
          TableName: DDB_DOC.M,
          IndexName: 'TID-JoinedAt-index',
          KeyConditionExpression: 'TID = :tid',
          ExpressionAttributeValues: {
            ':tid': tenantData.TID,
          },
        };

        const data = await ddbDocClient.query(getparams);

        members = data.Items;

        members = members.sort((a, b) => {
          return (
            new Date(b.JoinedAt).getTime() - new Date(a.JoinedAt).getTime()
          );
        });

        // console.log(members);
        totalMembers = members.length;
        sortOptions = [
          ...sortOptions,
          ...members.map((member) => member.AddedBy),
        ];
        sortOptions = [...new Set(sortOptions)];
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  const getTenants = async () => {
    try {
      const data = await ddbDocClient.query({
        TableName: DDB_DOC.TE,
        KeyConditionExpression: 'TeamID = :teamid',

        ExpressionAttributeValues: {
          ':teamid': teamId,
        },
        // ProjectionExpression: 'TID, Name',
      });

      tenants = data.Items;
      tenantData = tenants[0];
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const test = async () => {
    const statement = `SELECT * FROM "${DDB_DOC.M}" WHERE TID = ?`;
    const params = {
      Statement: statement,
      Parameters: [
        {
          S: '1',
        },
      ],
    };

    const command = new ExecuteStatementCommand(params);

    const data = await ddbDocClient.send(command);

    // console.log(data);
  };

  // $: test();
  // const getdynamoDb
  // $: push();
  // $: getMembers();
  // $: addNewTenantHandler();
  // $: getTenants();
</script>

<div class="flex flex-col pb-20 bg-black min-h-screen pl-0 md:pl-16 gap-2">
  <div
    class="border-b border-neutral-700 h-12 text-lg font-regular z-40 fixed w-full bg-black pl-6 flex justify-between items-center pr-4 md:pr-20"
  >
    <h1>
      Membership <span class="text-neutral-400 text-sm"
        >{tenants.length} Tenants</span
      >
    </h1>
    <TenantModal
      {input}
      on:action={async (e) => await addNewTenantHandler(e.detail)}
    />
  </div>

  {#await getTenants()}
    <h1>Loading...</h1>
  {:then name}
    <div
      class="border-b border-neutral-700 h-12 text-lg font-regular z-40 sticky mt-16 bg-black pl-6 flex items-center pr-4 md:pr-20 gap-2"
    >
      {#if tenants.length > 0}
        {#each tenants as tenant, i}
          <div
            class="{selectedTenant === i
              ? 'border-b-2 border-neutral-500'
              : ''} h-full cursor-pointer"
            on:click={() => selectTenantHandler(i, tenant)}
          >
            {tenant.Name}
          </div>
        {/each}
      {:else}
        <div class="h-full">No Tenant</div>
      {/if}
    </div>
  {:catch name}
    <h1>Error</h1>
  {/await}

  <div class="flex justify-between gap-4 pl-4 pr-4 mt-2">
    <div class="flex flex-col w-full gap-4">
      <TenantInfoCard {tenantData} />

      <h1 class="text-sm text-neutral-400 mt-40 md:mt-0">
        Data from last 7 days
      </h1>
      <div class="flex flex-col md:flex-row gap-2 w-full">
        <MembershipAnalyticCard {tenantData} />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-2 my-2 pr-4">
    <div
      class="flex px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 py-3 border-b mb-2 z-20 sticky top-0 border-neutral-700 bg-black"
    >
      <h1 class="text-xl font-semibold flex-grow w-1/2">Members</h1>

      <div class="flex gap-2 md:w-1/2 w-full items-center">
        <MemberSortDropdown
          mode="membership"
          on:asc={() => sortHandler('asc')}
          on:dsc={() => sortHandler('dsc')}
        />
        <MembershipSortDropdown
          {sortOptions}
          on:filter={(e) => filterHandler(e.detail)}
        />
        <Input
          small
          bind:value={searchQuery}
          type="text"
          title=""
          placeholder="Search name"
          class="w-full h-8"
          inputbg="bg-neutral-800"
          inputText="text-white"
        />
      </div>
    </div>

    {#await getMembers()}
      <h1>Loading...</h1>
    {:then name}
      <div class="flex flex-col gap-2 pl-4">
        {#if isLoading}
          <h1>Loading</h1>
        {:else if members.length > 0}
          {#each members as member, i}
            <MembershipCard {member} />
          {/each}
        {:else}
          <div class="h-full">No Members</div>
        {/if}
      </div>
    {:catch name}
      <h1>Error</h1>
    {/await}
  </div>
</div>
