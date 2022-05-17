<script>
  export let background;
</script>

<div class={`flex text-xl rounded-full text-white ${$$props.class}`}>
  <img
    width={`${$$props.width}`}
    height={`${$$props.height}`}
    class={`rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover`}
    alt="A"
    src={background}
  />
</div>
