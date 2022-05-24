<script>
  import { user } from '@lib/stores/userStore';
  import supabase from '@lib/db.js';
  import { goto } from '$app/navigation';
  import Cookies from 'js-cookie';
  import { page } from '$app/stores';

  $user = supabase.auth.user();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      user.set(session.user);
      await goto('/select-teams', { noscroll: true });
    }
    if (event == 'TOKEN_REFRESHED') {
      user.set(session.user);
    }
    if (event == 'PASSWORD_RECOVERY') {
      user.set(null);
      await goto('/resetPassword' + '?reset=' + session.access_token, {
        noscroll: true,
      });
    }
    if (event == 'SIGNED_OUT') {
      user.set(null);
      await goto('/', {
        noscroll: true,
      });
    } else {
      user.set(null);
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
