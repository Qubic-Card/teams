<script context="module">
  import supabase from '@lib/db.js';
  export async function load(ctx) {
    if (!supabase.auth.user()) {
      return {
        // headers: {
        //   Location: '/',
        // },
        redirect: '/',
        status: 302,
      };
    }
    return {};
  }
</script>

<script>
  import { user, userData } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  const getTeamMembers = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('role(*)')
      .eq('uid', $user.id);

    if (error) console.log(error);

    const { role_maps, role_name } = data[0].role;
    if (data) {
      return { role_maps, role_name };
    }
  };

  // onMount(async () => {
  //   const { role_maps, role_name } = await getTeamMembers();
  //   roleMapping = role_maps;
  //   // [
  //   //   "allow_read_members",
  //   //   "allow_read_team",
  //   //   "allow_read_analytics",
  //   //   "allow_write_members",
  //   //   "allow_write_team",
  //   //   "allow_write_profile"
  //   // ]
  // });
  $user = supabase.auth.user();
  // $: console.log('wrap', $user);
  $: console.log(supabase.auth.user());
  $: console.log("user data",$userData);
  // $: console.log('wrap', $page);

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      const { role_maps, role_name } = await getTeamMembers();
      userData.set(role_maps);
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
      await goto('/', { noscroll: true });
    } else {
      user.set(null);
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
