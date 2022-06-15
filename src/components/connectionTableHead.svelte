<script>
  import { createEventDispatcher } from 'svelte';

  export let data;

  const dispatch = createEventDispatcher();

  const sort = (item) => dispatch('sort', item);
</script>

{#each data as item}
  <th class={`pl-4 p-2 ${$$props.class}`}>
    <div class="flex justify-between">
      <p>{item.name}</p>
      <img
        src="https://img.icons8.com/android/96/ffffff/sort.png"
        alt=""
        class="w-4 h-4 ml-2 cursor-pointer"
        on:click={() => sort(item.id)}
      />
    </div>
  </th>
{/each}
