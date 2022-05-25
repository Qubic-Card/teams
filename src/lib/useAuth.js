import { goto } from '$app/navigation';

const useAuth = async (user) => {
  if (!user) await goto('/');
};

export default useAuth;
