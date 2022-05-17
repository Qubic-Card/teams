<script>
  import { page } from '$app/stores';
  import UserCard from '@comp/cards/userCard.svelte';
  import { onMount } from 'svelte';

  const members = [
    { name: 'John Doe', position: 'CEO', isActive: true, uid: '1412' },
    {
      name: 'Jane Doe',
      position: 'CFO',
      isActive: false,
      uid: '2352323',
    },
    {
      name: 'John Smith',
      position: 'CTO',
      isActive: true,
      uid: '675636',
    },
    {
      name: 'Jane Smith',
      position: 'CMO',
      isActive: false,
      uid: '92830958',
    },
  ];
  let team = '';

  onMount(() => {
    if (localStorage.getItem('team')) {
      team = localStorage.getItem('team');
    }
  });
</script>

<div class="flex flex-col">
  <div class="flex justify-center items-center bg-neutral-800 w-full h-96">
    memberfsaf
  </div>
  <div class="grid grid-cols-3 grid-flow-row gap-6 my-8">
    {#each members as member}
      <UserCard {member} {team} />
    {/each}
  </div>
</div>
