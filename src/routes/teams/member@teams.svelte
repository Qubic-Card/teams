<script>
  import MemberCard from './../../components/cards/memberCard.svelte';
  const members = [
    { name: 'John Doe', position: 'CEO', isActive: true },
    {
      name: 'Jane Doe',
      position: 'CFO',
      isActive: false,
    },
    {
      name: 'John Smith',
      position: 'CTO',
      isActive: true,
    },
    {
      name: 'Jane Smith',
      position: 'CMO',
      isActive: false,
    },
  ];
</script>

<div class="flex flex-col">
  <div class="flex justify-center items-center bg-neutral-700 w-full h-96">
    member
  </div>
  <div class="grid grid-cols-3 grid-flow-row gap-6 my-8">
    {#each members as member}
      <MemberCard {member} />
    {/each}
  </div>
</div>
