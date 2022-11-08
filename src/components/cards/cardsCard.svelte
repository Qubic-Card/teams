<script>
  import SwitchButton from '@comp/buttons/switchButton.svelte';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import AvatarDropdown from '@comp/buttons/avatarDropdown.svelte';

  export let card, permissions, getCards;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const setStatus = async () => {
    const { data, error } = await supabase
      .from('team_cardcon')
      .update({ status: !card.card[0].status }, { returning: 'minimal' })
      .eq('card_id', card.id);

    card.card[0].status = !card.card[0].status;

    if (error) {
      toastFailed();
      return;
    }

    if (card.card[0].status) {
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
  {#if card.card.length > 0}
    {#if $user?.id === card.card[0].team_member_id.uid}
      <div
        class="flex flex-col justify-between h-40 rounded-md p-4 mt-6 {textColor(
          card.color
        )} {bgColor(card.color)}"
      >
        <div class="flex justify-between relative">
          <h1>******{card.id.slice(-6)}</h1>
          {#if card.card.length > 0}
            <AvatarDropdown
              avatar={card.card[0].team_member_id.avatar}
              uid={card.card[0].team_member_id.uid}
              cardId={card.id}
              on:action={async () => await getCards()}
            />
          {/if}
        </div>
        <div class="flex justify-between items-end">
          <div class="flex flex-col">
            <h1>{card.type === 'pvc' ? 'PVC' : capitalize(card.type)} Card</h1>
            <h1>{capitalize(card.color)}</h1>
          </div>
          {#if card.card.length > 0}
            {#if permissions.writeMembers}
              <SwitchButton
                on:change={async () => await setStatus()}
                checked={card.card[0].status}
              />
            {/if}
          {/if}
        </div>
      </div>
    {/if}
  {/if}
{:else}
  <div
    class="flex flex-col justify-between h-40 rounded-md p-4 mt-6 {textColor(
      card.color
    )} {bgColor(card.color)}"
  >
    <div class="flex justify-between relative">
      <h1>******{card.id.slice(-6)}</h1>
      {#if card.card.length > 0}
        <AvatarDropdown
          avatar={card.card[0].team_member_id.avatar}
          uid={card.card[0].team_member_id.uid}
          cardId={card.id}
          on:action={async () => await getCards()}
        />
      {/if}
    </div>
    {#if card.card.length > 0}
      <div class="flex gap-2">
        <h1>
          {card.card[0].NFCtap}
          <span
            class={card.color === 'red'
              ? 'text-neutral-400'
              : 'text-neutral-700'}>Taps</span
          >
        </h1>
        <h1>
          {card.card[0].QRScan}
          <span
            class={card.color === 'red'
              ? 'text-neutral-400'
              : 'text-neutral-700'}>Scans</span
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
      {#if card.card.length > 0}
        {#if permissions.writeMembers}
          <SwitchButton
            on:change={async () => await setStatus()}
            checked={card.card[0].status}
          />
        {/if}
      {/if}
    </div>
  </div>
{/if}
