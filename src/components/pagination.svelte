<script>
  export let currentPageRows;
  export let totalPages;
  export let page;
  export let active;
  export let setPage;
  export let subscriptionType;
</script>

<div
  class={`justify-center mt-4 mb-20 ${
    currentPageRows.length === 0
      ? 'hidden'
      : subscriptionType === 'basic'
      ? 'hidden'
      : 'flex'
  }`}
>
  <div
    disabled={page === 0}
    class={`text-center pt-2 rounded-lg cursor-pointer w-auto p-1 m-1 text-black border-2 border-neutral-300 ${
      active === 0
        ? 'text-neutral-200 cursor-default'
        : 'hover:bg-black hover:text-white'
    }`}
    on:click={() => setPage(page - 1)}
  >
    PREV
  </div>

  {#each totalPages as page, i}
    {#if i === active - 2 && i !== totalPages[0]}
      <div
        class="text-center rounded-lg cursor-pointer w-auto p-2 m-1 text-black hover:bg-black hover:text-white border-2 border-neutral-300"
        on:click={() => setPage(0)}
      >
        1
      </div>
    {/if}
    {#if i === active - 2 && i !== totalPages.length - 1}
      <span class="text-black self-end mx-1">...</span>
    {/if}
    {#if i === active}
      <div
        class={`text-center rounded-lg cursor-pointer w-9 p-2 m-1 text-black hover:bg-black hover:text-white border-2 border-neutral-300 ${
          i === active ? 'bg-black border-black text-white' : 'bg-white'
        }`}
        on:click={() => setPage(active)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active - 1}
      <div
        class="text-center rounded-lg cursor-pointer w-9 p-2 m-1 text-black hover:bg-black hover:text-white border-2 border-neutral-300"
        on:click={() => setPage(active - 1)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active + 1}
      <div
        class="text-center rounded-lg cursor-pointer w-9 p-2 m-1 text-black hover:bg-black hover:text-white border-2 border-neutral-300"
        on:click={() => setPage(active + 1)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active + 1 && i !== totalPages.length - 1}
      <span class="text-black self-end mx-1">...</span>
    {/if}
    {#if i === active + 1 && i !== totalPages.length - 1}
      <div
        class="text-center cursor-pointer w-auto p-2 m-1 text-black hover:bg-black hover:text-white border-2 border-neutral-300"
        on:click={() => setPage(totalPages.length - 1)}
      >
        {totalPages.length}
      </div>
    {/if}
  {/each}

  <div
    disabled={page === totalPages.length - 1}
    class={`text-center rounded-lg pt-2 cursor-pointer w-auto p-1 m-1 text-black border-2 border-neutral-300 ${
      active === totalPages.length - 1
        ? 'text-neutral-200 cursor-default'
        : 'hover:bg-black hover:text-white'
    }`}
    on:click={() => setPage(page + 1)}
  >
    NEXT
  </div>
</div>
