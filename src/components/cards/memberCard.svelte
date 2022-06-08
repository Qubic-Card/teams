<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;
  export let isHasPermission;
  export let id;
  export let index;
  export let members;

  let statusMember = false;
  let cardId = null;

  const getMembersStatusCard = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('status, id')
      .eq('team_member_id', id);

    if (error) console.log(error);

    if (data) {
      statusMember = data[0].status;
      cardId = data[0].id;
    }
  };

  const setStatus = async (id, stat, index) => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: stat }, { returning: 'minimal' })
      .eq('id', id);

    members[index].status = !members[index].status;

    if (error) {
      toastFailed();
      return;
    }

    console.log(stat);
    if (stat) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  $: getMembersStatusCard();
  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);
</script>

<div class="flex flex-col justify-between mx-4">
  <div
    class="w-full h-56 md:h-72 bg-neutral-800 p-4 cursor-pointer"
    on:click={() => toProfileEditor(member.uid)}
  >
    <div class="flex justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl lg:text-4xl">
          {member.team_profile.firstname}
          {member.team_profile.lastname}
        </h1>
        <h2 class="text-xl md:text-2xl lg:text-3xl">
          {member.team_profile.job}
        </h2>
      </div>
      <img
        src="https://placeimg.com/640/480/any"
        alt="Profile"
        class="w-16 h-16 rounded-full"
      />
    </div>
  </div>
  <Switch
    checked={statusMember}
    on:change={async (e) => {
      await setStatus(cardId, e.detail, index);
      statusMember = e.detail;
    }}
    class={`justify-center items-center self-end relative -top-16 right-4 rounded-full w-16 md:w-20 h-10 md:h-12 z-40 ${
      statusMember ? 'bg-green-600' : 'bg-neutral-600'
    } ${isHasPermission ? 'flex' : 'hidden'}`}
  >
    <span
      class={`inline-block w-8 md:w-9 h-8 md:h-9 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        statusMember
          ? 'translate-x-3 md:translate-x-4'
          : '-translate-x-3 md:-translate-x-4'
      }`}
      class:toggle-on={statusMember}
      class:toggle-off={!statusMember}
    />
  </Switch>
</div>
