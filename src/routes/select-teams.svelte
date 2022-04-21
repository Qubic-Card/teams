<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { slide } from 'svelte/transition';

  let teams = ['Teams A'];

  const addTeam = (item) => (teams = [...teams, item]);

  const chooseTeam = () => {
    goto('/teams/dashboard');
  };
</script>

<div class="h-screen flex flex-col gap-2 justify-center items-center">
  <h1 class="text-2xl font-bold">Select team</h1>
  {#each teams as item}
    <div
      on:click={chooseTeam}
      transition:slide|local={{ duration: 500 }}
      class="border border-neutral-500 p-4 rounded-md w-96 cursor-pointer hover:bg-neutral-400 transition-colors duration-200"
    >
      {item}
    </div>
  {/each}
  <p class="cursor-pointer p-2" on:click={() => addTeam('Teams')}>+ add team</p>
</div>
