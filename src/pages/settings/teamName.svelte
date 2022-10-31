<script>
  import Spinner from '@comp/loading/spinner.svelte';

  export let value, loading;
  let isChanged = false;
</script>

<div class="flex gap-3">
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 rounded-lg p-4 w-full md:w-3/4 flex flex-col md:flex-row justify-between items-center"
  >
    <div class="flex flex-col gap-2 w-full md:w-auto">
      <h1 class="font-bold text-sm md:text-xl">Team Name</h1>
      <input
        on:input
        on:keypress
        bind:value
        class="p-2 bg-neutral-800 rounded-md w-full"
        placeholder="Enter team's activation code"
      />
    </div>
    <button
      disabled={loading || isChanged}
      class="bg-blue-600 hover:bg-blue-600/60 disabled:bg-blue-600/60 text-white rounded-md p-2 w-full mt-2 md:mt-0 md:w-40 flex justify-center items-center gap-2 self-end"
      on:click
      >{#if loading}
        <Spinner bg="#1f4496" size={10} class="w-6 h-6" />
      {/if} Submit</button
    >
  </div>
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 p-4 w-1/4 rounded-lg text-md lg:text-lg hidden md:flex"
  >
    <p class="mb-4">
      Atur nama tim agar mudah diingat dan mudah diidentifikasi.
    </p>
  </div>
</div>
