<script>
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';

  let loading = false;
  let email = '';
  let password = '';
  let isSuccessful = false;
  let isForgotPassword = false;

  const checkIsActiveMember = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('uid')
      .eq('uid', $user.id);

    if (error) console.log(error);
    if (data) {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });
      if (error) throw error;

      if (await checkIsActiveMember()) {
        toastSuccess('Hello!');
        loading = false;
        isSuccessful = true;
        setTimeout(() => goto('/select-teams'), 1000);
      } else {
        toastFailed('You are not a member of any team.');
        loading = false;
        isSuccessful = false;
        // location.reload();
      }
    } catch (error) {
      toastFailed(error.message);
      loading = false;
    }
  };

  const forgotPassword = () => {
    isForgotPassword = !isForgotPassword;
  };

  const handleForgotPassword = async () => {
    try {
      loading = true;
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) throw error;
      toastSuccess('Check your email!');
      loading = false;
    } catch (error) {
      toastFailed();
      loading = false;
    }
  };

  const onKeyPress = async (e) => {
    if (e.charCode === 13) {
      await handleLogin();
    }
  };
</script>

<AuthWrapper>
  <section class="flex h-screen bg-black">
    <div
      class="lg:w-1/3 w-full border-2 bg-black text-white border-neutral-700 px-16 py-32 my-auto mx-6 md:mx-14 lg:mx-auto"
    >
      <h1 class="text-4xl font-bold mb-4">Qubic Team</h1>
      {#if !isSuccessful}
        <a href="/" class="flex items-center w-32 mb-4 font-medium md:mb-0">
          <img src="/qubic.svg" alt="" />
        </a>
        <h1
          class="mt-6 text-2xl font-semibold tracking-tighter text-left sm:text-3xl title-font"
        >
          {isForgotPassword ? 'We got you!' : 'Hi, Welcome Back!'}
        </h1>
        <div class="mt-6">
          <div>
            <p
              class="block text-sm font-medium leading-relaxed tracking-tighter text-left"
            >
              Email Address
            </p>
            <input
              bind:value={email}
              type="email"
              name=""
              id=""
              placeholder="Your Email "
              class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-300 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
            />
            {#if !isForgotPassword}
              <p
                class="block text-sm font-medium leading-relaxed mt-3 tracking-tighter text-left"
              >
                Password
              </p>
              <input
                on:keypress={onKeyPress}
                bind:value={password}
                type="password"
                name=""
                id=""
                placeholder="Your Password "
                class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-300 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
              />
            {/if}
          </div>

          {#if !loading}
            {#if isForgotPassword}
              <button
                on:click={async () => await handleForgotPassword()}
                class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                >Send Email</button
              >
            {:else}
              <button
                on:click={async () => await handleLogin()}
                class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                >Log In</button
              >
            {/if}
          {:else}
            <Spinner class="h-8 w-8 my-4" />
          {/if}

          <p class="mt-3 cursor-pointer" on:click={forgotPassword}>
            {isForgotPassword ? 'Back' : 'Forgot password?'}
          </p>

          <p class="mt-3">
            Don't have a card? Get <a
              class="underline font-bold"
              href="https://qubic.id/pages/order">one</a
            > now!
          </p>
        </div>
      {:else}
        <div>
          <h1 class="text-3xl font-extrabold uppercase">Success!</h1>
          <div class="flex flex-row items-center">
            <p class="pr-3 mt-2">Redirecting you to your page</p>
            <Spinner class="h-7 w-7" />
          </div>
        </div>
      {/if}
    </div>
  </section>
</AuthWrapper>
