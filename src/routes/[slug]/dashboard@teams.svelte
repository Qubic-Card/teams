<script>
  const quickActions = [
    'Add new member',
    'Analyze BI',
    'Manage billing',
    'Edit profile',
    'Add new member',
    'Analyze BI',
    'Manage billing',
    'Edit profile',
  ];
  let learn = [
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
    'How to use Qubic',
  ];
  let banner =
    'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80';
</script>

<div class="flex flex-col justify-between text-white gap-4 mb-8">
  <div
    class="flex p-12 items-center text-4xl font-bold w-full h-56 rounded-xl bg-gradient-to-bl from-green-500 to-blue-500"
  >
    Dapatkan kartu terbaru qubic
  </div>
  <div class="flex flex-col mt-8">
    <h1 class="text-2xl font-bold">Quick Actions</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-24 lg:h-32 flex w-full overflow-x-auto mt-8 gap-2"
    >
      {#each quickActions as item}
        <div
          class="flex justify-center items-center bg-neutral-800 p-4 rounded-lg snap-center text-center w-[150px] md:w-[200px] lg:w-[300px] flex-shrink-0 cursor-pointer mb-3"
        >
          {item}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col mt-8">
    <h1 class="text-2xl font-bold">Learn More</h1>
    <div
      class="snap-container snap-x mx-auto snap-mandatory h-52 md:h-56 lg:h-80 flex w-full overflow-x-auto mt-8 gap-2"
    >
      {#each learn as item}
        <div
          class="flex flex-col bg-neutral-800 p-4 rounded-lg snap-center w-[250px] md:w-[350px] lg:w-[500px] flex-shrink-0 cursor-pointer mb-3"
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
