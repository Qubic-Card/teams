<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui';
  import Cookies from 'js-cookie';

  export let permissions;
  let isAutoRenew = false;
  let teamId = Cookies.get('qubicTeamId');
</script>

<div class={`gap-4 ${permissions.readBilling ? 'flex' : 'hidden'}`}>
  <div class="bg-neutral-800 rounded-lg p-4 w-3/4">
    <div class="flex flex-col my-4">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4"
      >
        <h1 class="font-bold text-xl md:text-3xl">Billing</h1>
        <div
          class={`gap-2 ${
            permissions.writeBilling && permissions.readBilling
              ? 'flex'
              : 'hidden'
          }`}
        >
          <button
            class="p-4 w-auto bg-blue-600 text-white rounded-lg"
            on:click={async () => await console.log('billing')}
            >Change subscription</button
          >
          <button
            class="p-4 w-auto bg-blue-600 text-white rounded-lg"
            on:click={async () => await console.log('billing')}
            >Tambah saldo</button
          >
        </div>
      </div>
      <p>Subscription valid hingga: 12 Feb 2023</p>
      <p>Saldo tersisa: 0</p>
      <div
        class="flex justify-between items-center p-3 rounded-full mt-4 bg-neutral-800"
      >
        <p>Aktifkan auto renew</p>
        <Switch
          checked={isAutoRenew}
          on:change={(e) => (isAutoRenew = e.detail)}
          class={`flex justify-center items-center self-end rounded-full w-12 h-8 ${
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
      </div>
    </div>
  </div>
  <div class="bg-neutral-800 p-4 w-1/4 rounded-lg text-xl">
    <p class="mb-4">Atur subscription dalam billing</p>
  </div>
</div>
