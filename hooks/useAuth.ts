import { useCallback }    from 'react';
import { useRouter }      from 'expo-router';
import { useAuthStore }   from '@/store/authStore';
import { REGEX }          from '@/constants/config';
import { toast }          from '@/components/ui';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithInvite,
    logout,
    clearError,
  } = useAuthStore();

  // ── Login with invite code ───────────────────────────────────
  const handleLoginWithInvite = useCallback(async (code: string) => {
    const trimmed = code.trim().toLowerCase();

    if (!trimmed) {
      toast({ message: 'Please enter your invite code', tone: 'error' });
      return false;
    }

    if (!REGEX.inviteCode.test(trimmed)) {
      toast({
        message: 'That code format doesn\'t look right — e.g. jd-a9k2p',
        tone: 'error',
      });
      return false;
    }

    try {
      await loginWithInvite(trimmed);
      toast({ message: 'Welcome to INNER', tone: 'success' });

      const destination = user?.role === 'admin'
        ? '/(admin)/dashboard'
        : '/(member)/directory';

      router.replace(destination as any);
      return true;
    } catch (err: any) {
      toast({
        message: err?.message ?? 'Invalid invite code. Please try again.',
        tone: 'error',
      });
      return false;
    }
  }, [loginWithInvite, router, user?.role]);

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/(auth)');
  }, [logout, router]);

  // ── Guards ───────────────────────────────────────────────────
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)');
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  const requireAdmin = useCallback(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/(member)/directory');
      return false;
    }
    return true;
  }, [isAuthenticated, user?.role, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin:              user?.role === 'admin',
    isMember:             user?.role === 'member',
    loginWithInvite:      handleLoginWithInvite,
    logout:               handleLogout,
    requireAuth,
    requireAdmin,
    clearError,
  } as const;
}