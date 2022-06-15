<script>
  export let currentPageRows, totalPages, page, active, setPage;
</script>

<div
  class={`justify-center my-4 ${
    currentPageRows.length === 0 || currentPageRows.length === 5
      ? 'hidden'
      : 'flex'
  }`}
>
  <div
    disabled={page === 0}
    class={`text-center pt-2 rounded-md cursor-pointer w-auto p-1 m-1 text-white border-2 border-neutral-700 ${
      active === 0
        ? 'text-neutral-200 bg-neutral-500 cursor-default'
        : 'hover:bg-neutral-800 hover:text-white'
    }`}
    on:click={() => setPage(page - 1)}
  >
    PREV
  </div>

  {#each totalPages as page, i}
    {#if i === active - 2 && i !== totalPages[0]}
      <div
        class="text-center rounded-md cursor-pointer w-auto p-2 m-1 text-black hover:bg-neutral-800 hover:text-white border-2 border-neutral-700"
        on:click={() => setPage(0)}
      >
        1
      </div>
    {/if}
    {#if i === active - 2 && i !== totalPages.length - 1}
      <span class="text-white self-end mx-1">...</span>
    {/if}
    {#if i === active}
      <div
        class={`text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-neutral-800 hover:text-white border-2 border-neutral-700 ${
          i === active ? 'bg-neutral-800 border-black text-white' : 'bg-white'
        }`}
        on:click={() => setPage(active)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active - 1}
      <div
        class="text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-neutral-800 hover:text-white border-2 border-neutral-700"
        on:click={() => setPage(active - 1)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active + 1}
      <div
        class="text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-neutral-800 hover:text-white border-2 border-neutral-700"
        on:click={() => setPage(active + 1)}
      >
        {i + 1}
      </div>
    {/if}
    {#if i === active + 1 && i !== totalPages.length - 1}
      <span class="text-white self-end mx-1">...</span>
    {/if}
    {#if i === active + 1 && i !== totalPages.length - 1}
      <div
        class="text-center cursor-pointer w-auto p-2 m-1 text-black hover:bg-neutral-800 hover:text-white border-2 border-neutral-700"
        on:click={() => setPage(totalPages.length - 1)}
      >
        {totalPages.length}
      </div>
    {/if}
  {/each}

  <div
    disabled={page === totalPages.length - 1}
    class={`text-center rounded-md pt-2 cursor-pointer w-auto p-1 m-1 text-white border-2 border-neutral-700 ${
      active === totalPages.length - 1
        ? 'text-neutral-200 bg-neutral-500 cursor-default'
        : 'hover:bg-neutral-800 hover:text-white'
    }`}
    on:click={() => setPage(page + 1)}
  >
    NEXT
  </div>
</div>
