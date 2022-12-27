<script>
  import { user } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { browser } from '$app/environment';
  import { cards } from '@lib/stores/cardsStore';
  import Cookies from 'js-cookie';
  import { checkIsActiveMember } from '@lib/query/checkIsActiveMember';

  $user = supabase.auth.user();

  const redirect = async () => {
    if ($page?.route.id?.includes('slug')) {
      if (!(await checkIsActiveMember($user?.id))) {
        $user = null;
      }
      if (!$user?.email_confirmed_at) {
        $user = null;
        goto('/');
      }
      if (!$user) goto('/');
    }

    if ($page?.route.id?.includes('basic')) {
      if (!$user) goto('/');
      if (!$user?.email_confirmed_at) {
        $user = null;
        goto('/');
      }
    }
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
        noScroll: true,
      });
    }
    if (event == 'SIGNED_OUT') {
      $user = null;
      $cards = Cookies.get('card');
      Cookies.remove('card');
      await goto('/', { noScroll: true });
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
