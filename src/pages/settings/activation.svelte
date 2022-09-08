<script>
  import Spinner from '@comp/loading/spinner.svelte';
  export let value, isLoading;
</script>

<div class="flex gap-3">
  <div
    class="bg-neutral-800 rounded-lg p-4 w-full md:w-3/4 flex flex-col md:flex-row justify-between items-center"
  >
    <div class="flex flex-col gap-2 w-full md:w-auto">
      <h1 class="font-bold text-xl">Activation code</h1>
      <input
        on:keypress
        type="password"
        bind:value
        class="p-2 bg-neutral-700 rounded-md w-full"
        placeholder="Enter team's activation code"
      />
    </div>
    <button
      class="bg-blue-600 text-white rounded-md p-2 w-full mt-2 md:mt-0 md:w-40 mb-4 flex justify-center items-center gap-2 self-end"
      on:click
      >{#if isLoading}
        <Spinner class="w-4 h-4" />
      {/if} Submit</button
    >
  </div>
  <div
    class="bg-neutral-800 p-4 w-1/4 rounded-lg text-md lg:text-lg hidden md:flex"
  >
    <p class="mb-4">
      Atur activation code untuk digunakan ketika member baru melakukan
      aktivasi.
    </p>
  </div>
</div>
