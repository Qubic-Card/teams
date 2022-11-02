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
  import { DDB_TABLE } from '@lib/constants';
  import { PutCommand } from '@aws-sdk/lib-dynamodb';

  const teamId = getContext('teamId');
  let searchQuery = '';
  let members = [];
  let tenants = [];
  let sortOptions = ['All'];

  const totalPoints = membership.reduce((acc, curr) => {
    return acc + curr.Membership.Points;
  }, 0);

  const totalMembers = membership.filter((member) => {
    return member.Membership.TID === '1';
  });

  const newMembers = totalMembers.filter((member) => {
    return new Date(member.Membership.JoinedAt) > new Date();
  }).length;

  const params = {
    TableName: DDB_TABLE.M,
    // ConditionExpression: 'attribute_exists(UID)',
    Item: {
      UID: '1',
      Memberships: [
        {
          TID: '1',
          Points: 100,
          JoinedAt: '2021-09-01T00:00:00.000Z',
          AddedBy: 'Pangestu',
          Profile: {
            Firstname: 'John Doe',
            Lastname: 'John Doe',
            Job: 'FE Developer',
            Email: 'john@gmail.com',
          },
        },
        {
          TID: '1',
          Points: 100,
          JoinedAt: '2021-08-01T00:00:00.000Z',
          AddedBy: 'galih',
          Profile: {
            Firstname: 'John Doe',
            Lastname: 'John Doe',
            Job: 'FE Developer',
            Email: 'john@gmail.com',
          },
        },
        {
          TID: '1',
          Points: 100,
          JoinedAt: '2021-10-01T00:00:00.000Z',
          AddedBy: 'galih',
          Profile: {
            Firstname: 'John Doe',
            Lastname: 'John Doe',
            Job: 'FE Developer',
            Email: 'john@gmail.com',
          },
        },
      ],
    },
  };

  const getparams = {
    TableName: DDB_TABLE.M,
    // Key: {
    //   UID: '1',
    // },
    KeyConditionExpression: 'UID = :uid',
    ExpressionAttributeValues: {
      ':uid': '1',
    },
    ProjectionExpression: 'Memberships, UID',
  };

  const getTenantParams = {
    TableName: DDB_TABLE.TE,
    Key: {
      TeamID: '1',
    },
    // KeyConditionExpression: 'UID = :uid',
    // ExpressionAttributeValues: {
    //   ':uid': '2',
    // },
    ProjectionExpression: 'Metadata, TeamID',
  };

  const push = async () => {
    try {
      const data = await ddbDocClient.put(params);
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addNewTenantHandler = async (input) => {
    try {
      const tenantParams = {
        TableName: DDB_TABLE.TE,
        Item: {
          TeamID: '2',
          Tenants: [
            {
              TID: '5',
              Metadata: input,
            },
          ],
        },
      };

      // console.log(input);
      const data = await ddbDocClient.put(tenantParams);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMembers = async () => {
    try {
      const data = await ddbDocClient.query(getparams);
      console.log(data);
      members = data.Items[0].Memberships;
      sortOptions = [
        ...sortOptions,
        ...members.map((member) => member.AddedBy),
      ]; // Seharusnya query sendiri nama2 staffnya
      // console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTenants = async () => {
    try {
      // const data = await ddbDocClient.get(getTenantParams);
      const data = await ddbDocClient.query({
        TableName: DDB_TABLE.TE,
        KeyConditionExpression: 'TeamID = :tid',
        ExpressionAttributeValues: {
          ':tid': '2',
        },
      });
      tenants = data.Items[0].Tenants;
      // console.log(tenants);
    } catch (error) {
      console.log(error);
    }
  };

  // $: push();
  // $: getMembers()
</script>

<div class="flex flex-col pb-20 bg-black min-h-screen pl-0 md:pl-16 gap-2">
  <div
    class="border-b border-neutral-700 h-12 text-lg font-regular z-40 fixed w-full bg-black pl-6 flex justify-between items-center pr-4 md:pr-20"
  >
    <h1>Membership <span class="text-neutral-400 text-sm">2 Tenants</span></h1>
    <TenantModal on:action={async (e) => await addNewTenantHandler(e.detail)} />
  </div>

  {#await getTenants()}
    <h1>Loading...</h1>
  {:then name}
    {#each tenants as tenant}
      <div
        class="border-b border-neutral-700 h-12 text-lg font-regular z-40 sticky mt-16 bg-black pl-6 flex justify-between items-center pr-4 md:pr-20"
      >
        {tenant.Metadata.Name}
      </div>
    {/each}
  {:catch name}
    <h1>Error</h1>
  {/await}

  <div class="flex justify-between gap-4 pl-4 pr-4">
    <div class="flex flex-col w-full gap-4">
      <TenantInfoCard />
      <h1 class="text-sm text-neutral-400 mt-40 md:mt-0">
        Data from last 7 days
      </h1>
      <div class="flex flex-col md:flex-row gap-2 w-full">
        <MembershipAnalyticCard
          {teamId}
          teams
          {totalPoints}
          {newMembers}
          {totalMembers}
        />
      </div>
    </div>
  </div>
  <div class="flex flex-col gap-2 my-2 pr-4">
    <div
      class="flex px-6 flex-col md:flex-row items-center md:justify-between md:w-full gap-2 py-3 border-b mb-2 z-20 sticky top-0 border-neutral-700 bg-black"
    >
      <h1 class="text-xl font-semibold flex-grow w-1/2">Members</h1>

      <div class="flex gap-2 md:w-1/2 w-full items-center">
        <MemberSortDropdown mode="membership" />
        <MembershipSortDropdown {sortOptions} />
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
        {#each members as member}
          <MembershipCard {member} />
        {/each}
      </div>
    {:catch name}
      <h1>Error</h1>
    {/await}
  </div>
</div>
