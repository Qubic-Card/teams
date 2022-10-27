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
  class="flex flex-col justify-between text-white gap-4 mb-8 pt-6 pl-16 md:pl-24 pr-4"
>
  <div class="flex flex-col">
    <h1 class="text-sm md:text-md font-bold">Quick Actions</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-16 lg:h-12 flex w-full overflow-x-auto mt-2 gap-2"
    >
      {#each quickActions as item}
        <div
          on:click={item.handler}
          class="flex justify-center items-center px-4 bg-neutral-800 rounded-md border border-neutral-700 snap-center h-12 text-xs md:text-sm text-center w-[130px] md:w-[180px] lg:w-[250px] flex-shrink-0 cursor-pointer"
        >
          {item.name}
        </div>
      {/each}
    </div>
  </div>

  <Analytics />

  <div class="flex flex-col">
    <h1 class="text-sm md:text-md font-bold">Learn More</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-full md:h-56 lg:h-full flex w-full overflow-x-auto gap-2"
    >
      {#each learnMoreContents as content}
        <div
          class="w-[350px] lg:w-[450px] py-4 cursor-pointer"
          on:click={() => window.open(content.url, '_blank').focus()}
        >
          <div
            class="bg-neutral-800 w-[350px] lg:w-[450px] h-full p-3 rounded-md"
          >
            <div class="Image" style={`background-image:url(${content.bg})`} />
            <h1 class="font-bold text-md my-2">{content.title}</h1>
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
