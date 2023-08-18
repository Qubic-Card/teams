<script>
  import { fade } from "svelte/transition";
  import { Dialog } from "@rgossiaux/svelte-headlessui";
  import { goto } from "$app/navigation";
  import supabase from "@lib/db";
  import { isInViewTriggered } from "@lib/stores/intersectingStore";
  import { user } from "@lib/stores/userStore";
  import Changepassword from "@pages/settings/changepassword.svelte";

  export let editor = "team";
  export let logo = "";

  let isOpen = false;
  let openChangePassword = false;

  const handleLogout = async () => {
    isOpen = false;
    await supabase.auth.signOut();
  };

  const handleChangePass = async () => {
    isOpen = false;
    openChangePassword = true;
  };
</script>

<Changepassword bind:isOpen={openChangePassword} {editor} />

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click={() => (isOpen = false)}
  />
{/if}
<div class="flex flex-row items-center gap-5 pr-3">
  {#if editor === "team"}
    <p
      class="text-neutral-300 text-sm border px-3 py-2 border-neutral-800 rounded-lg bg-blue-800 bg-opacity-20"
    >
      {$user?.email ?? ""}
    </p>
    {#if logo}
      <img
        on:click={() => (isOpen = true)}
        src={logo}
        alt="avatar"
        class="rounded-full w-10 h-10 cursor-pointer outline outline-1 outline-neutral-800"
      />
    {:else if logo === ""}
      <div
        on:click={() => (isOpen = true)}
        class="bg-neutral-800 p-4 rounded-full w-12 h-12 cursor-pointer flex items-center justify-center"
      />
    {:else}
      <div class="animate-pulse p-4">
        <div class="text-5xl w-12 h-12 bg-neutral-800 rounded-full" />
      </div>
    {/if}
  {:else}
    <button
      on:click|preventDefault={() => (isOpen = true)}
      class="p-3 bg-black rounded-full h-10 flex items-center justify-center mx-2 w-10"
    >
      {$user?.email.charAt(0).toUpperCase()}
    </button>
  {/if}
</div>
{#if isOpen}
  <Dialog
    open={isOpen}
    on:close={() => (isOpen = false)}
    class="transition-all md:transition-none duration-300 ease-in-out {isOpen
      ? 'h-52'
      : 'h-0 translate-y-10 md:opacity-0'} {editor == 'team'
      ? 'bg-neutral-900 text-neutral-200 p-3 border border-neutral-700 gap-2 md:top-20 right-0 md:right-6'
      : 'bg-white text-black gap-2 p-3 md:top-16 right-0 md:right-4'} flex flex-col ml-0 lg:ml-12 w-full md:w-96 md:max-w-xs px-4 pb-4 bottom-0 fixed z-50 shadow-lg rounded-lg outline-none focus:outline-none overflow-y-auto snap-container"
  >
    <h2 class="font-semibold text-xs">Docs</h2>

    <div class="pl-2 flex flex-col">
      <a
        class="hover:font-semibold md:text-sm text-xs pb-2"
        href="https://qubic.id/pages/contactus">Contact Support</a
      >
      <a
        class="hover:font-semibold md:text-sm text-xs"
        href="https://qubic.id/products#howitworks">Tutorial</a
      >
    </div>

    <h2 class="font-semibold text-xs">Actions</h2>
    <div class="pl-2">
      <button
        class="w-full hover:font-semibold flex items-center text-xs md:text-sm pb-2"
        on:click={() => {
          $isInViewTriggered = false;
          goto("/");
        }}
      >
        Change Editor
      </button>
      <button
        class="flex items-center hover:font-semibold text-xs md:text-sm w-full pb-2"
        on:click={handleChangePass}>Change Password</button
      >
      <button
        class="flex items-center hover:font-semibold text-xs md:text-sm w-full"
        on:click={handleLogout}>Log Out</button
      >
    </div>
  </Dialog>
{/if}
