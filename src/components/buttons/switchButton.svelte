<script>
  export let checked = false;
  export let mode = 'editor';
</script>

<label class="switch {mode === 'editor' ? 'h-7' : 'h-6'}">
  <input type="checkbox" bind:checked on:change />
  <span
    class="slider rounded-md before:h-5 before:w-5 {mode === 'editor'
      ? 'before:bottom-[5px]'
      : 'before:bottom-[2px]'}"
  />
</label>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 65px;
    /* height: 25px; */
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    /* border-radius: 10px; */
  }

  .slider:before {
    position: absolute;
    content: '';
    /* height: 20px;
    width: 20px; */
    left: 15px;
    /* bottom: px; */
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #65ec8e;
  }

  input:checked + .slider {
    box-shadow: 0 0 1px #65ec8e;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(19px);
    -ms-transform: translateX(23px);
    transform: translateX(19px);
  }
</style>
