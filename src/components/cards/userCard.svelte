<script>
	import { goto } from "$app/navigation";
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;
  export let team;

  const toProfileEditor = (slug) => goto(`/${team}/users/${slug}`);
</script>

<div class="flex flex-col justify-between w-full h-72 bg-neutral-800 p-4 cursor-pointer" on:click={() => toProfileEditor(member.uid)}>
  <div>
    <h1 class="text-4xl">{member.name}</h1>
    <h2 class="text-3xl">{member.position}</h2>
  </div>
  <Switch
    checked={member.isActive}
    on:change={(e) => (member.isActive = e.detail)}
    class={`flex justify-center items-center self-end rounded-full w-24 h-12 ${
      member.isActive ? 'bg-green-600' : 'bg-neutral-600'
    }`}
  >
    <span
      class={`inline-block w-10 h-10 bg-white rounded-full transition-transform duration-300 ease-in-out ${
        member.isActive ? 'translate-x-6' : '-translate-x-6'
      }`}
      class:toggle-on={member.isActive}
      class:toggle-off={!member.isActive}
    />
  </Switch>
</div>
