<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db.js';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';

  $user = false;
  let loading = false;
  let password = '';

  const handleResetPassword = async () => {
    if (password.length < 8) {
      toastFailed('Password needs to be more than 8 characters');
      return;
    } else if (!isContainNumber) {
      toastFailed('Password needs to contain at least one number');
      return;
    } else {
      try {
        loading = true;
        const { error, data } = await supabase.auth.api.updateUser(
          $page.url.searchParams.get('reset'),
          { password: password }
        );
        if (error) throw error;
        toastSuccess('Password changed');
        loading = false;
        await goto('/');
      } catch (error) {
        toastFailed(error.error_description || error.message);
        loading = false;
      }
    }
  };

  let isContainNumber = false;

  const passwordMustNumberRegex = () => {
    const regex = /^(?=.*[0-9])/;
    regex.test(password) ? (isContainNumber = true) : (isContainNumber = false);
  };

  $: password, isContainNumber, passwordMustNumberRegex();
</script>

<svelte:head>
  <title>Qubic Card | Reset Password</title>
  <meta
    name="description"
    content="Qubic card adalah kartu nama pintar berbasis NFC & QR Code dengan metalic
    material dan desain terbaik. Cetak kartu nama barumu dengan Qubic Card hanya perlu beli sekali untuk kartu yang tahan selamanya."
  />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="flex h-screen bg-black">
  <div
    class="lg:w-1/3 w-full border px-16 py-32 my-auto mx-6 md:mx-14 lg:mx-auto"
  >
    <a href="/" class="flex items-center w-32 mb-4 font-medium md:mb-0">
      <img src="/qubic.svg" alt="" />
    </a>
    <h1
      class="mt-6 text-2xl font-regular text-white tracking-tighter text-left sm:text-3xl title-font"
    >
      Get a new password
    </h1>
    <div class="mt-6">
      <div>
        <p
          class="block text-sm font-medium leading-relaxed mt-3 tracking-tighter text-left text-gray-400"
        >
          New Password
        </p>
        <input
          bind:value={password}
          type="password"
          name=""
          id=""
          placeholder="Your Password "
          class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-700 focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
        />
      </div>

      {#if !loading}
        <button
          on:click={async () => await handleResetPassword()}
          class="block w-full px-4 py-3 mt-6 font-regular text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
          >Reset Password</button
        >
      {/if}
    </div>
  </div>
</section>
