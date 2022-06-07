<script>
  import { createEventDispatcher } from 'svelte';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import { user } from '@lib/stores/userStore';
  import supabase from '@lib/db';
  import Input from '@comp/input.svelte';
  import Spinner from '@comp/loading/spinner.svelte';
  import { log } from '@lib/logger/logger';

  export let showModal;
  export let profileUid;
  export let cardId;
  export let data;

  let profileData = data;
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let link = null;
  let message = null;
  let loading = false;

  const dispatch = createEventDispatcher();
  const toggleModal = () => {
    dispatch('showModal');
  };

  const getProfileId = async () => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('uid', $user.id);

    if (error) console.log(error);

    return data;
  };

  const getConnectedAcc = async () => {
    if (profileUid !== undefined) {
      const { data: connection, error: connection_err } = await supabase
        .from('connection_acc')
        .select('*')
        .eq('uid', profileUid);

      if (connection_err) console.log(connection_err);
    }
  };

  $: getConnectedAcc();

  const submitHandler = async () => {
    if ($user) {
      loading = true;
      const userId = await getProfileId();

      const { data, error } = await supabase.from('connection_acc').upsert(
        {
          uid: $user.id,
          message: message,
          link: link,
          profileData: {
            avatar: profileData.avatar,
            company: profileData.company,
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            job: profileData.job,
            links: profileData.links,
            socials: profileData.socials,
          },
        },
        { onConflict: 'id' }
      );

      const { data: data_swap, error: err_swap } = await supabase
        .from('connection_acc')
        .upsert(
          {
            uid: profileUid,
            message: message,
            link: link,
            profileData: {
              avatar: userId[0].metadata.avatar,
              company: userId[0].metadata.company,
              firstname: userId[0].metadata.firstname,
              lastname: userId[0].metadata.lastname,
              job: userId[0].metadata.job,
              links: userId[0].metadata.links,
              socials: userId[0].metadata.socials,
            },
          },
          { onConflict: 'id' }
        );

      if (error) toastFailed(error.message);
      if (err_swap) toastFailed(err_swap.message);

      toastSuccess('Successfully added to your contact list');
      log(
        `Your have connected with ${userId[0]['metadata']['firstname']}${
          userId[0]['metadata']['company'] != null
            ? ' from ' + userId[0]['metadata']['company']
            : ''
        }`,
        'INFO',
        null,
        cardId,
        profileUid
      );

      loading = false;
      toggleModal();
      firstName = '';
      lastName = '';
      email = '';
      phone = '';
      link = null;
      message = null;
    } else if (!$user) {
      if (firstName === '' || lastName === '' || email === '' || phone === '') {
        toastFailed('Please fill in all the required fields');
      } else {
        loading = true;
        const { data, error } = await supabase.from('connection_acc').upsert(
          {
            uid: profileUid,
            message: message,
            link: link,
            profileData: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              phone: phone,
            },
          },
          { onConflict: 'id' }
        );

        if (error) console.error(error);

        toastSuccess('Successfully added to your contact list');
        log(
          `Your have connected with ${firstName}`,
          'INFO',
          null,
          cardId,
          profileUid
        );
        loading = false;
        toggleModal();
        firstName = '';
        lastName = '';
        email = '';
        phone = '';
        link = null;
        message = null;
      }
    }
  };
</script>

{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div
      class="relative w-full lg:w-1/2 my-6 mx-auto h-auto md:max-w-3xl max-w-md pt-2 md:mt-6 lg:mt-0 px-2 md:px-6 lg:px-0"
    >
      <!--content-->
      <div
        class="border-0 shadow-lg relative flex flex-col w-full rounded-lg bg-white outline-none focus:outline-none"
      >
        <!--header-->
        <div class="border-b border-solid rounded-t">
          <div class="flex w-full justify-between items-center">
            <div class="flex flex-col w-full">
              <p
                on:click={toggleModal}
                class="cursor-pointer text-3xl self-end pr-4 text-black"
              >
                x
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-col p-8 text-black">
          {#if $user}
            <h1 class={'text-md lg:text-xl text-gray-400 font-bold'}>
              Halo, {$user.email}!
            </h1>
          {:else}
            <Input
              placeholder="First Name"
              title="First Name"
              bind:value={firstName}
              isEmptyChecking={true}
            />
            <Input
              placeholder="Last Name"
              title="Last Name"
              bind:value={lastName}
              isEmptyChecking={true}
            />
            <Input
              placeholder="Email"
              title="Email"
              bind:value={email}
              isEmailInput={true}
              isEmptyChecking={true}
            />
            <Input
              placeholder="Phone"
              title="Phone"
              bind:value={phone}
              isEmptyChecking={true}
              isPhoneInput={true}
            />
          {/if}
          <Input placeholder="Link (Optional)" title="Link" bind:value={link} />
          <div class="mt-1">
            <h1 class="text-gray-400">About me</h1>
            <textarea
              bind:value={message}
              name="aboutme"
              id="aboutme"
              maxlength="50"
              cols="15"
              rows="5"
              placeholder="About me (Optional)"
              class="h-24 w-full text-black bg-neutral-100 rounded-md my-2 p-2"
            />
          </div>
          {#if loading}
            <button class="p-3 bg-black text-white mt-2 flex justify-center">
              <Spinner class="h-5 w-5 pr-2 border-white mr-4" />
              <p>Loading...</p>
            </button>
          {:else}
            <button
              class={'p-3 bg-black text-white mt-2 hover:font-bold transition-all duration-500'}
              on:click={submitHandler}
            >
              Connect With Me
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}

<!-- disabled={alreadyConnectedMsg !== '' ? false : false} -->
