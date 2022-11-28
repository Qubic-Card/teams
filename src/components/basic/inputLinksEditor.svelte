<script>
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import Input from '@comp/input.svelte';
  import { basicLinks } from '@lib/stores/editorStore';

  export let item, i, handleSave, handleDeleteLink, handleUpLink;
</script>

<div class="p-3 flex">
  <div class="flex flex-col flex-grow">
    <Input
      inputbg="bg-neutral-100"
      inputText="text-black"
      on:change={handleSave}
      title="Title"
      placeholder="Title"
      bind:value={item.title}
    />
    <Input
      inputbg="bg-neutral-100"
      inputText="text-black"
      title="Link"
      on:change={handleSave}
      bind:value={item.link}
      isLinkInput={true}
      placeholder="Link"
      isEmptyChecking={true}
    />
  </div>
  <div class="mx-3 grid grid-cols-3 gap-3 place-items-center">
    <SwitchButton on:change={handleSave} bind:checked={item.isActive} />
    {#if i != 0}
      <img
        on:click={async () => {
          handleDeleteLink(item, $basicLinks);
          await handleSave();
        }}
        draggable="false"
        class="cursor-pointer"
        width="24"
        height="24"
        src="/icons/trash.svg"
        alt=""
      />
      <img
        on:click={async () => {
          handleUpLink(item, i, $basicLinks, item.isPersonal);
          await handleSave();
        }}
        draggable="false"
        class="cursor-pointer"
        width="24"
        height="24"
        src="/icons/arrow_up.png"
        alt=""
      />
    {/if}
  </div>
</div>
