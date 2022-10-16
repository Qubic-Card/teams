<script>
  import { inView, isInViewTriggered } from '@lib/stores/intersectingStore';

  export let background, theme;
</script>

<div class="text-xl wrapper text-white {$$props.class}">
  <img
    width={$$props.width}
    height={$$props.height}
    class="rounded-3xl flex justify-items-center items-center aspect-square {$inView
      ? 'mx-auto'
      : 'mt-2 ml-4'} {theme === undefined
      ? ''
      : `${theme?.avatarBorder} border-8`} object-cover"
    class:growup={$inView && $isInViewTriggered}
    class:shrink={!$inView}
    alt="Avatar"
    src={background ?? '/favicon.svg'}
  />
</div>

<style>
  .growup {
    animation: growup 1s linear 1;
  }

  .shrink {
    animation: shrink 1s linear 1;
  }

  @keyframes shrink {
    0% {
      transform: translate(140px, 30px) scale(1.5);
    }

    100% {
      transform: translateX(0px) translateY(0px);
    }
  }

  @keyframes growup {
    0% {
      transform: translateX(-160px) translateY(-40px) scale(0.5);
    }

    100% {
      transform: translateX(0px) translateY(0px);
    }
  }
</style>
