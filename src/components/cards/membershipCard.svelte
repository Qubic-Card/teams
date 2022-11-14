<script>
  export let member;
</script>

<div
  class="flex bg-neutral-900 outline-1 outline outline-neutral-800 p-3 rounded-md h-auto gap-2 md:gap-8 items-center"
>
  <img
    class="w-16 h-16 rounded-full"
    src="https://placeimg.com/640/480/any"
    alt={'avatar'}
  />

  <div
    class="flex flex-col md:grid gap-2 md:grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_150px_100px_minmax(200px,_1fr)] text-sm"
  >
    <div class="flex flex-col">
      <h1 class="font-semibold text-white md:text-sm text-xs break-all">
        memberProfile?.team_profile?.firstname
        <!-- memberProfile?.team_profile?.lastname ?? '' -->
      </h1>
      <p class="break-all">memberProfile?.team_profile?.job</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Joined At</h1>
      <p>
        {new Date().toLocaleDateString()} - {new Date().getHours()}:{new Date().getMinutes()}
      </p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Points</h1>
      <p>10</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Added By</h1>
      <p>Galih</p>
    </div>
  </div>
</div>
