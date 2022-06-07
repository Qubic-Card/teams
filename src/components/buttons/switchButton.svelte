<script>
    export let checked = false;
  </script>
  
  <style>
    .switch {
      position: relative;
      display: inline-block;
      width: 42px;
      height: 24px;
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
      border-radius: 22px;
    }
  
    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 50%;
    }
  
    input:checked + .slider {
      background-color: #13e251;
    }
  
    input:checked + .slider {
      box-shadow: 0 0 1px #13e251;
    }
  
    input:checked + .slider:before {
      -webkit-transform: translateX(19px);
      -ms-transform: translateX(23px);
      transform: translateX(19px);
    }
  </style>
  
  <label class="switch">
    <input type="checkbox" bind:checked on:change/>
    <span class="slider" />
  </label>