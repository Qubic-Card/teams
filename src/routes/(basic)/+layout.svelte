<script>
  import AuthWrapper from "@comp/auth/authWrapper.svelte";
  import { goto } from "$app/navigation";
  import { user } from "@lib/stores/userStore.js";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import MenuButtonModal from "@comp/modals/menuButtonModal.svelte";
  import supabase from "@lib/db";

  let isMounted = false;
  const checkPro = async () => {
    try {
      let { data, error } = await supabase
        .from("profile")
        .select("pro_subscription")
        .eq("uid", $user.id)
        .single();
      if (data) {
        const dateNow = new Date();
        const subs = new Date(data.pro_subscription);
        if (subs > dateNow) {
          console.log(true);
        } else {
          console.log(false);
        }
      }
      if (error) {
        throw error.message;
      }
    } catch (error) {
      console.log(error);
    }
  };
  onMount(() => {
    isMounted = true;
  });
</script>

<svelte:head>
  <title>Qubic Editor</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>
<div class="bg-gray-100">
<AuthWrapper>
  {#if isMounted}
    <div
      class="flex h-12 sticky top-0 w-full z-50 backdrop-blur-sm bg-opacity-50 text-white bg-white border-b border-neutral-300 justify-between items-center pl-4 py-1"
    >
      <button
        class="border-r border-neutral-300 h-full text-black w-24 text-2xl"
        on:click={async () => await goto("/")}
      >
        ←
      </button>
      <div class="flex flex-row pr-3">
        {#if $user != null}
          {#await checkPro}
            <div />
          {:then isPro}
            <img width="48px" class="relative" src="/probadge.svg" alt="" />
          {/await}
          <MenuButtonModal editor="basic" />
        {/if}
      </div>
    </div>
    <slot />
  {/if}
  <SvelteToast />
</AuthWrapper>
</div>