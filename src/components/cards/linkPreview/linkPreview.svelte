<script>
  import './LinkPreview.css';

  import { fly } from 'svelte/transition';

  /**
   * The url for which the preview is to be rendered.
   */
  export let url;

  export let title;
  /**
   * The class you want to apply to the preview card container.
   */
  export let className = '';

  export let isShowMetaImage = false;

  let data;

  async function getMetadata(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
  }

  const teamClickHandler = async () => {
    window.open(url.startsWith('www') ? 'https://' + url : url).focus();
  };

  const proxyUrl = 'https://qubicrlp.herokuapp.com/v2';
  const placeholderImg =
    'https://images.unsplash.com/photo-1462556791646-c201b8241a94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1465&q=80';

  $: getMetadata(url);
</script>

<div class={`Container p-2 ${className}`} on:click={teamClickHandler}>
  <div class="LowerContainer">
    <h3 class="font-bold my-2">{title ?? data.title}</h3>

    {#if data}
      {#if isShowMetaImage}
        <div
          in:fly|local={{ y: 100, duration: 1000 }}
          class="Image mb-2"
          style={`background-image:url(${
            data?.image != 'https://qubicrlp.herokuapp.com//img-placeholder.jpg'
              ? data?.image
              : placeholderImg
          })`}
        />
      {/if}

      <span class="text-sm opacity-50 mt-3">{data.description ?? ''}</span>
      <div class="SiteDetails">
        {#if data.siteName}
          <span>{data.siteName} • </span>
        {/if}
        <span>{data.hostname ?? ''}</span>
      </div>
    {/if}
  </div>
</div>
