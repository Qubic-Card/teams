<script>
  export let setPage, page, maxPage;
  export let editor = 'team';

  let btnHover =
    editor === 'team'
      ? 'hover:bg-black hover:text-white'
      : 'hover:bg-black hover:text-white';
  let btnText = editor === 'team' ? 'text-white' : 'text-black';
  let btnActive = editor === 'team' ? 'text-black' : 'text-white';
  let btnDisabled =
    editor === 'team'
      ? 'text-neutral-200 bg-black/50'
      : 'bg-black/80 text-white';
</script>

{#if maxPage > 0}
  <div class={`justify-center my-4 flex`}>
    <button
      disabled={page === 0}
      class="text-center rounded-md cursor-pointer w-auto p-1 m-1 disabled:cursor-default {btnText} border-2 border-neutral-700 {page ===
      0
        ? btnDisabled
        : btnHover}"
      on:click={() => setPage(page - 1)}
    >
      PREV
    </button>

    {#each Array(maxPage) as item, i}
      {#if i === page - 2}
        <button
          class="text-center rounded-md cursor-pointer w-9 m-1 {btnText} {btnHover} border-2 border-neutral-700"
          on:click={() => setPage(0)}
        >
          1
        </button>
      {/if}
      {#if maxPage > 3}
        {#if i === page - 2 && i !== maxPage - 1}
          <span class="{btnText} self-end mx-1">...</span>
        {/if}
      {/if}
      {#if i === page - 1}
        <button
          class="text-center rounded-md cursor-pointer w-9 m-1 {btnText} {btnHover} border-2 border-neutral-700"
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}
      {#if i === page}
        <button
          class="text-center rounded-md cursor-pointer w-9 m-1 {btnText} {btnActive} bg-black {btnHover} border-2 border-neutral-700"
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}

      {#if i === page + 1 && i !== maxPage}
        <button
          class="text-center rounded-md cursor-pointer w-9 m-1 {btnText} {btnHover} border-2 border-neutral-700"
          on:click={() => setPage(i)}
        >
          {i + 1}
        </button>
      {/if}
      {#if maxPage > 3}
        {#if i === page + 1 && i !== maxPage - 2 && i !== maxPage - 1}
          <span class="{btnText} self-end mx-1">...</span>
        {/if}
      {/if}
      {#if i === page + 2}
        <button
          class="text-center rounded-md w-9 cursor-pointer m-1 {btnText} {btnHover} border-2 border-neutral-700"
          on:click={() => setPage(maxPage - 1)}
        >
          {maxPage}
        </button>
      {/if}
    {/each}

    <button
      disabled={page === maxPage - 1}
      class="text-center rounded-md cursor-pointer w-auto p-1 m-1 disabled:cursor-default {btnText} border-2 border-neutral-700 ${page ===
      maxPage - 1
        ? btnDisabled
        : btnHover}"
      on:click={() => setPage(page + 1)}
    >
      NEXT
    </button>
  </div>
{/if}
