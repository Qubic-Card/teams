<script>
    export let color = "white";
    export let type = "metal";

    const _bg = () => {
        var img = new Image();
        if (color == "white" && type == "metal") {
            img.src = "/cards/matte-w.webp";
            return "/cards/matte-w.webp";
        } else if (color == "black" && type == "metal") {
            img.src = "/cards/matte-b.webp";
            return "/cards/matte-b.webp";
        } else if (color == "brushed black" && type == "metal") {
            img.src = "/cards/metal_black.webp";
            return "/cards/metal_black.webp";
        } else if (color == "red" && type == "metal") {
            img.src = "/cards/metal_red.webp";
            return "/cards/metal_red.webp";
        } else if (color == "white" && type == "pvc") {
            img.src = "/cards/pvc-w.webp";
            return "/cards/pvc-w.webp";
        } else if (color == "black" && type == "pvc") {
            img.src = "/cards/pvc-b.webp";
            return "/cards/pvc-b.webp";
        } else {
            img.src = "/cards/matte-w.webp";
            return "/cards/matte-w.webp";
        }
    };

    $: console.log(_bg());
</script>

<div class="h-full w-full rounded-lg relative">
    <img class=" absolute" src="{_bg()}" alt="">
    <div
        class='rounded-lg relative flex h-full w-full'
    >
        <slot />
    </div>
</div>
