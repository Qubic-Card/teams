<script>
    import { goto } from "$app/navigation";
    import EventCard from "@comp/events/eventcard.svelte";
    import supabase from "@lib/db";
    import { user } from "@lib/stores/userStore";
    // let arr = [{title:"Griya BCA", description:"Rayakan Griya ke-10"}, {title:"Ultah Qubic", description:"Ulang taun Qubic yang ke-2"}]

    const loadEvents = async () => {
        let { data: events, error } = await supabase
            .from("events")
            .select("*")
            .eq("uid", $user.id);
        console.log(events);
        return events;
    };
</script>

<div></div>
<div class="bg-gray-100 min-h-screen w-full">
    <div class="pt-10 mx-10">
        <div
            class="flex flex-row justify-between items-center pb-2 border-b w-full"
        >
            <h1 class="text-lg font-semibold">Events</h1>
            <button
                on:click={() => goto("/basic/events/create")}
                class="border text-sm px-3 py-2 rounded-full"
                >+ Create Event</button
            >
        </div>
        <div class="grid grid-cols-4 space-x-4 mt-3">
            {#await loadEvents()}
                <div></div>
            {:then arr}
                {#each arr as e, i}
                    <EventCard expiry={e.end_date} title={e.title} description={e.description}
                    ></EventCard>
                {/each}
            {/await}
        </div>
    </div>
</div>
