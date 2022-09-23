<script>
  import { currentTheme } from '@lib/stores/editorStore';

  export let background;
</script>

<div class={`flex text-xl rounded-full text-white ${$$props.class}`}>
  <img
    width={`${$$props.width}`}
    height={`${$$props.height}`}
    class={`rounded-2xl aspect-square bg-black mx-auto border-8 ${$currentTheme.avatarBorder} object-cover`}
    alt="A"
    src={background}
  />
</div>
