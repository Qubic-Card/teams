<script>
    import supabase from "@lib/db";
    import { toastFailed, toastSuccess } from "@lib/utils/toast";
    import { fade } from "svelte/transition";

    export let isOpen = false;
    export let editor;

    let newPass = "";
    let newPass2 = "";
    let done = false;

    const handleChangePass = async () => {
        if (newPass.length > 7) {
            if (newPass === newPass2) {
                await supabase.auth.updateUser({ password: newPass })
                toastSuccess("Password has been changed");
                done = true;
            } else {
                toastFailed("Passwords don't match");
            }
        } else {
            toastFailed("Password needs to be at least 8 characters");
        }
    };
</script>

{#if isOpen}
    <div
        transition:fade|local={{ duration: 200 }}
        class="fixed inset-0 w-full h-full bg-black/50 z-30"
        aria-hidden="true"
        on:click={() => (isOpen = false)}
    />
    <div class="z-50 flex justify-center items-center inset-0 fixed">
        <div
            class="{editor === 'team'
                ? 'bg-neutral-800 text-white'
                : 'bg-white text-black'} p-8 rounded-lg flex flex-col"
        >
            <p class="font-semibold">Change Password</p>
            <p class="text-neutral-400 text-sm pb-4 w-80">
                Make sure your password is secure by being at least 8 in length
            </p>
            <!-- New Pass -->
            <input
                bind:value={newPass}
                type="password"
                placeholder="Your new password"
                class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
            />
            <!-- Confirm Pass -->
            <input
                bind:value={newPass2}
                type="password"
                placeholder="Confirm your new password"
                class="w-full px-4 py-2 mt-2 text-base rounded-md text-black transition duration-500 ease-in-out transform border-transparent bg-neutral-100 focus:border-gray-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"
            />
            
                <button
                disabled={done}
                on:click={async () => await handleChangePass()}
                class="border border-blue-800 disabled:bg-blue-600/60 w-full px-4 py-3 mt-6 font-regular rounded-md text-white transition duration-500 ease-in-out transform bg-blue-600 hover:bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2"
                >Confirm New Password</button
            >
            <button
                disabled={done}
                on:click={() => isOpen = false}
                class="border border-red-600 disabled:bg-red-300/60 w-full px-4 py-3 mt-2 font-regular rounded-md text-red-600 transition duration-500 ease-in-out transform  hover:bg-red-200 focus:shadow-outline focus:outline-none bg-red-50 focus:ring-2 ring-offset-current ring-offset-2"
                >Cancel</button
            >
            
        </div>
    </div>
{/if}
