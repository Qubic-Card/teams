<script>
    import AuthWrapper from "@comp/auth/authWrapper.svelte";
    import { user } from "@lib/stores/userStore";

    const deleteAcc = () => {
        
    }
</script>
<AuthWrapper>
<div class="bg-gray-100 w-full h-screen flex justify-center items-center">
<div class="max-w-md bg-white p-8 rounded-lg">
    <h1 class="text-lg font-bold mb-4">Delete Account</h1>
    <p class="mb-4 text-neutral-600">We are sad to see you go, are you sure you want to delete your account?</p>
    <p class="mb-4 text-neutral-600">You will no longer have access to your data make sure to backup your data before parting with us.</p>
    {#if $user}
    <input class="outline outline-1 w-full rounded-lg px-4 py-1 mb-4" placeholder="Enter your password" type="password">
    <button class="bg-red-200 outline-red-500 outline outline-1  text-red-500 px-4 rounded-lg py-1">Yes, delete my account</button>
    {:else}
    <input class="outline outline-1 w-full rounded-lg px-4 py-1 mb-2" placeholder="Enter your email" type="password">
    <input class="outline outline-1 w-full rounded-lg px-4 py-1 mb-4" placeholder="Enter your password" type="password">
    <button class="bg-red-200 outline-red-500 outline outline-1  text-red-500 px-4 rounded-lg py-1">Delete my account</button>
    {/if}
</div>
</div>
</AuthWrapper>