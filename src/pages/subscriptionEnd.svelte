<script>
  import supabase from '@lib/db';
  import { fade } from 'svelte/transition';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import {
    cardConnectionHandler,
    changeCardMode,
    setNullTeamMemberUid,
    updateBasicProfile,
  } from '@lib/query/transferCard';
  import TransferModal from '@comp/modals/transferModal.svelte';
  import DeleteCardModal from '@comp/modals/deleteCardModal.svelte';
  import { selectedProfileMenu } from '@lib/stores/subsEndStore';

  export let teamId;
  let expiredMembers = [];
  let isLoading = false;
  let selectedCards = new Set();

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getExpiredMembers = async () => {
    const { data: cards, error } = await supabase
      .from('business_cards')
      .select('color, id, type, member: team_members(uid, id, team_profile)')
      .eq('team_id', teamId)
      .eq('mode', 'team')
      .order('created_at', { ascending: true });

    if (error) console.log(error);
    if (cards) {
      for (let index in cards) {
        if (cards[index].member[0]) {
          const { data, error } = await supabase.functions.invoke(
            'getUserEmail',
            {
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uid: cards[index].member[0].uid,
              }),
            }
          );
          if (error) console.log(error);
          if (data) {
            expiredMembers = [
              ...expiredMembers,
              {
                ...cards[index],
                email: data,
              },
            ];
          }
        }
      }
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
      selectedCards = new Set(expiredMembers.map((m) => m.id));
    } else {
      selectedCards.clear();
    }
    selectedCards = selectedCards;
  };

  // 39ba7789-537c-4b0f-a8a7-c8a8345838f3 1
  // eac9c236-da25-4d9c-a058-632bd92bc951 2
  // bec89896-55b3-4e5a-b66f-01bd1aa4b5e9 3
  // e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb
  // cc9f06e7-b6eb-44c8-8817-a2f729df3aa3

  // 613572e9-f471-4f0d-90d2-d8511d1ac462
  // 1a8bfef4-9e7e-4a8e-98a8-8d69f2fde038
  // 121

  const transferCardHandler = async (card) => {
    isLoading = true;
    // await setNullTeamMemberUid(card.member[0].id);
    await changeCardMode(card.id);
    await cardConnectionHandler(card);
    if ($selectedProfileMenu.includes('with')) {
      await updateBasicProfile(card);
    }
    toastSuccess('Card transfered successfully');

    expiredMembers = expiredMembers.filter((item) => item.id !== card.id);

    isLoading = false;
  };

  const bulkTransfer = async () => {
    isLoading = true;
    let selectedArr = Array.from(selectedCards);

    selectedArr = expiredMembers.filter((item) =>
      selectedArr.includes(item.id)
    );

    selectedArr.forEach(async (card) => {
      // await setNullTeamMemberUid(card.member[0].id);
      await changeCardMode(card.id);
      await cardConnectionHandler(card);
      if ($selectedProfileMenu.includes('with')) {
        await updateBasicProfile(card);
      }

      expiredMembers = expiredMembers.filter((item) => item.id !== card.id);
    });

    toastSuccess('Cards transfered successfully');
    isLoading = false;
  };

  const deleteCard = async (cards) => {
    isLoading = true;
    const { data, error } = await supabase.rpc('delete_card', {
      cards: cards,
    });
    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
      isLoading = false;
    }
    if (data) {
      // console.log(data);
      toastSuccess('Card deleted successfully');
      isLoading = false;
    }
  };

  const bulkDelete = async () => {
    let selectedArr = Array.from(selectedCards);

    selectedArr = expiredMembers.filter((item) =>
      selectedArr.includes(item.id)
    );

    deleteCard(selectedArr.map((c) => c.id));
  };
</script>

{#await getExpiredMembers()}
  <div class="animate-pulse w-full h-full p-2 flex flex-col gap-2">
    <div class="bg-neutral-900 w-full rounded-md h-16" />
    <div class="bg-neutral-900 w-full rounded-md h-12" />
    {#if expiredMembers.length < 1}
      {#each Array(5) as item}
        <div class="bg-neutral-900 w-full rounded-md h-12" />
      {/each}
    {:else}
      {#each expiredMembers as item}
        <div class="bg-neutral-900 w-full rounded-md h-12" />
      {/each}
    {/if}
  </div>
{:then name}
  {#if expiredMembers}
    <div
      class="flex flex-col text-white w-full h-screen gap-2 text-sm"
      transition:fade|local
    >
      <div
        class="text-xl border-b pl-4 p-2 border-neutral-700 font-bold pb-2 fixed bg-black h-12 w-full flex items-center justify-between"
      >
        <h1 class="text-sm md:text-lg">Transfer Cards</h1>
        <div class="flex gap-2">
          <TransferModal
            disabled={selectedCards.size === 0}
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
                  expiredMembers.map((m) => m.id).length}
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
          {#each expiredMembers as card}
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
              <td class="py-2 md:block hidden">{card.email.user}</td>
              <td class="py-2">
                <div class="flex">
                  <TransferModal
                    on:transfer={async () => await transferCardHandler(card)}
                  />
                  <DeleteCardModal
                    on:delete={async () => deleteCard([card.id])}
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
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}
