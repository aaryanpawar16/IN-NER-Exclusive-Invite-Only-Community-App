import { create }        from 'zustand';
import { authService }   from '@/services/auth.service';
import { tokenStore }    from '@/services/api';
import type { User }     from '@/types/auth.types';

type AuthState = {
  user:            User | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  isRestoring:     boolean;
  error:           string | null;
};

type AuthActions = {
  loginWithInvite: (code: string) => Promise<void>;
  restoreSession:  ()             => Promise<void>;
  logout:          ()             => Promise<void>;
  setUser:         (user: User)   => void;
  clearError:      ()             => void;
  setLoading:      (v: boolean)   => void;
};

type AuthStore = AuthState & AuthActions;

const INITIAL_STATE: AuthState = {
  user:            null,
  isAuthenticated: false,
  isLoading:       false,
  isRestoring:     false,
  error:           null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...INITIAL_STATE,

  loginWithInvite: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.loginWithInvite(code);
      tokenStore.set(token);
      set({
        user,
        isAuthenticated: true,
        isLoading:       false,
        error:           null,
      });
    } catch (err: any) {
      set({
        user:            null,
        isAuthenticated: false,
        isLoading:       false,
        error:           err?.message ?? 'Login failed.',
      });
      throw err;
    }
  },

  restoreSession: async () => {
    set({ isRestoring: false });
  },

  logout: async () => {
    tokenStore.clear();
    set({ ...INITIAL_STATE });
  },

  setUser:    (user) => set({ user, isAuthenticated: true }),
  clearError: ()     => set({ error: null }),
  setLoading: (v)    => set({ isLoading: v }),
}));

export const selectUser            = (s: AuthStore) => s.user;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;
export const selectIsAdmin         = (s: AuthStore) => s.user?.role === 'admin';
export const selectIsLoading       = (s: AuthStore) => s.isLoading;
export const selectAuthError       = (s: AuthStore) => s.error;