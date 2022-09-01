<script lang="ts">
  import { goto } from '$app/navigation';

  import { teams } from '@lib/stores/teamStore';
  import convertToGMT7 from '@lib/utils/convertToGMT7';

  export let permissions;
</script>

<div class={`gap-3 ${permissions.readBilling ? 'flex' : 'hidden'}`}>
  <div class="bg-neutral-800 rounded-lg p-4 w-full md:w-3/4">
    <div class="flex flex-col my-4">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4"
      >
        <h1 class="font-bold text-xl">Billing</h1>
        <div
          class={`gap-2 ${
            permissions.writeBilling && permissions.readBilling
              ? 'flex'
              : 'hidden'
          }`}
        >
          <button
            class="p-2 w-40 bg-blue-600 text-white rounded-md"
            on:click={async () =>
              await window.open('https://wa.me/628113087599', '_blank').focus()}
            >Change subscription</button
          >
        </div>
      </div>
      <p>
        Subscription valid hingga: {convertToGMT7($teams?.subscription_end_date)
          .toDateString()
          .slice(4) ?? '-'}
      </p>
      <p>
        Jumlah member: {$teams?.member_count ?? '-'}
      </p>
      <!-- <div
        class="flex justify-between items-center p-3 rounded mt-4 bg-neutral-900"
      >
        <p>Aktifkan auto renew</p>
        <Switch
          checked={isAutoRenew}
          on:change={(e) => (isAutoRenew = e.detail)}
          class={`flex justify-center items-center self-end rounded w-12 h-8 ${
            isAutoRenew ? 'bg-green-600' : 'bg-neutral-600'
          }`}
        >
          <span
            class={`inline-block w-5 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
              isAutoRenew ? 'translate-x-2' : '-translate-x-2'
            }`}
            class:toggle-on={isAutoRenew}
            class:toggle-off={!isAutoRenew}
          />
        </Switch>
      </div> -->
    </div>
  </div>
  <div class="bg-neutral-800 p-4 w-1/4 rounded-lg text-lg hidden md:flex">
    <p class="mb-4">Atur subscription dalam billing</p>
  </div>
</div>
