<script>
  import supabase from '@lib/db';
  import { fade } from 'svelte/transition';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import {
    cardConnectionHandler,
    changeCardMode,
    deleteTeamCardCon,
    searchProfile,
    updateBasicProfile,
  } from '@lib/query/transferCard';
  import TransferModal from '@comp/modals/transferModal.svelte';
  import DeleteCardModal from '@comp/modals/deleteCardModal.svelte';
  import {
    selectedAddress,
    selectedProfileMenu,
  } from '@lib/stores/subsEndStore';
  import { log } from '@lib/logger/logger';
  import { memberData } from '@lib/stores/userStore';
  import { teamData } from '@lib/stores/teamStore';

  export let teamId;
  let expiredCards = [];
  let isLoading = false;
  let selectedCards = new Set();

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getExpiredCards = async () => {
    const { data: cards, error } = await supabase.rpc('getcards', {
      tid: teamId,
    });

    if (error) console.log(error);
    if (cards) {
      expiredCards = cards;
      console.log(cards);
    }
  };

  const onCheckCard = (event) => {
    if (event.target.checked) {
      selectedCards.add(event.target.value);
    } else {
      selectedCards.delete(event.target.value);
    }
    selectedCards = selectedCards;
  };

  const onSelectAll = (event) => {
    if (event.target.checked) {
      selectedCards = new Set(expiredCards.map((m) => m.id));
    } else {
      selectedCards.clear();
    }
    selectedCards = selectedCards;
  };

  const transferCardHandler = async (card, toast) => {
    isLoading = true;
    if ($selectedAddress.choosen === 0) {
      await deleteTeamCardCon(card.id);
      await changeCardMode(card.id);
      await cardConnectionHandler(card, $selectedAddress.uid);
      if ($selectedProfileMenu.includes('with') && card.team_profile !== null) {
        await updateBasicProfile(card);
      }
      if (toast) toastSuccess('Card transfered successfully');
      expiredCards = expiredCards.filter((item) => item.id !== card.id);
    } else {
      if ($selectedAddress.uid) {
        await deleteTeamCardCon(card.id);
        await changeCardMode(card.id);
        await cardConnectionHandler(card, $selectedAddress.uid);
        if (
          $selectedProfileMenu.includes('with') &&
          card.team_profile !== null
        ) {
          await updateBasicProfile(card);
        }
        if (toast) toastSuccess('Card transfered successfully');
        expiredCards = expiredCards.filter((item) => item.id !== card.id);
      }
    }
    isLoading = false;
  };

  const bulkTransfer = async () => {
    isLoading = true;
    let selectedArr = Array.from(selectedCards);

    selectedArr = expiredCards.filter((item) => selectedArr.includes(item.id));

    selectedArr.forEach(async (card) => {
      await transferCardHandler(card, false);
    });

    toastSuccess('Cards transfered successfully');
    isLoading = false;
  };

  const deleteCard = async (cards) => {
    isLoading = true;
    const { data, error } = await supabase.rpc('delete_card', {
      cards: cards.map((m) => m.cardId),
    });

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
      isLoading = false;
    } else {
      cards.forEach((card) => {
        log(
          `${card.email} has been removed from ${$teamData.name}`,
          'DANGER',
          null,
          teamId,
          $memberData.fullName,
          '',
          $memberData.id
        );
      });

      expiredCards = expiredCards.filter(
        (item) => !cards.map((m) => m.cardId).includes(item.id)
      );

      toastSuccess('Card deleted successfully');
      isLoading = false;
    }
  };

  const bulkDelete = async () => {
    let selectedArr = Array.from(selectedCards);

    selectedArr = expiredCards.filter((item) => selectedArr.includes(item.id));

    deleteCard(
      selectedArr.map((c) => {
        return {
          cardId: c.id,
          email: c.email,
        };
      })
    );
  };
</script>

{#await getExpiredCards()}
  <div class="animate-pulse w-full h-full p-2 flex flex-col gap-2">
    <div class="bg-neutral-900 w-full rounded-md h-16" />
    <div class="bg-neutral-900 w-full rounded-md h-12" />
    {#if expiredCards.length < 1}
      {#each Array(5) as item}
        <div class="bg-neutral-900 w-full rounded-md h-12" />
      {/each}
    {:else}
      {#each expiredCards as item}
        <div class="bg-neutral-900 w-full rounded-md h-12" />
      {/each}
    {/if}
  </div>
{:then name}
  {#if expiredCards}
    <div
      class="flex flex-col text-white w-full h-screen gap-2 text-sm"
      transition:fade|local
    >
      <div
        class="text-xl border-b pl-4 p-2 border-neutral-700 font-semibold pb-2 fixed bg-black h-12 w-full flex items-center justify-between"
      >
        <h1 class="text-sm md:text-lg">Transfer Cards</h1>
        <div class="flex gap-2">
          <TransferModal
            disabled={selectedCards.size === 0}
            selectedCards={expiredCards.filter((item) =>
              Array.from(selectedCards).includes(item.id)
            )}
            bulkTransfer
            on:transfer={async () => await bulkTransfer()}
          />
          <DeleteCardModal
            bulkDelete
            disabled={selectedCards.size === 0}
            on:delete={async () => await bulkDelete()}
          />
        </div>
      </div>
      <table class="mt-12">
        <thead>
          <tr class="border-b border-neutral-800">
            <th class="text-left py-3 pl-4">
              <input
                type="checkbox"
                class="w-5 h-5 cursor-pointer disabled:cursor-default"
                checked={selectedCards.size ===
                  expiredCards.map((m) => m.id).length}
                on:change={onSelectAll}
              />
            </th>
            <th class="text-left py-3 pl-4">ID</th>
            <th class="text-left py-3 pl-4">Card Type</th>
            <th class="text-left py-3 md:block hidden">Owner</th>
            <th class="text-left py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each expiredCards as card}
            <tr class="bg-neutral-900 border-b-2 border-neutral-800">
              <td class="py-2 pl-4">
                <input
                  type="checkbox"
                  class="w-5 h-5 cursor-pointer disabled:cursor-default a"
                  value={card.id}
                  checked={selectedCards.has(card.id)}
                  on:change={onCheckCard}
                />
              </td>
              <td class="py-2 pl-4">******{card.id.slice(-6)}</td>
              <td class="py-2 pl-4"
                >{card.type === 'pvc' ? 'PVC' : capitalize(card.type)}
                {capitalize(card.color)}</td
              >
              <td class="py-2 md:block hidden">{card.email ?? '-'}</td>
              <td class="py-2">
                <div class="flex">
                  <TransferModal
                    {card}
                    on:transfer={async () =>
                      await transferCardHandler(card, true)}
                  />
                  <DeleteCardModal
                    on:delete={async () =>
                      deleteCard([{ cardId: card.id, email: card.email }])}
                  />
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
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
