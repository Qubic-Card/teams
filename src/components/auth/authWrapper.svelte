<script>
  import { user } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { browser } from '$app/env';
  import { cards } from '@lib/stores/cardsStore';
  import Cookies from 'js-cookie';
  import { teams } from '@lib/stores/teamStore';

  $user = supabase.auth.user();
  const getBusinessCards = async (uid) => {
    if (!Cookies.get('card')) {
      try {
        let { data, error } = await supabase
          .from('card_connection')
          .select('card_id(mode)')
          .eq('uid', uid);
        // .limit(1);

        if (error) throw error;

        if (data?.length > 0) {
          let basicCards = data.filter((card) => card.card_id.mode === 'basic');
          if (basicCards.length !== 0) {
            $cards = basicCards;
            Cookies.set('card', data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const checkIsActiveMember = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('uid')
      .eq('uid', $user?.id);

    if (error) console.log(error);
    if (data) {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const redirect = async () => {
    // if (await checkIsActiveMember()) {
    //   if ($user && $page.url.pathname === '/') goto('/');
    //   // if ($user && $teams.isTeamMember === false) goto('/basic');
    // } else {
    //   $user = null;
    // }

    if (!$user) goto('/');
  };
  $: if (browser) redirect();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      await getBusinessCards(session.user.id);
      $user = supabase.auth.user();
    }
    if (event == 'TOKEN_REFRESHED') {
      await getBusinessCards(session.user.id);
      $user = supabase.auth.user();
    }
    if (event == 'PASSWORD_RECOVERY') {
      $user = null;
      await goto('/resetPassword' + '?reset=' + session.access_token, {
        noscroll: true,
      });
    }
    if (event == 'SIGNED_OUT') {
      $user = null;
      $cards = Cookies.get('card');
      Cookies.remove('card');
      await goto('/', { noscroll: true });
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
