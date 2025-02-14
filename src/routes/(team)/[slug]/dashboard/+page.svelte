<script>
  import { user, userData } from '@lib/stores/userStore';
  import Analytics from '@pages/analytics.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { learnMoreContents } from '@lib/constants';
  import { toastFailed } from '@lib/utils/toast';

  let permissions = {
    writeMembers: false,
    writeProfile: false,
  };

  $: $userData?.filter((item) => {
    if (item === 'allow_write_members') {
      permissions.writeMembers = true;
    }
    if (item === 'allow_write_profile') {
      permissions.writeProfile = true;
    }
  });

  const quickActions = [
    {
      handler: () =>
        !permissions.writeMembers
          ? toastFailed('You do not have access to this page')
          : goto(`/${$page.params.slug}/members`),
      name: 'Manage Members',
    },
    {
      handler: () =>
        !permissions.writeProfile
          ? toastFailed('You do not have access to this page')
          : goto(`/${$page.params.slug}/members/${$user.id}`),
      name: 'Edit profile',
    },
  ];
</script>

<div
  class="flex flex-col justify-between text-white gap-4 mb-10 md:mb-4 pt-6 pl-4 md:pl-24 pr-4"
>
  <div class="flex flex-col">
    <h1 class="text-sm md:text-lg font-semibold">Quick Actions</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory flex w-full overflow-x-auto mt-2 gap-2"
    >
      {#each quickActions as item}
        <button
          on:click={item.handler}
          class="flex justify-center items-center py-3 px-4 bg-neutral-900 rounded-md border  border-neutral-800 snap-center  text-xs md:text-sm text-center w-[130px] md:w-[180px] lg:w-[250px]  cursor-pointer"
        >
          {item.name}
  </button>
      {/each}
    </div>
  </div>

  <Analytics />

  <div class="flex flex-col">
    <h1 class="text-sm md:text-lg font-semibold">Learn More</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-full md:h-56 lg:h-full flex w-full overflow-x-auto gap-2"
    >
      {#each learnMoreContents as content}
        <div
          class="w-[350px] lg:w-[450px] py-4 cursor-pointer"
          on:click={() => window.open(content.url, '_blank').focus()}
        >
          <div
            class="bg-neutral-900 w-[350px] lg:w-[450px] h-full p-3 rounded-md outline outline-1 outline-neutral-800"
          >
            <div class="Image" style={`background-image:url(${content.bg})`} />
            <h1 class="font-semibold text-md my-2">{content.title}</h1>
            <p class="text-neutral-400 text-xs md:text-sm">{content.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .snap-container::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }
  .snap-container::-webkit-scrollbar-track {
    background-color: #e4e4e4;
  }
  .snap-container::-webkit-scrollbar-thumb {
    background-color: #71717a;
  }
</style>
