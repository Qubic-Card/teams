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

  const getMetadata = async () => {
    const res = await fetch('/api/previewlink/' + encodeURIComponent(url));
    data = await res.json();
  };

  const teamClickHandler = async () => {
    window.open(url.startsWith('www') ? 'https://' + url : url).focus();
  };

  const proxyUrl = 'https://qubicrlp.herokuapp.com/v2';
  const placeholderImg =
    'https://images.unsplash.com/photo-1462556791646-c201b8241a94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1465&q=80';
</script>

<div class={`Container p-2 ${className}`} on:click={teamClickHandler}>
  <div class="LowerContainer">
    <h3 class="font-semibold my-2">{title ?? data.title}</h3>

    {#await getMetadata() then name}
      {#if isShowMetaImage}
        <div
          class="Image mb-2"
          style={`background-image:url(${
            data?.image != 'https://qubicrlp.herokuapp.com//img-placeholder.jpg'
              ? data?.images[0]
              : placeholderImg
          })`}
        />
      {/if}

      <span class="text-sm opacity-50 mt-3">{data.description ?? ''}</span>
      <div class="SiteDetails">
        {#if data.title}
          <span>{data.title} </span>
        {/if}
        <span>{data.url ?? 'url'}</span>
      </div>
    {/await}
  </div>
</div>

<style>
  .Image {
    animation-name: animateIn;
    animation-duration: 350ms;
    animation-delay: calc(var(--animation-order) * 100ms);
    animation-fill-mode: both;
    animation-timing-function: ease-in-out;
  }

  @keyframes animateIn {
    0% {
      opacity: 0;
      transform: scale(0.6) translateY(-8px);
    }

    100% {
      opacity: 1;
    }
  }
</style>
