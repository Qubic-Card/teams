<script>
    import Input from "@comp/input.svelte";
    import FilePond, { registerPlugin } from 'svelte-filepond';
    import { DateInput } from 'date-picker-svelte'
    import { goto } from "$app/navigation";
  let date = new Date()

    let title;
    let pond;
</script>

<div class="bg-gray-100 w-full min-h-screen">
    <div class="pt-10 mx-10">
        <div>
            <h1 class="font-bold text-lg">
                <span class="px-2 font-normal border rounded-full text-sm"
                    >New</span
                > Create your event
            </h1>
            <p class="text-neutral-600">Get data according to your event</p>
        </div>
    </div>
    <div class="grid grid-cols-2 pt-6 mx-10">
        <div class=" bg-white">
            <div class=" px-4 py-1 mt-4">
                <Input
                    on:change={null}
                    placeholder="Title"
                    title="Title"
                    bind:value={title}
                    inputbg="bg-neutral-100"
                    inputText="text-black"
                />
            </div>
            <div class="  px-4 py-1">
                <p class="text-sm text-gray-400">Description</p>
                      <textarea
                      maxlength="160"
                        on:change={null}
                        placeholder="Tell us about what this event is about"
                        title="Description"
                        
                        class="w-full bg-neutral-100 rounded-md px-2 py-2 mt-2 resize-none"
                      />
            </div>
            <div class=" px-4 py-1">
                <FilePond
                    bind:this={pond}
                    credits=""
                    allowProcess={false}
                    class="cursor-pointer"
                    acceptedFileTypes={["image/png", "image/jpeg"]}
                    instantUpload={false}
                    imageCropAspectRatio={1 / 1}
                    labelIdle="Add event image"
                    allowMultiple={false}
                />
            </div>
            <div class=" px-4 py-1 flex flex-row items-center justify-between">
                
                <div>
                    <p class="text-sm text-gray-400">Start Date</p>
                    <DateInput bind:value={date} />
                </div>
                <div>
                    <p class="text-sm text-gray-400">End Date</p>
                    <DateInput bind:value={date} />
                </div>
            </div>
            <div class="border-t w-full flex items-center justify-end flex-row mt-3 py-3">
                <button on:click={() => goto('/basic/events')} class=" px-2 py-1  text-neutral-600 mr-4">Cancel</button>
                <button class=" px-4 py-1 bg-blue-600 rounded-full mr-4 text-white">Create</button>
            </div>
        </div>
    </div>
</div>
