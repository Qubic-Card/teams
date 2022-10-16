<script>
  export let bg = '#000000';
  export let type = 'qbc';
  export let size = 18;
</script>

{#if type !== 'qbc'}
  <div
    style={`--border-color: #dedede; --bg: ${bg}; --size: ${size}px;`}
    class={`rounded-xl ${$$props.class}  box`}
  />
{:else}
  <div
    class={`animate-spin rounded-full ${$$props.class} border-t-2 border-b-2`}
  />
{/if}

<style>
  @property --angle {
    syntax: '<angle>';
    initial-value: 90deg;
    inherits: true;
  }

  :root {
    --angle: 90deg;
    --c2: black;
  }

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
  .box {
    position: relative;
    z-index: 0;
    /* border-radius: 35px; */
    overflow: hidden;
    padding: var(--size);
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
      linear-gradient(#00020202, #00020202),
      linear-gradient(#00020202, #00020202);
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
    background: var(--bg);
    border-radius: 10px;
  }
</style>
