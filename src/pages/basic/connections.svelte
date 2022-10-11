<script>
  import { onMount } from 'svelte';
  import supabase from '@lib/db.js';
  import { user } from '@lib/stores/userStore.js';
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import CardSkeleton from '@comp/basic/cardSkeleton.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import CardMock from '@comp/basic/cardMock.svelte';
  import ContactCard from '@comp/basic/contactCard.svelte';
  import Search from '@comp/search.svelte';
  import { basicSearchMenu } from '@lib/constants';

  let loading = false;
  let businessCards = [];
  let connections = [];
  let searchQuery = '';
  let searchNotFoundMsg = '';
  let selectedCol = 'profileData->>firstname';
  let isLoading = false;

  const selectedMenu = (e) => (selectedCol = e.detail);

  const setStatus = async (id, stat, index) => {
    const { data, error } = await supabase
      .from('card_connection')
      .update({ status: stat }, { returning: 'minimal' })
      .eq('id', id);

    businessCards[index].status = !businessCards[index].status;

    if (error) {
      toastFailed();
      return;
    }
    if (businessCards[index].status) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  const getConnectionsList = async () => {
    // loading = true;
    try {
      let page = 0;
      let { data, error: error_profile } = await supabase
        .from('connection_acc')
        .select('dateConnected, link, message, profileData, id')
        .order('id', { ascending: false })
        .eq('uid', $user?.id)
        .ilike(selectedCol, `%${searchQuery}%`)
        .limit(20);

      if (error_profile) throw error_profile;

      if (data) {
        connections = data;

        data.length === 0
          ? (searchNotFoundMsg = 'No connection found.')
          : (searchNotFoundMsg = '');
        // loading = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteConnectionHandler = async (profileId) => {
    isLoading = true;
    const { error } = await supabase
      .from('connection_acc')
      .delete()
      .match({ id: profileId });
    if (error) {
      toastFailed('Failed to delete connection');
      isLoading = false;
    } else {
      toastSuccess('Connection deleted');
      isLoading = false;
    }

    connections = connections.filter((item) => item.id !== profileId);
  };

  const getBusinessCards = async () => {
    loading = true;
    try {
      let { data, error } = await supabase
        .from('card_connection')
        .select(
          'id, card_id(type, color, mode), status, QRScan, QRShare, NFCtap, datecreated'
        )
        .eq('uid', $user?.id)
        .limit(10)
        .order('datecreated', { ascending: false });

      if (error) throw error;

      if (data) {
        businessCards = data.filter((card) => card.card_id.mode === 'basic');
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMount(async () => {
    loading = true;
    setTimeout(async () => {
      await getConnectionsList();
      await getBusinessCards();
      loading = false;
    }, 200);
  });

  $: searchQuery, selectedCol, getConnectionsList();
</script>

<div class="min-h-screen bg-gray-100 md:px-20 px-4 pt-8 pb-20">
  {#if loading}
    <CardSkeleton />
  {:else if businessCards}
    {#if businessCards.length > 0}
      <div
        class="snap-container mx-auto md:h-[280px] h-[230px] flex flex-row space-x-3 w-full overflow-x-auto"
      >
        {#each businessCards as card, index}
          <div
            class="snap-center aspect-[8/5] h-auto  flex-shrink-0 flex justify-center items-center border border-white hover:border-neutral-500 rounded-lg"
          >
            <CardMock>
              <div class="flex flex-col justify-between h-full flex-1">
                <div class="text-white p-6">
                  <h1 class="text-lg lg:text-xl font-bold">
                    {card?.card_id?.type?.toUpperCase()}
                    {card?.card_id?.color?.toUpperCase()}
                  </h1>
                  <p class="text-neutral-400 text-xs">
                    {new Date(card?.datecreated).toDateString().slice(4)}
                  </p>
                </div>
                <div class="flex flex-row justify-between px-6">
                  <div class="text-white items-center">
                    <p class="text-neutral-400 text-xs">NFC Taps</p>
                    <p class="font-bold text-lg lg:text-2xl">{card.NFCtap}</p>
                  </div>
                  <div class="text-white items-center">
                    <p class="text-neutral-400 text-xs">QR Scan</p>
                    <p class="font-bold text-lg lg:text-2xl">{card.QRScan}</p>
                  </div>
                </div>
                <div
                  class="flex justify-between rounded-b-lg bg-white px-6 py-4 w-full"
                >
                  <p class="text-black font-bold">
                    {card.status ? 'Active' : 'Inactive'}
                  </p>
                  <SwitchButton
                    on:change={async () =>
                      await setStatus(card.id, !card.status, index)}
                    checked={card.status}
                  />
                </div>
              </div>
            </CardMock>
          </div>
        {/each}
        <div
          on:click={() =>
            window.open('https://qubic.id/shop', '_blank').focus()}
          class="aspect-[8/5] bg-neutral-50 h-auto rounded-lg border justify-center items-center cursor-pointer flex"
        >
          <p class="text-neutral-400 text-6xl">+</p>
        </div>
      </div>

      <Search
        bind:value={searchQuery}
        on:selected={selectedMenu}
        searchMenu={basicSearchMenu}
      />
      {#if connections.length > 0}
        <div class="grid grid-cols-1 gap-2 lg:grid-cols-3 mt-3 mb-6">
          {#each connections as connection}
            <ContactCard
              {getConnectionsList}
              profile={connection}
              {deleteConnectionHandler}
              {isLoading}
            />
          {/each}
        </div>
      {:else}
        <div class="flex justify-center text-lg mt-12">
          {searchNotFoundMsg}
        </div>
      {/if}
    {:else}
      <div
        class="mx-auto border py-4 text-neutral-400 flex w-full justify-center flex-col items-center"
      >
        <p class=" font-medium text-xl text-neutral-600">Whoops!</p>
        <p class="px-4">
          You don't have any cards yet! Get one <a
            class="underline"
            href="/shop">here</a
          >
        </p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
  }

  .snap-container::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }

  .snap-container::-webkit-scrollbar-thumb {
    background-color: #e2e2e2;
  }
</style>
