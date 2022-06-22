<script>
  import { user, userData } from '@lib/stores/userStore';
  import Analytics from '@pages/analytics.svelte';
  import QuickActionsModal from '@comp/modals/quickActionsModal.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let isHasPermissionToMemberPage = false;
  let isHasPermissionToAnalyticsPage = false;
  let isHasPermissionToEditProfilePage = false;
  let showModal = false;

  $: $userData?.filter((item) => {
    if (item === 'allow_write_members') {
      isHasPermissionToMemberPage = true;
    }
    if (item === 'allow_read_analytics') {
      isHasPermissionToAnalyticsPage = true;
    }
    if (item === 'allow_write_profile') {
      isHasPermissionToEditProfilePage = true;
    }
  });

  const quickActions = [
    {
      handler: () =>
        isHasPermissionToMemberPage === false
          ? (showModal = true)
          : goto(`/${$page.params.slug}/members`),
      name: 'Add new member',
    },
    {
      handler: () =>
        isHasPermissionToAnalyticsPage === false
          ? (showModal = true)
          : goto(`/${$page.params.slug}/analytics`),
      name: 'Analyze BI',
    },
    {
      handler: () =>
        isHasPermissionToAnalyticsPage === false
          ? (showModal = true)
          : goto(`/${$page.params.slug}/analytics`),
      name: 'Manage billing',
    },
    {
      handler: () =>
        isHasPermissionToEditProfilePage === false
          ? (showModal = true)
          : goto(`/${$page.params.slug}/members/${$user.id}`),
      name: 'Edit profile',
    },
  ];
  let learn = [
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
  ];
  let banner =
    'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80';

  const modalHandler = () => (showModal = !showModal);
</script>

<div
  class="flex flex-col justify-between text-white gap-4 mb-8 pt-4 pl-24 pr-4"
>
  <div class="flex flex-col">
    <QuickActionsModal {showModal} on:showModal={modalHandler} />
    <h1 class="text-2xl font-bold">Quick Actions</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-24 lg:h-32 flex w-full overflow-x-auto mt-8 gap-2"
    >
      {#each quickActions as item}
        <div
          on:click={item.handler}
          class="flex justify-center items-center bg-neutral-800 p-4 rounded-lg snap-center text-center w-[130px] md:w-[180px] lg:w-[250px] flex-shrink-0 cursor-pointer mb-3"
        >
          {item.name}
        </div>
      {/each}
    </div>
  </div>

  <Analytics />

  <div class="flex flex-col mt-4">
    <h1 class="text-2xl font-bold">Learn More</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-52 md:h-56 lg:h-80 flex w-full overflow-x-auto mt-8 gap-2"
    >
      {#each learn as item}
        <div
          class="flex flex-col bg-neutral-800 p-4 rounded-lg snap-center w-[250px] md:w-[350px] lg:w-[450px] flex-shrink-0 cursor-pointer mb-3"
        >
          <img
            src={banner}
            alt=""
            class="w-full h-28 md:h-32 lg:h-48 rounded-lg"
          />
          <h1 class="text-xl lg:text-2xl mt-4">{item}</h1>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .snap-container::-webkit-scrollbar {
    height: 10px;
  }
  .snap-container::-webkit-scrollbar-track {
    background-color: #e4e4e4;
  }
  .snap-container::-webkit-scrollbar-thumb {
    background-color: #71717a;
  }
</style>
