<script lang="ts">
  import { page } from '$app/stores';
  import { toastSuccess } from '@lib/utils/toast';

  const copyCode = () => {
    navigator.clipboard.writeText(
      `https://editor.qubic.id?team_id=${$page.params.slug}`
    );
    toastSuccess('Registration link copied');
  };
</script>

<div class="gap-3 flex">
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 rounded-lg p-4 w-full md:w-3/4"
  >
    <div class="flex flex-row justify-between items-center gap-2 h-full">
      <h1 class="font-semibold text-sm md:text-xl">Registration Link</h1>
      <div class="gap-2 flex">
        <button
          class="p-2 sm:w-32 md:w-40 hover:bg-blue-600/60 bg-blue-600 text-white rounded-md text-xs"
          on:click={copyCode}>Copy</button
        >
      </div>
    </div>
  </div>
  <div
    class="bg-neutral-900 outline outline-1 outline-neutral-800 p-4 w-1/4 rounded-lg text-md lg:text-lg hidden md:flex"
  >
    <p class="mb-4">Copy and use the link to add new members.</p>
  </div>
</div>
