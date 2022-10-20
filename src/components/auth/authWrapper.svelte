<script>
  import { user } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { browser } from '$app/env';
  import { cards } from '@lib/stores/cardsStore';
  import Cookies from 'js-cookie';

  $user = supabase.auth.user();

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
    if ($page.routeId.includes('slug')) {
      if (!(await checkIsActiveMember())) {
        $user = null;
      }
    }
    if (!$user) goto('/');
  };
  $: if (browser) redirect();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      $user = supabase.auth.user();
    }
    if (event == 'TOKEN_REFRESHED') {
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
