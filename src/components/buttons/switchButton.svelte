<script>
  export let checked = false;
</script>

<label class="switch h-7">
  <input type="checkbox" bind:checked on:change />
  <span class="slider before:bottom-[5px] before:h-5 before:w-5 rounded-md" />
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
    left: 10px;
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
    transform: translateX(27px);
  }
</style>
