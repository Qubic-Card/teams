<script>
  import { currentTheme } from '@lib/stores/editorStore';
  import { inView } from '@lib/stores/intersectingStore';

  export let background;
</script>

<div class={`flex text-xl rounded-full text-white ${$$props.class}`}>
  <img
    width={`${$$props.width}`}
    height={`${$$props.height}`}
    class={`rounded-3xl aspect-square ${
      $currentTheme?.avatarBorder
    } bg-black -translate-x-0 duration-1000 ${
      $inView ? 'mx-auto' : 'mt-2 ml-4'
    } transitions-all transform border-8 object-cover`}
    alt="Avatar"
    src={background}
  />
</div>
