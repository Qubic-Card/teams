<script>
  import MemberSortDropdown from '@comp/buttons/memberSortDropdown.svelte';
  import TenantModal from '@comp/modals/tenantModal.svelte';
  import { getContext } from 'svelte';
  import ddbDocClient from '@lib/dynamodb';
  import { DDB_DOC } from '@lib/constants';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { ExecuteStatementCommand } from '@aws-sdk/client-dynamodb';
  import { user } from '@lib/stores/userStore';
  import { UpdateCommand } from '@aws-sdk/lib-dynamodb';

  const teamId = getContext('teamId');

  export let tenantData = {};
  // $: console.log(tenantData);
  let desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit Loremd';

  const editTenantData = async (input) => {
    try {
      const data = await ddbDocClient.update({
        TableName: DDB_DOC.TE,
        Key: {
          TeamID: input.TeamID,
          TID: input.TID,
        },
        UpdateExpression:
          'set #name = :name, #pointName = :pointName, #metadata = :metadata',
        ExpressionAttributeNames: {
          '#name': 'Name',
          '#pointName': 'PointName',
          '#metadata': 'Metadata',
        },
        ExpressionAttributeValues: {
          ':name': input.Name,
          ':pointName': input.PointName,
          ':metadata': {
            Logo: input.Metadata.Logo,
            Color: '#000000',
            Desc: input.Metadata.Desc,
          },
        },
      });
      // console.log(data);
      toastSuccess('Tenant updated successfully');
    } catch (error) {
      toastFailed('Failed to add tenant');
      console.log(error);
    }
  };
</script>

{#if tenantData}
  <div class="flex flex-col md:flex-row gap-2 h-36 w-full">
    <div
      class="bg-neutral-900 outline outline-1 outline-neutral-800 w-full md:w-1/3 rounded-md flex gap-2 justify-center items-center p-2"
    >
      <img
        src={tenantData?.Metadata?.Logo}
        alt=""
        class="w-28 h-28 rounded-md"
      />
      <div class="flex flex-col justify-start h-full w-full">
        <div class="flex justify-between">
          <h1 class="font-semibold">{tenantData.Name}</h1>
          <TenantModal
            mode="edit"
            input={tenantData}
            on:action={async (e) => await editTenantData(e.detail)}
          />
        </div>
        <h2 class="text-neutral-400 text-sm">
          ${tenantData.PointName}
        </h2>
        <p class="text-xs mt-2">{tenantData?.Metadata?.Desc}</p>
      </div>
    </div>
    <div class="flex flex-col gap-2 w-full md:w-2/3">
      <div class="flex gap-2 w-full md:w-1/3">
        <button
          class="bg-blue-600 outline outline-1 outline-neutral-800 w-full rounded-md flex justify-center items-center text-xs md:text-sm"
        >
          Add Promo
        </button>
        <MemberSortDropdown />
      </div>
      <div
        class="snap-container snap-x mx-auto snap-mandatory h-32 md:h-56 lg:h-full flex w-full overflow-x-auto gap-2"
      >
        {#each Array(5) as content}
          <div class="w-[200px] lg:w-[250px] pb-2">
            <div
              class="bg-neutral-900 flex flex-col justify-between w-[200px] lg:w-[250px] h-full p-2 rounded-md outline outline-1 outline-neutral-800"
            >
              <h1 class="font-semibold text-md">
                <span class="text-neutral-400">$Starpoin</span> 2000
              </h1>
              <p
                class="text-neutral-400 text-xs md:text-sm {desc.length > 62
                  ? 'truncate'
                  : ''}"
              >
                {desc}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .snap-container::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  .snap-container::-webkit-scrollbar-track {
    background-color: #e4e4e4;
  }
  .snap-container::-webkit-scrollbar-thumb {
    background-color: #71717a;
  }
</style>
