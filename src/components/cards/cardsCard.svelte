<script>
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import AvatarDropdown from '@comp/buttons/avatarDropdown.svelte';

  export let card, permissions, getAllCards, getActiveCards, state;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const setStatus = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: !card.status }, { returning: 'minimal' })
      .eq('card_id', card.id);

    card.status = !card.status;

    if (error) {
      toastFailed();
      return;
    }

    if (card.status) {
      toastSuccess('Card has been activated');
    } else {
      toastSuccess('Card has been deactivated');
    }
  };

  const bgColor = (color) => {
    let bg = '';

    switch (color) {
      case 'red':
        bg = 'bg-red-700';
        break;
      case 'white':
        bg = 'bg-white';
        break;
      case 'black':
        bg = 'bg-black';
        break;
      default:
        bg = 'bg-neutral-900';
        break;
    }

    return bg;
  };

  const textColor = (color) => {
    let text = '';

    switch (color) {
      case 'white':
        text = 'text-black';
        break;
      default:
        text = 'text-white';
        break;
    }

    return text;
  };
</script>

{#if !permissions.readMembers}
  {#if $user?.id === card.uid}
    <div
      class="flex flex-col justify-between h-40 rounded-md p-4 mt-6 {textColor(
        card.color
      )} {bgColor(card.color)}"
    >
      <div class="flex justify-between relative">
        <h1>******{card.id.slice(-6)}</h1>
        {#if card.avatar !== null}
          <AvatarDropdown
            avatar={card.avatar}
            cardId={card.id}
            uid={card.uid}
            email={card.email}
            on:action={async () =>
              state === 'all' ? await getAllCards() : await getActiveCards()}
          />
        {/if}
      </div>
      <div class="flex justify-between items-end">
        <div class="flex flex-col">
          <h1>{card.type === 'pvc' ? 'PVC' : capitalize(card.type)} Card</h1>
          <h1>{capitalize(card.color)}</h1>
        </div>
        {#if card.status !== null}
          {#if permissions.writeMembers}
            <SwitchButton
              on:change={async () => await setStatus()}
              checked={card.status}
            />
          {/if}
        {/if}
      </div>
    </div>
  {/if}
{:else}
  <div
    class="flex flex-col justify-between h-40 rounded-md p-4 mt-6 {textColor(
      card.color
    )} {bgColor(card.color)}"
  >
    <div class="flex justify-between relative">
      <div class="flex flex-col gap-2">
        <h1>******{card.id.slice(-6)}</h1>
        {#if card.email !== null}
          <h1
            class="text-xs md:text-sm {card.color === 'white'
              ? 'text-neutral-600'
              : 'text-neutral-400'}"
          >
            {card.email}
          </h1>
        {/if}
      </div>
      {#if card.avatar !== null}
        <AvatarDropdown
          avatar={card.avatar}
          cardId={card.id}
          uid={card.uid}
          email={card.email}
          on:action={async () =>
            state === 'all' ? await getAllCards() : await getActiveCards()}
        />
      {/if}
    </div>
    {#if card.NFCtap !== null && card.QRScan !== null}
      <div class="flex gap-2">
        <h1>
          {card.NFCtap}
          <span
            class={card.color === 'white'
              ? 'text-neutral-600'
              : 'text-neutral-400'}>Taps</span
          >
        </h1>
        <h1>
          {card.QRScan}
          <span
            class={card.color === 'white'
              ? 'text-neutral-600'
              : 'text-neutral-400'}>Scans</span
          >
        </h1>
      </div>
    {/if}
    <div class="flex justify-between items-end">
      <div class="flex flex-col">
        <h1 class="break-all">
          {card.type === 'pvc' ? 'PVC' : capitalize(card.type)} Card {capitalize(
            card.color
          )}
        </h1>
      </div>
      {#if card.status !== null}
        {#if permissions.writeMembers}
          <SwitchButton
            on:change={async () => await setStatus()}
            checked={card.status}
          />
        {/if}
      {/if}
    </div>
  </div>
{/if}
