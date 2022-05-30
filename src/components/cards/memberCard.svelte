<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;

  $: console.log(member);
  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);
</script>

<div
  class="flex flex-col justify-between w-full h-72 bg-neutral-800 p-4 cursor-pointer"
  on:click={() => toProfileEditor(member.uid)}
>
  <div class="flex">
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
  <Switch
    checked={member.isActive}
    on:change={(e) => (member.isActive = e.detail)}
    class={`flex justify-center items-center self-end rounded-full w-16 h-10 ${
      member.isActive ? 'bg-green-600' : 'bg-neutral-600'
    }`}
  >
    <span
      class={`inline-block w-8 h-8 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        member.isActive ? 'translate-x-3' : '-translate-x-3'
      }`}
      class:toggle-on={member.isActive}
      class:toggle-off={!member.isActive}
    />
  </Switch>
</div>
