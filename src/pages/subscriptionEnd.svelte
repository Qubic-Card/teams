<script>
  import ConfirmationModal from '@comp/modals/confirmationModal.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let subscription, member, teamId;

  let isLoading = false;
  let showModal = false;
  let teamMembersProfile = null;
  let isSuccess = false;

  const toggleModal = () => (showModal = !showModal);
  const handleLogout = async () => await supabase.auth.signOut();
  const toWhatsApp = () =>
    window.open('https://wa.me/628113087599', '_blank').focus();

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
        uid: member.team_member_id.uid,
        card_id: member.card_id,
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

  const deleteCardConnection = async (userCardId) => {
    const { data, error } = await supabase
      .from('card_connection')
      .delete()
      .eq('card_id', userCardId);

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  const cardConnectionHandler = async () => {
    if (teamMembersProfile) {
      teamMembersProfile.forEach(async (member) => {
        const { data, error } = await supabase
          .from('card_connection')
          .select('card_id, uid')
          .eq('card_id', member.card_id);

        let neverActivatedMemberBasic;
        let alreadyActivatedMemberBasic;

        data.length > 0
          ? (alreadyActivatedMemberBasic = data)
          : (neverActivatedMemberBasic = member);

        // if (alreadyActivatedMemberBasic) {
        //   alreadyActivatedMemberBasic.filter(async (user) => {
        //     if (
        //       user.card_id === member.card_id &&
        //       user.uid !== member.team_member_id.uid
        //     ) {
        //       await deleteCardConnection(user.card_id);
        //       await createCardConnection(member);
        //     }
        //   });
        // }

        if (neverActivatedMemberBasic) {
          await createCardConnection(neverActivatedMemberBasic);
        }
      });
    }
  };

  const getMemberData = async () => {
    const { data, error } = await supabase
      .from('business_cards')
      .select('id')
      .eq('mode', 'team')
      .eq('team_id', teamId);
    // .match({ team_id: teamId });

    if (error) console.log(error);

    const { data: teamcardcon, error: teamcardcon_err } = await supabase
      .from('team_cardcon')
      .select('card_id,team_member_id(*)')
      .in(
        'card_id',
        data.map((item) => item.id)
      );

    if (error) console.log(teamcardcon_err);
    if (teamcardcon) {
      teamMembersProfile = teamcardcon;
    }
  };

  const changeCardMode = async () => {
    const { data, error } = await supabase
      .from('business_cards')
      .update(
        {
          mode: 'basic',
        },
        { returning: 'minimal' }
      )
      .match({ team_id: teamId });

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  const setNullTeamMemberUid = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .update(
        {
          uid: null,
        },
        { returning: 'minimal' }
      )
      .match({ team_id: teamId });

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    }
  };

  const transferBulkCardHandler = async () => {
    isLoading = true;
    await setNullTeamMemberUid();
    await changeCardMode();
    await cardConnectionHandler();
    await updateBasicProfile();
    toastSuccess('All cards transferred to basic');
    setTimeout(async () => {
      isLoading = false;
      await handleLogout();
    }, 4000);
    setInterval(() => (isSuccess = true), 3000);
    showModal = false;
  };

  onMount(async () => await getMemberData());
</script>

<ConfirmationModal
  {isLoading}
  isDispatch
  isTransfer
  heading="Are you sure to transfer everyone's"
  text="card to basic?"
  buttonLabel="Yes, i am sure."
  {showModal}
  {toggleModal}
  on:action={async () => await transferBulkCardHandler()}
/>

<div
  class="flex flex-col text-white pt-24 pl-4 w-full gap-2 text-sm"
  transition:fade|local
>
  <h1 class="text-lg border-b border-neutral-700 font-bold pb-2">
    Your subscription has ended.
  </h1>
  <p>
    Your membership has been expired since <span class="font-bold"
      >{new Date(subscription?.subs_end_date).toDateString().slice(4)}</span
    >. <br />
    <span class={`${member?.role?.role_name !== 'superadmin' && 'hidden'}`}>
      Here are some options you can choose:
    </span>
  </p>
  {#if member?.role?.role_name === 'superadmin'}
    {#if isLoading}
      <h1 in:fade|local>Transfer to basic...</h1>
      {#if isSuccess}
        <h1 class="text-xl font-extrabold uppercase" in:fade|local>Success!</h1>
      {/if}
    {:else}
      <button
        class="rounded-md bg-blue-600 p-3 text-left w-1/4"
        on:click={toWhatsApp}>Renew membership</button
      >
      <button
        on:click={toggleModal}
        class="rounded-md bg-neutral-100 text-left text-black p-3 w-1/4"
        >Transfer everyone's card to basic</button
      >
    {/if}
  {/if}
</div>
