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
    let json;
    if (!isShowMetaImage) {
      return false;
    }
    
    try {
      const res = await fetch('/api/previewlink/' + encodeURIComponent(url));
      json = await res.json();
    } catch (error) {
      return false;
    }
    return json;
  };

  const teamClickHandler = async () => {
    window.open(url.startsWith('www') ? 'https://' + url : url).focus();
  };
</script>

<button
  class={`Container w-full rounded-md p-2 ${className}`}
  on:click={teamClickHandler}
>
  <div class="LowerContainer">
    {#await getMetadata() then data}
      <h3 class="font-bold my-2">{title ?? data.res.title}</h3>
      {#if data.res && isShowMetaImage}
        {#if data.res.images}
          <div
            class="Image mb-2"
            style={`background-image:url(${
              data.res ? data.res?.images[0] : null
            })`}
          />
        {/if}

        <span class="text-sm opacity-50 mt-3">{data.res.description ?? ''}</span
        >
        <div class="SiteDetails">
          {#if data.res.title}
            <span>{data.res.title} </span>
          {/if}
          <span>{data.res.url ?? 'url'}</span>
        </div>
      {/if}
    {/await}
  </div>
</button>

<style>
  .Image {
    animation-name: animateIn;
    animation-duration: 200ms;
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
