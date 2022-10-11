<script>
  import { inView } from '@lib/stores/intersectingStore';

  export let background, theme;
</script>

<div class="text-xl wrapper text-white {$$props.class}">
  {#if $inView}
    <img
      width={$$props.width}
      height={$$props.height}
      class="rounded-3xl flex justify-items-center items-center aspect-square mx-auto {theme ===
      undefined
        ? ''
        : `${theme?.avatarBorder} border-8`} object-cover"
      class:bigger={$inView}
      alt="Avatar"
      src={background ?? '/favicon.svg'}
    />
  {:else}
    <img
      width={$$props.width}
      height={$$props.height}
      class="rounded-3xl flex justify-items-center items-center aspect-square mt-2 ml-4 {theme ===
      undefined
        ? ''
        : `${theme?.avatarBorder} border-8`} object-cover"
      class:smaller={!$inView}
      alt="Avatar"
      src={background ?? '/favicon.svg'}
    />
  {/if}
</div>

<style>
  @property --angle {
    syntax: '<angle>';
    initial-value: 90deg;
    inherits: true;
  }

  .bigger {
    animation: flyAndBigger 1s linear 1;
  }

  .smaller {
    animation: flyAndSmaller 1s linear 1;
  }

  @keyframes flyAndSmaller {
    0% {
      transform: translate(140px, 30px) scale(1.5);
    }

    100% {
      transform: translateX(0px) translateY(0px);
    }
  }

  @keyframes flyAndBigger {
    0% {
      transform: translateX(-160px) translateY(-40px) scale(0.5);
    }

    100% {
      transform: translateX(0px) translateY(0px);
    }
  }

  :root {
    --angle: 90deg;
    --c2: black;
  }

  /* .bodx {
    border-image: conic-gradient(
        from var(--angle),
        #020202 0deg 180deg,
        var(--border-color) 180deg 270deg,
        var(--border-color) 270deg 360deg
      )
      1;

    border-radius: 20px;
    animation: borderRotate 500ms linear infinite forwards;
  }

  @keyframes borderRotate {
    100% {
      --angle: 420deg;
    }
  } */

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  .box {
    position: relative;
    z-index: 0;
    border-radius: 35px;
    overflow: hidden;
    padding: 2rem;
  }
  .box::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient(var(--border-color), var(--border-color)),
      linear-gradient(var(--border-color), var(--border-color)),
      linear-gradient(#020202, #020202), linear-gradient(#020202, #020202);
    animation: rotate 500ms linear infinite;
  }
  .box::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: black;
    border-radius: 35px;
  }
</style>
