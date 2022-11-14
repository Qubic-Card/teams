<script>
  import RegisterTeam from '@pages/registerTeam.svelte';
  import AuthWrapper from '@comp/auth/authWrapper.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import SelectEditor from '@pages/selectEditor.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';

  let loading = false;
  let email = '';
  let password = '';
  let isSuccessful = false;
  let isForgotPassword = false;

  const handleLogin = async () => {
    try {
      loading = true;
      const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      } else {
        loading = false;
        isSuccessful = true;
      }
    } catch (error) {
      console.log(error);
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
  {#if $user}
    <SelectEditor />
  {:else}
    <div
      class="text-white bg-cover xl:bg-right 2xl:bg-center bg-[url('https://qubicmedia.s3.ap-southeast-1.amazonaws.com/qubic/newlook.jpg')]"
    >
      <div class="flex justify-start items-center h-screen p-6 md:p-10 lg:p-24">
        {#if $page.url.searchParams.get('team_id')}
          <RegisterTeam />
        {:else}
          <div
            class="flex flex-col justify-between h-full w-full 2xl:w-1/2 py-16 px-8 bg-white rounded-md md:rounded-xl text-black"
          >
            <div class="text-xl">
              <div class="flex items-center">
                <img src="/qubic-black.svg" alt="" width="40" height="40" />
                <span class="text-3xl md:text-4xl font-bold ml-2">Editor</span>
              </div>
            </div>
            {#if !isSuccessful}
              <div>
                {#if isForgotPassword}
                  <h1
                    class="mt-6 text-2xl mb-4 font-regular tracking-tighter text-left sm:text-3xl title-font"
                  >
                    We got you!
                  </h1>
                {/if}
                <p class="block text-sm text-left">Email Address</p>
                <input
                  bind:value={email}
                  type="email"
                  placeholder="Your Email"
                  class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
                />
                {#if !isForgotPassword}
                  <p class="block text-sm mt-2 text-left">Password</p>
                  <input
                    bind:value={password}
                    on:keypress={onKeyPress}
                    type="password"
                    placeholder="Your Password"
                    class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
                  />
                {/if}
              </div>

              <div class="mt-6">
                {#if !loading}
                  {#if isForgotPassword}
                    <button
                      disabled={loading}
                      on:click={async () => await handleForgotPassword()}
                      class="block w-full px-4 py-3 md:mt-6 font-regular rounded-md text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                      >Send Email</button
                    >
                  {:else}
                    <button
                      disabled={loading}
                      on:click={async () => await handleLogin()}
                      class="block disabled:bg-blue-600/60 w-full px-4 py-3 md:mt-6 font-regular rounded-md text-white transition duration-500 ease-in-out transform bg-blue-600 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
                      >Log In</button
                    >
                  {/if}
                {:else}
                  <Spinner class="h-8 w-8 my-4" />
                {/if}

                <p
                  class="mt-2 text-neutral-600 text-sm cursor-pointer w-56"
                  on:click={forgotPassword}
                >
                  {isForgotPassword ? 'Back' : 'Forgot password?'}
                </p>

                <p
                  class="text-neutral-600 text-sm cursor-pointer w-56"
                  on:click={() =>
                    window.open('https://qubic.id/teams', '_blank').focus()}
                >
                  Don't have Teams?
                </p>
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
        {/if}

        <div class="bg-black lg:w-full" />
      </div>
    </div>
  {/if}
</AuthWrapper>
