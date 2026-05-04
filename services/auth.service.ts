import { ApiClientError, tokenStore } from './api';
import type { User }                  from '@/types/auth.types';

export type LoginResponse = {
  user:  User;
  token: string;
};

export type SessionResponse = {
  user:  User;
  token: string;
};

function simulateUser(inviteCode: string): User {
  const isAdmin = inviteCode.startsWith('ad-');
  return {
    id:          `user-${inviteCode}`,
    firstName:   isAdmin ? 'Admin'       : 'James',
    lastName:    isAdmin ? 'User'        : 'Kiprotich',
    email:       isAdmin ? 'admin@inner.co' : 'james.k@meridian.co',
    role:        isAdmin ? 'admin'       : 'member',
    initials:    isAdmin ? 'AU'          : 'JK',
    color:       '#4A3F35',
    city:        isAdmin ? 'Remote'      : 'Nairobi',
    inviteCode,
    memberSince: 'May 2023',
    online:      true,
  };
}

export const authService = {

  loginWithInvite: async (inviteCode: string): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 600));

    if (inviteCode === 'invalid') {
      throw new ApiClientError({
        message:    'Invalid invite code.',
        statusCode: 401,
      });
    }

    const user  = simulateUser(inviteCode);
    const token = `mock-token-${inviteCode}-${Date.now()}`;

    return { user, token };
  },

  restoreSession: async (): Promise<SessionResponse | null> => {
    return null;
  },

  logout: async (): Promise<void> => {
    tokenStore.clear();
  },

  validateInviteCode: (code: string): boolean => {
    return code.trim().length >= 3;
  },
};