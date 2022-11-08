<script>
  import { page } from '$app/stores';
  import Input from '@comp/input.svelte';
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';

  let loading = false;
  let codeActivation = '';
  let state = 'activation';
  let code = '12345';
  let teamName = '';
  let register = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    confirmPassword: '',
    checked: false,
  };
  let login = {
    email: '',
    password: '',
  };

  const getTeamData = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('name')
      .eq('id', $page.url.searchParams.get('team_id'));
    if (error) console.log(error);
    if (data) {
      teamName = data[0].name;
    }
  };

  const codeActivationHandler = async () => {
    try {
      if (codeActivation === code) {
        state = 'register';
        toastSuccess('Code activation match!');
      } else {
        toastFailed('Wrong code');
      }

      codeActivation = '';
    } catch (error) {
      toastFailed();
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
          loading = true;
          // const { user, session, error } = await supabase.auth.signUp({
          //   email: email,
          //   password: password,
          // });

          // if (await checkIsRegistered(user.id)) {
          //   toastFailed('Email is already registered');
          //   loading = false;
          // } else {
          //   await handleActiveCard(user.id);
          //   toastSuccess('Please confirm your email');
          //   Cookies.set('activate', true);
          //   loading = false;
          //   doneRegister = true;
          //   setTimeout(() => redirectToProfilePreview(), 1000);
          // }
        } catch (error) {
          toastFailed();
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
        // loading = true;
        // const { user, error } = await supabase.auth.signIn({
        //   email: login.email,
        //   password: login.password,
        // });
        // if (error) {
        //   throw error;
        // } else {
        //   loading = false;
        //   isSuccessful = true;
        // }
      }
    } catch (error) {
      toastFailed(error.message);
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
  <h1>Loading</h1>
{:then name}
  <div class="text-black bg-cover xl:bg-right 2xl:bg-center">
    <div class="flex justify-start items-center h-screen p-6 lg:p-24">
      {#if state === 'activation'}
        <div
          class="flex flex-col justify-center bg-white h-full w-full md:w-2/3 lg:w-1/3 rounded-lg gap-10 p-10"
        >
          <h1 class="text-xl">
            Welcome to <br /> <span class="font-bold text-3xl">{teamName}</span>
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
            class="p-2 bg-blue-600 text-white hover:bg-blue-700"
            on:click={codeActivationHandler}
          >
            Join
          </button>
        </div>
      {:else if state === 'register'}
        <div
          class="flex flex-col justify-center bg-white h-full w-full md:w-2/3 lg:w-1/3 rounded-lg p-10"
        >
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
              isEmptyChecking
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
              isEmptyChecking
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
            isEmptyChecking
            isEmailInput
          />
          <div class="flex flex-col text-xs md:text-sm">
            <p
              class="block text-sm mt-2 text-left after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Password
            </p>
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
            <p
              class="block text-sm mt-2 text-left after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Confirm Password
            </p>
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
              class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              on:click={handleSignUp}
            >
              Register
            </button>
            <button
              class="p-2 outline outline-1 outline-neutral-500 rounded-md hover:outline-neutral-800"
              on:click={() => (state = 'login')}
            >
              Already have an account
            </button>
          </div>
        </div>
      {:else}
        <div
          class="flex flex-col justify-center bg-white h-full w-full md:w-2/3 lg:w-1/3 rounded-lg p-10"
        >
          <Input
            bind:value={login.email}
            titleColor="text-black"
            placeholder="Email"
            title="Email"
            inputbg="bg-neutral-100"
            inputText="text-neutral-900"
            outline="outline outline-1 outline-neutral-500"
            isEmptyChecking
          />
          <div class="flex flex-col text-xs md:text-sm">
            <p
              class="block text-sm mt-2 text-left after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Password
            </p>
            <input
              bind:value={login.password}
              on:keypress={onEnter}
              type="password"
              placeholder="Your Password"
              class="w-full px-4 py-2 mt-2 text-base outline outline-1 outline-neutral-500 rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500  focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
            />
          </div>

          <div class="flex flex-col gap-2 mt-10">
            <button
              class="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              on:click={loginHandler}
            >
              Join
            </button>
            <button
              class="p-2 outline outline-1 outline-neutral-500 rounded-md hover:outline-neutral-800"
            >
              Forgot Password
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{:catch name}
  <div>
    <h1 class="text-xl text-white text-center w-full mt-8">
      Some error occurred. Please reload the page and try again <br /> or
      <a href="https://wa.me/628113087599" class="font-bold"> contact us! </a>
    </h1>
  </div>
{/await}
