<script>
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import { fade } from 'svelte/transition';

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
  <section class="text-white">
    <div class="border-b border-neutral-700 absolute w-screen top-16" />
    <div class="border-t border-neutral-700 absolute w-screen bottom-16" />
    <div class="border-r border-neutral-700 absolute h-screen right-16" />
    <div class="border-l border-neutral-700 h-screen absolute left-16" />
    <div class="flex justify-center items-center h-screen p-24">
      <div class="flex flex-col justify-between h-full w-1/2 pr-32 py-16">
        <div class="text-xl">
          Work together with <br />
          <div class="flex items-center">
            <img src="/favicon.svg" alt="" class="w-20 h-20" />
            <span class="text-4xl font-bold">Teams</span>
          </div>
        </div>
        {#if !isSuccessful}
          <div>
            <p class="block text-sm text-left">Email Address</p>
            <input
              bind:value={email}
              type="email"
              placeholder="Your Email"
              class="w-full px-4 py-2 mt-2 text-base rounded-md text-white transition duration-500 ease-in-out transform border-transparent bg-neutral-700 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
            />
            {#if !isForgotPassword}
              <p class="block text-sm mt-2 text-left">Password</p>
              <input
                bind:value={password}
                on:keypress={onKeyPress}
                type="password"
                placeholder="Your Password"
                class="w-full px-4 py-2 mt-2 text-base rounded-md text-white transition duration-500 ease-in-out transform border-transparent bg-neutral-700 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
              />
            {/if}
          </div>

          <!-- <a href="/" class="flex items-center w-32 mb-4 font-medium md:mb-0">
            <img src="/qubic.svg" alt="" />
          </a>
          {#if isForgotPassword}
            <h1
              class="mt-6 text-2xl font-semibold tracking-tighter text-left sm:text-3xl title-font"
            >
              We got you!
            </h1>
          {/if} -->
          <div class="mt-6">
            {#if !loading}
              {#if isForgotPassword}
                <button
                  on:click={async () => await handleForgotPassword()}
                  class="block w-full px-4 py-3 mt-6 font-semibold rounded-md text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                  >Send Email</button
                >
              {:else}
                <button
                  on:click={async () => await handleLogin()}
                  class="block w-full px-4 py-3 mt-6 font-semibold rounded-md text-white transition duration-500 ease-in-out transform bg-blue-600 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                  >Log In</button
                >
              {/if}
            {:else}
              <Spinner class="h-8 w-8 my-4" />
            {/if}

            <p
              class="mt-3 text-neutral-400 text-sm cursor-pointer"
              on:click={forgotPassword}
            >
              {isForgotPassword ? 'Back' : 'Forgot password?'}
            </p>

            <p class="mt-3 text-neutral-400 text-sm">Not your team?</p>
          </div>
        {:else}
          <div in:fade|local>
            <h1 class="text-3xl font-extrabold uppercase">Success!</h1>
            <div class="flex flex-row items-center">
              <p class="pr-3 mt-2">Redirecting you to your page</p>
              <Spinner class="h-7 w-7" />
            </div>
          </div>
        {/if}
      </div>
      <!-- <div class="w-1/2">asfasf</div> -->
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        class="h-full w-1/2 object-fit rounded-md"
        alt=""
      />
    </div>
  </section>
</AuthWrapper>
