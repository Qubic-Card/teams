<script>
  import { goto } from '$app/navigation';
  import './LinkPreview.css';
  import { fly } from 'svelte/transition';

  /**
   * The url for which the preview is to be rendered.
   */
  export let url;
  export let isShowMetaImage;
  export let title;
  /**
   * The class you want to apply to the preview card container.
   */
  export let className = '';

  let data;
  let isLoading = false;

  async function getMetadata(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    isLoading = true;
    try {
      const metadata = await fetch(`${proxyUrl}?url=${url}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((r) => r.metadata);
      data = metadata;
    } catch (error) {
      data = null;
    }

    isLoading = false;
  }
  async function clickHandler(e) {
    await goto(url);
  }
  const proxyUrl = 'https://qubicrlp.herokuapp.com/v2';
  const placeholderImg =
    'https://images.unsplash.com/photo-1462556791646-c201b8241a94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1465&q=80';

  $: getMetadata(url);
</script>

<div class={`Container ${className}`} on:click={clickHandler}>
  {#if isLoading}
    <div class="animate-pulse w-64 flex flex-col justify-center gap-2 pt-4">
      {#if isShowMetaImage}
        <div class="bg-neutral-700 h-40 w-full rounded-md" />
      {/if}
      <div class="bg-neutral-700 h-8 w-1/2 rounded-md" />
      <div class="bg-neutral-700 h-8 w-1/3 rounded-md" />
      <div class="bg-neutral-700 h-8 w-1/3 rounded-md" />
    </div>
  {:else if !data}
    <h3 class=" font-bold my-2">{title ?? data.title}</h3>
  {:else}
    {#if isShowMetaImage}
      {#if data.image}
        <div
          transition:fly|local={{ y: 100, duration: 2000 }}
          class="Image"
          style={`background-image:url(${
            data.image != 'https://qubicrlp.herokuapp.com//img-placeholder.jpg'
              ? data.image
              : placeholderImg
          })`}
        />
      {/if}
    {/if}
    <div class="LowerContainer">
      <h3 class=" font-bold my-2">{title ?? data.title}</h3>
      {#if data.description}
        <span class="text-sm opacity-50">{data.description}</span>
      {/if}
      <div class=" SiteDetails">
        {#if data.siteName}
          <span>{data.siteName} • </span>
        {/if}
        <span>{data.hostname ?? ''}</span>
      </div>
    </div>
  {/if}
</div>
