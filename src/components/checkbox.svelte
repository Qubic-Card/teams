<script>
  import { role, setNewRole } from '@lib/stores/roleStore';

  export let checkboxes, checked;
  $: setNewRole(checked);
  $: console.log($role);
  $: console.log(checked);
</script>

{#each checkboxes as checkbox}
  <div
    class="flex w-full justify-between items-center bg-neutral-800 p-4 rounded-lg mb-2"
  >
    <div class="block">
      <div class="mt-2">
        <label>
          <input
            type="checkbox"
            class="form-check-input"
            bind:group={checked}
            value={checkbox.name}
          />
          {checkbox.name}
        </label>
      </div>
    </div>
    <p class="w-1/2">
      {checkbox.desc}
    </p>
  </div>
{/each}
