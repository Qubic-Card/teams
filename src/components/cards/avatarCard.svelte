<script>
  import { inView, isInViewTriggered } from '@lib/stores/intersectingStore';
  import { onMount } from 'svelte';

  export let background, theme;

  // $: console.log($isInViewTriggered);

  // $: if (!$inView) $isInViewTriggered = true;
</script>

<div class="text-xl wrapper text-white {$$props.class}">
  <img
    width={$$props.width}
    height={$$props.height}
    class="flex justify-items-center items-center aspect-square {$inView
      ? 'mx-auto rounded-3xl border-8'
      : 'mt-2 ml-4 rounded-2xl border-4'} {theme === undefined
      ? ''
      : `${theme?.avatarBorder}`} object-cover"
    class:growup={$inView}
    class:shrink={!$inView}
    alt="Avatar"
    src={background ?? '/favicon.svg'}
  />
</div>

<style>
  .growup {
    animation: growup 1s linear 1;
    -webkit-animation: growup 1s linear 1;
  }

  .shrink {
    animation: shrink 1s linear 1;
    -webkit-animation: shrink 1s linear 1;
  }

  .fadeIn {
    animation: fadeIn 0.5s linear 1;
    -webkit-animation: fadeIn 0.5s linear 1;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes shrink {
    0% {
      transform: translate(150px, 60px) scale(1.8);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }

  @-webkit-keyframes growup {
    0% {
      transform: translateX(-150px) translateY(-40px) scale(0.5);
    }
    100% {
      transform: translateX(0px) translateY(0px);
    }
  }

  @keyframes shrink {
    0% {
      transform: translate(150px, 60px) scale(1.8);
      /* -webkit-transform: translate(122px, 60px) scale(2); */
    }

    100% {
      transform: translateX(0px) translateY(0px);
      /* -webkit-transform: translateX(0px) translateY(0px); */
    }
  }

  @keyframes growup {
    0% {
      transform: translateX(-150px) translateY(-40px) scale(0.5);
      /* -webkit-transform: translateX(-120px) translateY(-40px) scale(0.5); */
    }

    100% {
      transform: translateX(0px) translateY(0px);
      /* -webkit-transform: translateX(0px) translateY(0px); */
    }
  }
</style>
