<script>
  import Spinner from '@comp/loading/spinner.svelte';
  export let value, isLoading;
</script>

<div class="flex gap-3">
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 rounded-lg p-4 w-full md:w-3/4 flex flex-col justify-between items-center"
  >
    <h1 class="font-semibold text-sm md:text-xl self-start">Activation Code</h1>
    <div class="flex justify-between w-full md:flex-row flex-col md:mt-0 mt-6">
      <input
        on:input
        on:keypress
        type="password"
        bind:value
        class="p-2 bg-neutral-800 rounded-md md:w-56 w-full"
        placeholder="Enter team's activation code"
      />
      <button
        disabled={isLoading}
        class="bg-blue-600 text-white hover:bg-blue-600/60 disabled:bg-blue-600/60 rounded-md p-2 w-full mt-2 md:mt-0 md:w-40 flex justify-center items-center gap-2 self-end"
        on:click
        >{#if isLoading}
          <Spinner bg="#1f4496" size={10} class="w-6 h-6" />
        {/if} Submit</button
      >
    </div>
  </div>
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 p-4 w-1/4 rounded-lg text-md lg:text-lg hidden md:flex"
  >
    <p class="mb-4">
      Personalize your activation code to make it easier for new members to join while being secure.
    </p>
  </div>
</div>
