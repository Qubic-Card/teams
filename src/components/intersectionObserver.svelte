<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import {
    inView,
    linksInView,
    socialsInView,
  } from '@lib/stores/intersectingStore';

  export let section = 'avatar';
  export let id = 'avatar';

  let container;
  let observer;

  onMount(() => {
    function buildThresholdList() {
      let thresholds = [];
      let numSteps = 20;

      for (let i = 1.0; i <= numSteps; i++) {
        let ratio = i / numSteps;
        thresholds.push(ratio);
      }

      thresholds.push(0);

      return thresholds;
    }

    if (browser) {
      function handleIntersect(entries, observer) {
        entries.forEach((entry) => {
          if (section === 'socials') {
            // console.log('socials in view', entry.intersectionRatio);
            if (entry.intersectionRatio > 0.9 && entry.intersectionRatio < 0.95)
              $socialsInView = true;
            else $socialsInView = false;
          } else if (section === 'links') {
            // console.log('links in view', entry.intersectionRatio);
            if (entry.intersectionRatio > 0.8 && entry.intersectionRatio < 0.95)
              $socialsInView = true;
            else $socialsInView = false;

            if (entry.intersectionRatio > 0.95) $linksInView = true;
            else $linksInView = false;
          } else if (section === 'bio') {
            // console.log('bio in view', entry.intersectionRatio);
            if (entry.intersectionRatio > 0.95) $inView = true;
            else $inView = false;
          }

          // prevRatio = entry.intersectionRatio;
        });
      }

      const options = {
        root: null,
        threshold: buildThresholdList(),
        rootMargin: '0px',
      };
      observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(container);
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });
</script>

<div {id} bind:this={container}>
  <slot />
</div>
