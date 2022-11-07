<script>
  import { tweened } from 'svelte/motion';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Confirmation from '@comp/modals/confirmation.svelte';
  import { sevenDays } from '@lib/utils/getDates';

  export let teamId, sevenDaysAfterEndDate;

  let isLoading = false;
  let showModal = false;

  const toggleModal = () => (showModal = !showModal);
  const handleLogout = async () => await supabase.auth.signOut();
  const toWhatsApp = () =>
    window.open('https://wa.me/628113087599', '_blank').focus();

  const setSubsEndDate = async () => {
    const { data, error } = await supabase
      .from('teams')
      .update(
        {
          subscription_end_date: new Date(sevenDays[4]).toISOString(),
        },
        { returning: 'minimal' }
      )
      .eq('id', teamId);

    if (error) {
      console.log(error);
      toastFailed('Something went wrong, please contact us');
    } else {
      location.reload();
    }
  };

  var expected = sevenDaysAfterEndDate.getTime();
  var now = new Date().getTime();
  let distance = tweened(expected - now);

  setInterval(() => {
    if ($distance > 0) {
      $distance -= 1000;
    }
  }, 1000);

  let hours;
  let minutes;
  let seconds;

  // $: days = Math.floor($distance / (1000 * 60 * 60 * 24));
  $: hours = Math.round($distance / (1000 * 60 * 60));
  $: minutes = Math.floor(($distance % (1000 * 60 * 60)) / (1000 * 60));
  $: {
    seconds = Math.floor(($distance % (1000 * 60)) / 1000);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
  }
</script>

<Confirmation
  {isLoading}
  isDispatch
  isTransfer
  heading="Are you sure to transfer everyone's"
  text="card to basic?"
  buttonLabel="Proceed"
  {showModal}
  {toggleModal}
  on:action={async () => await setSubsEndDate()}
/>

<div
  class="flex flex-col w-full h-full gap-8 text-white justify-center items-center p-10 md:p-0"
>
  <div class="flex flex-col text-center">
    <h1 class="text-2xl md:text-3xl font-bold">{hours}:{minutes}:{seconds}</h1>
    <h2 class="text-lg md:text-xl">Grace Period Duration</h2>
  </div>

  <div class="flex flex-col items-center gap-2 text-center">
    <h2 class="text-lg md:text-xl">Your Subscription has Ended</h2>
    <p class="text-md md:text-lg text-neutral-400">
      Your data will deleted after the probation ends
    </p>
    <div class="flex flex-col border-b-2 border-neutral-800 w-full pb-2 gap-2">
      <button
        class="bg-blue-600 rounded-md p-2 w-full text-sm md:text-md"
        on:click={toWhatsApp}>Renew Subscription</button
      >
      <button
        on:click
        class="bg-neutral-600/60 outline outline-1 outline-neutral-500 hover:outline-neutral-600 rounded-md p-2 w-full text-sm md:text-md"
        >Backup Team Data</button
      >
    </div>
    <button
      on:click={toggleModal}
      class="bg-red-600/30 outline outline-1 outline-red-500 hover:outline-red-600 rounded-md p-2 w-full text-sm md:text-md"
      >End Probation & Transfer Cards</button
    >
  </div>
</div>
