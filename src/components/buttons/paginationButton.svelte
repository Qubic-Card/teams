<script>
  export let currentPageRows = [];
  export let setPage, page, maxPage;

  let pages = [];

  $: for (let i = 0; i < maxPage; i++) {
    pages = [...pages, i];
  }

  $: console.log(pages);
  $: console.log(page);
  $: console.log(maxPage);
</script>

{#if pages.length > 0}
  <div class={`justify-center my-4 flex`}>
    <button
      disabled={page === 0}
      class={`text-center rounded-md cursor-pointer w-auto p-1 m-1 disabled:cursor-default text-white border-2 border-neutral-700 ${
        page === 0
          ? 'text-neutral-200 bg-black/50'
          : 'hover:bg-black/70 hover:text-white'
      }`}
      on:click={() => setPage(page - 1)}
    >
      PREV
    </button>

    {#each pages as activePage, i}
      {#if i === page - 2}
        <button
          class="text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-black/70 hover:text-white border-2 border-neutral-700"
          on:click={() => setPage(pages[0])}
        >
          1
        </button>
      {/if}
      {#if i === page - 2 && i !== pages.length - 1}
        <span class="text-white self-end mx-1">...</span>
      {/if}
      {#if i === page - 1}
        <button
          class="text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-black/70 hover:text-white border-2 border-neutral-700"
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}
      {#if i === page}
        <button
          class={`text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white bg-black hover:bg-black/70 hover:text-white border-2 border-neutral-700 `}
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}

      {#if i === page + 1 && i !== maxPage}
        <button
          class="text-center rounded-md cursor-pointer w-9 p-2 m-1 text-white hover:bg-black/70 hover:text-white border-2 border-neutral-700"
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}
      {#if i === page + 1 && i !== pages.length - 2 && i !== pages.length - 1}
        <span class="text-white self-end mx-1">...</span>
      {/if}
      {#if i === page + 2}
        <button
          class="text-center rounded-md w-9 cursor-pointer p-2 m-1 text-white hover:bg-black/70 hover:text-white border-2 border-neutral-700"
          on:click={() => setPage(pages[pages.length - 1])}
        >
          {maxPage}
        </button>
      {/if}
    {/each}

    <button
      disabled={page === maxPage - 1}
      class={`text-center rounded-md cursor-pointer w-auto p-1 m-1 disabled:cursor-default text-white border-2 border-neutral-700 ${
        page === maxPage - 1
          ? 'text-neutral-200 bg-black/50 '
          : 'hover:bg-black/70 hover:text-white'
      }`}
      on:click={() => setPage(page + 1)}
    >
      NEXT
    </button>
  </div>
{/if}
