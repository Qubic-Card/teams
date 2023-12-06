<script>
    import { fade, fly, slide } from "svelte/transition";
    import { user } from "@lib/stores/userStore";
    import SVGInject from "@iconfu/svg-inject";
    import { socials, links, basicSocials, basicLinks } from "@lib/stores/editorStore";
    import { theme } from "@lib/profileTheme";
    import Lenis from "@studio-freight/lenis";
    import Dummy from "@lib/dummy.json";

    import { onMount } from "svelte";

    export let isShowMetaImage = false;
    export let isEditorMode = false;
    export let data,
        profileUid,
        cardId,
        isTeam,
        memberId,
        teamData,
        isDisplayPersonal,
        isLoading;
    // console.log(teamData);
    let showModal = false;

    let currentTheme = theme[data?.design?.theme?.toString() ?? "dark"];
    let holder = data?.firstname + " " + data?.lastname;
    
    SVGInject.setOptions({
      useCache: false, // no caching
      copyAttributes: false, // do not copy attributes from `<img>` to `<svg>`
      makeIdsUnique: false, // do not make ids used within the SVG unique
      afterLoad: function(svg, svgString) {
        // add a class to the svg
        svg.classList.add('fill-white');
      },
    });

    let personalProfile = {
        firstname: data?.firstname ?? "",
        lastname: data?.lastname ?? "",
        address: data?.address ?? "",
        company: data?.company ?? "",
        job: data?.job ?? "",
        avatar: data?.avatar,
        design: data?.design,
        socials: data?.socials?.filter(
            (social) => !social.type.includes("business"),
        ),
        links: data?.links?.filter((link) => link.isPersonal !== false),
        isBusiness: data?.isBusiness,
    };

    $: if (data) {
        personalProfile = {
            firstname: data?.firstname ?? "",
            lastname: data?.lastname ?? "",
            address: data?.address ?? "",
            company: data?.company ?? "",
            job: data?.job ?? "",
            avatar: data?.avatar,
            design: data?.design,
            socials: data?.socials?.filter(
                (social) => !social.type.includes("business"),
            ),
            links: data?.links?.filter((link) => link.isPersonal !== false),
            isBusiness: data?.isBusiness,
        };

        holder = data?.firstname + " " + data?.lastname;
    }

    $: if (data?.design?.theme) {
        currentTheme = data.isBusiness
            ? data?.design?.themeBusiness != null
                ? theme[data?.design?.themeBusiness?.toString()]
                : (currentTheme = theme["dark"])
            : theme[data?.design?.theme?.toString()];
    } else {
        currentTheme = theme["dark"];
    }
    console.log(data)
    onMount(() => {
        if (!isEditorMode) {
            const lenis = new Lenis({
                duration: 1.2,
                smoothTouch: false,
                touchMultiplier: 2,
                easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
        }
    });
</script>

{#if !isEditorMode}
    <div
        class="h-14 {currentTheme?.border} border-b fixed max-w-md z-[1] top-0 mx-auto {currentTheme?.pageBackground} bg-opacity-40 backdrop-blur-sm w-full flex justify-center items-center"
    >
        <img
            class="h-10 w-10"
            src={teamData?.metadata?.logo ?? "/qubic.svg"}
            alt=""
        />
    </div>
{/if}
<div
    class={`${currentTheme?.pageBackground} ${$$props.class} relative transition-colors min-h-screen px-6 duration-500 ease-in text-sm`}
    class:bg-image-profile={currentTheme?.backgroundImage}
    style={`--bg-img-profile: url('${currentTheme?.backgroundImage}')`}
>
    <!-- Event -->
    {#if !isEditorMode}
    <div class="h-screen flex items-center w-full">
        <div
            class="aspect-[9/16] w-full bg-[url('https://images.unsplash.com/photo-1542992015-8b34590ec327?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-contain rounded-md"
        ></div>
    </div>
    {/if}
    <!-- INTRO -->
    <div
        class="w-full max-w-sm text-white h-screen justify-center flex flex-col"
    >
        <h1 class=" text-5xl font-semibold">{data?.company}</h1>
        <p class="text-xl opacity-50 mt-5">{data?.intro ?? ''}</p>
    </div>
    <!-- PROFILE -->
    <div class="w-full max-w-sm text-white min-h-screen flex flex-col">
        <div class="flex flex-row h-[175px]">
            <div class="h-[175px] w-[175px]">
                <img
                    class="rounded-t-2xl h-full w-full object-cover rounded-bl-2xl"
                    src={data?.avatar}
                    alt=""
                />
            </div>
            <div class="flex flex-col justify-between ml-2">
                <h1 class="text-2xl font-medium uppercase">
                    {#if !data?.isBusiness}
                        {data?.firstname ?? Dummy.firstname}
                        {data?.lastname ?? ""}
                    {:else}
                        {data?.firstnameBusiness ?? Dummy.firstname}
                        {data?.lastnameBusiness ?? ""}
                    {/if}
                </h1>
                <div>
                    <h1 class="text-sm text-neutral-500">
                        {#if !data?.isBusiness}
                            {data?.job ?? Dummy.job}
                        {:else}
                            {data?.jobBusiness ?? ""}
                        {/if}
                    </h1>
                    <h1 class="text-sm text-neutral-500">
                        {#if !data?.isBusiness}
                            {data?.company ?? ""}
                        {:else}
                            {data?.companyBusiness ?? ""}
                        {/if}
                    </h1>
                </div>
            </div>
        </div>
        <div
            transition:slide|local
            class="flex space-x-2 mt-10 flex-wrap items-start"
        >
            {#if isEditorMode ? $basicSocials.length < 1 : data.socials.length < 1 || isEditorMode ? $basicSocials.every((s) => s.isActive === false) : data.socials.every((s) => s.isActive === false)}
                <div></div>
            {:else}
                {#each isEditorMode ? $basicSocials : data.socials as item, i}
                    {#if item.isActive}
                        <button
                            on:click={async () => {}}
                            class="py-2 px-2 rounded-full flex space-x-3 justify-center items-center {currentTheme?.outline} {currentTheme?.secondary}"
                        >
                        <!-- <svg height="24px" width="24px">
                            <use href={"/socialicons/" + item.type + ".svg#img"}></use>
                        </svg> -->
                        <img class="fill-white" src={"/socialicons/" + item.type + ".svg"} onload={SVGInject(this)} />
                            
                            <p class="pr-2">{item.type}</p>
                        </button>
                    {/if}
                {/each}
            {/if}
        </div>
        <!-- banner -->
        {#if data.design.background}
        <div
            class="aspect-[3] rounded-md bg-cover mt-10 bg-[url({data.design.background})]"
        ></div>
        {/if}
        <!-- Links -->
        <div class="flex flex-col mt-10">
            {#each isEditorMode ? $basicLinks : data.links as item, i}
                {#if item.isActive}
                    <a href={item.link} class="text-lg">{item.title}</a>
                {/if}
            {/each}
        </div>
    </div>
</div>
{#if !isEditorMode}
    <div
        class="h-14 {currentTheme?.pageBackground} {currentTheme?.border} {currentTheme?.buttonText} border-t fixed w-full text-sm font-light flex-row max-w-md bottom-0 mx-auto flex justify-between items-center"
    >
        <button class="w-full h-full text-left border-r {currentTheme?.border}">
            <p class="px-10">Connect With Me</p>
        </button>
        <button class="px-10">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-user-plus"
                ><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle
                    cx="8.5"
                    cy="7"
                    r="4"
                /><line x1="20" y1="8" x2="20" y2="14" /><line
                    x1="23"
                    y1="11"
                    x2="17"
                    y2="11"
                /></svg
            >
        </button>
    </div>
{/if}
