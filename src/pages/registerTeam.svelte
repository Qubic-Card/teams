<script>
  import { page } from '$app/stores';
  import Input from '@comp/input.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import encryptActivationCode from '@lib/utils/encryptActivationCode';
  import {
    checkFirstRegisteredMember,
    checkIsRegistered,
    checkTeamMembers,
    createTeamMember,
    updateTeamMember,
  } from '@lib/query/register';
  import { goto } from '$app/navigation';
  import { log } from '@lib/logger/logger';

  let loading = false;
  let codeActivation = '';
  let state = 'activation';
  let team = {};
  let register = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
    checked: false,
    success: false,
  };
  let login = {
    email: '',
    password: '',
    forgotPassword: false,
  };

  const logMsg = (email) => {
    return `User ${email ?? ''} has joined the team`;
  };

  const getTeamData = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('name, metadata->>company, member_count')
      .eq('id', $page.url.searchParams.get('team_id'));
    if (error) console.log(error);
    if (data) {
      team = data[0];
    }
  };

  const codeActivationHandler = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from('teams')
        .select('team_token')
        .eq('id', $page.url.searchParams.get('team_id'));

      if (error) console.log(error);

      if (data) {
        const hash = await encryptActivationCode(codeActivation);
        if (hash === data[0].team_token) {
          state = 'register';
          toastSuccess('Code activation match!');
        } else {
          toastFailed('Invalid activation code');
        }
      }

      codeActivation = '';
      loading = false;
    } catch (error) {
      toastFailed();
      loading = false;
    }
  };

  const onEnter = async (e) => {
    if (e.charCode === 13) {
      if (state === 'activation') {
        await codeActivationHandler();
      } else if (state === 'register') {
        await handleSignUp();
      } else {
        await loginHandler();
      }
    }
  };

  const handleSignUp = async () => {
    if (register.checked) {
      if (checkEmptyStringInObject(register)) {
        toastFailed('Please fill all the fields');
      } else if (!emailRegex(register.email)) {
        toastFailed('Please enter a valid email');
        return;
      } else if (register.password.length < 8) {
        toastFailed('Password needs to be more than 8 characters');
        return;
      } else if (!isContainNumber(register.password)) {
        toastFailed('Password needs to contain at least one number');
        return;
      } else if (
        register.password !== register.confirmPassword &&
        register.confirmPassword !== ''
      ) {
        toastFailed("Password doesn't match");
      } else {
        try {
          const {
            error: check_error,
            available,
            nullUid,
            mid,
          } = await checkTeamMembers(
            $page.url.searchParams.get('team_id'),
            team.member_count
          );

          if (check_error) {
            toastFailed();
            return;
          } else {
            if (!available) {
              toastFailed('Team member limit reached');
              return;
            } else {
              loading = true;
              const { user, session, error } = await supabase.auth.signUp(
                {
                  email: register.email,
                  password: register.password,
                },
                {
                  data: {
                    firstname: register.fname,
                    lastname: register.lname,
                    company: team.company ?? '',
                  },
                }
              );

              if (error) {
                toastFailed();
                console.log(error);
                loading = false;
                return;
              } else {
                if (await checkIsRegistered(user.id)) {
                  toastFailed('Email is already registered');
                  loading = false;
                } else {
                  if (nullUid) {
                    const { error } = await updateTeamMember(
                      mid,
                      user.id,
                      $page.url.searchParams.get('team_id'),
                      register,
                      team.company
                    );

                    if (error) {
                      toastFailed(
                        'Something went wrong, please contact our support'
                      );
                      loading = false;
                    } else {
                      toastSuccess('Please confirm your email');
                      log(
                        logMsg(register.email),
                        'SUCCESS',
                        '',
                        $page.url.searchParams.get('team_id'),
                        '',
                        '',
                        mid
                      );
                      loading = false;
                      register.success = true;
                    }
                  } else {
                    const { error, memberId } = await createTeamMember(
                      user.id,
                      register,
                      team.company,
                      $page.url.searchParams.get('team_id'),
                      (await checkFirstRegisteredMember(
                        $page.url.searchParams.get('team_id')
                      ))
                        ? 1
                        : 2
                    );

                    if (error) {
                      toastFailed(
                        'Something went wrong, please contact our support'
                      );
                    } else {
                      log(
                        logMsg(register.email),
                        'SUCCESS',
                        '',
                        $page.url.searchParams.get('team_id'),
                        '',
                        '',
                        memberId
                      );
                      toastSuccess('Please confirm your email');
                    }

                    register.success = true;
                    loading = false;
                  }
                }
              }
            }
          }

          register = {
            fname: '',
            lname: '',
            email: '',
            password: '',
            confirmPassword: '',
            checked: false,
            success: false,
          };
        } catch (error) {
          toastFailed();
          console.log(error);
          loading = false;
        }
      }
    } else {
      toastFailed('Please agree to our conditions');
    }
  };

  const loginHandler = async () => {
    try {
      if (checkEmptyStringInObject(login)) {
        toastFailed('Please fill all the fields');
      } else if (!emailRegex(login.email)) {
        toastFailed('Please enter a valid email');
        return;
      } else {
        loading = true;
        const { user, error } = await supabase.auth.signIn({
          email: login.email,
          password: login.password,
        });
        if (error) {
          throw error;
        } else {
          loading = false;
        }
      }
    } catch (error) {
      toastFailed(error.message);
      loading = false;
    }
  };

  const handleForgotPassword = async () => {
    try {
      loading = true;
      const { error } = await supabase.auth.api.resetPasswordForEmail(
        login.email
      );
      if (error) throw error;
      toastSuccess('Check your email!');
      loading = false;
    } catch (error) {
      toastFailed();
      loading = false;
    }
  };

  const checkEmptyStringInObject = (obj) => {
    for (let key in obj) {
      if (obj[key] === '') {
        return true;
      }
    }
    return false;
  };

  const isContainNumber = (str) => /\d/.test(str);

  const emailRegex = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // 1a8bfef4-9e7e-4a8e-98a8-8d69f2fde038
</script>

{#await getTeamData()}
  <div class="animate-pulse h-full w-full 2xl:w-1/2">
    <div
      class="flex flex-col justify-center bg-white h-full text-black rounded-lg"
    />
  </div>
{:then name}
  {#if state === 'activation'}
    <div
      class="flex flex-col justify-center bg-white h-full w-full 2xl:w-1/2 text-black rounded-lg gap-10 py-16 px-4 md:px-8"
    >
      <h1 class="text-xl">
        Welcome to <br />
        <span class="font-semibold text-3xl">{team.name ?? ''}</span>
      </h1>

      <div class="flex flex-col mt-10">
        <p class="block text-sm mt-2 text-left">Activation Code</p>
        <input
          bind:value={codeActivation}
          on:keypress={onEnter}
          type="password"
          placeholder="Your Password"
          class="w-full px-4 py-2 mt-2 text-base outline outline-1 outline-neutral-500 rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
        />
      </div>

      <button
        disabled={loading}
        class="p-2 bg-blue-600 text-white hover:bg-blue-700 flex gap-2 justify-center items-center h-10 md:h-12 text-sm rounded-md"
        on:click={codeActivationHandler}
      >
        {#if loading}
          <Spinner class="h-6 w-6 my-4" />
        {/if}
        Join
      </button>
    </div>
  {:else if state === 'register'}
    <div
      class="flex flex-col justify-center bg-white h-full w-full 2xl:w-1/2 text-black rounded-lg py-16 px-4 md:px-8"
    >
      {#if register.success}
        <div class="flex flex-col gap-2 h-1/2">
          <h1 class="text-3xl font-semibold">Success</h1>
          <h1 class="text-xl">
            Please check your email to confirm your account.
          </h1>
        </div>
        <button
          class="bg-blue-600 rounded-md text-white p-2 mt-10"
          on:click={() => goto('/')}
        >
          Back to login
        </button>
      {:else}
        <div class="flex gap-2 w-full">
          <Input
            bind:value={register.fname}
            titleColor="text-black"
            placeholder="First Name"
            title="First Name"
            inputbg="bg-neutral-100"
            inputText="text-neutral-900"
            outline="outline outline-1 outline-neutral-500"
            class="w-full"
          />
          <Input
            bind:value={register.lname}
            titleColor="text-black"
            placeholder="Last Name"
            title="Last Name"
            inputbg="bg-neutral-100"
            inputText="text-neutral-900"
            outline="outline outline-1 outline-neutral-500"
            class="w-full"
          />
        </div>

        <Input
          bind:value={register.email}
          titleColor="text-black"
          placeholder="Email"
          title="Email"
          inputbg="bg-neutral-100"
          inputText="text-neutral-900"
          outline="outline outline-1 outline-neutral-500"
          isEmailInput
        />
        <div class="flex flex-col text-xs md:text-sm">
          <p class="block text-sm mt-2 text-left">Password</p>
          <input
            bind:value={register.password}
            on:keypress={onEnter}
            type="password"
            placeholder="Your Password"
            class="w-full px-4 py-2 mt-2 text-base outline outline-1 outline-neutral-500 rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
          />
          {#if register.password.length < 8 && register.password !== ''}
            <small class="text-red-500"
              >Password needs to be more than 8 characters</small
            >
          {:else if !isContainNumber(register.password) && register.password !== ''}
            <small class="text-red-500"
              >Password needs to contain at least one number</small
            >
          {/if}
        </div>
        <div class="flex flex-col">
          <p class="block text-sm mt-2 text-left">Confirm Password</p>
          <input
            bind:value={register.confirmPassword}
            on:keypress={onEnter}
            type="password"
            placeholder="Your Password"
            class="w-full px-4 py-2 mt-2 text-base outline outline-1 outline-neutral-500 rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
          />
          {#if register.confirmPassword !== register.password && register.confirmPassword !== ''}
            <small class="text-red-500">Password does not match</small>
          {/if}
        </div>

        <label
          for="links"
          class="flex items-center cursor-pointer gap-2 text-black md:text-sm text-xs my-2"
        >
          <input
            bind:checked={register.checked}
            id="links"
            type="checkbox"
            class="w-4 h-4 cursor-pointer"
            value={register.checked}
          />

          <p class="text-xs md:text-sm">
            I have read the terms and conditions.
          </p>
        </label>

        <div class="flex flex-col gap-2 mt-10">
          <button
            disabled={loading}
            class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex gap-2 justify-center items-center h-10 md:h-12 text-sm"
            on:click={handleSignUp}
          >
            {#if loading}
              <Spinner class="h-6 w-6 my-4" />
            {/if}
            Register
          </button>
          <button
            class="p-2 outline outline-1 outline-neutral-500 rounded-md hover:outline-neutral-800 text-sm"
            on:click={() => (state = 'login')}
          >
            Already have an account
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div
      class="flex flex-col justify-center bg-white h-full w-full 2xl:w-1/2 text-black rounded-lg py-16 px-4 md:px-8"
    >
      <Input
        bind:value={login.email}
        titleColor="text-black"
        placeholder="Email"
        title="Email"
        inputbg="bg-neutral-100"
        inputText="text-neutral-900"
        outline="outline outline-1 outline-neutral-500"
      />

      {#if !login.forgotPassword}
        <div class="flex flex-col text-xs md:text-sm">
          <p class="block text-sm mt-2 text-left">Password</p>
          <input
            bind:value={login.password}
            on:keypress={onEnter}
            type="password"
            placeholder="Your Password"
            class="w-full px-4 py-2 mt-2 text-base outline outline-1 outline-neutral-500 rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
          />
        </div>
      {/if}

      <div class="flex flex-col gap-2 mt-10">
        {#if !login.forgotPassword}
          <button
            disabled={loading}
            class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex gap-2 justify-center items-center h-10 md:h-12 text-sm"
            on:click={loginHandler}
          >
            {#if loading}
              <Spinner class="h-6 w-6 my-4" />
            {/if}
            Join
          </button>
          <button
            on:click={() => (login.forgotPassword = true)}
            class="p-2 outline outline-1 outline-neutral-500 rounded-md hover:outline-neutral-800 text-sm"
          >
            Forgot Password
          </button>
        {/if}

        {#if login.forgotPassword}
          <button
            on:click={async () => {
              login.forgotPassword
                ? await handleForgotPassword()
                : (login.forgotPassword = true);
            }}
            class="p-2 bg-blue-600 rounded-md text-sm text-white"
          >
            Send Email
          </button>
        {/if}
      </div>
    </div>
  {/if}
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-semibold">
        contact us!
      </a>
    </h1>
  </div>
{/await}
