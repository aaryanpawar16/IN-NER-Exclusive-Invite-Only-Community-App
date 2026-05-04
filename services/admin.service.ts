import { api, buildQuery }    from './api';
import { APPLICATIONS }        from '@/constants/data';
import type { Application }    from '@/types/application.types';
import type { Member }         from '@/types/member.types';
import type { AdminApplicationTabKey } from '@/constants/filters';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type AdminStats = {
  totalMembers:       number;
  pendingCount:       number;
  approvedThisMonth:  number;
  acceptanceRate:     number;
  activeEvents:       number;
  newThisMonth:       number;
};

export type ApplicationsQuery = {
  status?:   AdminApplicationTabKey;
  search?:   string;
  page?:     number;
  pageSize?: number;
};

export type ApplicationsPage = {
  items:      Application[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};

export type ApplicationDecision = {
  applicationId: number;
  action:        'approve' | 'reject';
  note?:         string;
};

export type BroadcastPayload = {
  subject:   string;
  body:      string;
  memberIds?: number[];
};

// ─────────────────────────────────────────────────────────────────
// Admin service
// ─────────────────────────────────────────────────────────────────

export const adminService = {

  // ── Get dashboard stats ────────────────────────────────────
  getStats: async (): Promise<AdminStats> => {
    // In production:
    // const res = await api.get<AdminStats>('/admin/stats');
    // return res.data;

    await new Promise(res => setTimeout(res, 300));

    return {
      totalMembers:      1240,
      pendingCount:      APPLICATIONS.filter(a => a.status === 'pending').length,
      approvedThisMonth: 14,
      acceptanceRate:    12,
      activeEvents:      5,
      newThisMonth:      14,
    };
  },

  // ── List applications ──────────────────────────────────────
  listApplications: async (
    query: ApplicationsQuery = {}
  ): Promise<ApplicationsPage> => {
    // In production:
    // const qs = buildQuery({ ...query });
    // const res = await api.get<ApplicationsPage>(`/admin/applications${qs}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 300));

    const {
      status   = 'pending',
      search   = '',
      page     = 1,
      pageSize = 20,
    } = query;

    let list = APPLICATIONS.filter(a => a.status === status);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
      );
    }

    const total      = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const start      = (page - 1) * pageSize;
    const items      = list.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  },

  // ── Get application by id ──────────────────────────────────
  getApplication: async (id: number): Promise<Application | null> => {
    // In production:
    // const res = await api.get<Application>(`/admin/applications/${id}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 200));
    return APPLICATIONS.find(a => a.id === id) ?? null;
  },

  // ── Decide on application ──────────────────────────────────
  decide: async (payload: ApplicationDecision): Promise<Application> => {
    // In production:
    // const res = await api.post<Application>(
    //   `/admin/applications/${payload.applicationId}/decide`,
    //   { action: payload.action, note: payload.note }
    // );
    // return res.data;

    await new Promise(res => setTimeout(res, 500));

    const app = APPLICATIONS.find(a => a.id === payload.applicationId);
    if (!app) throw new Error('Application not found');

    return {
      ...app,
      status: payload.action === 'approve' ? 'approved' : 'rejected',
    };
  },

  // ── Remove member ──────────────────────────────────────────
  removeMember: async (memberId: number): Promise<void> => {
    // In production:
    // await api.delete(`/admin/members/${memberId}`);
    await new Promise(res => setTimeout(res, 400));
  },

  // ── Send broadcast ─────────────────────────────────────────
  sendBroadcast: async (payload: BroadcastPayload): Promise<void> => {
    // In production:
    // await api.post('/admin/broadcast', payload);
    await new Promise(res => setTimeout(res, 700));
  },

  // ── Export members CSV ─────────────────────────────────────
  exportMembers: async (): Promise<string> => {
    // In production:
    // const res = await api.get<{ url: string }>('/admin/members/export');
    // return res.data.url;

    await new Promise(res => setTimeout(res, 1000));

    const headers = ['Name', 'Role', 'City', 'Tags', 'Member Since', 'Status'];
    const rows = APPLICATIONS
      .filter(a => a.status === 'approved')
      .map(a => [
        `${a.firstName} ${a.lastName}`,
        a.role,
        a.city,
        a.interests.join('; '),
        a.appliedDate,
        a.status,
      ]);

    return [headers, ...rows]
      .map(r => r.map(v => `"${v}"`).join(','))
      .join('\n');
  },
};