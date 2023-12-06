<script>
    import Input from "@comp/input.svelte";
    import { recordsTable, recordsTableMobile } from "@lib/constants";
    import RecordsTableBody from "@comp/tables/recordsTableBody.svelte";
    import TableHead from "@comp/tables/tableHead.svelte";
    import RecordTypeDropdownButton from "@comp/buttons/recordTypeDropdownButton.svelte";
    import Flatpickr from "svelte-flatpickr";
    import "flatpickr/dist/themes/dark.css";
    // import 'flatpickr/dist/flatpickr.css';
    import supabase from "@lib/db";
    import { memberData, user, userData } from "@lib/stores/userStore";
    import { toastFailed, toastSuccess } from "@lib/utils/toast";
    import {
        getConnectionsRecords,
        getLogsRecords,
    } from "@lib/query/getRecords";
    import { formatDate, last30Days, today } from "@lib/utils/getDates";
    import Spinner from "@comp/loading/spinner.svelte";
    import sortBy from "@lib/utils/sortBy";
    import { personal, team } from "@lib/stores/recordsStore";
    import { page } from "$app/stores";

    export let isTeamInactive, holder, getAllStorage;

    let fileName = `${formatDate(new Date())}-${formatDate(new Date())}`;
    let selectedType = "Activities";
    let fromDateValue = new Date();
    let toDateValue = new Date();
    let isLoading = false;
    let isCreateRecordLoading = false;
    let asc = false;
    let innerWidth;
    let teamId = $page.params.slug;

    const fromDateOptions = {
        onChange: (selectedDates, dateStr, instance) => {
            const dateLimiter = new Date(
                new Date(selectedDates[0]).setDate(
                    selectedDates[0].getDate() + 29
                )
            );

            toDateOptions.minDate = new Date(selectedDates[0]);
            toDateOptions.maxDate = new Date(dateLimiter);
            toDateValue = new Date(dateLimiter);
            fileName = `${formatDate(selectedDates[0])}-${formatDate(
                toDateValue
            )}`;
        },
        enableTime: false,
        // minDate: new Date(last30Days[0]),
        maxDate: new Date(fromDateValue),
    };

    let toDateOptions = {
        onChange: (selectedDates, dateStr, instance) => {
            fileName = `${formatDate(fromDateValue)}-${formatDate(
                selectedDates[0]
            )}`;
        },
        enableTime: false,
        maxDate: new Date(),
        minDate: new Date(last30Days[0]),
    };

    const createTeamStorage = async (url) => {
        const { data, error } = await supabase
            .from("team_storage")
            .insert({
                tid: teamId,
                by: holder,
                type: "Personal " + selectedType,
                storage_url: url,
                filename: `${fileName}-${
                    selectedType === "Activities"
                        ? "personal-activities"
                        : "personal-connections"
                }`,
            })
            .select("*");

        $team = [data[0], ...$team];
        if (error) console.log(error);
    };

    const createRecordHandler = async () => {
        let logsCsv = [];
        let connectionsCsv = [];

        if (selectedType === "Activities") {
            logsCsv = await getLogsRecords(
                "team_member",
                $memberData?.id,
                fromDateValue,
                toDateValue
            );
        } else {
            connectionsCsv = await getConnectionsRecords(
                "by",
                $memberData?.id,
                fromDateValue,
                toDateValue
            );
        }

        if (logsCsv.length !== 0 || connectionsCsv.length !== 0) {
            isCreateRecordLoading = true;
            const { data, error } = await supabase.storage
                .from("records")
                .upload(
                    `${teamId}/${$user?.id}/${fileName}-${
                        selectedType === "Activities"
                            ? "personal-activities"
                            : "personal-connections"
                    }`,
                    selectedType === "Activities" ? logsCsv : connectionsCsv,
                    {
                        contentType: "text/csv",
                    }
                );

            if (error) {
                if (
                    (error.message =
                        'duplicate key value violates unique constraint "bucketid_objname')
                ) {
                    toastFailed(
                        "File already exists. Please rename the file and try again."
                    );
                } else {
                    toastFailed(error.message);
                }
                isCreateRecordLoading = false;
            }

            if (data) {
                toastSuccess(
                    `${fileName}-${
                        selectedType === "Activities"
                            ? "personal-activities"
                            : "personal-connections"
                    } created successfully`
                );

                await createTeamStorage(data.path);
                await getAllStorage();
                isCreateRecordLoading = false;
            }

            fileName = `${formatDate(new Date())}-${formatDate(new Date())}`;
            selectedType = "Activities";
            toDateValue = new Date(today);
            fromDateValue = new Date(today);
            toDateOptions.maxDate = new Date(today);
            isCreateRecordLoading = false;
        } else {
            console.log("No records found");
        }
    };

    const deleteHandler = async (record) => {
        isLoading = true;
        let noErr = false;

        //delete from team records storage, if exists
        const { error } = await supabase.storage
            .from("records")
            .remove([`${teamId}/${record.name}`]);

        // delete from personal records storage
        const { error: personalRecordsError } = await supabase.storage
            .from("records")
            .remove([`${teamId}/${$user?.id}/${record.name}`]);

        //delete from team storage database
        const { error: err } = await supabase
            .from("team_storage")
            .delete()
            .eq("filename", record.name);

        if (err) {
            toastFailed(err.message);
            isLoading = false;
        } else {
            noErr = true;
            isLoading = false;
        }

        if (error) {
            toastFailed("Failed to delete record");
            isLoading = false;
        }

        if (noErr && !error) {
            toastSuccess(`${record.name} deleted successfully`);
            $personal = $personal.filter((item) => item.id !== record.id);
            $team = $team.filter((item) => item.id !== record.id);
            await getAllStorage();
            isLoading = false;
        }
    };
    const sortHandler = async (col) => {
        $personal = $personal.sort(
            sortBy(col, asc, function (a) {
                return a.toUpperCase();
            })
        );
    };

    const selectTypeHandler = (e) => (selectedType = e.detail);
</script>

<svelte:window bind:innerWidth />
<div class=" w-full flex flex-row bg-gray-100">
    <div
        class="md:flex max-w-md hidden min-h-screen flex-col w-full justify-between gap-4 border-r bg-white  h-full"
    >
        <div class="pt-4 px-10 flex flex-col gap-4">
            {#if $userData?.includes("inactive")}
                <Input
                    disabled={true}
                    placeholder="Type"
                    title="Type"
                    bind:value={selectedType}
                    isFilenameInput={true}
                    isEmptyChecking={true}
                />
                <Input
                    disabled={true}
                    placeholder="From"
                    title="From"
                    bind:value={fileName}
                    isFilenameInput={true}
                    isEmptyChecking={true}
                />
                <Input
                    disabled={true}
                    placeholder="To"
                    title="To"
                    bind:value={fileName}
                    isFilenameInput={true}
                    isEmptyChecking={true}
                />
            {:else}
                <RecordTypeDropdownButton
                    on:select={selectTypeHandler}
                    {selectedType}
                />
                <div class="flex flex-col gap-2">
                    <p class="text-gray-400">From</p>
                    <Flatpickr
                        options={fromDateOptions}
                        bind:value={fromDateValue}
                        name="date"
                        class="w-full bg-neutral-800 rounded-md p-2 cursor-pointer"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-gray-400">To</p>
                    <Flatpickr
                        options={toDateOptions}
                        bind:value={toDateValue}
                        name="date"
                        class="w-full bg-neutral-800 rounded-md p-2 cursor-pointer disabled:cursor-default"
                    />
                </div>
            {/if}
            <Input
                disabled={$userData?.includes("inactive")}
                placeholder="Filename"
                title="Filename"
                bind:value={fileName}
                isFilenameInput={true}
                isEmptyChecking={true}
            />
            {#if fileName.length < 4}
                <small class="text-red-500">
                    You must enter a filename with at least 4 characters.
                </small>
            {/if}
        </div>

        <button
            class="flex sticky bottom-0 justify-center items-center h-14 gap-4 bg-blue-600 p-3 disabled:bg-blue-600/60 disabled:cursor-default"
            disabled={fileName.includes(".") || fileName.length < 4
                ? true
                : false ||
                  $userData?.includes("inactive") ||
                  isCreateRecordLoading}
            on:click={async () => {
                if (selectedType === "Choose Type") {
                    toastFailed("Please select a type");
                } else {
                    await createRecordHandler();
                }
            }}
        >
            {#if isCreateRecordLoading}
                <Spinner bg="#1f4496" class="w-6 h-6" />
            {/if} <span class="text-white">Create record &#8594;</span></button
        >
    </div>

<div
    class="w-full ml-0 snap-container snap-x mx-auto h-full snap-mandatory flex flex-col overflow-x-auto"
>
    <table class="snap-center text-black w-full">
        <thead class="text-left top-0 border-b text-neutral-400 bg-white">
            <tr>
                {#if innerWidth > 640}
                    <TableHead
                        class="w-1/6"
                        data={recordsTable}
                        on:sort={async (e) => {
                            asc = !asc;
                            await sortHandler(e.detail ?? "name");
                        }}
                    />
                {:else}
                    <TableHead
                        class="w-1/6"
                        data={recordsTableMobile}
                        on:sort={async (e) => {
                            asc = !asc;
                            await sortHandler(e.detail ?? "name");
                        }}
                    />
                {/if}
            </tr>
        </thead>
        <tbody>
            {#if $personal}
                {#if $personal.length > 0}
                    {#each $personal as record, i}
                        <RecordsTableBody
                            {innerWidth}
                            {record}
                            {teamId}
                            {isTeamInactive}
                            {deleteHandler}
                            {isLoading}
                        />
                    {/each}
                {:else}
                    <tr>
                        <td
                            class="text-center text-xl pt-4 text-neutral-400"
                            colspan="4"
                        >
                            No records found
                        </td>
                    </tr>
                {/if}
            {/if}
        </tbody>
    </table>
</div>
</div>
<style>
    .snap-container::-webkit-scrollbar {
        height: 5px;
        width: 0px;
    }
    .snap-container::-webkit-scrollbar-track {
        background-color: #e4e4e4;
    }
    .snap-container::-webkit-scrollbar-thumb {
        background-color: #71717a;
    }
</style>
