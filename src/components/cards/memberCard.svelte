<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;
  export let isHasPermission;
  export let id;
  export let index;
  export let statusMember;

  let status = true;
  let statusMembers = null;

  const getMembersStatusCard = async () => {
    // let id = await getProfileId($user.id);
    const { data, error } = await supabase
      .from('team_cardcon')
      .select('status')
      .eq('team_member_id', id);

    if (error) console.log(error);

    if (data) {
      console.log(data[0].status);
      statusMembers = data[0].status;
      // statusMember = data;
    }
  };

  $: getMembersStatusCard();
  $: console.log(id);
  $: console.log(statusMembers);
  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);
</script>

<div class="flex flex-col justify-between mx-4">
  <div
    class="w-full h-72 bg-neutral-800 p-4 cursor-pointer"
    on:click={() => toProfileEditor(member.uid)}
  >
    <div class="flex justify-between">
      <div>
        <h1 class="text-4xl">
          {member.team_profile.firstname}
          {member.team_profile.lastname}
        </h1>
        <h2 class="text-3xl">{member.team_profile.job}</h2>
      </div>
      <img
        src={member.team_profile.avatar}
        alt="Profile"
        class="w-16 h-16 rounded-full"
      />
    </div>
  </div>
  <Switch
    checked={statusMembers
      ? statusMembers
      : statusMembers === undefined
      ? true
      : true}
    on:change={(e) => (status = e.detail)}
    class={`justify-center items-center self-end relative -top-16 right-4 rounded-full w-20 z-40 h-12 ${
      status ? 'bg-green-600' : 'bg-neutral-600'
    } ${isHasPermission ? 'flex' : 'hidden'}`}
  >
    <span
      class={`inline-block w-9 h-9 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        status ? 'translate-x-4' : '-translate-x-4'
      }`}
      class:toggle-on={status}
      class:toggle-off={!status}
    />
  </Switch>
</div>
