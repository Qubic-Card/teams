<script>
  import { toastFailed } from '@lib/utils/toast';

  const dummy = [
    { percentage: '20', data: 3, type: 'Active' },
    {
      percentage: '30',
      data: 2,
      type: 'Contacts',
    },
    {
      percentage: '40',
      data: 1,
      type: 'Taps',
    },
  ];

  const topics = [
    'Cunsumer Behavior',
    'Team Performance',
    'Performa Penjualan',
    'Performa Lapangan',
    'Top Performer',
    'Coming Soon',
  ];
  let selectedTopic = null;
  let state = 'idle';

  const selectTopic = (topic) => (selectedTopic = topic);
  const setState = (newState) => (state = newState);
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex justify-between gap-4">
    {#each dummy as item}
      <div
        class="flex flex-col justify-between w-full h-72 bg-neutral-800 first:bg-gradient-to-bl from-blue-500 to-green-500 first:hover:bg-gradient-to-tr hover:from-blue-500 hover:to-green-500 transform transition duration-200 rounded-lg p-6"
      >
        <p class="text-4xl self-end text-green-600">^ {item.percentage}%</p>
        <div>
          <h1 class="text-4xl">{item.data} <span>{item.type}</span></h1>
          <h2 class="text-2xl">in 7 days</h2>
        </div>
      </div>
    {/each}
  </div>
  <div
    class="flex flex-col w-full h-full bg-neutral-800 my-4 rounded-lg p-8 justify-between"
  >
    {#if state === 'idle'}
      <h1 class="text-2xl">Select topics</h1>
      <div
        class="grid grid-cols-3 grid-rows-2 gap-4 mt-8 border-b-2 border-neutral-700 pb-32"
      >
        {#each topics as item}
          <button
            on:click={() => selectTopic(item)}
            class={`border-2 border-neutral-700 hover:bg-neutral-900 text-xl rounded-lg w-full p-4 ${
              selectedTopic === item ? 'bg-neutral-700' : ''
            }`}>{item}</button
          >
        {/each}
      </div>
      <!-- <button class="btn-grad">asfasfaf</button> -->
      <button
        class="self-end bg-white p-4 w-80 text-black mt-8 text-xl"
        on:click={() => {
          if (selectedTopic === null) {
            toastFailed('Please select a topic first');
          } else {
            setState('analyze');
          }
        }}
      >
        Power Analyze
      </button>
    {:else}
      <div class="flex justify-between h-24 border-b border-neutral-700 pb-8">
        <button
          class="border-2 border-neutral-700 hover:bg-neutral-700 text-xl rounded-lg w-96 h-full p-4"
          >{selectedTopic}
        </button>
        <button class="self-end bg-white p-4 w-80 h-full text-black text-xl">
          Power Analyze
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .btn-grad {
    background-image: linear-gradient(
      to right,
      #4cb8c4 0%,
      #3cd3ad 51%,
      #4cb8c4 100%
    );
    margin: 10px;
    padding: 15px 45px;
    text-align: center;
    text-transform: uppercase;
    transition: 0.5s;
    background-size: 200% auto;
    color: white;
    box-shadow: 0 0 20px #eee;
    border-radius: 10px;
    display: block;
  }

  .btn-grad:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
</style>
