<script>
  import RegisterTeam from "@pages/registerTeam.svelte";
  import AuthWrapper from "@comp/auth/authWrapper.svelte";
  import Spinner from "@comp/loading/spinner.svelte";
  import SelectEditor from "@pages/selectEditor.svelte";
  import supabase from "@lib/db";
  import { user } from "@lib/stores/userStore";
  import { toastFailed, toastSuccess } from "@lib/utils/toast";
  import { page } from "$app/stores";

  let loading = false;
  let email = "";
  let password = "";
  let isForgotPassword = false;

  const handleLogin = async () => {
    try {
      loading = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      } else {
        loading = false;
        email = "";
        password = "";
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
  // 157ff9ce-bfdd-4405-ae9d-300e3c97da88
  // 39ba7789-537c-4b0f-a8a7-c8a8345838f3
  const handleForgotPassword = async () => {
    try {
      loading = true;
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toastSuccess("Check your email!");
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

<div class="bg-gray-100">
  <AuthWrapper>
    {#if $user}
      <SelectEditor />
    {:else}
      <div class="text-white bg-cover xl:bg-right 2xl:bg-center">
        <div class="flex justify-start items-center h-screen p-8">
          {#if $page.url.searchParams.get("team_id")}
            <RegisterTeam />
          {:else}
            <div
              class="flex flex-col justify-between h-full w-full 2xl:w-1/2 py-8 rounded-2xl px-8 bg-white text-black"
            >
              <div class="text-xl">
                <div class="flex items-center">
                  <img src="/qubic-black.svg" alt="" width="32" height="32" />
                  <span class="text-xl md:text-2xl font-semibold ml-2"
                    >Editor</span
                  >
                </div>
              </div>

              <div class="mx-auto w-[75%]">
                <div class="pb-8">
                  <h1 class="text-3xl font-semibold">Welcome back</h1>
                  <p class="text-neutral-500 text-sm">
                    Log in to make changes to your profile
                  </p>
                </div>
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
                  class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
                />
                {#if !isForgotPassword}
                  <p class="block text-sm mt-2 text-left">Password</p>
                  <input
                    bind:value={password}
                    on:keypress={onKeyPress}
                    type="password"
                    placeholder="Your Password"
                    class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
                  />
                {/if}
                {#if !loading}
                  {#if isForgotPassword}
                    <button
                      disabled={loading}
                      on:click={async () => await handleForgotPassword()}
                      class="block w-full px-4 py-3 md:mt-6 font-regular rounded-md text-white transition duration-500 ease-in-out transform bg-blue-500 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
                      >Send Email</button
                    >
                  {:else}
                    <button
                      disabled={loading}
                      on:click={async () => await handleLogin()}
                      class="block border border-blue-800 disabled:bg-blue-600/60 w-full px-4 py-3 mt-6 font-regular rounded-md text-white transition duration-500 ease-in-out transform bg-blue-600 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
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
                  {isForgotPassword ? "Back" : "Forgot password?"}
                </p>
              </div>

              <div>
                <p
                  class="text-neutral-600 text-sm cursor-pointer w-56"
                  on:click={() =>
                    window.open("https://qubic.id/teams", "_blank").focus()}
                >
                  Learn about qubic teams ↗
                </p>
              </div>
            </div>
          {/if}

          <div class="bg-black lg:w-full" />
        </div>
      </div>
    {/if}
  </AuthWrapper>
</div>
