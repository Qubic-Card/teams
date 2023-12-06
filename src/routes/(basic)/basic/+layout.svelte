<script>
  import CardOwnershipWrapper from "@comp/auth/cardOwnershipWrapper.svelte";
  import { goto } from "$app/navigation";

  let tabSelection = 0;
  let tabs = ["Profile", "Cards", "Analytics", "Database", "Events"];
  let icons = [
    "/icons/account-circle-outline.svg",
    "/icons/credit-card-chip-outline.svg",
    "/icons/chart-box-outline.svg",
    "/icons/download.svg",
    "/icons/calendar.svg",
  ];

  const handleSelectTab = (index) => {
    tabSelection = index;
    goto("/basic/" + tabs[index].toLowerCase());
  };


</script>

<CardOwnershipWrapper let:isMounted>
  <div class="text-black  w-full h-full">
    {#if isMounted}
      <div
        class="w-full lg:pt-2 lg:w-[65px] lg:space-y-3 mx-auto items-center lg:h-full h-20 left-0 lg:top-12 rounded-none lg:border grid grid-cols-4 lg:flex lg:flex-col fixed bottom-0 bg-white bg-opacity-80 lg:bg-opacity-100 backdrop-filter backdrop-blur-md z-40 shadow border-t border-neutral-200"
      >
        {#each tabs as tab, i}
          <div
            on:click={() => handleSelectTab(i)}
            class="{tabSelection == i
              ? 'bg-neutral-100 text-black'
              : ''} grid-span-1 cursor-pointer w-4/5 lg:w-10 lg:rounded-full rounded-lg text-sm flex flex-row justify-center items-center text-center lg:py-2 py-3 mx-3"
          >
            <img
              class={tabSelection == i ? "hidden lg:block" : "block"}
              src={icons[i]}
              alt="icons"
            />
            <p class="mx-1 lg:hidden">{tab}</p>
          </div>
        {/each}
      </div>
      <div class="lg:ml-[65px]">
        <slot />
      </div>
    {:else}
      <div class="bg-white h-screen w-screen" />
    {/if}
  </div>
</CardOwnershipWrapper>
