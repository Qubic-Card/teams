<script>
  import { role, setNewRole } from '@lib/stores/roleStore';

  export let checkboxes, checked;
  $: setNewRole(checked);
  $: console.log($role);
  $: console.log(checkboxes, checked);
</script>

{#each checkboxes as checkbox}
  <label>
    <input
      type="checkbox"
      class="form-check-input"
      bind:group={checked}
      value={checkbox.name}
    />
    {checkbox.name}
  </label>
{/each}
