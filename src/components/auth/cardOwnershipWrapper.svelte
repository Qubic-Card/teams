<script>
  import { goto } from '$app/navigation';
  import supabase from '@lib/db';
  import { user } from '@lib/stores/userStore';
  import { onMount } from 'svelte';

  const getBusinessCards = async (uid) => {
    try {
      let { data, error } = await supabase
        .from('card_connection')
        .select('card_id(mode)')
        .eq('uid', uid);

      if (error) throw error;

      if (data?.length > 0) {
        let basicCards = data.filter((card) => card.card_id.mode === 'basic');
        if (basicCards.length !== 0) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  let isMounted = false;

  onMount(async () => {
    if (await getBusinessCards($user?.id)) {
      // goto('/basic');
      isMounted = true;
    } else {
      goto('/');
    }
  });
</script>

<slot {isMounted} />
