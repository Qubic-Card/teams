<script>
  let loading = false;
  let email = '';
  let password = '';
  let isSuccessful = false;
  let isForgotPassword = false;

  const handleLogin = async () => {
    // try {
    //   loading = true;
    //   const { error } = await supabase.auth.signIn({
    //     email: email,
    //     password: password,
    //   });
    //   if (error) throw error;
    //   toastSuccess('Hello!');
    //   loading = false;
    //   isSuccessful = true;
    //   setTimeout(() => location.reload(), 4000);
    // } catch (error) {
    //   toastFailed();
    //   loading = false;
    // }
  };

  const forgotPassword = () => {
    isForgotPassword = !isForgotPassword;
  };

  const handleForgotPassword = async () => {
    // try {
    //   loading = true;
    //   const { error } = await supabase.auth.api.resetPasswordForEmail(email);
    //   if (error) throw error;
    //   toastSuccess('Check your email!');
    //   loading = false;
    // } catch (error) {
    //   toastFailed();
    //   loading = false;
    // }
  };
</script>

<section class="flex h-screen">
  <div
    class="lg:w-1/3 w-full border-2 bg-white border-neutral-300 px-16 py-32 my-auto mx-6 md:mx-14 lg:mx-auto"
  >
    {#if !isSuccessful}
      <a href="/" class="flex items-center w-32 mb-4 font-medium md:mb-0">
        <img src="/qubic.svg" alt="" />
      </a>
      <h1
        class="mt-6 text-2xl font-semibold text-black tracking-tighter text-left sm:text-3xl title-font"
      >
        {isForgotPassword ? 'We got you!' : 'Hi, Welcome Back!'}
      </h1>
      <div class="mt-6">
        <div>
          <p
            class="block text-sm font-medium leading-relaxed tracking-tighter text-left text-black"
          >
            Email Address
          </p>
          <input
            bind:value={email}
            type="email"
            name=""
            id=""
            placeholder="Your Email "
            class="w-full px-4 py-2 mt-2 text-base transition duration-500 ease-in-out transform border-transparent bg-neutral-300 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
          />
          {#if !isForgotPassword}
            <p
              class="block text-sm font-medium leading-relaxed mt-3 tracking-tighter text-left text-black"
            >
              Password
            </p>
            <input
              bind:value={password}
              type="password"
              name=""
              id=""
              placeholder="Your Password "
              class="w-full px-4 py-2 mt-2 text-base transition duration-500 ease-in-out transform border-transparent bg-neutral-300 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
            />
          {/if}
        </div>

        {#if !loading}
          {#if isForgotPassword}
            <button
              class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
              >Send Email</button
            >
          {:else}
            <button
              class="block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
              >Log In</button
            >
          {/if}
        {:else}
          <h1>loading</h1>
        {/if}

        <p class="mt-3 text-black cursor-pointer" on:click={forgotPassword}>
          {isForgotPassword ? 'Back' : 'Forgot password?'}
        </p>

        <p class="mt-3 text-black">
          Don't have a card? Get <a
            class="underline text-black font-bold"
            href="/pages/order">one</a
          > now!
        </p>
      </div>
    {:else}
      <div>
        <h1 class="text-3xl font-extrabold text-black uppercase">Success!</h1>
        <div class="flex flex-row">
          <p class="pr-3 text-neutral-700">Redirecting you to your page</p>
        </div>
      </div>
    {/if}
  </div>
</section>
