<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;

  const toProfileEditor = (slug) =>
    goto(`/${$page.params.slug}/members/${slug}`);
</script>

<div class="flex flex-col justify-between mx-4">
  <div
    class="w-full h-72 bg-neutral-800 p-4 cursor-pointer"
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
  </div>
  <Switch
    checked={member.isActive}
    on:change={(e) => (member.isActive = e.detail)}
    class={`flex justify-center items-center self-end relative -top-16 right-4 rounded-full w-20 z-40 h-12 ${
      member.isActive ? 'bg-green-600' : 'bg-neutral-600'
    }`}
  >
    <span
      class={`inline-block w-9 h-9 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        member.isActive ? 'translate-x-4' : '-translate-x-4'
      }`}
      class:toggle-on={member.isActive}
      class:toggle-off={!member.isActive}
    />
  </Switch>
</div>
