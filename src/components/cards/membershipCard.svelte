<script>
  import setHours4Digit from '@lib/utils/setHour4Digit';

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
    class="flex flex-col md:grid gap-2 md:grid-cols-[150px_100px_100px_minmax(200px,_1fr)] lg:grid-cols-[300px_200px_105px_minmax(200px,_1fr)] text-sm"
  >
    <div class="flex flex-col">
      <h1 class="font-semibold text-white md:text-sm text-xs break-all">
        {member.Firstname}
        {member.Lastname}
      </h1>
      <p class="break-all">{member.Job}</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Joined At</h1>

      <p>
        {new Date(member.JoinedAt).toLocaleDateString()} - {setHours4Digit(
          new Date(member.JoinedAt).getHours(),
          new Date(member.JoinedAt).getMinutes()
        )}
      </p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Points</h1>
      <p>{member.Points}</p>
    </div>
    <div class="flex flex-col">
      <h1 class="font-regular text-neutral-400">Added By</h1>
      <p>{member.AddedBy}</p>
    </div>
  </div>
</div>
