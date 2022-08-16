<script>
  import supabase from '@lib/db';
  import { memberData, user } from '@lib/stores/userStore';

  export let subscription, member;

  const createCardConnection = async () => {
    const { data, error } = await supabase.from('card_connection').insert({});
  };

  const setNullTeamId = async () => {
    const { error, data } = await supabase
      .from('business_cards')
      .update({
        team_id: null,
      })
      .eq('id', 'card_id');
  };

  const createBasicProfile = async () => {
    const { data, error } = await supabase.from('profile').insert(
      {
        uid: $user?.id,
        metadata: member?.team_profile,
      },
      { returning: 'minimal' }
    );
  };

  const transferOwnCardHandler = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .delete()
      .eq('team_member_id', $memberData.id);
  };
</script>

<div class="flex flex-col text-white pt-24 pl-4 w-full gap-2 text-sm">
  <h1 class="text-lg border-b border-neutral-700 font-bold pb-2">
    Your subscription has ended.
  </h1>
  <p>
    Your membership has been expired since <span class="font-bold"
      >{new Date(subscription?.subs_end_date).toDateString().slice(4)}</span
    >. <br /> Here are some options you can choose:
  </p>
  <button class="rounded-md bg-blue-600 p-3 text-left w-1/4"
    >Renew membership</button
  >
  {#if member?.role?.role_name === 'superadmin'}
    <button class="rounded-md bg-neutral-100 text-left text-black p-3 w-1/4"
      >Transfer everyone's card to basic</button
    >
  {/if}
  <button class="rounded-md bg-neutral-100 text-left text-black p-3 w-1/4"
    >Transfer only my card to basic</button
  >
</div>
