<script>
  import { Switch } from '@rgossiaux/svelte-headlessui';

  export let member;
</script>

<div class="flex flex-col justify-between w-full h-72 bg-neutral-400 p-4">
  <div>
    <h1 class="text-4xl">{member.name}</h1>
    <h2 class="text-3xl">{member.position}</h2>
  </div>
  <Switch
    checked={member.isActive}
    on:change={(e) => (member.isActive = e.detail)}
    class={`flex justify-center items-center self-end rounded-full w-24 h-12 ${
      member.isActive ? 'bg-green-500' : 'bg-neutral-300'
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
