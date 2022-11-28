<script>
  import { goto } from '$app/navigation';
  import { user } from '@lib/stores/userStore';
</script>

<svelte:head>
  <title>Qubic Card | Whoops</title>
</svelte:head>

<section class="text-white h-screen">
  <div class="container flex flex-col items-center px-5 py-8 mx-auto">
    <div
      class="flex flex-col justify-center items-center w-full mb-12 text-left lg:text-center"
    >
      <h1
        class="mb-12 text-4xl font-regular leading-none tracking-tighter lg:w-1/2 sm:text-6xl title-font"
      >
        Whoops!
      </h1>
      <p
        class="text-base font-medium leading-relaxed text-neutral-400 lg:w-1/2"
      >
        Nothing to see here ... maybe the page is no longer available, sorry
        about that :(
      </p>
      <button
        class="border-2 border-neutral-900 p-4 w-64 rounded-lg mt-8"
        on:click={() => goto('/')}
      >
        Go to login page
      </button>
    </div>
  </div>
</section>
