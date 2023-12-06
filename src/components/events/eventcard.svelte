<script>
    export let title;
    export let description;
    export let expiry;
</script>
<div class="w-full bg-white rounded-md outline outline-1 outline-neutral-200">
    <div class="px-3 py-2">
        <p class="text-md font-medium">{title}</p>
        <p class="text-sm">{description}</p>
        <div class="flex mt-3 justify-between text-sm">
            <p>Expired at</p>
            <p class="text-sm">{expiry}</p>
        </div>
        <div class="flex mt-1 border-t pt-2 justify-between text-xs">
            <button class="border border-neutral-100 text-neutral-500 px-2 py-1 rounded-full">Deactivate</button>
            <button class="border border-neutral-100 px-2 py-1 rounded-full">Edit Event</button>
        </div>
    </div>
</div>