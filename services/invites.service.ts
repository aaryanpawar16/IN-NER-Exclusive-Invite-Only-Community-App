import { api }                 from './api';
import { INVITE_BASE_URL }     from '@/constants/config';
import type { InviteRecord }   from '@/hooks/useInvites';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type SendInvitePayload = {
  email: string;
  note?: string;
};

export type InviteStats = {
  used:      number;
  remaining: number;
  total:     number;
  link:      string;
};

// ─────────────────────────────────────────────────────────────────
// Invites service
// ─────────────────────────────────────────────────────────────────

export const invitesService = {

  // ── Get invite stats for current user ─────────────────────
  getStats: async (): Promise<InviteStats> => {
    // In production:
    // const res = await api.get<InviteStats>('/invites/stats');
    // return res.data;

    await new Promise(res => setTimeout(res, 200));

    return {
      used:      2,
      remaining: 1,
      total:     3,
      link:      `${INVITE_BASE_URL}/jd-a9k2p`,
    };
  },

  // ── Get invite history ─────────────────────────────────────
  getHistory: async (): Promise<InviteRecord[]> => {
    // In production:
    // const res = await api.get<InviteRecord[]>('/invites/history');
    // return res.data;

    await new Promise(res => setTimeout(res, 200));

    return [
      { id: '1', email: 'alex.t@gmail.com',  date: 'Apr 10', status: 'approved' },
      { id: '2', email: 'maya.l@studio.co',  date: 'Mar 22', status: 'pending'  },
    ];
  },

  // ── Send invite ────────────────────────────────────────────
  send: async (payload: SendInvitePayload): Promise<InviteRecord> => {
    // In production:
    // const res = await api.post<InviteRecord>('/invites/send', payload);
    // return res.data;

    await new Promise(res => setTimeout(res, 800));

    // Simulate duplicate email error
    if (payload.email === 'taken@inner.co') {
      throw new Error('An invitation has already been sent to this address.');
    }

    return {
      id:     `invite-${Date.now()}`,
      email:  payload.email,
      date:   new Date().toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
      }),
      status: 'pending',
      note:   payload.note,
    };
  },

  // ── Regenerate invite link ─────────────────────────────────
  regenerateLink: async (): Promise<string> => {
    // In production:
    // const res = await api.post<{ link: string }>('/invites/regenerate', {});
    // return res.data.link;

    await new Promise(res => setTimeout(res, 500));
    const code = Math.random().toString(36).substring(2, 9);
    return `${INVITE_BASE_URL}/${code}`;
  },

  // ── Validate invite code (used on invite-entry screen) ─────
  validate: async (code: string): Promise<boolean> => {
    // In production:
    // const res = await api.post<{ valid: boolean }>('/invites/validate', { code });
    // return res.data.valid;

    await new Promise(res => setTimeout(res, 400));

    // Simulate invalid codes
    const invalid = ['invalid', '00-00000', 'xx-xxxxx'];
    return !invalid.includes(code.toLowerCase());
  },
};