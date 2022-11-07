<script>
  import supabase from '@lib/db';
  import { fade } from 'svelte/transition';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { onMount } from 'svelte';
  import Confirmation from '@comp/modals/confirmation.svelte';

  export let teamId;
  let expiredMembers = [];
  let showDeleteModal = false;

  const deletModalHandler = () => (showDeleteModal = !showDeleteModal);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getExpiredMembers = async () => {
    const { data: cards, error } = await supabase
      .from('business_cards')
      .select('color, id, type, member: team_members(uid, id)')
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

  let isLoading = false;
  let showModal = false;
  let teamMembersProfile = null;
  let isSuccess = false;
  let selectedMember = {};
  let selectAll = false;

  const toggleModal = () => (showModal = !showModal);

  const cards = [];

  let selectedCards = new Set();

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
      selectedCards = new Set(cards);
    } else {
      selectedCards.clear();
    }
    selectedCards = selectedCards;
  };

  const uniqueByKeepFirst = (a, key) => {
    let seen = new Set();
    return a?.filter((item) => {
      let k = key(item);
      return seen.has(k) ? false : seen.add(k);
    });
  };

  const updateBasicProfile = async () => {
    if (teamMembersProfile) {
      teamMembersProfile.forEach(async (member) => {
        const { data, error } = await supabase
          .from('profile')
          .update(
            {
              uid: member.team_member_id.uid,
              metadata: {
                avatar: member?.team_member_id?.team_profile?.avatar,
                address: member?.team_member_id?.team_profile?.address,
                company: member?.team_member_id?.team_profile?.company,
                design: member?.team_member_id?.team_profile?.design,
                firstname: member?.team_member_id?.team_profile?.firstname,
                lastname: member?.team_member_id?.team_profile?.lastname,
                job: member?.team_member_id?.team_profile?.job,
                isShowMetaImage:
                  member?.team_member_id?.team_profile?.isShowMetaImage,
                socials: uniqueByKeepFirst(
                  member?.team_member_id?.team_profile?.socials,
                  (social) => social.type
                ),
                links: member?.team_member_id?.team_profile?.links,
              },
            },
            { returning: 'minimal' }
          )
          .eq('uid', member.team_member_id.uid);

        if (error) {
          console.log(error);
          toastFailed('Something went wrong, please contact us');
        }
      });
    }
  };

  const createCardConnection = async (member) => {
    const { data, error } = await supabase.from('card_connection').insert(
      {
        uid: member.member.uid,
        card_id: member.id,
      },
      { returning: 'minimal' }
    );

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  // 39ba7789-537c-4b0f-a8a7-c8a8345838f3 1
  // eac9c236-da25-4d9c-a058-632bd92bc951 2
  // bec89896-55b3-4e5a-b66f-01bd1aa4b5e9 3
  // e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb
  const cardConnectionHandler = async (member) => {
    const { data, error } = await supabase
      .from('card_connection')
      .select('card_id, uid')
      .eq('card_id', member.id);

    if (data.length === 0) {
      await createCardConnection(member);
    }
  };

  const changeCardMode = async (cardId) => {
    const { data, error } = await supabase
      .from('business_cards')
      .update(
        {
          mode: 'basic',
        },
        { returning: 'minimal' }
      )
      .eq('id', cardId);

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  const setNullTeamMemberUid = async (id) => {
    const { data, error } = await supabase
      .from('team_members')
      .update(
        {
          uid: null,
        },
        { returning: 'minimal' }
      )
      .eq('id', id);

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  const transferCardHandler = async (member) => {
    // console.log(member);
    isLoading = true;
    await setNullTeamMemberUid(member.member[0].id);
    await changeCardMode(member.id);
    await cardConnectionHandler(member);
    // await getExpiredMembers();
    // toastSuccess('Card transfered successfully');
    // await updateBasicProfile();

    expiredMembers = expiredMembers.filter((item) => item.id !== member.id);

    isLoading = false;
    showModal = false;
  };
</script>

<Confirmation
  {isLoading}
  isDispatch
  isTransfer
  heading="Are you sure to transfer this"
  text="card to basic?"
  buttonLabel="Proceed"
  {showModal}
  {toggleModal}
  on:action={async () => await transferCardHandler(selectedMember)}
/>

{#await getExpiredMembers()}
  <div class="animate pulse w-full h-full p-2 flex flex-col gap-2">
    <div class="bg-neutral-900 w-full rounded-md h-16" />
    <div class="bg-neutral-900 w-full rounded-md h-12" />
    {#each expiredMembers as item}
      <div class="bg-neutral-900 w-full rounded-md h-12" />
    {/each}
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
        <h1>Transfer Cards</h1>
        <div class="mr-4">
          <button class="text-sm bg-blue-600 p-2 rounded-md"
            >Transfer Selected</button
          >
          <button
            class="text-sm bg-red-600/30 outline outline-1 outline-red-500 p-2 rounded-md"
            >Delete Selected</button
          >
        </div>
      </div>
      <table class="mt-12">
        <thead>
          <tr class="border-b border-neutral-800">
            <th class="text-left py-3 pl-4">
              <input
                type="checkbox"
                class="w-5 h-5 cursor-pointer disabled:cursor-default a"
                checked={selectedCards.size === cards.length}
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
          {#each expiredMembers as member}
            <tr class="bg-neutral-900 border-b-2 border-neutral-800">
              <td class="py-2 pl-4">
                <input
                  type="checkbox"
                  class="w-5 h-5 cursor-pointer disabled:cursor-default a"
                  value={member.id}
                  checked={selectedCards.has(member.id)}
                  on:change={onCheckCard}
                />
              </td>
              <td class="py-2 pl-4">******{member.id.slice(-6)}</td>
              <td class="py-2 pl-4"
                >{member.type === 'pvc' ? 'PVC' : capitalize(member.type)}
                {capitalize(member.color)}</td
              >
              <td class="py-2 md:block hidden">{member.email.user}</td>
              <td class="py-2">
                <button
                  on:click={() => {
                    toggleModal();
                    selectedMember = member;
                  }}
                  class="bg-neutral-800 rounded-md text-center w-28 p-2"
                >
                  Transfer
                </button>
                <Confirmation
                  {isLoading}
                  isDelete
                  isIconVisible
                  isDispatch
                  heading="Are you sure you want to delete"
                  text={`?`}
                  on:action={() => {
                    console.log('delete');
                  }}
                  buttonLabel="Delete"
                  showModal={showDeleteModal}
                  toggleModal={deletModalHandler}
                />
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
