<script>
  import ModalWrapperHeadless from '@comp/modals/modalWrapperHeadless.svelte';
  import { theme } from '@lib/profileTheme';
  import { currentTheme, profileTheme } from '@lib/stores/editorStore';

  export let handleSave, getProfile;
  // export let profile, deleteConnectionHandler, isLoading;
  let title;
  let isOpen = false;

  const modalHandler = () => (isOpen = !isOpen);

  const selectThemeHandler = async (t) => {
    $profileTheme = t;
    $currentTheme = theme[t];
    await handleSave();
    await getProfile();
  };
</script>

<div
  on:click={modalHandler}
  class="flex justify-between items-center hover:bg-neutral-800 transition-color duration-300 h-20 px-8 p-2 bg-neutral-900 text-neutral-100 border-neutral-700 border-2 cursor-pointer"
>
  <h1>Set theme</h1>
  <h1>
    {$profileTheme.charAt(0).toUpperCase() + $profileTheme.slice(1)}
  </h1>
</div>

{#if isOpen}
  <ModalWrapperHeadless
    desktopWidth="md:w-1/2 lg:w-1/3"
    desktopRight="md:right-1/4"
    desktopTop="md:top-[5%]"
    {isOpen}
    on:modalHandler={(e) => (isOpen = e.detail)}
    initialFocus={title}
  >
    <div
      class="flex justify-between items-center fixed z-50 w-full md:w-[425px] bg-neutral-800 pr-8 md:pr-2 h-12"
    >
      <h1 class="font-bold" bind:this={title}>Select Theme</h1>
      <button on:click={modalHandler}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="grid grid-cols-2 grid-flow-row gap-2 pt-16">
      {#each Object.keys(theme) as key}
        <div
          class={`flex flex-col ${
            $profileTheme !== key
              ? 'cursor-pointer hover:brightness-50'
              : 'cursor-default brightness-50'
          }`}
          on:click={() => {
            if ($profileTheme !== key) selectThemeHandler(key);
          }}
        >
          <div
            class={`${theme[key].pageBackground} h-80 rounded-lg w-full md:w-[95%] pt-3 p-2 gap-1 flex flex-col items-center`}
          >
            <div
              class={`h-16 ${
                key !== 'light' ? theme[key].secondary : 'bg-neutral-200'
              } w-full flex justify-center items-end rounded-lg`}
            >
              <div
                class={`w-12 h-12 rounded-lg translate-y-4 border-4 ${theme[key].border} ${theme[key].pageBackground}`}
              />
            </div>
            <!-- <div class={`h-3 w-3/4 ${theme[key].secondary} rounded-sm mt-5`} />
          <div class={`h-3 w-16 ${theme[key].secondary} rounded-sm`} />
          <div class={`h-3 w-16 ${theme[key].secondary} rounded-sm`} /> -->
            <div
              class={`h-20 w-full ${
                key !== 'light' ? theme[key].secondary : 'bg-neutral-200'
              } rounded-lg mt-7`}
            />
            <div
              class={`h-20 w-full ${
                key !== 'light' ? theme[key].secondary : 'bg-neutral-200'
              } rounded-lg`}
            />
          </div>
          <h1 class={`mt-2 ${$profileTheme === key ? 'font-bold' : ''}`}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </h1>
        </div>
      {/each}
    </div>
  </ModalWrapperHeadless>
{/if}
